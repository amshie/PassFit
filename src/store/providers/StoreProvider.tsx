import React, { useEffect } from 'react';
import { useAppStore } from '../index';

interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Store Provider component that initializes the store and handles global state setup
 */
export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize authentication and settings state when the app starts
    const store = useAppStore.getState();
    let unsubscribe: (() => void) | undefined;

    if (!store.isInitialized) {
      unsubscribe = store.initializeAuth();
    }

    store.initializeSettings();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return <>{children}</>;
};

export default StoreProvider;
