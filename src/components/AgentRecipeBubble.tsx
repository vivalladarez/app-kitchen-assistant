import { Pressable, StyleSheet, Text } from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';

interface AgentRecipeBubbleProps {
  title: string;
  prepTimeMinutes: number;
  isFavorite?: boolean;
  onPress: () => void;
}

export function AgentRecipeBubble({
  title,
  prepTimeMinutes,
  isFavorite,
  onPress,
}: AgentRecipeBubbleProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Iniciar ${title}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.bubble,
        {
          backgroundColor: colors.surface,
          borderColor: isFavorite ? colors.primary : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {isFavorite && (
        <Text style={[styles.star, { color: colors.favorite }]}>★</Text>
      )}
      <Text
        style={[styles.title, { color: colors.text, fontSize: typography.sm }]}
        numberOfLines={2}
      >
        {title}
      </Text>
      <Text style={[styles.meta, { color: colors.textSecondary, fontSize: typography.xs }]}>
        {prepTimeMinutes} min
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bubble: {
    width: 148,
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.md,
    marginRight: spacing.sm,
    minHeight: 88,
    justifyContent: 'center',
  },
  star: {
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  title: {
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  meta: {
    fontWeight: '500',
  },
});
