import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

type Lesson = {
  id: number;
  title: string;
  completed: boolean;
  current?: boolean;
};

type Props = {
  lessons: Lesson[];
  onPressLesson: (lessonId: number) => void;
};


const ROW_HEIGHT = 90;
const SVG_WIDTH = 300;

export function LessonPath({ lessons, onPressLesson }: Props) {
  const { colors } = useTheme();

  const totalHeight = ROW_HEIGHT * lessons.length + 60;

  
  const nodeX = [60, 220, 60, 220];
  
  const nodeY = lessons.map((_, i) => 40 + i * ROW_HEIGHT);

  
  const buildPath = () => {
    if (lessons.length < 2) return '';
    let d = `M ${nodeX[0]} ${nodeY[0]}`;
    for (let i = 1; i < lessons.length; i++) {
      const x1 = nodeX[(i - 1) % nodeX.length];
      const y1 = nodeY[i - 1];
      const x2 = nodeX[i % nodeX.length];
      const y2 = nodeY[i];
      
      const cy = (y1 + y2) / 2;
      d += ` C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;
    }
    
    const lastX = nodeX[(lessons.length - 1) % nodeX.length];
    const lastY = nodeY[lessons.length - 1];
    const finalX = SVG_WIDTH / 2;
    const finalY = totalHeight - 30;
    const cy = (lastY + finalY) / 2;
    d += ` C ${lastX} ${cy}, ${finalX} ${cy}, ${finalX} ${finalY}`;
    return d;
  };

  return (
    <View style={[
    s.container,
    { height: totalHeight } 
  ]}>
      <Svg
        width={SVG_WIDTH}
        height={totalHeight}
        style={s.svg}
      >
        {/* Línea curva de fondo */}
        <Path
          d={buildPath()}
          stroke="#CBD5E1"
          strokeWidth={3}
          strokeDasharray="8 6"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      {/* Nodos de lección superpuestos sobre el SVG */}
      {lessons.map((lesson, index) => {
        const isLeft = index % 2 === 0;
        const x = nodeX[index % nodeX.length];
        const y = nodeY[index];

        const isCompleted = lesson.completed;
        const isCurrent = lesson.current;

        const circleBg = isCompleted
          ? '#22C55E'
          : isCurrent
          ? colors.primary
          : '#CBD5E1';

        const circleContent = isCompleted ? '✓' : String(lesson.id);

        return (
          <TouchableOpacity
            key={lesson.id}
            onPress={() => onPressLesson(lesson.id)}
            activeOpacity={0.7}
            style={[
              s.nodeWrapper,
              {
                top: y - 22,      
                left: x - 22,     
              },
            ]}
          >
            {/* Círculo */}
            <View style={[s.circle, { backgroundColor: circleBg }]}>
              <Text style={s.circleText}>{circleContent}</Text>
            </View>

            {/* Etiqueta a la derecha o izquierda según posición */}
            <View style={[s.label, isLeft ? s.labelRight : s.labelLeft]}>
              <Text style={[s.lessonNum, { color: colors.text.secondary }]}>
                Lección {lesson.id}:
              </Text>
              <Text style={[s.lessonTitle, { color: colors.text.primary }]}>
                {lesson.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Nodo FINAL */}
      <View
        style={[
          s.finalWrapper,
          { top: totalHeight - 30 - 16, left: SVG_WIDTH / 2 - 36 },
        ]}
      >
        <View style={[s.finalBtn, { backgroundColor: colors.primary }]}>
          <Text style={[s.finalTxt, { color: colors.text.inverse }]}>FINAL</Text>
        </View>
      </View>

    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: SVG_WIDTH,
    alignSelf: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  nodeWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
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
  label: {
    position: 'absolute',
    width: 110,
  },
  labelRight: {
    left: 52,   
  },
  labelLeft: {
    right: 52,  
  },
  lessonNum: {
    fontSize: 11,
    fontWeight: '700',
  },
  lessonTitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  finalWrapper: {
    position: 'absolute',
  },
  finalBtn: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  finalTxt: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});