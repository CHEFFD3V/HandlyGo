import { create } from "zustand";
import { db } from "@/services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

// ── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Representa una palabra traducida desde el diccionario MSD de Firebase.
 */
export type TranslationWord = {
  id: number;
  texto: string;
  audio: string;
  category?: string;
};

/**
 * Estado de carga del store, usado para manejar feedback en la UI.
 * - "idle"    → sin actividad
 * - "loading" → consulta en curso
 * - "error"   → fallo en la consulta
 */
type FetchStatus = "idle" | "loading" | "error";

type TranslationState = {
  // ── Estado ─────────────────────────────────────────────────────────────────
  currentWord: TranslationWord | null;
  history: TranslationWord[];
  status: FetchStatus;
  error: string | null;

  // ── Acciones ────────────────────────────────────────────────────────────────

  /**
   * Recibe el ID de gesto desde el hardware (BLE Notify),
   * consulta Firebase, actualiza currentWord e history.
   * No contiene lógica de UI.
   */
  setWordFromId: (id: number) => Promise<void>;

  /** Limpia la palabra actual sin tocar el historial. */
  clearCurrent: () => void;

  /** Limpia el historial completo y la palabra actual. */
  clearHistory: () => void;
};

// ── Store ────────────────────────────────────────────────────────────────────

export const useTranslationStore = create<TranslationState>((set, get) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────────
  currentWord: null,
  history: [],
  status: "idle",
  error: null,

  // ── setWordFromId ───────────────────────────────────────────────────────────
  setWordFromId: async (id: number) => {
    set({ status: "loading", error: null });

    try {
      // 1. Consultar Firestore: colección "translations", campo id == id
      const translationsRef = collection(db, "translations");
      const q = query(translationsRef, where("id", "==", id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        const msg = `[TranslationStore] Sin resultado para id=${id}`;
        console.warn(msg);
        set({ status: "error", error: msg });
        return;
      }

      // 2. Mapear el primer documento
      const doc = snapshot.docs[0];
      const data = doc.data();

      const word: TranslationWord = {
        id:       data.id      ?? id,
        texto:    data.texto   ?? data.text   ?? "Sin texto",
        audio:    data.audio   ?? data.audioCmd ?? "",
        category: data.category ?? undefined,
      };

      // 3. Evitar duplicados consecutivos en el historial
      const { history } = get();
      const lastId = history[history.length - 1]?.id;
      const isDuplicate = lastId === word.id;

      set({
        currentWord: word,
        history: isDuplicate ? history : [...history, word],
        status: "idle",
        error: null,
      });

      // 4. Log del audio — aquí se integrará el BLE Write al guante
      if (word.audio) {
        console.log(`[TranslationStore] Audio cmd: "${word.audio}"`);
        // TODO: BLE Write(word.audio) → guante → bocina
      }
    } catch (err) {
      const msg = `[TranslationStore] Error Firebase: ${err}`;
      console.error(msg);
      set({ status: "error", error: msg });
    }
  },

  // ── Helpers ─────────────────────────────────────────────────────────────────
  clearCurrent: () => set({ currentWord: null }),
  clearHistory: () => set({ history: [], currentWord: null }),
}));
