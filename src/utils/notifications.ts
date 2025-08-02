import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

/**
 * Registers the device for push notifications and returns the Expo push token
 * along with the permission status.
 */
export async function registerForPushNotifications(): Promise<{ token: string | null; granted: boolean }> {
  try {
    // Configure Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not already granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return { token: null, granted: false };
    }

    // Get Expo push token
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) {
      console.warn('Expo project ID is not configured');
      return { token: null, granted: false };
    }
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    return { token, granted: true };
  } catch (error) {
    console.error('Failed to register for push notifications:', error);
    return { token: null, granted: false };
  }
}
