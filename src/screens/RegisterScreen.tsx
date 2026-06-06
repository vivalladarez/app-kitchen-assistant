import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { FilterChip, PrimaryButton } from '../components';
import { dietaryRestrictionLabels } from '../constants/settingsLabels';
import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { DietaryRestriction, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { user, theme, typography, updateUser, updateSettings } = useSettings();
  const { colors } = theme;

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>(
    user?.dietaryRestrictions ?? [],
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRestrictions(user.dietaryRestrictions);
    }
  }, [user]);

  const toggleRestriction = (r: DietaryRestriction) => {
    setRestrictions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Nome obrigatório', 'Informe seu nome para continuar.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido.');
      return;
    }

    await updateUser({
      name: name.trim(),
      email: email.trim(),
      dietaryRestrictions: restrictions,
    });
    updateSettings({ dietaryRestrictions: restrictions });

    Alert.alert('Cadastro salvo!', `Bem-vindo(a), ${name.trim()}!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text, fontSize: typography.xl }]}>
        Cadastro
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.md }]}>
        Seus dados são salvos localmente no dispositivo.
      </Text>

      <Text style={[styles.label, { color: colors.text, fontSize: typography.md }]}>
        Nome
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: colors.border,
            fontSize: typography.md,
          },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Seu nome"
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel="Nome"
      />

      <Text style={[styles.label, { color: colors.text, fontSize: typography.md }]}>
        E-mail
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: colors.border,
            fontSize: typography.md,
          },
        ]}
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        placeholderTextColor={colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="E-mail"
      />

      <Text style={[styles.label, { color: colors.text, fontSize: typography.md }]}>
        Preferências alimentares
      </Text>
      <View style={styles.chips}>
        {(Object.entries(dietaryRestrictionLabels) as [DietaryRestriction, string][]).map(
          ([key, label]) => (
            <FilterChip
              key={key}
              label={label}
              selected={restrictions.includes(key)}
              onPress={() => toggleRestriction(key)}
            />
          ),
        )}
      </View>

      <PrimaryButton title="Salvar cadastro" onPress={handleSave} style={styles.saveButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  label: {
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.md,
  },
});
