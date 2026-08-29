import { COOKIE_NAME, ONE_YEAR_MS, OAUTH_STATE_COOKIE, decodeOAuthState } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

// The shared "One CyberHope login": the GenieMade broker (geniemadeit.com) handles
// Google/Microsoft/Facebook and returns a session token to /oauth-return#gmtoken=...
// The client POSTs that token here; we verify it with the broker (no shared secret —
// the broker just tells us the email), then upsert the user and mint OUR OWN session
// so the rest of the app's auth (protectedProcedure) works unchanged.
const GENIE_VERIFY_URL = "https://geniemadeit.com/api/auth/verify-token";

export function registerOAuthRoutes(app: Express) {
  app.post("/api/auth/genie", async (req: Request, res: Response) => {
    const token =
      req.body && typeof req.body.token === "string" ? req.body.token : "";
    if (!token) {
      res.status(400).json({ error: "token required" });
      return;
    }
    try {
      const vr = await fetch(GENIE_VERIFY_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = (await vr.json()) as {
        ok?: boolean;
        email?: string;
        uid?: string | null;
      };
      if (!d.ok || !d.email) {
        res.status(401).json({ error: "sign-in not recognized" });
        return;
      }
      const email = String(d.email).toLowerCase();
      const openId = `genie:${d.uid || email}`;
      const name = email.split("@")[0] || email;

      await db.upsertUser({
        openId,
        name,
        email,
        loginMethod: "genie",
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(openId, {
        name,
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });
      res.json({ ok: true, email });
    } catch (error) {
      console.error("[genie-auth] verify failed", error);
      res.status(500).json({ error: "sign-in failed" });
    }
  });

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    // CSRF guard: the nonce in `state` must match the one-time cookie that
    // startLogin set in the browser that began this login. An attacker can
    // forge `state`, but cannot plant this cookie in the victim's browser.
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
