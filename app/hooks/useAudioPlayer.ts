import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { playAudioFromUrl } from '@/services/audioService';

export function useAudioPlayer(audioUrl: string | null) {
  const soundRef = useRef<Audio.Sound | null>(null);

  const stopCurrent = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (e) {
        // Ignorar errores al detener
      } finally {
        soundRef.current = null;
      }
    }
  }, []);

  const play = useCallback(async () => {
    if (!audioUrl) return;
    await stopCurrent();
    const sound = await playAudioFromUrl(audioUrl);
    soundRef.current = sound;
  }, [audioUrl, stopCurrent]);

  // 🔊 Reproducir automáticamente cada vez que cambia la URL
  useEffect(() => {
    if (audioUrl) {
      play();
    }
    return () => {
      stopCurrent();
    };
  }, [audioUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      stopCurrent();
    };
  }, []);

  return { replay: play };
}