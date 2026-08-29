import { useEffect, useState } from "react";

// Landing page for the GenieMade OAuth broker. It returns the session in the URL
// fragment (#gmtoken=…) so the token never hits any server log. We read it, strip
// it from the address bar, hand it to our backend to verify + mint our own session,
// then bounce home.
export default function OAuthReturn() {
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    const match = window.location.hash.match(/gmtoken=([^&]+)/);
    const token = match ? decodeURIComponent(match[1]) : "";
    // Drop the token from the URL bar immediately.
    history.replaceState(null, "", window.location.pathname);

    if (!token) {
      setMessage("Sign-in failed — no token returned. Please try again.");
      return;
    }

    fetch("/api/auth/genie", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.ok) {
          window.location.href = "/";
        } else {
          setMessage((d && d.error) || "Sign-in was not recognized.");
        }
      })
      .catch(() => setMessage("Sign-in failed. Please try again."));
  }, []);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        color: "#334",
        fontSize: "15px",
      }}
    >
      {message}
    </div>
  );
}
