import { WristbandItem } from '@/components/wristbands/WristbandItem';
import { ApiService } from '@/services/api';
import { Search } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type WristbandStatus = 'all' | 'verified' | 'pending';
interface Wristband {
  id: string;
  name: string;
  status: 'verified' | 'pending';
  // Agrega otras propiedades según sea necesario
}

export default function WristbandsScreen() {
  const [wristbands, setWristbands] = useState<Wristband[]>([]);
  const [filteredWristbands, setFilteredWristbands] = useState<Wristband[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<WristbandStatus>('all');

  const applyFilters = useCallback((data: Wristband[], query: string, status: WristbandStatus) => {
    let filtered = [...data];
    
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter(item => 
        item.id.toLowerCase().includes(lowerCaseQuery) || 
        (item.name && item.name.toLowerCase().includes(lowerCaseQuery))
      );
    }
    
    if (status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
    }
    
    setFilteredWristbands(filtered);
  }, []);

  const loadWristbands = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getWristbands();
      setWristbands(data);
      applyFilters(data, searchQuery, filterStatus);
    } catch (error) {
      console.error('Error loading wristbands:', error);
      setWristbands([]);
      setFilteredWristbands([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, filterStatus, applyFilters]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWristbands();
  }, [loadWristbands]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    applyFilters(wristbands, text, filterStatus);
  }, [wristbands, filterStatus, applyFilters]);

  const handleFilterChange = useCallback((status: WristbandStatus) => {
    setFilterStatus(status);
    applyFilters(wristbands, searchQuery, status);
  }, [wristbands, searchQuery, applyFilters]);

  useEffect(() => {
    loadWristbands();
  }, [loadWristbands]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#7DA0CA" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar brazalete..."
            placeholderTextColor="#7DA0CA"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por:</Text>
        <View style={styles.filterButtons}>
          {(['all', 'verified', 'pending'] as WristbandStatus[]).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton, 
                filterStatus === status && styles.filterButtonActive
              ]}
              onPress={() => handleFilterChange(status)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterButtonText,
                filterStatus === status && styles.filterButtonTextActive
              ]}>
                {status === 'all' ? 'Todos' : status === 'verified' ? 'Verificados' : 'Pendientes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Wristbands List */}
      <FlatList
        data={filteredWristbands}
        renderItem={({ item }) => <WristbandItem wristband={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredWristbands.length === 0 && styles.emptyListContent
        ]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#052859']}
            tintColor="#052859"
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Cargando brazaletes...' : 'No se encontraron brazaletes'}
            </Text>
          </View>
        }
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C1E8FF',
  },
  searchContainer: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: '#C1E8FF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#021024',
  },
  filterContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#C1E8FF',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#021024',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  filterButtonActive: {
    backgroundColor: '#052859',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#021024',
  },
  filterButtonTextActive: {
    color: '#C1E8FF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7DA0CA',
    textAlign: 'center',
  },
});