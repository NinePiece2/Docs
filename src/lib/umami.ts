"use client";

type UmamiEventData = Record<string, unknown>;

function isBrowser() {
  return typeof window !== "undefined";
}

export function trackEvent(event: string, data?: UmamiEventData): void {
  if (!isBrowser()) return;

  // Script not loaded yet? Just skip.
  if (!window.umami || typeof window.umami.track !== "function") return;

  window.umami.track(event, data);
}
