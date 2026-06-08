import { StyleSheet, Text, View } from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';

interface KitchenStatusBadgeProps {
  online: boolean;
  isChecking?: boolean;
  compact?: boolean;
}

export function KitchenStatusBadge({
  online,
  isChecking = false,
  compact = false,
}: KitchenStatusBadgeProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  const dotColor = isChecking
    ? colors.textSecondary
    : online
      ? colors.success
      : colors.accent;

  const label = isChecking
    ? 'Cozinha...'
    : online
      ? 'Cozinha online'
      : 'Cozinha offline';

  return (
    <View style={[styles.badge, compact && styles.badgeCompact]}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text
        style={[
          styles.label,
          {
            color: colors.textSecondary,
            fontSize: compact ? typography.xs - 1 : typography.xs,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

interface SessionStatusBadgeProps {
  label: string;
  tone?: 'default' | 'accent' | 'success';
}

export function SessionStatusBadge({
  label,
  tone = 'default',
}: SessionStatusBadgeProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  const dotColor =
    tone === 'accent'
      ? colors.accent
      : tone === 'success'
        ? colors.success
        : colors.primary;

  return (
    <View style={styles.badge}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text
        style={[
          styles.label,
          { color: colors.textSecondary, fontSize: typography.xs },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeCompact: {
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
