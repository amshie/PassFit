import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName, View } from 'react-native';
import { useThemeMode } from '../store';
import { theme as lightTheme } from '../styles/theme';

// Define theme mode type
type ThemeMode = 'light' | 'dark';

// Theme context type
interface ThemeContextType {
  theme: typeof lightTheme;
  isDark: boolean;
  colorScheme: ThemeMode;
  // Dynamic color getters that adjust based on theme
  getBackgroundColor: () => string;
  getSurfaceColor: () => string;
  getBorderColor: () => string;
  getTextColor: (variant?: 'primary' | 'secondary' | 'disabled' | 'inverse') => string;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeMode = useThemeMode();
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []); // Empty dependency array to register listener only once

  // Determine the actual color scheme to use
  const getColorScheme = (): ThemeMode => {
    switch (themeMode) {
      case 'light':
        return 'light';
      case 'dark':
        return 'dark';
      case 'system':
        return systemColorScheme === 'dark' ? 'dark' : 'light';
      default:
        return 'light';
    }
  };

  const colorScheme = getColorScheme();
  const isDark = colorScheme === 'dark';

  // Dynamic color functions
  const getBackgroundColor = (): string => {
    return isDark ? '#1a1a1a' : lightTheme.colors.background;
  };

  const getSurfaceColor = (): string => {
    return isDark ? '#2d2d2d' : lightTheme.colors.surface;
  };

  const getBorderColor = (): string => {
    return isDark ? '#404040' : lightTheme.colors.border;
  };

  const getTextColor = (variant: 'primary' | 'secondary' | 'disabled' | 'inverse' = 'primary'): string => {
    if (isDark) {
      switch (variant) {
        case 'primary':
          return '#ffffff';
        case 'secondary':
          return '#b3b3b3';
        case 'disabled':
          return '#666666';
        case 'inverse':
          return '#000000';
        default:
          return '#ffffff';
      }
    } else {
      return lightTheme.colors.text[variant];
    }
  };

  const contextValue: ThemeContextType = {
    theme: lightTheme, // Always use the base theme structure
    isDark,
    colorScheme,
    getBackgroundColor,
    getSurfaceColor,
    getBorderColor,
    getTextColor,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <View style={{ flex: 1, backgroundColor: getBackgroundColor() }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export theme types
export type { ThemeContextType, ThemeMode };
