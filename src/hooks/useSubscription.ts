import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionService } from '../services/api/subscription.service';
import { Subscription } from '../models/subscription';

// Query Keys
export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (filters: string) => [...subscriptionKeys.lists(), { filters }] as const,
  details: () => [...subscriptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...subscriptionKeys.details(), id] as const,
  user: (userId: string) => [...subscriptionKeys.all, 'user', userId] as const,
  userActive: (userId: string) => [...subscriptionKeys.user(userId), 'active'] as const,
  plan: (planId: string) => [...subscriptionKeys.all, 'plan', planId] as const,
  status: (status: Subscription['status']) => [...subscriptionKeys.all, 'status', status] as const,
  expiring: (days: number) => [...subscriptionKeys.all, 'expiring', days] as const,
  stats: () => [...subscriptionKeys.all, 'stats'] as const,
};

/**
 * Hook to get a single subscription by ID
 */
export function useSubscription(subscriptionId: string) {
  return useQuery({
    queryKey: subscriptionKeys.detail(subscriptionId),
    queryFn: () => SubscriptionService.getSubscription(subscriptionId),
    enabled: !!subscriptionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get all subscriptions for a user
 */
export function useUserSubscriptions(userId: string) {
  return useQuery({
    queryKey: subscriptionKeys.user(userId),
    queryFn: () => SubscriptionService.getUserSubscriptions(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get active subscription for a user
 */
export function useActiveUserSubscription(userId: string) {
  return useQuery({
    queryKey: subscriptionKeys.userActive(userId),
    queryFn: () => SubscriptionService.getActiveUserSubscription(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent updates for active status)
  });
}

/**
 * Hook to get subscriptions by plan
 */
export function useSubscriptionsByPlan(planId: string) {
  return useQuery({
    queryKey: subscriptionKeys.plan(planId),
    queryFn: () => SubscriptionService.getSubscriptionsByPlan(planId),
    enabled: !!planId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get subscriptions by status
 */
export function useSubscriptionsByStatus(status: Subscription['status']) {
  return useQuery({
    queryKey: subscriptionKeys.status(status),
    queryFn: () => SubscriptionService.getSubscriptionsByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get expiring subscriptions
 */
export function useExpiringSubscriptions(withinDays: number = 7) {
  return useQuery({
    queryKey: subscriptionKeys.expiring(withinDays),
    queryFn: () => SubscriptionService.getExpiringSubscriptions(withinDays),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get subscription statistics
 */
export function useSubscriptionStats() {
  return useQuery({
    queryKey: subscriptionKeys.stats(),
    queryFn: () => SubscriptionService.getSubscriptionStats(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to check if user has active subscription
 */
export function useHasActiveSubscription(userId: string) {
  return useQuery({
    queryKey: [...subscriptionKeys.userActive(userId), 'check'],
    queryFn: () => SubscriptionService.hasActiveSubscription(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to create a new subscription
 */
export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionData: Omit<Subscription, 'subscriptionId'>) =>
      SubscriptionService.createSubscription(subscriptionData),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.user(variables.userId) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.userActive(variables.userId) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plan(variables.planId) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.status(variables.status) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to create subscription:', error);
    },
  });
}

/**
 * Hook to update subscription status
 */
export function useUpdateSubscriptionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subscriptionId, status }: { subscriptionId: string; status: Subscription['status'] }) =>
      SubscriptionService.updateSubscriptionStatus(subscriptionId, status),
    onSuccess: (_, { subscriptionId }) => {
      // Invalidate specific subscription and related queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(subscriptionId) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.stats() });
      
      // Get the subscription to invalidate user-specific queries
      const subscription = queryClient.getQueryData<Subscription>(
        subscriptionKeys.detail(subscriptionId)
      );
      if (subscription) {
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.user(subscription.userId) });
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.userActive(subscription.userId) });
      }
    },
    onError: (error) => {
      console.error('Failed to update subscription status:', error);
    },
  });
}

/**
 * Hook to update a subscription
 */
export function useUpdateSubscription(subscriptionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Omit<Subscription, 'subscriptionId'>>) =>
      SubscriptionService.updateSubscription(subscriptionId, updates),
    onSuccess: () => {
      // Invalidate specific subscription and related queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(subscriptionId) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.stats() });
      
      // Get the subscription to invalidate user-specific queries
      const subscription = queryClient.getQueryData<Subscription>(
        subscriptionKeys.detail(subscriptionId)
      );
      if (subscription) {
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.user(subscription.userId) });
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.userActive(subscription.userId) });
      }
    },
    onError: (error) => {
      console.error('Failed to update subscription:', error);
    },
  });
}

/**
 * Hook to cancel a subscription
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) =>
      SubscriptionService.cancelSubscription(subscriptionId),
    onSuccess: (_, subscriptionId) => {
      // Invalidate specific subscription and related queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(subscriptionId) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.stats() });
      
      // Get the subscription to invalidate user-specific queries
      const subscription = queryClient.getQueryData<Subscription>(
        subscriptionKeys.detail(subscriptionId)
      );
      if (subscription) {
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.user(subscription.userId) });
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.userActive(subscription.userId) });
      }
    },
    onError: (error) => {
      console.error('Failed to cancel subscription:', error);
    },
  });
}

/**
 * Hook to renew a subscription
 */
export function useRenewSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subscriptionId, extensionDays }: { subscriptionId: string; extensionDays: number }) =>
      SubscriptionService.renewSubscription(subscriptionId, extensionDays),
    onSuccess: (_, { subscriptionId }) => {
      // Invalidate specific subscription and related queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.detail(subscriptionId) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.stats() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.expiring(7) });
      
      // Get the subscription to invalidate user-specific queries
      const subscription = queryClient.getQueryData<Subscription>(
        subscriptionKeys.detail(subscriptionId)
      );
      if (subscription) {
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.user(subscription.userId) });
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.userActive(subscription.userId) });
      }
    },
    onError: (error) => {
      console.error('Failed to renew subscription:', error);
    },
  });
}

/**
 * Hook to delete a subscription
 */
export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) =>
      SubscriptionService.deleteSubscription(subscriptionId),
    onSuccess: (_, subscriptionId) => {
      // Get the subscription before removing to invalidate user-specific queries
      const subscription = queryClient.getQueryData<Subscription>(
        subscriptionKeys.detail(subscriptionId)
      );
      
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: subscriptionKeys.detail(subscriptionId) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.stats() });
      
      if (subscription) {
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.user(subscription.userId) });
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.userActive(subscription.userId) });
      }
    },
    onError: (error) => {
      console.error('Failed to delete subscription:', error);
    },
  });
}

/**
 * Hook to prefetch a subscription (useful for optimistic loading)
 */
export function usePrefetchSubscription() {
  const queryClient = useQueryClient();

  return (subscriptionId: string) => {
    queryClient.prefetchQuery({
      queryKey: subscriptionKeys.detail(subscriptionId),
      queryFn: () => SubscriptionService.getSubscription(subscriptionId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
}

/**
 * Hook to get cached subscription data without triggering a fetch
 */
export function useSubscriptionCache(subscriptionId: string) {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData<Subscription | null>(subscriptionKeys.detail(subscriptionId));
}

/**
 * Hook to manually update subscription cache
 */
export function useUpdateSubscriptionCache() {
  const queryClient = useQueryClient();

  return (subscriptionId: string, updater: (old: Subscription | null) => Subscription | null) => {
    queryClient.setQueryData(subscriptionKeys.detail(subscriptionId), updater);
  };
}
