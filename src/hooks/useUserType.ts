import { useMemo } from 'react';
import { useAuthUser, useAuthLoading } from '../store';

export type UserType = 'free' | 'premium' | 'expired';

export interface UserTypeInfo {
  userType: UserType;
  isPremium: boolean;
  isFree: boolean;
  isExpired: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to determine user type based on subscriptionStatus field in Firebase
 */
export function useUserType(): UserTypeInfo {
  const user = useAuthUser();
  const authLoading = useAuthLoading();

  const subscriptionStatus = user?.subscriptionStatus || 'free';

  const userTypeInfo = useMemo((): UserTypeInfo => {
    const isPremium = subscriptionStatus === 'active';
    const isFree = subscriptionStatus === 'free' || subscriptionStatus === 'expired';
    const isExpired = subscriptionStatus === 'expired';
    
    let userType: UserType;
    if (subscriptionStatus === 'active') {
      userType = 'premium';
    } else if (subscriptionStatus === 'expired') {
      userType = 'expired';
    } else {
      userType = 'free';
    }

    return {
      userType,
      isPremium,
      isFree,
      isExpired,
      isLoading: authLoading,
      error: null,
    };
  }, [subscriptionStatus, authLoading]);

  return userTypeInfo;
}

/**
 * Hook to check if user has premium access
 */
export function useIsPremium(): boolean {
  const { isPremium } = useUserType();
  return isPremium;
}

/**
 * Hook to check if user is free user
 */
export function useIsFree(): boolean {
  const { isFree } = useUserType();
  return isFree;
}

/**
 * Hook to check if user subscription is expired
 */
export function useIsExpired(): boolean {
  const { isExpired } = useUserType();
  return isExpired;
}

/**
 * Hook to get user type string
 */
export function useUserTypeString(): UserType {
  const { userType } = useUserType();
  return userType;
}
