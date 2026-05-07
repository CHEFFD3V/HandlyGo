import { create } from "zustand";
import { db } from "@/services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

// ── Tipos ────────────────────────────────────────────────────────────────────

export type TranslationWord = {
  id: number;
  texto: string;
  audio: string;
  category?: string;
};

type TranslationStore = {
  // Estado
  currentWord: TranslationWord | null;
  history: TranslationWord[];
  isLoading: boolean;
  error: string | null;

  // Acciones
  setWordFromId: (id: number) => Promise<void>;
  clearCurrent: () => void;
  clearHistory: () => void;
};

// ── Store ────────────────────────────────────────────────────────────────────

export const useTranslationStore = create<TranslationStore>((set, get) => ({
  // Estado inicial
  currentWord: null,
  history: [],
  isLoading: false,
  error: null,

  /**
   * setWordFromId
   * Consulta Firebase por el ID de traducción, actualiza el estado
   * y dispara el audio de vuelta al guante.
   *
   * Flujo: simulate(id) → Firebase (translations) → Store → UI → Audio
   */
  setWordFromId: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      // 1. Consultar Firestore: colección 'translations', campo id == id
      const translationsRef = collection(db, "translations");
      const q = query(translationsRef, where("id", "==", id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        const errMsg = `[TranslationStore] No se encontró traducción con id=${id}`;
        console.warn(errMsg);
        set({ isLoading: false, error: errMsg });
        return;
      }

      // 2. Mapear el primer documento encontrado
      const doc = snapshot.docs[0];
      const data = doc.data();

      const word: TranslationWord = {
        id: data.id ?? id,
        texto: data.texto ?? data.text ?? "Sin texto",
        audio: data.audio ?? data.audioCmd ?? "",
        category: data.category ?? undefined,
      };

      console.log(`[TranslationStore] Traducción recibida:`, word);

      // 3. Actualizar historial (sin duplicados consecutivos)
      const { history } = get();
      const lastEntry = history[history.length - 1];
      const isDuplicate = lastEntry?.id === word.id;

      set({
        currentWord: word,
        history: isDuplicate ? history : [...history, word],
        isLoading: false,
        error: null,
      });

      // 4. Log del audio (aquí iría la integración con la bocina del guante)
      if (word.audio) {
        console.log(`[TranslationStore] Audio a enviar al guante: "${word.audio}"`);
        // TODO: BLE Write(audio) → guante → bocina
      }
    } catch (error) {
      const errMsg = `[TranslationStore] Error consultando Firebase: ${error}`;
      console.error(errMsg);
      set({ isLoading: false, error: errMsg });
    }
  },

  clearCurrent: () => set({ currentWord: null }),

  clearHistory: () => set({ history: [], currentWord: null }),
}));