import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  radiusKm: number = 10
) {
  return useQuery({
    queryKey: studioKeys.location(centerLat, centerLng, radiusKm),
    queryFn: () => StudioService.getStudiosByLocation(centerLat, centerLng, radiusKm),
    enabled: !!centerLat && !!centerLng,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
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
