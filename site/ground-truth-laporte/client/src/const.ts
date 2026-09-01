export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Self-hosted email/password login only — no external identity provider or broker.
// A 401 broadcasts this event; Layout opens the AuthModal in response. Nothing here
// contacts any outside service.
export const startLogin = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("gt:open-auth"));
  }
};
