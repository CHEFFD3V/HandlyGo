import {
  View, Text, ScrollView,
  StyleSheet, TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../hooks/useTheme";
import { useAssets } from "../../hooks/useAssets";
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { getDictionaryByCategory } from '../../services/dictionaryService';



export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const assets = useAssets();
  const { theme } = useTheme();

  /* Lógica de prueba
    useEffect(() => {
      const testFetch = async () => {
        const items = await getDictionaryByCategory("Abecedario");
        console.log("REVISIÓN BACKEND - Elementos encontrados:", items);
      };
  
      testFetch();
    }, []); */

  return (

    <View style={{ flex: 1 }}>

      <ScrollView style={[s.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}>


        <View style={[s.header, { backgroundColor: colors.background }]}>
          <View style={[s.logoArea, { backgroundColor: colors.background }]}>
            <Image
              source={(assets.logoPrincipal)}
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
            <Text style={[s.waveText, { color: colors.waveText }]}>Observa, entiende y traduce</Text>
          </View>
        </View>

        {/* Gran tarjeta karaoke */}
        <View style={[s.karoCard, { borderColor: colors.card.border, backgroundColor: colors.card.background, }]}>
          <Text style={[s.karoText, { color: colors.text.primary }]}>Hola, ¿Cómo{'\n'}Estás?</Text>
        </View>

        {/* Tarjetas inclinadas */}
        <View style={s.grid}>
          <View style={[s.gridCard, s.tiltLeft, { borderColor: colors.card.border, backgroundColor: colors.card.background }]}>
            <Text style={[s.gridLabel, { color: colors.text.secondary }]}>Gestos Recientes</Text>
            <Text style={[s.gridSmall, { color: colors.text.secondary }]}>{'• Hola\n• Gracias\n• Lo siento'}</Text>
          </View>
          <View style={[s.gridCard, s.tiltRight, { borderColor: colors.card.border, backgroundColor: colors.card.background }]}>
            <Text style={[s.gridLabel, { color: colors.text.secondary }]}>Gestos de Hoy</Text>
            <Text style={[s.gridValue, { color: colors.accent }]}>12</Text>
          </View>
        </View>

        {/* Sección de traducción */}
        <View style={[s.translateBox, { borderColor: colors.card.border, backgroundColor: colors.translation.background, }]}>
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

  // ── Header
  header: {},

  logoArea: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 300,
    height: 300,
  },

  // ── Ola
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

  // ── Contenido
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