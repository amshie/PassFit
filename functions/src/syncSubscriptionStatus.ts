import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Cloud Function that automatically synchronizes subscription status
 * from subscriptions/{id} to users/{uid} document
 * 
 * Triggers on any write operation (create, update, delete) to subscriptions collection
 */
export const syncSubscriptionStatus = functions.firestore
  .document('subscriptions/{subscriptionId}')
  .onWrite(async (change, context) => {
    const subscriptionId = context.params.subscriptionId;
    const beforeData = change.before.exists ? change.before.data() : null;
    const afterData = change.after.exists ? change.after.data() : null;

    functions.logger.info(`Subscription sync triggered for ${subscriptionId}`, {
      beforeData,
      afterData,
    });

    try {
      // Handle subscription deletion
      if (!afterData && beforeData) {
        functions.logger.info(`Subscription ${subscriptionId} was deleted`);
        await handleSubscriptionDeletion(beforeData);
        return;
      }

      // Handle subscription creation or update
      if (afterData) {
        functions.logger.info(`Subscription ${subscriptionId} was created/updated`);
        await handleSubscriptionChange(afterData);
        return;
      }

      functions.logger.warn(`No data found for subscription ${subscriptionId}`);
    } catch (error) {
      functions.logger.error(`Error syncing subscription status for ${subscriptionId}:`, error);
      // Don't throw error to prevent infinite retries
    }
  });

/**
 * Handle subscription creation or update
 */
async function handleSubscriptionChange(subscriptionData: any): Promise<void> {
  const { userId, status } = subscriptionData;

  if (!userId) {
    functions.logger.error('No userId found in subscription data');
    return;
  }

  // Map subscription status to user subscriptionStatus enum
  const userSubscriptionStatus = mapSubscriptionStatusToUserStatus(status);

  functions.logger.info(`Mapping subscription status "${status}" to user status "${userSubscriptionStatus}" for user ${userId}`);

  // Update user document
  const userRef = db.collection('users').doc(userId);
  
  await userRef.update({
    subscriptionStatus: userSubscriptionStatus,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info(`Successfully updated user ${userId} subscriptionStatus to "${userSubscriptionStatus}"`);
}

/**
 * Handle subscription deletion
 */
async function handleSubscriptionDeletion(subscriptionData: any): Promise<void> {
  const { userId } = subscriptionData;

  if (!userId) {
    functions.logger.error('No userId found in deleted subscription data');
    return;
  }

  // Check if user has any other active subscriptions
  const activeSubscriptionsQuery = await db
    .collection('subscriptions')
    .where('userId', '==', userId)
    .where('status', '==', 'active')
    .get();

  let userSubscriptionStatus: 'active' | 'free' | 'expired';

  if (!activeSubscriptionsQuery.empty) {
    // User still has active subscriptions
    userSubscriptionStatus = 'active';
    functions.logger.info(`User ${userId} still has ${activeSubscriptionsQuery.size} active subscription(s)`);
  } else {
    // Check for expired subscriptions
    const expiredSubscriptionsQuery = await db
      .collection('subscriptions')
      .where('userId', '==', userId)
      .where('status', '==', 'expired')
      .get();

    if (!expiredSubscriptionsQuery.empty) {
      userSubscriptionStatus = 'expired';
      functions.logger.info(`User ${userId} has expired subscriptions, setting status to expired`);
    } else {
      userSubscriptionStatus = 'free';
      functions.logger.info(`User ${userId} has no active or expired subscriptions, setting status to free`);
    }
  }

  // Update user document
  const userRef = db.collection('users').doc(userId);
  
  await userRef.update({
    subscriptionStatus: userSubscriptionStatus,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info(`Successfully updated user ${userId} subscriptionStatus to "${userSubscriptionStatus}" after subscription deletion`);
}

/**
 * Map subscription status to user subscriptionStatus enum
 */
function mapSubscriptionStatusToUserStatus(
  subscriptionStatus: string
): 'active' | 'free' | 'expired' {
  switch (subscriptionStatus) {
    case 'active':
      return 'active';
    case 'expired':
      return 'expired';
    case 'canceled':
    case 'pending':
    case 'failed':
    default:
      return 'free';
  }
}

/**
 * Helper function to manually sync a user's subscription status
 * This can be called from other functions or triggers
 */
export async function syncUserSubscriptionStatusManually(userId: string): Promise<void> {
  functions.logger.info(`Manually syncing subscription status for user ${userId}`);

  try {
    // Get all subscriptions for the user, ordered by creation date (most recent first)
    const subscriptionsQuery = await db
      .collection('subscriptions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    if (subscriptionsQuery.empty) {
      // No subscriptions found, set to free
      await updateUserSubscriptionStatus(userId, 'free');
      functions.logger.info(`No subscriptions found for user ${userId}, set to free`);
      return;
    }

    // Find the most relevant subscription status
    let userSubscriptionStatus: 'active' | 'free' | 'expired' = 'free';

    for (const doc of subscriptionsQuery.docs) {
      const subscription = doc.data();
      const mappedStatus = mapSubscriptionStatusToUserStatus(subscription.status);

      // Priority: active > expired > free
      if (mappedStatus === 'active') {
        userSubscriptionStatus = 'active';
        break; // Active takes highest priority
      } else if (mappedStatus === 'expired' && userSubscriptionStatus === 'free') {
        userSubscriptionStatus = 'expired';
      }
      // 'free' is the default, so no need to explicitly set it
    }

    await updateUserSubscriptionStatus(userId, userSubscriptionStatus);
    functions.logger.info(`Manually synced user ${userId} subscriptionStatus to "${userSubscriptionStatus}"`);

  } catch (error) {
    functions.logger.error(`Error manually syncing subscription status for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Helper function to update user subscription status
 */
async function updateUserSubscriptionStatus(
  userId: string, 
  status: 'active' | 'free' | 'expired'
): Promise<void> {
  const userRef = db.collection('users').doc(userId);
  
  await userRef.update({
    subscriptionStatus: status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
