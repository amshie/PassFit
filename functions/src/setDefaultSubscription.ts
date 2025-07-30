import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

export const setDefaultSubscription = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap: functions.firestore.DocumentSnapshot, context: functions.EventContext) => {
    const userId = context.params.userId;
    const userDoc = snap.data();

    // Only set subscriptionStatus if it does not exist
    if (!userDoc?.subscriptionStatus) {
      await db.collection("users").doc(userId).update({ subscriptionStatus: "free" });
      functions.logger.info(`Set default subscriptionStatus to "free" for user ${userId}`);
    } else {
      functions.logger.info(`User ${userId} already has subscriptionStatus set`);
    }
  });
