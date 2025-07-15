import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import {
  // Studio hooks
  useStudios,
  useTopRatedStudios,
  useCreateStudio,
  useUpdateStudio,
  
  // Subscription hooks
  useUserSubscriptions,
  useActiveUserSubscription,
  useExpiringSubscriptions,
  useCreateSubscription,
  
  // Plan hooks
  usePlans,
  usePopularPlans,
  usePlansByPriceRange,
  useCreatePlan,
  useFormatPrice,
  useCalculateMonthlyPrice,
} from '../../hooks';

interface HooksExampleProps {
  userId?: string;
  studioId?: string;
  planId?: string;
}

export const HooksExample: React.FC<HooksExampleProps> = ({
  userId = 'example-user-id',
  studioId = 'example-studio-id',
  planId = 'example-plan-id'
}) => {
  // Studio hooks examples
  const { data: studios, isLoading: studiosLoading } = useStudios();
  const { data: topStudios } = useTopRatedStudios(5);
  
  const createStudioMutation = useCreateStudio();
  const updateStudioMutation = useUpdateStudio(studioId);

  // Subscription hooks examples
  const { data: userSubscriptions } = useUserSubscriptions(userId);
  const { data: activeSubscription } = useActiveUserSubscription(userId);
  const { data: expiringSubscriptions } = useExpiringSubscriptions(7);
  
  const createSubscriptionMutation = useCreateSubscription();

  // Plan hooks examples
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: popularPlans } = usePopularPlans(3);
  const { data: affordablePlans } = usePlansByPriceRange(0, 5000); // 0-50 EUR
  
  const createPlanMutation = useCreatePlan();

  // Utility hooks
  const formatPrice = useFormatPrice();
  const calculateMonthlyPrice = useCalculateMonthlyPrice();

  // Example handlers
  const handleCreateStudio = () => {
    createStudioMutation.mutate({
      name: 'New Fitness Studio',
      address: '123 Main St, City',
      location: { lat: 52.5200, lng: 13.4050 },
      createdAt: new Date() as any,
    });
  };

  const handleUpdateStudio = () => {
    updateStudioMutation.mutate({
      name: 'Updated Studio Name',
      averageRating: 4.8,
    });
  };

  const handleCreateSubscription = () => {
    if (planId) {
      createSubscriptionMutation.mutate({
        userId,
        planId,
        startedAt: new Date() as any,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) as any, // 30 days
        status: 'active',
      });
    }
  };

  const handleCreatePlan = () => {
    createPlanMutation.mutate({
      name: 'Premium Monthly',
      priceCents: 2999, // 29.99 EUR
      currency: 'EUR',
      durationDays: 30,
      features: ['Gym Access', 'Group Classes', 'Personal Trainer'],
      createdAt: new Date() as any,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>React Query Hooks Examples</Text>

      {/* Studios Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Studios</Text>
        
        <Text style={styles.label}>All Studios ({studios?.length || 0}):</Text>
        {studiosLoading ? (
          <Text>Loading studios...</Text>
        ) : (
          studios?.slice(0, 3).map(studio => (
            <Text key={studio.studioId} style={styles.item}>
              • {studio.name} - Rating: {studio.averageRating || 'N/A'}
            </Text>
          ))
        )}

        <Text style={styles.label}>Top Rated Studios:</Text>
        {topStudios?.map(studio => (
          <Text key={studio.studioId} style={styles.item}>
            • {studio.name} - {studio.averageRating}⭐
          </Text>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleCreateStudio}>
          <Text style={styles.buttonText}>Create New Studio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleUpdateStudio}>
          <Text style={styles.buttonText}>Update Studio</Text>
        </TouchableOpacity>
      </View>

      {/* Subscriptions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscriptions</Text>
        
        <Text style={styles.label}>User Subscriptions:</Text>
        {userSubscriptions?.map(sub => (
          <Text key={sub.subscriptionId} style={styles.item}>
            • {sub.status} - Expires: {sub.expiresAt.toDate().toLocaleDateString()}
          </Text>
        ))}

        <Text style={styles.label}>Active Subscription:</Text>
        {activeSubscription ? (
          <Text style={styles.item}>
            • Plan: {activeSubscription.planId} - Status: {activeSubscription.status}
          </Text>
        ) : (
          <Text style={styles.item}>No active subscription</Text>
        )}

        <Text style={styles.label}>Expiring Soon ({expiringSubscriptions?.length || 0}):</Text>
        {expiringSubscriptions?.slice(0, 2).map(sub => (
          <Text key={sub.subscriptionId} style={styles.item}>
            • Expires: {sub.expiresAt.toDate().toLocaleDateString()}
          </Text>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleCreateSubscription}>
          <Text style={styles.buttonText}>Create Subscription</Text>
        </TouchableOpacity>
      </View>

      {/* Plans Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plans</Text>
        
        <Text style={styles.label}>All Plans ({plans?.length || 0}):</Text>
        {plansLoading ? (
          <Text>Loading plans...</Text>
        ) : (
          plans?.slice(0, 3).map(plan => (
            <Text key={plan.planId} style={styles.item}>
              • {plan.name} - {formatPrice(plan.priceCents, plan.currency)}
              {plan.durationDays !== 30 && (
                <Text> (Monthly: {formatPrice(calculateMonthlyPrice(plan.priceCents, plan.durationDays), plan.currency)})</Text>
              )}
            </Text>
          ))
        )}

        <Text style={styles.label}>Popular Plans:</Text>
        {popularPlans?.map(plan => (
          <Text key={plan.planId} style={styles.item}>
            • {plan.name} - {plan.activeSubscriberCount} subscribers
          </Text>
        ))}

        <Text style={styles.label}>Affordable Plans (Under 50€):</Text>
        {affordablePlans?.slice(0, 2).map(plan => (
          <Text key={plan.planId} style={styles.item}>
            • {plan.name} - {formatPrice(plan.priceCents, plan.currency)}
          </Text>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleCreatePlan}>
          <Text style={styles.buttonText}>Create New Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Mutation Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mutation Status</Text>
        
        {createStudioMutation.isPending && <Text style={styles.status}>Creating studio...</Text>}
        {createStudioMutation.isSuccess && <Text style={styles.success}>Studio created!</Text>}
        {createStudioMutation.isError && <Text style={styles.error}>Error creating studio</Text>}
        
        {createSubscriptionMutation.isPending && <Text style={styles.status}>Creating subscription...</Text>}
        {createSubscriptionMutation.isSuccess && <Text style={styles.success}>Subscription created!</Text>}
        
        {createPlanMutation.isPending && <Text style={styles.status}>Creating plan...</Text>}
        {createPlanMutation.isSuccess && <Text style={styles.success}>Plan created!</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: '#666',
  },
  item: {
    fontSize: 12,
    marginLeft: 8,
    marginBottom: 2,
    color: '#444',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  status: {
    color: '#007AFF',
    fontSize: 12,
  },
  success: {
    color: '#34C759',
    fontSize: 12,
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
  },
});

export default HooksExample;
