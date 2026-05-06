import { create } from "zustand";

// ── Exportamos el tipo para poder usarlo en otros archivos ────
const INITIAL_BATTERY = 100;
export type AppState = {
  isConnected: boolean;
  isTranslating: boolean;
  currentWord: string | null;
  history: string[];
  battery: number; 
  todayCount: number;  
  

  setConnected: (value: boolean) => void;
  startTranslating: () => void;
  stopTranslating: () => void;
  setWord: (word: string) => void;
  clearHistory: () => void;
  setBattery: (value: number) => void; 
  incrementTodayCount: () => void; 
};

export const useAppStore = create<AppState>((set) => ({
  isConnected: false,
  isTranslating: false,
  currentWord: null,
  history: [],
   battery: INITIAL_BATTERY,
   todayCount: 0,   // valor inicial de batería

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
    set((state) => {
      const isDuplicate = state.history[state.history.length - 1] === word;
      return  {
        currentWord: word,
        history: isDuplicate ? state.history : [...state.history, word],
        todayCount: isDuplicate ? state.todayCount : state.todayCount + 1, 
      };
    }),
      

  clearHistory: () => set({ history: [], currentWord: null }),
  setBattery: (value) => set({ battery: value }),
  incrementTodayCount: () =>
    set((state) => ({ todayCount: state.todayCount + 1 })),
}));