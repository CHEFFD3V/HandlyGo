import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Onboarding() {
  const handleStart = async () => {
    await AsyncStorage.setItem("onboardingComplete", "true");
    router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bienvenido a la app</Text>
      <Button title="Comenzar" onPress={handleStart} />
    </View>
  );
}