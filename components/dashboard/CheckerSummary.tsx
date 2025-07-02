import { ScrollView, StyleSheet, Text, View } from 'react-native';

type CheckerData = {
  id: string;
  name: string;
  scanned: number;
  verified: number;
  rejected: number;
};

type CheckerSummaryProps = {
  checkers: CheckerData[];
  isLoading: boolean;
};

export function CheckerSummary({ checkers, isLoading }: CheckerSummaryProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando datos de checadores...</Text>
        </View>
      </View>
    );
  }

  if (!checkers || checkers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay información de checadores disponible</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.nameColumn]}>Checador</Text>
          <Text style={[styles.headerCell, styles.countColumn]}>Escan.</Text>
          <Text style={[styles.headerCell, styles.countColumn]}>Verif.</Text>
          <Text style={[styles.headerCell, styles.countColumn]}>Rechaz.</Text>
        </View>
        
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {checkers.map((checker, index) => (
            <View key={checker.id} style={[
              styles.row,
              index % 2 === 0 ? styles.evenRow : styles.oddRow
            ]}>
              <Text style={[styles.cell, styles.nameColumn]} numberOfLines={1}>
                {checker.name}
              </Text>
              <Text style={[styles.cell, styles.countColumn]}>{checker.scanned}</Text>
              <Text style={[styles.cell, styles.countColumn, styles.verifiedText]}>
                {checker.verified}
              </Text>
              <Text style={[styles.cell, styles.countColumn, styles.rejectedText]}>
                {checker.rejected}
              </Text>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Total checadores: {checkers.length}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  tableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    maxHeight: 400,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#021024',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C1E8FF',
  },
  scrollContainer: {
    maxHeight: 280,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(125, 160, 202, 0.1)',
  },
  evenRow: {
    backgroundColor: 'rgba(193, 232, 255, 0.05)',
  },
  oddRow: {
    backgroundColor: 'transparent',
  },
  cell: {
    fontSize: 14,
    color: '#021024',
    fontWeight: '500',
  },
  nameColumn: {
    flex: 2,
    paddingRight: 8,
  },
  countColumn: {
    flex: 1,
    textAlign: 'center',
  },
  verifiedText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  rejectedText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(125, 160, 202, 0.2)',
    backgroundColor: 'rgba(193, 232, 255, 0.1)',
  },
  footerText: {
    fontSize: 14,
    color: '#7DA0CA',
    fontWeight: '500',
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
  emptyContainer: {
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
  emptyText: {
    color: '#7DA0CA',
    fontSize: 16,
    fontWeight: '500',
  },
});