import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
} & (
  | { type: 'toggle'; value: boolean; onToggle: (val: boolean) => void }
  | { type: 'action'; onPress: () => void }
  | { type: 'info'; value: string }
);

export default function SettingItem(props: SettingItemProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        s.item,
        {
          backgroundColor: colors.card.background,
          borderColor: colors.card.border,
        },
      ]}
    >
      <View style={[s.iconWrap, { backgroundColor: colors.primary + '18' }]}>
        <Ionicons name={props.icon} size={20} color={colors.primary} />
      </View>

      <View style={s.textBlock}>
        <Text style={[s.label, { color: colors.text.primary }]}>
          {props.label}
        </Text>
        {props.description ? (
          <Text style={[s.description, { color: colors.text.secondary }]}>
            {props.description}
          </Text>
        ) : null}
      </View>

      {props.type === 'toggle' && (
        <Switch
          value={props.value}
          onValueChange={props.onToggle}
          trackColor={{ false: colors.card.border, true: colors.primary }}
          thumbColor={colors.text.inverse}
        />
      )}

      {props.type === 'action' && (
        <TouchableOpacity onPress={props.onPress}>
          <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
        </TouchableOpacity>
      )}

      {props.type === 'info' && (
        <Text style={[s.infoValue, { color: colors.text.secondary }]}>
          {props.value}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
    gap: 12,
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
});
