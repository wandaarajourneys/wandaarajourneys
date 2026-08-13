"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CurrencyCode } from "@/types";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  toggleCurrency: () => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "wandaara:currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("KES");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "KES" || stored === "USD") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads client-only storage after mount to avoid SSR/hydration mismatch
      setCurrencyState(stored);
    }
  }, []);

  function setCurrency(next: CurrencyCode) {
    setCurrencyState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  function toggleCurrency() {
    setCurrency(currency === "KES" ? "USD" : "KES");
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
