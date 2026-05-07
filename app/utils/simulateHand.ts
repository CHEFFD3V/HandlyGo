/**
 * simulateHand.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Utilidad de desarrollo para simular el estado físico del guante HandlyGo
 * desde la consola de Expo/Metro, sin necesidad del hardware real.
 *
 * Alcance (según issue):
 *   - Mano completamente abierta
 *   - Mano completamente cerrada
 *   - Cada dedo individualmente abierto o cerrado
 *   - Estado del guante: encendido / apagado
 *
 * IMPORTANTE: Solo se registra en entornos __DEV__.
 * En producción el bundler elimina el bloque completo.
 *
 * Uso desde la consola de Expo:
 *   simulateHand({ thumb: true, index: true, middle: false, ring: false, pinky: false })
 *   simulateGlove(true)      // guante encendido / conectado
 *   simulateGlove(false)     // guante apagado  / desconectado
 *   simulateHandHelp()       // muestra instrucciones
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

// ── Estados predefinidos de uso común ────────────────────────────────────────

export const GLOVE_PRESETS: Record<string, GloveState> = {
  /** Todos los dedos abiertos */
  OPEN:   { thumb: false, index: false, middle: false, ring: false, pinky: false },
  /** Todos los dedos cerrados — puño */
  CLOSED: { thumb: true,  index: true,  middle: true,  ring: true,  pinky: true  },
  /** Solo pulgar cerrado */
  THUMB:  { thumb: true,  index: false, middle: false, ring: false, pinky: false },
  /** Solo índice cerrado */
  INDEX:  { thumb: false, index: true,  middle: false, ring: false, pinky: false },
  /** Solo medio cerrado */
  MIDDLE: { thumb: false, index: false, middle: true,  ring: false, pinky: false },
  /** Solo anular cerrado */
  RING:   { thumb: false, index: false, middle: false, ring: true,  pinky: false },
  /** Solo meñique cerrado */
  PINKY:  { thumb: false, index: false, middle: false, ring: false, pinky: true  },
};

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
  (global as any).simulateHand = (state: GloveState): void => {
    if (!isValidGloveState(state)) {
      console.warn(
        "[simulateHand] Argumento inválido. Todos los campos son booleanos obligatorios.\n" +
        "  Uso: simulateHand({ thumb: true, index: false, middle: false, ring: false, pinky: false })\n" +
        "  true = CERRADO | false = abierto\n" +
        "  Escribe simulateHandHelp() para ver los presets disponibles."
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

    const dedosCerrados = Object.entries(state).filter(([, v]) =>  v).map(([k]) => k);
    const dedosAbiertos = Object.entries(state).filter(([, v]) => !v).map(([k]) => k);
    const esManoAbierta = dedosCerrados.length === 0;
    const esManoFirmada = dedosAbiertos.length === 0;

    console.log(
      `[simulateHand] Estado del guante simulado:\n` +
      `  ├── thumb  (pulgar)  : ${state.thumb  ? "🤜 CERRADO" : "— abierto"}\n` +
      `  ├── index  (índice)  : ${state.index  ? "🤜 CERRADO" : "— abierto"}\n` +
      `  ├── middle (medio)   : ${state.middle ? "🤜 CERRADO" : "— abierto"}\n` +
      `  ├── ring   (anular)  : ${state.ring   ? "🤜 CERRADO" : "— abierto"}\n` +
      `  ├── pinky  (meñique) : ${state.pinky  ? "🤜 CERRADO" : "— abierto"}\n` +
      `  ├── clave binaria    : ${key}\n` +
      `  └── posición         : ${esManoAbierta ? "✋ MANO ABIERTA" : esManoFirmada ? "✊ MANO CERRADA" : "posición parcial"}`
    );
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
      console.log("[simulateGlove] Guante ENCENDIDO — conectado y traduciendo.");
    } else {
      store.stopTranslating();
      store.setConnected(false);
      console.log("[simulateGlove] Guante APAGADO — desconectado.");
    }
  };

  // ── simulateHandHelp ──────────────────────────────────────────────────────
  (global as any).simulateHandHelp = (): void => {
    console.log(
      "\n╔══════════════════════════════════════════════════════╗\n" +
      "║       HandlyGo — Simulador de Guante               ║\n" +
      "╠══════════════════════════════════════════════════════╣\n" +
      "║  FUNCIONES DISPONIBLES                              ║\n" +
      "║                                                      ║\n" +
      "║  simulateHand(state)                                ║\n" +
      "║    Simula la posición de los 5 dedos.               ║\n" +
      "║    true = CERRADO | false = abierto                 ║\n" +
      "║                                                      ║\n" +
      "║  simulateGlove(connected)                           ║\n" +
      "║    Simula el estado on/off del guante.              ║\n" +
      "║    true  → encendido / conectado                    ║\n" +
      "║    false → apagado  / desconectado                  ║\n" +
      "║                                                      ║\n" +
      "╠══════════════════════════════════════════════════════╣\n" +
      "║  EJEMPLOS                                           ║\n" +
      "║                                                      ║\n" +
      "║  Mano abierta (todos abiertos):                     ║\n" +
      "║  simulateHand({thumb:false, index:false,            ║\n" +
      "║    middle:false, ring:false, pinky:false})          ║\n" +
      "║                                                      ║\n" +
      "║  Mano cerrada / puño (todos cerrados):              ║\n" +
      "║  simulateHand({thumb:true,  index:true,             ║\n" +
      "║    middle:true,  ring:true,  pinky:true})           ║\n" +
      "║                                                      ║\n" +
      "║  Solo pulgar cerrado:                               ║\n" +
      "║  simulateHand({thumb:true,  index:false,            ║\n" +
      "║    middle:false, ring:false, pinky:false})          ║\n" +
      "║                                                      ║\n" +
      "║  Guante encendido:  simulateGlove(true)             ║\n" +
      "║  Guante apagado:    simulateGlove(false)            ║\n" +
      "╚══════════════════════════════════════════════════════╝\n"
    );
  };

  console.log(
    "[simulateHand] Registrado. Funciones: simulateHand() | simulateGlove() | simulateHandHelp()"
  );
}
