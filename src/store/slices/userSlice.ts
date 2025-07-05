import { StateCreator } from 'zustand';
import { UserService } from '@/services/api';
import { UserProfile, UserStats } from '@/types';

export interface UserSlice {
  // State
  profile: UserProfile | null;
  stats: UserStats | null;
  isLoadingProfile: boolean;
  isLoadingStats: boolean;
  profileError: string | null;
  statsError: string | null;

  // Actions
  getUserProfile: (uid: string) => Promise<void>;
  updateUserProfile: (uid: string, profileData: Partial<UserProfile>) => Promise<void>;
  getUserStats: (uid: string) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  clearProfileError: () => void;
  clearStatsError: () => void;
  setProfile: (profile: UserProfile | null) => void;
  setStats: (stats: UserStats | null) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  // Initial state
  profile: null,
  stats: null,
  isLoadingProfile: false,
  isLoadingStats: false,
  profileError: null,
  statsError: null,

  // Actions
  getUserProfile: async (uid: string) => {
    set({ isLoadingProfile: true, profileError: null });
    try {
      const profile = await UserService.getUserProfile(uid);
      set({
        profile,
        isLoadingProfile: false,
        profileError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load profile';
      set({
        profileError: errorMessage,
        isLoadingProfile: false,
      });
      throw error;
    }
  },

  updateUserProfile: async (uid: string, profileData: Partial<UserProfile>) => {
    set({ isLoadingProfile: true, profileError: null });
    try {
      await UserService.updateUserProfile(uid, profileData);
      
      // Update local profile state
      const currentProfile = get().profile;
      if (currentProfile) {
        set({
          profile: {
            ...currentProfile,
            ...profileData,
            updatedAt: new Date(),
          },
          isLoadingProfile: false,
        });
      } else {
        // Reload profile if we don't have it locally
        await get().getUserProfile(uid);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      set({
        profileError: errorMessage,
        isLoadingProfile: false,
      });
      throw error;
    }
  },

  getUserStats: async (uid: string) => {
    set({ isLoadingStats: true, statsError: null });
    try {
      const stats = await UserService.getUserStats(uid);
      set({
        stats,
        isLoadingStats: false,
        statsError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load stats';
      set({
        statsError: errorMessage,
        isLoadingStats: false,
      });
      throw error;
    }
  },

  updateUserEmail: async (newEmail: string) => {
    set({ isLoadingProfile: true, profileError: null });
    try {
      await UserService.updateUserEmail(newEmail);
      
      // Update local profile state
      const currentProfile = get().profile;
      if (currentProfile) {
        set({
          profile: {
            ...currentProfile,
            email: newEmail,
            updatedAt: new Date(),
          },
          isLoadingProfile: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update email';
      set({
        profileError: errorMessage,
        isLoadingProfile: false,
      });
      throw error;
    }
  },

  updateUserPassword: async (newPassword: string) => {
    set({ isLoadingProfile: true, profileError: null });
    try {
      await UserService.updateUserPassword(newPassword);
      set({ isLoadingProfile: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      set({
        profileError: errorMessage,
        isLoadingProfile: false,
      });
      throw error;
    }
  },

  clearProfileError: () => {
    set({ profileError: null });
  },

  clearStatsError: () => {
    set({ statsError: null });
  },

  setProfile: (profile: UserProfile | null) => {
    set({ profile });
  },

  setStats: (stats: UserStats | null) => {
    set({ stats });
  },
});
