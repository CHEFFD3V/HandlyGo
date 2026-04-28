import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { LessonPath } from './LessonPath';

type Lesson = {
  id: number;
  title: string;
  completed: boolean;
  current?: boolean;
};

type Props = {
  levelNumber: number;
  title: string;
  isUnlocked: boolean;
  lessons?: Lesson[];
  onContinue?: () => void;
};

export function LevelCard({ levelNumber, title, isUnlocked, lessons = [], onContinue }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: colors.card.background,
          borderColor: isUnlocked ? colors.primary : colors.card.border,
          opacity: isUnlocked ? 1 : 0.5,
        },
      ]}
    >
      {/* Encabezado de la tarjeta */}
      <TouchableOpacity
        disabled={!isUnlocked}
        activeOpacity={0.7}
        style={s.header}
      >
        <Text style={[s.levelLabel, { color: colors.primary }]}>
          Nivel {levelNumber}
          <Text style={[s.chevron, { color: colors.primary }]}>›</Text>
        </Text>
        <Text style={[s.levelTitle, { color: colors.text.secondary }]}>{title}</Text>
      </TouchableOpacity>

      {/* Camino de lecciones solo si está desbloqueado y tiene lecciones */}
      {isUnlocked && lessons.length > 0 && (
        <>
          <LessonPath lessons={lessons} />
          <TouchableOpacity
            style={[s.continueBtn, { backgroundColor: colors.primary }]}
            onPress={onContinue}
            activeOpacity={0.85}
          >
            <Text style={[s.continueTxt, { color: colors.text.inverse }]}>CONTINUAR</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Indicador de bloqueado */}
      {!isUnlocked && (
        <Text style={[s.locked, { color: colors.text.secondary }]}>🔒 Bloqueado</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  levelLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  chevron: {
    fontSize: 16,
    fontWeight: '400',
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
    textAlign: 'center',
  },
  continueBtn: {
    marginHorizontal: 40,
    marginBottom: 20,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueTxt: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  locked: {
    textAlign: 'center',
    paddingVertical: 14,
    fontSize: 13,
  },
});