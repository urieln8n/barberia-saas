"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeEuro,
  BarChart3,
  BookOpenCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Crown,
  Database,
  ExternalLink,
  Gem,
  Globe2,
  Instagram,
  LineChart,
  MessageCircle,
  MousePointerClick,
  ReceiptText,
  QrCode,
  Rocket,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  WalletCards,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { LandingExperience } from "@/components/landing/PremiumLandingMotion";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

type FeatureItem = {
  title: string;
  text: string;
  icon: LucideIcon;
};

const WHATSAPP_URL = BUSINESS_CONFIG.whatsappUrl;
const REQUEST_DEMO_URL = "/pedir-demo";

const problemCards: FeatureItem[] = [
  {
    title: "Reservas que se olvidan",
    text: "Mensajes sueltos, notas de voz y capturas terminan rompiendo la agenda.",
    icon: MessageCircle,
  },
  {
    title: "Doble reserva",
    text: "Dos clientes, un mismo barbero y una conversación incómoda en mostrador.",
    icon: CalendarDays,
  },
  {
    title: "Huecos invisibles",
    text: "Horas libres que nadie ve y que podrían convertirse en dinero hoy.",
    icon: Clock3,
  },
  {
    title: "Caja sin control",
    text: "Servicios, productos, efectivo y tarjeta sin una lectura clara del día.",
    icon: WalletCards,
  },
  {
    title: "Clientes que no vuelven",
    text: "Sin historial ni próxima acción, el cliente se enfría y desaparece.",
    icon: Users,
  },
  {
    title: "Equipo sin seguimiento",
    text: "No queda claro quién atiende, quién vende y dónde se pierde capacidad.",
    icon: Scissors,
  },
];

const featureSections = [
  {
    id: "agenda",
    eyebrow: "Agenda operativa",
    title: "La agenda que convierte huecos libres en reservas.",
    text: "Vista día, semana y mes con filtro por barbero, hora actual, huecos libres y ficha del cliente para decidir rápido sin mirar tres sitios.",
    accent: "gold",
    items: ["Vista día", "Vista semana", "Vista mes", "Filtro por barbero", "Hueco libre", "Reservar ahora"],
  },
  {
    id: "huecos",
    eyebrow: "Huecos libres",
    title: "Cada hueco libre puede convertirse en una reserva.",
    text: "Detecta quién está libre, cuánto dura el hueco, qué servicio cabe y qué acción conviene lanzar para llenarlo.",
    accent: "green",
    items: ["Barbero libre", "Duración del hueco", "Servicio compatible", "Acción rápida", "Campaña WhatsApp"],
  },
  {
    id: "caja",
    eyebrow: "Caja",
    title: "Controla el dinero del día sin hojas ni confusión.",
    text: "Servicios cobrados, productos vendidos, ticket medio y cierre de caja en una lectura simple para el dueño.",
    accent: "blue",
    items: ["Caja de hoy", "Servicios cobrados", "Productos vendidos", "Ticket medio", "Cierre diario"],
  },
  {
    id: "clientes",
    eyebrow: "Clientes",
    title: "Tus clientes no deberían perderse en WhatsApp.",
    text: "Historial, última visita, cliente frecuente, cliente perdido, WhatsApp rápido y próxima acción en una misma ficha.",
    accent: "zinc",
    items: ["Historial", "Última visita", "Cliente frecuente", "Cliente perdido", "WhatsApp rápido", "Próxima acción"],
  },
] as const;

const marketingItems = [
  ["Promo rápida", "Copia un mensaje para llenar un hueco de hoy.", Zap],
  ["Clientes perdidos", "Recupera clientes que llevan semanas sin volver.", Users],
  ["Historias y posts", "Ideas listas para Instagram sin empezar desde cero.", Instagram],
  ["Reseñas", "Activa mensajes para pedir reseña cuando el cliente sale satisfecho.", Sparkles],
] as const;

const plans = [
  {
    name: "Básico",
    price: "39€",
    text: "Para ordenar reservas, agenda, QR y clientes sin depender de mensajes perdidos.",
    features: ["Reservas online", "Agenda", "Clientes", "QR propio", "Caja básica"],
    featured: false,
  },
  {
    name: "Pro",
    price: "79€",
    text: "Para barberías con equipo que necesitan control diario, caja y marketing.",
    features: ["Todo en Básico", "Caja avanzada", "Huecos libres", "Marketing Studio", "Rendimiento por barbero"],
    featured: true,
  },
  {
    name: "Premium",
    price: "149€",
    text: "Para dueños que quieren crecimiento, IA, reportes y sistema completo.",
    features: ["Todo en Pro", "IA del dueño", "CRM de leads", "Reportes", "Optimización mensual"],
    featured: false,
  },
] as const;

const heroStats = [
  {
    value: "0%",
    label: "comisión por reserva",
    text: "El cliente reserva contigo, no en un marketplace que controla tu dato.",
  },
  {
    value: "24/7",
    label: "link y QR activos",
    text: "Reservas desde Instagram, Google Business, WhatsApp, escaparate y recepción.",
  },
  {
    value: "1",
    label: "panel de mando",
    text: "Agenda, caja, clientes, barberos, huecos, marketing y reportes conectados.",
  },
] as const;

const operatingSystemLayers = [
  {
    eyebrow: "Capa 01",
    title: "Captación",
    text: "SEO local, QR, link público, Instagram, Google Business y WhatsApp convierten la atención en reservas trazables.",
    icon: Globe2,
    points: ["Web VIP", "QR de mostrador", "Link en bio", "Google Business", "WhatsApp"],
  },
  {
    eyebrow: "Capa 02",
    title: "Conversión",
    text: "El cliente ve servicios, barberos y disponibilidad sin instalar app. La reserva entra limpia en la agenda.",
    icon: MousePointerClick,
    points: ["Servicios claros", "Barberos visibles", "Horarios reales", "Reserva directa", "Sin fricción"],
  },
  {
    eyebrow: "Capa 03",
    title: "Operación",
    text: "El dueño ve el día completo: reservas, huecos, carga por barbero, caja, productos y próximas acciones.",
    icon: CalendarDays,
    points: ["Agenda día", "Agenda semana", "Huecos libres", "Caja", "Equipo"],
  },
  {
    eyebrow: "Capa 04",
    title: "Crecimiento",
    text: "Marketing Studio y Growth Engine convierten huecos, clientes perdidos y reseñas en acciones comerciales.",
    icon: TrendingUp,
    points: ["Campañas", "Promos", "Reseñas", "Leads", "Reportes"],
  },
] as const;

const beforeAfterRows = [
  ["Reservas", "WhatsApp, notas y riesgo de doble reserva", "Agenda online con disponibilidad y QR propio"],
  ["Clientes", "Contactos perdidos en conversaciones antiguas", "Ficha con historial, última visita y próxima acción"],
  ["Caja", "Cierre manual y poca visibilidad del día", "Servicios, productos, ticket medio y cierre diario"],
  ["Huecos", "Horas vacías que nadie detecta a tiempo", "Huecos visibles con acción para llenarlos"],
  ["Marketing", "Publicar por intuición cuando sobra tiempo", "Mensajes listos según agenda, clientes y campañas"],
  ["Datos", "La plataforma externa controla parte de la relación", "La barbería conserva reservas, clientes y contexto"],
] as const;

const revenueLevers = [
  {
    title: "Más reservas directas",
    metric: "QR + link público",
    text: "Cada punto de contacto lleva a una reserva propia: mostrador, espejo, historias, bio, Google y WhatsApp.",
    icon: QrCode,
  },
  {
    title: "Menos huecos muertos",
    metric: "Huecos detectados",
    text: "El sistema muestra ventanas libres y permite activar mensajes o campañas manuales para ocuparlas.",
    icon: Clock3,
  },
  {
    title: "Mejor ticket medio",
    metric: "Caja + servicios",
    text: "El dueño entiende qué se vende, qué barbero rinde y dónde conviene empujar producto o servicio.",
    icon: ReceiptText,
  },
  {
    title: "Más repetición",
    metric: "Clientes perdidos",
    text: "El historial permite recuperar clientes dormidos con mensajes concretos, no con spam ni automatización agresiva.",
    icon: Users,
  },
] as const;

const implementationTimeline = [
  {
    day: "Día 1",
    title: "Mapa de la barbería",
    text: "Servicios, precios, duración, barberos, horarios, política de reservas y flujo actual.",
  },
  {
    day: "Día 2",
    title: "Agenda y QR",
    text: "Configuración inicial, página pública, QR, links y pruebas de reserva desde móvil.",
  },
  {
    day: "Día 3",
    title: "Caja y clientes",
    text: "Activación de caja, productos, clientes, etiquetas básicas y lectura diaria del dueño.",
  },
  {
    day: "Día 4",
    title: "Marketing Studio",
    text: "Plantillas de WhatsApp, mensajes para huecos, recuperación y petición de reseñas.",
  },
  {
    day: "Día 5",
    title: "Sistema de mando",
    text: "Dashboard, indicadores clave, hábitos de uso y checklist de operación semanal.",
  },
] as const;

const vipWebsiteBlocks = [
  {
    title: "Primera impresión premium",
    text: "Hero con marca, servicios, fotos reales o generadas con criterio, reserva directa y WhatsApp visible.",
  },
  {
    title: "SEO local con intención",
    text: "Estructura para búsquedas como barbería cerca de mí, corte de pelo, degradado, barba y ciudad.",
  },
  {
    title: "Reserva sin comisión",
    text: "La web no termina en un formulario muerto: empuja al QR, agenda pública o WhatsApp comercial.",
  },
  {
    title: "Medición y mejora",
    text: "Eventos, leads y lectura de conversiones para saber qué canal trae reservas y qué mensaje funciona.",
  },
] as const;

const growthEngineCards = [
  {
    title: "CRM de leads",
    text: "Leads manuales con estado, origen, temperatura y próxima acción comercial.",
    icon: Users,
  },
  {
    title: "Instagram Growth",
    text: "Ideas, keywords, prompts y mensajes preparados sin scraping ni automatizaciones prohibidas.",
    icon: Instagram,
  },
  {
    title: "WhatsApp IA",
    text: "Plantillas y sugerencias para responder, recuperar y cerrar reservas con tono de barbería.",
    icon: MessageCircle,
  },
  {
    title: "ADS y ROI",
    text: "Preparado para reportes de campañas, coste por lead, coste por reserva e ingresos atribuidos.",
    icon: BarChart3,
  },
] as const;

const trustItems = [
  ["Multi-tenant", "Arquitectura por barbería con barbershop_id y separación de datos."],
  ["RLS", "Pensado para Supabase con políticas de acceso por negocio."],
  ["Service role", "Nunca debe exponerse al cliente ni a componentes de frontend."],
  ["Datos propios", "Reservas, clientes y actividad pertenecen a la barbería."],
  ["Sin bots ilegítimos", "Crecimiento preparado para APIs oficiales, no automatizaciones prohibidas."],
  ["Mobile-first", "Dueño, recepción y barberos deben operar desde móvil sin perder claridad."],
] as const;

const localSeoCities = [
  "Barcelona",
  "Madrid",
  "Valencia",
  "Sevilla",
  "Málaga",
  "Zaragoza",
  "Bilbao",
  "Alicante",
  "Murcia",
  "Palma",
  "Las Palmas",
  "Valladolid",
] as const;

const founderOfferItems = [
  "Setup inicial de servicios, barberos y horarios",
  "QR de reservas listo para mostrador y stories",
  "Página pública conectada a BarberíaOS",
  "Checklist de operación diaria para el dueño",
  "Plantillas de WhatsApp para huecos y clientes perdidos",
  "Revisión inicial de presencia local y posicionamiento",
  "Guía de uso para recepción y equipo",
  "Ruta de crecimiento mensual según plan",
] as const;

const proofMetrics = [
  ["Reservas", "Agenda online, QR, disponibilidad y ficha de cliente"],
  ["Agenda", "Día, semana, mes, filtros, huecos y carga por barbero"],
  ["Caja", "Servicios, productos, ticket medio y cierre diario"],
  ["Clientes", "Historial, última visita, etiquetas y recuperación"],
  ["Barberos", "Equipo, disponibilidad, rendimiento y asignación"],
  ["Marketing", "Campañas, plantillas, mensajes y reseñas"],
  ["Growth", "Leads, Instagram, WhatsApp IA, ADS y reportes"],
  ["Web VIP", "SEO local, marca premium y reserva conectada"],
] as const;

const conversionBlueprint = [
  {
    phase: "Atracción",
    title: "El cliente descubre una barbería que parece seria antes de entrar.",
    text: "La marca, el posicionamiento local, las páginas SEO y el QR convierten búsquedas y visitas en intención real.",
    icon: Building2,
    evidence: ["SEO local", "Web VIP", "Google Business", "Instagram", "QR físico"],
  },
  {
    phase: "Decisión",
    title: "La reserva no puede depender de esperar una respuesta.",
    text: "Servicios, disponibilidad y llamada a la acción aparecen claros para que el cliente reserve cuando tiene intención.",
    icon: MousePointerClick,
    evidence: ["Servicios", "Precios", "Duraciones", "Barberos", "Reserva directa"],
  },
  {
    phase: "Operación",
    title: "La reserva entra en el sistema y el equipo trabaja con contexto.",
    text: "Agenda, barbero, cliente y caja quedan conectados para reducir errores y aumentar control del día.",
    icon: CalendarDays,
    evidence: ["Agenda", "Cliente", "Barbero", "Caja", "Historial"],
  },
  {
    phase: "Monetización",
    title: "Cada visita deja datos para vender mejor la siguiente.",
    text: "Ticket, servicio, producto, recurrencia y próxima acción alimentan una lectura comercial sencilla.",
    icon: CreditCard,
    evidence: ["Ticket medio", "Producto", "Recurrencia", "Próxima acción", "Reporte"],
  },
  {
    phase: "Retención",
    title: "Los clientes perdidos dejan de ser invisibles.",
    text: "El dueño detecta clientes dormidos y puede activar mensajes manuales con intención y timing.",
    icon: Users,
    evidence: ["Última visita", "Segmentos", "WhatsApp", "Plantillas", "Recuperación"],
  },
  {
    phase: "Expansión",
    title: "El crecimiento se gestiona como proceso, no como inspiración puntual.",
    text: "Growth Engine ordena leads, campañas, prompts, WhatsApp, reseñas y reportes sin promesas falsas.",
    icon: Rocket,
    evidence: ["Leads", "Campañas", "Prompts", "Reseñas", "ROI"],
  },
] as const;

const ownerCommandPanels = [
  {
    title: "Hoy",
    metric: "12 reservas",
    text: "Próximas citas, barberos activos, huecos libres y caja estimada del día.",
  },
  {
    title: "Esta semana",
    metric: "7 huecos vendibles",
    text: "Ventanas que todavía pueden convertirse en ingresos con mensajes y promociones.",
  },
  {
    title: "Clientes",
    metric: "23 dormidos",
    text: "Clientes sin visita reciente, listos para campaña de recuperación manual.",
  },
  {
    title: "Caja",
    metric: "486€ hoy",
    text: "Servicios cobrados, productos vendidos, ticket medio y cierre operativo.",
  },
  {
    title: "Equipo",
    metric: "4 barberos",
    text: "Carga por profesional, disponibilidad y rendimiento visible sin hojas externas.",
  },
  {
    title: "Marketing",
    metric: "5 acciones",
    text: "Promos, mensajes, reseñas, ideas de contenido y campañas preparadas.",
  },
] as const;

const premiumRoutes = [
  {
    href: "/software-para-barberias",
    title: "Software para barberías",
    text: "Página SEO principal para explicar BarberíaOS como plataforma vertical.",
  },
  {
    href: "/agenda-online-barberia",
    title: "Agenda online",
    text: "Ruta específica para búsquedas de reservas y agenda digital.",
  },
  {
    href: "/reservas-online-barberia",
    title: "Reservas online",
    text: "Argumento para captar demanda de reserva directa sin marketplace.",
  },
  {
    href: "/caja-para-barberias",
    title: "Caja para barberías",
    text: "Ruta de control económico, ticket medio, productos y cierre diario.",
  },
  {
    href: "/calculadora-booksy",
    title: "Calculadora Booksy",
    text: "Herramienta de comparación para mostrar coste de comisiones y dependencia.",
  },
  {
    href: "/barberias-fundadoras",
    title: "Barberías fundadoras",
    text: "Oferta comercial para negocios que quieren entrar con acompañamiento.",
  },
] as const;

const premiumSignalMatrix = [
  {
    group: "Reserva",
    title: "Disponibilidad visible",
    text: "El cliente no pregunta si hay hueco: ve opciones y decide con menos fricción.",
    impact: "Más conversión",
  },
  {
    group: "Reserva",
    title: "QR propio",
    text: "El mostrador, el espejo y las stories dejan de ser decoración y se convierten en entrada de citas.",
    impact: "Más reservas directas",
  },
  {
    group: "Agenda",
    title: "Día operativo",
    text: "La barbería entiende el flujo de hoy sin revisar mensajes, notas y memoria del equipo.",
    impact: "Menos errores",
  },
  {
    group: "Agenda",
    title: "Huecos vendibles",
    text: "Los huecos no se miran al final del día. Se detectan cuando todavía pueden venderse.",
    impact: "Más caja",
  },
  {
    group: "Caja",
    title: "Cierre claro",
    text: "Servicios, productos, efectivo y tarjeta se leen como operación, no como arqueología.",
    impact: "Más control",
  },
  {
    group: "Caja",
    title: "Ticket medio",
    text: "El dueño puede ver si está vendiendo solo cortes o también barba, tratamientos y producto.",
    impact: "Mejor margen",
  },
  {
    group: "Clientes",
    title: "Historial útil",
    text: "Cada visita deja contexto para atender mejor y vender la siguiente con más precisión.",
    impact: "Más repetición",
  },
  {
    group: "Clientes",
    title: "Recuperación",
    text: "Los clientes dormidos pasan de ser intuición a lista accionable con mensaje preparado.",
    impact: "Menos fuga",
  },
  {
    group: "Equipo",
    title: "Carga por barbero",
    text: "El sistema muestra quién está ocupado, quién tiene huecos y dónde hay capacidad comercial.",
    impact: "Mejor reparto",
  },
  {
    group: "Equipo",
    title: "Rendimiento",
    text: "El dueño puede mirar operación y ventas por profesional sin convertirlo en una auditoría pesada.",
    impact: "Más claridad",
  },
  {
    group: "Marketing",
    title: "Plantillas rápidas",
    text: "WhatsApp e Instagram se usan con mensajes pensados para llenar huecos, pedir reseñas y recuperar clientes.",
    impact: "Más acción",
  },
  {
    group: "Marketing",
    title: "Campañas manuales",
    text: "Primero se ordena el proceso manual. Luego se preparan integraciones oficiales cuando tenga sentido.",
    impact: "Menos riesgo",
  },
  {
    group: "Growth",
    title: "CRM de leads",
    text: "Los interesados dejan de perderse entre DMs, notas y promesas de llamada.",
    impact: "Más seguimiento",
  },
  {
    group: "Growth",
    title: "Reportes atribuibles",
    text: "La pregunta deja de ser si hubo likes y pasa a ser cuántas reservas e ingresos generó una acción.",
    impact: "Mejor ROI",
  },
  {
    group: "Web VIP",
    title: "Marca premium",
    text: "La barbería se presenta como negocio serio antes de que el cliente pise el local.",
    impact: "Más confianza",
  },
  {
    group: "Web VIP",
    title: "SEO local",
    text: "La demanda de la ciudad se captura con páginas, intención y estructura, no solo con diseño bonito.",
    impact: "Más demanda",
  },
  {
    group: "Datos",
    title: "Cliente propio",
    text: "El activo principal no queda escondido en una plataforma externa sin contexto operativo.",
    impact: "Más independencia",
  },
  {
    group: "Datos",
    title: "Multi-tenant",
    text: "Cada barbería necesita separación clara de reservas, caja, clientes, equipo y campañas.",
    impact: "Más seguridad",
  },
  {
    group: "IA",
    title: "Prompts comerciales",
    text: "La IA sirve para redactar mejor y decidir más rápido, no para prometer automatizaciones mágicas.",
    impact: "Más velocidad",
  },
  {
    group: "IA",
    title: "Dueño asistido",
    text: "El valor está en explicar qué está pasando y qué conviene hacer después.",
    impact: "Mejor decisión",
  },
] as const;

const launchChecklist = [
  "Servicios cargados con duración, precio y categoría",
  "Barberos configurados con disponibilidad real",
  "Página pública revisada desde móvil",
  "QR probado desde cámara, Instagram y mostrador",
  "Caja preparada para servicios y productos",
  "Clientes iniciales importados o creados manualmente",
  "Plantillas de WhatsApp listas para huecos libres",
  "Mensaje de recuperación para clientes dormidos",
  "Guía de recepción para confirmar y mover citas",
  "Panel del dueño revisado con métricas clave",
  "Rutas SEO enlazadas desde la home",
  "Plan de crecimiento mensual definido",
  "Política de datos y privacidad visible",
  "WhatsApp comercial conectado como canal de venta",
  "Prueba de reserva real antes de publicar",
  "Checklist semanal para caja, agenda y marketing",
] as const;

const closingArguments = [
  {
    title: "No dependes de comisiones",
    text: "El modelo empuja reservas propias y relación directa con el cliente.",
  },
  {
    title: "No compras solo diseño",
    text: "La landing vende un sistema conectado a agenda, caja, clientes y crecimiento.",
  },
  {
    title: "No empiezas desde cero",
    text: "El setup deja base, QR, mensajes y operación inicial preparados.",
  },
  {
    title: "No se promete magia",
    text: "El crecimiento se plantea con procesos, datos y canales oficiales.",
  },
  {
    title: "No pierdes el dato",
    text: "La barbería conserva reservas, historial, clientes y contexto comercial.",
  },
  {
    title: "No saturas al dueño",
    text: "La interfaz se explica como sala de mando con acciones claras.",
  },
] as const;

const faqPlus = [
  [
    "¿Esto sustituye Booksy u otras plataformas?",
    "BarberíaOS está pensado para que la barbería opere con reservas propias, QR propio, cliente propio y cero comisión por cita. Puede convivir durante una transición si el negocio lo necesita.",
  ],
  [
    "¿Hace falta que mi equipo sea técnico?",
    "No. La interfaz está pensada para dueño, recepción y barberos. El setup inicial deja la base ordenada para que el uso diario sea simple.",
  ],
  [
    "¿Se puede usar solo para una barbería pequeña?",
    "Sí. El valor empieza con ordenar agenda, QR, clientes y caja. Las capas de crecimiento se activan según madurez y plan.",
  ],
  [
    "¿El Growth Engine automatiza Instagram?",
    "No implementa scraping, follow/unfollow, likes masivos ni DMs masivos no solicitados. La visión correcta es usar APIs oficiales, prompts, plantillas y seguimiento comercial.",
  ],
] as const;

const faqs = [
  [
    "¿Cuánto tarda en activarse?",
    "Depende del tamaño de la barbería, pero el setup inicial puede dejar servicios, barberos, agenda pública y QR listos de forma guiada.",
  ],
  [
    "¿Puedo seguir usando WhatsApp?",
    "Sí. WhatsApp sigue siendo un canal comercial, pero BarberíaOS evita que la agenda dependa de mensajes sueltos.",
  ],
  [
    "¿Qué pasa con mis clientes?",
    "Los clientes quedan en tu base, con historial y acciones rápidas. La idea es que el dato pertenezca a la barbería.",
  ],
  [
    "¿La Web VIP sustituye BarberíaOS?",
    "No. La web atrae. BarberíaOS convierte y controla: reservas, agenda, caja, clientes, QR y marketing conectado.",
  ],
] as const;

function MotionBlock({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  text,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className={`text-xs font-black uppercase tracking-[0.18em] ${dark ? "text-[#D5A84C]" : "text-[#9B6B18]"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-4 text-3xl font-black leading-tight md:text-5xl ${dark ? "text-white" : "text-[#080A0F]"}`}>
        {title}
      </h2>
      {text ? (
        <p className={`mx-auto mt-5 max-w-2xl text-base leading-8 ${dark ? "text-white/60" : "text-[#080A0F]/58"}`}>
          {text}
        </p>
      ) : null}
    </div>
  );
}

function CTAButtons({ center = false }: { center?: boolean }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${center ? "justify-center" : ""}`}>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#E8C46A] to-[#C9961A] px-7 text-sm font-black text-[#1A0F00] shadow-[0_20px_60px_rgba(213,168,76,0.42),inset_0_1px_0_rgba(255,255,255,0.30)] transition hover:-translate-y-0.5 hover:from-[#EFD07C] hover:to-[#D5A84C] hover:shadow-[0_24px_70px_rgba(213,168,76,0.52)] active:scale-[0.98]"
      >
        <MessageCircle size={17} />
        Pedir demo por WhatsApp
      </a>
      <Link
        href="#funciona"
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-white/16 bg-white/[0.07] px-7 text-sm font-black text-white/80 backdrop-blur transition hover:bg-white/[0.12] hover:text-white hover:border-white/24 active:scale-[0.98]"
      >
        Ver cómo funciona
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function RequestDemoLink({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={REQUEST_DEMO_URL}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-[#080A0F] shadow-[0_18px_50px_rgba(255,255,255,0.14)] transition hover:-translate-y-0.5 hover:bg-[#F8F5EE] active:scale-[0.98] ${className}`}
    >
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}

function GoldDivider() {
  return (
    <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-[#D5A84C]/50 to-transparent" />
  );
}

function Pill({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-2 text-xs font-black ${
        dark
          ? "border-white/10 bg-white/[0.055] text-white/70"
          : "border-[#080A0F]/10 bg-white text-[#080A0F]/62"
      }`}
    >
      {children}
    </span>
  );
}

function ExecutiveMetricStrip() {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-3">
      {heroStats.map((stat) => (
        <article
          key={stat.label}
          className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur"
        >
          <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-gradient-to-b from-[#D5A84C] to-[#D5A84C]/20" />
          <p className="text-3xl font-black text-white">{stat.value}</p>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#D5A84C]">{stat.label}</p>
          <p className="mt-3 text-sm leading-6 text-white/52">{stat.text}</p>
        </article>
      ))}
    </div>
  );
}

export function FloatingMetricCard({
  label,
  value,
  tone = "gold",
}: {
  label: string;
  value: string;
  tone?: "gold" | "green" | "blue" | "zinc";
}) {
  const tones = {
    gold: "border-[#D5A84C]/32 bg-[#D5A84C]/14 text-[#F6D98A]",
    green: "border-emerald-300/28 bg-emerald-400/14 text-emerald-200",
    blue: "border-sky-300/28 bg-sky-400/14 text-sky-200",
    zinc: "border-white/16 bg-white/[0.09] text-white/78",
  };
  const glows = {
    gold: "shadow-[0_20px_60px_rgba(0,0,0,0.32),0_0_0_1px_rgba(213,168,76,0.12)]",
    green: "shadow-[0_20px_60px_rgba(0,0,0,0.32),0_0_0_1px_rgba(52,211,153,0.10)]",
    blue: "shadow-[0_20px_60px_rgba(0,0,0,0.32),0_0_0_1px_rgba(56,189,248,0.10)]",
    zinc: "shadow-[0_20px_60px_rgba(0,0,0,0.32)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
      className={`rounded-2xl border px-4 py-3 backdrop-blur-xl ${tones[tone]} ${glows[tone]}`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.14em] opacity-68">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </motion.div>
  );
}

export function DashboardMockup() {
  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00"];
  const appointments = [
    ["09:30", "Degradado + barba", "Marco", "Confirmada", "gold"],
    ["10:45", "Corte clásico", "Luis", "En silla", "blue"],
    ["12:15", "Hueco libre", "45 min disponibles", "Reservar ahora", "green"],
  ] as const;

  return (
    <div className="relative rounded-[30px] border border-white/14 bg-[#08090D]/95 p-3 shadow-[0_48px_140px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl">
      <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D5A84C]">Panel BarberíaOS</p>
            <p className="mt-1 text-xl font-black text-white">Agenda operativa</p>
          </div>
          <div className="flex rounded-full border border-white/10 bg-white/[0.06] p-1 text-[11px] font-black text-white/52">
            {["Día", "Semana", "Mes"].map((item, index) => (
              <span key={item} className={`rounded-full px-3 py-1.5 ${index === 0 ? "bg-[#D5A84C] text-[#080A0F]" : ""}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-black uppercase text-white/35">Hoy</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["12", "Reservas"],
                ["3", "Huecos"],
                ["486€", "Caja"],
                ["4.8", "Ticket"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.055] p-3">
                  <p className="text-lg font-black text-white">{value}</p>
                  <p className="mt-1 text-[11px] font-bold text-white/36">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-[#D5A84C]/20 bg-[#D5A84C]/10 p-4">
              <p className="text-xs font-black text-[#F6D98A]">Próxima reserva</p>
              <p className="mt-2 text-sm font-bold text-white">11:30 · Corte + barba</p>
              <p className="text-xs text-white/45">Cliente: Andrés · Barbero: Diego</p>
            </div>
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-[#06080D] p-4">
            <div className="absolute left-0 right-0 top-[48%] h-px bg-gradient-to-r from-transparent via-[#D5A84C] to-transparent shadow-[0_0_22px_rgba(213,168,76,0.70)]" />
            <div className="grid grid-cols-[54px_1fr] gap-3">
              <div className="space-y-5 text-xs font-bold text-white/28">
                {hours.map((hour) => (
                  <p key={hour}>{hour}</p>
                ))}
              </div>
              <div className="space-y-3">
                {appointments.map(([time, service, client, status, tone]) => (
                  <div
                    key={`${time}-${service}`}
                    className={`rounded-2xl border p-3 ${
                      tone === "green"
                        ? "border-emerald-300/25 bg-emerald-400/12"
                        : tone === "blue"
                          ? "border-sky-300/20 bg-sky-400/10"
                          : "border-[#D5A84C]/24 bg-[#D5A84C]/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-black text-white/45">{time}</p>
                        <p className="mt-1 text-sm font-black text-white">{service}</p>
                        <p className="text-xs text-white/45">{client}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-black text-white/65">
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PremiumHero() {
  return (
    <section className="relative overflow-hidden bg-[#030303] px-5 pb-16 pt-6 text-white md:pb-24 lg:px-8">
      {/* Main gold radial — wider, stronger */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-5%,rgba(213,168,76,0.46),transparent_58%)]" />
      {/* Secondary warm centre pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_28%_at_50%_0%,rgba(248,232,130,0.18),transparent_48%)]" />
      {/* Subtle blue accent — right side depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_22%,rgba(56,189,248,0.07),transparent_26%)]" />
      {/* Bottom fade to black */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#030303] to-transparent" />
      {/* Top gold hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D5A84C]/80 to-transparent" />
      <div className="relative mx-auto max-w-7xl">
        <header className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="BarberíaOS inicio">
            <BarberiaOSLogo variant="isotipo" size={42} />
            <span className="font-black tracking-tight">BarberíaOS</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-white/55 lg:flex" aria-label="Navegación principal">
            <Link href="#agenda" className="hover:text-white">Agenda</Link>
            <Link href="#huecos" className="hover:text-white">Huecos</Link>
            <Link href="#web-vip" className="hover:text-white">Web VIP</Link>
            <Link href="#precios" className="hover:text-white">Precios</Link>
          </nav>
          <Link href="/login" className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-white/70 hover:text-white">
            Entrar
          </Link>
        </header>

        <div className="grid gap-10 pt-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pt-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D5A84C]/30 bg-[#D5A84C]/12 px-3 py-1.5 text-xs font-black text-[#F6D98A] shadow-[0_0_28px_rgba(213,168,76,0.22),inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Crown size={14} />
              Sistema operativo para barberías modernas
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.035em] text-white md:text-7xl">
              Reservas, caja y huecos libres{" "}
              <span className="bg-gradient-to-r from-[#F6D98A] via-[#D5A84C] to-[#C4952A] bg-clip-text text-transparent">
                en un solo panel
              </span>{" "}
              para tu barbería.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/64 md:text-lg">
              Controla citas, evita reservas duplicadas, ve qué barbero está libre, llena huecos y gestiona el dinero del día sin depender de libretas ni mensajes perdidos.
            </p>
            <div className="mt-8">
              <CTAButtons />
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 text-xs font-bold text-white/46 sm:grid-cols-4">
              {["Sin comisión por cita", "QR propio", "Agenda online", "Caja diaria"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center">
                  {item}
                </span>
              ))}
            </div>
            <ExecutiveMetricStrip />
          </div>

          <div className="relative">
            <div className="absolute -left-2 top-8 z-10 hidden md:block">
              <FloatingMetricCard label="Hueco libre" value="Reservar ahora" tone="green" />
            </div>
            <div className="absolute -right-3 top-24 z-10 hidden md:block">
              <FloatingMetricCard label="Caja de hoy" value="486€ registrados" tone="gold" />
            </div>
            <div className="absolute -bottom-5 left-12 z-10 hidden md:block">
              <FloatingMetricCard label="Próxima reserva" value="11:30 · Corte + barba" tone="blue" />
            </div>
            <div className="absolute -bottom-4 right-10 z-10 hidden md:block">
              <FloatingMetricCard label="QR activo" value="Instagram + mostrador" tone="zinc" />
            </div>
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

export function OperatingSystemSection() {
  return (
    <MotionBlock className="bg-[#050505] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D5A84C]">Arquitectura comercial</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Una landing premium debe vender el sistema, no solo una agenda bonita.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/62">
              BarberíaOS se presenta como sistema operativo: captación, conversión, operación y crecimiento. Esa narrativa conserva lo importante de la versión anterior y lo lleva a un nivel más ejecutivo.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Reservas", "Caja", "Clientes", "QR", "Marketing", "Growth"].map((item) => (
                <Pill key={item} dark>{item}</Pill>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {operatingSystemLayers.map(({ eyebrow, title, text, icon: Icon, points }) => (
              <article
                key={title}
                className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_22px_80px_rgba(0,0,0,0.24)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#D5A84C]">{eyebrow}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D5A84C]/18 bg-[#D5A84C]/10 text-[#F6D98A]">
                    <Icon size={20} />
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/56">{text}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {points.map((point) => (
                    <span key={point} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] font-black text-white/58">
                      {point}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function BeforeAfterSection() {
  return (
    <MotionBlock className="bg-[#FBF7EF] px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Antes y después"
          title="De conversaciones sueltas a una barbería con sistema."
          text="La landing debe explicar rápido por qué BarberíaOS es una inversión operativa: menos improvisación, más control y más reservas propias."
        />
        <div className="mt-10 overflow-hidden rounded-[30px] border border-[#080A0F]/8 bg-white shadow-[0_22px_80px_rgba(8,10,15,0.08)]">
          <div className="grid grid-cols-[0.72fr_1fr_1fr] border-b border-[#080A0F]/8 bg-[#080A0F] px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-white/60">
            <span>Área</span>
            <span>Sin sistema</span>
            <span>Con BarberíaOS</span>
          </div>
          {beforeAfterRows.map(([area, before, after]) => (
            <div key={area} className="grid gap-4 border-b border-[#080A0F]/6 px-5 py-5 last:border-b-0 md:grid-cols-[0.72fr_1fr_1fr]">
              <p className="text-sm font-black text-[#9B6B18]">{area}</p>
              <p className="text-sm leading-6 text-[#080A0F]/52">{before}</p>
              <p className="text-sm font-bold leading-6 text-[#080A0F]/76">{after}</p>
            </div>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function RevenueEngineSection() {
  return (
    <MotionBlock className="bg-[#080A0F] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D5A84C]">Motor de ingresos</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              La landing tiene que conectar cada módulo con dinero real.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/62">
              No vendemos pantallas. Vendemos una forma más clara de llenar agenda, recuperar clientes, controlar caja y operar con datos propios.
            </p>
            <div className="mt-8 rounded-[26px] border border-[#D5A84C]/20 bg-[#D5A84C]/10 p-5">
              <LineChart className="text-[#F6D98A]" size={26} />
              <p className="mt-4 text-xl font-black">Lectura de dueño</p>
              <p className="mt-2 text-sm leading-7 text-white/58">
                Qué entra hoy, qué se pierde esta semana, qué barbero tiene capacidad y qué acción comercial conviene lanzar.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {revenueLevers.map(({ title, metric, text, icon: Icon }) => (
              <article key={title} className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6">
                <Icon className="text-[#D5A84C]" size={24} />
                <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-white/38">{metric}</p>
                <h3 className="mt-2 text-2xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/56">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function ImplementationSection() {
  return (
    <MotionBlock className="bg-white px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Implantación"
          title="Un SaaS premium necesita una activación premium."
          text="La propuesta no termina cuando alguien pulsa demo. La landing explica cómo se pasa de caos a sistema en pasos concretos."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          {implementationTimeline.map((step, index) => (
            <article key={step.day} className="relative rounded-[26px] border border-[#080A0F]/8 bg-[#F8F5EE] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#080A0F] text-sm font-black text-[#D5A84C]">
                {index + 1}
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.15em] text-[#9B6B18]">{step.day}</p>
              <h3 className="mt-2 text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#080A0F]/55">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function ProblemCards() {
  return (
    <MotionBlock className="bg-[#F8F5EE] px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="El problema"
          title="Tu barbería pierde dinero cuando la agenda no está clara."
          text="Cada hueco vacío es dinero que tu barbería deja de ganar. Y el caos casi siempre empieza cuando todo depende de memoria, papel o WhatsApp."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problemCards.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-[24px] border border-[#080A0F]/8 bg-white p-6 shadow-[0_16px_45px_rgba(8,10,15,0.06)]">
              <Icon className="text-[#9B6B18]" size={22} />
              <h3 className="mt-5 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#080A0F]/55">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function AgendaShowcase() {
  return (
    <MotionBlock id="funciona" className="bg-[#080A0F] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <SectionHeader
            eyebrow="Centro de mando"
            title="BarberíaOS no es otra agenda. Es el centro de mando de tu barbería."
            text="La web atrae. BarberíaOS convierte y controla."
            dark
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Controla quién viene", "Quién atiende", "Cuánto entra", "Qué huecos se pueden vender"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                <CheckCircle2 size={17} className="text-[#D5A84C]" />
                <p className="mt-3 text-sm font-black text-white/76">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <DashboardMockup />
      </div>
    </MotionBlock>
  );
}

export function ProductFeatureGrid() {
  return (
    <div>
      {featureSections.map((section, index) => (
        <MotionBlock
          key={section.id}
          id={section.id}
          className={`px-5 py-16 md:py-24 lg:px-8 ${index % 2 === 0 ? "bg-[#FBF7EF] text-[#080A0F]" : "bg-white text-[#080A0F]"}`}
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className={index % 2 === 1 ? "lg:order-2" : ""}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9B6B18]">{section.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{section.title}</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#080A0F]/58">{section.text}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <span key={item} className="rounded-full border border-[#080A0F]/10 bg-white px-3 py-2 text-xs font-black text-[#080A0F]/62 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <FreeSlotVisualCard variant={section.accent} title={section.title} />
          </div>
        </MotionBlock>
      ))}
    </div>
  );
}

export function FreeSlotVisualCard({
  variant,
  title,
}: {
  variant: "gold" | "green" | "blue" | "zinc";
  title: string;
}) {
  const accent = {
    gold: "from-[#D5A84C]/24 to-[#080A0F] text-[#F6D98A]",
    green: "from-emerald-400/20 to-[#080A0F] text-emerald-200",
    blue: "from-sky-400/20 to-[#080A0F] text-sky-200",
    zinc: "from-zinc-300/14 to-[#080A0F] text-white/80",
  };

  return (
    <div className={`rounded-[30px] border border-white/10 bg-gradient-to-br ${accent[variant]} p-5 shadow-[0_28px_90px_rgba(8,10,15,0.18)]`}>
      <div className="rounded-[24px] border border-white/10 bg-[#080A0F] p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-white/35">Vista BarberíaOS</p>
            <p className="mt-1 text-xl font-black">{title}</p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/60">Live</span>
        </div>
        <div className="mt-5 grid gap-3">
          {[
            ["10:00", "Carlos", "Corte clásico", "Confirmada"],
            ["11:30", "Diego", "Hueco de 45 min", "Reservar ahora"],
            ["12:20", "Álex", "Barba + perfilado", "Cobrada"],
          ].map(([time, barber, service, status]) => (
            <div key={`${time}-${service}`} className="grid grid-cols-[54px_1fr] gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
              <p className="text-xs font-black text-white/36">{time}</p>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-black text-white">{service}</p>
                  <span className="rounded-full bg-[#D5A84C]/12 px-2 py-1 text-[10px] font-black text-[#F6D98A]">{status}</span>
                </div>
                <p className="mt-1 text-xs text-white/42">Barbero: {barber}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function QRReservationSection() {
  return (
    <MotionBlock className="bg-[#080A0F] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D5A84C]">QR y reservas directas</p>
          <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
            Tu propio QR de reservas. Sin comisiones por cita.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/60">
            El cliente reserva desde Instagram, Google Business, WhatsApp o el QR del local. Tú recibes la cita dentro de tu agenda, no en una conversación perdida.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {["QR en mostrador", "Link público", "Reserva desde Instagram", "Reserva desde Google Business"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm font-black text-white/74">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border border-[#D5A84C]/20 bg-[#D5A84C]/8 p-6">
          <div className="mx-auto flex aspect-square max-w-[290px] items-center justify-center rounded-[30px] border border-white/14 bg-white p-7">
            <div className="grid h-full w-full grid-cols-5 gap-2">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  key={index}
                  className={`rounded-md ${[0, 1, 3, 5, 6, 9, 10, 14, 15, 18, 20, 21, 23, 24].includes(index) ? "bg-[#080A0F]" : "bg-[#D5A84C]/30"}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center">
            <QrCode className="mx-auto text-[#D5A84C]" size={24} />
            <p className="mt-3 text-lg font-black">barberiaos.com/r/tu-barberia</p>
            <p className="mt-1 text-sm text-white/45">Listo para escaparate, espejo, stories y Google.</p>
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function MarketingStudioSection() {
  return (
    <MotionBlock className="bg-[#F8F5EE] px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Marketing Studio"
          title="Llena huecos con mensajes listos para WhatsApp e Instagram."
          text="No se trata de publicar por publicar. Se trata de conectar huecos reales, clientes dormidos y campañas manuales que el dueño puede ejecutar rápido."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {marketingItems.map(([title, text, Icon]) => (
            <LuxuryFeatureCard key={title} title={title} text={text} icon={Icon} />
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function LuxuryFeatureCard({ title, text, icon: Icon }: FeatureItem) {
  return (
    <article className="rounded-[24px] border border-[#080A0F]/8 bg-white p-6 shadow-[0_18px_55px_rgba(8,10,15,0.07)]">
      <Icon size={22} className="text-[#9B6B18]" />
      <h3 className="mt-5 text-xl font-black">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#080A0F]/55">{text}</p>
    </article>
  );
}

export function VIPWebsiteOfferSection() {
  return (
    <MotionBlock id="web-vip" className="bg-[#050505] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D5A84C]">Web VIP para barberías</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
            También podemos convertir tu barbería en una marca premium online.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/62">
            Web profesional, QR de reservas, SEO local, WhatsApp, agenda online y BarberíaOS conectado. No es solo una página: es una máquina de reservas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Web premium", "SEO local", "QR de reservas", "Agenda online", "WhatsApp", "Sistema conectado"].map((item) => (
              <span key={item} className="rounded-full border border-[#D5A84C]/20 bg-[#D5A84C]/10 px-4 py-2 text-sm font-black text-[#F6D98A]">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.38)]">
          <div className="rounded-[26px] bg-[#F8F5EE] p-5 text-[#080A0F]">
            <div className="aspect-[4/3] rounded-[24px] bg-gradient-to-br from-[#080A0F] via-[#111827] to-[#D5A84C]/40 p-5 text-white">
              <p className="text-xs font-black uppercase text-[#D5A84C]">Barbería premium</p>
              <p className="mt-3 max-w-xs text-3xl font-black leading-tight">Tu marca, tus reservas, tu sistema.</p>
              <div className="mt-8 inline-flex rounded-full bg-[#D5A84C] px-4 py-2 text-sm font-black text-[#080A0F]">
                Reservar ahora
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["SEO local", "Google Business", "Instagram", "QR en local"].map((item) => (
                <div key={item} className="rounded-2xl border border-[#080A0F]/10 bg-white p-4 text-sm font-black">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function WebVipDeepDiveSection() {
  return (
    <MotionBlock className="bg-[#FBF7EF] px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9B6B18]">Web VIP conectada</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Si la barbería invierte en web, la web debe acabar en reserva.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#080A0F]/58">
              La anterior landing ya hablaba de Web VIP. La versión premium lo deja más claro: marca, SEO, WhatsApp, QR, agenda pública y BarberíaOS trabajando juntos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <RequestDemoLink className="bg-[#080A0F] text-white hover:bg-[#141821]">
                Ver propuesta VIP
              </RequestDemoLink>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#080A0F]/10 bg-white px-6 text-sm font-black text-[#080A0F]/72 transition hover:text-[#080A0F]"
              >
                Hablar por WhatsApp
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {vipWebsiteBlocks.map((block) => (
              <article key={block.title} className="rounded-[26px] border border-[#080A0F]/8 bg-white p-6 shadow-[0_18px_55px_rgba(8,10,15,0.06)]">
                <Gem className="text-[#9B6B18]" size={22} />
                <h3 className="mt-5 text-xl font-black">{block.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#080A0F]/56">{block.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function GrowthEnginePreviewSection() {
  return (
    <MotionBlock className="bg-[#080A0F] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Growth Engine"
          title="Convierte Instagram, WhatsApp y campañas en reservas reales."
          text="La landing ya no vende solo software operativo. Presenta una ruta premium de crecimiento conectada a reservas, caja, clientes y agenda."
          dark
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {growthEngineCards.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_22px_80px_rgba(0,0,0,0.22)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D5A84C]/20 bg-[#D5A84C]/10 text-[#F6D98A]">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/56">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-[32px] border border-[#D5A84C]/20 bg-[radial-gradient(circle_at_50%_0%,rgba(213,168,76,0.18),transparent_42%),rgba(255,255,255,0.055)] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D5A84C]">Sin automatizaciones prohibidas</p>
              <h3 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                Crecimiento legal, manual primero y preparado para APIs oficiales.
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/60">
                El enfoque correcto no es hacer bots. Es ordenar leads, plantillas, prompts, consentimientos, campañas y reportes para que el dueño sepa qué hacer.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Meta Graph API futuro", "WhatsApp Business Platform", "Private Replies oficiales", "Conversion API", "OpenAI/Ollama opcional", "Reportes por reserva"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm font-black text-white/72">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function TrustArchitectureSection() {
  return (
    <MotionBlock className="bg-white px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9B6B18]">Confianza técnica</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Premium también significa arquitectura responsable.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#080A0F]/58">
              El mensaje comercial debe reforzar lo que el producto promete: datos propios, multi-tenant, Supabase con RLS y nada de secretos en cliente.
            </p>
            <div className="mt-8 rounded-[26px] border border-[#080A0F]/8 bg-[#F8F5EE] p-5">
              <ShieldCheck className="text-[#9B6B18]" size={26} />
              <p className="mt-4 text-xl font-black">Diseñado para crecer sin mezclar datos.</p>
              <p className="mt-2 text-sm leading-7 text-[#080A0F]/55">
                Cada barbería necesita operar con su contexto, su agenda, sus clientes y su caja.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustItems.map(([title, text]) => (
              <article key={title} className="rounded-[24px] border border-[#080A0F]/8 bg-[#F8F5EE] p-5">
                <Database className="text-[#9B6B18]" size={20} />
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#080A0F]/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function LocalSeoSection() {
  return (
    <MotionBlock className="bg-[#050505] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D5A84C]">SEO local</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              La landing principal prepara el terreno para páginas locales y verticales.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/62">
              BarberíaOS ya tiene rutas SEO como software para barberías, agenda online, reservas y páginas por ciudad. Esta landing actúa como núcleo de autoridad.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["software barberías", "agenda online", "reservas sin comisión", "caja barbería"].map((item) => (
                <Pill key={item} dark>{item}</Pill>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-white/[0.055] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D5A84C]">Mapa de demanda</p>
                <h3 className="mt-2 text-2xl font-black">Ciudades prioritarias</h3>
              </div>
              <Search className="text-[#D5A84C]" size={26} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {localSeoCities.map((city) => (
                <div key={city} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-black text-white/72">
                  {city}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function FounderOfferSection() {
  return (
    <MotionBlock className="bg-[#FBF7EF] px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[36px] border border-[#080A0F]/8 bg-white p-6 shadow-[0_26px_90px_rgba(8,10,15,0.08)] md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D5A84C]/24 bg-[#D5A84C]/10 px-3 py-1.5 text-xs font-black text-[#9B6B18]">
                <Star size={14} />
                Barberías fundadoras
              </div>
              <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                Oferta premium para barberías que quieren moverse antes.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#080A0F]/58">
                Un paquete fundador permite vender con más fuerza: setup, QR, web/agenda, mensajes y ruta de crecimiento. No es descuento vacío; es acompañamiento operativo.
              </p>
              <div className="mt-8">
                <RequestDemoLink className="bg-[#080A0F] text-white hover:bg-[#141821]">
                  Solicitar plaza fundadora
                </RequestDemoLink>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {founderOfferItems.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#080A0F]/8 bg-[#F8F5EE] p-4">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#9B6B18]" size={18} />
                  <p className="text-sm font-bold leading-6 text-[#080A0F]/70">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function ProductProofSection() {
  return (
    <MotionBlock className="bg-[#080A0F] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Producto completo"
          title="Lo importante de BarberíaOS queda arriba, claro y vendible."
          text="Reservas, agenda, caja, clientes, barberos, QR, Marketing Studio, Growth Engine y Web VIP aparecen conectados como un sistema."
          dark
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proofMetrics.map(([title, text]) => (
            <article key={title} className="rounded-[26px] border border-white/10 bg-white/[0.055] p-5">
              <BookOpenCheck className="text-[#D5A84C]" size={22} />
              <h3 className="mt-4 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/56">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function ConversionBlueprintSection() {
  return (
    <MotionBlock className="bg-white px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Blueprint de conversión"
          title="La landing guía al dueño desde atención hasta ingresos."
          text="Un sitio premium no solo se ve caro. Ordena la decisión, reduce objeciones y muestra cómo el producto se convierte en operación diaria."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {conversionBlueprint.map(({ phase, title, text, icon: Icon, evidence }) => (
            <article key={phase} className="rounded-[28px] border border-[#080A0F]/8 bg-[#F8F5EE] p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#9B6B18]">{phase}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#080A0F] text-[#D5A84C]">
                  <Icon size={20} />
                </span>
              </div>
              <h3 className="mt-5 text-xl font-black leading-tight">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#080A0F]/56">{text}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {evidence.map((item) => (
                  <Pill key={item}>{item}</Pill>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function OwnerCommandRoomSection() {
  return (
    <MotionBlock className="bg-[#050505] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D5A84C]">Sala de mando</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              El dueño no necesita más ruido. Necesita saber qué hacer hoy.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/62">
              Este bloque refuerza la promesa principal: BarberíaOS traduce reservas, caja, equipo y clientes en decisiones simples.
            </p>
            <div className="mt-8 rounded-[30px] border border-[#D5A84C]/20 bg-[#D5A84C]/10 p-6">
              <div className="flex items-center gap-3">
                <Crown className="text-[#F6D98A]" size={26} />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D5A84C]">Prioridad de hoy</p>
                  <p className="text-xl font-black">Llenar el hueco de las 12:15 y cerrar caja sin errores.</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Copiar WhatsApp", "Ver cliente", "Asignar barbero", "Registrar cobro"].map((item) => (
                  <Pill key={item} dark>{item}</Pill>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ownerCommandPanels.map((panel) => (
              <article key={panel.title} className="rounded-[26px] border border-white/10 bg-white/[0.055] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/38">{panel.title}</p>
                    <p className="mt-2 text-2xl font-black text-white">{panel.metric}</p>
                  </div>
                  <ChevronRight className="text-[#D5A84C]" size={20} />
                </div>
                <p className="mt-3 text-sm leading-6 text-white/56">{panel.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function RouteAuthoritySection() {
  return (
    <MotionBlock className="bg-[#FBF7EF] px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Arquitectura SEO"
          title="La home conecta las rutas comerciales que ya existen en el proyecto."
          text="Aprovecha las dependencias y páginas instaladas sin añadir peso: más autoridad interna, más intención y más caminos hacia demo."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {premiumRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group rounded-[26px] border border-[#080A0F]/8 bg-white p-6 shadow-[0_18px_55px_rgba(8,10,15,0.06)] transition hover:-translate-y-1 hover:border-[#D5A84C]/30"
            >
              <div className="flex items-center justify-between gap-3">
                <Globe2 className="text-[#9B6B18]" size={22} />
                <ArrowRight className="text-[#080A0F]/28 transition group-hover:translate-x-1 group-hover:text-[#9B6B18]" size={18} />
              </div>
              <h3 className="mt-5 text-xl font-black">{route.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#080A0F]/56">{route.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function PremiumSignalMatrixSection() {
  return (
    <MotionBlock className="bg-[#080A0F] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D5A84C]">Matriz premium</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Cada bloque de la landing tiene una razón comercial.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/62">
              Esta matriz convierte el producto en argumentos de venta. Sirve para que el visitante entienda valor, operación y crecimiento sin leer documentación técnica.
            </p>
            <div className="mt-8 rounded-[28px] border border-[#D5A84C]/20 bg-[#D5A84C]/10 p-5">
              <Sparkles className="text-[#F6D98A]" size={26} />
              <p className="mt-4 text-xl font-black">Ultra premium no significa recargar.</p>
              <p className="mt-2 text-sm leading-7 text-white/58">
                Significa que cada sección ayuda a decidir, confiar o pedir demo.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {premiumSignalMatrix.map((signal) => (
              <article key={`${signal.group}-${signal.title}`} className="rounded-[26px] border border-white/10 bg-white/[0.055] p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#D5A84C]/20 bg-[#D5A84C]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#F6D98A]">
                    {signal.group}
                  </span>
                  <span className="rounded-full bg-white/[0.07] px-3 py-1 text-[11px] font-black text-white/58">
                    {signal.impact}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-black">{signal.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/56">{signal.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function LaunchChecklistSection() {
  return (
    <MotionBlock className="bg-white px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9B6B18]">Checklist de salida</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              La promesa premium se sostiene con una activación concreta.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#080A0F]/58">
              Este bloque baja la venta a ejecución. El dueño entiende que no compra una plantilla: compra un sistema que se deja preparado para operar.
            </p>
            <div className="mt-8 rounded-[28px] border border-[#080A0F]/8 bg-[#F8F5EE] p-5">
              <Rocket className="text-[#9B6B18]" size={26} />
              <p className="mt-4 text-xl font-black">Publicar solo cuando el flujo está probado.</p>
              <p className="mt-2 text-sm leading-7 text-[#080A0F]/55">
                Reserva, agenda, QR, caja, WhatsApp y panel del dueño deben tener sentido antes de empujar tráfico.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {launchChecklist.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#080A0F]/8 bg-[#F8F5EE] p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#080A0F] text-xs font-black text-[#D5A84C]">
                  {index + 1}
                </span>
                <p className="text-sm font-bold leading-6 text-[#080A0F]/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function ClosingArgumentsSection() {
  return (
    <MotionBlock className="bg-[#FBF7EF] px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Cierre comercial"
          title="La decisión queda reducida a una idea simple: control propio."
          text="Antes de enseñar precios, la landing recuerda los motivos por los que BarberíaOS es una compra estratégica para una barbería moderna."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {closingArguments.map((argument) => (
            <article key={argument.title} className="rounded-[26px] border border-[#080A0F]/8 bg-white p-6 shadow-[0_18px_55px_rgba(8,10,15,0.06)]">
              <CheckCircle2 className="text-[#9B6B18]" size={22} />
              <h3 className="mt-5 text-xl font-black">{argument.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#080A0F]/56">{argument.text}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function ExtendedFAQSection() {
  return (
    <MotionBlock className="bg-white px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Más dudas"
          title="Preguntas que aparecen cuando el dueño ya se está imaginando el cambio."
        />
        <div className="mt-10 divide-y divide-[#080A0F]/8 rounded-[28px] border border-[#080A0F]/8 bg-[#F8F5EE]">
          {faqPlus.map(([question, answer]) => (
            <article key={question} className="p-6">
              <h3 className="text-lg font-black">{question}</h3>
              <p className="mt-3 text-sm leading-7 text-[#080A0F]/56">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function PricingSection() {
  return (
    <MotionBlock id="precios" className="bg-white px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Planes"
          title="Precio fijo para operar mejor. Setup para salir bien."
          text="Mantén BarberíaOS mensual y añade setup desde 300€ para configurar servicios, barberos, QR, agenda y materiales iniciales."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex min-h-full flex-col rounded-[28px] p-7 ${
                plan.featured
                  ? "bg-[#080A0F] text-white shadow-[0_32px_90px_rgba(213,168,76,0.18)]"
                  : "border border-[#080A0F]/8 bg-[#F8F5EE] text-[#080A0F]"
              }`}
            >
              {plan.featured ? (
                <span className="absolute right-5 top-5 rounded-full bg-[#D5A84C] px-3 py-1 text-[11px] font-black text-[#080A0F]">
                  Más recomendado
                </span>
              ) : null}
              <h3 className="text-2xl font-black">{plan.name}</h3>
              <p className={`mt-3 text-sm leading-6 ${plan.featured ? "text-white/55" : "text-[#080A0F]/55"}`}>{plan.text}</p>
              <div className="mt-7 flex items-end gap-1">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className={`mb-1 text-sm font-bold ${plan.featured ? "text-white/38" : "text-[#080A0F]/38"}`}>/mes</span>
              </div>
              <ul className="mt-7 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className={`flex items-start gap-2.5 text-sm font-bold ${plan.featured ? "text-white/70" : "text-[#080A0F]/65"}`}>
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[#D5A84C]" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl text-sm font-black transition ${
                  plan.featured
                    ? "bg-[#D5A84C] text-[#080A0F] hover:bg-[#E8C46A]"
                    : "border border-[#080A0F]/10 bg-white text-[#080A0F]/70 hover:text-[#080A0F]"
                }`}
              >
                Pedir demo
                <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-[24px] border border-[#D5A84C]/20 bg-[#D5A84C]/8 p-5 text-center">
          <p className="text-sm font-black text-[#080A0F]">Setup desde 300€</p>
          <p className="mt-1 text-sm leading-6 text-[#080A0F]/55">
            Configuración inicial, servicios, barberos, QR, agenda pública y guía de activación. IVA y alcance final se confirman en demo.
          </p>
        </div>
      </div>
    </MotionBlock>
  );
}

export function FAQSection() {
  return (
    <MotionBlock className="bg-[#F8F5EE] px-5 py-16 text-[#080A0F] md:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow="FAQ" title="Objeciones normales antes de cambiar la forma de trabajar." />
        <div className="mt-10 divide-y divide-[#080A0F]/8 rounded-[28px] border border-[#080A0F]/8 bg-white">
          {faqs.map(([question, answer]) => (
            <article key={question} className="p-6">
              <h3 className="text-lg font-black">{question}</h3>
              <p className="mt-3 text-sm leading-7 text-[#080A0F]/56">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function FidelizacionSection() {
  return (
    <MotionBlock className="bg-[#050A14] px-5 py-24 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D5A84C]">
              Fidelización
            </p>
            <h2 className="mt-4 text-3xl font-black leading-[1.1] md:text-[2.6rem]">
              No solo llenes la agenda.
              <br />
              <span className="text-[#D5A84C]">Haz que tus clientes vuelvan.</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/60">
              Tarjeta de puntos digital con sellos automáticos al completar cita. El cliente
              ve su progreso desde un link o QR sin instalar ninguna app.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Sello automático al completar cita",
                "Recompensas configurables por la barbería",
                "QR o link — sin app para el cliente",
                "Progreso visible en ficha del cliente",
                "Campañas de recuperación desde Marketing Studio",
                "Sin coste adicional — incluido en el plan",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D5A84C]" />
                  <span className="text-sm text-white/72">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/programa-fidelizacion-barberias"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-[#D5A84C]/30 bg-[#D5A84C]/12 px-6 text-sm font-black text-[#D5A84C] transition hover:bg-[#D5A84C]/20"
              >
                Ver programa de fidelización
                <ChevronRight size={15} />
              </Link>
              <Link
                href="/tarjeta-puntos-digital-barberia"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.06] px-6 text-sm font-black text-white/70 transition hover:bg-white/[0.10]"
              >
                Tarjeta de puntos digital
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>

          {/* Loyalty card mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px]">
              <div className="rounded-[28px] border border-[#D5A84C]/28 bg-gradient-to-br from-[#0F1A2E] via-[#0B1220] to-[#050A14] p-6 shadow-[0_24px_80px_rgba(213,168,76,0.16)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#D5A84C]">
                      Tarjeta de fidelización
                    </p>
                    <p className="mt-0.5 text-base font-black text-white">Carlos Mendoza</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D5A84C]/15">
                    <Scissors size={18} className="text-[#D5A84C]" />
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex aspect-square items-center justify-center rounded-xl border text-[10px] ${
                        i < 7
                          ? "border-[#D5A84C]/60 bg-[#D5A84C]/20 text-[#D5A84C]"
                          : "border-white/10 bg-white/5 text-white/20"
                      }`}
                    >
                      {i < 7 ? (
                        <Star size={12} fill="currentColor" />
                      ) : (
                        <Star size={12} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-[11px] text-white/50">Próxima recompensa</p>
                    <p className="text-sm font-black text-white">3 visitas para corte gratis</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/50">Progreso</p>
                    <p className="text-lg font-black tabular-nums text-[#D5A84C]">7/10</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <QrCode size={14} className="text-white/40" />
                  <p className="text-[11px] text-white/40">barberiaos.com/fidelidad/carlos</p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -right-3 -top-3 rounded-2xl border border-[#10B981]/30 bg-[#10B981]/12 px-3 py-1.5 shadow-[0_8px_24px_rgba(16,185,129,0.18)]">
                <p className="text-xs font-black text-[#10B981]">+1 sello automático</p>
              </div>
              <div className="absolute -bottom-3 -left-3 rounded-2xl border border-[#D5A84C]/28 bg-[#050A14] px-3 py-1.5">
                <p className="text-xs font-black text-[#D5A84C]">Sin app · Sin fricción</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

export function FinalCTA() {
  return (
    <MotionBlock className="bg-[#050505] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[34px] border border-[#D5A84C]/22 bg-[radial-gradient(circle_at_50%_0%,rgba(213,168,76,0.22),transparent_46%),rgba(255,255,255,0.055)] p-8 text-center md:p-12">
        <BadgeEuro className="mx-auto text-[#D5A84C]" size={34} />
        <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
          Tu barbería necesita menos caos y más control.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/62">
          Mira BarberíaOS aplicado a reservas, agenda, caja, clientes, huecos libres, QR y marketing. Sin prometer resultados falsos, con una demo clara.
        </p>
        <div className="mt-8">
          <CTAButtons center />
        </div>
      </div>
    </MotionBlock>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] px-5 py-10 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-3">
            <BarberiaOSLogo variant="isotipo" size={40} />
            <span className="font-black tracking-tight">BarberíaOS</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-white/46">
            Sistema operativo para barberías: reservas, agenda, caja, clientes, huecos libres, QR, marketing e IA.
          </p>
        </div>
        <nav className="grid gap-3 text-sm font-bold text-white/50 sm:grid-cols-2 md:text-right" aria-label="Enlaces de pie de página">
          <Link href="/pedir-demo" className="hover:text-white">Pedir demo</Link>
          <Link href="/login" className="hover:text-white">Entrar al panel</Link>
          <Link href="/software-para-barberias" className="hover:text-white">Software para barberías</Link>
          <Link href="/agenda-online-barberia" className="hover:text-white">Agenda online</Link>
          <Link href="/legal/privacidad" className="hover:text-white">Privacidad</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            WhatsApp <ExternalLink className="inline" size={12} />
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-white/32">
        © {new Date().getFullYear()} BarberíaOS. Contacto: {BUSINESS_CONFIG.legalEmail}
      </p>
    </footer>
  );
}

export function UltraVipLanding() {
  return (
    <LandingExperience>
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-2xl focus:bg-[#D5A84C] focus:px-4 focus:py-2 focus:text-sm focus:font-black focus:text-[#080A0F]"
      >
        Saltar al contenido
      </a>
      <div id="contenido-principal">
        <PremiumHero />
        <GoldDivider />
        <ProblemCards />
        <OperatingSystemSection />
        <AgendaShowcase />
        <BeforeAfterSection />
        <ProductFeatureGrid />
        <RevenueEngineSection />
        <QRReservationSection />
        <MarketingStudioSection />
        <FidelizacionSection />
        <GrowthEnginePreviewSection />
        <VIPWebsiteOfferSection />
        <WebVipDeepDiveSection />
        <ImplementationSection />
        <TrustArchitectureSection />
        <LocalSeoSection />
        <FounderOfferSection />
        <ProductProofSection />
        <ConversionBlueprintSection />
        <OwnerCommandRoomSection />
        <RouteAuthoritySection />
        <PremiumSignalMatrixSection />
        <LaunchChecklistSection />
        <ClosingArgumentsSection />
        <PricingSection />
        <FAQSection />
        <ExtendedFAQSection />
        <FinalCTA />
        <Footer />
      </div>
    </LandingExperience>
  );
}
