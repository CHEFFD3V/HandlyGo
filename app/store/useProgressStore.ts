import { create } from "zustand";
import {
  UserProgress,
  defaultUser,
  loadProgress,
  saveProgress,
} from "@/services/storage";

// TIPO DEL STORE
type ProgressStore = UserProgress & {
  // Estados de carga
  isLoaded: boolean;

  // Acción de inicialización
  initialize: () => Promise<void>;

  // Acciones: cada una guarda automáticamente después de modificar
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  incrementDaysStudying: () => void;
  unlockLevel: (level: number) => void;
  completeItem: (itemId: number) => void;
  completeLesson: (lessonId: number, xp: number) => void;
  resetProgress: () => void;
};

// EL STORE
export const useProgressStore = create<ProgressStore>((set, get) => ({
  // Estado inicial
  ...defaultUser,
  isLoaded: false,

  initialize: async () => {
    if (get().isLoaded) return;

    const saved = await loadProgress(); // lee del teléfono
    set({
      ...saved,
      isLoaded: true,
    });
  },

  // addXP
  // Suma XP y persiste inmediatamente.
  addXP: (amount: number) => {
    set((state) => {
      const updated = { ...state, xp: state.xp + amount };
      saveProgress(updated);
      return { xp: updated.xp };
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

  // incrementDaysStudying
  // Suma un día al contador de días estudiando y persiste.
  incrementDaysStudying: () => {
    set((state) => {
      const newDays = state.daysStudying + 1;
      saveProgress({ ...state, daysStudying: newDays });
      return { daysStudying: newDays };
    });
  },

  // unlockLevel
  // Solo añade el nivel si no estaba ya desbloqueado.
  unlockLevel: (level: number) => {
    set((state) => {
      if (state.unlockedLevels.includes(level)) return {};

      const updated = [...state.unlockedLevels, level];
      saveProgress({ ...state, unlockedLevels: updated });
      return { unlockedLevels: updated };
    });
  },

  // completeItem
  completeItem: (itemId: number) => {
    set((state) => {
      if (state.completedItems.includes(itemId)) return {};

      const updated = [...state.completedItems, itemId];
      saveProgress({ ...state, completedItems: updated });
      return { completedItems: updated };
    });
  },

  // completeLesson
  // Marca la lección como completada, suma XP, incrementa streak y días estudiando.
  // TODO: cuando llegue el backend, el streak debe basarse en fechas (un incremento
  // por día, no por lección).
  completeLesson: (lessonId: number, xp: number) => {
    set((state) => {
      if (state.completedItems.includes(lessonId)) return {};

      const completedItems = [...state.completedItems, lessonId];
      const newXp = state.xp + xp;
      const newStreak = state.streak + 1;
      const newDays = state.daysStudying + 1;
      const updated = {
        ...state,
        completedItems,
        xp: newXp,
        streak: newStreak,
        daysStudying: newDays,
      };
      saveProgress(updated);
      return { completedItems, xp: newXp, streak: newStreak, daysStudying: newDays };
    });
  },

  // resetProgress
  // Vuelve al estado inicial y lo persiste.
  resetProgress: () => {
    saveProgress(defaultUser);
    set({ ...defaultUser });
  },
}));