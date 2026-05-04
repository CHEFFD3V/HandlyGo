import { create } from "zustand";

// ── Exportamos el tipo para poder usarlo en otros archivos ────
const INITIAL_BATTERY = 100;
export type AppState = {
  isConnected: boolean;
  isTranslating: boolean;
  currentWord: string | null;
  history: string[];
  battery: number; 
  

  setConnected: (value: boolean) => void;
  startTranslating: () => void;
  stopTranslating: () => void;
  setWord: (word: string) => void;
  clearHistory: () => void;
  setBattery: (value: number) => void; 
};

export const useAppStore = create<AppState>((set) => ({
  isConnected: false,
  isTranslating: false,
  currentWord: null,
  history: [],
   battery: INITIAL_BATTERY, // valor inicial de batería

  setConnected: (value) =>
    set((state) => ({
      isConnected: value,
      isTranslating: value ? state.isTranslating : false,
      currentWord: value ? state.currentWord : null,
      battery: value ? INITIAL_BATTERY : state.battery,
    })),

  startTranslating: () =>
    set((state) => ({
      isTranslating: state.isConnected ? true : state.isTranslating,
    })),

  stopTranslating: () => set({ isTranslating: false }),

  setWord: (word) =>
    set((state) => ({
      currentWord: word,
      history:
        state.history[state.history.length - 1] === word
          ? state.history
          : [...state.history, word],
    })),

  clearHistory: () => set({ history: [], currentWord: null }),
  setBattery: (value) => set({ battery: value }),
}));