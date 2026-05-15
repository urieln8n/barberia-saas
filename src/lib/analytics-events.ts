import { CONVERSION_EVENTS } from "@/src/lib/site-config";

export type ConversionEventName = (typeof CONVERSION_EVENTS)[keyof typeof CONVERSION_EVENTS];

type ConversionPayload = {
  location?: string;
  plan?: string;
  source?: string;
};

declare global {
  interface Window {
    gtag?: (event: "event", name: string, payload?: Record<string, string>) => void;
    dataLayer?: unknown[];
  }
}

export function trackConversionEvent(name: ConversionEventName, payload: ConversionPayload = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("barberiaos:conversion", {
      detail: { name, ...payload },
    })
  );

  window.gtag?.("event", name, {
    event_category: "conversion",
    ...payload,
  });
}
