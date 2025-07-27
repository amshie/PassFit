import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { 
  BottomSheet, 
  StudioCard, 
  FilterModal,
  Button 
} from '@/components/ui';
import { 
  useFilteredStudios, 
  useDistanceCalculator 
} from '@/hooks/useStudio';
import { Studio } from '@/models/studio';

const { width, height } = Dimensions.get('window');

// Dummy-Daten für Amenities (bis Backend erweitert wird)
const STUDIO_AMENITIES = {
  'HYGIA Damascus': ['Fitnessstudio', 'Wellness', 'Ernährungsberatung', 'Functional Training'],
  'Elite Fitness Center': ['Cardio', 'Krafttraining', 'Yoga', 'Crossfit'],
  'Damascus Sports Club': ['Cardio', 'Krafttraining', 'Basketball', 'Tennis'],
  'Fitness Zone Damascus': ['Cardio', 'Krafttraining', 'Pilates', 'Spinning'],
};

// Dummy-Daten für Öffnungszeiten
const STUDIO_STATUS = {
  'HYGIA Damascus': true,
  'Elite Fitness Center': true,
  'Damascus Sports Club': false,
  'Fitness Zone Damascus': true,
};

// Web Map Fallback Komponente
function WebMapView({ studios, onStudioSelect, selectedStudio, userLocation }) {
  return (
    <View style={styles.mapContainer}>
      <View style={styles.webMapFallback}>
        <Ionicons name="map-outline" size={48} color="#ccc" />
        <Text style={styles.webMapText}>Kartenansicht</Text>
        <Text style={styles.webMapSubtext}>
          Nur auf mobilen Geräten verfügbar
        </Text>
        {userLocation && (
          <Text style={styles.webLocationText}>
            Position: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </Text>
        )}
        <Text style={styles.webStudioCount}>
          {studios.length} Studios gefunden
        </Text>
      </View>
    </View>
  );
}

export default function HomePage() {
  // State Management
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showStudioDetail, setShowStudioDetail] = useState(false);

  // Location State
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Filter State
  const [filters, setFilters] = useState({
    distance: 10,
    isOpen: false,
    amenities: [],
    minRating: 0,
  });

  // Hooks
  const { calculateDistance, formatDistance } = useDistanceCalculator();
  
  // Combine search query with filters
  const queryFilters = useMemo(() => ({
    ...filters,
    radiusKm: filters.distance,
    searchTerm: searchQuery,
  }), [filters, searchQuery]);

  // Data fetching
  const { 
    data: studios = [], 
    isLoading: isLoadingStudios, 
    error: studiosError 
  } = useFilteredStudios(
    userLocation?.latitude,
    userLocation?.longitude,
    queryFilters
  );

  // Location Permission und Ermittlung
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Standortberechtigung verweigert');
          setIsLoadingLocation(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setLocationError(null);
      } catch (error) {
        setLocationError('Fehler beim Ermitteln des Standorts');
        console.error('Location error:', error);
      } finally {
        setIsLoadingLocation(false);
      }
    })();
  }, []);

  // Studios mit Entfernungen berechnen
  const studiosWithDistance = useMemo(() => {
    if (!userLocation || !studios.length) return studios;
    
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
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [studios, userLocation, calculateDistance, formatDistance]);

  // Event Handlers
  const handleStudioSelect = (studio) => {
    setSelectedStudio(studio);
    setShowStudioDetail(true);
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
  };

  const handleJoinStudio = (studio) => {
    Alert.alert(
      'Studio beitreten',
      `Möchten Sie ${studio.name} beitreten?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Beitreten', 
          onPress: () => {
            Alert.alert('Erfolg', `Beitritt zu ${studio.name} wird verarbeitet...`);
            setShowStudioDetail(false);
          }
        },
      ]
    );
  };

  const handleCallStudio = (studio) => {
    Alert.alert('Anrufen', `${studio.name} anrufen?`);
  };

  // Loading State
  if (isLoadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={styles.loadingText}>Standort wird ermittelt...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Suchfeld */}
      <View style={styles.searchOverlay}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#fff" />
          <TextInput
            style={styles.searchInput}
            placeholder="Partner finden"
            placeholderTextColor="rgba(255,255,255,0.8)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="options-outline" size={20} color="#ff6b35" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Standortstatus */}
      <View style={styles.locationStatusOverlay}>
        {locationError && (
          <View style={[styles.locationStatus, styles.locationError]}>
            <Ionicons name="warning-outline" size={16} color="#dc2626" />
            <Text style={[styles.locationStatusText, styles.locationErrorText]}>{locationError}</Text>
          </View>
        )}
        {userLocation && !locationError && (
          <View style={[styles.locationStatus, styles.locationSuccess]}>
            <Ionicons name="location" size={16} color="#16a34a" />
            <Text style={[styles.locationStatusText, styles.locationSuccessText]}>
              {studiosWithDistance.length} Studios gefunden
            </Text>
          </View>
        )}
      </View>

      {/* Web Map Fallback */}
      <WebMapView
        studios={studiosWithDistance}
        onStudioSelect={handleStudioSelect}
        selectedStudio={selectedStudio}
        userLocation={userLocation}
      />

      {/* Bottom Sheet Liste */}
      <BottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title="Studios in der Nähe"
        snapPoints={[0.4, 0.7]}
        initialSnapPoint={0}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoadingStudios ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ff6b35" />
              <Text style={styles.loadingText}>Studios werden geladen...</Text>
            </View>
          ) : studiosWithDistance.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="fitness-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Keine Studios gefunden</Text>
              <Text style={styles.emptySubtext}>
                Versuchen Sie es mit anderen Suchkriterien
              </Text>
            </View>
          ) : (
            studiosWithDistance.map((studio) => (
              <StudioCard
                key={studio.studioId}
                studio={studio}
                distance={studio.distance}
                onPress={handleStudioSelect}
                amenities={STUDIO_AMENITIES[studio.name] || []}
                isOpen={STUDIO_STATUS[studio.name] !== false}
              />
            ))
          )}
        </ScrollView>
      </BottomSheet>

      {/* Studio Detail Modal */}
      <BottomSheet
        visible={showStudioDetail}
        onClose={() => setShowStudioDetail(false)}
        title={selectedStudio?.name}
        snapPoints={[0.6, 0.9]}
        initialSnapPoint={0}
      >
        {selectedStudio && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.detailContent}>
              {/* Studio Info */}
              <View style={styles.detailInfo}>
                <Text style={styles.detailAddress}>{selectedStudio.address}</Text>
                
                <View style={styles.infoRow}>
                  <Ionicons name="location" size={20} color="#ff6b35" />
                  <Text style={styles.infoText}>
                    {studiosWithDistance.find(s => s.studioId === selectedStudio.studioId)?.distance || 'N/A'} entfernt
                  </Text>
                </View>
                
                {selectedStudio.averageRating && (
                  <View style={styles.infoRow}>
                    <Ionicons name="star" size={20} color="#FFD700" />
                    <Text style={styles.infoText}>{selectedStudio.averageRating.toFixed(1)} Bewertung</Text>
                  </View>
                )}
                
                <View style={styles.infoRow}>
                  <Ionicons 
                    name={STUDIO_STATUS[selectedStudio.name] ? 'time' : 'time-outline'} 
                    size={20} 
                    color={STUDIO_STATUS[selectedStudio.name] ? '#16a34a' : '#dc2626'} 
                  />
                  <Text style={[
                    styles.infoText, 
                    { color: STUDIO_STATUS[selectedStudio.name] ? '#16a34a' : '#dc2626' }
                  ]}>
                    {STUDIO_STATUS[selectedStudio.name] ? 'Geöffnet' : 'Geschlossen'}
                  </Text>
                </View>
              </View>

              {/* Amenities */}
              {STUDIO_AMENITIES[selectedStudio.name] && (
                <View style={styles.amenitiesSection}>
                  <Text style={styles.amenitiesTitle}>Angebote</Text>
                  <View style={styles.amenitiesGrid}>
                    {STUDIO_AMENITIES[selectedStudio.name].map((amenity, i) => (
                      <View key={i} style={styles.amenityItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                        <Text style={styles.amenityItemText}>{amenity}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Actions */}
              <View style={styles.detailActions}>
                <Button
                  title="Jetzt beitreten"
                  onPress={() => handleJoinStudio(selectedStudio)}
                  disabled={!STUDIO_STATUS[selectedStudio.name]}
                  fullWidth
                  style={{ marginBottom: 12 }}
                />
                <Button
                  title="Anrufen"
                  variant="outline"
                  onPress={() => handleCallStudio(selectedStudio)}
                  fullWidth
                />
              </View>
            </View>
          </ScrollView>
        )}
      </BottomSheet>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        initialFilters={filters}
      />

      {/* Floating Action Button für Bottom Sheet */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setShowBottomSheet(true)}
      >
        <Ionicons name="list" size={24} color="#fff" />
        <Text style={styles.floatingButtonText}>Studios anzeigen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  searchOverlay: { 
    position: 'absolute', 
    top: 50, 
    left: 15, 
    right: 15, 
    zIndex: 10 
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    paddingVertical: 12 
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    color: '#fff', 
    fontSize: 16 
  },
  filterButton: { 
    marginLeft: 10, 
    padding: 5 
  },
  locationStatusOverlay: { 
    position: 'absolute', 
    top: 120, 
    left: 15, 
    right: 15, 
    zIndex: 9 
  },
  locationStatus: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.95)', 
    padding: 10, 
    borderRadius: 20, 
    elevation: 3 
  },
  locationError: { 
    backgroundColor: 'rgba(220,38,38,0.95)' 
  },
  locationSuccess: { 
    backgroundColor: 'rgba(22,163,74,0.95)' 
  },
  locationStatusText: { 
    marginLeft: 8, 
    fontSize: 14, 
    fontWeight: '500', 
    flex: 1 
  },
  locationErrorText: { 
    color: '#fff' 
  },
  locationSuccessText: { 
    color: '#fff' 
  },
  mapContainer: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#ff6b35',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  detailContent: {
    paddingBottom: 20,
  },
  detailAddress: { 
    fontSize: 16, 
    color: '#64748b',
    marginBottom: 16,
  },
  detailInfo: { 
    gap: 12,
    marginBottom: 24,
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  infoText: { 
    fontSize: 16, 
    color: '#1e293b', 
    fontWeight: '500' 
  },
  amenitiesSection: { 
    marginBottom: 24,
  },
  amenitiesTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    marginBottom: 12 
  },
  amenitiesGrid: { 
    gap: 8 
  },
  amenityItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    paddingVertical: 4 
  },
  amenityItemText: { 
    fontSize: 16, 
    color: '#1e293b' 
  },
  detailActions: { 
    gap: 12 
  },
  webMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 40,
  },
  webMapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    textAlign: 'center',
  },
  webMapSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  webLocationText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  webStudioCount: {
    fontSize: 14,
    color: '#ff6b35',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
});
