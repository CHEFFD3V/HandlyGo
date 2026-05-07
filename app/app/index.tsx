import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAssets } from "../hooks/useAssets";

const ONBOARDING_KEY = "onboardingComplete";

export default function Onboarding() {
  const router  = useRouter();
  const assets  = useAssets();

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error guardando AsyncStorage:", error);
    }
  };

  return (
    <View style={s.screen}>

      <View style={s.content}>

        <Image
          source={assets.logoPrincipal}
          style={s.logo}
          resizeMode="contain"
        />

        <Image
          source={require('../assets/images/graphic/iconos_claros/graphic/handly_friend_icon_PNG.png')}
          style={s.mascot}
          resizeMode="contain"
        />


        <Text style={s.title}>¡Bienvenido(a)!</Text>
        <Text style={s.slogan}>"Comunícate sin barreras"</Text>

      </View>

      <View style={s.semiCircle}>
        <TouchableOpacity
          style={s.btn}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={s.btnText}>CONTINUAR</Text>
        </TouchableOpacity>
      </View>


    </View>
  );
}

const BLUE  = '#2200CC';
const WHITE = '#FFFFFF';

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: WHITE,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },

  logo: {
    width: 300,
    height: 120,
    marginBottom: 50,
  },

  mascot: {
    width: 400,
    height: 200,
    marginBottom: 24,
  },

  title: {
    color: BLUE,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },

  slogan: {
    color: '#444444',
    fontSize: 16,
    fontWeight: '400',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  semiCircle: {
    width: '140%',              
    aspectRatio: 1,             
    borderRadius: 9999,
    backgroundColor: BLUE,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    marginBottom: '-70%',       
  },

  btn: {
    backgroundColor: WHITE,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 30,
  },
  btnText: {
    color: BLUE,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});