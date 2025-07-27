import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SkeletonLoader } from './SkeletonLoader';

export interface MapSkeletonProps {
  showControls?: boolean;
}

export const MapSkeleton: React.FC<MapSkeletonProps> = ({
  showControls = true,
}) => {
  return (
    <View style={styles.container} accessible={true} accessibilityLabel="Karte wird geladen">
      {/* Map placeholder with icon */}
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={64} color="#cbd5e1" />
        <SkeletonLoader
          width={200}
          height={16}
          borderRadius={4}
          style={styles.mapText}
        />
      </View>
      
      {/* Floating elements skeleton */}
      {showControls && (
        <>
          {/* Search bar skeleton */}
          <View style={styles.searchOverlay}>
            <SkeletonLoader
              width="100%"
              height={48}
              borderRadius={25}
            />
          </View>
          
          {/* Location status skeleton */}
          <View style={styles.locationStatusOverlay}>
            <SkeletonLoader
              width="80%"
              height={36}
              borderRadius={20}
            />
          </View>
          
          {/* Re-center button skeleton */}
          <View style={styles.recenterButton}>
            <SkeletonLoader
              width={48}
              height={48}
              borderRadius={25}
            />
          </View>
          
          {/* Floating action button skeleton */}
          <View style={styles.floatingButton}>
            <SkeletonLoader
              width="100%"
              height={56}
              borderRadius={25}
            />
          </View>
        </>
      )}
      
      {/* Animated dots to show loading activity */}
      <View style={styles.loadingDots}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  mapText: {
    marginTop: 16,
  },
  searchOverlay: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    zIndex: 10,
  },
  locationStatusOverlay: {
    position: 'absolute',
    top: 120,
    left: 15,
    right: 15,
    zIndex: 9,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 8,
  },
  loadingDots: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: 10 }],
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b35',
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
});

export default MapSkeleton;
