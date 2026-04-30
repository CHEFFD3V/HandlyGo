import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { useProgressStore } from '../../store/useProgressStore';
import { useEffect } from 'react';
import { useAssets } from '../../hooks/useAssets';
import { useRouter } from 'expo-router';
import { ProgressFooter } from '../../components/learn/ProgressFooter';

const LEVELS = [
  { id: 1, title: 'Letras y abecedario' },
  { id: 2, title: 'Palabras básicas' },
  { id: 3, title: 'Frases básicas' },
];

export default function AprendizajeScreen() {
  const { colors } = useTheme();
  const { xp, streak, daysStudying, unlockedLevels, isLoaded, initialize } = useProgressStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>

      {/* ── Hero azul con ola ── */}
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

      {/* ── Ola decorativa ── */}
      <View style={[s.waveWrapper, { backgroundColor: colors.background }]}>
        <Svg
          viewBox="0 0 390 60"
          width="100%"
          height={60}
          preserveAspectRatio="none"
          style={{ marginTop: -1 }}
        >
          <Path
            d="M0 0 Q100 60 200 30 Q300 0 390 40 L390 0 Z"
            fill={colors.primary}
          />
        </Svg>
      </View>

      {/* ── Contenido ── */}
      <View
        style={s.scroll}>
        <Text style={[s.sectionTitle, { color: colors.primary }]}>NIVELES</Text>

        {LEVELS.map((level) => {
          const isUnlocked = unlockedLevels.includes(level.id) || level.id === 1;

          return (
            <TouchableOpacity
              key={level.id}
              activeOpacity={isUnlocked ? 0.75 : 1}
              disabled={!isUnlocked}
              onPress={() =>
                router.push({
                  pathname: '../learn/[levelId]',
                  params: { levelId: String(level.id) },
                })
              }
              style={[
                s.card,
                {
                  backgroundColor: colors.background,
                  borderColor: isUnlocked ? colors.primary : colors.card.border,
                  opacity: isUnlocked ? 1 : 0.45,
                },
              ]}
            >
              <Text style={[s.cardLevel, { color: colors.primary }]}>
                Nivel {level.id}›
              </Text>
              <Text style={[s.cardTitle, { color: colors.text.secondary }]}>
                {level.title}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 180 }} />
      </View>

      {/* ── Footer de progreso ── */}
      <ProgressFooter xp={xp} streak={streak} daysStudying={daysStudying} />

    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },

  // Hero
  hero: {
    paddingTop: 52,
    paddingHorizontal: 28,
    paddingBottom: 32,
    alignItems: 'center',
  },
  heroBubble: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 6,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.9,
  },

  // Ola
  waveWrapper: {
    marginTop: -1,
  },

  // Scroll
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Título sección
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16,
    letterSpacing: 1,
  },

  // Tarjeta de nivel
  card: {
    borderWidth: 1.5,
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLevel: {
    fontSize: 15,
    fontWeight: '800',
    alignSelf: 'flex-start',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
  },
});