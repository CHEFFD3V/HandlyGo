import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProgressStore } from "@/store/useProgressStore";

const ONBOARDING_KEY = "onboardingComplete";

export default function Index() {
  const router = useRouter();
  const initialize = useProgressStore((state) => state.initialize);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [, onboardingValue] = await Promise.all([
          initialize(),
          AsyncStorage.getItem(ONBOARDING_KEY),
        ]);

        if (onboardingValue === "true") {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
      } catch (error) {
        console.error("Error en bootstrap:", error);
        router.replace("/onboarding");
      }
    };

    bootstrap();
  }, []);

  return (
    <View 
      style={{ 
        flex: 1,
        justifyContent: "center",
          alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}