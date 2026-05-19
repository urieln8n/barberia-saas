"use client";

import { trackMarketplaceEvent } from "@/app/r/[slug]/track-action";

type EventType = "booking_click" | "directions_click" | "whatsapp_click";

export function TrackedMarketplaceLink({
  barbershopId,
  eventType,
  city,
  href,
  className,
  target,
  rel,
  children,
}: {
  barbershopId: string;
  eventType: EventType;
  city: string | null;
  href: string;
  className?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={() => {
        trackMarketplaceEvent(barbershopId, eventType, "marketplace_profile", city);
      }}
    >
      {children}
    </a>
  );
}
