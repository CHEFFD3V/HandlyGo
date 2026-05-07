import { Audio } from 'expo-av';

/**
 * Convierte una URL de GitHub (blob) a URL raw (descargable).
 * Ejemplo:
 *   entrada: https://github.com/.../blob/.../audio.mp3
 *   salida:  https://raw.githubusercontent.com/.../.../audio.mp3
 */
export function getDirectAudioUrl(githubBlobUrl: string): string {
  return githubBlobUrl
    .replace('https://github.com/', 'https://raw.githubusercontent.com/')
    .replace('/blob/', '/');
}

/**
 * Reproduce un audio desde una URL (pública y descargable).
 * Si la URL es de GitHub blob, la convierte automáticamente.
 * Retorna el objeto `Sound` para control posterior.
 */
export async function playAudioFromUrl(url: string): Promise<Audio.Sound | null> {
  const directUrl = getDirectAudioUrl(url);

  try {
    // Configurar modo de audio (para iOS)
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri: directUrl },
      { shouldPlay: true, volume: 1.0 }
    );

    return sound;
  } catch (error) {
    console.warn('[audioService] Error al reproducir audio:', error);
    return null;
  }
}