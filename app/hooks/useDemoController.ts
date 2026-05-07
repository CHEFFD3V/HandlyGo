/**
 * useDemoController
 * ─────────────────────────────────────────────────────────────────────────────
 * Hook que conecta la app con el servidor local de demo.
 * Hace polling cada 400ms. Cuando detecta un comando:
 *
 *   ID 1  → guante ENCENDIDO  (setConnected true  + startTranslating)
 *   ID 0  → guante APAGADO    (setConnected false + stopTranslating)
 *   ID 2  → mano cerrada      (log informativo)
 *   ID 3  → mano abierta      (log informativo)
 *   ID 4–8  → dedos abiertos  (pulgar → meñique)
 *   ID 9–13 → dedos cerrados  (pulgar → meñique)
 *   Otro ID → simulate(id) → Firebase → Store → UI
 *
 * Uso en _layout.tsx:
 *   import { useDemoController } from '@/hooks/useDemoController';
 *   useDemoController({ enabled: __DEV__ });
 */
 
import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
 
// ── Configuración ─────────────────────────────────────────────────────────────
const SERVER_IP   = "10.215.251.200"; // ⚠️ IP local de la PC
const SERVER_PORT = 3000;
const POLL_MS     = 400;
 
const COMMAND_URL = `http://${SERVER_IP}:${SERVER_PORT}/command`;
 
// ── IDs reservados para control del guante ────────────────────────────────────
const FINGER_OPEN_NAMES  = ["Pulgar","Índice","Medio","Anular","Meñique"];
const FINGER_CLOSED_NAMES = ["Pulgar","Índice","Medio","Anular","Meñique"];
 
// ── Tipos ─────────────────────────────────────────────────────────────────────
type CommandResponse = { id?: number };
type UseDemoControllerOptions = { enabled?: boolean };
 
// ── Hook ──────────────────────────────────────────────────────────────────────
export function useDemoController(options: UseDemoControllerOptions = {}): void {
  const { enabled = __DEV__ } = options;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
 
  useEffect(() => {
    if (!enabled) return;
 
    console.log(`[DemoController] Polling activo → ${COMMAND_URL} (cada ${POLL_MS}ms)`);
 
    const poll = async () => {
      try {
        const res = await fetch(COMMAND_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
 
        if (!res.ok) return;
 
        const data: CommandResponse = await res.json();
        if (data?.id === undefined || data?.id === null) return;
 
        const id = data.id;
 
        // ── ID 0: Guante apagado ───────────────────────────────────────────
        if (id === 0) {
          console.log("[DemoController] 🔴 Guante APAGADO");
          useAppStore.getState().stopTranslating();
          useAppStore.getState().setConnected(false);
          return;
        }
 
        // ── ID 1: Guante encendido ─────────────────────────────────────────
        if (id === 1) {
          console.log("[DemoController] 🟢 Guante ENCENDIDO");
          useAppStore.getState().setConnected(true);
          useAppStore.getState().startTranslating();
          return;
        }
 
        // ── ID 2: Mano cerrada ─────────────────────────────────────────────
        if (id === 2) {
          console.log("[DemoController] ✊ Mano cerrada");
          return;
        }
 
        // ── ID 3: Mano abierta ─────────────────────────────────────────────
        if (id === 3) {
          console.log("[DemoController] 🖐 Mano abierta");
          return;
        }
 
        // ── ID 4–8: Dedos abiertos (pulgar → meñique) ─────────────────────
        if (id >= 4 && id <= 8) {
          console.log(`[DemoController] 🫴 Dedo abierto: ${FINGER_OPEN_NAMES[id - 4]}`);
          return;
        }
 
        // ── ID 9–13: Dedos cerrados (pulgar → meñique) ────────────────────
        if (id >= 9 && id <= 13) {
          console.log(`[DemoController] ✊ Dedo cerrado: ${FINGER_CLOSED_NAMES[id - 9]}`);
          return;
        }
 
        // ── Traducción real → simulate(id) ────────────────────────────────
        console.log(`[DemoController] 📨 Traducción → id=${id}`);
 
        const simulateFn = (global as any).simulate;
 
        if (typeof simulateFn === "function") {
          await simulateFn(id);
        } else {
          console.warn(
            "[DemoController] simulate() no registrado. " +
            "Verifica registerSimulateGlobal() en _layout.tsx"
          );
        }
      } catch {
        // Silencioso — servidor puede estar apagado
      }
    };
 
    timerRef.current = setInterval(poll, POLL_MS);
 
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        console.log("[DemoController] Polling detenido.");
      }
    };
  }, [enabled]);
}