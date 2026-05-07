import { create } from "zustand";
import { db } from "@/services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

// ── Tipos ────────────────────────────────────────────────────────────────────

export type TranslationWord = {
  id: number;
  texto: string;
  audio_cmd: string;
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
   * Consulta Firebase por el ID de seña, actualiza el estado
   * y dispara el audio_cmd de vuelta al guante.
   *
   */
  setWordFromId: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      // 1. Consultar Firestore: colección msd_dictionary, campo id == id
      const dictionaryRef = collection(db, "msd_dictionary");
      const q = query(dictionaryRef, where("id", "==", id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        const errMsg = `[TranslationStore] No se encontró ninguna seña con id=${id}`;
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
        audio_cmd: data.audio_cmd ?? data.audioCmd ?? "",
        category: data.category ?? undefined,
      };

      console.log(`[TranslationStore] Seña recibida:`, word);

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

      // 4. Log del audio_cmd (aquí iría la integración con la bocina del guante)
      if (word.audio_cmd) {
        console.log(`[TranslationStore] audio_cmd a enviar al guante: "${word.audio_cmd}"`);
        // TODO: BLE Write(audio_cmd) → guante → bocina
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
