import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem("onboardingComplete");

      if (value === "true") {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    };

    checkOnboarding();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}