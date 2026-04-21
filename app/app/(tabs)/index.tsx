import {
  View, Text, ScrollView,
  StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { getDictionaryByCategory } from '../../services/dictionaryService';

export default function HomeScreen() {
  const router = useRouter();

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
      <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
        
        {/* HEADER CON LOGO Y OLA */}
        <View style={s.header}>
          <View style={s.logoArea}>
            <Image
              source={require('../../assets/images/graphic/iconos_claros/graphic/handlygo_logo_icon_PNG.png')}
              style={s.logo}
              resizeMode="contain"
            />
          </View>
          <View style={s.waveContainer}>
            <Svg viewBox="0 0 390 150" width="100%" height={200} preserveAspectRatio="none">
              <Path
                d="M0 25 Q60 0 130 30 Q200 62 270 25 Q330 0 390 38 Q370 95 300 80 Q220 62 150 88 Q80 108 0 82 Z"
                fill="#2200CC"
              />
              <Path
                d="M0 58 Q60 12 130 42 Q200 74 270 37 Q330 12 390 50 Q370 105 300 90 Q220 72 150 98 Q80 118 0 99 Z"
                fill="#1A00AA"
                opacity={0.4}
              />
            </Svg>
            <Text style={s.waveText}>Observa, entiende y traduce</Text>
          </View>
        </View>

        {/* TARJETA KARAOKE */}
        <View style={s.karoCard}>
          <Text style={s.karoText}>Hola, ¿Cómo{'\n'}Estás?</Text>
        </View>

        {/* DASHBOARD DE GESTOS */}
        <View style={s.grid}>
          <View style={[s.gridCard, s.tiltLeft]}>
            <Text style={s.gridLabel}>Gestos Recientes</Text>
            <Text style={s.gridSmall}>{'• Hola\n• Gracias\n• Lo siento'}</Text>
          </View>
          <View style={[s.gridCard, s.tiltRight]}>
            <Text style={s.gridLabel}>Gestos de Hoy</Text>
            <Text style={s.gridValue}>12</Text>
          </View>
        </View>

        {/* SECCIÓN DE TRADUCCIÓN */}
        <View style={s.translateBox}>
          <View style={s.translateContent}>
            <Ionicons name="volume-medium-outline" size={20} color="#000" />
            <Text style={s.translateText}>
              "Hola, ¿cómo estás?{'\n'}me siento muy feliz hoy,{'\n'}te encuentras bien?"
            </Text>
          </View>
          <View style={s.translateFooter}>
            <Ionicons name="expand-outline" size={16} color={BLUE} />
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* NAVBAR INFERIOR */}
      <View style={s.navbar}>
        <TouchableOpacity style={s.navBtn} activeOpacity={0.6}>
          <Ionicons name="moon-outline" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={s.navBtn} 
          activeOpacity={0.6}
          onPress={() => router.push('../aprendizaje')}
        >
          <Ionicons name="book-outline" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={s.navBtn} activeOpacity={0.6}>
          <Ionicons name="home" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={s.navBtn} 
          activeOpacity={0.6}
          onPress={() => router.push('../vinculacion')}
        >
          <Ionicons name="link-outline" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={s.navBtn} 
          activeOpacity={0.6}
          onPress={() => router.push('../(tabs)/configuracion')}
        >
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const BLUE   = '#2200CC';
const ORANGE = '#F59E0B';
const BG     = '#FFFFFF';

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    backgroundColor: '#FFFFFF',
  },
  logoArea: {
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: '#FFFFFF',
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  karoCard: {
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  karoText: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  grid: { 
    flexDirection: 'row', 
    gap: 10, 
    paddingHorizontal: 16, 
    marginBottom: 16 
  },
  gridCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  tiltLeft: { transform: [{ rotate: '-3deg' }] },
  tiltRight: { transform: [{ rotate: '3deg' }] },
  gridLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '900',
    marginBottom: 6,
  },
  gridValue: {
    fontSize: 40,
    fontWeight: '900',
    color: ORANGE,
  },
  gridSmall: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
  },
  translateBox: {
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 12,
    marginHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  translateContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  translateText: {
    fontSize: 20,
    flex: 1,
  },
  translateFooter: {
    alignItems: 'flex-end',
    paddingRight: 12,
    paddingBottom: 8,
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: BLUE,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navBtn: {
    padding: 8,
  },
});