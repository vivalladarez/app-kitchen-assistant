import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';

export function LoadingScreen() {
  const { theme, typography } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text
        style={[
          styles.text,
          { color: theme.colors.text, fontSize: typography.md },
        ]}
      >
        Carregando Cozinha Assistida...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  text: {
    fontWeight: '500',
  },
});
