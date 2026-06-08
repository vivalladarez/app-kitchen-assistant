import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AgentModeHero, HomeShortcutButton, KitchenSensorStrip, KitchenStatusBadge } from '../components';
import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { useKitchenConnection } from '../hooks/useKitchenConnection';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { settings, user, theme, typography } = useSettings();
  const { colors } = theme;
  const kitchen = useKitchenConnection(settings.kitchenConnectionEnabled);

  useEffect(() => {
    if (settings.openInDialogMode) {
      navigation.navigate('AgentMode');
    }
  }, [settings.openInDialogMode, navigation]);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        {user && (
          <Text style={[styles.greeting, { color: colors.primary, fontSize: typography.sm }]}>
            Olá, {user.name}!
          </Text>
        )}
        <Text style={[styles.title, { color: colors.text, fontSize: typography.xxl }]}>
          Cozinha Assistida
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.md }]}>
          Seu assistente para a cozinha conectada
        </Text>
        <View style={styles.kitchenStatus}>
          <KitchenStatusBadge
            online={kitchen.online}
            isChecking={kitchen.isChecking}
            compact
          />
        </View>
        {kitchen.online && !kitchen.isChecking && (
          <KitchenSensorStrip sensors={kitchen.sensors} compact />
        )}
      </View>

      <AgentModeHero onPress={() => navigation.navigate('AgentMode')} />

      <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: typography.sm }]}>
        Acesso rápido
      </Text>

      <View style={styles.shortcuts}>
        <View style={styles.shortcutRow}>
          <View style={styles.shortcutCell}>
            <HomeShortcutButton
              icon="star-outline"
              label="Favoritos"
              onPress={() => navigation.navigate('Favorites')}
            />
          </View>
          <View style={styles.shortcutSpacer} />
          <View style={styles.shortcutCell}>
            <HomeShortcutButton
              icon="search-outline"
              label="Buscar"
              onPress={() => navigation.navigate('Search')}
            />
          </View>
        </View>

        <View style={styles.shortcutRow}>
          <View style={styles.shortcutCell}>
            <HomeShortcutButton
              icon="add-circle-outline"
              label="Criar receita"
              onPress={() => navigation.navigate('CreateRecipe', undefined)}
            />
          </View>
          <View style={styles.shortcutSpacer} />
          <View style={styles.shortcutCell}>
            <HomeShortcutButton
              icon="settings-outline"
              label="Configurações"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>

        <HomeShortcutButton
          icon="person-outline"
          label="Cadastro"
          variant="wide"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'stretch',
  },
  header: {
    marginBottom: spacing.sm,
    alignSelf: 'stretch',
  },
  greeting: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    lineHeight: 22,
  },
  kitchenStatus: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    alignSelf: 'stretch',
  },
  shortcuts: {
    alignSelf: 'stretch',
  },
  shortcutRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: spacing.sm,
  },
  shortcutCell: {
    flex: 1,
  },
  shortcutSpacer: {
    width: spacing.sm,
  },
});
