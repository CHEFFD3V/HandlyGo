/**
 * useDemoController
 * ─────────────────────────────────────────────────────────────────────────────
 * Hook que conecta la app con el servidor local de demo.
 * Hace polling cada 400ms, y cuando detecta un comando lo pasa a simulate(id).
 *
 * Flujo:
 *   server.js (GET /command) → useDemoController → simulate(id)
 *   → useTranslationStore.setWordFromId(id) → Store → UI
 *
 * Uso:
 *   // En _layout.tsx o en el screen principal
 *   import { useDemoController } from '@/hooks/useDemoController';
 *   useDemoController({ enabled: __DEV__ });
 *
 * Configuración:
 *   Cambia SERVER_IP por la IP local de tu PC.
 *   PC y teléfono deben estar en la misma red WiFi.
 *   NO uses localhost → no funciona desde el dispositivo físico.
 */
 
import { useEffect, useRef } from "react";
 
// ── Configuración ──────────────────────────────────────────────────────────────
// ⚠️ Cambia esta IP por la IP local de tu PC (ifconfig / ipconfig)
const SERVER_IP   = "10.0.0.3";
const SERVER_PORT = 3000;
const POLL_MS     = 400; // intervalo de polling en ms
 
const COMMAND_URL = `http://${SERVER_IP}:${SERVER_PORT}/command`;
 
// ── Tipos ──────────────────────────────────────────────────────────────────────
type CommandResponse = {
  id?: number;
};
 
type UseDemoControllerOptions = {
  /** Solo activa el polling si es true. Por defecto __DEV__. */
  enabled?: boolean;
};
 
// ── Hook ───────────────────────────────────────────────────────────────────────
export function useDemoController(
  options: UseDemoControllerOptions = {}
): void {
  const { enabled = __DEV__ } = options;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
 
  useEffect(() => {
    if (!enabled) return;
 
    console.log(
      `[DemoController] Polling activo → ${COMMAND_URL} (cada ${POLL_MS}ms)`
    );
 
    const poll = async () => {
      try {
        const res = await fetch(COMMAND_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
 
        if (!res.ok) return; // servidor caído o error transitorio → ignorar silenciosamente
 
        const data: CommandResponse = await res.json();
 
        if (data?.id && typeof data.id === "number") {
          console.log(`[DemoController] Comando recibido → id=${data.id}`);
 
          // Llama a la función global simulate registrada en simulateConsole.ts
          const simulateFn = (global as any).simulate;
 
          if (typeof simulateFn === "function") {
            await simulateFn(data.id);
          } else {
            console.warn(
              "[DemoController] simulate() no está registrado en global. " +
              "Asegúrate de llamar registerSimulateGlobal() en _layout.tsx"
            );
          }
        }
      } catch {
        // Error de red silencioso: el servidor puede no estar corriendo todavía
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