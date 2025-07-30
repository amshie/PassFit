import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import {
  loadUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  subscribeToUserProfile,
} from '../services/firebase/userService';
import { User } from '../models';

/** Hook: Ein einzelnes User-Objekt laden */
export function useUser(uid: string) {
  return useQuery<User, Error>({
    queryKey: ['user', uid],
    queryFn: () => loadUserProfile(uid),
    enabled: Boolean(uid),
  });
}

/** Hook: Neues User-Profil anlegen */
export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation<
    void,
    Error,
    { uid: string } & Omit<User, 'uid' | 'createdAt'>
  >({
    mutationFn: ({ uid, ...data }) => createUserProfile(uid, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['user', vars.uid] });
    },
  });
}

/** Hook: Bestehendes User-Profil updaten */
export function useUpdateUser(uid: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, Partial<Omit<User, 'uid'>>>(
    {
      mutationFn: data => updateUserProfile(uid, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['user', uid] }),
    }
  );
}

/** Hook: User-Profil löschen */
export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: uid => deleteUserProfile(uid),
    onSuccess: (_, uid) => {
      qc.invalidateQueries({ queryKey: ['user', uid] });
    },
  });
}

/** Hook: Ein User-Objekt mit Echtzeit-Updates laden */
export function useUserRealtime(uid: string) {
  const queryClient = useQueryClient();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Standard Query für initiales Laden und Fallback
  const query = useQuery<User, Error>({
    queryKey: ['user', uid],
    queryFn: () => loadUserProfile(uid),
    enabled: Boolean(uid),
    staleTime: Infinity, // Da wir Echtzeit-Updates haben, nie als stale markieren
  });

  useEffect(() => {
    if (!uid) return;

    // Cleanup vorheriger Listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Neuen Echtzeit-Listener einrichten
    unsubscribeRef.current = subscribeToUserProfile(
      uid,
      (userData) => {
        if (userData) {
          // Ensure subscriptionStatus is always defined
          const userDataWithDefaults = {
            ...userData,
            subscriptionStatus: userData.subscriptionStatus ?? 'free'
          };
          
          // Cache mit neuen Daten aktualisieren
          queryClient.setQueryData(['user', uid], userDataWithDefaults);
          
          // Also update the subscription status cache if it exists
          queryClient.setQueryData(['user', uid, 'subscriptionStatus'], userDataWithDefaults.subscriptionStatus);
        } else {
          // User existiert nicht mehr
          queryClient.setQueryData(['user', uid], null);
          queryClient.setQueryData(['user', uid, 'subscriptionStatus'], 'free');
        }
      },
      (error) => {
        console.error('Realtime user listener error:', error);
        // Bei Fehlern Query als error markieren
        queryClient.setQueryData(['user', uid], () => {
          throw error;
        });
      }
    );

    // Cleanup-Funktion
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [uid, queryClient]);

  // Cleanup beim Unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return query;
}

/** Hook: Nur den subscriptionStatus eines Users in Echtzeit verfolgen */
export function useUserSubscriptionStatus(uid: string) {
  const queryClient = useQueryClient();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Query nur für subscriptionStatus - always returns a defined value
  const query = useQuery<User['subscriptionStatus'], Error>({
    queryKey: ['user', uid, 'subscriptionStatus'],
    queryFn: async () => {
      try {
        const user = await loadUserProfile(uid);
        // Ensure we always return a defined value, default to 'free'
        return user.subscriptionStatus ?? 'free';
      } catch (error) {
        // If user doesn't exist, return 'free' as default
        console.warn(`User ${uid} not found, defaulting to 'free' subscription status`);
        return 'free';
      }
    },
    enabled: Boolean(uid),
    staleTime: Infinity,
    // Provide placeholder data to avoid undefined during loading
    placeholderData: 'free',
  });

  useEffect(() => {
    if (!uid) return;

    // Cleanup vorheriger Listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Echtzeit-Listener nur für subscriptionStatus
    unsubscribeRef.current = subscribeToUserProfile(
      uid,
      (userData) => {
        if (userData) {
          // Ensure we always set a defined value, default to 'free'
          const subscriptionStatus = userData.subscriptionStatus ?? 'free';
          
          // Nur subscriptionStatus Cache aktualisieren
          queryClient.setQueryData(['user', uid, 'subscriptionStatus'], subscriptionStatus);
          
          // Auch den vollständigen User Cache aktualisieren, falls vorhanden
          const existingUser = queryClient.getQueryData<User>(['user', uid]);
          if (existingUser) {
            queryClient.setQueryData(['user', uid], {
              ...existingUser,
              subscriptionStatus: subscriptionStatus,
            });
          }
        } else {
          // User doesn't exist, set to 'free'
          queryClient.setQueryData(['user', uid, 'subscriptionStatus'], 'free');
        }
      },
      (error) => {
        console.error('Realtime subscription status listener error:', error);
        // On error, set to 'free' instead of throwing
        queryClient.setQueryData(['user', uid, 'subscriptionStatus'], 'free');
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [uid, queryClient]);

  // Cleanup beim Unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return query;
}
