// Auth types
export * from './auth.types';

// User types
export * from './user.types';

// Workout types
export * from './workout.types';

// Map types
export * from './map.types';

// Home types
export * from './home.types';

// Common types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormValidationError {
  field: string;
  message: string;
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  order: SortOrder;
}

export interface FilterConfig {
  [key: string]: any;
}
