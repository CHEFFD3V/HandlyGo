/**
 * simulateHand.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Utilidad de desarrollo para simular el estado físico del guante HandlyGo
 * desde la consola de Expo/Metro, sin necesidad del hardware real.
 *
 * Alcance (según issue):
 *   - Mano completamente abierta / cerrada
 *   - Cada dedo individualmente abierto o cerrado
 *   - Estado del guante: encendido / apagado
 *
 * IDs corresponden a la colección `msd_dictionary` en Firebase:
 *   2  → Mano Cerrada
 *   3  → Mano Abierta
 *   4  → Pulgar  abierto   |  9  → Pulgar  cerrado
 *   5  → Índice  abierto   | 10  → Índice  cerrado
 *   6  → Medio   abierto   | 11  → Medio   cerrado
 *   7  → Anular  abierto   | 12  → Anular  cerrado
 *   8  → Meñique abierto   | 13  → Meñique cerrado
 *
 * IMPORTANTE: Solo se registra en entornos __DEV__.
 * En producción el bundler elimina el bloque completo.
 *
 * Uso desde la consola de Expo:
 *   simulateHand({ thumb: true, index: false, middle: false, ring: false, pinky: false })
 *   simulateGlove(true)    // guante encendido / conectado
 *   simulateGlove(false)   // guante apagado  / desconectado
 *   simulateHandHelp()     // muestra instrucciones y tabla de IDs
 *
 * Convención de dedos:
 *   true  = dedo CERRADO (flexionado)
 *   false = dedo ABIERTO (extendido)
 */

import { useAppStore } from "../store/useAppStore";

// ── Tipo público ──────────────────────────────────────────────────────────────

export type GloveState = {
  /** Pulgar  — true = cerrado, false = abierto */
  thumb: boolean;
  /** Índice  — true = cerrado, false = abierto */
  index: boolean;
  /** Medio   — true = cerrado, false = abierto */
  middle: boolean;
  /** Anular  — true = cerrado, false = abierto */
  ring: boolean;
  /** Meñique — true = cerrado, false = abierto */
  pinky: boolean;
};

// ── IDs reales de Firebase (msd_dictionary) ───────────────────────────────────

const FINGER_IDS = {
  // Posición completa de la mano
  HAND_CLOSED: 2,
  HAND_OPEN:   3,

  // Dedos abiertos (dedo extendido, resto cerrado o neutro)
  THUMB_OPEN:   4,
  INDEX_OPEN:   5,
  MIDDLE_OPEN:  6,
  RING_OPEN:    7,
  PINKY_OPEN:   8,

  // Dedos cerrados (dedo flexionado, resto abierto o neutro)
  THUMB_CLOSED:  9,
  INDEX_CLOSED:  10,
  MIDDLE_CLOSED: 11,
  RING_CLOSED:   12,
  PINKY_CLOSED:  13,
} as const;

// ── Función de mapeo ──────────────────────────────────────────────────────────

/**
 * Recibe un GloveState y devuelve el ID correspondiente en Firebase.
 *
 * Lógica de prioridad:
 *   1. Mano completamente cerrada (todos los dedos true)  → id 2
 *   2. Mano completamente abierta (todos los dedos false) → id 3
 *   3. Un solo dedo activo (abierto o cerrado)            → id del dedo
 *   4. Combinación parcial sin mapeo exacto               → null
 */
export function mapHandToId(state: GloveState): number | null {
  const { thumb, index, middle, ring, pinky } = state;
  const fingers = [thumb, index, middle, ring, pinky];

  const allClosed = fingers.every(Boolean);
  const allOpen   = fingers.every((f) => !f);

  if (allClosed) return FINGER_IDS.HAND_CLOSED;
  if (allOpen)   return FINGER_IDS.HAND_OPEN;

  // Dedo único cerrado (solo ese dedo true, el resto false)
  if (thumb  && !index && !middle && !ring && !pinky) return FINGER_IDS.THUMB_CLOSED;
  if (!thumb &&  index && !middle && !ring && !pinky) return FINGER_IDS.INDEX_CLOSED;
  if (!thumb && !index &&  middle && !ring && !pinky) return FINGER_IDS.MIDDLE_CLOSED;
  if (!thumb && !index && !middle &&  ring && !pinky) return FINGER_IDS.RING_CLOSED;
  if (!thumb && !index && !middle && !ring &&  pinky) return FINGER_IDS.PINKY_CLOSED;

  // Dedo único abierto (solo ese dedo false, el resto true)
  if (!thumb &&  index &&  middle &&  ring &&  pinky) return FINGER_IDS.THUMB_OPEN;
  if ( thumb && !index &&  middle &&  ring &&  pinky) return FINGER_IDS.INDEX_OPEN;
  if ( thumb &&  index && !middle &&  ring &&  pinky) return FINGER_IDS.MIDDLE_OPEN;
  if ( thumb &&  index &&  middle && !ring &&  pinky) return FINGER_IDS.RING_OPEN;
  if ( thumb &&  index &&  middle &&  ring && !pinky) return FINGER_IDS.PINKY_OPEN;

  return null;
}

// ── Validación del argumento ──────────────────────────────────────────────────

function isValidGloveState(state: unknown): state is GloveState {
  if (typeof state !== "object" || state === null) return false;
  const s = state as Record<string, unknown>;
  return (
    typeof s.thumb  === "boolean" &&
    typeof s.index  === "boolean" &&
    typeof s.middle === "boolean" &&
    typeof s.ring   === "boolean" &&
    typeof s.pinky  === "boolean"
  );
}

// ── Registro de funciones globales ────────────────────────────────────────────

export function registerSimulateHandGlobal(): void {
  if (!__DEV__) return;

  // ── simulateHand — posición de los dedos ─────────────────────────────────
  (global as any).simulateHand = async (state: GloveState): Promise<void> => {
    if (!isValidGloveState(state)) {
      console.warn(
        "[simulateHand] Argumento inválido. Todos los campos son booleanos obligatorios.\n" +
        "  Uso: simulateHand({ thumb: true, index: false, middle: false, ring: false, pinky: false })\n" +
        "  true = CERRADO | false = abierto\n" +
        "  Escribe simulateHandHelp() para ver los IDs y ejemplos."
      );
      return;
    }

    const key = [
      state.thumb  ? "1" : "0",
      state.index  ? "1" : "0",
      state.middle ? "1" : "0",
      state.ring   ? "1" : "0",
      state.pinky  ? "1" : "0",
    ].join("");

    const id = mapHandToId(state);

    console.log(
      `[simulateHand] Estado del guante simulado:\n` +
      `  ├── thumb  (pulgar)  : ${state.thumb  ? "🤜 CERRADO" : "— abierto"}\n` +
      `  ├── index  (índice)  : ${state.index  ? "🤜 CERRADO" : "— abierto"}\n` +
      `  ├── middle (medio)   : ${state.middle ? "🤜 CERRADO" : "— abierto"}\n` +
      `  ├── ring   (anular)  : ${state.ring   ? "🤜 CERRADO" : "— abierto"}\n` +
      `  ├── pinky  (meñique) : ${state.pinky  ? "🤜 CERRADO" : "— abierto"}\n` +
      `  ├── clave binaria    : ${key}\n` +
      `  └── id Firebase      : ${id ?? "sin mapeo para esta combinación"}`
    );

    if (id === null) {
      console.warn(
        `[simulateHand] La combinación "${key}" no tiene un ID asignado en la base de datos.\n` +
        `  Solo están mapeados: mano abierta, mano cerrada, y cada dedo de forma individual.\n` +
        `  Escribe simulateHandHelp() para ver las combinaciones válidas.`
      );
      return;
    }

    if (typeof (global as any).simulate !== "function") {
      console.error(
        "[simulateHand] simulate() no está disponible en global.\n" +
        "  Asegúrate de llamar registerSimulateGlobal() antes de registerSimulateHandGlobal()."
      );
      return;
    }

    await (global as any).simulate(id);
  };

  // ── simulateGlove — estado encendido / apagado ───────────────────────────
  (global as any).simulateGlove = (connected: boolean): void => {
    if (typeof connected !== "boolean") {
      console.warn(
        "[simulateGlove] El argumento debe ser un booleano.\n" +
        "  simulateGlove(true)   → guante encendido / conectado\n" +
        "  simulateGlove(false)  → guante apagado  / desconectado"
      );
      return;
    }

    const store = useAppStore.getState();

    if (connected) {
      store.setConnected(true);
      store.startTranslating();
      console.log("[simulateGlove] ✅ Guante ENCENDIDO — conectado y traduciendo.");
    } else {
      store.stopTranslating();
      store.setConnected(false);
      console.log("[simulateGlove] ❌ Guante APAGADO — desconectado.");
    }
  };

  // ── simulateHandHelp ──────────────────────────────────────────────────────
  (global as any).simulateHandHelp = (): void => {
    console.log(
      "\n╔══════════════════════════════════════════════════════╗\n" +
      "║       HandlyGo — Simulador de Guante               ║\n" +
      "╠══════════════════════════════════════════════════════╣\n" +
      "║  simulateHand(state)  → simula posición del guante ║\n" +
      "║  simulateGlove(bool)  → encendido/apagado          ║\n" +
      "║  simulateHandHelp()   → muestra esta ayuda         ║\n" +
      "╠══════════════════════════════════════════════════════╣\n" +
      "║  IDs DE FIREBASE (msd_dictionary)                  ║\n" +
      "║                                                      ║\n" +
      "║  id·2   ✊ Mano Cerrada (todos cerrados)            ║\n" +
      "║  id·3   ✋ Mano Abierta  (todos abiertos)           ║\n" +
      "║                                                      ║\n" +
      "║  DEDOS ABIERTOS (ese dedo false, resto true)        ║\n" +
      "║  id·4   🖐 Pulgar  abierto                          ║\n" +
      "║  id·5   🖐 Índice  abierto                          ║\n" +
      "║  id·6   🖐 Medio   abierto                          ║\n" +
      "║  id·7   🖐 Anular  abierto                          ║\n" +
      "║  id·8   🖐 Meñique abierto                          ║\n" +
      "║                                                      ║\n" +
      "║  DEDOS CERRADOS (ese dedo true, resto false)        ║\n" +
      "║  id·9   👊 Pulgar  cerrado                          ║\n" +
      "║  id·10  👊 Índice  cerrado                          ║\n" +
      "║  id·11  👊 Medio   cerrado                          ║\n" +
      "║  id·12  👊 Anular  cerrado                          ║\n" +
      "║  id·13  👊 Meñique cerrado                          ║\n" +
      "╠══════════════════════════════════════════════════════╣\n" +
      "║  EJEMPLOS                                           ║\n" +
      "║                                                      ║\n" +
      "║  // Mano cerrada (id 2)                             ║\n" +
      "║  simulateHand({thumb:true,  index:true,             ║\n" +
      "║    middle:true,  ring:true,  pinky:true})           ║\n" +
      "║                                                      ║\n" +
      "║  // Mano abierta (id 3)                             ║\n" +
      "║  simulateHand({thumb:false, index:false,            ║\n" +
      "║    middle:false, ring:false, pinky:false})          ║\n" +
      "║                                                      ║\n" +
      "║  // Solo índice cerrado (id 10)                     ║\n" +
      "║  simulateHand({thumb:false, index:true,             ║\n" +
      "║    middle:false, ring:false, pinky:false})          ║\n" +
      "║                                                      ║\n" +
      "║  // Guante encendido                                ║\n" +
      "║  simulateGlove(true)                                ║\n" +
      "╚══════════════════════════════════════════════════════╝\n"
    );
  };

  console.log(
    "[simulateHand] Registrado. Funciones: simulateHand() | simulateGlove() | simulateHandHelp()"
  );
}
