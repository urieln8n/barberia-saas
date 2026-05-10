const FALLBACK_SITE_URL = "https://barberiaos.com";

function normalizeUrl(url: string) {
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/$/, "");
}

export const SITE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    FALLBACK_SITE_URL
);

export function getConfiguredSiteUrl() {
  return SITE_URL;
}

export function getConfiguredAppUrl() {
  const vercelUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : null;

  return normalizeUrl(
    process.env.NEXT_PUBLIC_APP_URL ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      vercelUrl ??
      FALLBACK_SITE_URL
  );
}
