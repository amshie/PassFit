import { StateCreator } from 'zustand';
import i18n from '../../locales/i18n';
import { Appearance } from 'react-native';

// Settings state interface
export interface SettingsState {
  // Language settings
  language: 'de' | 'en';
  
  // Theme settings
  themeMode: 'light' | 'dark' | 'system';
  
  // Notification settings
  notifications: boolean;
  
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
      // For now, we'll implement a basic permission check
      // In a real app, you would use expo-notifications or react-native-permissions
      console.log('Notification permissions requested');
      return true; // Assume granted for now
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
      // Get system theme preference
      const systemColorScheme = Appearance.getColorScheme();
      
      // Get current i18n language
      const currentLanguage = i18n.language as 'de' | 'en';
      
      // For now, assume notifications are available
      const hasNotificationPermissions = true;
      
      // Update state with current values (this will be overridden by persisted state if available)
      set({
        language: currentLanguage,
        notifications: hasNotificationPermissions,
      });
      
      console.log('Settings initialized');
    } catch (error) {
      console.error('Failed to initialize settings:', error);
    }
  },
});
