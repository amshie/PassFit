import { Studio } from '../models/studio';
import { Region } from './map.types';

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterPress: () => void;
}

export interface LocationStatusProps {
  locationStatus: 'loading' | 'granted' | 'denied';
  locationError: string | null;
  userLocation: { latitude: number; longitude: number } | null;
  isUsingFallback: boolean;
  selectedFallback: any;
  visibleStudiosCount: number;
  totalStudiosCount: number;
  mapRegion: Region | null;
  radiusKm: number;
}

export interface MapViewProps {
  studios: Studio[];
  onStudioSelect: (studio: Studio) => void;
  selectedStudio: Studio | null;
  userLocation: { latitude: number; longitude: number } | null;
  onRegionChangeComplete: (region: Region) => void;
  isLoadingLocation: boolean;
  onRecenterPress: () => void;
}

export interface StudioBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  studios: Studio[];
  onStudioSelect: (studio: Studio) => void;
  isLoading: boolean;
}

export interface FloatingActionButtonProps {
  onPress: () => void;
  studiosCount: number;
}

export interface HomeFilters {
  distance: number;
  isOpen: boolean;
  amenities: string[];
  minRating: number;
}

export interface StudioWithDistance extends Studio {
  distance?: string;
  distanceKm: number;
}
