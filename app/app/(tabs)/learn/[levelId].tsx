import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { LessonPath } from '../../../components/learn/LessonPath';
import { LEVEL_DATA } from '../../../constants/learnData';
import { useProgressStore } from '../../../store/useProgressStore';

export default function LevelScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { completedLessons } = useProgressStore();

  const data = LEVEL_DATA[levelId ?? '1'];

  const handleLessonPress = (lessonId: number, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    router.push({
      pathname: '/(tabs)/learn/lesson',
      params: { levelId, lessonId },
    });
  };

  if (!data) {
    return (
      <View style={[s.root, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text.primary, padding: 24 }}>
          Nivel no encontrado.
        </Text>
      </View>
    );
  }

  const allCompleted = data.lessons.every((l) =>
    completedLessons.includes(l.lessonKey)
  );

  const handleContinue = () => {
    if (allCompleted) {
      // Todas las lecciones completas — volver a la pantalla de niveles
      router.push('/(tabs)/aprendizaje');
      return;
    }

    // Encuentra la primera lección no completada
    const nextLesson = data.lessons.find(
      (l) => !completedLessons.includes(l.lessonKey)
    );
    if (!nextLesson) return;

    const nextIndex = data.lessons.indexOf(nextLesson);
    const isUnlocked =
      nextIndex === 0 ||
      completedLessons.includes(data.lessons[nextIndex - 1].lessonKey);

    handleLessonPress(nextLesson.id, isUnlocked);
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>

      {/* ── Header ── */}
      <View style={s.header}>
    <TouchableOpacity
    onPress={() => router.push('/(tabs)/aprendizaje')}
    style={s.backBtn}
  >
  <Ionicons name="chevron-back-circle" size={32} color={colors.primary} />
</TouchableOpacity>

        <Text style={[s.title, { color: colors.text.primary }]}>
          <Text style={{ color: colors.primary }}>Nivel {levelId}›</Text>
          {'  '}{data.title}
        </Text>
      </View>

      {/* ── Tarjeta con el camino ── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.card, { backgroundColor: colors.card.background }]}>
          <LessonPath
            lessons={data.lessons}
            completedLessons={completedLessons}
            onPressLesson={handleLessonPress}
          />
        </View>

        {/* ── Botón CONTINUAR ── */}
        <TouchableOpacity
          style={[s.continueBtn, {
            backgroundColor: colors.background,
            borderColor: colors.card.border,
          }]}
          activeOpacity={0.8}
          onPress={handleContinue}
        >
          <Text style={[s.continueTxt, { color: colors.text.primary }]}>
            {allCompleted ? 'VOLVER A NIVELES' : 'CONTINUAR'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>

    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 52,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backBtn: {
    flexShrink: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 74,
    paddingBottom: 55,
    marginBottom: 80,
    marginTop: 36,
  },
  continueBtn: {
    width: '70%',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  continueTxt: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});