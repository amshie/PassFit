/**
 * Formatting utility functions for displaying data in a user-friendly way
 */

/**
 * Format duration from minutes to human-readable string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format date to relative time (e.g., "2 days ago", "Just now")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};

/**
 * Format date to short date string (e.g., "Jan 15, 2024")
 */
export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format date to long date string (e.g., "Monday, January 15, 2024")
 */
export const formatLongDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format time to 12-hour format (e.g., "2:30 PM")
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format weight with unit (kg or lbs)
 */
export const formatWeight = (weight: number, unit: 'kg' | 'lbs' = 'kg'): string => {
  return `${weight.toFixed(1)} ${unit}`;
};

/**
 * Format height in cm or feet/inches
 */
export const formatHeight = (heightCm: number, unit: 'cm' | 'ft' = 'cm'): string => {
  if (unit === 'cm') {
    return `${heightCm} cm`;
  }

  const totalInches = heightCm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  return `${feet}'${inches}"`;
};

/**
 * Format BMI with one decimal place
 */
export const formatBMI = (bmi: number): string => {
  return bmi.toFixed(1);
};

/**
 * Format percentage with one decimal place
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format large numbers with K, M suffixes
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format exercise sets and reps (e.g., "3 x 12")
 */
export const formatSetsReps = (sets: number, reps: number): string => {
  return `${sets} × ${reps}`;
};

/**
 * Format exercise with weight (e.g., "3 x 12 @ 50kg")
 */
export const formatExercise = (sets: number, reps: number, weight?: number): string => {
  const setsReps = formatSetsReps(sets, reps);
  if (weight && weight > 0) {
    return `${setsReps} @ ${formatWeight(weight)}`;
  }
  return setsReps;
};

/**
 * Format workout difficulty level
 */
export const formatDifficulty = (difficulty: string): string => {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
};

/**
 * Format workout category
 */
export const formatCategory = (category: string): string => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format calories burned
 */
export const formatCalories = (calories: number): string => {
  return `${Math.round(calories)} cal`;
};

/**
 * Format distance (meters to km or miles)
 */
export const formatDistance = (meters: number, unit: 'km' | 'mi' = 'km'): string => {
  if (unit === 'km') {
    const km = meters / 1000;
    if (km < 1) {
      return `${meters} m`;
    }
    return `${km.toFixed(2)} km`;
  }

  const miles = meters / 1609.34;
  if (miles < 1) {
    const feet = meters * 3.28084;
    return `${Math.round(feet)} ft`;
  }
  return `${miles.toFixed(2)} mi`;
};

/**
 * Format pace (minutes per km or mile)
 */
export const formatPace = (secondsPerUnit: number, unit: 'km' | 'mi' = 'km'): string => {
  const minutes = Math.floor(secondsPerUnit / 60);
  const seconds = Math.round(secondsPerUnit % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/${unit}`;
};

/**
 * Format streak count
 */
export const formatStreak = (count: number): string => {
  if (count === 0) {
    return 'No streak';
  }
  return `${count} day${count === 1 ? '' : 's'}`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Capitalize first letter of each word
 */
export const formatTitle = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength - 3)}...`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phoneNumber;
};
