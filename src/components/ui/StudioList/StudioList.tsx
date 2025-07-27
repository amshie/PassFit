import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFilteredStudios, useDistanceCalculator } from '../../../hooks/useStudio';
import { Studio, StudioFilters } from '../../../models/studio';
import { StudioCard } from '../StudioCard';
import { FilterModal } from '../FilterModal';
import { Loading, StudioListSkeleton } from '../Loading';

interface StudioListProps {
  userLocation?: { lat: number; lng: number };
  onStudioSelect?: (studio: Studio) => void;
  showFilters?: boolean;
  initialFilters?: StudioFilters;
}

export const StudioList: React.FC<StudioListProps> = ({
  userLocation,
  onStudioSelect,
  showFilters = true,
  initialFilters = {},
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [filters, setFilters] = useState<StudioFilters>(initialFilters);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { calculateDistance, formatDistance } = useDistanceCalculator();

  const {
    data: studios = [],
    isLoading,
    error,
    refetch,
  } = useFilteredStudios(
    userLocation?.lat,
    userLocation?.lng,
    {
      ...filters,
      searchTerm,
    }
  );

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const handleApplyFilters = (newFilters: StudioFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const getStudioDistance = (studio: Studio): number | null => {
    if (!userLocation || !studio.location) return null;
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      studio.location.lat,
      studio.location.lng
    );
  };

  const renderStudioItem = ({ item: studio }: { item: Studio }) => {
    const distance = getStudioDistance(studio);
    
    return (
      <StudioCard
        studio={studio}
        distance={distance ? formatDistance(distance) : undefined}
        onPress={() => onStudioSelect?.(studio)}
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('studios.searchPlaceholder')}
          value={searchTerm}
          onChangeText={handleSearch}
          returnKeyType="search"
          accessible={true}
          accessibilityLabel={t('accessibility.searchStudios')}
          accessibilityHint="Geben Sie Suchbegriffe ein um Studios zu finden"
        />
      </View>
      
      {showFilters && (
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
            accessible={true}
            accessibilityLabel={t('accessibility.filterStudios')}
            accessibilityHint="Filter-Optionen öffnen"
          >
            <Text style={styles.filterButtonText}>{t('common.filter')}</Text>
          </TouchableOpacity>
          
          {(Object.keys(filters).length > 0 || searchTerm) && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearFilters}
              accessible={true}
              accessibilityLabel={t('common.reset')}
              accessibilityHint="Alle Filter zurücksetzen"
            >
              <Text style={styles.clearButtonText}>{t('common.reset')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {t('studios.found', { count: studios.length })}
        </Text>
        <TouchableOpacity 
          onPress={() => refetch()}
          accessible={true}
          accessibilityLabel={t('accessibility.refreshStudios')}
          accessibilityHint="Studios neu laden"
        >
          <Text style={styles.refreshText}>{t('common.refresh')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View 
      style={styles.emptyState}
      accessible={true}
      accessibilityLabel={t('studios.noStudiosFound')}
    >
      <Text style={styles.emptyStateTitle}>{t('studios.noStudiosFound')}</Text>
      <Text style={styles.emptyStateText}>
        {t('studios.tryOtherTerms')}
      </Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={() => refetch()}
        accessible={true}
        accessibilityLabel={t('common.retry')}
        accessibilityHint="Studios neu laden"
      >
        <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
      </TouchableOpacity>
    </View>
  );

  if (error) {
    return (
      <View 
        style={styles.errorContainer}
        accessible={true}
        accessibilityLabel={t('studios.loadingError')}
      >
        <Text style={styles.errorTitle}>{t('studios.loadingError')}</Text>
        <Text style={styles.errorText}>
          {error instanceof Error ? error.message : t('studios.unknownError')}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => refetch()}
          accessible={true}
          accessibilityLabel={t('common.retry')}
          accessibilityHint="Studios neu laden"
        >
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return <StudioListSkeleton itemCount={5} showHeader={true} showDistance={!!userLocation} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={studios}
        renderItem={renderStudioItem}
        keyExtractor={(item) => item.studioId}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshing={false}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        accessible={true}
        accessibilityLabel="Studio-Liste"
      />
      
      {showFilterModal && (
        <FilterModal
          visible={showFilterModal}
          filters={filters}
          onApply={handleApplyFilters}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  refreshText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
