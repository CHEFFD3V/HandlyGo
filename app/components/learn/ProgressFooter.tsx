import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

type Props = {
  xp: number;
  streak: number;
  daysStudying: number;
};

// ── SVG: Estrella XP
function XpStar() {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36">
      <Path
        d="M18 3l3.9 8.1L31 12.3l-6.5 6.3 1.5 9L18 23.1l-8 4.5 1.5-9L5 12.3l9.1-1.2z"
        fill="#FFD700"
      />
      <Text
        x="50%"
        y="58%"
        textAnchor="middle"
        fontSize="9"
        fontWeight="900"
        fill="#7B4F00"
      >
        +XP
      </Text>
    </Svg>
  );
}

// ── SVG: Cerebro con bombilla
function BrainIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 64 64">
      {/* Cerebro simplificado */}
      <Path
        d="M32 8 C20 8 12 16 12 26 C12 34 16 40 24 43 L24 52 L40 52 L40 43 C48 40 52 34 52 26 C52 16 44 8 32 8 Z"
        fill="#F4A4A4"
      />
      <Path
        d="M32 8 C32 8 28 14 28 22 C28 30 32 36 32 36 C32 36 36 30 36 22 C36 14 32 8 32 8 Z"
        fill="#E07070"
        opacity={0.5}
      />
      {/* Bombilla */}
      <Circle cx="44" cy="14" r="7" fill="#FFD700" />
      <Path d="M41 21 L47 21 L46 25 L42 25 Z" fill="#FFD700" />
      <Path d="M42 25 L46 25" stroke="#999" strokeWidth="1" />
    </Svg>
  );
}

// ── SVG: Llama de fuego
function FlameIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 64 64">
      <Path
        d="M32 4 C32 4 20 20 20 34 C20 44 25 52 32 56 C39 52 44 44 44 34 C44 20 32 4 32 4 Z"
        fill="#FF4500"
      />
      <Path
        d="M32 20 C32 20 24 30 24 38 C24 44 27.5 50 32 52 C36.5 50 40 44 40 38 C40 30 32 20 32 20 Z"
        fill="#FF8C00"
      />
      <Path
        d="M32 32 C32 32 28 38 28 42 C28 46 30 50 32 50 C34 50 36 46 36 42 C36 38 32 32 32 32 Z"
        fill="#FFD700"
      />
    </Svg>
  );
}

export function ProgressFooter({ xp, streak, daysStudying }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[s.footer, { backgroundColor: colors.card.background }]}>
      {/* XP */}
      <View style={s.stat}>
        <XpStar />
        <Text style={[s.statValue, { color: '#22C55E' }]}>{xp}</Text>
        <Text style={[s.statLabel, { color: colors.text.secondary }]}>XP ganado</Text>
      </View>

      {/* Días estudiando */}
      <View style={s.stat}>
        <BrainIcon />
        <Text style={[s.statValue, { color: colors.text.primary }]}>{daysStudying}</Text>
        <Text style={[s.statLabel, { color: colors.text.secondary }]}>días estudiando</Text>
      </View>

      {/* Racha */}
      <View style={s.stat}>
        <FlameIcon />
        <Text style={[s.statValue, { color: '#FF4500' }]}>{streak}</Text>
        <Text style={[s.statLabel, { color: colors.text.secondary }]}>Racha</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 68, // sobre la navbar
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
    gap: 2,
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