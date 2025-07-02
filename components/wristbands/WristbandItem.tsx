import { CircleCheck as CheckCircle, CircleDashed, Circle as XCircle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

type Wristband = {
  id: string;
  name: string;
  status: string;
  verifiedAt?: string;
  verifiedBy?: string;
};

type WristbandItemProps = {
  wristband: Wristband;
};

export function WristbandItem({ wristband }: WristbandItemProps) {
  const getStatusIcon = () => {
    switch (wristband.status) {
      case 'verified':
        return <CheckCircle size={24} color="#4CAF50" />;
      case 'rejected':
        return <XCircle size={24} color="#FF3B30" />;
      default:
        return <CircleDashed size={24} color="#7DA0CA" />;
    }
  };

  const getStatusText = () => {
    switch (wristband.status) {
      case 'verified':
        return 'Verificado';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  const getStatusColor = () => {
    switch (wristband.status) {
      case 'verified':
        return '#4CAF50';
      case 'rejected':
        return '#FF3B30';
      default:
        return '#7DA0CA';
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.id}>{wristband.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>{getStatusIcon()}</View>
        <View style={styles.details}>
          <Text style={styles.name}>{wristband.name}</Text>
          {wristband.status === 'verified' && (
            <View style={styles.verificationContainer}>
              <Text style={styles.verificationInfo}>
                Verificado: {formatDateTime(wristband.verifiedAt)}
              </Text>
              {wristband.verifiedBy && (
                <Text style={styles.verificationInfo}>
                  Por: {wristband.verifiedBy}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 24,
    marginVertical: 6,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  id: {
    fontSize: 16,
    fontWeight: '700',
    color: '#021024',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
    paddingTop: 2,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021024',
    marginBottom: 8,
  },
  verificationContainer: {
    backgroundColor: 'rgba(193, 232, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  verificationInfo: {
    fontSize: 12,
    color: '#052859',
    marginTop: 2,
    fontWeight: '500',
  },
});