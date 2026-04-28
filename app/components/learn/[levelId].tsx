import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import {LessonPath} from '../../components/learn/LessonPath';

export default function LevelScreen() {
  const { levelId } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

const lessons = [
  { id: 1, title: 'Las vocales', completed: true },
  { id: 2, title: 'Práctica del abecedario', completed: true },
  { id: 3, title: 'Formación de palabras con el abecedario', current: true, completed: false },
];

const handleLessonPress = (lessonId: number) => {
  router.push({
    pathname: '/learn/lesson', // ✅ ruta absoluta correcta
    params: {
      levelId,
      lessonId,
    },
  });
};

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>

        <Text style={[s.title, { color: colors.primary }]}>
          Nivel {levelId} › Letras y abecedario
        </Text>
      </View>

      {/* CARD CON CAMINO */}
      <View style={s.card}>
        <LessonPath  lessons={lessons}
        onPressLesson={handleLessonPress} />
      </View>

      {/* BOTÓN CONTINUAR */}
      <TouchableOpacity style={s.continueBtn}>
        <Text style={s.continueText}>CONTINUAR</Text>
      </TouchableOpacity>

    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
  },

  card: {
    flex: 1,
    backgroundColor: '#F2F3F7',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
  },

  continueBtn: {
    backgroundColor: '#EDEEF2',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
  },

  continueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2C2C2C',
  },
});