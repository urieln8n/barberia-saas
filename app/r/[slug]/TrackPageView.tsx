"use client";

import { useEffect } from "react";
import { trackMarketplaceEvent } from "./track-action";

export function TrackPageView({
  barbershopId,
  source,
  city,
}: {
  barbershopId: string;
  source: string | null;
  city: string | null;
}) {
  useEffect(() => {
    trackMarketplaceEvent(barbershopId, "profile_view", source, city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
