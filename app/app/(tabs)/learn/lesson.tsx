import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { LEVEL_DATA } from '../../../constants/learnData';
import { SignCard } from '../../../components/learn/SignCard';
import { AppPressable } from '../../../components/ui/app-pressable';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LessonScreen() {
  const { levelId, lessonId } = useLocalSearchParams<{ levelId: string; lessonId: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const levelData = LEVEL_DATA[levelId ?? '1'];
  const lesson = levelData?.lessons.find((l) => l.id === Number(lessonId));

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!lesson) {
    return (
      <View style={[s.root, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text.primary, padding: 24 }}>
          Lección no encontrada.
        </Text>
      </View>
    );
  }

  const sign = lesson.signs[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === lesson.signs.length - 1;
  const hasMultipleSigns = lesson.signs.length > 1;

  const handleContinue = () => {
  if (!isLast) {
    setCurrentIndex((i) => i + 1);
  } else {
    router.push({
      pathname: '/(tabs)/learn/reward',
      params: { levelId, lessonId, xp: lesson.xpReward },
    });
  }
};

  const handleRepeat = () => {
    setCurrentIndex(currentIndex); // fuerza re-render del SignCard para reiniciar el video
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>

      {/* ── Header ── */}
      <View style={s.header}>
        <AppPressable
        onPress={() =>
        router.push({
        pathname: '/(tabs)/learn/[levelId]',
        params: { levelId },
      })
  }
  style={s.backBtn}
>
  <Ionicons name="chevron-back-circle" size={32} color={colors.primary} />
</AppPressable>
        <Text style={[s.headerTitle, { color: colors.text.primary }]}>
          {lesson.title}
        </Text>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Indicador de progreso (solo si hay múltiples señas) ── */}
        {hasMultipleSigns && (
          <View style={s.progressRow}>
            {lesson.signs.map((_, i) => (
              <View
                key={i}
                style={[
                  s.progressDot,
                  {
                    backgroundColor:
                      i === currentIndex
                        ? colors.primary
                        : i < currentIndex
                        ? '#22C55E'
                        : colors.card.border,
                    width: i === currentIndex ? 20 : 8,
                  },
                ]}
              />
            ))}
          </View>
        )}

        {/* ── Tarjeta de la seña ── */}
        <SignCard sign={sign} />

        {/* ── Navegación anterior (solo si hay múltiples señas) ── */}
        {hasMultipleSigns && !isFirst && (
          <AppPressable
            style={[s.prevBtn, { borderColor: colors.card.border }]}
            onPress={() => setCurrentIndex((i) => i - 1)}
          >
            <Ionicons name="chevron-back" size={18} color={colors.text.secondary} />
            <Text style={[s.prevTxt, { color: colors.text.secondary }]}>Anterior</Text>
          </AppPressable>
        )}

        {/* ── Botones principales ── */}
        <View style={s.btnGroup}>
          <AppPressable
            style={[s.btnSecondary, {
              backgroundColor: colors.card.background,
              borderColor: colors.card.border,
            }]}
            onPress={handleRepeat}
          >
            <Text style={[s.btnSecondaryTxt, { color: colors.text.primary }]}>
              Repetir lección
            </Text>
          </AppPressable>

          <AppPressable
            style={[s.btnPrimary, { backgroundColor: colors.card.background, borderColor: colors.card.border }]}
            onPress={handleContinue}
            pressedScale={0.92}
            pressedOpacity={0.82}
          >
            <Text style={[s.btnPrimaryTxt, { color: colors.text.primary }]}>
              {isLast ? 'Finalizar' : 'Continuar'}
            </Text>
          </AppPressable>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
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
    marginBottom: 16,
  },
  backBtn: { flexShrink: 0 },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    flexShrink: 1,
  },
  scroll: { flex: 1, paddingHorizontal: 20 },
  scrollContent: { alignItems: 'center', paddingBottom: 20 },

  // Indicador de progreso
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },

  // Botón anterior
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  prevTxt: { fontSize: 13 },

  // Botones principales
  btnGroup: {
    width: '100%',
    gap: 12,
    marginTop: 24,
  },
  btnSecondary: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  btnSecondaryTxt: {
    fontSize: 16,
    fontWeight: '700',
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  btnPrimaryTxt: {
    fontSize: 16,
    fontWeight: '700',
  },
});
