"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "wandaara:cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads client-only storage after mount to avoid SSR/hydration mismatch
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    window.localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 border-t border-teal-700/10 bg-teal-800 text-sand-100"
    >
      <div className="container-page flex flex-col sm:flex-row items-start sm:items-center gap-4 py-5">
        <Cookie className="text-terracotta-400 shrink-0" size={24} aria-hidden="true" />
        <p className="text-sm text-sand-100/80 flex-1">
          We use cookies to improve your experience and understand how visitors use our site. Read our{" "}
          <a href="/privacy" className="underline hover:text-terracotta-400">
            Privacy Policy
          </a>{" "}
          to learn more.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-sand-100 hover:border-white/40 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-terracotta-500 px-5 py-2 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
