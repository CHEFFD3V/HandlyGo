import { create } from "zustand";
import {
  UserProgress,
  defaultUser,
  loadProgress,
  saveProgress,
} from "@/services/storage";

type ProgressStore = UserProgress & {
  isLoaded: boolean;

  initialize: () => Promise<void>;

  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  incrementDaysStudying: () => void;
  unlockLevel: (level: number) => void;
  completeLesson: (lessonKey: string, xp: number) => void;
  resetProgress: () => void;
};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  ...defaultUser,
  isLoaded: false,

  // initialize: Carga el progreso desde AsyncStorage al arrancar la app.
  // Se puede llamar múltiples veces sin problema: el guard evita cargas redundantes,
  // pero solo bloquea si la carga anterior tuvo éxito (isLoaded === true).
  initialize: async () => {
    if (get().isLoaded) return;

    try {
      const saved = await loadProgress();
      set({ ...saved, isLoaded: true });
    } catch (error) {
      // Si loadProgress lanza (no debería), arrancamos con valores por defecto
      // y marcamos isLoaded para no quedar en loop.
      console.error("[useProgressStore] Fallo en initialize:", error);
      set({ ...defaultUser, isLoaded: true });
    }
  },

  addXP: (amount: number) => {
    set((state) => {
      const next = { ...state, xp: state.xp + amount };
      saveProgress(next);
      return { xp: next.xp };
    });
  },

  incrementStreak: () => {
    set((state) => {
      const newStreak = state.streak + 1;
      saveProgress({ ...state, streak: newStreak });
      return { streak: newStreak };
    });
  },

  resetStreak: () => {
    set((state) => {
      saveProgress({ ...state, streak: 0 });
      return { streak: 0 };
    });
  },

  incrementDaysStudying: () => {
    set((state) => {
      const newDays = state.daysStudying + 1;
      saveProgress({ ...state, daysStudying: newDays });
      return { daysStudying: newDays };
    });
  },

  unlockLevel: (level: number) => {
    set((state) => {
      if (state.unlockedLevels.includes(level)) return {};

      const updated = [...state.unlockedLevels, level];
      saveProgress({ ...state, unlockedLevels: updated });
      return { unlockedLevels: updated };
    });
  },

  // completeLesson: Marca la lección como completada con su lessonKey único,
  // suma XP, incrementa streak y días estudiando, y persiste todo en un solo write.
  completeLesson: (lessonKey: string, xp: number) => {
    set((state) => {
      if (state.completedLessons.includes(lessonKey)) return {};

      const completedLessons = [...state.completedLessons, lessonKey];
      const newXp = state.xp + xp;
      const newStreak = state.streak + 1;
      const newDays = state.daysStudying + 1;

      const updated: UserProgress = {
        xp: newXp,
        streak: newStreak,
        daysStudying: newDays,
        completedLessons,
        unlockedLevels: state.unlockedLevels,
        version: state.version,
      };

      saveProgress(updated);

      return {
        completedLessons,
        xp: newXp,
        streak: newStreak,
        daysStudying: newDays,
      };
    });
  },

  resetProgress: () => {
    saveProgress(defaultUser);
    set({ ...defaultUser, isLoaded: true });
  },
}));
