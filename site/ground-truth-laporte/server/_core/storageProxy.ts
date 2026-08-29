import type { Express } from "express";
import { ENV } from "./env";
import fs from "node:fs";
import path from "node:path";

export function registerStorageProxy(app: Express) {
  const localRoot = path.join(import.meta.dirname, "public", "manus-storage");
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    // Self-host: serve a locally-bundled asset (dist/public/manus-storage/<key>)
    // when present, so images work without the Manus Forge storage backend.
    // The prefix guard blocks path traversal via "../" in the key.
    try {
      const localPath = path.join(localRoot, key);
      if (localPath.startsWith(localRoot + path.sep) && fs.existsSync(localPath)) {
        // Manus stores images by opaque key, so a ".jpg" name may actually hold
        // WebP or an SVG placeholder. Sniff magic bytes and set the true type,
        // otherwise the browser gets e.g. SVG-bytes labeled image/jpeg and won't render.
        const buf = Buffer.alloc(64);
        const fd = fs.openSync(localPath, "r");
        const n = fs.readSync(fd, buf, 0, 64, 0);
        fs.closeSync(fd);
        let ct: string | null = null;
        if (buf.slice(0, 4).toString("latin1") === "RIFF" && buf.slice(8, 12).toString("latin1") === "WEBP") ct = "image/webp";
        else if (buf[0] === 0x89 && buf[1] === 0x50) ct = "image/png";
        else if (buf[0] === 0xff && buf[1] === 0xd8) ct = "image/jpeg";
        else if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) ct = "image/gif";
        else {
          const h = buf.slice(0, n).toString("utf8").trimStart().toLowerCase();
          if (h.startsWith("<svg") || h.startsWith("<?xml")) ct = "image/svg+xml";
        }
        if (ct) res.type(ct);
        res.set("Cache-Control", "public, max-age=86400");
        res.sendFile(localPath);
        return;
      }
    } catch {
      // fall through to the Forge proxy below
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
