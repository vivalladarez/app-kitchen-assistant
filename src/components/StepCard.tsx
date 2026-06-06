import { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

import { colors, spacing } from '../constants/theme';
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
        ? '#E9C46A'
        : phase === 'finished'
          ? colors.success
          : colors.primary;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: phaseColor }]}>
          <Text style={styles.badgeText}>{phaseLabel}</Text>
        </View>
        {isSpeaking && (
          <View style={styles.speakingBadge}>
            <Text style={styles.speakingText}>🔊 Falando...</Text>
          </View>
        )}
      </View>

      <Text style={styles.instruction}>{displayText}</Text>

      {step?.mediaUrl && !mediaError && phase !== 'finished' && (
        <View style={styles.mediaContainer}>
          <Text style={styles.mediaLabel}>Apoio visual</Text>
          {step.mediaType === 'video' ? (
            <Video
              ref={videoRef}
              source={{ uri: step.mediaUrl }}
              style={[styles.media, { width: width - spacing.lg * 4 }]}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              onError={() => setMediaError(true)}
            />
          ) : (
            <Image
              source={{ uri: step.mediaUrl }}
              style={[styles.media, { width: width - spacing.lg * 4 }]}
              resizeMode="cover"
              accessibilityLabel="Imagem de apoio para o passo atual"
              onError={() => setMediaError(true)}
            />
          )}
        </View>
      )}

      {mediaError && (
        <Text style={styles.mediaFallback}>Mídia de apoio indisponível no momento.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
    fontSize: 13,
    fontWeight: '700',
  },
  speakingBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  speakingText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  instruction: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.text,
    fontWeight: '500',
  },
  mediaContainer: {
    marginTop: spacing.lg,
  },
  mediaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  media: {
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  mediaFallback: {
    marginTop: spacing.md,
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
