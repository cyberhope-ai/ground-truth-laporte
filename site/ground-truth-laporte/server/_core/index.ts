import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createHmac, timingSafeEqual } from "crypto";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { ENV } from "./env";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Site-wide password gate (SITE_PASSWORD env). Unset = open, so local dev
  // and any deploy without the secret behave exactly as before. Presents a
  // password page (not HTTP Basic Auth — mobile/in-app browsers suppress the
  // native prompt) and sets a signed HttpOnly cookie good for 30 days.
  // Changing the password invalidates all existing cookies.
  const sitePassword = process.env.SITE_PASSWORD;
  if (sitePassword) {
    const expected = Buffer.from(sitePassword);
    const gateToken = createHmac("sha256", sitePassword).update("laporte-gate-v1").digest("hex");
    const gatePage = (error: boolean, nextPath: string) => `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>Private Preview — Ground Truth LaPorte</title>
<style>
  * { box-sizing: border-box; margin: 0; }
  body { min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #0c1220; color: #e8ecf4; font-family: Georgia, 'Times New Roman', serif; padding: 24px; }
  .card { width: 100%; max-width: 420px; background: #131c30; border: 1px solid #24314d;
    border-radius: 12px; padding: 40px 36px; box-shadow: 0 12px 40px rgba(0,0,0,.45); }
  .kicker { font-family: system-ui, sans-serif; font-size: 11px; letter-spacing: .18em;
    text-transform: uppercase; color: #d9a441; margin-bottom: 14px; }
  h1 { font-size: 26px; line-height: 1.25; margin-bottom: 10px; }
  p { font-size: 15px; line-height: 1.55; color: #9fabc4; margin-bottom: 26px; }
  label { display: block; font-family: system-ui, sans-serif; font-size: 12px; letter-spacing: .06em;
    text-transform: uppercase; color: #9fabc4; margin-bottom: 8px; }
  input[type=password] { width: 100%; padding: 13px 14px; font-size: 17px; border-radius: 8px;
    border: 1px solid ${error ? "#c0504d" : "#2c3b5c"}; background: #0c1220; color: #e8ecf4; outline: none; }
  input[type=password]:focus { border-color: #d9a441; }
  .err { display: ${error ? "block" : "none"}; font-family: system-ui, sans-serif; font-size: 13px;
    color: #e07a77; margin-top: 9px; }
  button { width: 100%; margin-top: 20px; padding: 13px; font-family: system-ui, sans-serif;
    font-size: 15px; font-weight: 600; letter-spacing: .03em; border: 0; border-radius: 8px;
    background: #d9a441; color: #17120a; cursor: pointer; }
  button:hover { background: #e6b657; }
  .foot { margin-top: 26px; font-family: system-ui, sans-serif; font-size: 12px; color: #5c6a87;
    text-align: center; }
</style>
</head>
<body>
<main class="card">
  <div class="kicker">Private preview</div>
  <h1>Ground Truth LaPorte</h1>
  <p>This site is not yet public. Enter the preview password to continue.</p>
  <form method="POST" action="/site-gate">
    <input type="hidden" name="next" value="${nextPath.replace(/"/g, "&quot;")}" />
    <label for="pw">Password</label>
    <input id="pw" type="password" name="password" autocomplete="current-password" autofocus required />
    <div class="err">That password isn&rsquo;t right. Try again.</div>
    <button type="submit">Enter site</button>
  </form>
  <div class="foot">What was promised. What actually arrived.</div>
</main>
</body>
</html>`;
    const safeNext = (v: unknown) =>
      typeof v === "string" && v.startsWith("/") && !v.startsWith("//") ? v : "/";
    app.use((req, res, next) => {
      if (req.path === "/health" || req.path === "/api/health") return next();
      if (req.method === "POST" && req.path === "/site-gate") {
        const supplied = Buffer.from(String((req.body as any)?.password ?? ""));
        const dest = safeNext((req.body as any)?.next);
        if (supplied.length === expected.length && timingSafeEqual(supplied, expected)) {
          res.setHeader(
            "Set-Cookie",
            `site_gate=${gateToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
          );
          return res.redirect(303, dest);
        }
        return res.status(401).type("html").send(gatePage(true, dest));
      }
      const m = /(?:^|;\s*)site_gate=([a-f0-9]+)/.exec(req.headers.cookie || "");
      if (m && m[1].length === gateToken.length && timingSafeEqual(Buffer.from(m[1]), Buffer.from(gateToken))) {
        return next();
      }
      res.status(401).type("html").send(gatePage(false, req.originalUrl || "/"));
    });
  }
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // Google Maps script proxy — forwards to the Forge maps proxy with the
  // project's registered origin so the browser's localhost origin doesn't
  // cause a 401 in development.
  app.get("/api/maps-proxy/*", async (req, res) => {
    try {
      const forgeBase = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
      const upstream = `${forgeBase}/v1/maps/proxy${req.path.replace("/api/maps-proxy", "")}${req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""}`;
      // Always present the project's registered public origin to Forge.
      // The Forge maps proxy validates the Origin against the project's
      // registered domain; localhost/127.0.0.1 origins are rejected.
      const fwdHost = req.headers["x-forwarded-host"];
      const host = (typeof fwdHost === "string" ? fwdHost : req.headers.host) || "";
      const origin = host.includes("manus.computer") || host.includes("manus.space")
        ? `https://${host}`
        : "https://3000-ib1xmvjy5d091v5q02ont-d8c5284e.us2.manus.computer";
      const resp = await fetch(upstream, {
        headers: {
          Origin: origin,
          Referer: origin + "/",
        },
      });
      const body = await resp.text();
      res.status(resp.status).set("Content-Type", resp.headers.get("content-type") || "application/javascript").send(body);
    } catch (e) {
      console.error("[MapsProxy]", e);
      res.status(502).send("// maps proxy error");
    }
  });
  // RSS feed for corrections
  app.get("/api/rss/corrections", (_req, res) => {
    const base = "https://laportetrth-kqhkb69n.manus.space";
    const items = [
      { id: "mw-2400", date: "2026-08-27", cat: "Electricity", wrong: "2,400 MW — Microsoft's LaPorte site", right: "No confirmed figure exists in any public record", src: "IURC Cause 46362 — full order text", status: "corrected" },
      { id: "mw-538", date: "2026-08-27", cat: "Electricity", wrong: "538 MW — Microsoft LaPorte", right: "No confirmed figure exists in any public record", src: "Aggregator survey — no primary source found", status: "unverifiable" },
      { id: "water-1-8b", date: "2026-08-27", cat: "Water", wrong: "1.8 billion gallons per year", right: "~1,000 gallons per day per building (reported, not confirmed)", src: "City water superintendent, reported at public meeting", status: "disputed" },
      { id: "jobs-200", date: "2026-08-27", cat: "Jobs", wrong: "200 permanent jobs (2024 announcement)", right: "600+ permanent jobs (June 2026 groundbreaking)", src: "Microsoft Local blog, June 18, 2026", status: "corrected" },
      { id: "tax-100m", date: "2026-08-27", cat: "Taxes", wrong: "$100M tax abatement still in effect", right: "Abatement rescinded March 3, 2026 — Microsoft pays full property taxes", src: "City of La Porte, March 3, 2026 agreement", status: "corrected" },
      { id: "water-restaurant", date: "2026-08-29", cat: "Water", wrong: "Water usage comparable to a single restaurant", right: "No LaPorte-specific water withdrawal figure exists in the public record", src: "No permitted withdrawal or cooling design basis published", status: "unverifiable" },
    ];
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ground Truth LaPorte — Corrections</title>
    <link>${base}/corrections</link>
    <description>Every figure corrected by Ground Truth LaPorte, with the receipt that proves it.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/api/rss/corrections" rel="self" type="application/rss+xml"/>
${items.map((i) => `    <item>
      <title>${esc(`[${i.status.toUpperCase()}] ${i.wrong}`)}</title>
      <link>${base}/corrections#${i.id}</link>
      <guid isPermaLink="true">${base}/corrections#${i.id}</guid>
      <pubDate>${new Date(i.date + "T12:00:00Z").toUTCString()}</pubDate>
      <category>${esc(i.cat)}</category>
      <description>${esc(`What circulated: ${i.wrong}. What the record shows: ${i.right}. Source: ${i.src}.`)}</description>
    </item>`).join("\n")}
  </channel>
</rss>`;
    res.set("Content-Type", "application/rss+xml; charset=utf-8").send(rss);
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
