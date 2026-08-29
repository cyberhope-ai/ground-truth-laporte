# Deployment Guide — Ground Truth LaPorte

This document describes how to reproduce the deployment of the Ground Truth LaPorte community resource site.

---

## Hosting

The site is hosted on **Manus WebDev** (autoscale/serverless). The production URL is:

```
https://laportetrth-kqhkb69n.manus.space
```

To deploy your own instance, you need a Manus account with a webdev project configured for full-stack (db, server, user).

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 22.x | LTS recommended |
| pnpm | 10.x | Package manager |
| MySQL/TiDB | 8.0+ | Database (TiDB Cloud Serverless recommended) |
| S3-compatible storage | — | For evidence file uploads |
| Manus OAuth app | — | For contributor authentication |
| Google Maps API key | — | For the interactive project map |

---

## Environment Variables

All environment variables are injected by the Manus platform. Do not commit `.env` files.

### Core (auto-injected)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | MySQL/TiDB connection string |
| `JWT_SECRET` | Session cookie signing secret |
| `VITE_APP_ID` | Manus OAuth application ID |
| `OAUTH_SERVER_URL` | Manus OAuth backend base URL |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal URL (frontend) |
| `OWNER_OPEN_ID` | Owner's Manus Open ID (auto-admin) |
| `OWNER_NAME` | Owner's display name |

### Forge API (auto-injected)

| Variable | Purpose |
|----------|---------|
| `BUILT_IN_FORGE_API_URL` | Manus built-in APIs base URL (LLM, storage, maps, notifications) |
| `BUILT_IN_FORGE_API_KEY` | Bearer token for server-side Forge API calls |
| `VITE_FRONTEND_FORGE_API_KEY` | Bearer token for frontend Forge API calls |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend Forge API base URL |

### Analytics (auto-injected)

| Variable | Purpose |
|----------|---------|
| `VITE_ANALYTICS_ENDPOINT` | Umami analytics endpoint |
| `VITE_ANALYTICS_WEBSITE_ID` | Umami website ID |

### Branding (auto-injected)

| Variable | Purpose |
|----------|---------|
| `VITE_APP_TITLE` | Site title |
| `VITE_APP_LOGO` | Site logo URL |

---

## Database Setup

1. Create a TiDB Cloud Serverless cluster (or any MySQL 8.0+ database).
2. Set `DATABASE_URL` to the connection string.
3. Generate the migration:
   ```bash
   pnpm drizzle-kit generate
   ```
4. Apply the migration SQL via the Manus `webdev_execute_sql` tool or directly:
   ```bash
   mysql -h <host> -u <user> -p < database.sql
   ```
5. Seed the meetings data:
   ```bash
   node --experimental-strip-types server/seed-meetings.mjs
   node --experimental-strip-types server/seed-meetings-v2.mjs
   node --experimental-strip-types server/seed-meetings-v3.mjs
   node --experimental-strip-types server/seed-meetings-v4.mjs
   ```

### Tables

| Table | Purpose |
|-------|---------|
| `users` | Contributor accounts (Manus OAuth) |
| `submissions` | Evidence submissions (quarantine-by-default) |
| `meetings` | Civic meeting records |
| `meeting_commitments` | Extracted commitments from meetings |

---

## Build & Run

```bash
# Install dependencies
pnpm install

# Development server (port 3000)
pnpm dev

# Production build
pnpm build

# Production start
pnpm start

# Type check
pnpm check

# Tests
pnpm test
```

---

## Architecture

```
client/                 React 19 + Tailwind CSS 4 + wouter
  src/
    pages/              10 page components
    components/         Layout, Map, Thermometer, Section, UI primitives
    lib/                data.ts (canonical data), trpc.ts (client)
server/
  _core/                Framework plumbing (OAuth, context, Vite bridge)
  routers.ts            tRPC procedures (auth, submissions, meetings, ask)
  db.ts                 Query helpers
  storage.ts            S3 upload helpers
  seed-meetings*.mjs    Database seed scripts
drizzle/
  schema.ts             Database schema (4 tables)
shared/
  const.ts              Shared constants
```

---

## Key Integrations

| Service | How it's used |
|---------|---------------|
| **Google Maps** | Interactive project map on the home page with toggleable layers (water, power, environmental). Proxied through `/api/maps-proxy/` to handle origin validation. |
| **Manus OAuth** | Contributor sign-in for evidence submission. Session cookie-based. |
| **S3** | Evidence file uploads. Files are SHA-256 fingerprinted at intake and stored with presigned URLs. |
| **Forge LLM** | Meeting transcript summaries and free-form Ask queries. Grounded in the sealed corpus. |
| **Umami** | Privacy-respecting analytics. |

---

## Security Notes

- All evidence submissions are quarantined by default — nothing publishes without admin review.
- File uploads are limited to 8MB and fingerprinted with SHA-256 at intake.
- Admin routes are gated by `ctx.user.role === "admin"`.
- The maps proxy always presents the project's registered public origin to the Forge API.
- No `.env` files are committed; all secrets are injected by the platform.

---

## License

Community resource. Content is public domain; code is MIT.
