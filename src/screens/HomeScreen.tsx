import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components';
import { colors, spacing } from '../constants/theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cozinha Assistiva</Text>
      <Text style={styles.subtitle}>
        Seu assistente de receitas para a cozinha conectada
      </Text>

      <PrimaryButton
        title="Ativar modo diálogo"
        style={styles.mainButton}
        onPress={() =>
          navigation.navigate('Search')
        }
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
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
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
