import { AuthService } from '@/services/auth';
import { Tabs, useRouter } from 'expo-router';
import { ChartBar as BarChart3, QrCode, Users } from 'lucide-react-native';
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
  }, []);

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
        tabBarActiveTintColor: '#C1E8FF',
        tabBarInactiveTintColor: '#7DA0CA',
        tabBarStyle: styles.tabBar,
        headerShown: route.name !== 'scanner', // Hide header only for scanner
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerLeft: () => (
          <View style={styles.userContainer}>
            <Text style={styles.greeting}>Hola,</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {userEmail ? userEmail.split('@')[0] : 'Usuario'}
            </Text>
          </View>
        ),
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
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#021024',
    borderTopColor: 'transparent',
    height: 80,
    paddingBottom: 20,
    paddingTop: 12,
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
  },
  header: {
    backgroundColor: '#021024',
    shadowColor: 'transparent',
    elevation: 0,
    height: 100,
    borderBottomWidth: 0,
  },
  headerTitle: {
    color: '#C1E8FF',
    fontSize: 20,
    fontWeight: '600',
  },
  userContainer: {
    marginLeft: 20,
    justifyContent: 'center',
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
    marginRight: 20,
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
});