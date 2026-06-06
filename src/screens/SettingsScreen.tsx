import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FilterChip, SettingsOption, SettingsToggle } from '../components';
import {
  dietaryRestrictionLabels,
  fontFamilyOptions,
  fontSizeLabels,
  themeLabels,
  voiceProfileLabels,
} from '../constants/settingsLabels';
import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import {
  AppTheme,
  DietaryRestriction,
  RootStackParamList,
  VoiceProfile,
} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen(_props: Props) {
  const { settings, theme, typography, updateSettings, resetSettings, user } =
    useSettings();
  const { colors } = theme;

  const toggleDietary = (restriction: DietaryRestriction) => {
    const current = settings.dietaryRestrictions;
    const next = current.includes(restriction)
      ? current.filter((r) => r !== restriction)
      : [...current, restriction];
    updateSettings({ dietaryRestrictions: next });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {user && (
        <Text style={[styles.greeting, { color: colors.textSecondary, fontSize: typography.sm }]}>
          Olá, {user.name}!
        </Text>
      )}

      <Text style={[styles.section, { color: colors.text, fontSize: typography.lg }]}>
        Acessibilidade
      </Text>

      <SettingsToggle
        label="Alto contraste"
        description="Cores de alto contraste em todo o app"
        value={settings.highContrast}
        onValueChange={(v) =>
          updateSettings({
            highContrast: v,
            theme: v ? 'high-contrast' : 'light',
          })
        }
      />

      <SettingsOption label="Tamanho da fonte">
        <View style={styles.chips}>
          {(Object.entries(fontSizeLabels) as [typeof settings.fontSize, string][]).map(
            ([key, label]) => (
              <FilterChip
                key={key}
                label={label}
                selected={settings.fontSize === key}
                onPress={() => updateSettings({ fontSize: key })}
              />
            ),
          )}
        </View>
      </SettingsOption>

      <SettingsOption label="Fonte">
        <View style={styles.chips}>
          {fontFamilyOptions.map((font) => (
            <FilterChip
              key={font}
              label={font}
              selected={settings.fontFamily === font}
              onPress={() => updateSettings({ fontFamily: font })}
            />
          ))}
        </View>
      </SettingsOption>

      <SettingsToggle
        label="Libras"
        description="Suporte a Libras (indicador visual)"
        value={settings.signLanguageEnabled}
        onValueChange={(v) => updateSettings({ signLanguageEnabled: v })}
      />

      <Text style={[styles.section, { color: colors.text, fontSize: typography.lg }]}>
        Vozes
      </Text>

      <View style={styles.chipsWrap}>
        {(Object.entries(voiceProfileLabels) as [VoiceProfile, string][]).map(
          ([key, label]) => (
            <FilterChip
              key={key}
              label={label}
              selected={settings.voiceProfile === key}
              onPress={() => updateSettings({ voiceProfile: key })}
            />
          ),
        )}
      </View>

      <Text style={[styles.section, { color: colors.text, fontSize: typography.lg }]}>
        Temas
      </Text>

      <View style={styles.chipsWrap}>
        {(Object.entries(themeLabels) as [AppTheme, string][]).map(([key, label]) => (
          <FilterChip
            key={key}
            label={label}
            selected={settings.theme === key}
            onPress={() =>
              updateSettings({
                theme: key,
                highContrast: key === 'high-contrast',
              })
            }
          />
        ))}
      </View>

      <Text style={[styles.section, { color: colors.text, fontSize: typography.lg }]}>
        Restrição alimentar
      </Text>

      <View style={styles.chipsWrap}>
        {(Object.entries(dietaryRestrictionLabels) as [DietaryRestriction, string][]).map(
          ([key, label]) => (
            <FilterChip
              key={key}
              label={label}
              selected={settings.dietaryRestrictions.includes(key)}
              onPress={() => toggleDietary(key)}
            />
          ),
        )}
      </View>

      <Text style={[styles.section, { color: colors.text, fontSize: typography.lg }]}>
        Comportamento
      </Text>

      <SettingsToggle
        label="Sempre abrir no modo diálogo"
        description="Ao abrir o app, ir direto para buscar receitas"
        value={settings.openInDialogMode}
        onValueChange={(v) => updateSettings({ openInDialogMode: v })}
      />

      <SettingsOption
        label="Restaurar padrões"
        description="Volta todas as configurações ao estado inicial"
        onPress={resetSettings}
      >
        <Text style={{ color: colors.accent, fontWeight: '600' }}>Restaurar</Text>
      </SettingsOption>
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
  greeting: {
    marginBottom: spacing.md,
  },
  section: {
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: '60%',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
});
