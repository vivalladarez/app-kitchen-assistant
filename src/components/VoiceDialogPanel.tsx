import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';

interface VoiceDialogPanelProps {
  isAvailable: boolean;
  assistantState: 'speaking' | 'listening' | 'waiting';
  transcript: string;
  voiceError: string | null;
  onMicPress: () => void;
}

const stateLabels = {
  speaking: '🗣️ Assistente falando...',
  listening: '👂 Ouvindo você...',
  waiting: '💬 Diga um comando de voz',
};

export function VoiceDialogPanel({
  isAvailable,
  assistantState,
  transcript,
  voiceError,
  onMicPress,
}: VoiceDialogPanelProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  if (!isAvailable) {
    return (
      <View
        style={[
          styles.panel,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.text, fontSize: typography.md }]}>
          Voz real indisponível no Expo Go
        </Text>
        <Text style={[styles.hint, { color: colors.textSecondary, fontSize: typography.sm }]}>
          Para conversar com o assistente, gere um build de desenvolvimento:{' '}
          <Text style={{ fontWeight: '700' }}>npx expo run:android</Text>
          {'\n'}Use os botões abaixo como alternativa.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: colors.surface,
          borderColor:
            assistantState === 'listening' ? colors.primary : colors.border,
          borderWidth: assistantState === 'listening' ? 2 : 1,
        },
      ]}
    >
      <Text style={[styles.state, { color: colors.primary, fontSize: typography.md }]}>
        {stateLabels[assistantState]}
      </Text>

      {transcript ? (
        <View style={[styles.bubble, { backgroundColor: colors.background }]}>
          <Text style={[styles.transcript, { color: colors.text, fontSize: typography.md }]}>
            "{transcript}"
          </Text>
        </View>
      ) : (
        <Text style={[styles.hint, { color: colors.textSecondary, fontSize: typography.sm }]}>
          Ex.: "confirma", "próximo passo", "errei", "repetir", "temperatura"
        </Text>
      )}

      {voiceError && (
        <Text style={[styles.error, { color: colors.accent, fontSize: typography.sm }]}>
          {voiceError}
        </Text>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          assistantState === 'listening' ? 'Parar de ouvir' : 'Falar comando'
        }
        onPress={onMicPress}
        style={[
          styles.micButton,
          {
            backgroundColor:
              assistantState === 'listening' ? colors.accent : colors.primary,
          },
        ]}
      >
        <Text style={styles.micIcon}>🎤</Text>
        <Text style={[styles.micLabel, { fontSize: typography.sm }]}>
          {assistantState === 'listening' ? 'Parar' : 'Falar'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  state: {
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  bubble: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  transcript: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  hint: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  error: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  micButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: spacing.sm,
  },
  micIcon: {
    fontSize: 28,
  },
  micLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
