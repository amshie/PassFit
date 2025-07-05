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
    // Initialize authentication state when the app starts
    const store = useAppStore.getState();
    
    if (!store.isInitialized) {
      const unsubscribe = store.initializeAuth();
      
      // Cleanup function
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, []);

  return <>{children}</>;
};

export default StoreProvider;
