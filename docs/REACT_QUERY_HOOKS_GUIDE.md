# React Query Hooks Integration Guide

This guide explains how to use the comprehensive React Query hooks that have been created for the PassFit application. These hooks provide a clean separation between UI components and data layer logic, encapsulating all Firestore operations and cache management.

## Overview

The following hooks have been implemented:

- **Studio Hooks** (`useStudio.ts`) - For managing fitness studios
- **Subscription Hooks** (`useSubscription.ts`) - For managing user subscriptions
- **Plan Hooks** (`usePlan.ts`) - For managing subscription plans
- **User Hooks** (`useUser.ts`) - For managing user profiles (existing)

## Architecture Benefits

### 1. Clean Separation of Concerns
- UI components focus only on presentation logic
- Data fetching and caching logic is encapsulated in hooks
- Firestore operations are abstracted away from components

### 2. Automatic Cache Management
- React Query handles caching, background updates, and stale data
- Optimistic updates and error handling built-in
- Automatic refetching and invalidation

### 3. Type Safety
- Full TypeScript support with proper typing
- IntelliSense support for all hook parameters and return values

### 4. Performance Optimization
- Automatic deduplication of requests
- Background refetching for fresh data
- Configurable stale times for different data types

## Studio Hooks

### Query Hooks

```typescript
import { useStudios, useStudio, useSearchStudios, useTopRatedStudios } from '../hooks';

// Get all studios
const { data: studios, isLoading, error } = useStudios();

// Get a specific studio
const { data: studio } = useStudio(studioId);

// Search studios
const { data: searchResults } = useSearchStudios('fitness center');

// Get top rated studios
const { data: topStudios } = useTopRatedStudios(5);

// Get studios by location
const { data: nearbyStudios } = useStudiosByLocation(52.5200, 13.4050, 10);
```

### Mutation Hooks

```typescript
import { useCreateStudio, useUpdateStudio, useDeleteStudio } from '../hooks';

// Create studio
const createStudio = useCreateStudio();
createStudio.mutate({
  name: 'New Fitness Studio',
  address: '123 Main St',
  location: { lat: 52.5200, lng: 13.4050 },
  createdAt: Timestamp.now()
});

// Update studio
const updateStudio = useUpdateStudio(studioId);
updateStudio.mutate({
  name: 'Updated Name',
  averageRating: 4.8
});

// Delete studio
const deleteStudio = useDeleteStudio();
deleteStudio.mutate(studioId);
```

## Subscription Hooks

### Query Hooks

```typescript
import { 
  useUserSubscriptions, 
  useActiveUserSubscription, 
  useSubscriptionsByStatus,
  useExpiringSubscriptions 
} from '../hooks';

// Get all user subscriptions
const { data: subscriptions } = useUserSubscriptions(userId);

// Get active subscription
const { data: activeSubscription } = useActiveUserSubscription(userId);

// Get subscriptions by status
const { data: activeSubscriptions } = useSubscriptionsByStatus('active');

// Get expiring subscriptions
const { data: expiring } = useExpiringSubscriptions(7); // within 7 days
```

### Mutation Hooks

```typescript
import { 
  useCreateSubscription, 
  useCancelSubscription, 
  useRenewSubscription 
} from '../hooks';

// Create subscription
const createSubscription = useCreateSubscription();
createSubscription.mutate({
  userId: 'user123',
  planId: 'plan456',
  startedAt: Timestamp.now(),
  expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
  status: 'active'
});

// Cancel subscription
const cancelSubscription = useCancelSubscription();
cancelSubscription.mutate(subscriptionId);

// Renew subscription
const renewSubscription = useRenewSubscription();
renewSubscription.mutate({
  subscriptionId: 'sub123',
  extensionDays: 30
});
```

## Plan Hooks

### Query Hooks

```typescript
import { 
  usePlans, 
  usePlan, 
  usePopularPlans, 
  usePlansByPriceRange,
  usePlansByDuration 
} from '../hooks';

// Get all plans
const { data: plans } = usePlans();

// Get specific plan
const { data: plan } = usePlan(planId);

// Get popular plans
const { data: popularPlans } = usePopularPlans(5);

// Get plans by price range (in cents)
const { data: affordablePlans } = usePlansByPriceRange(0, 5000); // 0-50 EUR

// Get plans by duration
const { data: monthlyPlans } = usePlansByDuration(30);
```

### Mutation Hooks

```typescript
import { 
  useCreatePlan, 
  useUpdatePlan, 
  useIncrementActiveSubscriberCount 
} from '../hooks';

// Create plan
const createPlan = useCreatePlan();
createPlan.mutate({
  name: 'Premium Monthly',
  priceCents: 2999, // 29.99 EUR
  currency: 'EUR',
  durationDays: 30,
  features: ['Gym Access', 'Group Classes'],
  createdAt: Timestamp.now()
});

// Update plan
const updatePlan = useUpdatePlan(planId);
updatePlan.mutate({
  name: 'Updated Plan Name',
  priceCents: 3499
});

// Update subscriber count
const incrementCount = useIncrementActiveSubscriberCount();
incrementCount.mutate(planId);
```

### Utility Hooks

```typescript
import { useFormatPrice, useCalculateMonthlyPrice } from '../hooks';

// Format price for display
const formatPrice = useFormatPrice();
const formattedPrice = formatPrice(2999, 'EUR'); // "29,99 €"

// Calculate monthly price for different durations
const calculateMonthlyPrice = useCalculateMonthlyPrice();
const monthlyPrice = calculateMonthlyPrice(8999, 90); // 3-month plan to monthly
```

## Advanced Usage

### Cache Management

```typescript
import { usePrefetchStudio, useStudioCache, useUpdateStudioCache } from '../hooks';

// Prefetch data for better UX
const prefetchStudio = usePrefetchStudio();
prefetchStudio(studioId); // Prefetch before navigation

// Get cached data without triggering fetch
const cachedStudio = useStudioCache(studioId);

// Manually update cache
const updateCache = useUpdateStudioCache();
updateCache(studioId, (old) => ({
  ...old,
  averageRating: 4.9
}));
```

### Error Handling

```typescript
const { data, error, isError, isLoading } = useStudios();

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorMessage error={error} />;

return <StudioList studios={data} />;
```

### Optimistic Updates

```typescript
const updateStudio = useUpdateStudio(studioId);

const handleRating = async (newRating: number) => {
  // Optimistically update the cache
  const updateCache = useUpdateStudioCache();
  updateCache(studioId, (old) => ({
    ...old,
    averageRating: newRating
  }));

  // Perform the actual update
  try {
    await updateStudio.mutateAsync({ averageRating: newRating });
  } catch (error) {
    // Revert on error
    updateCache(studioId, (old) => ({
      ...old,
      averageRating: old?.averageRating // Revert to original
    }));
  }
};
```

## Component Integration Examples

### Studio List Component

```typescript
import React from 'react';
import { useStudios, useTopRatedStudios } from '../hooks';

export const StudioList: React.FC = () => {
  const { data: studios, isLoading } = useStudios();
  const { data: topStudios } = useTopRatedStudios(3);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Top Rated Studios</h2>
      {topStudios?.map(studio => (
        <StudioCard key={studio.studioId} studio={studio} />
      ))}
      
      <h2>All Studios</h2>
      {studios?.map(studio => (
        <StudioCard key={studio.studioId} studio={studio} />
      ))}
    </div>
  );
};
```

### Subscription Management Component

```typescript
import React from 'react';
import { useActiveUserSubscription, useCancelSubscription } from '../hooks';

export const SubscriptionManager: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: subscription } = useActiveUserSubscription(userId);
  const cancelSubscription = useCancelSubscription();

  const handleCancel = () => {
    if (subscription) {
      cancelSubscription.mutate(subscription.subscriptionId);
    }
  };

  if (!subscription) {
    return <div>No active subscription</div>;
  }

  return (
    <div>
      <h3>Active Subscription</h3>
      <p>Status: {subscription.status}</p>
      <p>Expires: {subscription.expiresAt.toDate().toLocaleDateString()}</p>
      <button onClick={handleCancel} disabled={cancelSubscription.isPending}>
        {cancelSubscription.isPending ? 'Canceling...' : 'Cancel Subscription'}
      </button>
    </div>
  );
};
```

## Best Practices

### 1. Use Appropriate Stale Times
- User data: 1-2 minutes (changes frequently)
- Plans: 10-15 minutes (changes rarely)
- Studios: 5-10 minutes (moderate changes)

### 2. Handle Loading and Error States
Always provide proper loading and error handling in your components.

### 3. Leverage Prefetching
Use prefetch hooks for better user experience, especially before navigation.

### 4. Optimize Re-renders
Use React.memo and useMemo for expensive computations with hook data.

### 5. Cache Invalidation
The hooks automatically handle cache invalidation, but you can manually invalidate when needed.

## Configuration

### Query Client Setup
Ensure your app is wrapped with the QueryClient provider:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <YourApp />
  </QueryClientProvider>
);
```

## Testing

### Mock Hooks for Testing

```typescript
import { jest } from '@jest/globals';

// Mock the hooks module
jest.mock('../hooks', () => ({
  useStudios: jest.fn(),
  useCreateStudio: jest.fn(),
  // ... other hooks
}));

// In your test
const mockUseStudios = useStudios as jest.MockedFunction<typeof useStudios>;
mockUseStudios.mockReturnValue({
  data: [{ studioId: '1', name: 'Test Studio' }],
  isLoading: false,
  error: null
});
```

## Troubleshooting

### Common Issues

1. **Stale Data**: Adjust stale times or manually invalidate queries
2. **Memory Leaks**: Ensure proper cleanup in useEffect hooks
3. **Type Errors**: Check that your models match the Firestore data structure
4. **Performance**: Use React DevTools Profiler to identify unnecessary re-renders

### Debug Mode

Enable React Query DevTools for debugging:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

This comprehensive hook system provides a robust foundation for data management in your PassFit application, ensuring clean code, optimal performance, and excellent developer experience.
