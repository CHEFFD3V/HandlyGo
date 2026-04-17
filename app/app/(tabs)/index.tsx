import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const RECENT_GESTURES = [
  { emoji: '👋', label: 'Hola', time: 'Hace 5 min' },
  { emoji: '🤝', label: 'Gracias', time: 'Ayer' },
  { emoji: '🙏', label: 'Por favor', time: 'Ayer' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

        {/* LOGO */}
        <View style={s.logoContainer}>
          <Image
            //source={require('../../../assets/images/handlygo_logo_icon.png')}
            style={s.logo}
            resizeMode="contain"
          />
        </View>

        {/* TEXTO */}
        <Text style={s.motiv}>¿Estás listo para aprender hoy?</Text>

        {/* RESUMEN */}
        <View style={s.grid}>
          <View style={s.gridCard}>
            <Text>📊</Text>
            <Text style={s.gridLabel}>Gestos recientes</Text>
            <Text style={s.gridSmall}>• Hola{"\n"}• Gracias{"\n"}• Lo siento</Text>
          </View>

          <View style={s.gridCard}>
            <Text>📅</Text>
            <Text style={s.gridLabel}>Gestos de hoy</Text>
            <Text style={s.gridValue}>12</Text>
          </View>
        </View>

        {/* BOTÓN */}
        <TouchableOpacity
          style={s.ctaWhite}
          //onPress={() => router.push('/traductor')}  Agregar A Donde Enviara
          activeOpacity={0.8}
        >
          <Text style={s.ctaWhiteText}>EMPEZAR A TRADUCIR</Text>
        </TouchableOpacity>

        {/* TRADUCIENDO */}
        <View style={s.translateBox}>
          <View style={s.translateHeader}>
            <Text style={s.translateHeaderText}>TRADUCIENDO...</Text>
          </View>

          <View style={s.translateContent}>
            <Ionicons name="volume-medium-outline" size={20} color="#000" />
            <Text style={s.translateText}>
              "Hola, me llamo Jennifer."
            </Text>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* NAVBAR */}
      <View style={s.navbar}>
        <Ionicons name="moon-outline" size={22} color="#fff" />
        <Ionicons name="book-outline" size={22} color="#fff" />
        <Ionicons name="home" size={26} color="#fff" />
        <Ionicons name="link-outline" size={22} color="#fff" />
        <Ionicons name="settings-outline" size={22} color="#fff" />
      </View>
    </View>
  );
}

const BLUE = '#2200CC';

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },

  logo: {
    width: 160,
    height: 60,
  },

  motiv: {
    color: BLUE,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },

  grid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  gridCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },

  gridLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },

  gridValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F59E0B',
    marginTop: 4,
  },

  gridSmall: {
    fontSize: 11,
    color: '#555',
    marginTop: 4,
    textAlign: 'center',
  },

  /* BOTÓN */
  ctaWhite: {
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  ctaWhiteText: {
    color: BLUE,
    fontWeight: '700',
    fontSize: 13,
  },

  /* TRADUCIENDO */
  translateBox: {
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 12,
    overflow: 'hidden',
  },

  translateHeader: {
    backgroundColor: BLUE,
    paddingVertical: 8,
    alignItems: 'center',
  },

  translateHeaderText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },

  translateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },

  translateText: {
    fontSize: 13,
    color: '#000',
  },

  /* NAVBAR */
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: BLUE,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});