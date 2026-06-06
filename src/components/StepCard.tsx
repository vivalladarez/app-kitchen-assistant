import { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { DialogPhase } from '../hooks/useDialogMode';
import { RecipeStep } from '../types';

interface StepCardProps {
  step: RecipeStep | undefined;
  stepIndex: number;
  totalSteps: number;
  displayText: string;
  phase: DialogPhase;
  isSpeaking: boolean;
}

export function StepCard({
  step,
  stepIndex,
  totalSteps,
  displayText,
  phase,
  isSpeaking,
}: StepCardProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;
  const { width } = useWindowDimensions();
  const videoRef = useRef<Video>(null);
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    setMediaError(false);
  }, [step?.id, step?.mediaUrl]);

  const phaseLabel =
    phase === 'recovery'
      ? 'Recuperação'
      : phase === 'adaptation'
        ? 'Adaptação'
        : phase === 'finished'
          ? 'Concluído'
          : `Passo ${stepIndex + 1} de ${totalSteps}`;

  const phaseColor =
    phase === 'recovery'
      ? colors.accent
      : phase === 'adaptation'
        ? colors.warningText
        : phase === 'finished'
          ? colors.success
          : colors.primary;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: phaseColor }]}>
          <Text style={[styles.badgeText, { fontSize: typography.sm }]}>{phaseLabel}</Text>
        </View>
        {isSpeaking && (
          <View style={[styles.speakingBadge, { backgroundColor: colors.background }]}>
            <Text style={[styles.speakingText, { color: colors.primaryDark, fontSize: typography.xs }]}>
              🔊 Falando...
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.instruction, { color: colors.text, fontSize: typography.lg }]}>
        {displayText}
      </Text>

      {step?.mediaUrl && !mediaError && phase !== 'finished' && (
        <View style={styles.mediaContainer}>
          <Text style={[styles.mediaLabel, { color: colors.textSecondary, fontSize: typography.sm }]}>
            Apoio visual
          </Text>
          {step.mediaType === 'video' ? (
            <Video
              ref={videoRef}
              source={{ uri: step.mediaUrl }}
              style={[styles.media, { width: width - spacing.lg * 4, backgroundColor: colors.border }]}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              onError={() => setMediaError(true)}
            />
          ) : (
            <Image
              source={{ uri: step.mediaUrl }}
              style={[styles.media, { width: width - spacing.lg * 4, backgroundColor: colors.border }]}
              resizeMode="cover"
              accessibilityLabel="Imagem de apoio para o passo atual"
              onError={() => setMediaError(true)}
            />
          )}
        </View>
      )}

      {mediaError && (
        <Text style={[styles.mediaFallback, { color: colors.textSecondary, fontSize: typography.sm }]}>
          Mídia de apoio indisponível no momento.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  speakingBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  speakingText: {
    fontWeight: '600',
  },
  instruction: {
    lineHeight: 30,
    fontWeight: '500',
  },
  mediaContainer: {
    marginTop: spacing.lg,
  },
  mediaLabel: {
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  media: {
    height: 200,
    borderRadius: 12,
  },
  mediaFallback: {
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
});
