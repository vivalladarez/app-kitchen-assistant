import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { AppIcon, AppIconName } from './AppIcon';

interface VoiceDialogPanelProps {
  isAvailable: boolean;
  assistantState: 'speaking' | 'listening' | 'waiting';
  transcript: string;
  voiceError: string | null;
  onMicPress: () => void;
}

const stateConfig: Record<
  VoiceDialogPanelProps['assistantState'],
  { icon: AppIconName; label: string }
> = {
  speaking: { icon: 'volume-high-outline', label: 'Assistente falando...' },
  listening: { icon: 'mic-outline', label: 'Ouvindo você...' },
  waiting: { icon: 'chatbubble-ellipses-outline', label: 'Diga um comando de voz' },
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
  const state = stateConfig[assistantState];

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
      <View style={styles.stateRow}>
        <AppIcon name={state.icon} size={20} color={colors.primary} />
        <Text style={[styles.state, { color: colors.primary, fontSize: typography.md }]}>
          {state.label}
        </Text>
      </View>

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
        <AppIcon
          name={assistantState === 'listening' ? 'stop' : 'mic'}
          size={28}
          color="#FFFFFF"
        />
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
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  state: {
    fontWeight: '700',
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
  micLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
