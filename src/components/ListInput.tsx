import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors, spacing } from '../constants/theme';

interface ListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function ListInput({ label, items, onChange, placeholder }: ListInputProps) {
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
        <Text style={styles.label}>{label}</Text>
        <Pressable accessibilityRole="button" onPress={addItem}>
          <Text style={styles.addButton}>+ Adicionar</Text>
        </Pressable>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.row}>
          <TextInput
            style={styles.input}
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
              <Text style={styles.removeButton}>✕</Text>
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
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
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  removeButton: {
    fontSize: 18,
    color: colors.accent,
    padding: spacing.xs,
  },
});
