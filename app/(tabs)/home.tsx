import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

// Components
import { 
  FilterModal,
  FallbackLocationSelector,
} from '@/components/ui';
import {
  SearchBar,
  LocationStatus,
  GoogleMapView,
  StudioBottomSheet,
  FloatingActionButton,
} from '@/components/home';

// Hooks
import { 
  useFilteredStudiosRealtime,
  useDistanceCalculator,
  useUserLocation,
  useMapRegion,
  useVisibleStudios,
} from '@/hooks';

// Theme
import { useTheme } from '../../src/providers/ThemeProvider';

// Types
import { Studio } from '@/models/studio';
import { HomeFilters, StudioWithDistance } from '@/types/home.types';

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { getBackgroundColor, isDark } = useTheme();
  
  // State Management
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<HomeFilters>({
    distance: 50,
    isOpen: false,
    amenities: [],
    minRating: 0,
  });

  // Hooks
  const { calculateDistance, formatDistance } = useDistanceCalculator();
  const {
    userLocation,
    status: locationStatus,
    error: locationError,
    selectedFallback,
    isUsingFallback,
    selectFallbackLocation,
    retryGPS,
    fallbackLocations,
  } = useUserLocation();

  const { mapRegion, viewportBounds, onRegionChangeComplete } = useMapRegion();

  // Derived state
  const isLoadingLocation = locationStatus === 'loading';
  const hasLocationPermission = locationStatus === 'granted';
  const locationDenied = locationStatus === 'denied';
  
  // Combine search query with filters
  const queryFilters = useMemo(() => ({
    ...filters,
    radiusKm: userLocation
      ? filters.distance  // Normal filtering when location is available
      : Infinity,         // Load all studios when no location yet
    searchTerm: searchQuery,
  }), [filters, searchQuery, userLocation]);

  // Data fetching with realtime updates
  const { 
    data: studios = [], 
    isLoading: isLoadingStudios, 
    error: studiosError 
  } = useFilteredStudiosRealtime(
    userLocation?.latitude,
    userLocation?.longitude,
    queryFilters
  );

  // Studios with distances calculated
  const studiosWithDistance: StudioWithDistance[] = useMemo(() => {
    if (!userLocation || !studios.length) return studios.map(studio => ({ ...studio, distanceKm: 0 }));
    
    return studios.map(studio => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        studio.location.lat,
        studio.location.lng
      );
      return {
        ...studio,
        distance: formatDistance(distance),
        distanceKm: distance,
      };
    });
  }, [studios, userLocation, calculateDistance, formatDistance]);

  // Sorted studios for the BottomSheet display
  const sortedStudios = useMemo(() => {
    return [...studiosWithDistance].sort(
      (a, b) => a.distanceKm - b.distanceKm
    );
  }, [studiosWithDistance]);

  // Studios filtered by viewport
  const visibleStudios = useVisibleStudios(sortedStudios, viewportBounds);

  // Event Handlers
  const handleStudioSelect = (studio: Studio) => {
    setSelectedStudio(studio);
    // Navigate to studio detail page using the dynamic route
    router.push(`/studio/${studio.studioId}`);
  };

  const handleFilterApply = (newFilters: any) => {
    // Convert StudioFilters to HomeFilters
    const homeFilters: HomeFilters = {
      distance: newFilters.radiusKm || 50,
      isOpen: newFilters.isOpen || false,
      amenities: newFilters.amenities || [],
      minRating: newFilters.minRating || 0,
    };
    setFilters(homeFilters);
  };

  const handleRecenterPress = () => {
    // Additional logic can be added here if needed
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterPress={() => setShowFilterModal(true)}
      />

      {/* Location Status */}
      <LocationStatus
        locationStatus={locationStatus}
        locationError={locationError}
        userLocation={userLocation}
        isUsingFallback={isUsingFallback}
        selectedFallback={selectedFallback}
        visibleStudiosCount={visibleStudios.length}
        totalStudiosCount={sortedStudios.length}
        mapRegion={mapRegion}
        radiusKm={queryFilters.radiusKm}
      />

      {/* Fallback Location Selector */}
      {locationDenied && !isUsingFallback && (
        <View style={styles.fallbackSelectorOverlay}>
          <FallbackLocationSelector
            locations={fallbackLocations}
            selectedLocation={selectedFallback}
            onLocationSelect={selectFallbackLocation}
            onRetryGPS={retryGPS}
          />
        </View>
      )}

      {/* Map */}
      <GoogleMapView
        studios={sortedStudios}
        onStudioSelect={handleStudioSelect}
        selectedStudio={selectedStudio}
        userLocation={userLocation}
        onRegionChangeComplete={onRegionChangeComplete}
        isLoadingLocation={isLoadingLocation}
        onRecenterPress={handleRecenterPress}
      />

      {/* Bottom Sheet Studio List */}
      <StudioBottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        studios={visibleStudios}
        onStudioSelect={handleStudioSelect}
        isLoading={isLoadingStudios}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        filters={{
          radiusKm: filters.distance,
          isOpen: filters.isOpen,
          amenities: filters.amenities,
          minRating: filters.minRating,
        }}
      />

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={() => setShowBottomSheet(true)}
        studiosCount={visibleStudios.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  fallbackSelectorOverlay: {
    position: 'absolute',
    top: 160,
    left: 0,
    right: 0,
    zIndex: 8,
  },
});
