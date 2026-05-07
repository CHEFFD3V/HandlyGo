// types/global.d.ts
/**
 * Extensión del tipo `global` de Node/React Native para exponer
 * las funciones de simulación de consola en entornos __DEV__.
 *
 * Esto evita errores de TypeScript al llamar `simulate(id)`,
 * `simulateHand(state)` o sus helpers desde la consola de Expo/Metro.
 */

// NOTA: No usar import aquí. Cualquier import convierte este archivo en un
// módulo y rompe las declaraciones globales. GloveState se declara inline.

declare global {
  /**
   * Simula la recepción de una seña desde el guante físico.
   * Consulta Firebase con el ID dado y actualiza el store global.
   *
   * @param id - ID numérico de la seña en la colección `msd_dictionary`
   *
   * @example
   * simulate(101)  // busca y carga la seña con id=101
   */
  function simulate(id: number): Promise<void>;

  /**
   * Muestra en consola las instrucciones de uso del simulador base.
   *
   * @example
   * simulateHelp()
   */
  function simulateHelp(): void;

  /**
   * Simula el estado físico del guante HandlyGo a partir de la posición
   * de los 5 dedos. Mapea la combinación a un ID del diccionario MSD
   * y delega a `simulate(id)` para ejecutar el flujo completo.
   *
   * Convención:
   *   true  = dedo CERRADO (flexionado)
   *   false = dedo ABIERTO (extendido)
   *
   * @example
   * simulateHand({ thumb: true, index: false, middle: false, ring: false, pinky: false })
   * // → Letra "A" (ID 101) → Firebase → Store → UI → Audio
   */
  function simulateHand(state: {
    thumb: boolean;
    index: boolean;
    middle: boolean;
    ring: boolean;
    pinky: boolean;
  }): Promise<void>;

  /**
   * Muestra en consola las instrucciones de uso del simulador de guante,
   * incluyendo la tabla completa de combinaciones disponibles.
   *
   * @example
   * simulateHandHelp()
   */
  function simulateHandHelp(): void;
}

export {};