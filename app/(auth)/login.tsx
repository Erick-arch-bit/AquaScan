import { AuthService } from '@/services/auth';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
        // Wait for notification to be visible before redirecting
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1000);
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
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>QR</Text>
        </View>
        <Text style={styles.appTitle}>QR Scanner</Text>
        <Text style={styles.subtitle}>Control de acceso y brazaletes</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Mail size={20} color="#7DA0CA" />
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
          <Lock size={20} color="#7DA0CA" />
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
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C1E8FF',
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#021024',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#C1E8FF',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#021024',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#052859',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(125, 160, 202, 0.3)',
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: 'rgba(193, 232, 255, 0.1)',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#021024',
    fontWeight: '500',
  },
  notification: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  successNotification: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  errorNotification: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
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
    color: '#FF3B30',
  },
  loginButton: {
    backgroundColor: '#021024',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#C1E8FF',
    fontSize: 18,
    fontWeight: '700',
  },
});