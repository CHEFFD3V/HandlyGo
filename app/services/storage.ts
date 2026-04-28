import AsyncStorage from "@react-native-async-storage/async-storage";

// TIPOS
export type UserProgress = {
  xp: number;
  streak: number;
  daysStudying: number;
  unlockedLevels: number[];
  completedItems: number[];
  version: number;
};

// VALORES POR DEFECTO
export const defaultUser: UserProgress = {
  xp: 0,
  streak: 0,
  daysStudying: 0,
  unlockedLevels: [1],
  completedItems: [],
  version: 1,
};

// CLAVE DE ALMACENAMIENTO
const STORAGE_KEY = "user_progress";



// loadProgress
// Lee el progreso guardado en el teléfono.
export async function loadProgress(): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      return defaultUser;
    }

    const parsed = JSON.parse(raw) as UserProgress;

    if (parsed.version !== defaultUser.version) {
      console.warn("[storage] Versión desactualizada, usando defaultUser");
      return defaultUser;
    }

    return parsed;
  } catch (error) {
    // Criterio #3 y #5: manejo de errores + fallback a defaultUser
    console.error("[storage] Error al leer el progreso:", error);
    return defaultUser;
  }
}

// saveProgress
// Guarda el progreso en el teléfono.
export async function saveProgress(data: UserProgress): Promise<void> {
  try {
    const serialized = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    // Criterio #3: manejo de errores
    console.error("[storage] Error al guardar el progreso:", error);
  }
}