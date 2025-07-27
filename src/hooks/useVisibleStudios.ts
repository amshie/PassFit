import { useMemo } from 'react';
import { ViewportBounds } from '../types/map.types';
import { StudioWithDistance } from '../types/home.types';

export function useVisibleStudios(
  studios: StudioWithDistance[],
  viewportBounds: ViewportBounds | null
) {
  const visibleStudios = useMemo(() => {
    if (!viewportBounds) return studios;
    
    return studios.filter(studio => {
      const { lat, lng } = studio.location;
      return (
        lat >= viewportBounds.latMin &&
        lat <= viewportBounds.latMax &&
        lng >= viewportBounds.lngMin &&
        lng <= viewportBounds.lngMax
      );
    });
  }, [studios, viewportBounds]);

  return visibleStudios;
}
