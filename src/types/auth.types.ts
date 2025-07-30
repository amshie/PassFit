export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string | undefined;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  subscriptionStatus?: 'active' | 'free' | 'expired';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthError {
  code: string;
  message: string;
}
