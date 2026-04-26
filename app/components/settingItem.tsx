import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  showChevron?: boolean;
} & (
  | { type: 'toggle'; value: boolean; onToggle: (val: boolean) => void }
  | { type: 'action'; onPress: () => void }
  | { type: 'info'; value: string }
);

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
      </View>

      {props.type === 'toggle' && (
        <Switch
          value={props.value}
          onValueChange={props.onToggle}
          trackColor={{ false: colors.card.border, true: colors.primary }}
          thumbColor={colors.text.inverse}
        />
      )}

      {props.type === 'action' && props.showChevron !== false && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.text.secondary}
        />
      )}

      {props.type === 'info' && (
        <Text style={[styles.infoValue, { color: colors.text.secondary }]}>
          {props.value}
        </Text>
      )}
    </Container>
  );
}

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
});
