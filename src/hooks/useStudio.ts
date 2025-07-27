import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { StudioService } from '../services/api/studio.service';
import { Studio } from '../models/studio';

// Query Keys
export const studioKeys = {
  all: ['studios'] as const,
  lists: () => [...studioKeys.all, 'list'] as const,
  list: (filters: string) => [...studioKeys.lists(), { filters }] as const,
  details: () => [...studioKeys.all, 'detail'] as const,
  detail: (id: string) => [...studioKeys.details(), id] as const,
  search: (term: string) => [...studioKeys.all, 'search', term] as const,
  location: (lat: number, lng: number, radius: number) => 
    [...studioKeys.all, 'location', { lat, lng, radius }] as const,
  topRated: (limit: number) => [...studioKeys.all, 'topRated', limit] as const,
};

/**
 * Hook to get a single studio by ID
 */
export function useStudio(studioId: string) {
  return useQuery({
    queryKey: studioKeys.detail(studioId),
    queryFn: () => StudioService.getStudio(studioId),
    enabled: !!studioId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get all studios
 */
export function useStudios() {
  return useQuery({
    queryKey: studioKeys.lists(),
    queryFn: () => StudioService.getStudios(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to search studios by name or address
 */
export function useSearchStudios(searchTerm: string) {
  return useQuery({
    queryKey: studioKeys.search(searchTerm),
    queryFn: () => StudioService.searchStudios(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get studios by location
 */
export function useStudiosByLocation(
  centerLat: number,
  centerLng: number,
  radiusKm: number = 10000
) {
  return useQuery({
    queryKey: studioKeys.location(centerLat, centerLng, radiusKm),
    queryFn: () => StudioService.getStudiosByLocation(centerLat, centerLng, radiusKm),
    enabled: !!centerLat && !!centerLng,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get studios with filters
 */
export function useFilteredStudios(
  centerLat?: number,
  centerLng?: number,
  filters?: {
    radiusKm?: number;
    isOpen?: boolean;
    amenities?: string[];
    minRating?: number;
    searchTerm?: string;
  }
) {
  // Use a reasonable default radius (50km) for local searches
  // If radiusKm is Infinity, we'll load all studios worldwide
  const radiusKm = filters?.radiusKm || 50;
  const isWorldwide = radiusKm === Infinity;
  
  return useQuery({
    queryKey: [...studioKeys.location(centerLat || 0, centerLng || 0, radiusKm), 'filtered', filters],
    queryFn: async () => {
      // Always load complete studio list first
      const allStudios = await StudioService.getStudios();
      let studios: Studio[];
      
      // Apply geo-filtering only if not worldwide and user location exists
      if (isWorldwide || !centerLat || !centerLng) {
        studios = allStudios;
      } else {
        // Use location-based filtering for regular studios
        studios = await StudioService.getStudiosByLocation(centerLat, centerLng, radiusKm);
      }
      
      // Find Fusion Gym (studioId: '1') from all studios
      const fusionGym = allStudios.find(studio => studio.studioId === '1');
      
      // Ensure Fusion Gym is always included if it exists and not already in filtered results
      if (fusionGym && !studios.some(studio => studio.studioId === fusionGym.studioId)) {
        studios = [...studios, fusionGym];
        console.log('🏋️ Fusion Gym added to results (outside radius filter)');
      }
      
      // Apply additional filters
      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        studios = studios.filter(studio => {
          const name = (studio.name ?? '').toLowerCase();
          const address = (studio.address ?? '').toLowerCase();
          return name.includes(searchTerm) || address.includes(searchTerm);
        });
      }
      
      if (filters?.minRating && filters.minRating > 0) {
        studios = studios.filter(studio => 
          (studio.averageRating || 0) >= filters.minRating!
        );
      }
      
      return studios;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to calculate distance between two points
 */
export function useDistanceCalculator() {
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatDistance = (distanceKm: number): string => {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
  };

  return { calculateDistance, formatDistance };
}

/**
 * Hook to get top rated studios
 */
export function useTopRatedStudios(limit: number = 10) {
  return useQuery({
    queryKey: studioKeys.topRated(limit),
    queryFn: () => StudioService.getTopRatedStudios(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to create a new studio
 */
export function useCreateStudio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studioData: Omit<Studio, 'studioId'>) =>
      StudioService.createStudio(studioData),
    onSuccess: () => {
      // Invalidate and refetch studio lists
      queryClient.invalidateQueries({ queryKey: studioKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studioKeys.topRated(10) });
    },
    onError: (error) => {
      console.error('Failed to create studio:', error);
    },
  });
}

/**
 * Hook to update an existing studio
 */
export function useUpdateStudio(studioId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Omit<Studio, 'studioId' | 'createdAt'>>) =>
      StudioService.updateStudio(studioId, updates),
    onSuccess: () => {
      // Invalidate specific studio and lists
      queryClient.invalidateQueries({ queryKey: studioKeys.detail(studioId) });
      queryClient.invalidateQueries({ queryKey: studioKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studioKeys.topRated(10) });
    },
    onError: (error) => {
      console.error('Failed to update studio:', error);
    },
  });
}

/**
 * Hook to delete a studio
 */
export function useDeleteStudio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studioId: string) => StudioService.deleteStudio(studioId),
    onSuccess: (_, studioId) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: studioKeys.detail(studioId) });
      queryClient.invalidateQueries({ queryKey: studioKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studioKeys.topRated(10) });
    },
    onError: (error) => {
      console.error('Failed to delete studio:', error);
    },
  });
}

/**
 * Hook to prefetch a studio (useful for optimistic loading)
 */
export function usePrefetchStudio() {
  const queryClient = useQueryClient();

  return (studioId: string) => {
    queryClient.prefetchQuery({
      queryKey: studioKeys.detail(studioId),
      queryFn: () => StudioService.getStudio(studioId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
}

/**
 * Hook to get cached studio data without triggering a fetch
 */
export function useStudioCache(studioId: string) {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData<Studio | null>(studioKeys.detail(studioId));
}

/**
 * Hook to manually update studio cache
 */
export function useUpdateStudioCache() {
  const queryClient = useQueryClient();

  return (studioId: string, updater: (old: Studio | null) => Studio | null) => {
    queryClient.setQueryData(studioKeys.detail(studioId), updater);
  };
}

// ============================================================================
// REALTIME HOOKS - New implementation with Firestore listeners
// ============================================================================

/**
 * Helper function to calculate distance between two coordinates (Haversine formula)
 * This is a copy of the private method from StudioService for use in hooks
 */
function calculateDistanceHelper(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Hook to get all studios with realtime updates
 */
export function useStudiosRealtime() {
  const queryClient = useQueryClient();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const query = useQuery({
    queryKey: studioKeys.lists(),
    queryFn: () => StudioService.getStudios(), // Initial load
    staleTime: Infinity, // Never consider stale since we have realtime updates
    gcTime: Infinity, // Keep in cache indefinitely
  });

  useEffect(() => {
    // Set up realtime listener
    const unsubscribe = StudioService.subscribeToStudios(
      (studios) => {
        // Update React Query cache with realtime data
        queryClient.setQueryData(studioKeys.lists(), studios);
      },
      (error) => {
        console.error('Realtime studios error:', error);
        // Optionally trigger a refetch on error
        queryClient.invalidateQueries({ queryKey: studioKeys.lists() });
      }
    );

    unsubscribeRef.current = unsubscribe;

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [queryClient]);

  return query;
}

/**
 * Hook to get a single studio with realtime updates
 */
export function useStudioRealtime(studioId: string) {
  const queryClient = useQueryClient();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const query = useQuery({
    queryKey: studioKeys.detail(studioId),
    queryFn: () => StudioService.getStudio(studioId), // Initial load
    enabled: !!studioId,
    staleTime: Infinity, // Never consider stale since we have realtime updates
    gcTime: Infinity, // Keep in cache indefinitely
  });

  useEffect(() => {
    if (!studioId) return;

    // Set up realtime listener
    const unsubscribe = StudioService.subscribeToStudio(
      studioId,
      (studio) => {
        // Update React Query cache with realtime data
        queryClient.setQueryData(studioKeys.detail(studioId), studio);
      },
      (error) => {
        console.error(`Realtime studio ${studioId} error:`, error);
        // Optionally trigger a refetch on error
        queryClient.invalidateQueries({ queryKey: studioKeys.detail(studioId) });
      }
    );

    unsubscribeRef.current = unsubscribe;

    // Cleanup on unmount or studioId change
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [studioId, queryClient]);

  return query;
}

/**
 * Hook to get studios by location with realtime updates
 */
export function useStudiosByLocationRealtime(
  centerLat: number,
  centerLng: number,
  radiusKm: number = 10000
) {
  const queryClient = useQueryClient();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const query = useQuery({
    queryKey: studioKeys.location(centerLat, centerLng, radiusKm),
    queryFn: () => StudioService.getStudiosByLocation(centerLat, centerLng, radiusKm), // Initial load
    enabled: !!centerLat && !!centerLng,
    staleTime: Infinity, // Never consider stale since we have realtime updates
    gcTime: Infinity, // Keep in cache indefinitely
  });

  useEffect(() => {
    if (!centerLat || !centerLng) return;

    // Set up realtime listener
    const unsubscribe = StudioService.subscribeToStudiosByLocation(
      centerLat,
      centerLng,
      radiusKm,
      (studios) => {
        // Update React Query cache with realtime data
        queryClient.setQueryData(studioKeys.location(centerLat, centerLng, radiusKm), studios);
      },
      (error) => {
        console.error('Realtime studios by location error:', error);
        // Optionally trigger a refetch on error
        queryClient.invalidateQueries({ queryKey: studioKeys.location(centerLat, centerLng, radiusKm) });
      }
    );

    unsubscribeRef.current = unsubscribe;

    // Cleanup on unmount or parameter change
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [centerLat, centerLng, radiusKm, queryClient]);

  return query;
}

/**
 * Hook to get filtered studios with realtime updates
 */
export function useFilteredStudiosRealtime(
  centerLat?: number,
  centerLng?: number,
  filters?: {
    radiusKm?: number;
    isOpen?: boolean;
    amenities?: string[];
    minRating?: number;
    searchTerm?: string;
  }
) {
  const queryClient = useQueryClient();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Use a reasonable default radius (50km) for local searches
  // If radiusKm is Infinity, we'll load all studios worldwide
  const radiusKm = filters?.radiusKm || 50;
  const isWorldwide = radiusKm === Infinity;

  const query = useQuery({
    queryKey: [...studioKeys.location(centerLat || 0, centerLng || 0, radiusKm), 'filtered', filters],
    queryFn: async () => {
      // Initial load using existing logic
      const allStudios = await StudioService.getStudios();
      let studios: Studio[];
      
      // Apply geo-filtering only if not worldwide and user location exists
      if (isWorldwide || !centerLat || !centerLng) {
        studios = allStudios;
      } else {
        // Use location-based filtering for regular studios
        studios = await StudioService.getStudiosByLocation(centerLat, centerLng, radiusKm);
      }
      
      // Find Fusion Gym (studioId: '1') from all studios
      const fusionGym = allStudios.find(studio => studio.studioId === '1');
      
      // Ensure Fusion Gym is always included if it exists and not already in filtered results
      if (fusionGym && !studios.some(studio => studio.studioId === fusionGym.studioId)) {
        studios = [...studios, fusionGym];
        console.log('🏋️ Fusion Gym added to results (outside radius filter)');
      }
      
      // Apply additional filters
      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        studios = studios.filter(studio => {
          const name = (studio.name ?? '').toLowerCase();
          const address = (studio.address ?? '').toLowerCase();
          return name.includes(searchTerm) || address.includes(searchTerm);
        });
      }
      
      if (filters?.minRating && filters.minRating > 0) {
        studios = studios.filter(studio => 
          (studio.averageRating || 0) >= filters.minRating!
        );
      }
      
      return studios;
    },
    enabled: true,
    staleTime: Infinity, // Never consider stale since we have realtime updates
    gcTime: Infinity, // Keep in cache indefinitely
  });

  useEffect(() => {
    // Set up realtime listener
    const unsubscribe = StudioService.subscribeToStudios(
      (allStudios) => {
        // Apply the same filtering logic as in queryFn
        let studios: Studio[];
        
        // Apply geo-filtering only if not worldwide and user location exists
        if (isWorldwide || !centerLat || !centerLng) {
          studios = allStudios;
        } else {
          // Filter by location client-side
          studios = allStudios.filter(studio => {
            if (!studio.location) return false;
            
            const distance = calculateDistanceHelper(
              centerLat,
              centerLng,
              studio.location.lat,
              studio.location.lng
            );
            
            return distance <= radiusKm;
          });
        }
        
        // Find Fusion Gym (studioId: '1') from all studios
        const fusionGym = allStudios.find(studio => studio.studioId === '1');
        
        // Ensure Fusion Gym is always included if it exists and not already in filtered results
        if (fusionGym && !studios.some(studio => studio.studioId === fusionGym.studioId)) {
          studios = [...studios, fusionGym];
          console.log('🏋️ Fusion Gym added to realtime results (outside radius filter)');
        }
        
        // Apply additional filters
        if (filters?.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          studios = studios.filter(studio => {
            const name = (studio.name ?? '').toLowerCase();
            const address = (studio.address ?? '').toLowerCase();
            return name.includes(searchTerm) || address.includes(searchTerm);
          });
        }
        
        if (filters?.minRating && filters.minRating > 0) {
          studios = studios.filter(studio => 
            (studio.averageRating || 0) >= filters.minRating!
          );
        }
        
        // Update React Query cache with realtime filtered data
        queryClient.setQueryData(
          [...studioKeys.location(centerLat || 0, centerLng || 0, radiusKm), 'filtered', filters],
          studios
        );
      },
      (error) => {
        console.error('Realtime filtered studios error:', error);
        // Optionally trigger a refetch on error
        queryClient.invalidateQueries({ 
          queryKey: [...studioKeys.location(centerLat || 0, centerLng || 0, radiusKm), 'filtered', filters] 
        });
      }
    );

    unsubscribeRef.current = unsubscribe;

    // Cleanup on unmount or parameter change
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [centerLat, centerLng, radiusKm, isWorldwide, filters, queryClient]);

  return query;
}
