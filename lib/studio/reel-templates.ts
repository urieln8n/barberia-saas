// Studio IA — Reel template definitions.
// Templates pre-configure hooks, CTAs, hashtags and clip effects.
// Studio IA uses these to guide users and fill the Shotstack timeline.

import type { ContentStyle } from "./generate-content";

export type ReelTemplate = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  recommendedDuration: 15 | 30 | 60;
  minAssets: number;
  maxAssets: number;
  assetType: "image" | "video" | "both";
  assetLabels: string[];          // label per upload slot in the wizard
  defaultStyle: ContentStyle;
  clipEffect: "zoomIn" | "zoomOut" | "slideLeft" | "slideRight";
  hookSuggestions: string[];      // {barbería} and {nombre} are interpolated at runtime
  ctaSuggestions: string[];
  defaultHashtags: string[];
};

export const REEL_TEMPLATES: ReelTemplate[] = [
  {
    slug:                "antes_despues",
    name:                "Antes / Después",
    description:         "Una transformación que para el scroll",
    icon:                "🔀",
    badge:               "Viral",
    recommendedDuration: 15,
    minAssets:           2,
    maxAssets:           2,
    assetType:           "image",
    assetLabels:         ["Foto ANTES", "Foto DESPUÉS"],
    defaultStyle:        "premium_morado",
    clipEffect:          "zoomIn",
    hookSuggestions:     [
      "¿Cómo me quedaría yo?",
      "Esto es lo que hacemos en {barbería}. Sin filtros.",
      "Antes vs Después. El nivel habla solo.",
    ],
    ctaSuggestions:      [
      "¿El tuyo cuándo? → link en bio",
      "Reserva tu transformación →",
      "Solo quedan plazas esta semana",
    ],
    defaultHashtags:     ["antesdespues", "barberia", "fade", "haircut", "transformacion", "barbershop"],
  },

  {
    slug:                "oferta_semanal",
    name:                "Oferta Semanal",
    description:         "Urgencia + precio = reservas esta semana",
    icon:                "⚡",
    recommendedDuration: 15,
    minAssets:           1,
    maxAssets:           3,
    assetType:           "image",
    assetLabels:         ["Foto principal", "Foto adicional (opcional)", "Foto adicional (opcional)"],
    defaultStyle:        "lujo_dorado",
    clipEffect:          "zoomOut",
    hookSuggestions:     [
      "Solo esta semana en {barbería}",
      "Oferta que no se repite. Esta semana.",
      "Precio que no verás igual",
    ],
    ctaSuggestions:      [
      "Reserva antes que se acabe → link en bio",
      "Solo X plazas disponibles",
      "Expira el domingo. Reserva ya →",
    ],
    defaultHashtags:     ["oferta", "barberia", "descuento", "reserva", "barbershop", "flash"],
  },

  {
    slug:                "hueco_urgente",
    name:                "Hueco Libre Urgente",
    description:         "Convierte huecos vacíos en reservas en minutos",
    icon:                "⏰",
    badge:               "Rápido",
    recommendedDuration: 15,
    minAssets:           1,
    maxAssets:           2,
    assetType:           "image",
    assetLabels:         ["Foto barbería o silla vacía", "Foto adicional (opcional)"],
    defaultStyle:        "premium_morado",
    clipEffect:          "slideLeft",
    hookSuggestions:     [
      "Libre AHORA mismo en {barbería}",
      "Silla vacía. ¿Es tuya?",
      "Cancelación de último minuto. Tu suerte.",
    ],
    ctaSuggestions:      [
      "DM para reservar YA →",
      "Link en bio — quedan X minutos",
      "Llama ahora · link en bio",
    ],
    defaultHashtags:     ["disponible", "barberia", "reserva", "huecolibre", "urgente", "ahora"],
  },

  {
    slug:                "resena_cliente",
    name:                "Reseña Cliente",
    description:         "Prueba social que convierte en reservas",
    icon:                "⭐",
    recommendedDuration: 30,
    minAssets:           1,
    maxAssets:           3,
    assetType:           "image",
    assetLabels:         ["Foto del resultado", "Foto adicional (opcional)", "Foto adicional (opcional)"],
    defaultStyle:        "minimalista_limpio",
    clipEffect:          "zoomIn",
    hookSuggestions:     [
      "Lo que dicen nuestros clientes en {barbería}",
      "5 estrellas. Siempre. Sin excepción.",
      "Opinión real, sin editar.",
    ],
    ctaSuggestions:      [
      "Lee más reseñas → link en bio",
      "Sé el próximo →",
      "Reserva y compruébalo tú mismo →",
    ],
    defaultHashtags:     ["resena", "5estrellas", "barberia", "recomendado", "clientefeliz", "opiniones"],
  },

  {
    slug:                "producto_destacado",
    name:                "Producto Destacado",
    description:         "Lanza un servicio o producto nuevo",
    icon:                "🚀",
    recommendedDuration: 30,
    minAssets:           2,
    maxAssets:           4,
    assetType:           "image",
    assetLabels:         ["Foto producto principal", "Foto detalle", "Foto adicional", "Foto adicional"],
    defaultStyle:        "lujo_dorado",
    clipEffect:          "slideRight",
    hookSuggestions:     [
      "Nuevo en {barbería}. Sé el primero.",
      "Esto acaba de llegar y ya vuela",
      "El servicio que llevabas pidiendo. Aquí.",
    ],
    ctaSuggestions:      [
      "Reserva tu cita → link en bio",
      "Plazas limitadas de lanzamiento →",
      "Pregúntanos en DM →",
    ],
    defaultHashtags:     ["nuevo", "barberia", "grooming", "novedad", "barbershop", "launch"],
  },

  {
    slug:                "reel_premium",
    name:                "Reel Premium Barbería",
    description:         "Muestra el nivel de tu barbería al máximo",
    icon:                "💎",
    badge:               "Premium",
    recommendedDuration: 30,
    minAssets:           3,
    maxAssets:           6,
    assetType:           "both",
    assetLabels:         ["Media 1", "Media 2", "Media 3", "Media 4", "Media 5", "Media 6"],
    defaultStyle:        "premium_morado",
    clipEffect:          "zoomIn",
    hookSuggestions:     [
      "Esto es {barbería}. Aquí se hace magia.",
      "Precisión. Estilo. Arte.",
      "El corte que mereces. Aquí.",
    ],
    ctaSuggestions:      [
      "Reserva tu experiencia → link en bio",
      "El mejor corte que habrás tenido →",
      "Tu próxima cita te espera →",
    ],
    defaultHashtags:     ["barbershop", "barberia", "premium", "fade", "barbero", "haircut", "lujo"],
  },

  {
    slug:                "barbero_semana",
    name:                "Barbero de la Semana",
    description:         "Humaniza la marca, genera confianza y reservas",
    icon:                "💈",
    recommendedDuration: 30,
    minAssets:           2,
    maxAssets:           4,
    assetType:           "image",
    assetLabels:         ["Foto barbero trabajando", "Foto resultado / perfil", "Foto adicional", "Foto adicional"],
    defaultStyle:        "urbano_moderno",
    clipEffect:          "zoomOut",
    hookSuggestions:     [
      "Conoce a {nombre}. El artista de la semana.",
      "Manos que crean estilo en {barbería}",
      "{nombre} — más de {años} años haciendo magia.",
    ],
    ctaSuggestions:      [
      "Reserva con {nombre} → link en bio",
      "Solo quedan X plazas esta semana →",
      "DM para reservar con {nombre} →",
    ],
    defaultHashtags:     ["barber", "barbero", "barbershop", "team", "barberlife", "barberia"],
  },
];

export function getTemplate(slug: string): ReelTemplate | undefined {
  return REEL_TEMPLATES.find(t => t.slug === slug);
}

/** Interpolates {barbería} and {nombre} placeholders in suggestion strings. */
export function interpolate(
  text: string,
  vars: { barbershopName?: string; barberName?: string; years?: string },
): string {
  return text
    .replace(/\{barbería\}/g, vars.barbershopName ?? "la barbería")
    .replace(/\{nombre\}/g,   vars.barberName    ?? "nuestro barbero")
    .replace(/\{años\}/g,     vars.years         ?? "5");
}
