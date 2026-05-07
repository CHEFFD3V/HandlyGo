import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { Lesson } from '../../constants/learnData';

type Props = {
  lessons: Lesson[];
  completedLessons: string[];
  onPressLesson: (lessonId: number, isUnlocked: boolean) => void;
};

const ROW_HEIGHT = 90;
const CIRCLE_RADIUS = 22;
const NODE_X_RATIO = [0.22, 0.78];

export function LessonPath({ lessons, completedLessons, onPressLesson }: Props) {
  const { colors } = useTheme();
  const [containerWidth, setContainerWidth] = useState(300);

  const totalHeight = ROW_HEIGHT * lessons.length + 60;
  const nodeX = lessons.map((_, i) => containerWidth * NODE_X_RATIO[i % 2]);
  const nodeY = lessons.map((_, i) => 40 + i * ROW_HEIGHT);

  const buildPath = () => {
    if (lessons.length < 2) return '';
    let d = `M ${nodeX[0]} ${nodeY[0]}`;
    for (let i = 1; i < lessons.length; i++) {
      const x1 = nodeX[i - 1];
      const y1 = nodeY[i - 1];
      const x2 = nodeX[i];
      const y2 = nodeY[i];
      const cy = (y1 + y2) / 2;
      d += ` C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;
    }
    const lastX = nodeX[lessons.length - 1];
    const lastY = nodeY[lessons.length - 1];
    const finalX = containerWidth / 2;
    const finalY = totalHeight - 30;
    const cy = (lastY + finalY) / 2;
    d += ` C ${lastX} ${cy}, ${finalX} ${cy}, ${finalX} ${finalY}`;
    return d;
  };

  return (
    <View
      style={[s.container, { height: totalHeight }]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Svg width={containerWidth} height={totalHeight} style={s.svg}>
        <Path
          d={buildPath()}
          stroke="#CBD5E1"
          strokeWidth={3}
          strokeDasharray="8 6"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      {lessons.map((lesson, index) => {
        const isLeft = index % 2 === 0;
        const x = nodeX[index];
        const y = nodeY[index];

        const isCompleted = completedLessons.includes(lesson.lessonKey);

        // Desbloqueada si es la primera, o si la anterior está completada
        const isUnlocked =
          index === 0 ||
          completedLessons.includes(lessons[index - 1].lessonKey);

        const circleBg = isCompleted
          ? '#22C55E'       // verde — completada
          : isUnlocked
          ? colors.primary  // azul — disponible
          : '#CBD5E1';      // gris — bloqueada

        return (
          <TouchableOpacity
            key={lesson.id}
            onPress={() => onPressLesson(lesson.id, isUnlocked)}
            activeOpacity={isUnlocked ? 0.7 : 1}
            style={[s.nodeWrapper, { top: y - CIRCLE_RADIUS, left: x - CIRCLE_RADIUS }]}
          >
            <View style={[s.circle, { backgroundColor: circleBg }]}>
              <Text style={s.circleText}>
                {isCompleted ? '✓' : isUnlocked ? String(lesson.id) : '🔒'}
              </Text>
            </View>

            <View style={[s.label, isLeft ? s.labelRight : s.labelLeft]}>
              <Text style={[s.lessonNum, { color: colors.text.secondary }]}>
                Lección {lesson.id}:
              </Text>
              <Text
                style={[
                  s.lessonTitle,
                  { color: isUnlocked ? colors.text.primary : colors.text.secondary },
                ]}
              >
                {lesson.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Nodo FINAL */}
      <View style={[s.finalWrapper, { top: totalHeight - 56, left: containerWidth / 2 - 36 }]}>
        <View style={[s.finalBtn, { backgroundColor: colors.primary }]}>
          <Text style={[s.finalTxt, { color: colors.text.inverse }]}>FINAL</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { width: '100%', position: 'relative' },
  svg: { position: 'absolute', top: 0, left: 0 },
  nodeWrapper: { position: 'absolute', flexDirection: 'row', alignItems: 'center' },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  circleText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  label: { position: 'absolute', width: 110 },
  labelRight: { left: 52 },
  labelLeft: { right: 52 },
  lessonNum: { fontSize: 11, fontWeight: '700' },
  lessonTitle: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  finalWrapper: { position: 'absolute' },
  finalBtn: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20 },
  finalTxt: { fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },
});