import React from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '@/styles';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  borderRadius?: keyof typeof theme.borderRadius;
  onPress?: TouchableOpacityProps['onPress'];
  style?: ViewStyle;
  pressable?: boolean;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 4,
  margin,
  borderRadius = 'lg',
  onPress,
  style,
  pressable = false,
  disabled = false,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.background,
      padding: theme.spacing[padding],
      borderRadius: theme.borderRadius[borderRadius],
      ...(margin && { margin: theme.spacing[margin] }),
    };

    const variantStyles: Record<typeof variant, ViewStyle> = {
      default: {
        backgroundColor: theme.colors.background,
      },
      elevated: {
        backgroundColor: theme.colors.background,
        ...theme.shadows.md,
        shadowColor: theme.colors.neutral[900],
      },
      outlined: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...(disabled && { opacity: 0.6 }),
    };
  };

  const cardStyle = [getCardStyle(), style];

  if (pressable || onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

export default Card;
