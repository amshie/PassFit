import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '@/styles';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.components.button.borderRadius,
      ...theme.components.button.padding[size],
      height: theme.components.button.height[size],
      ...(fullWidth && { width: '100%' }),
    };

    const variantStyles: Record<typeof variant, ViewStyle> = {
      primary: {
        backgroundColor: isDisabled ? theme.colors.neutral[300] : theme.colors.primary[600],
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: isDisabled ? theme.colors.neutral[200] : theme.colors.secondary[100],
        borderWidth: 1,
        borderColor: isDisabled ? theme.colors.neutral[300] : theme.colors.secondary[300],
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDisabled ? theme.colors.neutral[300] : theme.colors.primary[600],
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
      danger: {
        backgroundColor: isDisabled ? theme.colors.neutral[300] : theme.colors.error[600],
        borderWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...(isDisabled && { opacity: 0.6 }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<typeof size, TextStyle> = {
      sm: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium,
      },
      md: {
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium,
      },
      lg: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.semibold,
      },
      xl: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold,
      },
    };

    const variantTextStyles: Record<typeof variant, TextStyle> = {
      primary: {
        color: theme.colors.text.inverse,
      },
      secondary: {
        color: isDisabled ? theme.colors.text.disabled : theme.colors.secondary[700],
      },
      outline: {
        color: isDisabled ? theme.colors.text.disabled : theme.colors.primary[600],
      },
      ghost: {
        color: isDisabled ? theme.colors.text.disabled : theme.colors.primary[600],
      },
      danger: {
        color: theme.colors.text.inverse,
      },
    };

    return {
      ...sizeStyles[size],
      ...variantTextStyles[variant],
    };
  };

  const handlePress = (event: any) => {
    if (!isDisabled && onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary' || variant === 'danger'
              ? theme.colors.text.inverse
              : theme.colors.primary[600]
          }
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[getTextStyle(), textStyle, leftIcon ? { marginLeft: theme.spacing[2] } : undefined]}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
