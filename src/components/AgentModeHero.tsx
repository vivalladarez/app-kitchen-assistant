import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { AppIcon } from './AppIcon';

interface AgentModeHeroProps {
  onPress: () => void;
}

export function AgentModeHero({ onPress }: AgentModeHeroProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  const heroText = theme.isHighContrast ? colors.background : '#FFFFFF';
  const heroSubtext = theme.isHighContrast ? colors.background : 'rgba(255,255,255,0.88)';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Iniciar modo agente"
      accessibilityHint="Escolha uma receita e cozinhe com assistente por voz"
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.primaryDark,
            borderColor: colors.primary,
          },
        ]}
      >
        <View style={[styles.glow, { backgroundColor: colors.primary }]} />

        <View style={[styles.iconRing, { borderColor: heroText }]}>
          <AppIcon name="mic-outline" size={40} color={heroText} />
        </View>

        <Text style={[styles.title, { color: heroText, fontSize: typography.xl + 2 }]}>
          Modo agente
        </Text>
        <Text style={[styles.subtitle, { color: heroSubtext, fontSize: typography.md }]}>
          Converse com o assistente enquanto prepara sua receita passo a passo
        </Text>

        <View style={[styles.cta, { backgroundColor: colors.accent }]}>
          <Text style={[styles.ctaText, { fontSize: typography.md }]}>Iniciar</Text>
          <AppIcon name="arrow-forward" size={18} color="#FFFFFF" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.md,
    width: '100%',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  card: {
    borderRadius: 24,
    padding: spacing.lg,
    alignItems: 'center',
    alignSelf: 'stretch',
    borderWidth: 2,
    overflow: 'hidden',
    minHeight: 280,
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.35,
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    alignSelf: 'stretch',
    lineHeight: 24,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    minWidth: 140,
    gap: spacing.sm,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
