import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';

interface ListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function ListInput({ label, items, onChange, placeholder }: ListInputProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const addItem = () => onChange([...items, '']);

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.text, fontSize: typography.md }]}>
          {label}
        </Text>
        <Pressable accessibilityRole="button" onPress={addItem}>
          <Text style={[styles.addButton, { color: colors.primary, fontSize: typography.sm }]}>
            + Adicionar
          </Text>
        </Pressable>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.row}>
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
            value={item}
            onChangeText={(text) => updateItem(index, text)}
            placeholder={placeholder ?? `${label} ${index + 1}`}
            placeholderTextColor={colors.textSecondary}
          />
          {items.length > 1 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remover ${label}`}
              onPress={() => removeItem(index)}
            >
              <Text style={[styles.removeButton, { color: colors.accent }]}>✕</Text>
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontWeight: '600',
  },
  addButton: {
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  removeButton: {
    fontSize: 18,
    padding: spacing.xs,
  },
});
