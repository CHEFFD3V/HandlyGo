import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "onboardingComplete";

export default function Onboarding() {
  const router = useRouter();

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error guardando AsyncStorage:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Bienvenido a la aplicación
      </Text>

      <Button title="Comenzar" onPress={handleContinue} />
    </View>
  );
}