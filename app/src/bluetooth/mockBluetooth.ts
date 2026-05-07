import { useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useTranslationStore } from "../../store/useTranslationStore";
import type { AppState } from "../../store/useAppStore";
import type { TranslationWord } from "../../store/useTranslationStore";

const MOCK_WORDS: TranslationWord[] = [
  { id: 1, texto: 'Hola',      audio: '' },
  { id: 2, texto: 'señor',     audio: '' },
  { id: 3, texto: 'Por favor', audio: '' },
  { id: 4, texto: 'me',        audio: '' },
  { id: 5, texto: 'puedes',    audio: '' },
  { id: 6, texto: 'dar',       audio: '' },
  { id: 7, texto: 'la',        audio: '' },
  { id: 8, texto: 'hora',      audio: '' },
  { id: 9, texto: '?',         audio: '' },
];

const EMIT_INTERVAL_MS    = 2000;
const BATTERY_INTERVAL_MS = 3000;

export function useMockBluetooth() {
  const isTranslating = useAppStore((state: AppState) => state.isTranslating);
  const setBattery    = useAppStore((state: AppState) => state.setBattery);

  const indexRef = useRef(0);

  useEffect(() => {
    if (!isTranslating) return;

    const wordInterval = setInterval(() => {
      const word = MOCK_WORDS[indexRef.current];
      useTranslationStore.getState().setWordDirect(word); // ← actualiza el store correcto
      indexRef.current = (indexRef.current + 1) % MOCK_WORDS.length;
    }, EMIT_INTERVAL_MS);

    const batteryInterval = setInterval(() => {
      const currentBattery = useAppStore.getState().battery;

      if (currentBattery <= 0) {
        clearInterval(wordInterval);
        clearInterval(batteryInterval);
        useAppStore.getState().stopTranslating();
        return;
      }

      setBattery(currentBattery - 5);
    }, BATTERY_INTERVAL_MS);

    return () => {
      clearInterval(wordInterval);
      clearInterval(batteryInterval);
    };
  }, [isTranslating, setBattery]);
}