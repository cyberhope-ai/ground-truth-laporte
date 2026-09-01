# Self-Hosted Auth — Ground Truth LaPorte

LaPorte uses **self-hosted email/password accounts** — no external identity provider
or broker. It runs on Azure Container Apps. **Nothing contacts Manus or GenieMade.**

## What changed (de-Manus, 2026-09-01)
Removed the social-login broker path that routed through `geniemadeit.com` (and the
Manus OAuth remnants):
- **`server/_core/oauth.ts`** (the `/api/auth/genie` handler that verified tokens at
  `geniemadeit.com` + the Manus `/api/oauth/callback`) — **deleted** and no longer
  registered in `index.ts`.
- **`client/src/pages/OAuthReturn.tsx`** + the `/oauth-return` route — **deleted**.
- **`AuthModal.tsx`** — removed the "Continue with Google/Microsoft/Facebook" buttons;
  it is now email/password only.
- **`const.ts`** — `startLogin()` no longer redirects to the GenieMade broker; it
  dispatches a `gt:open-auth` event that Layout uses to open the login modal.
- **`vite.config.ts`** — removed `vite-plugin-manus-runtime`, which injected a Manus
  dev-runtime `<script>` (referencing `manus.space`) into `index.html`.
- Stale `laportetrth-kqhkb69n.manus.space` self-URLs (share buttons, RSS, OG tags)
  swapped to the site's Azure domain.

## How auth works now
- `POST /api/auth/signup` and `POST /api/auth/login` (`server/_core/localAuth.ts`) —
  email/password accounts, **scrypt-hashed** (Node stdlib) in this site's own MySQL.
  On success they mint the app's own session JWT (cookie `app_session_id`, signed with
  `JWT_SECRET`). The `AuthModal` (opened from the Sign In button) is the only login UI.
- The admin panel (`/admin`) uses the same session; admin role is granted per the site's
  existing model.

## Config (Azure Container App `laporte-truth`, RG `public-sites-rg`)
Env/secrets: `DATABASE_URL`, `JWT_SECRET`, `AZURE_OPENAI_*` (chat uses Azure OpenAI, not
Manus Forge). No `BUILT_IN_FORGE_*` credentials are set, so the dormant Forge scaffold
code (storage/maps/llm-fallback) makes **no** runtime calls to Manus.

## Known remaining scaffold references (dormant, non-runtime)
Some `server/_core/*` scaffold files still contain Manus/Forge code paths and comments
(maps proxy, storage proxy, image-gen, notifications). They are inert without
`BUILT_IN_FORGE_API_URL`/`_KEY` (not set). Fully deleting them — and giving the maps
feature its own Google Maps key — is a separate cleanup.
