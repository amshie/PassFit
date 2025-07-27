import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StudioCardSkeleton } from './StudioCardSkeleton';
import { SkeletonLoader } from './SkeletonLoader';

export interface StudioListSkeletonProps {
  itemCount?: number;
  showHeader?: boolean;
  showDistance?: boolean;
}

export const StudioListSkeleton: React.FC<StudioListSkeletonProps> = ({
  itemCount = 5,
  showHeader = true,
  showDistance = true,
}) => {
  return (
    <View style={styles.container} accessible={true} accessibilityLabel="Studio-Liste wird geladen">
      {showHeader && (
        <View style={styles.header}>
          {/* Search bar skeleton */}
          <SkeletonLoader
            width="100%"
            height={48}
            borderRadius={8}
            style={styles.searchBar}
          />
          
          {/* Filter buttons skeleton */}
          <View style={styles.filterContainer}>
            <SkeletonLoader
              width="48%"
              height={36}
              borderRadius={6}
              style={styles.filterButton}
            />
            <SkeletonLoader
              width="48%"
              height={36}
              borderRadius={6}
              style={styles.filterButton}
            />
          </View>
          
          {/* Results count skeleton */}
          <View style={styles.resultsHeader}>
            <SkeletonLoader
              width={120}
              height={16}
              borderRadius={4}
            />
            <SkeletonLoader
              width={80}
              height={16}
              borderRadius={4}
            />
          </View>
        </View>
      )}
      
      {/* Studio cards skeleton */}
      <View style={styles.list}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <StudioCardSkeleton
            key={index}
            showDistance={showDistance}
          />
        ))}
      </View>
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
  searchBar: {
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {},
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list: {
    paddingTop: 8,
  },
});

export default StudioListSkeleton;
