import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { LessonPath } from '../../../components/learn/LessonPath';

const LEVEL_DATA: Record<string, { title: string; lessons: { id: number; title: string; completed: boolean; current?: boolean }[] }> = {
  '1': {
    title: 'Letras y abecedario',
    lessons: [
      { id: 1, title: 'Las vocales', completed: true },
      { id: 2, title: 'Práctica del abecedario', completed: true },
      { id: 3, title: 'Formación de palabras con el abecedario', completed: false, current: true },
    ],
  },
  '2': {
    title: 'Palabras básicas',
    lessons: [
      { id: 1, title: 'Saludos básicos', completed: false, current: true },
      { id: 2, title: 'Números del 1 al 10', completed: false },
      { id: 3, title: 'Colores principales', completed: false },
    ],
  },
  '3': {
    title: 'Frases básicas',
    lessons: [
      { id: 1, title: 'Presentaciones personales', completed: false, current: true },
      { id: 2, title: 'Frases de cortesía', completed: false },
      { id: 3, title: 'Preguntas simples', completed: false },
    ],
  },
};

export default function LevelScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const data = LEVEL_DATA[levelId ?? '1'];

  const handleLessonPress = (lessonId: number) => {
    router.push({
      pathname: '../(tabs)/learn/lesson',
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

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
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
          <LessonPath lessons={data.lessons} onPressLesson={handleLessonPress} />
        </View>

        {/* ── Botón CONTINUAR ── */}
        <TouchableOpacity
          style={[s.continueBtn, {
            backgroundColor: colors.background,
            borderColor: colors.card.border,
          }]}
          activeOpacity={0.8}
          onPress={() => {
            
            const next = data.lessons.find((l) => !l.completed);
            if (next) handleLessonPress(next.id);
          }}
        >
          <Text style={[s.continueTxt, { color: colors.text.primary }]}>
            CONTINUAR
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
  marginTop:36,
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