import { useState, useMemo } from 'react';
import { Region, ViewportBounds } from '../types/map.types';

export function useMapRegion() {
  const [mapRegion, setMapRegion] = useState<Region | null>(null);

  // Calculate viewport bounds from map region
  const viewportBounds = useMemo((): ViewportBounds | null => {
    if (!mapRegion) return null;
    
    const { latitude, longitude, latitudeDelta, longitudeDelta } = mapRegion;
    return {
      latMin: latitude - latitudeDelta / 2,
      latMax: latitude + latitudeDelta / 2,
      lngMin: longitude - longitudeDelta / 2,
      lngMax: longitude + longitudeDelta / 2,
    };
  }, [mapRegion]);

  const onRegionChangeComplete = (region: Region) => {
    setMapRegion(region);
  };

  return {
    mapRegion,
    viewportBounds,
    onRegionChangeComplete,
  };
}
