import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '@/styles';

export interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = theme.colors.primary[600],
  text,
  overlay = false,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing[4],
    };

    if (overlay) {
      return {
        ...baseStyle,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: theme.zIndex.overlay as number,
      };
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    return {
      marginTop: theme.spacing[3],
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      ...textStyle,
    };
  };

  return (
    <View style={[getContainerStyle(), style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={getTextStyle()}>{text}</Text>}
    </View>
  );
};

export default Loading;
