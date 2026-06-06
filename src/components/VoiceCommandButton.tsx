import { Pressable, StyleSheet, Text } from 'react-native';

import { voiceCommandLabels } from '../constants/voiceCommands';
import { colors, spacing } from '../constants/theme';
import { VoiceCommand } from '../types';

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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Comando de voz simulado: ${voiceCommandLabels[command]}`}
      disabled={disabled}
      onPress={() => onPress(command)}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.icon}>🎤</Text>
      <Text style={styles.label}>{voiceCommandLabels[command]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
  },
  pressed: {
    backgroundColor: '#E8F5E9',
  },
  disabled: {
    opacity: 0.45,
  },
  icon: {
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
});
