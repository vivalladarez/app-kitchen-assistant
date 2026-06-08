import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { AppIcon } from './AppIcon';

interface AgentOrbButtonProps {
  isListening: boolean;
  isAvailable: boolean;
  onPress: () => void;
  hint?: string;
}

export function AgentOrbButton({
  isListening,
  isAvailable,
  onPress,
  hint,
}: AgentOrbButtonProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.ringOuter,
          {
            borderColor: colors.primary,
            opacity: isListening ? 0.45 : 0.2,
          },
        ]}
      />
      <View
        style={[
          styles.ringMid,
          {
            borderColor: colors.primary,
            opacity: isListening ? 0.55 : 0.28,
          },
        ]}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isListening ? 'Parar de ouvir' : 'Falar com o assistente'}
        onPress={onPress}
        style={({ pressed }) => [
          styles.orb,
          {
            backgroundColor: colors.primaryDark,
            borderColor: colors.primary,
            opacity: pressed ? 0.9 : 1,
          },
          isListening && { backgroundColor: colors.accent, borderColor: colors.accent },
        ]}
      >
        <AppIcon
          name={isListening ? 'stop-circle' : 'mic-outline'}
          size={42}
          color="#FFFFFF"
        />
      </Pressable>

      <Text style={[styles.hint, { color: colors.textSecondary, fontSize: typography.sm }]}>
        {hint ??
          (isListening
            ? 'Ouvindo...'
            : isAvailable
              ? 'Toque para falar'
              : 'Toque ou escolha uma sugestão')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
    height: 220,
    alignSelf: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
  },
  ringMid: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1,
  },
  orb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  hint: {
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    fontWeight: '500',
  },
});
