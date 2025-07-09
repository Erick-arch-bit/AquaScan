import { AuthService } from '@/services/auth';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setNotification({
        type: 'error',
        message: 'Por favor ingrese correo y contraseña'
      });
      return;
    }

    setNotification(null);
    setIsLoading(true);
    
    try {
      const result = await AuthService.login(email, password);
      if (result.success) {
        setNotification({
          type: 'success',
          message: result.message
        });
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 3000);
      } else {
        setNotification({
          type: 'error',
          message: result.message
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Error de conexión. Intente nuevamente.'
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fondo con gradiente simulado */}
      <View style={styles.backgroundGradient} />
      
      {/* Contenedor del logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }}
            style={styles.logoImage}
          />
        </View>
        <Text style={styles.appTitle}>Event Checker</Text>
        <Text style={styles.subtitle}>Control de acceso profesional</Text>
      </View>

      {/* Contenedor del formulario */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Iniciar Sesión</Text>
        
        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Mail size={20} color="#052859" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#7DA0CA"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Lock size={20} color="#052859" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#7DA0CA"
          />
        </View>

        {notification && (
          <View style={[
            styles.notification,
            notification.type === 'success' ? styles.successNotification : styles.errorNotification
          ]}>
            <Text style={[
              styles.notificationText,
              notification.type === 'success' ? styles.successText : styles.errorText
            ]}>
              {notification.message}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

      </View>

      {/* Información adicional */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Versión 1.0.0</Text>
        <Text style={styles.footerSubtext}>© 2024 Event Checker</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C1E8FF',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#052859',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 30,
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#021024',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: '#F0F8FF',
  },
  inputIconContainer: {
    padding: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingRight: 15,
    fontSize: 16,
    color: '#021024',
  },
  notification: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  successNotification: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  errorNotification: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  notificationText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  successText: {
    color: '#4CAF50',
  },
  errorText: {
    color: '#F44336',
  },
  loginButton: {
    backgroundColor: '#052859',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#052859',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  forgotPasswordButton: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#052859',
    fontSize: 14,
    fontWeight: '500',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingBottom: 30,
  },
  footerText: {
    color: '#7DA0CA',
    fontSize: 14,
    fontWeight: '500',
  },
  footerSubtext: {
    color: '#7DA0CA',
    fontSize: 12,
    marginTop: 4,
  },
});