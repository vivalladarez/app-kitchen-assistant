import { Pressable, StyleSheet, Text } from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';

interface AgentSuggestionChipProps {
  label: string;
  onPress: () => void;
}

export function AgentSuggestionChip({ label, onPress }: AgentSuggestionChipProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.textSecondary, fontSize: typography.sm }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  text: {
    fontWeight: '500',
  },
});
