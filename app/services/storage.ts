import AsyncStorage from "@react-native-async-storage/async-storage";

// TIPOS
export type UserProgress = {
  xp: number;
  streak: number;
  daysStudying: number;
  unlockedLevels: number[];
  completedLessons: string[];
  version: number;
};

// VALORES POR DEFECTO
export const defaultUser: UserProgress = {
  xp: 0,
  streak: 0,
  daysStudying: 0,
  unlockedLevels: [1],
  completedLessons: [],
  version: 2,
};

const STORAGE_KEY = "user_progress";

// Migra datos de versiones anteriores al formato actual.
function migrateProgress(raw: Record<string, unknown>): UserProgress {
  const version = (raw.version as number) ?? 1;

  // v1 usaba completedItems: number[] — lo descartamos y arrancamos limpio.
  if (version < 2) {
    console.warn("[storage] Migrando v1 → v2: completedLessons reiniciado.");
    return {
      ...defaultUser,
      xp: typeof raw.xp === "number" ? raw.xp : 0,
      streak: typeof raw.streak === "number" ? raw.streak : 0,
      daysStudying: typeof raw.daysStudying === "number" ? raw.daysStudying : 0,
      unlockedLevels:
        Array.isArray(raw.unlockedLevels) && raw.unlockedLevels.length > 0
          ? (raw.unlockedLevels as number[])
          : [1],
      version: defaultUser.version,
    };
  }

  return raw as unknown as UserProgress;
}

// loadProgress: Lee el progreso guardado. Devuelve defaultUser ante cualquier error.
export async function loadProgress(): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === null) return defaultUser;

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return migrateProgress(parsed);
  } catch (error) {
    console.error("[storage] Error al leer el progreso:", error);
    return defaultUser;
  }
}

// saveProgress: Persiste el estado actual. Silencia errores para no romper el flujo.
export async function saveProgress(data: UserProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("[storage] Error al guardar el progreso:", error);
  }
}
