import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { useProgressStore } from '../../../store/useProgressStore';
import { LEVEL_DATA } from '../../../constants/learnData';

export default function RewardScreen() {
  const { levelId, lessonId, xp } = useLocalSearchParams<{
    levelId: string;
    lessonId: string;
    xp: string;
  }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { completeLesson, unlockLevel } = useProgressStore();

  const levelData = LEVEL_DATA[levelId ?? '1'];
  const lesson = levelData?.lessons.find((l) => l.id === Number(lessonId));

  // Se ejecuta una sola vez al montar — guarda el progreso
  const saved = useRef(false);
  useEffect(() => {
    if (!saved.current && lesson) {
      // Marca la lección como completada usando su lessonKey único
      completeLesson(lesson.lessonKey, Number(xp));

      // Si era la última lección del nivel, desbloquea el siguiente
      const isLastLesson =
        levelData.lessons[levelData.lessons.length - 1].id === lesson.id;
      if (isLastLesson) {
        unlockLevel(Number(levelId) + 1);
      }

      saved.current = true;
    }
  }, []);

  const handleNext = () => {
    router.push({
      pathname: '/(tabs)/learn/[levelId]',
      params: { levelId },
    });
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={handleNext} style={s.backBtn}>
          <Ionicons name="chevron-back-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text.primary }]}>
          Recompensa de XP
        </Text>
      </View>

      <View style={s.content}>

        {/* ── Tarjeta de éxito ── */}
        <View style={[s.successCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={s.sparkles}>✦ ✦{'\n'}  ✦</Text>
          <Text style={[s.excelente, { color: '#22C55E' }]}>¡ Excelente!</Text>
          <Text style={[s.subtitle, { color: colors.text.secondary }]}>
            Has completado esta lección
          </Text>
        </View>

        {/* ── Tarjeta de XP ── */}
        <View style={[s.xpCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={s.handEmoji}>🤙</Text>
          <View style={s.xpInfo}>
            <Text style={[s.xpLabel, { color: '#22C55E' }]}>✦ +{xp} XP</Text>
            <View style={[s.progressBar, { backgroundColor: '#A5D6A7' }]}>
              <View style={[s.progressFill, { backgroundColor: '#22C55E' }]} />
            </View>
          </View>
        </View>

        {/* ── Botón Siguiente ── */}
        <TouchableOpacity
          style={[s.nextBtn, {
            backgroundColor: colors.background,
            borderColor: colors.card.border,
          }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={[s.nextTxt, { color: colors.text.primary }]}>Siguiente</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, paddingTop: 52 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  backBtn: { flexShrink: 0 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
    alignItems: 'center',
  },
  successCard: {
    width: '100%',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  sparkles: {
    fontSize: 36,
    textAlign: 'center',
    lineHeight: 38,
    color: '#FFD700',
  },
  excelente: {
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
  },
  xpCard: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  handEmoji: {
    fontSize: 48,
  },
  xpInfo: {
    flex: 1,
    gap: 10,
  },
  xpLabel: {
    fontSize: 22,
    fontWeight: '900',
  },
  progressBar: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    // TODO: calcular dinámicamente con el XP real del usuario cuando llegue el backend
    width: '75%',
    height: '100%',
    borderRadius: 6,
  },
  nextBtn: {
    width: '60%',
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
    marginTop: 8,
  },
  nextTxt: {
    fontSize: 16,
    fontWeight: '700',
  },
});