import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type Props = {
  xp: number;
  streak: number;
  daysStudying: number;
  completedItems?: number;
  totalItems?: number;
};

export function ProgressFooter({
  xp,
  streak,
  daysStudying,
  completedItems = 3,
  totalItems = 10,
}: Props) {
  const { colors } = useTheme();

  const safeCompleted = Math.min(completedItems, totalItems);

  const percentage =
    totalItems > 0
      ? Math.round((safeCompleted / totalItems) * 100)
      : 0;

  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const progressColor =
    percentage < 40
      ? '#EF4444'
      : percentage < 70
      ? '#F59E0B'
      : '#22C55E';

  return (
    <View style={[s.footer, { backgroundColor: colors.card.background }]}>

      <View style={s.progressContainer}>
        <View style={s.progressHeader}>
          <Text style={[s.progressText, { color: colors.text.secondary }]}>
            Progreso
          </Text>

          <Text style={[s.progressPercent, { color: colors.primary }]}>
            {percentage}%
          </Text>
        </View>

        <View
          style={[
            s.track,
            {
              backgroundColor: colors.card.border ?? '#E0E0E0',
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.05)',
            },
          ]}
        >
          <Animated.View
            style={[
              s.fill,
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>

        <Text style={[s.progressSub, { color: colors.text.secondary }]}>
          {safeCompleted} de {totalItems} completados
        </Text>
      </View>

      <View style={s.divider} />

      <View style={s.statsRow}>

        <View style={s.stat}>
          <Image
            source={require('../../assets/images/graphic/iconos_oscuros/graphic/XP_icon.png')}
            style={{ width: 80, height: 80, left: -6 }}
            resizeMode="contain"
          />
          <Text style={[s.statValue, { color: '#22C55E' }]}>{xp}</Text>
          <Text style={[s.statLabel, { color: colors.text.secondary }]}>
            XP ganado
          </Text>
        </View>

        <View style={s.stat}>
          <Image
            source={require('../../assets/images/graphic/iconos_oscuros/graphic/brain_icon.png')}
            style={{ width: 100, height: 100, left: 11 }}
            resizeMode="contain"
          />
          <Text style={[s.statValue, { color: colors.text.primary }]}>
            {daysStudying}
          </Text>
          <Text style={[s.statLabel, { color: colors.text.secondary }]}>
            días estudiando
          </Text>
        </View>

        <View style={s.stat}>
          <Image
            source={require('../../assets/images/graphic/iconos_oscuros/graphic/streak_icon.png')}
            style={{ width: 80, height: 80 }}
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
    </View>
  );
}

const s = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },

  progressContainer: {
    width: '100%',
    marginBottom: 10,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },

  progressPercent: {
    fontSize: 12,
    fontWeight: '900',
  },

  track: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 4,
  },

  fill: {
    height: '100%',
    borderRadius: 999,
  },

  progressSub: {
    fontSize: 10,
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
    marginVertical: 10,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  stat: {
    alignItems: 'center',
    gap: 4,
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