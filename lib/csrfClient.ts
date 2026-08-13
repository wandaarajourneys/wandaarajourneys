"use client";

const CSRF_COOKIE = "wandaara_admin_csrf";

export function getCsrfToken(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

export function adminFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("x-csrf-token", getCsrfToken());
  return fetch(input, { ...init, headers, credentials: "same-origin" });
}

// For multipart/form-data uploads — do not set Content-Type manually, the
// browser needs to add the multipart boundary itself.
export function adminUploadFetch(input: string, formData: FormData) {
  const headers = new Headers();
  headers.set("x-csrf-token", getCsrfToken());
  return fetch(input, { method: "POST", body: formData, headers, credentials: "same-origin" });
}
