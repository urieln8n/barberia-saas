/** @type {import('next').NextConfig} */

// Content-Security-Policy en modo REPORT-ONLY (no bloquea nada todavía).
// Inventario de recursos externos reales usados por la app (verificado en código):
// - Analytics: Google Tag Manager/Analytics (googletagmanager.com, google-analytics.com)
//   y Microsoft Clarity (clarity.ms) — cargados via next/script en
//   components/analytics/AnalyticsScripts.tsx con <script> inline (sin nonce),
//   por eso 'unsafe-inline' en script-src por ahora.
// - Mapas: MapLibre GL (NO Google Maps/Mapbox) con tiles raster de CartoDB
//   (*.basemaps.cartocdn.com) en components/marketplace/MarketplaceMap.tsx.
//   MapLibre GL JS usa Web Workers vía blob: internamente → worker-src 'self' blob:.
// - Imágenes: Supabase Storage (*.supabase.co/in), avatares de Google
//   (lh3.googleusercontent.com), QR codes (api.qrserver.com) — mismos hosts
//   que ya están en images.remotePatterns abajo.
// - Fuentes: Plus_Jakarta_Sans via next/font/google se autohospeda en build
//   (Next.js la descarga y sirve desde el propio origen) — no requiere
//   fonts.googleapis.com/fonts.gstatic.com en runtime.
// - Backend: Supabase (API REST + Realtime websockets) — connect-src necesita
//   los hosts de Supabase incluyendo wss:// para Realtime.
// - Pagos: Stripe Checkout es "hosted redirect" (stripe.checkout.sessions.create
//   con success_url/cancel_url) — el navegador navega fuera del sitio, no hay
//   iframe ni Stripe.js/Elements embebido en el código actual. Se añade
//   checkout.stripe.com a frame-src de forma preventiva (defensa en profundidad
//   si en el futuro se usa un iframe), sin que sea estrictamente necesario hoy.
// - n8n: el webhook de Instagram (app/api/webhooks/n8n/instagram-lead) es
//   server-to-server, nunca se llama desde el navegador — no necesita entrada en CSP.
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://lh3.googleusercontent.com https://api.qrserver.com https://*.basemaps.cartocdn.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://*.basemaps.cartocdn.com",
  "worker-src 'self' blob:",
  "frame-src 'self' https://checkout.stripe.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig = {
  images: {
    // AVIF primero (más ligero que WebP en la mayoría de fotos), WebP como
    // fallback. Next.js ya activa esto por defecto desde v13, se declara
    // explícito para garantizar el orden y que quede documentado.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control",    value: "on" },
          // Solo REPORTA violaciones (CSP-Report-Only), NO bloquea nada.
          // Revisar la consola del navegador / herramientas de monitoreo unos
          // días antes de decidir activar la versión bloqueante quitando
          // "-Report-Only" del nombre del header.
          { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/dashboard/barberias",
        destination: "/dashboard/marketplace",
        permanent: true,
      },
      {
        source: "/alternativa-booksy",
        destination: "/alternativa-a-booksy",
        permanent: true,
      },
      {
        source: "/alternativa-booksy-barberias",
        destination: "/alternativa-a-booksy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
