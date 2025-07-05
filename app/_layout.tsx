import "../global.css";
import { Slot } from "expo-router";
import { StoreProvider } from "@/store/providers/StoreProvider";
import { useEffect } from 'react';
import { AuthService } from '@/services/api';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
      <StoreProvider>
        <Slot />
      </StoreProvider>
    </GestureHandlerRootView>
  );
}
