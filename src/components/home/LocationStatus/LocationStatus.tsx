import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LocationStatusProps } from '../../../types/home.types';

export const LocationStatus: React.FC<LocationStatusProps> = ({
  locationStatus,
  locationError,
  userLocation,
  isUsingFallback,
  selectedFallback,
  visibleStudiosCount,
  totalStudiosCount,
  mapRegion,
  radiusKm,
}) => {
  const { t } = useTranslation();

  const renderLocationError = () => (
    <View 
      style={[styles.locationStatus, styles.locationError]}
      accessible={true}
      accessibilityLabel={isUsingFallback ? t('location.currentLocation', { location: selectedFallback?.name }) : locationError || ''}
    >
      <Ionicons name="warning-outline" size={16} color="#dc2626" />
      <Text style={[styles.locationStatusText, styles.locationErrorText]}>
        {isUsingFallback ? t('location.currentLocation', { location: selectedFallback?.name }) : locationError}
      </Text>
    </View>
  );

  const renderLocationLoading = () => (
    <View 
      style={[styles.locationStatus, styles.locationLoading]}
      accessible={true}
      accessibilityLabel={t('location.determining')}
    >
      <ActivityIndicator size={16} color="#ff6b35" />
      <Text style={[styles.locationStatusText, styles.locationLoadingText]}>
        {t('location.determining')}
      </Text>
    </View>
  );

  const renderLocationSuccess = () => (
    <View 
      style={[styles.locationStatus, styles.locationSuccess]}
      accessible={true}
      accessibilityLabel={mapRegion ? t('location.studiosVisible', { count: visibleStudiosCount }) : (radiusKm === Infinity ? t('location.studiosWorldwide', { count: totalStudiosCount }) : t('location.studiosInRadius', { count: totalStudiosCount, radius: radiusKm }))}
    >
      <Ionicons name="location" size={16} color="#16a34a" />
      <Text style={[styles.locationStatusText, styles.locationSuccessText]}>
        {mapRegion ? t('location.studiosVisible', { count: visibleStudiosCount }) : (radiusKm === Infinity ? t('location.studiosWorldwide', { count: totalStudiosCount }) : t('location.studiosInRadius', { count: totalStudiosCount, radius: radiusKm }))}
      </Text>
    </View>
  );

  const renderLocationFallback = () => (
    <View 
      style={[styles.locationStatus, styles.locationFallback]}
      accessible={true}
      accessibilityLabel={t('location.currentLocation', { location: `${selectedFallback?.name} (${selectedFallback?.country})` })}
    >
      <Ionicons name="location-outline" size={16} color="#ff6b35" />
      <Text style={[styles.locationStatusText, styles.locationFallbackText]}>
        {t('location.currentLocation', { location: `${selectedFallback?.name} (${selectedFallback?.country})` })}
      </Text>
    </View>
  );

  return (
    <View style={styles.locationStatusOverlay}>
      {locationError && locationStatus === 'denied' && renderLocationError()}
      {locationStatus === 'loading' && renderLocationLoading()}
      {userLocation && locationStatus === 'granted' && renderLocationSuccess()}
      {userLocation && isUsingFallback && renderLocationFallback()}
    </View>
  );
};

const styles = StyleSheet.create({
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
  locationLoading: {
    backgroundColor: 'rgba(255,107,53,0.95)'
  },
  locationFallback: {
    backgroundColor: 'rgba(255,107,53,0.95)'
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
  locationLoadingText: {
    color: '#fff'
  },
  locationFallbackText: {
    color: '#fff'
  },
});
