import "../global.css";
import { Slot } from "expo-router";
import { StoreProvider } from "@/store/providers/StoreProvider";
import { useEffect } from 'react';
import { AuthService } from '@/services/api';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ✅ QueryClient für React Query erstellen
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 Minuten
      gcTime: 10 * 60 * 1000, // 10 Minuten (früher cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    // Initialize Google Sign-In when app starts
    const initializeGoogleSignIn = async () => {
      try {
        await AuthService.initializeGoogleSignIn();
        console.log('Google Sign-In initialized successfully');
      } catch (error) {
        console.log('Google Sign-In initialization failed:', error);
        // This is expected if Google credentials are not configured yet
      }
    };

    initializeGoogleSignIn();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* ✅ QueryClientProvider für React Query Hooks */}
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <Slot />
        </StoreProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
