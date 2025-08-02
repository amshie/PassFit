import { StateCreator } from 'zustand';
import i18n from '../../locales/i18n';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { registerForPushNotifications } from '../../utils/notifications';

// Settings state interface
export interface SettingsState {
  // Language settings
  language: 'de' | 'en';
  
  // Theme settings
  themeMode: 'light' | 'dark' | 'system';
  
  // Notification settings
  notifications: boolean;
  expoPushToken: string | null;
  
  // Loading states
  isChangingLanguage: boolean;
  isChangingTheme: boolean;
  isChangingNotifications: boolean;
  
  // Error states
  languageError: string | null;
  themeError: string | null;
  notificationsError: string | null;
}

// Settings actions interface
export interface SettingsActions {
  // Language actions
  changeLanguage: (language: 'de' | 'en') => Promise<void>;
  
  // Theme actions
  changeThemeMode: (mode: 'light' | 'dark' | 'system') => Promise<void>;
  
  // Notification actions
  toggleNotifications: (enabled: boolean) => Promise<void>;
  requestNotificationPermissions: () => Promise<boolean>;
  
  // Error clearing actions
  clearLanguageError: () => void;
  clearThemeError: () => void;
  clearNotificationsError: () => void;
  
  // Initialize settings
  initializeSettings: () => Promise<void>;
}

// Combined settings slice type
export type SettingsSlice = SettingsState & SettingsActions;

// Default settings state
const defaultSettingsState: SettingsState = {
  language: 'de',
  themeMode: 'system',
  notifications: true,
  expoPushToken: null,
  isChangingLanguage: false,
  isChangingTheme: false,
  isChangingNotifications: false,
  languageError: null,
  themeError: null,
  notificationsError: null,
};

// Create settings slice
export const createSettingsSlice: StateCreator<
  SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  ...defaultSettingsState,

  // Language actions
  changeLanguage: async (language: 'de' | 'en') => {
    set({ isChangingLanguage: true, languageError: null });
    
    try {
      // Change i18n language
      await i18n.changeLanguage(language);
      
      // Update state
      set({ 
        language,
        isChangingLanguage: false 
      });
      
      console.log(`Language changed to: ${language}`);
    } catch (error) {
      console.error('Failed to change language:', error);
      set({ 
        languageError: 'Failed to change language',
        isChangingLanguage: false 
      });
    }
  },

  // Theme actions
  changeThemeMode: async (mode: 'light' | 'dark' | 'system') => {
    set({ isChangingTheme: true, themeError: null });
    
    try {
      // Update state
      set({ 
        themeMode: mode,
        isChangingTheme: false 
      });
      
      console.log(`Theme mode changed to: ${mode}`);
    } catch (error) {
      console.error('Failed to change theme mode:', error);
      set({ 
        themeError: 'Failed to change theme mode',
        isChangingTheme: false 
      });
    }
  },

  // Notification actions
  toggleNotifications: async (enabled: boolean) => {
    set({ isChangingNotifications: true, notificationsError: null });

    try {
      if (enabled) {
        // Request permissions when enabling notifications
        const hasPermission = await get().requestNotificationPermissions();
        if (!hasPermission) {
          set({
            notificationsError: 'Notification permissions denied',
            isChangingNotifications: false
          });
          return;
        }
      }

      // Update state
      set({
        notifications: enabled,
        expoPushToken: enabled ? get().expoPushToken : null,
        isChangingNotifications: false
      });
      
      console.log(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
      set({ 
        notificationsError: 'Failed to change notification settings',
        isChangingNotifications: false 
      });
    }
  },

  requestNotificationPermissions: async (): Promise<boolean> => {
    try {
      const { token, granted } = await registerForPushNotifications();
      if (granted && token) {
        set({ expoPushToken: token });
      }
      return granted;
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  },

  // Error clearing actions
  clearLanguageError: () => set({ languageError: null }),
  clearThemeError: () => set({ themeError: null }),
  clearNotificationsError: () => set({ notificationsError: null }),

  // Initialize settings
  initializeSettings: async () => {
    try {
      // Get current i18n language
      const currentLanguage = i18n.language as 'de' | 'en';
      
      // Check current notification permissions
      const { status } = await Notifications.getPermissionsAsync();
      const hasNotificationPermissions = status === 'granted';
      let token: string | null = null;
      if (hasNotificationPermissions) {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      }

      // Update state with current values (this will be overridden by persisted state if available)
      set({
        language: currentLanguage,
        notifications: hasNotificationPermissions,
        expoPushToken: token,
      });
      
      console.log('Settings initialized');
    } catch (error) {
      console.error('Failed to initialize settings:', error);
    }
  },
});
