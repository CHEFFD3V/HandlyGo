import {
  View, Text, ScrollView,
  StyleSheet, TouchableOpacity,
} from 'react-native';
import { useRef, useEffect } from 'react';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../hooks/useTheme";
import { useAssets } from "../../hooks/useAssets";
import { Image } from 'expo-image';
import { useAppStore } from '../../store/useAppStore';
import { useMockBluetooth } from '../../src/bluetooth/mockBluetooth';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

// Distancia en px desde el fondo para considerar que el usuario "está al fondo"
const AUTO_SCROLL_THRESHOLD = 24;

export default function HomeScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const assets = useAssets();

  // ── Store
  const currentWord = useAppStore((s) => s.currentWord);
  const history     = useAppStore((s) => s.history);
  const todayCount  = useAppStore((s) => s.todayCount);

  // ── Refs para el scroll automático
  const translationScrollRef = useRef<ScrollView>(null);
  const lastHistoryCountRef  = useRef(history.length);
  const shouldAutoScrollRef  = useRef(false);
  const isNearBottomRef      = useRef(true);

  // ── Animación de la tarjeta karaoke
  const opacity = useSharedValue(1);
  const scale   = useSharedValue(1);

  useMockBluetooth();

  const translationText = history.length > 0
    ? history.join(' ')
    : 'Esperando traducción...';

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(0, { duration: 200 }),
      withTiming(1, { duration: 300 }),
    );
    scale.value = withSequence(
      withTiming(0.8, { duration: 200 }),
      withTiming(1,   { duration: 300 }),
    );
  }, [currentWord]);

  useEffect(() => {
    const hasNewContent = history.length > lastHistoryCountRef.current;

    if (hasNewContent && isNearBottomRef.current) {
      shouldAutoScrollRef.current = true;
    }

    lastHistoryCountRef.current = history.length;
  }, [history.length]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[s.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header */}
        <View style={[s.header, { backgroundColor: colors.background }]}>
          <View style={[s.logoArea, { backgroundColor: colors.background }]}>
            <Image
              source={assets.logoPrincipal}
              style={s.logo}
              resizeMode="contain"
            />
          </View>

          <View style={s.waveContainer}>
            <Svg viewBox="0 0 390 150" width="100%" height={200} preserveAspectRatio="none">
              <Path
                d="M0 25 Q60 0 130 30 Q200 62 270 25 Q330 0 390 38 Q370 95 300 80 Q220 62 150 88 Q80 108 0 82 Z"
                fill={colors.wave.secondary}
              />
              <Path
                d="M0 58 Q60 12 130 42 Q200 74 270 37 Q330 12 390 50 Q370 105 300 90 Q220 72 150 98 Q80 118 0 99 Z"
                fill={colors.wave.primary}
                opacity={0.4}
              />
              <Path
                d="M0 58 Q60 12 130 42 Q200 74 270 37 Q330 12 390 50 Q370 105 300 90 Q220 72 150 98 Q80 118 0 99 Z"
                fill={colors.wave.secondary}
                opacity={0.4}
              />
            </Svg>
            <Text style={[s.waveText, { color: colors.waveText }]}>
              Observa, entiende y traduce
            </Text>
          </View>
        </View>

        {/* ── Tarjeta karaoke */}
        <Animated.View
          style={[
            s.karoCard,
            animatedStyle,
            { borderColor: colors.card.border, backgroundColor: colors.card.background },
          ]}
        >
          <Text style={[s.karoText, { color: colors.text.primary }]}>
            {currentWord ?? 'Esperando...'}
          </Text>
        </Animated.View>

        {/* ── Tarjetas inclinadas */}
        <View style={s.grid}>
          <View style={[s.gridCard, s.tiltLeft, { borderColor: colors.card.border, backgroundColor: colors.card.background }]}>
            <Text style={[s.gridLabel, { color: colors.text.secondary }]}>Gestos Recientes</Text>
            <Text style={[s.gridSmall, { color: colors.text.secondary }]}>
              {[...history].reverse().slice(0, 3).map(w => `• ${w}`).join('\n') || 'Sin gestos aún'}
            </Text>
          </View>

          <View style={[s.gridCard, s.tiltRight, { borderColor: colors.card.border, backgroundColor: colors.card.background }]}>
            <Text style={[s.gridLabel, { color: colors.text.secondary }]}>Gestos de Hoy</Text>
            <Text style={[s.gridValue, { color: colors.accent }]}>{todayCount}</Text>
          </View>
        </View>

        {/* ── Sección de traducción con auto-scroll */}
        <View
          style={[
            s.translateBox,
            { borderColor: colors.card.border, backgroundColor: colors.translation.background },
          ]}
        >
          <View style={s.translateViewport}>
            <Ionicons
              name="volume-medium-outline"
              size={20}
              color={colors.icon.primary}
              style={s.translateIcon}
            />

            <ScrollView
              ref={translationScrollRef}
              style={s.translateScroll}
              contentContainerStyle={s.translateContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={({ nativeEvent }) => {
                const distanceFromBottom =
                  nativeEvent.contentSize.height -
                  (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y);

                isNearBottomRef.current = distanceFromBottom <= AUTO_SCROLL_THRESHOLD;
              }}
              onContentSizeChange={() => {
                if (!shouldAutoScrollRef.current) return;

                translationScrollRef.current?.scrollToEnd({ animated: true });
                shouldAutoScrollRef.current = false;
              }}
            >
              <Text style={[s.translateText, { color: colors.translation.text }]}>
                {translationText}
              </Text>
            </ScrollView>

            <View pointerEvents="none" style={s.fadeTop}>
              <Svg width="100%" height="100%" preserveAspectRatio="none">
                <Defs>
                  <LinearGradient id="translateFadeTop" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={colors.translation.background} stopOpacity={1} />
                    <Stop offset="100%" stopColor={colors.translation.background} stopOpacity={0} />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#translateFadeTop)" />
              </Svg>
            </View>

          </View>

          <View style={s.translateFooter}>
            <Ionicons name="expand-outline" size={16} color={colors.primary} />
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header: {},

  logoArea: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 300,
    height: 300,
  },

  waveContainer: {
    width: '100%',
    position: 'relative',
    marginTop: -110,
  },
  waveText: {
    position: 'absolute',
    top: '32%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
  },

  container: {
    flex: 1,
  },

  karoCard: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  karoText: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },

  grid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  gridCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tiltLeft:  { transform: [{ rotate: '-3deg' }] },
  tiltRight: { transform: [{ rotate: '3deg' }] },
  gridLabel: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 6,
  },
  gridValue: {
    fontSize: 40,
    fontWeight: '900',
  },
  gridSmall: {
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
  },

  translateBox: {
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    minHeight: 160,
  },
  translateViewport: {
    position: 'relative',
    paddingBottom: 10,
  },
  translateScroll: {
    maxHeight: 180,
    minHeight: 120,
    paddingTop: 22,
    paddingLeft: 44,
  },
  translateContent: {
    flexGrow: 1,
    paddingRight: 16,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  translateIcon: {
    position: 'absolute',
    top: 26,
    left: 16,
    zIndex: 1,
  },
  translateText: {
    fontSize: 20,
    lineHeight: 28,
    flex: 1,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 26,
  },
  translateFooter: {
    alignItems: 'flex-end',
    paddingTop: 4,
    paddingRight: 12,
    paddingBottom: 8,
  },
});
