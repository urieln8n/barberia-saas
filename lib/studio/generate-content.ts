// Studio IA — mock content generator
// TODO: Replace with real API calls to Runway / Kling / Luma / Replicate

export type ContentType =
  | "oferta_semanal"
  | "antes_despues"
  | "corte_premium"
  | "barbero_destacado"
  | "resena_cliente"
  | "promo_urgente"
  | "producto_destacado"
  | "recuperar_clientes"
  | "llenar_huecos";

export type ContentStyle =
  | "premium_morado"
  | "urbano_moderno"
  | "minimalista_limpio"
  | "barberia_clasica"
  | "viral_tiktok"
  | "lujo_dorado";

export type StudioContentInput = {
  type: ContentType;
  barbershopName: string;
  message?: string;
  style: ContentStyle;
  serviceName?: string;
  barberName?: string;
  productName?: string;
  reviewText?: string;
};

export type StudioContentOutput = {
  title: string;
  script: string;
  onScreenText: string;
  subtitles: string[];
  cta: string;
  instagramCaption: string;
  hashtags: string[];
  visualIdea: string;
  contentType: ContentType;
  creditsEstimated: number;
};

const SCRIPTS: Record<ContentType, (input: StudioContentInput) => StudioContentOutput> = {
  oferta_semanal: (i) => ({
    title: `Oferta semanal — ${i.barbershopName}`,
    script: `Esta semana en ${i.barbershopName} tenemos una oferta especial que no te puedes perder. ${i.message ?? "Corte + barba a precio especial."} Reserva ahora, los huecos se llenan rápido.`,
    onScreenText: `⚡ OFERTA DE LA SEMANA\n${i.message ?? "Corte + barba — precio especial"}\n📲 Reserva ya`,
    subtitles: [
      "Esta semana en " + i.barbershopName + "...",
      i.message ?? "Oferta especial en corte y barba.",
      "Plazas limitadas. ¡Reserva ya!",
    ],
    cta: "Reserva tu hueco ahora — link en bio",
    instagramCaption: `🔥 OFERTA DE LA SEMANA en ${i.barbershopName}\n\n${i.message ?? "Corte + barba a precio especial"}\n\n⏰ Solo esta semana. Plazas limitadas.\n📲 Reserva en el link de la bio o por WhatsApp.\n\n`,
    hashtags: ["#barberia", "#barbershop", "#oferta", "#corte", "#barba", `#${i.barbershopName.toLowerCase().replace(/\s/g, "")}`, "#barberiamadrid", "#hairstyle"],
    visualIdea: "Texto dinámico sobre fondo oscuro con acento dorado. Primer plano de unas tijeras o navaja. Transición rápida con el logo.",
    contentType: "oferta_semanal",
    creditsEstimated: 1,
  }),

  antes_despues: (i) => ({
    title: `Antes y después — ${i.serviceName ?? "Corte"}`,
    script: `Mira esta transformación en ${i.barbershopName}. ${i.serviceName ?? "Un corte increíble"} que habla por sí solo. ¿Quieres el tuyo?`,
    onScreenText: `ANTES → DESPUÉS\n${i.serviceName ?? "Transformación total"}\n📲 Reserva en bio`,
    subtitles: [
      "Así llegó...",
      "Así salió de " + i.barbershopName,
      "¿Quieres el tuyo? Reserva ahora.",
    ],
    cta: "¿El tuyo cuándo? Reserva en el link",
    instagramCaption: `✂️ TRANSFORMACIÓN REAL en ${i.barbershopName}\n\n${i.serviceName ?? "Corte premium"} — el resultado habla solo.\n\n¿Quieres el tuyo? 📲 Link en bio para reservar.\n\n`,
    hashtags: ["#antesdespues", "#beforeafter", "#barbershop", "#barberia", "#transformacion", "#corte", "#hairstyle", "#barber"],
    visualIdea: "Split screen: mitad izquierda antes, mitad derecha después. Transición reveladora de izquierda a derecha. Música energética.",
    contentType: "antes_despues",
    creditsEstimated: 1,
  }),

  corte_premium: (i) => ({
    title: `${i.serviceName ?? "Corte premium"} — ${i.barbershopName}`,
    script: `Esto es lo que hacemos en ${i.barbershopName}. ${i.serviceName ?? "Corte premium"} con precisión y estilo. Cada detalle importa.`,
    onScreenText: `${i.serviceName?.toUpperCase() ?? "CORTE PREMIUM"}\n${i.barbershopName}\n📲 Reserva ya`,
    subtitles: [
      i.serviceName ?? "Corte premium",
      "Precisión y estilo en " + i.barbershopName,
      "Reserva tu próxima cita.",
    ],
    cta: "Reserva ahora — link en bio",
    instagramCaption: `✂️ ${i.serviceName ?? "CORTE PREMIUM"} en ${i.barbershopName}\n\nCada detalle, cada línea, cada acabado — hecho con precisión.\n\n📲 Reserva tu cita en el link de la bio.\n\n`,
    hashtags: ["#barbershop", "#barberia", "#hairstyle", "#fade", "#corte", "#barberlife", `#${i.serviceName?.toLowerCase().replace(/\s/g, "") ?? "cortepremium"}`],
    visualIdea: "Slow motion del proceso de corte. Primer plano de la navaja con luz lateral. Música chill pero moderna.",
    contentType: "corte_premium",
    creditsEstimated: 1,
  }),

  barbero_destacado: (i) => ({
    title: `Conoce a ${i.barberName ?? "nuestro barbero"} — ${i.barbershopName}`,
    script: `${i.barberName ?? "Nuestro equipo"} en ${i.barbershopName}. Pasión por el oficio, precisión en cada corte. Reserva con él directamente.`,
    onScreenText: `CONOCE A ${(i.barberName ?? "NUESTRO EQUIPO").toUpperCase()}\n${i.barbershopName}\n📲 Reserva con él`,
    subtitles: [
      "Conoce a " + (i.barberName ?? "nuestro barbero") + "...",
      "Precisión y pasión en cada corte.",
      "Reserva con él — link en bio.",
    ],
    cta: "Reserva con " + (i.barberName ?? "él") + " — link en bio",
    instagramCaption: `💈 EQUIPO ${i.barbershopName.toUpperCase()}\n\n${i.barberName ?? "Nuestro equipo"} — pasión por el oficio y precisión en cada detalle.\n\n📲 Reserva tu cita con él en el link de la bio.\n\n`,
    hashtags: ["#barber", "#barbershop", "#barberia", "#team", "#barbero", "#barberlife", "#hairstyle"],
    visualIdea: "Perfil del barbero trabajando, con sus herramientas en el mostrador. Tono cálido y profesional. Texto en overlay limpio.",
    contentType: "barbero_destacado",
    creditsEstimated: 1,
  }),

  resena_cliente: (i) => ({
    title: `Reseña real — ${i.barbershopName}`,
    script: `Esto lo dijo un cliente real de ${i.barbershopName}: "${i.reviewText ?? "Increíble servicio, volveré sin duda."}". Estas son las razones por las que seguimos creciendo.`,
    onScreenText: `⭐⭐⭐⭐⭐\n"${i.reviewText ?? "Increíble servicio, volveré sin duda."}" \n— Cliente de ${i.barbershopName}`,
    subtitles: [
      "Esto lo dijo un cliente real...",
      `"${i.reviewText ?? "Increíble servicio, volveré sin duda."}"`,
      "¿Cuándo es tu próxima cita?",
    ],
    cta: "Lee más reseñas — reserva en el link",
    instagramCaption: `⭐ OPINIÓN REAL de ${i.barbershopName}\n\n"${i.reviewText ?? "Increíble servicio, volveré sin duda."}" — Cliente verificado.\n\n¿Cuándo es tu próxima cita? 📲 Link en bio.\n\n`,
    hashtags: ["#resenas", "#opinion", "#barbershop", "#barberia", "#5estrellas", "#clientefeliz", "#recomendado"],
    visualIdea: "Fondo limpio claro con texto de la reseña animado. Estrellas doradas. Logo de la barbería al final. Música suave.",
    contentType: "resena_cliente",
    creditsEstimated: 1,
  }),

  promo_urgente: (i) => ({
    title: `Últimos huecos hoy — ${i.barbershopName}`,
    script: `¡Atención! En ${i.barbershopName} quedan solo los últimos huecos para hoy. ${i.message ?? "Si necesitas corte, este es el momento."} Reserva ahora antes de que se agoten.`,
    onScreenText: `⏰ ÚLTIMOS HUECOS HOY\n${i.barbershopName}\n📲 RESERVA AHORA`,
    subtitles: [
      "Quedan los últimos huecos para hoy...",
      i.message ?? "¿Necesitas corte esta semana?",
      "Reserva ahora — se agotan.",
    ],
    cta: "Último hueco disponible — reserva ya",
    instagramCaption: `⚡ ÚLTIMOS HUECOS HOY en ${i.barbershopName}\n\n${i.message ?? "Quedan pocas plazas. Si necesitas corte, este es el momento."}\n\n⏰ Reserva AHORA en el link de la bio antes de que se agoten.\n\n`,
    hashtags: ["#urgente", "#huecos", "#reserva", "#barbershop", "#barberia", "#hoy", "#disponible"],
    visualIdea: "Reloj o temporizador animado. Fondo oscuro con texto en rojo/naranja urgente. Alto contraste y movimiento rápido.",
    contentType: "promo_urgente",
    creditsEstimated: 1,
  }),

  producto_destacado: (i) => ({
    title: `${i.productName ?? "Producto premium"} — ${i.barbershopName}`,
    script: `En ${i.barbershopName} usamos y vendemos los mejores productos. ${i.productName ?? "Producto premium"} para que tu estilo dure toda la semana.`,
    onScreenText: `${(i.productName ?? "PRODUCTO PREMIUM").toUpperCase()}\nDisponible en ${i.barbershopName}\n💈 Pregunta en tu próxima visita`,
    subtitles: [
      "El secreto está en el producto...",
      i.productName ?? "Producto premium de barbería.",
      "Disponible en " + i.barbershopName + ".",
    ],
    cta: "Pregunta por él en tu próxima visita",
    instagramCaption: `💈 ${i.productName?.toUpperCase() ?? "PRODUCTO PREMIUM"} en ${i.barbershopName}\n\nUsamos y vendemos los mejores productos para que tu estilo dure toda la semana.\n\n📲 Reserva cita y llévate el tuyo — link en bio.\n\n`,
    hashtags: ["#barbershop", "#barberia", "#producto", "#styling", "#cabello", "#barbero", "#pomade", "#grooming"],
    visualIdea: "Primer plano del producto con iluminación de estudio. Manos del barbero aplicándolo. Texto limpio minimalista.",
    contentType: "producto_destacado",
    creditsEstimated: 1,
  }),

  recuperar_clientes: (i) => ({
    title: `Te echamos de menos — ${i.barbershopName}`,
    script: `En ${i.barbershopName} te echamos de menos. Hace tiempo que no te vemos. Vuelve esta semana y recupera tu estilo.`,
    onScreenText: `💈 TE ECHAMOS DE MENOS\n${i.message ?? "¿Cuándo fue tu último corte?"}\n📲 Reserva y vuelve`,
    subtitles: [
      "Hace tiempo que no te vemos...",
      i.message ?? "¿Cuándo fue tu último corte?",
      "Vuelve a " + i.barbershopName + " esta semana.",
    ],
    cta: "Vuelve esta semana — link en bio",
    instagramCaption: `💈 ¿CUÁNDO FUE TU ÚLTIMO CORTE?\n\nEn ${i.barbershopName} te echamos de menos. Esta semana tenemos huecos disponibles.\n\n📲 Reserva en el link de la bio y recupera tu estilo.\n\n`,
    hashtags: ["#barbershop", "#barberia", "#vuelve", "#corte", "#reactivacion", "#teechamosdemenos"],
    visualIdea: "Silla de barbería vacía. Mensaje emotivo en overlay. Transición a silla ocupada. Música nostálgica y motivadora.",
    contentType: "recuperar_clientes",
    creditsEstimated: 1,
  }),

  llenar_huecos: (i) => ({
    title: `Huecos disponibles — ${i.barbershopName}`,
    script: `¿Buscas hueco esta semana? En ${i.barbershopName} tenemos disponibilidad ahora mismo. ${i.message ?? "No esperes, los huecos se llenan rápido."} Reserva en dos clics.`,
    onScreenText: `📅 HUECOS DISPONIBLES\n${i.barbershopName}\n📲 Reserva en 2 clics`,
    subtitles: [
      "¿Buscas hueco esta semana?",
      "Disponibilidad ahora en " + i.barbershopName + ".",
      "Reserva en 2 clics — link en bio.",
    ],
    cta: "Reserva en 2 clics — link en bio",
    instagramCaption: `📅 HUECOS DISPONIBLES ESTA SEMANA\n\n${i.barbershopName} tiene disponibilidad ahora mismo.\n\n${i.message ?? "No esperes — los huecos se llenan rápido."}\n\n📲 Reserva en el link de la bio.\n\n`,
    hashtags: ["#disponible", "#reserva", "#barbershop", "#barberia", "#huecos", "#cita", "#corte"],
    visualIdea: "Calendario animado con huecos libres marcados. Verde brillante sobre fondo oscuro. Urgencia visual clara.",
    contentType: "llenar_huecos",
    creditsEstimated: 1,
  }),
};

export function generateStudioContent(input: StudioContentInput): StudioContentOutput {
  const generator = SCRIPTS[input.type];
  return generator(input);
}

export const CONTENT_TYPES: { type: ContentType; label: string; description: string; icon: string; credits: number }[] = [
  { type: "oferta_semanal",      label: "Oferta semanal",          description: "Promo con precio especial esta semana",         icon: "⚡", credits: 1 },
  { type: "antes_despues",       label: "Antes y después",         description: "Transforma con un split visual impactante",     icon: "↔️", credits: 1 },
  { type: "corte_premium",       label: "Corte premium",           description: "Muestra un servicio con detalle y estilo",      icon: "✂️", credits: 1 },
  { type: "barbero_destacado",   label: "Barbero destacado",       description: "Presenta a un miembro de tu equipo",            icon: "💈", credits: 1 },
  { type: "resena_cliente",      label: "Reseña de cliente",       description: "Convierte una reseña positiva en contenido",    icon: "⭐", credits: 1 },
  { type: "promo_urgente",       label: "Promo de última hora",    description: "Últimos huecos del día — urgencia real",        icon: "⏰", credits: 1 },
  { type: "producto_destacado",  label: "Producto destacado",      description: "Muestra y vende un producto de tu barbería",    icon: "🧴", credits: 1 },
  { type: "recuperar_clientes",  label: "Recuperar clientes",      description: "Reactiva clientes que llevan tiempo sin venir", icon: "💔", credits: 1 },
  { type: "llenar_huecos",       label: "Llenar huecos",           description: "Convierte huecos libres en reservas",           icon: "📅", credits: 1 },
];

export const CONTENT_STYLES: { style: ContentStyle; label: string; description: string; color: string }[] = [
  { style: "premium_morado",   label: "Premium morado",    description: "Elegante, moderno y diferenciado",    color: "#6D28D9" },
  { style: "urbano_moderno",   label: "Urbano moderno",    description: "Dinámico, joven y con energía",       color: "#1F2937" },
  { style: "minimalista_limpio", label: "Minimalista",     description: "Limpio, simple y muy legible",        color: "#F9FAFB" },
  { style: "barberia_clasica", label: "Barbería clásica",  description: "Tradición, rayas y calidez vintage",  color: "#92400E" },
  { style: "viral_tiktok",     label: "Viral TikTok",      description: "Rápido, llamativo y vertical",        color: "#FF0050" },
  { style: "lujo_dorado",      label: "Lujo dorado",       description: "Exclusivo, premium y aspiracional",   color: "#C9A227" },
];

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
