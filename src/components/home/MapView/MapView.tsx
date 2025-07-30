import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { MapSkeleton } from '../../ui/Loading';
import { MapViewProps } from '../../../types/home.types';
import { useRecenter } from '../../../hooks/useRecenter';

// Conditional imports for platform compatibility
let MapView: any, Marker: any, PROVIDER_GOOGLE: any;

// Only import react-native-maps on native platforms
if (Platform.OS !== 'web') {
  try {
    // Use dynamic import to avoid Metro bundling issues on web
    const Maps = require('react-native-maps');
    MapView = Maps.default || Maps;
    Marker = Maps.Marker;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (error) {
    console.warn('react-native-maps not available on this platform');
    // Fallback components for native platforms when maps fail
    MapView = ({ children, ...props }: any) => <View {...props}>{children}</View>;
    Marker = (props: any) => <View {...props} />;
    PROVIDER_GOOGLE = 'google';
  }
} else {
  // Web fallback components
  MapView = ({ children, ...props }: any) => <View {...props}>{children}</View>;
  Marker = (props: any) => <View {...props} />;
  PROVIDER_GOOGLE = 'google';
}

export const GoogleMapView: React.FC<MapViewProps> = ({
  studios,
  onStudioSelect,
  selectedStudio,
  userLocation,
  onRegionChangeComplete,
  isLoadingLocation,
  onRecenterPress,
}) => {
  const { t } = useTranslation();
  const { mapRef, centerOnUser, centerOnStudio } = useRecenter();

  // Auto-center on selected studio
  useEffect(() => {
    if (selectedStudio) {
      centerOnStudio(selectedStudio.location);
    }
  }, [selectedStudio, centerOnStudio]);

  // Smooth animation to user location when it becomes available
  useEffect(() => {
    if (userLocation) {
      centerOnUser(userLocation);
    }
  }, [userLocation, centerOnUser]);

  // Handle recenter button press
  const handleRecenterPress = () => {
    centerOnUser(userLocation);
    onRecenterPress();
  };

  // Web Fallback - show skeleton when loading, otherwise show map placeholder
  if (Platform.OS === 'web') {
    if (isLoadingLocation) {
      return <MapSkeleton showControls={false} />;
    }
    
    return (
      <View style={styles.mapContainer}>
        <View 
          style={styles.webMapFallback}
          accessible={true}
          accessibilityLabel={t('accessibility.mapView')}
          accessibilityHint="Kartenansicht ist nur auf mobilen Geräten verfügbar"
        >
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
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 33.5138, // Use user location or Damascus default
          longitude: userLocation?.longitude || 36.2765,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={!isLoadingLocation}
        showsMyLocationButton={false}
        onRegionChangeComplete={onRegionChangeComplete}
        accessible={true}
        accessibilityLabel={t('accessibility.mapView')}
        accessibilityHint="Karte mit Studios in der Umgebung"
      >
        {studios.map((studio) => (
          <Marker
            key={studio.studioId}
            coordinate={{
              latitude: studio.location.lat,
              longitude: studio.location.lng
            }}
            title={studio.name}
            description={studio.address}
            pinColor={selectedStudio?.studioId === studio.studioId ? 'blue' : 'orange'}
            onPress={() => onStudioSelect(studio)}
            accessible={true}
            accessibilityLabel={t('accessibility.studioMarker', { name: studio.name })}
            accessibilityHint={t('accessibility.selectStudio')}
          />
        ))}
      </MapView>
      
      {/* Re-center Button - always visible, shows spinner while loading */}
      <TouchableOpacity 
        style={[styles.recenterButton, !userLocation && styles.recenterButtonDisabled]} 
        onPress={handleRecenterPress}
        disabled={!userLocation}
        accessible={true}
        accessibilityLabel={t('accessibility.centerOnLocation')}
        accessibilityHint="Karte auf aktuellen Standort zentrieren"
      >
        {isLoadingLocation ? (
          <ActivityIndicator size={24} color="#ff6b35" />
        ) : (
          <Ionicons name="locate" size={24} color={userLocation ? "#ff6b35" : "#ccc"} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: { 
    flex: 1 
  },
  recenterButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  recenterButtonDisabled: {
    opacity: 0.6,
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
});
