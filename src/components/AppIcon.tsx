import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { StyleProp, TextStyle } from 'react-native';

export type AppIconName = ComponentProps<typeof Ionicons>['name'];

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function AppIcon({ name, size = 24, color = '#000000', style }: AppIconProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
