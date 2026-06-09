// Studio IA — Campaign types, UI constants, and fallback templates.
// OpenAI generation logic lives in app/dashboard/studio/actions.ts (server-only).

// ─── Types ───────────────────────────────────────────────────────────────────

export type CampaignType =
  | "llenar_agenda"
  | "oferta_flash"
  | "transformacion"
  | "recuperar_cliente"
  | "barbero_pro"
  | "nuevo_servicio"
  | "prueba_social"
  | "urgencia_reserva";

export type ContentPlatform = "instagram_reel" | "tiktok" | "whatsapp" | "facebook";

export type ContentStyle =
  | "premium_morado"
  | "lujo_dorado"
  | "urbano_moderno"
  | "minimalista_limpio"
  | "barberia_clasica";

export type AdCampaignInput = {
  campaign: CampaignType;
  platform: ContentPlatform;
  style: ContentStyle;
  barbershopName: string;
  barberName?: string;
  offerDetail?: string;
  urgencyMessage?: string;
};

export type AdCampaignOutput = {
  campaign: CampaignType;
  platform: ContentPlatform;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  onScreenText: string;
  visualIdea: string;
  bestPostingTime: string;
  creditsUsed: number;
};

// ─── Campaign definitions ─────────────────────────────────────────────────────

export type CampaignDef = {
  type: CampaignType;
  label: string;
  goalLine: string;
  icon: string;
  badge?: string;
};

export const CAMPAIGNS: CampaignDef[] = [
  { type: "llenar_agenda",     label: "Llenar agenda",      goalLine: "Convierte huecos vacíos en reservas reales",      icon: "📅", badge: "Más usado"   },
  { type: "oferta_flash",      label: "Oferta flash",       goalLine: "Precio especial que urgencia a reservar",         icon: "⚡"                       },
  { type: "transformacion",    label: "Antes / Después",    goalLine: "Resultado real que demuestra tu nivel",           icon: "✨", badge: "Alto impacto" },
  { type: "recuperar_cliente", label: "Recuperar clientes", goalLine: "Reactiva clientes que llevan semanas sin venir",  icon: "💌"                       },
  { type: "barbero_pro",       label: "Mi barbero",         goalLine: "Humaniza la marca y genera confianza",            icon: "💈"                       },
  { type: "nuevo_servicio",    label: "Nuevo servicio",     goalLine: "Lanza algo nuevo y crea expectativa",             icon: "🚀"                       },
  { type: "prueba_social",     label: "Reseña real",        goalLine: "Convierte una opinión positiva en reservas",      icon: "⭐"                       },
  { type: "urgencia_reserva",  label: "Últimas plazas",     goalLine: "FOMO real cuando quedan pocos huecos",            icon: "⏰", badge: "Urgente"     },
];

// ─── Platform definitions ─────────────────────────────────────────────────────

export type PlatformDef = {
  id: ContentPlatform;
  label: string;
  subline: string;
};

export const PLATFORMS: PlatformDef[] = [
  { id: "instagram_reel", label: "Instagram", subline: "Reels · 9:16"  },
  { id: "tiktok",         label: "TikTok",    subline: "Vídeo · 9:16"  },
  { id: "whatsapp",       label: "WhatsApp",  subline: "Status · 15s"  },
  { id: "facebook",       label: "Facebook",  subline: "Feed y Stories" },
];

// ─── Style definitions ────────────────────────────────────────────────────────

export type StyleDef = {
  id: ContentStyle;
  label: string;
  description: string;
  color: string;
};

export const STYLES: StyleDef[] = [
  { id: "premium_morado",     label: "Premium",     description: "Elegante y diferenciado", color: "#6D28D9" },
  { id: "lujo_dorado",        label: "Lujo dorado", description: "Ultra premium",           color: "#C9A227" },
  { id: "urbano_moderno",     label: "Urbano",      description: "Dinámico y joven",        color: "#1F2937" },
  { id: "minimalista_limpio", label: "Minimalista", description: "Limpio y legible",        color: "#94A3B8" },
  { id: "barberia_clasica",   label: "Clásico",     description: "Tradición y calidez",     color: "#92400E" },
];

// ─── Offer placeholder per campaign ──────────────────────────────────────────

export const OFFER_PLACEHOLDER: Record<CampaignType, string> = {
  llenar_agenda:     'Servicio disponible (ej: "Corte + barba")',
  oferta_flash:      'Precio (ej: "Corte + barba 25€")',
  transformacion:    'Tipo de servicio (ej: "Fade con diseño")',
  recuperar_cliente: 'Incentivo (ej: "10% dto en primera cita")',
  barbero_pro:       'Especialidad (ej: "Expert en fades")',
  nuevo_servicio:    'Nombre del servicio (ej: "Arreglo de cejas")',
  prueba_social:     'Pega aquí la reseña positiva del cliente...',
  urgencia_reserva:  'Plazas restantes (ej: "Solo 2 plazas esta semana")',
};

// ─── Fallback templates (used when OpenAI is unavailable) ────────────────────

export function getFallbackCampaign(input: AdCampaignInput): AdCampaignOutput {
  const n  = input.barbershopName;
  const u  = input.urgencyMessage ?? "Los huecos vuelan.";
  const o  = input.offerDetail   ?? "";
  const b  = input.barberName    ?? "nuestro equipo";

  type Tpl = Omit<AdCampaignOutput, "campaign" | "platform" | "creditsUsed">;

  const T: Record<CampaignType, Tpl> = {
    llenar_agenda: {
      hook:            `¿Libre esta semana? ${n} tiene huecos ahora mismo.`,
      caption:         `📅 HUECOS DISPONIBLES — ${n}\n\n${u}\n\nReserva en segundos desde el link de la bio. Sin esperas, sin llamadas.\n\n📲 ¿A qué esperas?`,
      hashtags:        ["barberia", "reserva", "barbershop", "disponible", "cortedecabello", "cita", "hairstyle"],
      cta:             "Reserva en el link de la bio",
      onScreenText:    `📅 HUECOS LIBRES\n${n}\n📲 Reserva en 2 clics`,
      visualIdea:      "Silla vacía → barbero preparando herramientas → móvil con pantalla de reserva. Corte rápido y música energética.",
      bestPostingTime: "Lunes y martes 11:00–13:00 o miércoles 20:00–22:00",
    },
    oferta_flash: {
      hook:            `Solo hoy en ${n}${o ? ` — ${o}` : " — oferta que no se repite"}.`,
      caption:         `⚡ OFERTA FLASH — ${n}\n\n${o || "Precio especial por tiempo limitado."}\n\n⏰ ${u}\n\n📲 Reserva ya en el link de la bio.`,
      hashtags:        ["oferta", "barbershop", "barberia", "descuento", "flash", "reserva", "corte"],
      cta:             "Reserva antes de que expire — link en bio",
      onScreenText:    `⚡ OFERTA HOY\n${o || "Precio especial"}\n⏰ Solo hoy`,
      visualIdea:      "Precio tachado → precio nuevo con destellos → temporizador. Fondo oscuro con acento dorado.",
      bestPostingTime: "Jueves–viernes 18:00–21:00",
    },
    transformacion: {
      hook:            `Esto es lo que hacemos en ${n}. El resultado habla solo.`,
      caption:         `✨ TRANSFORMACIÓN REAL — ${n}\n\n${o || "Antes y después sin filtros."}\n\n¿Quieres el tuyo?\n📲 Reserva en el link de la bio.`,
      hashtags:        ["antesdespues", "beforeafter", "barbershop", "barberia", "transformacion", "haircut", "fade"],
      cta:             "¿El tuyo cuándo? Reserva en el link",
      onScreenText:    `ANTES → DESPUÉS\n${n}\n📲 Tu transformación`,
      visualIdea:      "Split screen izquierda/derecha con transición swipe reveal. Música épica de impacto.",
      bestPostingTime: "Sábado 10:00–12:00 o domingo tarde para inspirar la semana",
    },
    recuperar_cliente: {
      hook:            `Cuánto tiempo sin verte… ${n} te echa de menos.`,
      caption:         `💌 OYE, ¿TODO BIEN?\n\nEn ${n} llevamos tiempo sin verte. La silla te espera.\n\n${u}\n\n📲 Vuelve — link en bio.`,
      hashtags:        ["barbershop", "barberia", "vuelve", "teechamosdemenos", "corte", "fidelizacion"],
      cta:             "Vuelve esta semana — link en bio",
      onScreenText:    `💈 TE ECHAMOS DE MENOS\n${n}\n📲 Tu silla espera`,
      visualIdea:      "Silla vacía con luz cálida → barbero con gesto de bienvenida. Música nostálgica pero hopeful.",
      bestPostingTime: "Domingo 19:00–21:00 cuando la gente planifica la semana",
    },
    barbero_pro: {
      hook:            `Conoce a ${b}. Precisión, estilo y pasión por el oficio.`,
      caption:         `💈 EQUIPO ${n.toUpperCase()}\n\n${b} — no solo corta pelo, crea estilos.\n\n${o ? `Especialista en ${o}.\n\n` : ""}📲 Reserva con él — link en bio.`,
      hashtags:        ["barber", "barbershop", "barberia", "barbero", "team", "barberlife", "hairstyle"],
      cta:             `Reserva con ${b} — link en bio`,
      onScreenText:    `CONOCE A ${b.toUpperCase()}\n${n}\n📲 Reserva con él`,
      visualIdea:      "Perfil del barbero trabajando → primer plano de manos con herramientas → cliente satisfecho. Tono cálido y profesional.",
      bestPostingTime: "Miércoles–jueves 19:00–21:00 para reservas del fin de semana",
    },
    nuevo_servicio: {
      hook:            `Nuevo en ${n}${o ? `: ${o}` : " — algo que llevabas esperando"}.`,
      caption:         `🚀 NOVEDAD EN ${n.toUpperCase()}\n\n${o || "Nuevo servicio disponible."}\n\nSé de los primeros. Plazas limitadas.\n\n📲 Reserva en el link de la bio.`,
      hashtags:        ["nuevo", "novedad", "barbershop", "barberia", "launch", "hairstyle", "grooming"],
      cta:             "Sé de los primeros — reserva en el link",
      onScreenText:    `🚀 NUEVO\n${o || "Nuevo servicio"}\n${n}`,
      visualIdea:      "Reveal con destello → servicio en close-up → reacción del cliente. Música energética de lanzamiento.",
      bestPostingTime: "Lunes 08:00–10:00 para captar planificadores de semana",
    },
    prueba_social: {
      hook:            `Lo que dicen los clientes de ${n}. Sin filtros.`,
      caption:         `⭐⭐⭐⭐⭐ OPINIÓN REAL — ${n}\n\n"${o || "Increíble. No voy a ningún otro sitio."}" — Cliente verificado.\n\n📲 Reserva — link en bio.`,
      hashtags:        ["resena", "opinion", "5estrellas", "barbershop", "barberia", "recomendado", "clientefeliz"],
      cta:             "Lee más reseñas y reserva — link en bio",
      onScreenText:    `⭐ OPINIÓN REAL\n"${o || "El mejor de la zona"}"\n${n}`,
      visualIdea:      "Texto de reseña animado sobre fondo limpio → estrellas doradas → logo y CTA. Música suave y confiable.",
      bestPostingTime: "Viernes 17:00–19:00 cuando la gente decide planes para el fin de semana",
    },
    urgencia_reserva: {
      hook:            `${u || `Quedan pocas plazas en ${n} esta semana`}.`,
      caption:         `⏰ ÚLTIMAS PLAZAS — ${n}\n\n${u || "Se acaba la disponibilidad."}\n\nSi no reservas ahora, tendrás que esperar.\n\n📲 Reserva ya — link en bio.`,
      hashtags:        ["urgente", "ultimasplazas", "reserva", "barbershop", "barberia", "disponible"],
      cta:             "Reserva AHORA — antes de que no quede nada",
      onScreenText:    `⏰ ÚLTIMAS PLAZAS\n${n}\n📲 RESERVA YA`,
      visualIdea:      "Contador regresivo → calendario llenándose → últimos huecos en rojo. Música intensa y rápida.",
      bestPostingTime: "Jueves 12:00–14:00 o viernes 08:00–10:00 para urgencia real",
    },
  };

  return { ...T[input.campaign], campaign: input.campaign, platform: input.platform, creditsUsed: 1 };
}

// ─── Credit packs (used by /dashboard/studio/credits) ────────────────────────

export type CreditPack = {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  badge?: string;
};

export const CREDIT_PACKS: CreditPack[] = [
  { id: "pack_rapido",  name: "Pack Rápido",  credits: 5,   price: 9,  pricePerCredit: 1.80 },
  { id: "pack_growth",  name: "Pack Growth",  credits: 15,  price: 19, pricePerCredit: 1.27, badge: "Popular" },
  { id: "pack_studio",  name: "Pack Studio",  credits: 40,  price: 39, pricePerCredit: 0.98 },
  { id: "pack_pro",     name: "Pack Pro",     credits: 100, price: 79, pricePerCredit: 0.79, badge: "Mejor precio" },
];
