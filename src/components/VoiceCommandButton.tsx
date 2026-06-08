import { Pressable, StyleSheet, Text } from 'react-native';

import { voiceCommandLabels } from '../constants/voiceCommands';
import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { VoiceCommand } from '../types';
import { AppIcon } from './AppIcon';

interface VoiceCommandButtonProps {
  command: VoiceCommand;
  onPress: (command: VoiceCommand) => void;
  disabled?: boolean;
}

export function VoiceCommandButton({
  command,
  onPress,
  disabled,
}: VoiceCommandButtonProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Comando de voz simulado: ${voiceCommandLabels[command]}`}
      disabled={disabled}
      onPress={() => onPress(command)}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed && !disabled ? colors.background : colors.surface,
          borderColor: colors.primary,
        },
        disabled && styles.disabled,
      ]}
    >
      <AppIcon name="mic-outline" size={20} color={colors.primary} style={styles.icon} />
      <Text
        style={[
          styles.label,
          { color: colors.primary, fontSize: typography.sm },
        ]}
      >
        {voiceCommandLabels[command]}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
  },
  disabled: {
    opacity: 0.45,
  },
  icon: {
    marginBottom: spacing.xs,
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
