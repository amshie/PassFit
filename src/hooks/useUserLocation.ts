import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface FallbackLocation {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  country: string;
}

export interface UserLocationState {
  userLocation: { latitude: number; longitude: number } | null;
  status: 'loading' | 'granted' | 'denied';
  error: string | null;
  selectedFallback: FallbackLocation | null;
  isUsingFallback: boolean;
}

// Vordefinierte Fallback-Standorte
export const FALLBACK_LOCATIONS: FallbackLocation[] = [
  {
    id: 'damascus',
    name: 'Damascus',
    coordinates: { latitude: 33.5138, longitude: 36.2765 },
    country: 'Syria'
  },
  {
    id: 'berlin',
    name: 'Berlin',
    coordinates: { latitude: 52.5200, longitude: 13.4050 },
    country: 'Germany'
  },
  {
    id: 'munich',
    name: 'München',
    coordinates: { latitude: 48.1351, longitude: 11.5820 },
    country: 'Germany'
  }
];

export function useUserLocation() {
  const [state, setState] = useState<UserLocationState>({
    userLocation: null,
    status: 'loading',
    error: null,
    selectedFallback: null,
    isUsingFallback: false,
  });

  // Standort-Berechtigung anfordern und Position ermitteln
  const requestLocationPermission = async () => {
    try {
      setState(prev => ({ ...prev, status: 'loading', error: null }));

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setState(prev => ({
          ...prev,
          status: 'denied',
          error: 'Standortberechtigung verweigert',
          userLocation: null,
        }));
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setState(prev => ({
        ...prev,
        status: 'granted',
        userLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        error: null,
        isUsingFallback: false,
        selectedFallback: null,
      }));

    } catch (error) {
      console.error('Location error:', error);
      setState(prev => ({
        ...prev,
        status: 'denied',
        error: 'Fehler beim Ermitteln des Standorts',
        userLocation: null,
      }));
    }
  };

  // Fallback-Standort auswählen
  const selectFallbackLocation = (fallback: FallbackLocation) => {
    setState(prev => ({
      ...prev,
      selectedFallback: fallback,
      userLocation: fallback.coordinates,
      isUsingFallback: true,
      error: null,
    }));
  };

  // Fallback-Auswahl zurücksetzen und GPS erneut versuchen
  const retryGPS = () => {
    setState(prev => ({
      ...prev,
      selectedFallback: null,
      isUsingFallback: false,
    }));
    requestLocationPermission();
  };

  // Initial location request
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Berechne die aktuelle Region für die Karte
  const getCurrentRegion = () => {
    if (state.userLocation) {
      return {
        latitude: state.userLocation.latitude,
        longitude: state.userLocation.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }
    
    // Default zu Damascus wenn keine Position verfügbar
    return {
      latitude: 33.5138,
      longitude: 36.2765,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  };

  return {
    ...state,
    requestLocationPermission,
    selectFallbackLocation,
    retryGPS,
    getCurrentRegion,
    fallbackLocations: FALLBACK_LOCATIONS,
  };
}
