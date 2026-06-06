import { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';

interface SettingsOptionProps {
  label: string;
  description?: string;
  children?: ReactNode;
  onPress?: () => void;
}

export function SettingsOption({
  label,
  description,
  children,
  onPress,
}: SettingsOptionProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  const content = (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.textBlock}>
        <Text style={[styles.label, { color: colors.text, fontSize: typography.md }]}>
          {label}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              { color: colors.textSecondary, fontSize: typography.sm },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return content;
}

interface SettingsToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SettingsToggle({
  label,
  description,
  value,
  onValueChange,
}: SettingsToggleProps) {
  const { theme } = useSettings();

  return (
    <SettingsOption label={label} description={description}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.isHighContrast ? '#FFFF00' : '#FFFFFF'}
        accessibilityLabel={label}
      />
    </SettingsOption>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  textBlock: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    fontWeight: '600',
  },
  description: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },
});
