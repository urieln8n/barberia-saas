"use client";

import { useEffect } from "react";
import { trackMarketplaceEvent } from "@/app/r/[slug]/track-action";

export function TrackMarketplaceProfileView({
  barbershopId,
  city,
}: {
  barbershopId: string;
  city: string | null;
}) {
  useEffect(() => {
    trackMarketplaceEvent(barbershopId, "profile_view", "marketplace_profile", city);
  }, [barbershopId, city]);

  return null;
}
