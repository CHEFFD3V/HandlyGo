import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useProgressStore } from '../../store/useProgressStore';
import { useEffect } from 'react';
import { LevelCard } from '../../components/learn/LevelCard';
import { LessonPath } from '../../components/learn/LessonPath';
import { ProgressFooter } from '../../components/learn/ProgressFooter';

// Datos hardcodeados — sin lógica real todavía
const LEVELS = [
  {
    id: 1,
    title: 'Letras y abecedario',
    lessons: [
      { id: 1, title: 'Las vocales', completed: true },
      { id: 2, title: 'Práctica del abecedario', completed: true },
      { id: 3, title: 'Formación de palabras con el abecedario', completed: false, current: true },
    ],
  },
  {
    id: 2,
    title: 'Palabras básicas',
    lessons: [],
  },
  {
    id: 3,
    title: 'Frases básicas',
    lessons: [],
  },
];

export default function AprendizajeScreen() {
  const { colors } = useTheme();
  const { xp, streak, daysStudying, unlockedLevels, isLoaded, initialize } = useProgressStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      {/* Header hero */}
      <View style={[s.hero, { backgroundColor: colors.primary }]}>
        <View style={s.heroBubble}>
          <Text style={[s.heroTitle, { color: colors.text.inverse }]}>
            Bienvenido a la zona de aprendizaje
          </Text>
          <Text style={[s.heroSub, { color: colors.text.inverse }]}>
            Completa lecciones, gana XP y mantén tu racha activa
          </Text>
        </View>
      </View>

      {/* Sección de niveles */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[s.sectionTitle, { color: colors.primary }]}>NIVELES</Text>

        {LEVELS.map((level) => {
          const isUnlocked = unlockedLevels.includes(level.id) || level.id === 1;
          return (
            <LevelCard
              key={level.id}
              levelNumber={level.id}
              title={level.title}
              isUnlocked={isUnlocked}
              lessons={level.lessons}
            />
          );
        })}

        {/* Espaciado para el footer + navbar */}
        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Footer de progreso fijo */}
      <ProgressFooter xp={xp} streak={streak} daysStudying={daysStudying} />
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  hero: {
    paddingTop: 56,
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
  },
  heroBubble: {
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.85,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16,
    letterSpacing: 1,
  },
});