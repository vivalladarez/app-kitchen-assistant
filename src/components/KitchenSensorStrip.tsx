import { StyleSheet, Text, View } from 'react-native';

import {
  KITCHEN_COLOR_LABELS,
  KITCHEN_SENSOR_LABELS,
} from '../constants/kitchenSensors';
import { spacing } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { KitchenSensors } from '../types/kitchen';

interface KitchenSensorStripProps {
  sensors: KitchenSensors;
  compact?: boolean;
}

export function KitchenSensorStrip({ sensors, compact = false }: KitchenSensorStripProps) {
  const { theme, typography } = useSettings();
  const { colors } = theme;

  const items = [
    {
      key: 'pan' as const,
      label: KITCHEN_SENSOR_LABELS.pan,
      value: `${Math.round(sensors.pan.celsius)}°C`,
      active: sensors.pan.alert,
    },
    {
      key: 'color' as const,
      label: KITCHEN_SENSOR_LABELS.color,
      value: KITCHEN_COLOR_LABELS[sensors.color.level],
      active: sensors.color.alert,
    },
    {
      key: 'sound' as const,
      label: KITCHEN_SENSOR_LABELS.sound,
      value: `${sensors.sound.level}%`,
      active: sensors.sound.alert,
    },
  ];

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      {items.map((item) => (
        <View
          key={item.key}
          style={[
            styles.chip,
            {
              backgroundColor: colors.surface,
              borderColor: item.active ? colors.accent : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.chipLabel,
              { color: colors.textSecondary, fontSize: typography.xs - 1 },
            ]}
          >
            {item.label}
          </Text>
          <Text
            style={[
              styles.chipValue,
              {
                color: item.active ? colors.accent : colors.text,
                fontSize: compact ? typography.xs : typography.sm,
              },
            ]}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  rowCompact: {
    marginBottom: spacing.sm,
  },
  chip: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  chipLabel: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  chipValue: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
