import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components';
import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { settings, user, theme, typography } = useSettings();
  const { colors } = theme;

  useEffect(() => {
    if (settings.openInDialogMode) {
      navigation.navigate('Search');
    }
  }, [settings.openInDialogMode, navigation]);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      {user && (
        <Text style={[styles.greeting, { color: colors.primary, fontSize: typography.sm }]}>
          Olá, {user.name}!
        </Text>
      )}

      <Text style={[styles.title, { color: colors.text, fontSize: typography.xxl }]}>
        Cozinha Assistiva
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.md }]}>
        Seu assistente de receitas para a cozinha conectada
      </Text>

      <PrimaryButton
        title="Ativar modo diálogo"
        style={styles.mainButton}
        onPress={() => navigation.navigate('Search')}
      />

      <View style={styles.menu}>
        <PrimaryButton
          title="Receitas favoritas"
          variant="outline"
          onPress={() => navigation.navigate('Favorites')}
        />
        <PrimaryButton
          title="Buscar receitas"
          variant="outline"
          onPress={() => navigation.navigate('Search')}
        />
        <PrimaryButton
          title="Criar receita"
          variant="outline"
          onPress={() => navigation.navigate('CreateRecipe', undefined)}
        />
        <PrimaryButton
          title="Configurações"
          variant="outline"
          onPress={() => navigation.navigate('Settings')}
        />
        <PrimaryButton
          title="Cadastro"
          variant="outline"
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
  },
  greeting: {
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  mainButton: {
    marginBottom: spacing.xl,
  },
  menu: {
    gap: spacing.sm,
  },
});
