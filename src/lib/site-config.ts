import { SITE_URL } from "@/src/lib/site-url";

export const BUSINESS_CONFIG = {
  commercialName: "BarberíaOS",
  legalOwner: "BarberíaOS",
  legalContactName: "Equipo BarberíaOS",
  legalEmail: "hola@barberiaos.com",
  supportEmail: "soporte@barberiaos.com",
  privacyEmail: "privacidad@barberiaos.com",
  domain: "barberiaos.com",
  siteUrl: SITE_URL,
  lastUpdated: "15 de mayo de 2026",
  jurisdiction: "España",
  applicableLaw: "legislación española y normativa europea aplicable",
  contact: "hola@barberiaos.com",
  identificationFallback:
    "Información identificativa disponible bajo solicitud comercial hasta la formalización del contrato.",
  registeredAddress:
    "Información identificativa disponible bajo solicitud comercial hasta la formalización del contrato.",
  taxId:
    "Información identificativa disponible bajo solicitud comercial hasta la formalización del contrato.",
  cookieSettingsUrl: "/legal/cookies",
  whatsappUrl:
    "https://wa.me/34645466308?text=Hola%2C%20quiero%20ver%20una%20demo%20de%20Barber%C3%ADaOS",
  demoBookingUrl: "/r/demo-barber",
  demoUrl: "/demo",
  loginUrl: "/login",
} as const;

export const SEO_INTENT_PAGES = [
  {
    path: "/software-para-barberias",
    intent: "Software general para barberías",
    status: "publicada",
  },
  {
    path: "/reservas-online-barberia",
    intent: "Agenda online y reservas",
    status: "publicada",
  },
  {
    path: "/programa-reservas-barberia",
    intent: "Programa de reservas",
    status: "publicada",
  },
  {
    path: "/alternativa-booksy-barberias",
    intent: "Alternativa a marketplaces con comisión",
    status: "redirigida",
  },
  {
    path: "/barberias",
    intent: "Directorio de barberías",
    status: "publicada",
  },
  {
    path: "/caja-para-barberias",
    intent: "Caja y cierre diario para barberías",
    status: "publicada",
  },
  {
    path: "/software-barberias-sin-comision",
    intent: "Software para barberías sin comisión por reserva",
    status: "publicada",
  },
  {
    path: "/software-barberias-barcelona",
    intent: "Software para barberías en Barcelona",
    status: "noindex-temporal",
  },
  {
    path: "/agenda-online-barberia",
    intent: "Agenda online y reservas",
    status: "publicada",
  },
  {
    path: "/qr-reservas-barberias",
    intent: "QR de reservas para barberías",
    status: "publicada",
  },
  {
    path: "/huecos-libres-barberia",
    intent: "Huecos libres y cancelaciones en barbería",
    status: "publicada",
  },
  {
    path: "/programa-fidelizacion-barberias",
    intent: "Fidelización y retención de clientes en barberías",
    status: "publicada",
  },
  {
    path: "/marketing-para-barberias",
    intent: "Marketing digital para barberías",
    status: "publicada",
  },
  {
    path: "/software-barberias-madrid",
    intent: "Software para barberías en Madrid",
    status: "publicada",
  },
  {
    path: "/software-barberias-sevilla",
    intent: "Software para barberías en Sevilla",
    status: "publicada",
  },
  {
    path: "/software-barberias-valencia",
    intent: "Software para barberías en Valencia",
    status: "publicada",
  },
  {
    path: "/software-inventario-barberia",
    intent: "Productos, stock y venta en mostrador",
    status: "recomendada",
  },
  {
    path: "/crm-clientes-barberia",
    intent: "Clientes, historial y recuperación",
    status: "publicada",
  },
  {
    path: "/whatsapp-barberias",
    intent: "Reservas y mensajes por WhatsApp",
    status: "publicada",
  },
  {
    path: "/marketing-barberias",
    intent: "Marketing y campañas para barberías",
    status: "recomendada",
  },
] as const;

export const CONVERSION_EVENTS = {
  viewDemo: "view_demo",
  openPublicBookingDemo: "open_public_booking_demo",
  openWhatsappDemo: "open_whatsapp_demo",
  startTrial: "start_trial",
  loginClick: "login_click",
} as const;
