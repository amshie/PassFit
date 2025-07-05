import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { theme } from '@/styles';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  required?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = 'md',
      variant = 'outline',
      required = false,
      disabled = false,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      helperStyle,
      showPasswordToggle = false,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const hasError = !!error;
    const isSecure = secureTextEntry && !isPasswordVisible;

    const getContainerStyle = (): ViewStyle => {
      return {
        marginBottom: theme.spacing[1],
        ...containerStyle,
      };
    };

    const getLabelStyle = (): TextStyle => {
      return {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium,
        color: hasError
          ? theme.colors.error[600]
          : disabled
          ? theme.colors.text.disabled
          : theme.colors.text.primary,
        marginBottom: theme.spacing[1],
        ...labelStyle,
      };
    };

    const getInputContainerStyle = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.components.input.borderRadius,
        borderWidth: theme.components.input.borderWidth,
        paddingHorizontal: theme.components.input.padding.horizontal,
        height: theme.components.input.height[size],
      };

      const variantStyles: Record<typeof variant, ViewStyle> = {
        outline: {
          backgroundColor: disabled ? theme.colors.neutral[100] : theme.colors.background,
          borderColor: hasError
            ? theme.colors.error[500]
            : isFocused
            ? theme.colors.primary[500]
            : theme.colors.border,
        },
        filled: {
          backgroundColor: disabled
            ? theme.colors.neutral[200]
            : isFocused
            ? theme.colors.neutral[100]
            : theme.colors.neutral[50],
          borderColor: hasError
            ? theme.colors.error[500]
            : isFocused
            ? theme.colors.primary[500]
            : 'transparent',
        },
      };

      return {
        ...baseStyle,
        ...variantStyles[variant],
        ...(disabled && { opacity: 0.6 }),
      };
    };

    const getInputStyle = (): TextStyle => {
      const sizeStyles: Record<typeof size, TextStyle> = {
        sm: {
          fontSize: theme.typography.fontSize.sm,
        },
        md: {
          fontSize: theme.typography.fontSize.base,
        },
        lg: {
          fontSize: theme.typography.fontSize.lg,
        },
      };

      return {
        flex: 1,
        color: disabled ? theme.colors.text.disabled : theme.colors.text.primary,
        fontWeight: theme.typography.fontWeight.normal,
        ...sizeStyles[size],
        ...inputStyle,
      };
    };

    const getHelperTextStyle = (): TextStyle => {
      return {
        fontSize: theme.typography.fontSize.xs,
        color: hasError
          ? theme.colors.error[600]
          : theme.colors.text.secondary,
        marginTop: theme.spacing[1],
        ...(hasError ? errorStyle : helperStyle),
      };
    };

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const renderPasswordToggle = () => {
      if (!showPasswordToggle || !secureTextEntry) return null;

      return (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={{ marginLeft: theme.spacing[2] }}
          disabled={disabled}
        >
          <Text style={{ color: theme.colors.text.secondary }}>
            {isPasswordVisible ? '🙈' : '👁️'}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View style={getContainerStyle()}>
        {label && (
          <Text style={getLabelStyle()}>
            {label}
            {required && (
              <Text style={{ color: theme.colors.error[500] }}> *</Text>
            )}
          </Text>
        )}

        <View style={getInputContainerStyle()}>
          {leftIcon && (
            <View style={{ marginRight: theme.spacing[2] }}>
              {leftIcon}
            </View>
          )}

          <TextInput
            ref={ref}
            style={getInputStyle()}
            secureTextEntry={isSecure}
            editable={!disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            placeholderTextColor={theme.colors.text.disabled}
            {...props}
          />

          {showPasswordToggle && secureTextEntry ? (
            renderPasswordToggle()
          ) : (
            rightIcon && (
              <View style={{ marginLeft: theme.spacing[2] }}>
                {rightIcon}
              </View>
            )
          )}
        </View>

        {(error || helperText) && (
          <Text style={getHelperTextStyle()}>
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;
