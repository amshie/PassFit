import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckInService } from '../services/api/checkin.service';
import { CheckIn } from '../models/checkIn';

// Query Keys
export const checkInKeys = {
  all: ['checkIns'] as const,
  lists: () => [...checkInKeys.all, 'list'] as const,
  list: (filters: string) => [...checkInKeys.lists(), { filters }] as const,
  details: () => [...checkInKeys.all, 'detail'] as const,
  detail: (id: string) => [...checkInKeys.details(), id] as const,
  user: (userId: string) => [...checkInKeys.all, 'user', userId] as const,
  userHistory: (userId: string, startDate: Date, endDate: Date) => 
    [...checkInKeys.user(userId), 'history', { startDate: startDate.toISOString(), endDate: endDate.toISOString() }] as const,
  userStats: (userId: string) => [...checkInKeys.user(userId), 'stats'] as const,
  userCount: (userId: string) => [...checkInKeys.user(userId), 'count'] as const,
  userMostVisited: (userId: string, limit: number) => [...checkInKeys.user(userId), 'mostVisited', limit] as const,
  studio: (studioId: string) => [...checkInKeys.all, 'studio', studioId] as const,
  studioCount: (studioId: string) => [...checkInKeys.studio(studioId), 'count'] as const,
  hasCheckedInToday: (userId: string, studioId: string) => 
    [...checkInKeys.all, 'hasCheckedInToday', { userId, studioId }] as const,
  canCheckIn: (userId: string) => [...checkInKeys.all, 'canCheckIn', userId] as const,
  recent: (limit: number) => [...checkInKeys.all, 'recent', limit] as const,
};

/**
 * Hook to get user's check-ins
 */
export function useUserCheckIns(userId: string, limit: number = 50) {
  return useQuery({
    queryKey: checkInKeys.user(userId),
    queryFn: () => CheckInService.getUserCheckIns(userId, limit),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get studio's check-ins
 */
export function useStudioCheckIns(studioId: string, limit: number = 100) {
  return useQuery({
    queryKey: checkInKeys.studio(studioId),
    queryFn: () => CheckInService.getStudioCheckIns(studioId, limit),
    enabled: !!studioId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to check if user has checked in today at a specific studio
 */
export function useHasCheckedInToday(userId: string, studioId: string) {
  return useQuery({
    queryKey: checkInKeys.hasCheckedInToday(userId, studioId),
    queryFn: () => CheckInService.hasCheckedInToday(userId, studioId),
    enabled: !!userId && !!studioId,
    staleTime: 30 * 1000, // 30 seconds (frequent updates for check-in status)
  });
}

/**
 * Hook to get user's check-in history for a date range
 */
export function useUserCheckInHistory(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  return useQuery({
    queryKey: checkInKeys.userHistory(userId, startDate, endDate),
    queryFn: () => CheckInService.getUserCheckInHistory(userId, startDate, endDate),
    enabled: !!userId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get user's check-in statistics
 */
export function useUserCheckInStats(userId: string) {
  return useQuery({
    queryKey: checkInKeys.userStats(userId),
    queryFn: () => CheckInService.getUserCheckInStats(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get user's total check-in count
 */
export function useUserCheckInCount(userId: string) {
  return useQuery({
    queryKey: checkInKeys.userCount(userId),
    queryFn: () => CheckInService.getUserCheckInCount(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get studio's total check-in count
 */
export function useStudioCheckInCount(studioId: string) {
  return useQuery({
    queryKey: checkInKeys.studioCount(studioId),
    queryFn: () => CheckInService.getStudioCheckInCount(studioId),
    enabled: !!studioId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get user's most visited studios
 */
export function useUserMostVisitedStudios(userId: string, limit: number = 5) {
  return useQuery({
    queryKey: checkInKeys.userMostVisited(userId, limit),
    queryFn: () => CheckInService.getUserMostVisitedStudios(userId, limit),
    enabled: !!userId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to check if user can check in
 */
export function useCanUserCheckIn(userId: string) {
  return useQuery({
    queryKey: checkInKeys.canCheckIn(userId),
    queryFn: () => CheckInService.canUserCheckIn(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get recent check-ins (for admin)
 */
export function useRecentCheckIns(limit: number = 50) {
  return useQuery({
    queryKey: checkInKeys.recent(limit),
    queryFn: () => CheckInService.getRecentCheckIns(limit),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to create a new check-in
 */
export function useCreateCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, studioId }: { userId: string; studioId: string }) =>
      CheckInService.createCheckIn(userId, studioId),
    onSuccess: (_, { userId, studioId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: checkInKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: checkInKeys.userStats(userId) });
      queryClient.invalidateQueries({ queryKey: checkInKeys.userCount(userId) });
      queryClient.invalidateQueries({ queryKey: checkInKeys.userMostVisited(userId, 5) });
      queryClient.invalidateQueries({ queryKey: checkInKeys.studio(studioId) });
      queryClient.invalidateQueries({ queryKey: checkInKeys.studioCount(studioId) });
      queryClient.invalidateQueries({ queryKey: checkInKeys.hasCheckedInToday(userId, studioId) });
      queryClient.invalidateQueries({ queryKey: checkInKeys.recent(50) });
      
      // Update the hasCheckedInToday cache immediately for better UX
      queryClient.setQueryData(
        checkInKeys.hasCheckedInToday(userId, studioId),
        true
      );
    },
    onError: (error) => {
      console.error('Failed to create check-in:', error);
    },
  });
}

/**
 * Hook to prefetch user check-ins (useful for optimistic loading)
 */
export function usePrefetchUserCheckIns() {
  const queryClient = useQueryClient();

  return (userId: string, limit: number = 50) => {
    queryClient.prefetchQuery({
      queryKey: checkInKeys.user(userId),
      queryFn: () => CheckInService.getUserCheckIns(userId, limit),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };
}

/**
 * Hook to prefetch studio check-ins
 */
export function usePrefetchStudioCheckIns() {
  const queryClient = useQueryClient();

  return (studioId: string, limit: number = 100) => {
    queryClient.prefetchQuery({
      queryKey: checkInKeys.studio(studioId),
      queryFn: () => CheckInService.getStudioCheckIns(studioId, limit),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
}

/**
 * Hook to get cached check-in data without triggering a fetch
 */
export function useCheckInCache(userId: string) {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData<CheckIn[]>(checkInKeys.user(userId));
}

/**
 * Hook to manually update check-in cache
 */
export function useUpdateCheckInCache() {
  const queryClient = useQueryClient();

  return (userId: string, updater: (old: CheckIn[] | undefined) => CheckIn[]) => {
    queryClient.setQueryData(checkInKeys.user(userId), updater);
  };
}

/**
 * Hook to invalidate all check-in related queries for a user
 */
export function useInvalidateUserCheckIns() {
  const queryClient = useQueryClient();

  return (userId: string) => {
    queryClient.invalidateQueries({ queryKey: checkInKeys.user(userId) });
    queryClient.invalidateQueries({ queryKey: checkInKeys.userStats(userId) });
    queryClient.invalidateQueries({ queryKey: checkInKeys.userCount(userId) });
    queryClient.invalidateQueries({ queryKey: checkInKeys.userMostVisited(userId, 5) });
  };
}
