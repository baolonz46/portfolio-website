const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = 3000;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, "data", "clienti.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "paolo2026";
const AUTH_TOKEN = "pm_auth_token_2026";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".otf": "font/otf",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Helper per leggere body JSON
function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

// Helper per leggere clienti.json
function readClienti() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content || "[]");
  } catch {
    return [];
  }
}

// Helper per salvare clienti.json
function writeClienti(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Errore salvataggio clienti:", err);
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split("?");
  let reqPath = decodeURI(urlParts[0]);

  // ───────── API AREA RISERVATA ─────────
  if (reqPath.startsWith("/api/")) {
    res.setHeader("Content-Type", "application/json");

    // Login
    if (reqPath === "/api/login" && req.method === "POST") {
      const { password } = await getRequestBody(req);
      if (password === ADMIN_PASSWORD) {
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true, token: AUTH_TOKEN }));
      } else {
        res.writeHead(401);
        res.end(JSON.stringify({ ok: false, errore: "Password non corretta" }));
      }
      return;
    }

    // CRUD Clienti (protetto da token)
    const token = req.headers["authorization"] || req.headers["x-auth-token"];
    if (token !== AUTH_TOKEN) {
      res.writeHead(401);
      res.end(JSON.stringify({ ok: false, errore: "Non autorizzato" }));
      return;
    }

    // GET Clienti
    if (reqPath === "/api/clienti" && req.method === "GET") {
      const clienti = readClienti();
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true, clienti }));
      return;
    }

    // POST Nuovo Cliente
    if (reqPath === "/api/clienti" && req.method === "POST") {
      const dati = await getRequestBody(req);
      const clienti = readClienti();
      const ora = new Date().toISOString();
      const nuovo = {
        id: "c_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        ...dati,
        creatoIl: ora,
        aggiornatoIl: ora,
      };
      clienti.push(nuovo);
      writeClienti(clienti);
      res.writeHead(201);
      res.end(JSON.stringify({ ok: true, cliente: nuovo }));
      return;
    }

    // PUT Modifica Cliente
    if (reqPath.startsWith("/api/clienti/") && req.method === "PUT") {
      const id = reqPath.replace("/api/clienti/", "");
      const dati = await getRequestBody(req);
      const clienti = readClienti();
      const idx = clienti.findIndex((c) => c.id === id);
      if (idx === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ ok: false, errore: "Cliente non trovato" }));
        return;
      }
      clienti[idx] = {
        ...clienti[idx],
        ...dati,
        aggiornatoIl: new Date().toISOString(),
      };
      writeClienti(clienti);
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true, cliente: clienti[idx] }));
      return;
    }

    // DELETE Elimina Cliente
    if (reqPath.startsWith("/api/clienti/") && req.method === "DELETE") {
      const id = reqPath.replace("/api/clienti/", "");
      let clienti = readClienti();
      clienti = clienti.filter((c) => c.id !== id);
      writeClienti(clienti);
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ ok: false, errore: "Endpoint non trovato" }));
    return;
  }

  // ───────── FILE STATICI ─────────
  if (reqPath === "/") reqPath = "/index.html";

  const filePath = path.join(ROOT, reqPath);

  // Impedisce directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("403 Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const fileSize = stats.size;
    const range = req.headers.range;

    // Supporto HTTP Range per video Safari / iOS
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.writeHead(416, { "Content-Range": `bytes */${fileSize}` });
        res.end();
        return;
      }

      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": contentType,
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

server.listen(PORT, "0.0.0.0", () => {
  const ip = getLocalIp();
  console.log(`\n✦ paulandvideo server active!`);
  console.log(`- Local:   http://localhost:${PORT}`);
  console.log(`- Network: http://${ip}:${PORT}\n`);
});
