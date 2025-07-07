import { ApiService } from '@/services/api';
import { AuthService } from '@/services/auth';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChartBar as BarChart3, CircleCheck as CheckCircle, QrCode, Circle as XCircle } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type VerificationResult = 'success' | 'error' | null;

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult>(null);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  const router = useRouter();

  // Handle tab focus/unfocus to manage camera lifecycle
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      
      const activate = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (isActive) {
          setIsCameraActive(true);
          inputRef.current?.focus();
        }
      };

      activate();

      return () => {
        isActive = false;
        setIsCameraActive(false);
        setScanned(false);
        setQrData('');
        setModalVisible(false);
      };
    }, [])
  );

  useEffect(() => {
    // Load user data
    const loadUserData = async () => {
      const email = await AuthService.getUserEmail();
      setUserEmail(email);
    };
    loadUserData();
  }, []);

  // Animate the scan button
  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    
    if (isCameraActive) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    }

    return () => {
      animation?.stop();
    };
  }, [isCameraActive, scaleAnim]);

  // Animation for the verification modal
  useEffect(() => {
    if (modalVisible) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      opacityAnim.setValue(0);
    }
  }, [modalVisible, opacityAnim]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || !isCameraActive) return;
    
    setScanned(true);
    setQrData(data);
    await verifyQrCode(data);
  };

  const handleManualEntry = (text: string) => {
    setQrData(text);
  };

  const verifyQrCode = async (data: string) => {
    try {
      if (!data.trim()) {
        throw new Error('Código vacío');
      }

      const result = await ApiService.verifyWristband(data);
      
      if (result.valid) {
        setVerificationResult('success');
        setVerificationMessage(result.message || 'Brazalete verificado correctamente.');
      } else {
        setVerificationResult('error');
        setVerificationMessage(result.message || 'Brazalete no válido o ya escaneado.');
      }
      
      setModalVisible(true);

      // Auto-close after 3 seconds
      setTimeout(() => {
        closeModal();
      }, 3000);

    } catch (error) {
      console.error('Error verifying QR code:', error);
      setVerificationResult('error');
      setVerificationMessage(
        error instanceof Error 
          ? error.message 
          : 'Error de conexión. Intente nuevamente.'
      );
      setModalVisible(true);
    }
  };

  const handleVerifyPress = async () => {
    if (!qrData) return;
    await verifyQrCode(qrData);
  };

  const closeModal = () => {
    setModalVisible(false);
    setScanned(false);
    setQrData('');
    setTimeout(() => {
      if (isCameraActive) {
        inputRef.current?.focus();
      }
    }, 100);
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleDashboardPress = () => {
    router.push('/(tabs)');
  };

  const getInitials = (email: string | null) => {
    if (!email) return 'U';
    const [firstPart] = email.split('@');
    const parts = firstPart.split('.');
    return parts.length >= 2 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : firstPart[0].toUpperCase();
  };

  const userName = useMemo(
    () => userEmail?.split('@')[0] || 'Usuario',
    [userEmail]
  );

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <QrCode size={64} color="#C1E8FF" />
          <Text style={styles.permissionTitle}>Acceso a Cámara</Text>
          <Text style={styles.permissionText}>
            Necesitamos acceso a la cámara para escanear los códigos QR de los brazaletes
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Permitir Acceso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {userName}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleDashboardPress} style={styles.headerButton}>
            <BarChart3 size={24} color="#C1E8FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{getInitials(userEmail)}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera Container */}
      <View style={styles.cameraContainer}>
        {isCameraActive && (
          <CameraView
            style={styles.camera}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
        )}
        
        {/* Overlay positioned absolutely over the camera */}
        <View style={styles.overlay}>
          <View style={styles.topSection}>
            <Text style={styles.instructionTitle}>Escanear Brazalete</Text>
            <Text style={styles.instructionText}>
              {isCameraActive 
                ? 'Alinee el código QR dentro del área de escaneo'
                : 'Activando cámara...'
              }
            </Text>
          </View>
          
          <View style={styles.scanArea}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
            {isCameraActive && <View style={styles.scanLine} />}
          </View>
          
          <View style={styles.bottomSection} />
        </View>
      </View>

      {/* Hidden input to capture scanner data */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={qrData}
        onChangeText={handleManualEntry}
        autoCorrect={false}
        autoCapitalize="none"
      />

      <View style={styles.buttonContainer}>
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity
            style={[
              styles.verifyButton, 
              qrData ? styles.verifyButtonActive : null,
              !isCameraActive && styles.verifyButtonDisabled
            ]}
            onPress={handleVerifyPress}
            disabled={!qrData || !isCameraActive}
          >
            <QrCode size={24} color="#fff" />
            <Text style={styles.verifyButtonText}>
              {!isCameraActive 
                ? 'Activando Cámara...'
                : qrData 
                  ? 'Verificar Código' 
                  : 'Esperando Código QR'
              }
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Verification Result Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { opacity: opacityAnim },
              verificationResult === 'success' ? styles.successModal : styles.errorModal
            ]}
          >
            {verificationResult === 'success' ? (
              <CheckCircle size={64} color="#fff" />
            ) : (
              <XCircle size={64} color="#fff" />
            )}
            <Text style={styles.modalTitle}>
              {verificationResult === 'success' ? 'Verificado' : 'Error'}
            </Text>
            <Text style={styles.modalMessage}>{verificationMessage}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
              {verificationResult === 'success' && (
                <TouchableOpacity 
                  style={[styles.modalButton, styles.dashboardButton]} 
                  onPress={() => {
                    closeModal();
                    handleDashboardPress();
                  }}
                >
                  <Text style={styles.modalButtonText}>Ver Dashboard</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021024',
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#021024',
    zIndex: 10,
  },
  headerLeft: {
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(125, 160, 202, 0.2)',
  },
  greeting: {
    color: '#7DA0CA',
    fontSize: 14,
    fontWeight: '400',
  },
  userName: {
    color: '#C1E8FF',
    fontSize: 18,
    fontWeight: '600',
    maxWidth: 200,
  },
  profileButton: {
    padding: 4,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#052859',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7DA0CA',
  },
  avatarText: {
    color: '#C1E8FF',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2, 16, 36, 0.7)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  instructionTitle: {
    color: '#C1E8FF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionText: {
    color: '#7DA0CA',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  scanArea: {
    width: 280,
    height: 280,
    borderRadius: 24,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#C1E8FF',
    borderTopLeftRadius: 24,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#C1E8FF',
    borderTopRightRadius: 24,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#C1E8FF',
    borderBottomLeftRadius: 24,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#C1E8FF',
    borderBottomRightRadius: 24,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#C1E8FF',
    opacity: 0.8,
    transform: [{ translateY: -1 }],
  },
  bottomSection: {
    height: 60,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(125, 160, 202, 0.8)',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  verifyButtonActive: {
    backgroundColor: '#052859',
  },
  verifyButtonDisabled: {
    backgroundColor: 'rgba(125, 160, 202, 0.5)',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#C1E8FF',
    textAlign: 'center',
    marginTop: 100,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#021024',
    paddingHorizontal: 32,
  },
  permissionContent: {
    alignItems: 'center',
    backgroundColor: '#052859',
    padding: 32,
    borderRadius: 24,
    width: '100%',
    maxWidth: 320,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#C1E8FF',
    marginTop: 16,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#7DA0CA',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#C1E8FF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#021024',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 16, 36, 0.9)',
  },
  modalContent: {
    width: '80%',
    maxWidth: 320,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#4CAF50',
  },
  errorModal: {
    backgroundColor: '#FF3B30',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  modalMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
  },
  dashboardButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});