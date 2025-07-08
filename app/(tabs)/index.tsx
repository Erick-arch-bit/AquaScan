import { CheckerSummary } from '@/components/dashboard/CheckerSummary';
import { VenueCapacity } from '@/components/dashboard/VenueCapacity';
import { ApiService } from '@/services/api';
import { AuthService } from '@/services/auth';
import { Clock, RefreshCw, TrendingUp, Users } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const [capacity, setCapacity] = useState({
    current: 0,
    max: 0,
    percentage: 0,
    status: 'normal' as const,
    lastUpdated: ''
  });
  const [checkers, setCheckers] = useState([]);
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
      
      setCapacity(capacityData);
      setCheckers(checkersData);
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
    // Cargar datos del usuario
    const loadUserData = async () => {
      const email = await AuthService.getUserEmail();
      setUserEmail(email);
    };
    
    loadUserData();
    loadData();

    // Configurar polling para actualizaciones en tiempo real
    const intervalId = setInterval(loadData, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(intervalId);
  }, []);

  const getUserName = (email: string | null) => {
    if (!email) return 'Usuario';
    return email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = () => {
    switch (capacity.status) {
      case 'normal': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'critical': return '#F44336';
      default: return '#4CAF50';
    }
  };

  const getStatusText = () => {
    switch (capacity.status) {
      case 'normal': return 'Normal';
      case 'warning': return 'Atención';
      case 'critical': return 'Crítico';
      default: return 'Normal';
    }
  };

  const totalScanned = checkers.reduce((sum: number, checker: any) => sum + checker.scanned, 0);
  const totalVerified = checkers.reduce((sum: number, checker: any) => sum + checker.verified, 0);
  const averageEfficiency = checkers.length > 0 
    ? checkers.reduce((sum: number, checker: any) => sum + checker.efficiency, 0) / checkers.length 
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
                <Clock size={12} color="#666" />
                <Text style={styles.lastUpdateText}>
                  Última actualización: {lastUpdate}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={onRefresh} disabled={isLoading} style={styles.refreshButton}>
            <RefreshCw size={20} color="#FF6B47" />
          </TouchableOpacity>
        </View>

        {/* Tarjetas de estadísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Users size={24} color="#FF6B47" />
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
              <RefreshCw size={24} color="#2196F3" />
            </View>
            <Text style={styles.statValue}>{averageEfficiency.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Eficiencia Promedio</Text>
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
    backgroundColor: '#F8F9FA',
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
    shadowColor: '#000',
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
    color: '#333',
    marginBottom: 4,
  },
  userGreeting: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  lastUpdateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#666',
  },
  refreshButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginTop: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
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
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
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
    color: '#333',
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    height: 120,
  },
});