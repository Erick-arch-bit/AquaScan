import { AuthService } from '@/services/auth';
import { useRouter } from 'expo-router';
import { ArrowLeft, HelpCircle, Info, LogOut, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const loadUserData = async () => {
      const email = await AuthService.getUserEmail();
      setUserEmail(email);
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            const result = await AuthService.logout();
            if (result.success) {
              router.replace('/(auth)/login');
            }
            setIsLoading(false);
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Acerca de QR Scanner',
      'Versión 1.0.0\n\nAplicación de control de acceso y verificación de brazaletes para eventos.\n\nDesarrollado para gestión eficiente de entradas y capacidad de venues.',
      [{ text: 'OK' }]
    );
  };

  const handleContact = () => {
    Alert.alert(
      'Contacto y Soporte',
      'Para reportar errores o solicitar soporte:\n\n📧 soporte@qrscanner.com\n📱 +1 (555) 123-4567\n\n¿Encontraste un bug? Envíanos los detalles y te ayudaremos a resolverlo.',
      [{ text: 'OK' }]
    );
  };

  const getInitials = (email: string | null) => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const getUserName = (email: string | null) => {
    if (!email) return 'Usuario';
    return email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#C1E8FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{getInitials(userEmail)}</Text>
          </View>
          <Text style={styles.userNameLarge}>{getUserName(userEmail)}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          <View style={styles.roleBadge}>
            <Shield size={16} color="#C1E8FF" />
            <Text style={styles.roleText}>Verificador</Text>
          </View>
        </View>

        {/* Menu Cards */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuCard} onPress={handleAbout}>
            <View style={styles.menuIconContainer}>
              <Info size={24} color="#7DA0CA" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Acerca de</Text>
              <Text style={styles.menuSubtitle}>Información de la aplicación y versión</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={handleContact}>
            <View style={styles.menuIconContainer}>
              <HelpCircle size={24} color="#7DA0CA" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Soporte</Text>
              <Text style={styles.menuSubtitle}>Contacto para errores y ayuda</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuCard, styles.logoutCard]} 
            onPress={handleLogout}
            disabled={isLoading}
          >
            <View style={[styles.menuIconContainer, styles.logoutIconContainer]}>
              <LogOut size={24} color="#FF6B6B" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, styles.logoutTitle]}>Cerrar Sesión</Text>
              <Text style={styles.menuSubtitle}>Salir de la aplicación</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>QR Scanner v1.0.0</Text>
          <Text style={styles.appInfoSubtext}>Control de acceso profesional</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021024',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#021024',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#C1E8FF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  userSection: {
    backgroundColor: '#021024',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#052859',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#7DA0CA',
    marginBottom: 20,
  },
  avatarLargeText: {
    color: '#C1E8FF',
    fontSize: 36,
    fontWeight: '600',
  },
  userNameLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: '#C1E8FF',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#7DA0CA',
    marginBottom: 16,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#052859',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7DA0CA',
  },
  roleText: {
    color: '#C1E8FF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  menuSection: {
    padding: 20,
    gap: 16,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutCard: {
    borderWidth: 1,
    borderColor: '#FFE5E5',
    backgroundColor: '#FFFAFA',
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutIconContainer: {
    backgroundColor: '#FFE5E5',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#021024',
    marginBottom: 4,
  },
  logoutTitle: {
    color: '#FF6B6B',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#7DA0CA',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#052859',
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 14,
    color: '#7DA0CA',
  },
});