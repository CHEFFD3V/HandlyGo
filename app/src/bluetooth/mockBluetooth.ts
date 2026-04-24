import { useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import type { AppState } from "../../store/useAppStore";

const MOCK_WORDS = ["Hola", "Gracias", "Por favor"] as const;
const EMIT_INTERVAL_MS = 2000;

export function useMockBluetooth() {
  const isTranslating = useAppStore((state: AppState) => state.isTranslating);
  const setWord       = useAppStore((state: AppState) => state.setWord);

  const indexRef = useRef(0);

  useEffect(() => {
    if (!isTranslating) return;

    const interval = setInterval(() => {
      const word = MOCK_WORDS[indexRef.current];
      setWord(word);
      indexRef.current = (indexRef.current + 1) % MOCK_WORDS.length;
    }, EMIT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isTranslating, setWord]);
}
