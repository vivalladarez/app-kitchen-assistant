import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { AppIcon } from './AppIcon';

interface AgentChecklistItemProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function AgentChecklistItem({
  label,
  checked,
  onToggle,
}: AgentChecklistItemProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: checked ? colors.primary : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? colors.primary : colors.border,
            backgroundColor: checked ? colors.primary : 'transparent',
          },
        ]}
      >
        {checked && <AppIcon name="checkmark" size={14} color="#FFFFFF" />}
      </View>
      <Text
        style={[
          styles.label,
          {
            color: checked ? colors.primaryDark : colors.text,
            fontSize: typography.sm,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  label: {
    flex: 1,
    lineHeight: 20,
  },
});
