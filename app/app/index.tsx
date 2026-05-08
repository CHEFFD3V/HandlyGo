import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProgressStore } from "@/store/useProgressStore";
import { getTranslationById } from "@/services/firebase/translations"; 
import { getLessonById } from '../services/lessons';

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

        const testData = await getTranslationById(101);
        console.log("Prueba traducción:", testData);

        const testLesson = await getLessonById(1);
        if (testLesson) {
          console.log("🎬 LECCIÓN 1 CARGADA #67:", {
            Titulo: testLesson.title,
            VideoURL: testLesson.video,
            Nivel: testLesson.level
          });
        } else {
          console.warn("⚠️ No se encontró la lección 1 en Firestore. Revisa la colección 'lessons'.");
        }

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