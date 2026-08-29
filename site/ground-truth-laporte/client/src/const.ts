export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// "One CyberHope login" — delegate sign-in to the shared GenieMade OAuth broker
// (the same one SkillDNA / EverVerify use). The broker owns the Google / Microsoft
// / Facebook clients; we just send the user there with a return_to, and it redirects
// back to `/oauth-return#gmtoken=<token>`, which the OAuthReturn page exchanges for a
// session via POST /api/auth/genie. No provider secrets live in this app.
const GENIE_BROKER = "https://geniemadeit.com";

export const startLogin = (provider: "google" | "ms" | "facebook" = "google") => {
  const returnTo = `${window.location.origin}/oauth-return`;
  window.location.href =
    `${GENIE_BROKER}/api/auth/${provider}/start?return_to=${encodeURIComponent(returnTo)}`;
};
