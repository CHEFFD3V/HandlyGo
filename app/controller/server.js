/**
 * HandlyGo — Demo Controller Server
 * ─────────────────────────────────────────────────────────────────────────────
 * Servidor local para simular traducciones del guante durante demos.
 *
 * Flujo: Botón (Web) → POST /command → server.js → GET /command → App (polling)
 *
 * Uso:
 *   node controller/server.js
 *
 * Endpoints:
 *   POST /command  → { id: number }   — recibe comando desde la web
 *   GET  /command                     — retorna último comando y lo limpia
 */
 
const http = require("http");
 
const PORT = 3000;
 
// ── Estado interno ────────────────────────────────────────────────────────────
let pendingCommand = null; // { id: number } | null
 
// ── Helpers ───────────────────────────────────────────────────────────────────
function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
 
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}
 
// ── Servidor ──────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  setCORSHeaders(res);
 
  // Preflight CORS
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
 
  // POST /command — recibe { id } desde la interfaz web
  if (req.method === "POST" && req.url === "/command") {
    try {
      const body = await readBody(req);
      const id = Number(body?.id);
 
      if (!id || isNaN(id)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "ID inválido" }));
        return;
      }
 
      pendingCommand = { id };
      console.log(`[server] ✅ Comando recibido → id=${id}`);
 
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, id }));
    } catch (err) {
      console.error("[server] ❌ Error al leer cuerpo:", err.message);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "JSON inválido" }));
    }
    return;
  }
 
  // GET /command — retorna último comando y lo limpia (consume-once)
  if (req.method === "GET" && req.url === "/command") {
    const command = pendingCommand;
    pendingCommand = null; // ← limpiar inmediatamente para evitar duplicados
 
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(command ?? {}));
    return;
  }
 
  // 404 para cualquier otra ruta
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Ruta no encontrada" }));
});
 
server.listen(PORT, "0.0.0.0", () => {
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║     HandlyGo — Demo Controller Server       ║");
  console.log("╠══════════════════════════════════════════════╣");
  console.log(`║  Escuchando en  → 0.0.0.0:${PORT}              ║`);
  console.log("║                                              ║");
  console.log("║  Endpoints:                                  ║");
  console.log("║    POST /command  → enviar ID desde web      ║");
  console.log("║    GET  /command  → leer ID desde app        ║");
  console.log("║                                              ║");
  console.log("║  ⚠️  Usa tu IP local en la app y en el HTML  ║");
  console.log("╚══════════════════════════════════════════════╝\n");
});