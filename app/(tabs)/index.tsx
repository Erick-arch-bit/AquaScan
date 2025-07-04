import { CheckerSummary } from '@/components/dashboard/CheckerSummary';
import { VenueCapacity } from '@/components/dashboard/VenueCapacity';
import { ApiService } from '@/services/api';
import { RefreshCw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const [capacity, setCapacity] = useState({
    current: 0,
    max: 0,
    percentage: 0,
  });
  const [checkers, setCheckers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const capacityData = await ApiService.getVenueCapacity();
      const checkersData = await ApiService.getCheckersSummary();
      
      setCapacity(capacityData);
      setCheckers(checkersData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
    loadData();

    // Set up polling for real-time updates
    const intervalId = setInterval(loadData, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Estado del Venue</Text>
          <TouchableOpacity onPress={onRefresh} disabled={isLoading} style={styles.refreshButton}>
            <RefreshCw size={20} color="#7DA0CA" />
          </TouchableOpacity>
        </View>

        <VenueCapacity 
          current={capacity.current} 
          max={capacity.max} 
          percentage={capacity.percentage} 
          isLoading={isLoading} 
        />

        <Text style={styles.sectionTitle}>Resumen por Checador</Text>
        
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#021024',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#021024',
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  bottomSpacing: {
    height: 100,
  },
});