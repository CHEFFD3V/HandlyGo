/**
 * simulate(id)
 * ─────────────────────────────────────────────────────────────────────────────
 * Función global de desarrollo que permite inyectar manualmente una traducción
 * desde la consola de Expo/Metro, sin necesidad del hardware físico.
 *
 * Flujo: Consola → simulate(id) → Firebase (translations) → Store → UI → Audio
 *
 * IMPORTANTE: Esta función SOLO se registra en entornos de desarrollo (__DEV__).
 * En producción (builds de release) el bloque completo es eliminado por el
 * bundler, por lo que no existe riesgo de exposición.
 *
 * Uso desde la consola de Expo:
 *   simulate(101)       // busca la traducción con id=101 en Firebase
 *   simulate(202)       // busca la traducción con id=202
 *   simulateHelp()      // muestra instrucciones en consola
 */

import { useTranslationStore } from "@/store/useTranslationStore";

export function registerSimulateGlobal(): void {
  if (!__DEV__) {
    // En producción no se registra nada
    return;
  }

  // ── Función principal ──────────────────────────────────────────────────────
  (global as any).simulate = async (id: number): Promise<void> => {
    if (typeof id !== "number" || isNaN(id)) {
      console.warn(
        "[simulate] El argumento debe ser un número. Ej: simulate(101)"
      );
      return;
    }

    console.log(`[simulate] Simulando traducción con id=${id}...`);

    try {
      await useTranslationStore.getState().setWordFromId(id);

      const { currentWord, error } = useTranslationStore.getState();

      if (error) {
        console.warn(`[simulate] Error: ${error}`);
        return;
      }

      if (currentWord) {
        console.log(
          `[simulate] Traducción cargada exitosamente:\n` +
            `  ├── id       : ${currentWord.id}\n` +
            `  ├── texto    : "${currentWord.texto}"\n` +
            `  ├── audio    : "${currentWord.audio}"\n` +
            `  └── category : "${currentWord.category ?? "N/A"}"`
        );
      }
    } catch (err) {
      console.error(`[simulate] Error inesperado:`, err);
    }
  };

  // ── Función de ayuda ───────────────────────────────────────────────────────
  (global as any).simulateHelp = (): void => {
    console.log(
      "\n╔══════════════════════════════════════════════╗\n" +
        "║      HandlyGo — Simulador de Consola        ║\n" +
        "╠══════════════════════════════════════════════╣\n" +
        "║  simulate(id)     → simula traducción por ID║\n" +
        "║  simulateHelp()   → muestra esta ayuda      ║\n" +
        "║                                              ║\n" +
        "║  Ejemplo:                                    ║\n" +
        "║    simulate(101)                             ║\n" +
        "║                                              ║\n" +
        "║  Flujo:                                      ║\n" +
        "║  Consola→Firebase→Store→UI→Audio             ║\n" +
        "╚══════════════════════════════════════════════╝\n"
    );
  };

  console.log(
    "[simulate] Simulador registrado. Escribe simulateHelp() para más info."
  );
}