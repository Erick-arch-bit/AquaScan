import { Circle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

type VenueCapacityProps = {
  current: number;
  max: number;
  percentage: number;
  isLoading: boolean;
};

export function VenueCapacity({ current, max, percentage, isLoading }: VenueCapacityProps) {
  const getStatusColor = () => {
    if (percentage < 70) return '#4CAF50';
    if (percentage < 90) return '#FFA726';
    return '#EF5350';
  };

  const getStatusText = () => {
    if (percentage < 70) return 'Aforo Normal';
    if (percentage < 90) return 'Aforo Elevado';
    return 'Aforo Crítico';
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.capacityContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.capacityTitle}>Capacidad Actual</Text>
          <View style={styles.statusContainer}>
            <Circle size={12} color={getStatusColor()} fill={getStatusColor()} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeBackground} />
          <View 
            style={[
              styles.gaugeFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: getStatusColor() 
              }
            ]} 
          />
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{current}</Text>
            <Text style={styles.statLabel}>Actual</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{max}</Text>
            <Text style={styles.statLabel}>Capacidad</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginTop: 8,
  },
  capacityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  capacityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021024',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(193, 232, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  gaugeContainer: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(193, 232, 255, 0.3)',
    borderRadius: 20,
    marginVertical: 20,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  gaugeBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(193, 232, 255, 0.3)',
  },
  gaugeFill: {
    position: 'absolute',
    height: '100%',
    left: 0,
    top: 0,
    borderRadius: 20,
  },
  percentageText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#021024',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#021024',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#7DA0CA',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(125, 160, 202, 0.3)',
  },
  loadingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  loadingText: {
    color: '#7DA0CA',
    fontSize: 16,
    fontWeight: '500',
  },
});