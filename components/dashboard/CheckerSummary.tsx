import { Clock, TrendingUp, User } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type CheckerData = {
  id: string;
  name: string;
  scanned: number;
  verified: number;
  rejected: number;
  efficiency: number;
  lastActivity: string;
};

type CheckerSummaryProps = {
  checkers: CheckerData[];
  isLoading: boolean;
};

export function CheckerSummary({ checkers, isLoading }: CheckerSummaryProps) {
  const formatLastActivity = (timestamp: string) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Ahora';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h`;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return '#4CAF50';
    if (efficiency >= 90) return '#FF9800';
    return '#F44336';
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando datos de verificadores...</Text>
        </View>
      </View>
    );
  }

  if (!checkers || checkers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <User size={48} color="#CCC" />
          <Text style={styles.emptyText}>No hay información de verificadores disponible</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        {/* Encabezado de la tabla */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.nameColumn]}>Verificador</Text>
          <Text style={[styles.headerCell, styles.countColumn]}>Escan.</Text>
          <Text style={[styles.headerCell, styles.countColumn]}>Verif.</Text>
          <Text style={[styles.headerCell, styles.countColumn]}>Efic.</Text>
          <Text style={[styles.headerCell, styles.countColumn]}>Últ.</Text>
        </View>
        
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {checkers.map((checker, index) => (
            <View key={checker.id} style={[
              styles.row,
              index % 2 === 0 ? styles.evenRow : styles.oddRow
            ]}>
              <View style={[styles.cell, styles.nameColumn]}>
                <View style={styles.checkerInfo}>
                  <View style={styles.checkerAvatar}>
                    <Text style={styles.checkerInitials}>
                      {checker.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </Text>
                  </View>
                  <View style={styles.checkerDetails}>
                    <Text style={styles.checkerName} numberOfLines={1}>
                      {checker.name}
                    </Text>
                    <View style={styles.activityContainer}>
                      <Clock size={10} color="#999" />
                      <Text style={styles.activityText}>
                        {formatLastActivity(checker.lastActivity)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <Text style={[styles.cell, styles.countColumn]}>{checker.scanned}</Text>
              
              <Text style={[styles.cell, styles.countColumn, styles.verifiedText]}>
                {checker.verified}
              </Text>
              
              <View style={[styles.cell, styles.countColumn, styles.efficiencyContainer]}>
                <Text style={[
                  styles.efficiencyText, 
                  { color: getEfficiencyColor(checker.efficiency) }
                ]}>
                  {checker.efficiency.toFixed(1)}%
                </Text>
              </View>
              
              <Text style={[styles.cell, styles.countColumn, styles.rejectedText]}>
                {checker.rejected}
              </Text>
            </View>
          ))}
        </ScrollView>
        
        {/* Pie de tabla con estadísticas */}
        <View style={styles.footer}>
          <View style={styles.footerStats}>
            <View style={styles.footerStat}>
              <TrendingUp size={16} color="#4CAF50" />
              <Text style={styles.footerStatText}>
                {checkers.length} verificadores activos
              </Text>
            </View>
            <View style={styles.footerStat}>
              <User size={16} color="#2196F3" />
              <Text style={styles.footerStatText}>
                {checkers.reduce((sum, c) => sum + c.scanned, 0)} total escaneados
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    maxHeight: 450,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#FF6B47',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContainer: {
    maxHeight: 320,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  evenRow: {
    backgroundColor: '#FAFAFA',
  },
  oddRow: {
    backgroundColor: '#FFFFFF',
  },
  cell: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  nameColumn: {
    flex: 3,
    paddingRight: 8,
  },
  countColumn: {
    flex: 1,
    textAlign: 'center',
  },
  checkerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B47',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkerInitials: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  checkerDetails: {
    flex: 1,
  },
  checkerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityText: {
    fontSize: 11,
    color: '#999',
  },
  verifiedText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  rejectedText: {
    color: '#F44336',
    fontWeight: '600',
  },
  efficiencyContainer: {
    alignItems: 'center',
  },
  efficiencyText: {
    fontWeight: '600',
    fontSize: 13,
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  footerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerStatText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
  },
});