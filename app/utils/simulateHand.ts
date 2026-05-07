/**
 * simulateHand.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Utilidad de desarrollo que permite simular el estado físico del guante
 * HandlyGo desde la consola de Expo/Metro, sin necesidad del hardware real.
 *
 * Expone la función global `simulateHand(state: GloveState)` que:
 *   1. Recibe el estado booleano de los 5 dedos.
 *   2. Mapea la combinación a un ID de la colección `msd_dictionary` en Firebase.
 *   3. Delega a `simulate(id)` para ejecutar el flujo completo:
 *      Consola → Firebase → Store → UI → Audio
 *
 * IMPORTANTE: Solo se registra en entornos __DEV__.
 * En producción el bundler elimina el bloque completo.
 *
 * Uso desde la consola de Expo:
 *   simulateHand({ thumb: true, index: true, middle: false, ring: false, pinky: false })
 *   simulateHandHelp()   // muestra instrucciones y tabla de combinaciones
 *
 * Convención de dedos:
 *   true  = dedo CERRADO (flexionado)
 *   false = dedo ABIERTO (extendido)
 */

// ── Tipo público ──────────────────────────────────────────────────────────────

export type GloveState = {
  /** Pulgar  — true = cerrado */
  thumb: boolean;
  /** Índice  — true = cerrado */
  index: boolean;
  /** Medio   — true = cerrado */
  middle: boolean;
  /** Anular  — true = cerrado */
  ring: boolean;
  /** Meñique — true = cerrado */
  pinky: boolean;
};

// ── Tabla de mapeo: clave binaria → ID de msd_dictionary ────────────────────
//
// La clave se construye concatenando los 5 bits en orden:
//   thumb | index | middle | ring | pinky
//   "1" = cerrado, "0" = abierto
//
// Ejemplo: { thumb:true, index:true, middle:false, ring:false, pinky:false }
//          → "11000" → ID 101 (letra "A" en MSD)
//
// Ampliar esta tabla a medida que se integren nuevas señas al diccionario.
// Los IDs deben coincidir con el campo `id` de la colección `msd_dictionary`
// en Firebase. Las combinaciones sin mapeo devuelven null y muestran un aviso.
// ─────────────────────────────────────────────────────────────────────────────

const GLOVE_MAP: Record<string, number> = {
  // ── Vocales ────────────────────────────────────────────────────────────────
  "10000": 101,  // A — pulgar cerrado, resto abierto
  "01111": 102,  // E — índice+medio+anular+meñique cerrados, pulgar abierto
  "00001": 103,  // I — solo meñique cerrado
  "11110": 104,  // O — pulgar+índice+medio+anular cerrados, meñique abierto
  "00110": 105,  // U — índice+medio cerrados (juntos), resto abierto

  // ── Letras del abecedario ──────────────────────────────────────────────────
  "11111": 106,  // Puño cerrado — B (todos los dedos cerrados)
  "01110": 107,  // C — índice+medio+anular, forma de arco
  "01100": 108,  // D — índice+medio extendidos
  "00010": 109,  // F — solo anular cerrado
  "10001": 110,  // G — pulgar+meñique
  "11000": 111,  // H — pulgar+índice
  "00000": 112,  // Mano abierta — L (todos abiertos)
  "01000": 113,  // Mano apuntando — índice solo extendido

  // ── Palabras básicas ───────────────────────────────────────────────────────
  "10110": 201,  // Hola
  "11100": 202,  // Gracias
  "01001": 203,  // Por favor
  "10010": 204,  // Sí
  "01010": 205,  // No
  "11010": 206,  // Ayuda
  "10100": 207,  // Agua
  "10101": 208,  // Comida
  "00101": 209,  // Casa
  "11001": 210,  // Familia
 
  // ── Frases básicas ─────────────────────────────────────────────────────────
  "10111": 301,  // Buenos días
  "01011": 302,  // Buenas noches
  "11011": 303,  // ¿Cómo estás?
  "10011": 304,  // Me llamo...
  "01101": 305,  // No entiendo
  "11101": 306,  // Repite por favor
};

// ── Función de mapeo ──────────────────────────────────────────────────────────

/**
 * Convierte un GloveState en la clave binaria de 5 bits y devuelve
 * el ID del diccionario MSD correspondiente, o null si no hay mapeo.
 */
export function mapHandToId(state: GloveState): number | null {
  const key = [
    state.thumb  ? "1" : "0",
    state.index  ? "1" : "0",
    state.middle ? "1" : "0",
    state.ring   ? "1" : "0",
    state.pinky  ? "1" : "0",
  ].join("");

  return GLOVE_MAP[key] ?? null;
}

// ── Registro de la función global ─────────────────────────────────────────────

/**
 * registerSimulateHandGlobal
 *
 * Registra `simulateHand` y `simulateHandHelp` en el objeto global.
 * Debe llamarse una única vez desde el punto de entrada de la app
 * (app/_layout.tsx), junto a `registerSimulateGlobal`.
 *
 * En producción este bloque completo es NO-OP.
 */
export function registerSimulateHandGlobal(): void {
  if (!__DEV__) return;

  // ── simulateHand ─────────────────────────────────────────────────────────
  (global as any).simulateHand = async (state: GloveState): Promise<void> => {
    // Validar que el argumento sea un objeto con los 5 campos booleanos
    if (
      typeof state !== "object" ||
      state === null ||
      typeof state.thumb  !== "boolean" ||
      typeof state.index  !== "boolean" ||
      typeof state.middle !== "boolean" ||
      typeof state.ring   !== "boolean" ||
      typeof state.pinky  !== "boolean"
    ) {
      console.warn(
        "[simulateHand] Argumento inválido. Uso correcto:\n" +
        "  simulateHand({ thumb: true, index: false, middle: false, ring: false, pinky: false })\n" +
        "  Todos los campos son booleanos obligatorios.\n" +
        "  true = dedo cerrado | false = dedo abierto"
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

    console.log(
      `[simulateHand] Estado recibido:\n` +
      `  ├── thumb  (pulgar)  : ${state.thumb  ? "CERRADO 🤜" : "abierto"}\n` +
      `  ├── index  (índice)  : ${state.index  ? "CERRADO 🤜" : "abierto"}\n` +
      `  ├── middle (medio)   : ${state.middle ? "CERRADO 🤜" : "abierto"}\n` +
      `  ├── ring   (anular)  : ${state.ring   ? "CERRADO 🤜" : "abierto"}\n` +
      `  ├── pinky  (meñique) : ${state.pinky  ? "CERRADO 🤜" : "abierto"}\n` +
      `  └── clave binaria    : ${key}`
    );

    const id = mapHandToId(state);

    if (id === null) {
      console.warn(
        `[simulateHand] La combinación "${key}" no tiene mapeo en GLOVE_MAP.\n` +
        `  → Agrega la entrada correspondiente en app/utils/simulateHand.ts\n` +
        `  → Llama simulateHandHelp() para ver las combinaciones disponibles.`
      );
      return;
    }

    console.log(`[simulateHand] Combinación "${key}" → ID ${id}. Delegando a simulate(${id})...`);

    // Delegar al simulador base que consulta Firebase y actualiza el store
    if (typeof (global as any).simulate !== "function") {
      console.error(
        "[simulateHand] simulate() no está registrado en global.\n" +
        "  Asegúrate de llamar registerSimulateGlobal() antes de registerSimulateHandGlobal()."
      );
      return;
    }

    await (global as any).simulate(id);
  };

  // ── simulateHandHelp ──────────────────────────────────────────────────────
  (global as any).simulateHandHelp = (): void => {
    console.log(
      "\n╔══════════════════════════════════════════════════════╗\n" +
      "║       HandlyGo — Simulador de Guante (Mano)         ║\n" +
      "╠══════════════════════════════════════════════════════╣\n" +
      "║  simulateHand(state)   → simula posición del guante ║\n" +
      "║  simulateHandHelp()    → muestra esta ayuda         ║\n" +
      "║                                                      ║\n" +
      "║  Estructura de GloveState:                          ║\n" +
      "║  {                                                   ║\n" +
      "║    thumb:  boolean,  // pulgar                      ║\n" +
      "║    index:  boolean,  // índice                      ║\n" +
      "║    middle: boolean,  // medio                       ║\n" +
      "║    ring:   boolean,  // anular                      ║\n" +
      "║    pinky:  boolean,  // meñique                     ║\n" +
      "║  }                                                   ║\n" +
      "║  true = CERRADO | false = abierto                   ║\n" +
      "║                                                      ║\n" +
      "║  Ejemplos:                                           ║\n" +
      "║  simulateHand({thumb:true,  index:false,            ║\n" +
      "║                middle:false,ring:false,pinky:false}) ║\n" +
      "║  → Letra A (ID 101)                                 ║\n" +
      "║                                                      ║\n" +
      "║  simulateHand({thumb:false, index:true,             ║\n" +
      "║                middle:true, ring:true, pinky:true}) ║\n" +
      "║  → Letra E (ID 102)                                 ║\n" +
      "║                                                      ║\n" +
      "║  simulateHand({thumb:false, index:false,            ║\n" +
      "║                middle:false,ring:false,pinky:false}) ║\n" +
      "║  → Mano abierta (ID 112)                            ║\n" +
      "╠══════════════════════════════════════════════════════╣\n" +
      "║  Combinaciones disponibles (clave → ID):            ║\n" +
      "║  10000→101  01111→102  00001→103  11110→104         ║\n" +
      "║  00110→105  11111→106  01110→107  01100→108         ║\n" +
      "║  00010→109  10001→110  11000→111  00000→112         ║\n" +
      "║  01000→113  10110→201  11100→202  01001→203         ║\n" +
      "║  10010→204  01010→205  11010→206  10100→207         ║\n" +
      "║  00101→209  11001→210  10111→301  01011→302         ║\n" +
      "║  11011→303  10011→304  01101→305  11101→306         ║\n" +
      "╚══════════════════════════════════════════════════════╝\n"
    );
  };

  console.log(
    "[simulateHand] Simulador de guante registrado. Escribe simulateHandHelp() para más info."
  );
}
