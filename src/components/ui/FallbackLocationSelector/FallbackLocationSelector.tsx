import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { FallbackLocation } from '../../../hooks/useUserLocation';

interface FallbackLocationSelectorProps {
  locations: FallbackLocation[];
  selectedLocation: FallbackLocation | null;
  onLocationSelect: (location: FallbackLocation) => void;
  onRetryGPS: () => void;
}

export const FallbackLocationSelector: React.FC<FallbackLocationSelectorProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  onRetryGPS,
}) => {
  const { t } = useTranslation();
  
  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel={t('location.selectLocation')}
    >
      <View style={styles.header}>
        <Ionicons name="location-outline" size={24} color="#ff6b35" />
        <Text style={styles.title}>{t('location.selectLocation')}</Text>
      </View>
      
      <Text style={styles.subtitle}>
        {t('location.permissionDeniedMessage')}
      </Text>

      <ScrollView 
        style={styles.locationsList} 
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel="Verfügbare Standorte"
      >
        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.locationItem,
              selectedLocation?.id === location.id && styles.selectedLocationItem
            ]}
            onPress={() => onLocationSelect(location)}
            accessible={true}
            accessibilityLabel={t('accessibility.selectFallbackLocation')}
            accessibilityHint={`${location.name}, ${location.country} auswählen`}
            accessibilityState={{ selected: selectedLocation?.id === location.id }}
          >
            <View style={styles.locationInfo}>
              <Text style={[
                styles.locationName,
                selectedLocation?.id === location.id && styles.selectedLocationName
              ]}>
                {location.name}
              </Text>
              <Text style={[
                styles.locationCountry,
                selectedLocation?.id === location.id && styles.selectedLocationCountry
              ]}>
                {location.country}
              </Text>
            </View>
            
            {selectedLocation?.id === location.id && (
              <Ionicons name="checkmark-circle" size={24} color="#ff6b35" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={onRetryGPS}
        accessible={true}
        accessibilityLabel={t('accessibility.retryLocationPermission')}
        accessibilityHint="GPS-Berechtigung erneut anfordern"
      >
        <Ionicons name="refresh-outline" size={20} color="#007bff" />
        <Text style={styles.retryButtonText}>{t('location.retryGPS')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  locationsList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedLocationItem: {
    backgroundColor: '#fef3f2',
    borderColor: '#ff6b35',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  selectedLocationName: {
    color: '#ff6b35',
  },
  locationCountry: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedLocationCountry: {
    color: '#ff6b35',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007bff',
    marginLeft: 6,
  },
});
