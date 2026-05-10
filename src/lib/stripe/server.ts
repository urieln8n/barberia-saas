import Stripe from "stripe";
import { getConfiguredAppUrl } from "@/src/lib/site-url";

let stripe: Stripe | null = null;

export function getStripe() {
  if (stripe) return stripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  stripe = new Stripe(secretKey);
  return stripe;
}

export function getAppUrl() {
  return getConfiguredAppUrl();
}
