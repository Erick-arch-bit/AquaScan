import { WristbandItem } from '@/components/wristbands/WristbandItem';
import { ApiService } from '@/services/api';
import { Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function WristbandsScreen() {
  const [wristbands, setWristbands] = useState([]);
  const [filteredWristbands, setFilteredWristbands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'verified', 'pending'

  const loadWristbands = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getWristbands();
      setWristbands(data);
      applyFilters(data, searchQuery, filterStatus);
    } catch (error) {
      console.error('Error loading wristbands:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWristbands();
  };

  const applyFilters = (data, query, status) => {
    let filtered = data;
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(item => 
        item.id.toLowerCase().includes(query.toLowerCase()) || 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
    }
    
    setFilteredWristbands(filtered);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFilters(wristbands, text, filterStatus);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    applyFilters(wristbands, searchQuery, status);
  };

  useEffect(() => {
    loadWristbands();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#7DA0CA" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar brazalete..."
            placeholderTextColor="#7DA0CA"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'all' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={[styles.filterButtonText, filterStatus === 'all' && styles.filterButtonTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'verified' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('verified')}
          >
            <Text style={[styles.filterButtonText, filterStatus === 'verified' && styles.filterButtonTextActive]}>
              Verificados
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === 'pending' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('pending')}
          >
            <Text style={[styles.filterButtonText, filterStatus === 'pending' && styles.filterButtonTextActive]}>
              Pendientes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredWristbands}
        renderItem={({ item }) => <WristbandItem wristband={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Cargando brazaletes...' : 'No se encontraron brazaletes'}
            </Text>
          </View>
        }
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
    paddingVertical: 8,
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