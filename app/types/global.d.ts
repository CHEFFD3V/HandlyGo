// types/global.d.ts
/**
 * Extensión del tipo `global` de Node/React Native para exponer
 * las funciones de simulación de consola en entornos __DEV__.
 *
 * Esto evita errores de TypeScript al llamar `simulate(id)` o
 * `simulateHelp()` desde la consola de Expo/Metro.
 */

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
   * Muestra en consola las instrucciones de uso del simulador.
   *
   * @example
   * simulateHelp()
   */
  function simulateHelp(): void;
}

export {};
