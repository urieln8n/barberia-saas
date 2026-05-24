"use client";

import { useEffect } from "react";

type Props = {
  slug: string;
};

/**
 * Invisible client component that fires a qr_scan tracking event once per
 * browser session per lounge slug. Uses sessionStorage to deduplicate.
 * Prefers navigator.sendBeacon for non-blocking delivery; falls back to fetch.
 * Swallows all errors — never affects the user experience.
 */
export function LoungeScanTracker({ slug }: Props) {
  useEffect(() => {
    if (!slug) return;

    const key = `lounge_scanned_${slug}`;

    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      // sessionStorage unavailable (e.g. private mode restriction) — skip dedup
    }

    const payload = JSON.stringify({ slug, type: "qr_scan", payload: {} });
    const url = "/api/lounge/track";

    try {
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        }).catch(() => {});
      }
    } catch {
      // Never throw
    }

    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // Ignore storage errors
    }
  }, [slug]);

  return null;
}
