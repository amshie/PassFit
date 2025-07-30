import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { MapSkeleton } from '../../ui/Loading';
import { MapViewProps } from '../../../types/home.types';

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

  // Web Fallback - show skeleton when loading, otherwise show map placeholder
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
        
        {/* Show studios list for web */}
        <View style={styles.studiosList}>
          <Text style={styles.studiosListTitle}>Studios in der Nähe:</Text>
          {studios.slice(0, 5).map((studio) => (
            <View key={studio.studioId} style={styles.studioItem}>
              <Text style={styles.studioName}>{studio.name}</Text>
              <Text style={styles.studioAddress}>{studio.address}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
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
  studiosList: {
    marginTop: 32,
    width: '100%',
    maxWidth: 400,
  },
  studiosListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  studioItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  studioName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  studioAddress: {
    fontSize: 12,
    color: '#6b7280',
  },
});
