import { CheckerSummary } from '@/components/dashboard/CheckerSummary';
import { VenueCapacity } from '@/components/dashboard/VenueCapacity';
import { ApiService } from '@/services/api';
import { AuthService } from '@/services/auth';
import { Clock, RefreshCw, TrendingUp, Users } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CapacityStatus = 'normal' | 'warning' | 'critical';

interface CapacityData {
  current: number;
  max: number;
  percentage: number;
  status: CapacityStatus;
  lastUpdated: string;
}

interface Checker {
  id: string;
  name: string;
  scanned: number;
  verified: number;
  rejected: number;
  lastActivity: string;
}

export default function DashboardScreen() {
  const [capacity, setCapacity] = useState<CapacityData>({
    current: 0,
    max: 0,
    percentage: 0,
    status: 'normal',
    lastUpdated: ''
  });
  const [checkers, setCheckers] = useState<Checker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [capacityData, checkersData] = await Promise.all([
        ApiService.getVenueCapacity(),
        ApiService.getCheckersSummary()
      ]);
      
      setCapacity(capacityData || {
        current: 0,
        max: 0,
        percentage: 0,
        status: 'normal',
        lastUpdated: ''
      });
      setCheckers(checkersData || []);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const email = await AuthService.getUserEmail();
        setUserEmail(email);
      } catch (error) {
        console.error('Error cargando datos de usuario:', error);
      }
    };
    
    loadUserData();
    loadData();

    const intervalId = setInterval(loadData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const getUserName = (email: string | null) => {
    if (!email) return 'Usuario';
    return email.split('@')[0]
      .replace('.', ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (): string => {
    switch (capacity.status) {
      case 'normal': return '#4CAF50';
      case 'warning': return '#FFA726';
      case 'critical': return '#FF3B30';
      default: return '#4CAF50';
    }
  };

  const getStatusText = (): string => {
    switch (capacity.status) {
      case 'normal': return 'Normal';
      case 'warning': return 'Atención';
      case 'critical': return 'Crítico';
      default: return 'Normal';
    }
  };

  const totalScanned = checkers.reduce((sum, checker) => sum + (checker.scanned || 0), 0);
  const totalVerified = checkers.reduce((sum, checker) => sum + (checker.verified || 0), 0);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#052859"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.venueTitle}>Balneario Xolotl</Text>
            <Text style={styles.userGreeting}>
              Hola, {getUserName(userEmail)}
            </Text>
            {lastUpdate && (
              <View style={styles.lastUpdateContainer}>
                <Clock size={12} color="#7DA0CA" />
                <Text style={styles.lastUpdateText}>
                  Última actualización: {lastUpdate}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            onPress={onRefresh} 
            disabled={isLoading || refreshing} 
            style={styles.refreshButton}
          >
            <RefreshCw 
              size={20} 
              color="#052859" 
              style={isLoading || refreshing ? styles.refreshingIcon : undefined} 
            />
          </TouchableOpacity>
        </View>

        {/* Tarjetas de estadísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Users size={24} color="#052859" />
            </View>
            <Text style={styles.statValue}>{totalScanned}</Text>
            <Text style={styles.statLabel}>Total Escaneados</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={24} color="#4CAF50" />
            </View>
            <Text style={styles.statValue}>{totalVerified}</Text>
            <Text style={styles.statLabel}>Verificados</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <RefreshCw size={24} color="#7DA0CA" />
            </View>
            <Text style={styles.statValue}>{checkers.length}</Text>
            <Text style={styles.statLabel}>Verificadores</Text>
          </View>
        </View>

        {/* Estado del venue */}
        <View style={styles.statusContainer}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Estado del Venue</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusBadgeText}>{getStatusText()}</Text>
            </View>
          </View>
        </View>

        <VenueCapacity 
          current={capacity.current} 
          max={capacity.max} 
          percentage={capacity.percentage} 
          isLoading={isLoading} 
        />

        <Text style={styles.sectionTitle}>Resumen por Verificador</Text>
        
        <CheckerSummary checkers={checkers} isLoading={isLoading} />
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C1E8FF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  titleSection: {
    flex: 1,
  },
  venueTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#021024',
    marginBottom: 4,
  },
  userGreeting: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7DA0CA',
    marginBottom: 8,
  },
  lastUpdateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#7DA0CA',
  },
  refreshButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    marginTop: 4,
  },
  refreshingIcon: {
    opacity: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#021024',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7DA0CA',
    textAlign: 'center',
    fontWeight: '500',
  },
  statusContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#021024',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#021024',
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    height: 120,
  },
});