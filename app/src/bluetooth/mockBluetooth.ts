import { useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import type { AppState } from "../../store/useAppStore";

const MOCK_WORDS = ["Hola", "Gracias", "Por favor", "Adiós", "Buenos días", "Bienvenido", "Hasta luego"] as const;
const EMIT_INTERVAL_MS    = 2000;  // 👈 tiempo de las palabras
const BATTERY_INTERVAL_MS = 3000;  // 👈 tiempo de la batería

export function useMockBluetooth() {
  const isTranslating = useAppStore((state: AppState) => state.isTranslating);
  const setWord       = useAppStore((state: AppState) => state.setWord);
  const setBattery    = useAppStore((state: AppState) => state.setBattery);

  const indexRef = useRef(0);

  useEffect(() => {
    if (!isTranslating) return;

   const wordInterval = setInterval(() => {
    const word = MOCK_WORDS[indexRef.current];
    setWord(word);
    indexRef.current = (indexRef.current + 1) % MOCK_WORDS.length;
  }, EMIT_INTERVAL_MS);

  // Intervalo de batería
  const batteryInterval = setInterval(() => {
  const currentBattery = useAppStore.getState().battery;
    
  if (currentBattery <= 0) {
    clearInterval(wordInterval);    // 👈 detiene las palabras
    clearInterval(batteryInterval); // 👈 detiene la batería
    useAppStore.getState().stopTranslating(); // 👈 actualiza el store
    return;
  }

  setBattery(currentBattery - 5);
}, BATTERY_INTERVAL_MS);

    return () => {
    clearInterval(wordInterval);
    clearInterval(batteryInterval);
  };
      
  }, [isTranslating, setWord, setBattery]);
}