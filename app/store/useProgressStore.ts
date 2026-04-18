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
  unlockLevel: (level: number) => void;
  completeItem: (itemId: number) => void;
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

  // resetProgress
  // Vuelve al estado inicial y lo persiste.
  resetProgress: () => {
    saveProgress(defaultUser);
    set({ ...defaultUser });
  },
}));