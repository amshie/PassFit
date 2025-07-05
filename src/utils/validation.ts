/**
 * Validation utility functions for form inputs and data validation
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email validation
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Password validation
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one letter' };
  }

  return { isValid: true };
};

/**
 * Confirm password validation
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
};

/**
 * Display name validation
 */
export const validateDisplayName = (displayName: string): ValidationResult => {
  if (!displayName) {
    return { isValid: false, error: 'Display name is required' };
  }

  if (displayName.length < 2) {
    return { isValid: false, error: 'Display name must be at least 2 characters long' };
  }

  if (displayName.length > 50) {
    return { isValid: false, error: 'Display name must be less than 50 characters' };
  }

  // Check for valid characters (letters, numbers, spaces, hyphens, underscores)
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(displayName)) {
    return { isValid: false, error: 'Display name can only contain letters, numbers, spaces, hyphens, and underscores' };
  }

  return { isValid: true };
};

/**
 * Age validation
 */
export const validateAge = (age: number): ValidationResult => {
  if (!age) {
    return { isValid: false, error: 'Age is required' };
  }

  if (age < 13) {
    return { isValid: false, error: 'You must be at least 13 years old' };
  }

  if (age > 120) {
    return { isValid: false, error: 'Please enter a valid age' };
  }

  return { isValid: true };
};

/**
 * Weight validation (in kg)
 */
export const validateWeight = (weight: number): ValidationResult => {
  if (!weight) {
    return { isValid: false, error: 'Weight is required' };
  }

  if (weight < 20) {
    return { isValid: false, error: 'Weight must be at least 20 kg' };
  }

  if (weight > 500) {
    return { isValid: false, error: 'Please enter a valid weight' };
  }

  return { isValid: true };
};

/**
 * Height validation (in cm)
 */
export const validateHeight = (height: number): ValidationResult => {
  if (!height) {
    return { isValid: false, error: 'Height is required' };
  }

  if (height < 100) {
    return { isValid: false, error: 'Height must be at least 100 cm' };
  }

  if (height > 250) {
    return { isValid: false, error: 'Please enter a valid height' };
  }

  return { isValid: true };
};

/**
 * Workout name validation
 */
export const validateWorkoutName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: 'Workout name is required' };
  }

  if (name.length < 3) {
    return { isValid: false, error: 'Workout name must be at least 3 characters long' };
  }

  if (name.length > 100) {
    return { isValid: false, error: 'Workout name must be less than 100 characters' };
  }

  return { isValid: true };
};

/**
 * Exercise sets validation
 */
export const validateSets = (sets: number): ValidationResult => {
  if (!sets) {
    return { isValid: false, error: 'Number of sets is required' };
  }

  if (sets < 1) {
    return { isValid: false, error: 'Must have at least 1 set' };
  }

  if (sets > 20) {
    return { isValid: false, error: 'Maximum 20 sets allowed' };
  }

  return { isValid: true };
};

/**
 * Exercise reps validation
 */
export const validateReps = (reps: number): ValidationResult => {
  if (!reps) {
    return { isValid: false, error: 'Number of reps is required' };
  }

  if (reps < 1) {
    return { isValid: false, error: 'Must have at least 1 rep' };
  }

  if (reps > 1000) {
    return { isValid: false, error: 'Maximum 1000 reps allowed' };
  }

  return { isValid: true };
};

/**
 * Exercise weight validation (in kg)
 */
export const validateExerciseWeight = (weight: number): ValidationResult => {
  if (weight < 0) {
    return { isValid: false, error: 'Weight cannot be negative' };
  }

  if (weight > 1000) {
    return { isValid: false, error: 'Maximum 1000 kg allowed' };
  }

  return { isValid: true };
};

/**
 * Duration validation (in minutes)
 */
export const validateDuration = (duration: number): ValidationResult => {
  if (!duration) {
    return { isValid: false, error: 'Duration is required' };
  }

  if (duration < 1) {
    return { isValid: false, error: 'Duration must be at least 1 minute' };
  }

  if (duration > 480) { // 8 hours
    return { isValid: false, error: 'Duration cannot exceed 8 hours' };
  }

  return { isValid: true };
};

/**
 * Generic required field validation
 */
export const validateRequired = (value: any, fieldName: string): ValidationResult => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

/**
 * Validate multiple fields at once
 */
export const validateFields = (
  validations: Array<() => ValidationResult>
): ValidationResult => {
  for (const validation of validations) {
    const result = validation();
    if (!result.isValid) {
      return result;
    }
  }

  return { isValid: true };
};
