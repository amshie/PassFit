import { useRef } from 'react';
import { Platform } from 'react-native';
import { Region } from '../types/map.types';

export function useRecenter() {
  const mapRef = useRef<any>(null);

  const centerOnUser = (userLocation: { latitude: number; longitude: number } | null) => {
    if (userLocation && mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        1000
      );
    }
  };

  const centerOnStudio = (studioLocation: { lat: number; lng: number }) => {
    if (mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion(
        {
          latitude: studioLocation.lat,
          longitude: studioLocation.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  const animateToRegion = (region: Region, duration: number = 1000) => {
    if (mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion(region, duration);
    }
  };

  return {
    mapRef,
    centerOnUser,
    centerOnStudio,
    animateToRegion,
  };
}
