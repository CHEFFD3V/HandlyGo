import {
  View, Text, ScrollView,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Text as SvgText, TextPath } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../hooks/useTheme";
import { useAssets } from "../../hooks/useAssets";
import { Image } from 'expo-image';
import { useAppStore } from '../../store/useAppStore';
import { useMockBluetooth } from '../../src/bluetooth/mockBluetooth';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const assets = useAssets();
  const { theme } = useTheme();
  const currentWord = useAppStore((s) => s.currentWord);
  const history     = useAppStore((s) => s.history);
  const todayCount  = useAppStore((s) => s.todayCount);
  const opacity = useSharedValue(1);
  const scale   = useSharedValue(1);
  useMockBluetooth();

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

        {/* Ola — bloque propio en el flujo, nada se superpone */}
        <View style={s.waveArea}>
          <Svg
            viewBox="0 0 1024 504"
            width="100%"
            height={180}
            preserveAspectRatio="none"
          >
            {/* Capa trasera */}
            <Path
              d="M 220 25.632 C 155.142 30.422, 101.295 45.464, 51.500 72.704 C 37.660 80.276, 17.739 93.208, 7.250 101.431 L 0 107.114 0 219.057 C 0 280.626, 0.162 331, 0.360 331 C 0.558 331, 6.853 328.051, 14.349 324.446 C 55.937 304.448, 103.706 292.249, 157.347 287.928 C 174.164 286.574, 222.363 287.192, 238.500 288.968 C 283.640 293.938, 323.579 302.636, 367 316.954 C 414.420 332.591, 448.084 347.513, 511.500 381.004 C 594.978 425.091, 670.407 448.300, 748.961 454.070 C 766.990 455.395, 807.633 454.833, 824.500 453.027 C 861.016 449.117, 901.218 439.077, 935 425.429 C 960.075 415.300, 992.121 397.250, 1012.500 381.779 L 1023.500 373.429 1024.112 348.964 C 1024.449 335.509, 1024.684 275.225, 1024.633 215 C 1024.582 154.775, 1024.411 115.264, 1024.251 127.197 L 1023.961 148.894 1011.731 154.830 C 902.616 207.793, 762.967 206.256, 620.500 150.524 C 590.458 138.772, 550.213 120, 524.766 105.870 C 511.001 98.227, 476.015 80.880, 462.500 74.997 C 401.284 48.350, 343.805 32.801, 285 26.981 C 273.842 25.876, 229.227 24.951, 220 25.632 M 0.483 219 C 0.483 280.875, 0.603 306.188, 0.750 275.250 C 0.897 244.313, 0.897 193.688, 0.750 162.750 C 0.603 131.813, 0.483 157.125, 0.483 219"
              fill={colors.wave.secondary}
              opacity={0.6}
              transform="translate(0, 16)"
            />
            {/* Capa frontal */}
            <Path
              d="M 220 25.632 
              C 155.142 30.422, 101.295 45.464, 51.500 72.704 C 37.660 80.276, 17.739 93.208, 7.250 101.431 L 0 107.114 0 219.057 C 0 280.626, 0.162 331, 0.360 331 C 0.558 331, 6.853 328.051, 14.349 324.446 C 55.937 304.448, 103.706 292.249, 157.347 287.928 C 174.164 286.574, 222.363 287.192, 238.500 288.968 C 283.640 293.938, 323.579 302.636, 367 316.954 C 414.420 332.591, 448.084 347.513, 511.500 381.004 C 594.978 425.091, 670.407 448.300, 748.961 454.070 C 766.990 455.395, 807.633 454.833, 824.500 453.027 C 861.016 449.117, 901.218 439.077, 935 425.429 C 960.075 415.300, 992.121 397.250, 1012.500 381.779 L 1023.500 373.429 1024.112 348.964 C 1024.449 335.509, 1024.684 275.225, 1024.633 215 C 1024.582 154.775, 1024.411 115.264, 1024.251 127.197 L 1023.961 148.894 1011.731 154.830 C 902.616 207.793, 762.967 206.256, 620.500 150.524 C 590.458 138.772, 550.213 120, 524.766 105.870 C 511.001 98.227, 476.015 80.880, 462.500 74.997 C 401.284 48.350, 343.805 32.801, 285 26.981 C 273.842 25.876, 229.227 24.951, 220 25.632 M 0.483 219 C 0.483 280.875, 0.603 306.188, 0.750 275.250 C 0.897 244.313, 0.897 193.688, 0.750 162.750 C 0.603 131.813, 0.483 157.125, 0.483 219"
              fill={colors.wave.primary}
            />

            {/* Texto curvado — sigue el borde superior de la ola */}
            <SvgText
              fill={colors.waveText}
              fontSize="52"
              fontWeight="bold"
              fontStyle="italic"
              letterSpacing="4"
              dy={150}
            >
              <TextPath
                xlinkHref="#waveLine"
                startOffset="15.5%"
                textAnchor="middle"
              >
                Observa, entiende y traduce
              </TextPath>
            </SvgText>

            {/* 
              Este path sigue exactamente el borde superior de la ola.
              Extraído directamente del path original:
              M 220 25 → sube desde izquierda
              C 155 30, 101 45, 51 72 → curva hacia arriba a la derecha
              luego continúa hacia la derecha subiendo
            */}
            <Path
              id="waveLine"
              d="M 0 20 C 120 80, 280 40, 462 75 C 530 88, 590 120, 680 148 C 780 178, 900 185, 1024 152"
              fill="none"
              stroke="none"
            />
          </Svg>
        </View>

        {/* Gran tarjeta karaoke */}
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

        {/* Sección de traducción */}
        <View style={[s.translateBox, { borderColor: colors.card.border, backgroundColor: colors.translation.background }]}>
          <View style={s.translateContent}>
            <Ionicons name="volume-medium-outline" size={20} color={colors.icon.primary} />
            <Text style={[s.translateText, { color: colors.translation.text }]}>
              "Hola, ¿cómo estás?{'\n'}me siento muy feliz hoy,{'\n'}te encuentras bien?"
            </Text>
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

  logoArea: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  logo: {
    width: 260,
    height: 260,
  },

  // La ola tiene su propio espacio en el flujo
  waveArea: {
    width: '100%',
    marginBottom: 24,
    marginTop: -75,
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

  tiltLeft: {
    transform: [{ rotate: '-3deg' }],
  },

  tiltRight: {
    transform: [{ rotate: '3deg' }],
  },

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
  },

  translateContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  translateText: {
    fontSize: 20,
    lineHeight: 28,
    flex: 1,
  },
  translateFooter: {
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingBottom: 8,
  },
});