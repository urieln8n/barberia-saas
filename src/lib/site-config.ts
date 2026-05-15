import { SITE_URL } from "@/src/lib/site-url";

export const BUSINESS_CONFIG = {
  commercialName: "BarberíaOS",
  legalOwner: "BarberíaOS",
  legalContactName: "Equipo BarberíaOS",
  legalEmail: "hola_barberiaos@hotmail.com",
  supportEmail: "hola_barberiaos@hotmail.com",
  privacyEmail: "hola_barberiaos@hotmail.com",
  domain: "barberiaos.com",
  siteUrl: SITE_URL,
  lastUpdated: "15 de mayo de 2026",
  jurisdiction: "España",
  applicableLaw: "legislación española y normativa europea aplicable",
  contact: "hola_barberiaos@hotmail.com",
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
    status: "publicada",
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
    status: "publicada",
  },
  {
    path: "/agenda-online-barberia",
    intent: "Agenda online y reservas",
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
    status: "recomendada",
  },
  {
    path: "/whatsapp-barberias",
    intent: "Reservas y mensajes por WhatsApp",
    status: "recomendada",
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
