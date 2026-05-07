/**
 * useMockBluetooth
 * ─────────────────────────────────────────────────────────────────────────────
 * En __DEV__:
 *   El control de conexión y traducción lo maneja useDemoController.
 *   Este hook solo mantiene el ciclo de batería simulada.
 *
 * En producción:
 *   Aquí irá la integración BLE real con el ESP32.
 *
 * NOTA: El mock de palabras automáticas fue ELIMINADO.
 * Las palabras ahora vienen del Demo Controller (index.html → server.js → simulate(id)).
 */
 
import { useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import type { AppState } from "../../store/useAppStore";
 
const BATTERY_INTERVAL_MS = 3000;
 
export function useMockBluetooth() {
  const isTranslating = useAppStore((state: AppState) => state.isTranslating);
  const setBattery    = useAppStore((state: AppState) => state.setBattery);
 
  useEffect(() => {
    if (!isTranslating) return;
 
    // Simula descarga de batería mientras está traduciendo
    const batteryInterval = setInterval(() => {
      const currentBattery = useAppStore.getState().battery;
 
      if (currentBattery <= 0) {
        clearInterval(batteryInterval);
        useAppStore.getState().stopTranslating();
        useAppStore.getState().setConnected(false);
        console.log("[MockBluetooth] Batería agotada — guante desconectado.");
        return;
      }
 
      setBattery(currentBattery - 5);
    }, BATTERY_INTERVAL_MS);
 
    return () => {
      clearInterval(batteryInterval);
    };
  }, [isTranslating, setBattery]);
}