export const SITE_URL = "https://barberiaos.com";

export function getConfiguredSiteUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? SITE_URL).replace(/\/$/, "");
}
