import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type Props = {
  xp: number;
  streak: number;
  daysStudying: number;
};

export function ProgressFooter({ xp, streak, daysStudying }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[s.footer, { backgroundColor: colors.card.background }]}>
      
      {/* XP */}
      <View style={s.stat}>
        <Image
          source={require('../../assets/images/graphic/iconos_oscuros/graphic/XP_icon.png')}
          style={s.icon}
          resizeMode="contain"
        />
        <Text style={[s.statValue, { color: '#22C55E' }]}>{xp}</Text>
        <Text style={[s.statLabel, { color: colors.text.secondary }]}>
          XP ganado
        </Text>
      </View>

      {/* Días estudiando */}
      <View style={s.stat}>
        <Image
          source={require('../../assets/images/graphic/iconos_oscuros/graphic/brain_icon.png')}
          style={s.icon}
          resizeMode="contain"
        />
        <Text style={[s.statValue, { color: colors.text.primary }]}>
          {daysStudying}
        </Text>
        <Text style={[s.statLabel, { color: colors.text.secondary }]}>
          días estudiando
        </Text>
      </View>

      {/* Racha */}
      <View style={s.stat}>
        <Image
          source={require('../../assets/images/graphic/iconos_oscuros/graphic/streak_icon.png')}
          style={s.icon}
          resizeMode="contain"
        />
        <Text style={[s.statValue, { color: '#FF4500' }]}>
          {streak}
        </Text>
        <Text style={[s.statLabel, { color: colors.text.secondary }]}>
          Racha
        </Text>
      </View>

    </View>
  );
}

const s = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 68,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    width: 36,
    height: 36,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '400',
  },
});