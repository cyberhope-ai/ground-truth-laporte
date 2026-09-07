// Email/password citizen accounts, stored in THIS site's own database.
// Passwords are scrypt-hashed (Node stdlib — no new deps). On success we mint the
// app's own session cookie (same one the OAuth path uses), so the rest of the app's
// auth works unchanged. Social login (Google/MS/FB) is handled in oauth.ts.
import type { Express, Request, Response } from "express";
import crypto from "node:crypto";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

const scrypt = (password: string, salt: string) =>
  new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, dk) =>
      err ? reject(err) : resolve(dk.toString("hex")),
    );
  });

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const dk = await scrypt(password, salt);
  return `scrypt$${salt}$${dk}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const dk = await scrypt(password, parts[1]);
  const a = Buffer.from(dk, "hex");
  const b = Buffer.from(parts[2], "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const validEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

export function registerLocalAuth(app: Express) {
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const name = String(req.body?.name || "").trim();
    if (!validEmail(email)) {
      res.status(400).json({ error: "Enter a valid email address." });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters." });
      return;
    }
    try {
      const hash = await hashPassword(password);
      const openId = await db.createPasswordUser({ email, name, passwordHash: hash });
      if (!openId) {
        res.status(409).json({ error: "An account with that email already exists — try signing in." });
        return;
      }
      const token = await sdk.createSessionToken(openId, {
        name: name || email,
        expiresInMs: ONE_YEAR_MS,
      });
      res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(req), maxAge: ONE_YEAR_MS });
      res.json({ ok: true, email });
    } catch (e) {
      console.error("[localAuth] signup failed", e);
      res.status(500).json({ error: "Could not create the account. Please try again." });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!validEmail(email) || !password) {
      res.status(400).json({ error: "Enter your email and password." });
      return;
    }
    try {
      const user = await db.getUserByEmail(email);
      if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
        res.status(401).json({ error: "Email or password is incorrect." });
        return;
      }
      await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
      const token = await sdk.createSessionToken(user.openId, {
        name: user.name || email,
        expiresInMs: ONE_YEAR_MS,
      });
      res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(req), maxAge: ONE_YEAR_MS });
      res.json({ ok: true, email });
    } catch (e) {
      console.error("[localAuth] login failed", e);
      res.status(500).json({ error: "Sign-in failed. Please try again." });
    }
  });
}
