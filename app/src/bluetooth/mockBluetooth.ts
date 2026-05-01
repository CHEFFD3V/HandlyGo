import { useAppStore } from '../../store/useAppStore';

const MOCK_WORDS = ['Hola', 'Gracias', 'Por favor', 'Ayuda', 'Sí', 'No'];
const INTERVAL_MS = 2000;

let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Simula la conexión BLE con el dispositivo ESP32.
 * Activa el estado de conexión en el store global.
 */
export function connectMockBLE(): void {
  const { setConnected } = useAppStore.getState();
  setConnected(true);
  console.log('[MockBLE] Dispositivo conectado (simulado)');
}

/**
 * Simula la desconexión BLE.
 * Detiene la traducción si estaba activa y limpia la conexión.
 */
export function disconnectMockBLE(): void {
  stopMockTranslation();
  const { setConnected } = useAppStore.getState();
  setConnected(false);
  console.log('[MockBLE] Dispositivo desconectado (simulado)');
}

/**
 * Inicia la emisión simulada de palabras cada INTERVAL_MS ms.
 * Solo funciona si el dispositivo está conectado.
 */
export function startMockTranslation(): void {
  const { isConnected, startTranslating, setWord } = useAppStore.getState();

  if (!isConnected) {
    console.warn('[MockBLE] No se puede traducir: dispositivo no conectado');
    return;
  }

  if (intervalId !== null) {
    console.warn('[MockBLE] La traducción ya está activa');
    return;
  }

  startTranslating();
  console.log('[MockBLE] Iniciando traducción simulada...');

  intervalId = setInterval(() => {
    const randomWord = MOCK_WORDS[Math.floor(Math.random() * MOCK_WORDS.length)];
    setWord(randomWord);
    console.log(`[MockBLE] Palabra recibida: ${randomWord}`);
  }, INTERVAL_MS);
}

/**
 * Detiene la emisión simulada de palabras.
 */
export function stopMockTranslation(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[MockBLE] Traducción detenida');
  }

  const { stopTranslating } = useAppStore.getState();
  stopTranslating();
}
