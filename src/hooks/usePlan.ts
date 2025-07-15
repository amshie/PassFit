import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlanService } from '../services/api/plan.service';
import { Plan } from '../models/plan';

// Query Keys
export const planKeys = {
  all: ['plans'] as const,
  lists: () => [...planKeys.all, 'list'] as const,
  list: (filters: string) => [...planKeys.lists(), { filters }] as const,
  details: () => [...planKeys.all, 'detail'] as const,
  detail: (id: string) => [...planKeys.details(), id] as const,
  search: (term: string) => [...planKeys.all, 'search', term] as const,
  priceRange: (min: number, max: number) => [...planKeys.all, 'priceRange', { min, max }] as const,
  duration: (days: number) => [...planKeys.all, 'duration', days] as const,
  currency: (currency: string) => [...planKeys.all, 'currency', currency] as const,
  popular: (limit: number) => [...planKeys.all, 'popular', limit] as const,
  stats: () => [...planKeys.all, 'stats'] as const,
};

/**
 * Hook to get a single plan by ID
 */
export function usePlan(planId: string) {
  return useQuery({
    queryKey: planKeys.detail(planId),
    queryFn: () => PlanService.getPlan(planId),
    enabled: !!planId,
    staleTime: 10 * 60 * 1000, // 10 minutes (plans don't change often)
  });
}

/**
 * Hook to get all plans
 */
export function usePlans() {
  return useQuery({
    queryKey: planKeys.lists(),
    queryFn: () => PlanService.getPlans(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to search plans by name or features
 */
export function useSearchPlans(searchTerm: string) {
  return useQuery({
    queryKey: planKeys.search(searchTerm),
    queryFn: () => PlanService.searchPlans(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get plans by price range
 */
export function usePlansByPriceRange(minPriceCents: number, maxPriceCents: number) {
  return useQuery({
    queryKey: planKeys.priceRange(minPriceCents, maxPriceCents),
    queryFn: () => PlanService.getPlansByPriceRange(minPriceCents, maxPriceCents),
    enabled: minPriceCents >= 0 && maxPriceCents > minPriceCents,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get plans by duration
 */
export function usePlansByDuration(durationDays: number) {
  return useQuery({
    queryKey: planKeys.duration(durationDays),
    queryFn: () => PlanService.getPlansByDuration(durationDays),
    enabled: durationDays > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get plans by currency
 */
export function usePlansByCurrency(currency: string) {
  return useQuery({
    queryKey: planKeys.currency(currency),
    queryFn: () => PlanService.getPlansByCurrency(currency),
    enabled: !!currency,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get popular plans
 */
export function usePopularPlans(limit: number = 5) {
  return useQuery({
    queryKey: planKeys.popular(limit),
    queryFn: () => PlanService.getPopularPlans(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes (more frequent updates for popularity)
  });
}

/**
 * Hook to get plan statistics
 */
export function usePlanStats() {
  return useQuery({
    queryKey: planKeys.stats(),
    queryFn: () => PlanService.getPlanStats(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to create a new plan
 */
export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planData: Omit<Plan, 'planId'>) =>
      PlanService.createPlan(planData),
    onSuccess: () => {
      // Invalidate and refetch plan lists and stats
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to create plan:', error);
    },
  });
}

/**
 * Hook to update an existing plan
 */
export function useUpdatePlan(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Omit<Plan, 'planId' | 'createdAt'>>) =>
      PlanService.updatePlan(planId, updates),
    onSuccess: () => {
      // Invalidate specific plan and lists
      queryClient.invalidateQueries({ queryKey: planKeys.detail(planId) });
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
      queryClient.invalidateQueries({ queryKey: planKeys.popular(5) });
    },
    onError: (error) => {
      console.error('Failed to update plan:', error);
    },
  });
}

/**
 * Hook to delete a plan
 */
export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => PlanService.deletePlan(planId),
    onSuccess: (_, planId) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: planKeys.detail(planId) });
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
      queryClient.invalidateQueries({ queryKey: planKeys.popular(5) });
    },
    onError: (error) => {
      console.error('Failed to delete plan:', error);
    },
  });
}

/**
 * Hook to update active subscriber count
 */
export function useUpdateActiveSubscriberCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, count }: { planId: string; count: number }) =>
      PlanService.updateActiveSubscriberCount(planId, count),
    onSuccess: (_, { planId }) => {
      // Invalidate specific plan and related queries
      queryClient.invalidateQueries({ queryKey: planKeys.detail(planId) });
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
      queryClient.invalidateQueries({ queryKey: planKeys.popular(5) });
    },
    onError: (error) => {
      console.error('Failed to update active subscriber count:', error);
    },
  });
}

/**
 * Hook to increment active subscriber count
 */
export function useIncrementActiveSubscriberCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) =>
      PlanService.incrementActiveSubscriberCount(planId),
    onSuccess: (_, planId) => {
      // Invalidate specific plan and related queries
      queryClient.invalidateQueries({ queryKey: planKeys.detail(planId) });
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
      queryClient.invalidateQueries({ queryKey: planKeys.popular(5) });
    },
    onError: (error) => {
      console.error('Failed to increment active subscriber count:', error);
    },
  });
}

/**
 * Hook to decrement active subscriber count
 */
export function useDecrementActiveSubscriberCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) =>
      PlanService.decrementActiveSubscriberCount(planId),
    onSuccess: (_, planId) => {
      // Invalidate specific plan and related queries
      queryClient.invalidateQueries({ queryKey: planKeys.detail(planId) });
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
      queryClient.invalidateQueries({ queryKey: planKeys.popular(5) });
    },
    onError: (error) => {
      console.error('Failed to decrement active subscriber count:', error);
    },
  });
}

/**
 * Hook to prefetch a plan (useful for optimistic loading)
 */
export function usePrefetchPlan() {
  const queryClient = useQueryClient();

  return (planId: string) => {
    queryClient.prefetchQuery({
      queryKey: planKeys.detail(planId),
      queryFn: () => PlanService.getPlan(planId),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };
}

/**
 * Hook to get cached plan data without triggering a fetch
 */
export function usePlanCache(planId: string) {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData<Plan | null>(planKeys.detail(planId));
}

/**
 * Hook to manually update plan cache
 */
export function useUpdatePlanCache() {
  const queryClient = useQueryClient();

  return (planId: string, updater: (old: Plan | null) => Plan | null) => {
    queryClient.setQueryData(planKeys.detail(planId), updater);
  };
}

/**
 * Utility hooks for formatting
 */
export function useFormatPrice() {
  return (priceCents: number, currency: string = 'EUR') =>
    PlanService.formatPrice(priceCents, currency);
}

export function useCalculateMonthlyPrice() {
  return (priceCents: number, durationDays: number) =>
    PlanService.calculateMonthlyPrice(priceCents, durationDays);
}
