import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { AppIcon, AppIconName } from './AppIcon';

interface HomeShortcutButtonProps {
  icon: AppIconName;
  label: string;
  onPress: () => void;
  variant?: 'grid' | 'wide';
  style?: ViewStyle;
}

export function HomeShortcutButton({
  icon,
  label,
  onPress,
  variant = 'grid',
  style,
}: HomeShortcutButtonProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;
  const isWide = variant === 'wide';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isWide ? styles.buttonWide : styles.buttonGrid,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <View style={[styles.iconBox, isWide && styles.iconBoxWide]}>
        <AppIcon name={icon} size={22} color={colors.primary} />
      </View>
      <Text
        style={[
          styles.label,
          isWide && styles.labelWide,
          { color: colors.text, fontSize: typography.sm },
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGrid: {
    width: '100%',
    minHeight: 92,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  buttonWide: {
    width: '100%',
    flexDirection: 'row',
    minHeight: 56,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconBoxWide: {
    marginBottom: 0,
    marginRight: spacing.sm,
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  labelWide: {
    flex: 1,
    textAlign: 'left',
  },
});
