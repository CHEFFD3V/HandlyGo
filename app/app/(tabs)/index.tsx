import {
  View, Text, ScrollView,
  StyleSheet, TouchableOpacity,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Rect, Stop, Text as SvgText, TextPath } from 'react-native-svg';
import { useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../hooks/useTheme";
import { useAssets } from "../../hooks/useAssets";
import { Image } from 'expo-image';
import { useTranslationStore } from '../../store/useTranslationStore';
import { useMockBluetooth } from '../../src/bluetooth/mockBluetooth';
import { useAppStore } from '../../store/useAppStore';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

const AUTO_SCROLL_THRESHOLD = 24;
const RESET_DELAY_MS = 5000; // ← cambia este valor para ajustar el tiempo de espera

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const assets = useAssets();
  const currentWord = useTranslationStore((s) => s.currentWord?.texto ?? null);
  const historyRaw = useTranslationStore((s) => s.history);
  const history = historyRaw.map((w) => w.texto);
const todayCount = useAppStore((s) => s.todayCount);

  const translationScrollRef = useRef<ScrollView>(null);
  const lastHistoryCountRef  = useRef(history.length);
  const shouldAutoScrollRef  = useRef(false);
  const isNearBottomRef      = useRef(true);
  const resetTimerRef        = useRef<ReturnType<typeof setTimeout> | null>(null); // ← timer de reset

  const opacity = useSharedValue(1);
  const scale   = useSharedValue(1);

  useMockBluetooth();

  const translationText = history.length > 0
    ? history.join(' ')
    : 'Esperando traducción...';

  // ── Animación karaoke al cambiar palabra
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

  // ── Auto-scroll al llegar nueva palabra
  useEffect(() => {
    const hasNewContent = history.length > lastHistoryCountRef.current;
    if (hasNewContent && isNearBottomRef.current) {
      shouldAutoScrollRef.current = true;
    }
    lastHistoryCountRef.current = history.length;
  }, [history.length]);

  // ── Reset a "Esperando..." tras RESET_DELAY_MS sin actividad
  useEffect(() => {
  if (currentWord === null) return;

  if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

  resetTimerRef.current = setTimeout(() => {
  useTranslationStore.getState().clearCurrent(); // ← solo limpia la palabra actual
}, RESET_DELAY_MS);

  return () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  };
}, [currentWord]);

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

        {/* Logo */}
        <View style={[s.logoArea, { backgroundColor: colors.background }]}>
          <Image
            source={assets.logoPrincipal}
            style={s.logo}
            resizeMode="contain"
          />
        </View>

        {/* Ola */}
        <View style={s.waveArea}>
          <Svg
            viewBox="0 0 1024 504"
            width="100%"
            height={180}
            preserveAspectRatio="none"
          >
            <Path
              d="M 220 25.632 C 155.142 30.422, 101.295 45.464, 51.500 72.704 C 37.660 80.276, 17.739 93.208, 7.250 101.431 L 0 107.114 0 219.057 C 0 280.626, 0.162 331, 0.360 331 C 0.558 331, 6.853 328.051, 14.349 324.446 C 55.937 304.448, 103.706 292.249, 157.347 287.928 C 174.164 286.574, 222.363 287.192, 238.500 288.968 C 283.640 293.938, 323.579 302.636, 367 316.954 C 414.420 332.591, 448.084 347.513, 511.500 381.004 C 594.978 425.091, 670.407 448.300, 748.961 454.070 C 766.990 455.395, 807.633 454.833, 824.500 453.027 C 861.016 449.117, 901.218 439.077, 935 425.429 C 960.075 415.300, 992.121 397.250, 1012.500 381.779 L 1023.500 373.429 1024.112 348.964 C 1024.449 335.509, 1024.684 275.225, 1024.633 215 C 1024.582 154.775, 1024.411 115.264, 1024.251 127.197 L 1023.961 148.894 1011.731 154.830 C 902.616 207.793, 762.967 206.256, 620.500 150.524 C 590.458 138.772, 550.213 120, 524.766 105.870 C 511.001 98.227, 476.015 80.880, 462.500 74.997 C 401.284 48.350, 343.805 32.801, 285 26.981 C 273.842 25.876, 229.227 24.951, 220 25.632 M 0.483 219 C 0.483 280.875, 0.603 306.188, 0.750 275.250 C 0.897 244.313, 0.897 193.688, 0.750 162.750 C 0.603 131.813, 0.483 157.125, 0.483 219"
              fill={colors.wave.secondary}
              opacity={0.6}
              transform="translate(0, 16)"
            />
            <Path
              d="M 220 25.632 C 155.142 30.422, 101.295 45.464, 51.500 72.704 C 37.660 80.276, 17.739 93.208, 7.250 101.431 L 0 107.114 0 219.057 C 0 280.626, 0.162 331, 0.360 331 C 0.558 331, 6.853 328.051, 14.349 324.446 C 55.937 304.448, 103.706 292.249, 157.347 287.928 C 174.164 286.574, 222.363 287.192, 238.500 288.968 C 283.640 293.938, 323.579 302.636, 367 316.954 C 414.420 332.591, 448.084 347.513, 511.500 381.004 C 594.978 425.091, 670.407 448.300, 748.961 454.070 C 766.990 455.395, 807.633 454.833, 824.500 453.027 C 861.016 449.117, 901.218 439.077, 935 425.429 C 960.075 415.300, 992.121 397.250, 1012.500 381.779 L 1023.500 373.429 1024.112 348.964 C 1024.449 335.509, 1024.684 275.225, 1024.633 215 C 1024.582 154.775, 1024.411 115.264, 1024.251 127.197 L 1023.961 148.894 1011.731 154.830 C 902.616 207.793, 762.967 206.256, 620.500 150.524 C 590.458 138.772, 550.213 120, 524.766 105.870 C 511.001 98.227, 476.015 80.880, 462.500 74.997 C 401.284 48.350, 343.805 32.801, 285 26.981 C 273.842 25.876, 229.227 24.951, 220 25.632 M 0.483 219 C 0.483 280.875, 0.603 306.188, 0.750 275.250 C 0.897 244.313, 0.897 193.688, 0.750 162.750 C 0.603 131.813, 0.483 157.125, 0.483 219"
              fill={colors.wave.primary}
            />
            <SvgText
              fill={colors.waveText}
              fontSize="52"
              fontWeight="700"
              fontStyle="italic"
              lengthAdjust="spacingAndGlyphs"
              letterSpacing="4"
              dy={150}
              fontFamily="Poppins"
            >
              <TextPath xlinkHref="#waveLine" startOffset="12.6%" textAnchor="middle">
                Observa, entiende
              </TextPath>
            </SvgText>
            <SvgText
              fill="#FFFFFF"
              fontSize="52"
              fontWeight="700"
              fontStyle="italic"
              fontFamily="Poppins-Bold"
              dy={150}
            >
              <TextPath xlinkHref="#waveLine" startOffset="67%" textAnchor="middle">
                y traduce
              </TextPath>
            </SvgText>
            <Path
              id="waveLine"
              d="M 0 20 C 120 80, 280 40, 462 75 C 530 88, 590 120, 680 148 C 780 178, 900 185, 1024 152"
              fill="none"
              stroke="none"
            />
          </Svg>
        </View>

        {/* Tarjeta karaoke */}
        <Animated.View style={[s.karoCard, animatedStyle, { borderColor: colors.card.border, backgroundColor: colors.card.background }]}>
          <Text style={[s.karoText, { color: colors.text.primary }]}>
            {currentWord ?? 'Esperando...'}
          </Text>
        </Animated.View>

        {/* Tarjetas inclinadas */}
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

        {/* Caja de traducción */}
        <View style={[s.translateBox, { borderColor: colors.card.border, backgroundColor: colors.translation.background }]}>
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
            <TouchableOpacity
              onPress={() => router.push('../translation-fullscreen')}
              accessibilityLabel="Ver traducción en pantalla completa"
              accessibilityRole="button"
            >
              <Ionicons name="expand-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({

  logoArea: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  logo: {
    width: 300,
    height: 300,
  },

  waveArea: {
    width: '100%',
    marginTop: -75,
    marginBottom: 24,
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
  tiltRight: { transform: [{ rotate: '3deg'  }] },

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
    height: 160,
    maxHeight: 160,
  },
  translateViewport: {
    flex: 1,
    position: 'relative',
  },
  translateScroll: {
    flex: 1,
  },
  translateContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',   // ← centra el texto horizontalmente
  },
  translateIcon: {
    position: 'absolute',
    top: 130,
    left: 350,
    zIndex: 10,
  },
  translateText: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',    // ← centra el texto
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0,
  },
  translateFooter: {
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    position: 'absolute',
  },
});