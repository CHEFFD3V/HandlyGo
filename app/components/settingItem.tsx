import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
 
// ─── Types ───────────────────────────────────────────────────────────────────
 
type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  showChevron?: boolean;
} & (
  | { type: 'toggle'; value: boolean; onToggle: (val: boolean) => void }
  | { type: 'action'; onPress: () => void }
  | { type: 'info'; value: string }
  | {
      type: 'sensor';
      /** Current sensor value 0-100 */
      value: number;
      /** Baseline captured during calibration (optional) */
      baseline?: number;
      /** Whether sensor has been calibrated */
      calibrated?: boolean;
    }
);
 
function withAlpha(hex: string, alpha: number): string {
  const safeAlpha = Math.max(0, Math.min(1, alpha));
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
}

// ─── Sensor bar sub-component ─────────────────────────────────────────────────
 
function SensorValueBar({
  value,
  calibrated = false,
  colors,
}: {
  value: number;
  calibrated?: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const barColor =
    clampedValue < 30
      ? colors.accent
      : clampedValue < 65
        ? withAlpha(colors.accent, 0.75)
        : colors.primary;
 
  return (
    <View style={barStyles.container}>
      <View style={[barStyles.track, { backgroundColor: colors.card.border + '33' }]}>
        <View
          style={[
            barStyles.fill,
            { width: `${clampedValue}%`, backgroundColor: barColor },
          ]}
        />
      </View>
      <View style={barStyles.meta}>
        <Text style={[barStyles.valueText, { color: colors.text.primary }]}>
          {clampedValue.toFixed(1)}%
        </Text>
        {calibrated && (
          <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
        )}
      </View>
    </View>
  );
}
 
const barStyles = StyleSheet.create({
  container: {
    marginTop: 6,
    gap: 3,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
 
// ─── Main SettingItem ─────────────────────────────────────────────────────────
 
export function SettingItem(props: SettingItemProps) {
  const { colors } = useTheme();
  const isAction = props.type === 'action';
  const Container = isAction ? Pressable : View;
 
  return (
    <Container
      {...(isAction ? { onPress: props.onPress } : {})}
      {...(isAction
        ? {
            style: ({ pressed }: { pressed: boolean }) => [
              styles.item,
              {
                backgroundColor: colors.card.background,
                borderColor: colors.card.border,
                opacity: pressed ? 0.82 : 1,
              },
            ],
          }
        : {
            style: [
              styles.item,
              {
                backgroundColor: colors.card.background,
                borderColor: colors.card.border,
              },
            ],
          })}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.primary + '18' }]}>
        <Ionicons name={props.icon} size={20} color={colors.primary} />
      </View>
 
      <View style={styles.textBlock}>
        <Text style={[styles.label, { color: colors.text.primary }]}>
          {props.label}
        </Text>
 
        {props.description && (
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            {props.description}
          </Text>
        )}
 
        {/* Sensor type: render inline progress bar */}
        {props.type === 'sensor' && (
          <SensorValueBar
            value={props.value}
            calibrated={props.calibrated}
            colors={colors}
          />
        )}
      </View>
 
      {/* Toggle */}
      {props.type === 'toggle' && (
        <Switch
          value={props.value}
          onValueChange={props.onToggle}
          trackColor={{ false: colors.card.border, true: colors.primary }}
          thumbColor={colors.text.inverse}
        />
      )}
 
      {/* Action chevron */}
      {props.type === 'action' && props.showChevron !== false && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.text.secondary}
        />
      )}
 
      {/* Info value */}
      {props.type === 'info' && (
        <Text style={[styles.infoValue, { color: colors.text.secondary }]}>
          {props.value}
        </Text>
      )}
 
      {/* Sensor: baseline badge */}
      {props.type === 'sensor' && props.baseline !== undefined && (
        <View style={styles.baselineBadge}>
          <Text style={[styles.baselineLabel, { color: colors.text.secondary }]}>
            Base
          </Text>
          <Text style={[styles.baselineValue, { color: colors.text.primary }]}>
            {props.baseline.toFixed(0)}%
          </Text>
        </View>
      )}
    </Container>
  );
}
 
// ─── Styles ──────────────────────────────────────────────────────────────────
 
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
    gap: 12,
    minHeight: 68,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  baselineBadge: {
    alignItems: 'center',
    minWidth: 44,
  },
  baselineLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  baselineValue: {
    fontSize: 13,
    fontWeight: '700',
  },
});