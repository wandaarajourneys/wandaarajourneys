import type { CurrencyCode } from "@/types";

export const USD_TO_KES_RATE = 129;

export function formatCurrency(amountKES: number, currency: CurrencyCode): string {
  if (currency === "USD") {
    const usd = amountKES / USD_TO_KES_RATE;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(usd);
  }

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amountKES);
}

export function convert(amountKES: number, currency: CurrencyCode): number {
  return currency === "USD" ? Math.round(amountKES / USD_TO_KES_RATE) : amountKES;
}
