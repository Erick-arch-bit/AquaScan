import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthService } from '@/services/auth';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Verificar autenticación al iniciar la aplicación
    const checkInitialAuth = async () => {
      try {
        await AuthService.isAuthenticated();
      } catch (error) {
        console.error('Error verificando autenticación inicial:', error);
      }
    };
    
    checkInitialAuth();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}