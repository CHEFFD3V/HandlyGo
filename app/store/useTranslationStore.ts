import { create } from "zustand";
import { db } from "@/services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAppStore } from "./useAppStore";

// ── Tipos ────────────────────────────────────────────────────────────────────

export type TranslationWord = {
  id: number;
  texto: string;
  audio: string;
  category?: string;
};

type FetchStatus = "idle" | "loading" | "error";

type TranslationState = {
  currentWord: TranslationWord | null;
  history: TranslationWord[];
  status: FetchStatus;
  error: string | null;

  setWordFromId: (id: number) => Promise<void>;
  setWordDirect: (word: TranslationWord) => void;  // ← nuevo
  clearCurrent: () => void;
  clearHistory: () => void;
};

// ── Store ────────────────────────────────────────────────────────────────────

export const useTranslationStore = create<TranslationState>((set, get) => ({
  currentWord: null,
  history: [],
  status: "idle",
  error: null,

  // ── setWordFromId (Firebase) ────────────────────────────────────────────────
  setWordFromId: async (id: number) => {
    set({ status: "loading", error: null });

    try {
      const translationsRef = collection(db, "translations");
      const q = query(translationsRef, where("id", "==", id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        const msg = `[TranslationStore] Sin resultado para id=${id}`;
        console.warn(msg);
        set({ status: "error", error: msg });
        return;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      const word: TranslationWord = {
        id:       data.id       ?? id,
        texto:    data.texto    ?? data.text    ?? "Sin texto",
        audio:    data.audio    ?? data.audioCmd ?? "",
        category: data.category ?? undefined,
      };

      const { history } = get();
      const lastId = history[history.length - 1]?.id;
      const isDuplicate = lastId === word.id;

      set({
        currentWord: word,
        history: isDuplicate ? history : [...history, word],
        status: "idle",
        error: null,
      });

      if (word.audio) {
        console.log(`[TranslationStore] Audio cmd: "${word.audio}"`);
      }
    } catch (err) {
      const msg = `[TranslationStore] Error Firebase: ${err}`;
      console.error(msg);
      set({ status: "error", error: msg });
    }
  },

  // ── setWordDirect (mock / sin Firebase) ────────────────────────────────────
  setWordDirect: (word: TranslationWord) => {
    const { history } = get();
    const lastId = history[history.length - 1]?.id;
    const isDuplicate = lastId === word.id;

      if (!isDuplicate) {
    useAppStore.getState().incrementTodayCount(); // ← incrementa el contador
  }

    set({
      currentWord: word,
      history: isDuplicate ? history : [...history, word],
      status: "idle",
      error: null,
    });
  },

  // ── Helpers ─────────────────────────────────────────────────────────────────
  clearCurrent: () => set({ currentWord: null }),
  clearHistory: () => set({ history: [], currentWord: null }),
}));