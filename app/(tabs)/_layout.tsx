import { AuthService } from '@/services/auth';
import { Tabs, useRouter } from 'expo-router';
import { BarChart3, QrCode, Users } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await AuthService.isAuthenticated();
      if (!isAuthenticated) {
        router.replace('/(auth)/login');
      } else {
        const email = await AuthService.getUserEmail();
        setUserEmail(email);
      }
    };

    checkAuth();
  }, [router]);

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const getInitials = (email: string | null) => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email[0].toUpperCase();
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: styles.tabBar,
        headerShown: route.name !== 'scanner', // Ocultar encabezado solo para scanner
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: '#FFFFFF',
        headerRight: () => (
          <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{getInitials(userEmail)}</Text>
            </View>
          </TouchableOpacity>
        ),
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wristbands"
        options={{
          title: 'Brazaletes',
          tabBarLabel: 'Brazaletes',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Escáner',
          tabBarLabel: 'Escáner',
          tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Ocultar de la barra de pestañas
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FF6B47',
    borderTopColor: 'transparent',
    height: 85,
    paddingBottom: 25,
    paddingTop: 15,
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    position: 'absolute',
  },
  header: {
    backgroundColor: '#FF6B47',
    shadowColor: 'transparent',
    elevation: 0,
    height: 100,
    borderBottomWidth: 0,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  profileButton: {
    marginRight: 20,
    padding: 4,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});