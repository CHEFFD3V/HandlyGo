import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type Lesson = {
  id: number;
  title: string;
  completed: boolean;
  current?: boolean;
};

type Props = {
  lessons: Lesson[];
};

// Alterna la posición del nodo: izquierda → derecha → izquierda...
const OFFSETS = ['15%', '55%', '15%', '55%'] as const;

export function LessonPath({ lessons }: Props) {
  const { colors } = useTheme();

  return (
    <View style={s.container}>
      {/* Línea decorativa de fondo */}
      <View style={[s.line, { borderColor: colors.card.border }]} />

      {lessons.map((lesson, index) => {
        const isLeft = index % 2 === 0;
        const offset = OFFSETS[index % OFFSETS.length];

        // Colores según estado
        const circleBg = lesson.completed
          ? '#22C55E'       // verde
          : lesson.current
          ? colors.primary  // azul primario
          : colors.card.border;

        const circleContent = lesson.completed ? '✓' : String(lesson.id);

        return (
          <View
            key={lesson.id}
            style={[
              s.row,
              { flexDirection: isLeft ? 'row' : 'row-reverse', marginLeft: isLeft ? 8 : 0 },
            ]}
          >
            {/* Nodo circular */}
            <View
              style={[
                s.circle,
                { backgroundColor: circleBg, marginLeft: isLeft ? 0 : 'auto' },
              ]}
            >
              <Text style={s.circleText}>{circleContent}</Text>
            </View>

            {/* Título de la lección */}
            <View style={s.labelBox}>
              <Text style={[s.lessonTitle, { color: colors.text.primary }]}>
                <Text style={[s.lessonNum, { color: colors.text.secondary }]}>
                  Lección {lesson.id}:{' '}
                </Text>
                {lesson.title}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Nodo final */}
      <View style={s.finalRow}>
        <View style={[s.finalBtn, { backgroundColor: colors.primary }]}>
          <Text style={[s.finalTxt, { color: colors.text.inverse }]}>FINAL</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    left: '40%',
    top: 0,
    bottom: 0,
    width: 2,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  row: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  circleText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  labelBox: {
    flex: 1,
    maxWidth: '60%',
  },
  lessonNum: {
    fontSize: 12,
    fontWeight: '600',
  },
  lessonTitle: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  finalRow: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  finalBtn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 20,
  },
  finalTxt: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});