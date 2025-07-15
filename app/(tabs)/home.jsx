import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Text, ScrollView, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Damaskus Fitnessstudios mit denen der Nutzer einen Vertrag hat
const damascusGyms = [
  {
    id: 1,
    name: "HYGIA Damascus",
    address: "شارع الثورة، دمشق 38114",
    distance: "476 m",
    status: "Geöffnet",
    rating: 4.8,
    coordinates: { lat: 33.5138, lng: 36.2765 },
    amenities: ["Fitnessstudio", "Wellness", "Ernährungsberatung", "Functional Training"],
    memberCount: 234
  },
  {
    id: 2,
    name: "Elite Fitness Center",
    address: "شارع بغداد، دمشق",
    distance: "1.2 km",
    status: "Geöffnet",
    rating: 4.6,
    coordinates: { lat: 33.5020, lng: 36.2941 },
    amenities: ["Cardio", "Krafttraining", "Yoga", "Crossfit"],
    memberCount: 189
  },
  {
    id: 3,
    name: "Damascus Sports Club",
    address: "شارع المتنبي، دمشق",
    distance: "2.1 km",
    status: "Geschlossen",
    rating: 4.4,
    coordinates: { lat: 33.4953, lng: 36.2846 },
    amenities: ["Cardio", "Krafttraining", "Basketball", "Tennis"],
    memberCount: 156
  },
  {
    id: 4,
    name: "Fitness Zone Damascus",
    address: "شارع الجمهورية، دمشق",
    distance: "3.2 km",
    status: "Geöffnet",
    rating: 4.7,
    coordinates: { lat: 33.5089, lng: 36.2889 },
    amenities: ["Cardio", "Krafttraining", "Pilates", "Spinning"],
    memberCount: 298
  }
];

// Interaktive Karten-Komponente mit Touch-Gesten (Pan & Pinch-to-Zoom)
const MapViewComponent = ({ gyms, onGymSelect, selectedGym }) => {
  // Shared Values für Animationen
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  // Pan Gesture Handler
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      // Bewegung mit Fingern - Grenzen setzen
      translateX.value = Math.max(Math.min(context.translateX + event.translationX, 150), -150);
      translateY.value = Math.max(Math.min(context.translateY + event.translationY, 150), -150);
    },
    onEnd: () => {
      // Smooth zurück zur Position mit Spring-Animation
      translateX.value = withSpring(translateX.value);
      translateY.value = withSpring(translateY.value);
    },
  });

  // Pinch Gesture Handler für Zoom
  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.scale = savedScale.value;
    },
    onActive: (event, context) => {
      // Zoom mit zwei Fingern - Grenzen setzen
      scale.value = Math.max(Math.min(context.scale * event.scale, 3), 0.5);
    },
    onEnd: () => {
      savedScale.value = scale.value;
      scale.value = withSpring(scale.value);
    },
  });

  // Animierte Styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  // Zoom-Level für Anzeige
  const [displayZoom, setDisplayZoom] = useState(100);

  // Zoom-Level Update
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayZoom(Math.round(scale.value * 100));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.mapContainer}>
      {/* Touch-Anweisungen */}
      <View style={styles.touchInstructions}>
        <Text style={styles.instructionText}>👆 Ziehen zum Bewegen • 🤏 Kneifen zum Zoomen</Text>
      </View>

      {/* Pinch Gesture für Zoom */}
      <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
        <Animated.View style={styles.gestureContainer}>
          {/* Pan Gesture für Bewegung */}
          <PanGestureHandler onGestureEvent={panGestureHandler}>
            <Animated.View style={[styles.mapBackground, animatedStyle]}>
              {/* Karten-Overlay mit Städtenamen */}
              <View style={styles.mapOverlay}>
                <Text style={styles.cityLabel}>Damascus</Text>
                <Text style={styles.countryLabel}>Syria</Text>
              </View>
              
              {/* Straßen und Stadtteile */}
              <View style={styles.mapFeatures}>
                {/* Hauptstraßen */}
                <View style={[styles.street, { top: 150, left: 0, width: '100%', height: 3 }]} />
                <View style={[styles.street, { top: 250, left: 0, width: '100%', height: 3 }]} />
                <View style={[styles.street, { top: 0, left: 150, width: 3, height: '100%' }]} />
                <View style={[styles.street, { top: 0, left: 250, width: 3, height: '100%' }]} />
                
                {/* Stadtteile-Labels */}
                <Text style={[styles.districtLabel, { top: 80, left: 80 }]}>Old Damascus</Text>
                <Text style={[styles.districtLabel, { top: 180, left: 200 }]}>Mezzeh</Text>
                <Text style={[styles.districtLabel, { top: 280, left: 120 }]}>Kafr Sousa</Text>
              </View>
              
              {/* Gym-Marker mit besserer Verteilung */}
              {gyms.map((gym, index) => {
                const positions = [
                  { top: 140, left: 180 }, // HYGIA Damascus - Zentrum
                  { top: 200, left: 280 }, // Elite Fitness - Mezzeh
                  { top: 290, left: 150 }, // Damascus Sports - Kafr Sousa
                  { top: 160, left: 320 }  // Fitness Zone - Ost
                ];
                
                return (
                  <TouchableOpacity
                    key={gym.id}
                    style={[
                      styles.gymMarker,
                      positions[index],
                      selectedGym?.id === gym.id && styles.selectedMarker
                    ]}
                    onPress={() => onGymSelect(gym)}
                  >
                    <View style={styles.markerContent}>
                      <Text style={styles.markerText}>{gym.memberCount}</Text>
                    </View>
                    <Text style={styles.markerLabel}>{gym.name.split(' ')[0]}</Text>
                  </TouchableOpacity>
                );
              })}
              
              {/* Benutzer-Position */}
              <View style={[styles.userLocationMarker, { top: 200, left: 200 }]}>
                <View style={styles.userLocationDot} />
                <Text style={styles.userLocationLabel}>Sie sind hier</Text>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>

      {/* Zoom-Level Anzeige */}
      <View style={styles.zoomIndicator}>
        <Text style={styles.zoomText}>Zoom: {displayZoom}%</Text>
      </View>
    </View>
  );
};

export default function GymPage() {
  const [selectedGym, setSelectedGym] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGyms, setFilteredGyms] = useState(damascusGyms);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  
  // Geolocation States
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Geolocation useEffect
  useEffect(() => {
    const requestLocation = () => {
      // Prüfen ob Geolocation unterstützt wird
      if (!navigator.geolocation) {
        setLocationError('Geolocation wird von diesem Browser nicht unterstützt.');
        setIsLoadingLocation(false);
        return;
      }

      // Standort anfordern
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Erfolg: Koordinaten speichern
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(coords);
          setLocationError(null);
          setIsLoadingLocation(false);
          console.log('Standort ermittelt:', coords);
        },
        (error) => {
          // Fehler: Verständliche Fehlermeldung setzen
          let errorMessage = '';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Standortfreigabe wurde verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Standort konnte nicht ermittelt werden. Bitte überprüfe deine Internetverbindung.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Zeitüberschreitung bei der Standortermittlung. Bitte versuche es erneut.';
              break;
            default:
              errorMessage = 'Ein unbekannter Fehler ist bei der Standortermittlung aufgetreten.';
              break;
          }
          setLocationError(errorMessage);
          setIsLoadingLocation(false);
          console.error('Geolocation Fehler:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    };

    requestLocation();
  }, []);

  useEffect(() => {
    // Filter gyms based on search query
    const filtered = damascusGyms.filter(gym =>
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.address.includes(searchQuery) ||
      gym.amenities.some(amenity => amenity.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredGyms(filtered);
  }, [searchQuery]);

  const handleGymSelect = (gym) => {
    setSelectedGym(gym);
    setShowBottomSheet(true);
  };

  const handleJoinGym = (gym) => {
    alert(`Beitritt zu ${gym.name} wird verarbeitet...`);
    setShowBottomSheet(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Suchfeld über der Karte */}
      <View style={styles.searchOverlay}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#fff" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Partner finden"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="rgba(255,255,255,0.8)"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="#ff6b35" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Standort-Status Anzeige */}
      <View style={styles.locationStatusOverlay}>
        {isLoadingLocation && (
          <View style={styles.locationStatus}>
            <Ionicons name="location-outline" size={16} color="#ff6b35" />
            <Text style={styles.locationStatusText}>
              Ermittle deine Position… Bitte erlaube die Standortfreigabe.
            </Text>
          </View>
        )}
        
        {locationError && (
          <View style={[styles.locationStatus, styles.locationError]}>
            <Ionicons name="warning-outline" size={16} color="#dc2626" />
            <Text style={[styles.locationStatusText, styles.locationErrorText]}>
              {locationError}
            </Text>
          </View>
        )}
        
        {userLocation && !isLoadingLocation && !locationError && (
          <View style={[styles.locationStatus, styles.locationSuccess]}>
            <Ionicons name="location" size={16} color="#16a34a" />
            <Text style={[styles.locationStatusText, styles.locationSuccessText]}>
              Position: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>

      {/* Vollbild-Karte */}
      <MapViewComponent 
        gyms={filteredGyms} 
        onGymSelect={handleGymSelect} 
        selectedGym={selectedGym}
      />

      {/* Bottom Sheet für Studio-Liste */}
      <View style={styles.bottomSheetContainer}>
        <View style={styles.bottomSheetHandle} />
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>Studioliste anzeigen</Text>
          <Text style={styles.distanceFilter}>Bis zu 1 km</Text>
        </View>
        
        <ScrollView style={styles.studioList} showsVerticalScrollIndicator={false}>
          {filteredGyms.map((gym) => (
            <TouchableOpacity
              key={gym.id}
              style={styles.studioCard}
              onPress={() => handleGymSelect(gym)}
            >
              <View style={styles.studioIcon}>
                <Ionicons name="fitness-outline" size={24} color="#ff6b35" />
              </View>
              
              <View style={styles.studioInfo}>
                <Text style={styles.studioName}>{gym.name}</Text>
                <Text style={styles.studioAddress}>{gym.address}</Text>
                <View style={styles.studioMeta}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.studioDistance}>{gym.distance}</Text>
                  <Text style={styles.studioAmenities}>
                    {gym.amenities.slice(0, 2).join(', ')}...
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="star-outline" size={20} color="#ff6b35" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Detail Modal */}
      <Modal
        visible={showBottomSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBottomSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            onPress={() => setShowBottomSheet(false)}
          />
          <View style={styles.detailBottomSheet}>
            <View style={styles.detailHandle} />
            
            {selectedGym && (
              <>
                <View style={styles.detailHeader}>
                  <View style={styles.detailTitleContainer}>
                    <Text style={styles.detailTitle}>{selectedGym.name}</Text>
                    <TouchableOpacity 
                      onPress={() => setShowBottomSheet(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.detailAddress}>{selectedGym.address}</Text>
                </View>

                <ScrollView style={styles.detailContent}>
                  <View style={styles.detailInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons name="star" size={20} color="#FFD700" />
                      <Text style={styles.infoText}>{selectedGym.rating} Bewertung</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Ionicons name="location" size={20} color="#ff6b35" />
                      <Text style={styles.infoText}>{selectedGym.distance} entfernt</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <Ionicons 
                        name={selectedGym.status === 'Geöffnet' ? 'time' : 'time-outline'} 
                        size={20} 
                        color={selectedGym.status === 'Geöffnet' ? '#16a34a' : '#dc2626'} 
                      />
                      <Text style={[
                        styles.infoText,
                        { color: selectedGym.status === 'Geöffnet' ? '#16a34a' : '#dc2626' }
                      ]}>
                        {selectedGym.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.amenitiesSection}>
                    <Text style={styles.amenitiesTitle}>Angebote</Text>
                    <View style={styles.amenitiesGrid}>
                      {selectedGym.amenities.map((amenity, index) => (
                        <View key={index} style={styles.amenityItem}>
                          <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                          <Text style={styles.amenityItemText}>{amenity}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.detailActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.primaryButton,
                        selectedGym.status === 'Geschlossen' && styles.disabledButton
                      ]}
                      onPress={() => handleJoinGym(selectedGym)}
                      disabled={selectedGym.status === 'Geschlossen'}
                    >
                      <Ionicons 
                        name="fitness-outline" 
                        size={20} 
                        color={selectedGym.status === 'Geschlossen' ? '#999' : '#fff'} 
                      />
                      <Text style={[
                        styles.actionButtonText,
                        selectedGym.status === 'Geschlossen' && styles.disabledButtonText
                      ]}>
                        Jetzt beitreten
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                      <Ionicons name="call-outline" size={20} color="#ff6b35" />
                      <Text style={styles.secondaryButtonText}>Anrufen</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // Suchfeld Overlay
  searchOverlay: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  filterButton: {
    marginLeft: 10,
    padding: 5,
  },
  // Standort-Status Overlay
  locationStatusOverlay: {
    position: 'absolute',
    top: 120,
    left: 15,
    right: 15,
    zIndex: 9,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationError: {
    backgroundColor: 'rgba(220, 38, 38, 0.95)',
  },
  locationSuccess: {
    backgroundColor: 'rgba(22, 163, 74, 0.95)',
  },
  locationStatusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  locationErrorText: {
    color: '#fff',
  },
  locationSuccessText: {
    color: '#fff',
  },
  // Karten-Styles
  mapContainer: {
    flex: 1,
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#e8f4f8',
    position: 'relative',
    overflow: 'hidden',
  },
  mapOverlay: {
    position: 'absolute',
    top: 100,
    left: 20,
    zIndex: 5,
  },
  cityLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  countryLabel: {
    fontSize: 16,
    color: '#666',
  },
  // Touch-Gesten Steuerung
  touchInstructions: {
    position: 'absolute',
    top: 100,
    left: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  gestureContainer: {
    flex: 1,
  },
  zoomIndicator: {
    position: 'absolute',
    bottom: 120,
    right: 15,
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  zoomText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  // Karten-Features
  mapFeatures: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  street: {
    position: 'absolute',
    backgroundColor: '#ccc',
  },
  districtLabel: {
    position: 'absolute',
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  // Gym-Marker
  gymMarker: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedMarker: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.2 }],
  },
  markerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markerLabel: {
    position: 'absolute',
    top: 55,
    left: -15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    minWidth: 80,
  },
  // Benutzer-Position
  userLocationMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  userLocationLabel: {
    position: 'absolute',
    top: 25,
    left: -25,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    minWidth: 70,
  },
  // Bottom Sheet Container
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  bottomSheetHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  distanceFilter: {
    fontSize: 14,
    color: '#64748b',
  },
  // Studio Liste
  studioList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  studioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  studioIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studioInfo: {
    flex: 1,
  },
  studioName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  studioAddress: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  studioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  studioDistance: {
    fontSize: 12,
    color: '#666',
  },
  studioAmenities: {
    fontSize: 12,
    color: '#666',
  },
  favoriteButton: {
    padding: 8,
  },
  // Detail Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  detailBottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  detailHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  detailHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  detailAddress: {
    fontSize: 16,
    color: '#64748b',
  },
  detailContent: {
    flex: 1,
  },
  detailInfo: {
    padding: 20,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  amenitiesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  amenitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  amenitiesGrid: {
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  amenityItemText: {
    fontSize: 16,
    color: '#1e293b',
  },
  detailActions: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#ff6b35',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ff6b35',
  },
  disabledButton: {
    backgroundColor: '#e2e8f0',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b35',
  },
  disabledButtonText: {
    color: '#999',
  },
});
