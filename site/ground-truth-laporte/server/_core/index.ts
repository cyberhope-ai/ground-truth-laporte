import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerLocalAuth } from "./localAuth";
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
  registerStorageProxy(app);
  registerLocalAuth(app);
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
    const base = "https://laporte-truth.icystone-d1e018c9.centralus.azurecontainerapps.io";
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
