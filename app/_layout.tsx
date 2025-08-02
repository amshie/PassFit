import "../global.css";
import { Slot } from "expo-router";
import { StoreProvider } from "@/store/providers/StoreProvider";
import { ThemeProvider } from "../src/providers/ThemeProvider";
import { useEffect } from 'react';
import { AuthService } from '@/services/api';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import '@/locales/i18n'; // Initialize i18n

// ✅ QueryClient für React Query mit Offline-Persistierung erstellen
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 24 * 60 * 60 * 1000, // 24 Stunden für Offline-Modus
      gcTime: 24 * 60 * 60 * 1000, // 24 Stunden Cache-Zeit
    },
    mutations: {
      retry: 1,
    },
  },
});

// ✅ AsyncStorage Persister für Offline-Funktionalität
const asyncStoragePersister = {
  persistClient: async (client: any) => {
    try {
      await AsyncStorage.setItem('PASSFIT_QUERY_CACHE', JSON.stringify(client));
    } catch (error) {
      console.error('Failed to persist query client:', error);
    }
  },
  restoreClient: async () => {
    try {
      const cached = await AsyncStorage.getItem('PASSFIT_QUERY_CACHE');
      return cached ? JSON.parse(cached) : undefined;
    } catch (error) {
      console.error('Failed to restore query client:', error);
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      await AsyncStorage.removeItem('PASSFIT_QUERY_CACHE');
    } catch (error) {
      console.error('Failed to remove query client:', error);
    }
  },
};

// ✅ Query Client Persistierung konfigurieren
persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
  maxAge: 24 * 60 * 60 * 1000, // 24 Stunden
});

// Configure foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    // Initialize Google Sign-In when app starts
    const initializeGoogleSignIn = async () => {
      try {
        if (AuthService.isGoogleSignInAvailable()) {
          AuthService.initializeGoogleSignIn();
          console.log('Google Sign-In initialized successfully');
        } else {
          console.log('Google Sign-In not available - running in Expo Go. Use email/password authentication or create a development build for Google Sign-In.');
        }
      } catch (error) {
        console.warn('Google Sign-In initialization failed:', error);
        // This is expected if running in Expo Go or if Google credentials are not configured
      }
    };

    initializeGoogleSignIn();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* ✅ QueryClientProvider für React Query Hooks */}
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <ThemeProvider>
            <Slot />
          </ThemeProvider>
        </StoreProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
