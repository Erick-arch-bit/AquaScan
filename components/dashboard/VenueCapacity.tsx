import { AlertCircle, AlertTriangle, TrendingUp } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

type VenueCapacityProps = {
  current: number;
  max: number;
  percentage: number;
  status: 'normal' | 'warning' | 'critical';
  statusText: string;
  isLoading: boolean;
};

export function VenueCapacity({ current, max, percentage, status, statusText, isLoading }: VenueCapacityProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'normal': return '#4CAF50';
      case 'warning': return '#FFA726';
      case 'critical': return '#FF3B30';
      default: return '#4CAF50';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'normal': return <TrendingUp size={16} color={getStatusColor()} />;
      case 'warning': return <AlertTriangle size={16} color={getStatusColor()} />;
      case 'critical': return <AlertCircle size={16} color={getStatusColor()} />;
      default: return <TrendingUp size={16} color={getStatusColor()} />;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando datos de capacidad...</Text>
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
            {getStatusIcon()}
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {statusText}
            </Text>
          </View>
        </View>

        {/* Medidor circular */}
        <View style={styles.circularGaugeContainer}>
          <View style={styles.circularGauge}>
            <View style={[styles.circularProgress, { 
              borderColor: getStatusColor(),
              transform: [{ rotate: `${(percentage / 100) * 360}deg` }]
            }]} />
            <View style={styles.circularInner}>
              <Text style={styles.percentageText}>{percentage}%</Text>
              <Text style={styles.percentageLabel}>Ocupación</Text>
            </View>
          </View>
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
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{max - current}</Text>
            <Text style={styles.statLabel}>Disponible</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 8,
  },
  capacityContainer: {
    backgroundColor: '#FFFFFF',
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
    marginBottom: 24,
  },
  capacityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021024',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  circularGaugeContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  circularGauge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circularProgress: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#4CAF50',
  },
  circularInner: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#021024',
    marginBottom: 4,
  },
  percentageLabel: {
    fontSize: 14,
    color: '#7DA0CA',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
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
    backgroundColor: '#E0E8F0',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
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