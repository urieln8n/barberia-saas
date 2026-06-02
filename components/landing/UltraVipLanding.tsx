"use client";

import { useEffect, useState } from "react";
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
    name: "Arranca",
    price: "39€",
    text: "Para ordenar tu barbería desde el primer día. Reservas propias, agenda y caja sin depender de nadie.",
    highlight: "Ideal para 1-2 barberos",
    featured: false,
    groups: [
      {
        label: "Operación diaria",
        items: [
          "Agenda — Vista por día, semana y barbero",
          "Reservas online — Link y QR propios, sin comisión",
          "Huecos libres — Detecta horas vacías en la agenda",
          "Caja del día — Registra cobros y cierra el día",
          "Clientes — Historial y ficha de cada cliente",
        ],
      },
      {
        label: "Tu equipo",
        items: [
          "Barberos — Gestión de horarios por persona",
          "Servicios — Precios y duración configurables",
        ],
      },
      {
        label: "Presencia online",
        items: [
          "QR de reservas — Imprimible para mostrador o escaparate",
          "Página pública — Tu barbería online sin necesitar web",
          "Marketplace — Apareces en el directorio de BarberíaOS",
        ],
      },
      {
        label: "Administración",
        items: [
          "Pagos — Registro de cada cobro con método de pago",
          "Fiscalidad — Exporta datos para llevar la contabilidad",
        ],
      },
    ],
  },
  {
    name: "Control",
    price: "79€",
    text: "Para barberías con equipo que quieren control total, crecer y no perder un cliente.",
    highlight: "El más elegido — 3-5 barberos",
    featured: true,
    groups: [
      {
        label: "Todo lo del plan Arranca, más:",
        items: [],
      },
      {
        label: "Ingresos y negocio",
        items: [
          "Inventario — Controla stock y ventas de productos",
          "Finanzas — Ingresos, gastos y rentabilidad mensual",
          "Estadísticas — Rendimiento por barbero, servicio y período",
        ],
      },
      {
        label: "Crecer",
        items: [
          "Marketing Studio — Campañas para llenar huecos",
          "Reseñas — Consigue más valoraciones en Google",
          "Clientes perdidos — Recupera quien lleva semanas sin volver",
        ],
      },
      {
        label: "Presencia avanzada",
        items: [
          "Sala de espera — Pantalla con tu marca en recepción",
          "Automatizaciones — Recordatorios y mensajes automáticos",
        ],
      },
    ],
  },
  {
    name: "Domina",
    price: "149€",
    text: "Para dueños que quieren IA, fidelización activa y un sistema completo de crecimiento.",
    highlight: "Para barberías en expansión",
    featured: false,
    groups: [
      {
        label: "Todo lo del plan Control, más:",
        items: [],
      },
      {
        label: "IA y crecimiento",
        items: [
          "Agentes IA — Asistente inteligente para el dueño",
          "Growth Engine — Análisis avanzado de crecimiento",
          "Fidelización — Programa de puntos para clientes fieles",
        ],
      },
      {
        label: "Soporte prioritario",
        items: [
          "Onboarding dedicado — Setup completo con acompañamiento",
          "Optimización mensual — Revisión de métricas cada mes",
          "Acceso anticipado a nuevas funciones",
        ],
      },
    ],
  },
];

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

const testimonials = [
  {
    quote: "Antes gestionaba todo por WhatsApp y siempre había algún malentendido. Ahora los clientes reservan directamente y yo veo la agenda limpia desde el móvil.",
    name: "Óscar M.",
    role: "Dueño · Barbería & Co.",
    city: "Madrid",
    initial: "O",
    metric: "+8 reservas/semana",
    metricLabel: "desde que activó el QR",
  },
  {
    quote: "Lo que más me ha cambiado es ver los huecos libres en tiempo real. Antes los perdía sin darme cuenta. Ahora puedo enviar un mensaje y llenarlos.",
    name: "Rafa P.",
    role: "Barbero principal · The Fade Room",
    city: "Barcelona",
    initial: "R",
    metric: "380€/mes recuperados",
    metricLabel: "en huecos que antes perdía",
  },
  {
    quote: "La caja del día antes era un lío de notas. Ahora cierro en 2 minutos y sé exactamente qué entró y qué barbero rindió mejor.",
    name: "Javi L.",
    role: "Dueño · Corte & Barba",
    city: "Sevilla",
    initial: "J",
    metric: "4.9 ★ en Google",
    metricLabel: "subió de 3.8 en 3 meses",
  },
] as const;

const roiData = [
  { value: "5", label: "huecos libres/semana", sub: "en una barbería media sin sistema" },
  { value: "25€", label: "ingreso por servicio", sub: "ticket medio entre corte, degradado y barba" },
  { value: "500€", label: "pérdida mensual", sub: "huecos × precio × 4 semanas sin detectar" },
  { value: "79€", label: "BarberíaOS Pro/mes", sub: "inversión para recuperar todo ese margen" },
] as const;

const fidelizacionStats = [
  { metric: "7 visitas", label: "cliente frecuente", text: "Identifica a tus mejores clientes y sugiere el momento de recompensar o recuperar." },
  { metric: "+30 días", label: "sin visita detectada", text: "Detecta clientes que llevan tiempo sin volver antes de perderlos definitivamente." },
  { metric: "1 clic", label: "para recuperar", text: "Mensaje preparado con el nombre, historial y servicio habitual del cliente." },
  { metric: "0€", label: "coste extra", text: "La fidelización está dentro de BarberíaOS. Sin pagar por campaña ni por contacto." },
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
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl font-black leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">
        {title}
      </h2>
      {text ? (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#A1A1AA]">
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
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#F4D03F] to-[#D4AF37] px-7 text-sm font-black text-[#070707] shadow-[0_20px_60px_rgba(213,168,76,0.42),inset_0_1px_0_rgba(255,255,255,0.30)] transition hover:-translate-y-0.5 hover:from-[#EFD07C] hover:to-[#D4AF37] hover:shadow-[0_24px_70px_rgba(213,168,76,0.52)] active:scale-[0.98]"
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
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-white shadow-[0_18px_50px_rgba(255,255,255,0.14)] transition hover:-translate-y-0.5 hover:bg-[#0C0C0C] active:scale-[0.98] ${className}`}
    >
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}

function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 48);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#232323] bg-[#070707]/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]" aria-label="BarberíaOS inicio">
          <BarberiaOSLogo variant="isotipo" size={30} />
          <span className="text-sm font-black tracking-tight text-white">BarberíaOS</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-[#A1A1AA] lg:flex" aria-label="Navegación principal">
          <Link href="#reservas" className="transition-colors hover:text-white">Producto</Link>
          <Link href="#whatsapp" className="transition-colors hover:text-white">Funciones</Link>
          <Link href="#precios" className="transition-colors hover:text-white">Precios</Link>
          <Link href="/software-para-barberias" className="transition-colors hover:text-white">Recursos</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-medium text-[#A1A1AA] transition-colors hover:text-white sm:block">
            Entrar
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-[#D4AF37] px-4 text-xs font-black text-[#070707] transition hover:bg-[#F4D03F]"
          >
            Pedir demo
          </a>
        </div>
      </div>
    </header>
  );
}

function SocialProofBar() {
  const items = [
    { value: "200+", label: "barberías activas" },
    { value: "0%", label: "comisión por reserva" },
    { value: "5 min", label: "para la primera cita" },
    { value: "24/7", label: "reservas online" },
  ] as const;
  return (
    <div className="border-y border-[#232323] bg-[#111111] px-5 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-3xl font-black tracking-tight text-white">{value}</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  return (
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Lo que dicen los dueños"
          title="Barberías que ya operan con sistema."
          text="Dueños que pasaron de WhatsApp y libretas a una agenda clara, caja controlada y clientes que vuelven."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map(({ quote, name, role, city, initial, metric, metricLabel }) => (
            <article
              key={name}
              className="flex flex-col gap-4 rounded-[28px] border border-[#232323] bg-[#111111] p-7"
            >
              <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-4 py-3">
                <p className="text-xl font-black text-white">{metric}</p>
                <p className="mt-0.5 text-[11px] font-bold text-[#D4AF37]">{metricLabel}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-7 text-white/70">"{quote}"</p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111111] text-sm font-black text-[#D4AF37]">
                  {initial}
                </div>
                <div>
                  <p className="text-sm font-black text-white">{name}</p>
                  <p className="text-xs text-[#A1A1AA]">{role} · {city}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-[#A1A1AA]/60">
          Experiencias de dueños durante el onboarding y primeros meses de uso.
        </p>
      </div>
    </MotionBlock>
  );
}

function GoldDivider() {
  return (
    <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
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
          : "border-[#232323] bg-[#111111] text-[#A1A1AA]"
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
          <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-gradient-to-b from-[#D4AF37] to-[#D4AF37]/20" />
          <p className="text-3xl font-black text-white">{stat.value}</p>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">{stat.label}</p>
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
    gold: "border-[#D4AF37]/32 bg-[#D4AF37]/14 text-[#F4D03F]",
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
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D4AF37]">Panel BarberíaOS</p>
            <p className="mt-1 text-xl font-black text-white">Agenda operativa</p>
          </div>
          <div className="flex rounded-full border border-white/10 bg-white/[0.06] p-1 text-[11px] font-black text-white/52">
            {["Día", "Semana", "Mes"].map((item, index) => (
              <span key={item} className={`rounded-full px-3 py-1.5 ${index === 0 ? "bg-[#D4AF37] text-white" : ""}`}>
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
            <div className="mt-4 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-4">
              <p className="text-xs font-black text-[#F4D03F]">Próxima reserva</p>
              <p className="mt-2 text-sm font-bold text-white">11:30 · Corte + barba</p>
              <p className="text-xs text-white/45">Cliente: Andrés · Barbero: Diego</p>
            </div>
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-[#06080D] p-4">
            <div className="absolute left-0 right-0 top-[48%] h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_22px_rgba(213,168,76,0.70)]" />
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
                          : "border-[#D4AF37]/24 bg-[#D4AF37]/10"
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
    <section className="relative overflow-hidden bg-[#070707] px-5 pb-24 pt-32 text-white md:pb-32 lg:px-8">
      {/* Precise gold radial — top center only */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-5%,rgba(212,175,55,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_35%_20%_at_50%_-2%,rgba(244,208,63,0.10),transparent_45%)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#070707] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Live badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#232323] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-[#A1A1AA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
            Sistema operativo para barberías modernas
          </div>
        </div>

        {/* H1 — infrastructure positioning, Stripe-level */}
        <h1 className="mx-auto mt-7 max-w-4xl text-6xl font-black leading-[0.90] tracking-[-0.045em] text-white md:text-7xl lg:text-[88px]">
          El sistema operativo{" "}
          <span className="bg-gradient-to-b from-[#F4D03F] to-[#D4AF37] bg-clip-text text-transparent">
            de tu barbería.
          </span>
        </h1>

        {/* Sub — outcome-focused, confident */}
        <p className="mx-auto mt-7 max-w-xl text-xl leading-9 text-[#A1A1AA]">
          Reservas, agenda, caja, clientes y WhatsApp. Conectados. Sin comisiones, sin dependencias, desde el primer día.
        </p>

        {/* CTAs — centered */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-8 text-sm font-black text-[#070707] shadow-[0_0_0_1px_rgba(212,175,55,0.3),0_8px_32px_rgba(212,175,55,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#F4D03F] hover:shadow-[0_0_0_1px_rgba(244,208,63,0.4),0_12px_40px_rgba(212,175,55,0.35)] active:scale-[0.98]"
          >
            <MessageCircle size={16} />
            Pedir demo gratis
          </a>
          <Link
            href="#reservas"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[#232323] bg-white/[0.03] px-8 text-sm font-semibold text-[#A1A1AA] transition-all hover:border-[#333] hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
          >
            Ver cómo funciona
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Social proof inline */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-2">
            <div className="flex">
              {["bg-[#D4AF37]", "bg-emerald-500", "bg-sky-500", "bg-slate-600", "bg-rose-500"].map((bg, i) => (
                <div key={i} className={`-ml-1.5 first:ml-0 h-6 w-6 rounded-full border-2 border-[#070707] ${bg}`} />
              ))}
            </div>
            <span className="text-xs text-[#A1A1AA]">200+ barberías activas</span>
          </div>
          <span className="hidden text-[#232323] sm:block">·</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className="fill-[#D4AF37] text-[#D4AF37]" />
            ))}
          </div>
          <span className="text-xs text-[#A1A1AA]">4.9/5 · Sin comisión por reserva</span>
        </div>
      </div>

      {/* Dashboard — full width, below fold */}
      <div className="relative mx-auto mt-16 max-w-6xl">
        <div className="pointer-events-none absolute -inset-x-8 -bottom-16 top-8">
          <div className="h-full w-full bg-[radial-gradient(ellipse_50%_35%_at_50%_60%,rgba(212,175,55,0.06),transparent_70%)]" />
        </div>
        <div className="absolute -left-8 top-12 z-10 hidden xl:block">
          <FloatingMetricCard label="Hueco libre" value="Reservar ahora" tone="green" />
        </div>
        <div className="absolute -right-8 top-6 z-10 hidden xl:block">
          <FloatingMetricCard label="Caja de hoy" value="486€ registrados" tone="gold" />
        </div>
        <div className="absolute -bottom-4 left-16 z-10 hidden lg:block">
          <FloatingMetricCard label="Próxima reserva" value="11:30 · Corte + barba" tone="blue" />
        </div>
        <div className="absolute -bottom-3 right-16 z-10 hidden lg:block">
          <FloatingMetricCard label="QR activo" value="Instagram + mostrador" tone="zinc" />
        </div>
        <DashboardMockup />
      </div>
    </section>
  );
}

export function OperatingSystemSection() {
  return (
    <MotionBlock className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Arquitectura comercial</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Una landing premium debe vender el sistema, no solo una agenda bonita.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#A1A1AA]">
              Captación, conversión, operación y crecimiento conectados en una sola plataforma. Sin depender de mensajes sueltos, hojas o plataformas que cobran por cada reserva.
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
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#D4AF37]">{eyebrow}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/18 bg-[#D4AF37]/10 text-[#F4D03F]">
                    <Icon size={20} />
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/56">{text}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {points.map((point) => (
                    <span key={point} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] font-black text-[#A1A1AA]">
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
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Antes y después"
          title="De conversaciones sueltas a una barbería con sistema."
          text="Menos improvisación, más control y más reservas propias desde el primer día."
        />
        <div className="mt-10 overflow-hidden rounded-[30px] border border-[#232323] bg-white shadow-[0_22px_80px_rgba(8,10,15,0.08)]">
          <div className="grid grid-cols-[0.72fr_1fr_1fr] border-b border-[#232323] bg-[#111111] px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-white/60">
            <span>Área</span>
            <span>Sin sistema</span>
            <span>Con BarberíaOS</span>
          </div>
          {beforeAfterRows.map(([area, before, after]) => (
            <div key={area} className="grid gap-4 border-b border-[#232323]/60 px-5 py-5 last:border-b-0 md:grid-cols-[0.72fr_1fr_1fr]">
              <p className="text-sm font-black text-[#D4AF37]">{area}</p>
              <p className="text-sm leading-6 text-[#A1A1AA]">{before}</p>
              <p className="text-sm font-bold leading-6 text-white/76">{after}</p>
            </div>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function RevenueEngineSection() {
  return (
    <MotionBlock className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Motor de ingresos</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Cada parte del sistema está conectada con ingresos reales.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#A1A1AA]">
              Llenar agenda, recuperar clientes dormidos, controlar caja y operar con tus propios datos. Sin comisiones ni dependencia de plataformas externas.
            </p>
            <div className="mt-8 rounded-[26px] border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-5">
              <LineChart className="text-[#F4D03F]" size={26} />
              <p className="mt-4 text-xl font-black">Lectura de dueño</p>
              <p className="mt-2 text-sm leading-7 text-[#A1A1AA]">
                Qué entra hoy, qué se pierde esta semana, qué barbero tiene capacidad y qué acción comercial conviene lanzar.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {revenueLevers.map(({ title, metric, text, icon: Icon }) => (
              <article key={title} className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6">
                <Icon className="text-[#D4AF37]" size={24} />
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
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Implantación"
          title="Un SaaS premium necesita una activación premium."
          text="La propuesta no termina cuando alguien pulsa demo. La landing explica cómo se pasa de caos a sistema en pasos concretos."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          {implementationTimeline.map((step, index) => (
            <article key={step.day} className="relative rounded-[26px] border border-[#232323] bg-[#0C0C0C] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-sm font-black text-[#D4AF37]">
                {index + 1}
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.15em] text-[#D4AF37]">{step.day}</p>
              <h3 className="mt-2 text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function ProblemCards() {
  return (
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="El problema"
          title="Tu barbería pierde dinero cuando la agenda no está clara."
          text="Cada hueco vacío es dinero que tu barbería deja de ganar. Y el caos casi siempre empieza cuando todo depende de memoria, papel o WhatsApp."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problemCards.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-[24px] border border-[#232323] bg-white p-6 shadow-[0_16px_45px_rgba(8,10,15,0.06)]">
              <Icon className="text-[#D4AF37]" size={22} />
              <h3 className="mt-5 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function AgendaShowcase() {
  return (
    <MotionBlock id="funciona" className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
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
                <CheckCircle2 size={17} className="text-[#D4AF37]" />
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
          className={`px-5 py-16 md:py-24 lg:px-8 ${index % 2 === 0 ? "bg-[#0C0C0C] text-white" : "bg-[#111111] text-white"}`}
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className={index % 2 === 1 ? "lg:order-2" : ""}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">{section.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{section.title}</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#A1A1AA]">{section.text}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <span key={item} className="rounded-full border border-[#232323] bg-white px-3 py-2 text-xs font-black text-[#A1A1AA] shadow-sm">
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
    gold: "from-[#D4AF37]/24 to-[#080A0F] text-[#F4D03F]",
    green: "from-emerald-400/20 to-[#080A0F] text-emerald-200",
    blue: "from-sky-400/20 to-[#080A0F] text-sky-200",
    zinc: "from-zinc-300/14 to-[#080A0F] text-white/80",
  };

  return (
    <div className={`rounded-[30px] border border-white/10 bg-gradient-to-br ${accent[variant]} p-5 shadow-[0_28px_90px_rgba(8,10,15,0.18)]`}>
      <div className="rounded-[24px] border border-white/10 bg-[#111111] p-5 text-white">
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
                  <span className="rounded-full bg-[#D4AF37]/12 px-2 py-1 text-[10px] font-black text-[#F4D03F]">{status}</span>
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
    <MotionBlock className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">QR y reservas directas</p>
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
        <div className="rounded-[32px] border border-[#D4AF37]/20 bg-[#D4AF37]/8 p-6">
          <div className="mx-auto flex aspect-square max-w-[290px] items-center justify-center rounded-[30px] border border-white/14 bg-white p-7">
            <div className="grid h-full w-full grid-cols-5 gap-2">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  key={index}
                  className={`rounded-md ${[0, 1, 3, 5, 6, 9, 10, 14, 15, 18, 20, 21, 23, 24].includes(index) ? "bg-[#111111]" : "bg-[#D4AF37]/30"}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center">
            <QrCode className="mx-auto text-[#D4AF37]" size={24} />
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
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
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
    <article className="rounded-[24px] border border-[#232323] bg-white p-6 shadow-[0_18px_55px_rgba(8,10,15,0.07)]">
      <Icon size={22} className="text-[#D4AF37]" />
      <h3 className="mt-5 text-xl font-black">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
    </article>
  );
}

export function VIPWebsiteOfferSection() {
  return (
    <MotionBlock id="web-vip" className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Web VIP para barberías</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
            También podemos convertir tu barbería en una marca premium online.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#A1A1AA]">
            Web profesional, QR de reservas, SEO local, WhatsApp, agenda online y BarberíaOS conectado. No es solo una página: es una máquina de reservas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Web premium", "SEO local", "QR de reservas", "Agenda online", "WhatsApp", "Sistema conectado"].map((item) => (
              <span key={item} className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-sm font-black text-[#F4D03F]">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.38)]">
          <div className="rounded-[26px] bg-[#0C0C0C] p-5 text-white">
            <div className="aspect-[4/3] rounded-[24px] bg-gradient-to-br from-[#080A0F] via-[#111827] to-[#D4AF37]/40 p-5 text-white">
              <p className="text-xs font-black uppercase text-[#D4AF37]">Barbería premium</p>
              <p className="mt-3 max-w-xs text-3xl font-black leading-tight">Tu marca, tus reservas, tu sistema.</p>
              <div className="mt-8 inline-flex rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-black text-white">
                Reservar ahora
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["SEO local", "Google Business", "Instagram", "QR en local"].map((item) => (
                <div key={item} className="rounded-2xl border border-[#232323] bg-white p-4 text-sm font-black">
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
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Web VIP conectada</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Si la barbería invierte en web, la web debe acabar en reserva.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#A1A1AA]">
              La anterior landing ya hablaba de Web VIP. La versión premium lo deja más claro: marca, SEO, WhatsApp, QR, agenda pública y BarberíaOS trabajando juntos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <RequestDemoLink className="bg-[#111111] text-white hover:bg-[#141821]">
                Ver propuesta VIP
              </RequestDemoLink>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#232323] bg-white px-6 text-sm font-black text-white/72 transition hover:text-white"
              >
                Hablar por WhatsApp
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {vipWebsiteBlocks.map((block) => (
              <article key={block.title} className="rounded-[26px] border border-[#232323] bg-white p-6 shadow-[0_18px_55px_rgba(8,10,15,0.06)]">
                <Gem className="text-[#D4AF37]" size={22} />
                <h3 className="mt-5 text-xl font-black">{block.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">{block.text}</p>
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
    <MotionBlock className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#F4D03F]">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/56">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-[32px] border border-[#D4AF37]/20 bg-[radial-gradient(circle_at_50%_0%,rgba(213,168,76,0.18),transparent_42%),rgba(255,255,255,0.055)] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Sin automatizaciones prohibidas</p>
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
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Confianza técnica</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Premium también significa arquitectura responsable.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#A1A1AA]">
              El mensaje comercial debe reforzar lo que el producto promete: datos propios, multi-tenant, Supabase con RLS y nada de secretos en cliente.
            </p>
            <div className="mt-8 rounded-[26px] border border-[#232323] bg-[#0C0C0C] p-5">
              <ShieldCheck className="text-[#D4AF37]" size={26} />
              <p className="mt-4 text-xl font-black">Diseñado para crecer sin mezclar datos.</p>
              <p className="mt-2 text-sm leading-7 text-white/55">
                Cada barbería necesita operar con su contexto, su agenda, sus clientes y su caja.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustItems.map(([title, text]) => (
              <article key={title} className="rounded-[24px] border border-[#232323] bg-[#0C0C0C] p-5">
                <Database className="text-[#D4AF37]" size={20} />
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
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
    <MotionBlock className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">SEO local</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              La landing principal prepara el terreno para páginas locales y verticales.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#A1A1AA]">
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
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D4AF37]">Mapa de demanda</p>
                <h3 className="mt-2 text-2xl font-black">Ciudades prioritarias</h3>
              </div>
              <Search className="text-[#D4AF37]" size={26} />
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
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[36px] border border-[#232323] bg-white p-6 shadow-[0_26px_90px_rgba(8,10,15,0.08)] md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/24 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-black text-[#D4AF37]">
                <Star size={14} />
                Barberías fundadoras
              </div>
              <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                Oferta premium para barberías que quieren moverse antes.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#A1A1AA]">
                Un paquete fundador permite vender con más fuerza: setup, QR, web/agenda, mensajes y ruta de crecimiento. No es descuento vacío; es acompañamiento operativo.
              </p>
              <div className="mt-8">
                <RequestDemoLink className="bg-[#111111] text-white hover:bg-[#141821]">
                  Solicitar plaza fundadora
                </RequestDemoLink>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {founderOfferItems.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#232323] bg-[#0C0C0C] p-4">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#D4AF37]" size={18} />
                  <p className="text-sm font-bold leading-6 text-white/70">{item}</p>
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
    <MotionBlock className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Producto completo"
          title="Todo lo que necesita tu barbería, conectado."
          text="Reservas, agenda, caja, clientes, barberos, QR, Marketing Studio, Growth Engine y Web VIP en una sola plataforma sin comisión."
          dark
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proofMetrics.map(([title, text]) => (
            <article key={title} className="rounded-[26px] border border-white/10 bg-white/[0.055] p-5">
              <BookOpenCheck className="text-[#D4AF37]" size={22} />
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
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Blueprint de conversión"
          title="La landing guía al dueño desde atención hasta ingresos."
          text="Cada paso tiene un rol claro: atraer la atención, convencer al dueño, operar sin errores y hacer crecer la barbería con datos propios."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {conversionBlueprint.map(({ phase, title, text, icon: Icon, evidence }) => (
            <article key={phase} className="rounded-[28px] border border-[#232323] bg-[#0C0C0C] p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#D4AF37]">{phase}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-[#D4AF37]">
                  <Icon size={20} />
                </span>
              </div>
              <h3 className="mt-5 text-xl font-black leading-tight">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">{text}</p>
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
    <MotionBlock className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Sala de mando</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              El dueño no necesita más ruido. Necesita saber qué hacer hoy.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#A1A1AA]">
              BarberíaOS traduce reservas, caja, equipo y clientes en decisiones simples para cada jornada. Sin hojas, sin mensajes sueltos, sin perder el control.
            </p>
            <div className="mt-8 rounded-[30px] border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-6">
              <div className="flex items-center gap-3">
                <Crown className="text-[#F4D03F]" size={26} />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">Prioridad de hoy</p>
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
                  <ChevronRight className="text-[#D4AF37]" size={20} />
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
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
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
              className="group rounded-[26px] border border-[#232323] bg-white p-6 shadow-[0_18px_55px_rgba(8,10,15,0.06)] transition hover:-translate-y-1 hover:border-[#D4AF37]/30"
            >
              <div className="flex items-center justify-between gap-3">
                <Globe2 className="text-[#D4AF37]" size={22} />
                <ArrowRight className="text-[#A1A1AA]/50 transition group-hover:translate-x-1 group-hover:text-[#D4AF37]" size={18} />
              </div>
              <h3 className="mt-5 text-xl font-black">{route.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">{route.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function PremiumSignalMatrixSection() {
  return (
    <MotionBlock className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Matriz premium</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Cada bloque de la landing tiene una razón comercial.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#A1A1AA]">
              Esta matriz convierte el producto en argumentos de venta. Sirve para que el visitante entienda valor, operación y crecimiento sin leer documentación técnica.
            </p>
            <div className="mt-8 rounded-[28px] border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-5">
              <Sparkles className="text-[#F4D03F]" size={26} />
              <p className="mt-4 text-xl font-black">Ultra premium no significa recargar.</p>
              <p className="mt-2 text-sm leading-7 text-[#A1A1AA]">
                Significa que cada sección ayuda a decidir, confiar o pedir demo.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {premiumSignalMatrix.map((signal) => (
              <article key={`${signal.group}-${signal.title}`} className="rounded-[26px] border border-white/10 bg-white/[0.055] p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#F4D03F]">
                    {signal.group}
                  </span>
                  <span className="rounded-full bg-white/[0.07] px-3 py-1 text-[11px] font-black text-[#A1A1AA]">
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
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Checklist de salida</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Del primer clic al primer día operativo: sin improvisación.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#A1A1AA]">
              No es una plantilla. Es un sistema que se configura para funcionar desde el primer día: agenda, QR, caja, clientes y WhatsApp preparados antes de abrir.
            </p>
            <div className="mt-8 rounded-[28px] border border-[#232323] bg-[#0C0C0C] p-5">
              <Rocket className="text-[#D4AF37]" size={26} />
              <p className="mt-4 text-xl font-black">Publicar solo cuando el flujo está probado.</p>
              <p className="mt-2 text-sm leading-7 text-white/55">
                Reserva, agenda, QR, caja, WhatsApp y panel del dueño deben tener sentido antes de empujar tráfico.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {launchChecklist.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#232323] bg-[#0C0C0C] p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111111] text-xs font-black text-[#D4AF37]">
                  {index + 1}
                </span>
                <p className="text-sm font-bold leading-6 text-white/70">{item}</p>
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
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Cierre comercial"
          title="La decisión queda reducida a una idea simple: control propio."
          text="Seis motivos por los que BarberíaOS es la apuesta correcta para una barbería que quiere crecer con control y sin depender de plataformas externas."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {closingArguments.map((argument) => (
            <article key={argument.title} className="rounded-[26px] border border-[#232323] bg-white p-6 shadow-[0_18px_55px_rgba(8,10,15,0.06)]">
              <CheckCircle2 className="text-[#D4AF37]" size={22} />
              <h3 className="mt-5 text-xl font-black">{argument.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">{argument.text}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function ExtendedFAQSection() {
  return (
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Preguntas frecuentes"
          title="Las dudas más habituales antes de dar el paso."
        />
        <div className="mt-10 divide-y divide-[#232323] rounded-[28px] border border-[#232323] bg-[#0C0C0C]">
          {faqPlus.map(([question, answer]) => (
            <article key={question} className="p-6">
              <h3 className="text-lg font-black">{question}</h3>
              <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function PricingSection() {
  return (
    <MotionBlock id="precios" className="overflow-hidden bg-[#050505] px-5 py-24 text-white md:py-36 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ROI anchor pill */}
        <div className="mb-16 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#22C55E]/20 bg-[#22C55E]/8 px-5 py-2.5 shadow-[0_0_32px_rgba(34,197,94,0.08)]">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
            <p className="text-sm font-semibold text-white/75">
              5 huecos libres por semana a 25€ =
              <span className="ml-1.5 font-black text-[#22C55E]">+500€/mes recuperables</span>
              <span className="mx-2.5 text-white/20">·</span>
              Plan Control =
              <span className="ml-1.5 font-black text-white">79€/mes todo incluido</span>
            </p>
          </div>
        </div>

        {/* Header */}
        <SectionHeader
          eyebrow="Inversión"
          title="El coste de no tener sistema es siempre mayor."
          text="Precio fijo mensual. Sin comisión por reserva. Sin permanencia mínima."
        />

        {/* Cards */}
        <div className="relative mt-16">
          {/* Ambient glow under featured */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-[600px] -translate-x-1/2 rounded-full opacity-30 blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)" }}
          />

          <div className="relative grid gap-5 lg:grid-cols-3 lg:items-start">
            {plans.map((plan) => {
              const isFeatured = plan.featured;
              return (
                <article
                  key={plan.name}
                  className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
                    isFeatured
                      ? "rounded-[32px] shadow-[0_0_0_1px_rgba(212,175,55,0.40),0_48px_120px_rgba(0,0,0,0.6),0_0_80px_rgba(212,175,55,0.07)] lg:-translate-y-5 lg:scale-[1.04]"
                      : "rounded-[28px] border border-[#1A1A1A] shadow-[0_24px_64px_rgba(0,0,0,0.35)]"
                  }`}
                  style={isFeatured
                    ? { background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.10) 0%, transparent 60%), linear-gradient(170deg, #181818 0%, #101010 100%)" }
                    : { background: "linear-gradient(170deg, #0E0E0E 0%, #090909 100%)" }
                  }
                >
                  {/* Top shimmer line */}
                  {isFeatured && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px"
                      style={{ background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.75) 50%, transparent 95%)" }}
                    />
                  )}

                  {/* Recommended badge */}
                  {isFeatured && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-b-2xl bg-[#D4AF37] px-5 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#050505] shadow-[0_6px_24px_rgba(212,175,55,0.40)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#050505]/50" />
                        Más elegido
                      </span>
                    </div>
                  )}

                  <div className={`flex flex-1 flex-col ${isFeatured ? "p-9 pt-12" : "p-8"}`}>

                    {/* Plan identity */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#A1A1AA]/45">
                        {plan.name}
                      </p>
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-black leading-none ${
                        isFeatured
                          ? "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]"
                          : "border-white/[0.07] bg-white/[0.035] text-[#A1A1AA]/70"
                      }`}>
                        {plan.highlight}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-6 flex items-end gap-2">
                      <span className={`font-black leading-none tracking-tight ${isFeatured ? "text-[68px]" : "text-[58px]"} text-white`}>
                        {plan.price}
                      </span>
                      <div className="mb-2 flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-[#A1A1AA]/60">/ mes</span>
                        <span className="text-[10px] text-[#A1A1AA]/35">+ IVA</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-sm leading-7 text-[#A1A1AA]">{plan.text}</p>

                    {/* CTA — high on card for conversion */}
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-8 inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl text-sm font-black transition-all duration-200 ${
                        isFeatured
                          ? "bg-[#D4AF37] text-[#050505] shadow-[0_4px_20px_rgba(212,175,55,0.30)] hover:bg-[#EFC84A] hover:shadow-[0_8px_36px_rgba(212,175,55,0.45)] active:scale-[0.98]"
                          : "border border-[#252525] bg-white/[0.04] text-white/80 hover:border-[#D4AF37]/25 hover:bg-white/[0.07] hover:text-white active:scale-[0.98]"
                      }`}
                    >
                      <MessageCircle size={16} className="shrink-0" />
                      Empezar con {plan.name}
                    </a>

                    {/* Feature divider */}
                    <div className={`my-8 border-t ${isFeatured ? "border-[#D4AF37]/12" : "border-[#1C1C1C]"}`} />

                    {/* Feature groups */}
                    <div className="flex flex-1 flex-col gap-7">
                      {plan.groups.map((group) => {
                        const isInheritance = group.label.startsWith("Todo");
                        if (isInheritance) {
                          return (
                            <div
                              key={group.label}
                              className="flex items-center gap-2.5 rounded-2xl border border-[#22C55E]/15 bg-[#22C55E]/6 px-4 py-3"
                            >
                              <CheckCircle2 size={14} className="shrink-0 text-[#22C55E]" />
                              <span className="text-xs font-black text-[#22C55E]">{group.label}</span>
                            </div>
                          );
                        }
                        return (
                          <div key={group.label}>
                            <p className={`mb-3.5 text-[10px] font-black uppercase tracking-[0.18em] ${
                              isFeatured ? "text-[#D4AF37]/60" : "text-[#A1A1AA]/35"
                            }`}>
                              {group.label}
                            </p>
                            <ul className="flex flex-col gap-3.5">
                              {group.items.map((feature) => {
                                const dashIdx = feature.indexOf(" — ");
                                const name = dashIdx > -1 ? feature.slice(0, dashIdx) : feature;
                                const desc = dashIdx > -1 ? feature.slice(dashIdx + 3) : null;
                                return (
                                  <li key={feature} className="flex items-start gap-3">
                                    <div className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                                      isFeatured ? "bg-[#D4AF37]/14" : "bg-white/[0.05]"
                                    }`}>
                                      <CheckCircle2
                                        size={11}
                                        className={isFeatured ? "text-[#D4AF37]" : "text-[#A1A1AA]/60"}
                                      />
                                    </div>
                                    <span className="text-[13px] leading-[1.5]">
                                      <span className="font-black text-white/90">{name}</span>
                                      {desc && (
                                        <span className="text-[#A1A1AA]/60"> — {desc}</span>
                                      )}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom: Setup + Trust */}
        <div className="mt-12 grid gap-4 md:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col justify-center gap-1.5 rounded-[24px] border border-[#D4AF37]/18 bg-[#D4AF37]/5 p-7">
            <p className="text-base font-black text-white">Setup desde 300€</p>
            <p className="text-sm leading-6 text-[#A1A1AA]/70">
              Configuración inicial, servicios, barberos, QR, agenda pública y guía de activación incluidos. Alcance e IVA se confirman en demo.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-[24px] border border-[#1A1A1A] bg-[#0A0A0A] p-7">
            {[
              { label: "Sin permanencia", sub: "Cancela cuando quieras" },
              { label: "0% comisión", sub: "Por cada reserva, siempre" },
              { label: "Soporte en 24h", sub: "En español por WhatsApp" },
              { label: "Tus datos", sub: "Son siempre 100% tuyos" },
            ].map(({ label, sub }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-sm font-black text-white/90">
                  <CheckCircle2 size={13} className="shrink-0 text-[#D4AF37]" />
                  {label}
                </span>
                <span className="pl-[21px] text-xs text-[#A1A1AA]/50">{sub}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MotionBlock>
  );
}

export function FAQSection() {
  return (
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow="FAQ" title="Objeciones normales antes de cambiar la forma de trabajar." />
        <div className="mt-10 divide-y divide-[#232323] rounded-[28px] border border-[#232323] bg-[#111111]">
          {faqs.map(([question, answer]) => (
            <article key={question} className="p-6">
              <h3 className="text-lg font-black">{question}</h3>
              <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionBlock>
  );
}

export function FinalCTA() {
  return (
    <MotionBlock className="bg-[#070707] px-5 py-20 pb-36 text-white md:py-32 md:pb-32 lg:px-8">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[40px] border border-[#232323] bg-[#111111] p-10 text-center md:p-16">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 rounded-[40px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(212,175,55,0.10),transparent_60%)]" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#232323] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-[#A1A1AA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E]" />
            Demo disponible ahora
          </div>
          <h2 className="mx-auto mt-7 max-w-2xl text-4xl font-black leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">
            Tu barbería. Con sistema. Desde hoy.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#A1A1AA]">
            Una demo de 20 minutos. Sin presión, sin compromiso. Vemos juntos si BarberíaOS encaja con tu forma de trabajar.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-[#D4AF37] px-8 text-sm font-black text-[#070707] shadow-[0_0_0_1px_rgba(212,175,55,0.3),0_8px_32px_rgba(212,175,55,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#F4D03F] hover:shadow-[0_12px_40px_rgba(212,175,55,0.32)]"
            >
              <MessageCircle size={16} />
              Pedir demo por WhatsApp
            </a>
            <Link
              href="/login"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl border border-[#232333] bg-white/[0.04] px-8 text-sm font-semibold text-[#A1A1AA] transition-all hover:border-[#333] hover:text-white"
            >
              Entrar al panel
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#A1A1AA]/60">
            <span>Sin permanencia</span>
            <span>·</span>
            <span>Cancela cuando quieras</span>
            <span>·</span>
            <span>Respuesta en menos de 24h</span>
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#232323] bg-[#070707] px-5 py-12 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <BarberiaOSLogo variant="isotipo" size={32} />
              <span className="text-sm font-black tracking-tight text-white">BarberíaOS</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-[#A1A1AA]">
              El sistema operativo para barberías modernas.
            </p>
            <div className="mt-4 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className="fill-[#D4AF37] text-[#D4AF37]" />
              ))}
              <span className="ml-2 text-xs text-[#A1A1AA]">4.9 · 200+ barberías</span>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#A1A1AA]/60">Producto</p>
              <nav className="space-y-2.5 text-sm text-[#A1A1AA]" aria-label="Producto">
                <div><Link href="#reservas" className="transition-colors hover:text-white">Reservas online</Link></div>
                <div><Link href="#whatsapp" className="transition-colors hover:text-white">WhatsApp IA</Link></div>
                <div><Link href="#precios" className="transition-colors hover:text-white">Precios</Link></div>
                <div><Link href="/pedir-demo" className="transition-colors hover:text-white">Pedir demo</Link></div>
              </nav>
            </div>
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#A1A1AA]/60">Recursos</p>
              <nav className="space-y-2.5 text-sm text-[#A1A1AA]" aria-label="Recursos">
                <div><Link href="/software-para-barberias" className="transition-colors hover:text-white">Software barberías</Link></div>
                <div><Link href="/agenda-online-barberia" className="transition-colors hover:text-white">Agenda online</Link></div>
                <div><Link href="/huecos-libres-barberia" className="transition-colors hover:text-white">Huecos libres</Link></div>
                <div><Link href="/crm-clientes-barberia" className="transition-colors hover:text-white">CRM clientes</Link></div>
              </nav>
            </div>
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#A1A1AA]/60">Legal</p>
              <nav className="space-y-2.5 text-sm text-[#A1A1AA]" aria-label="Legal">
                <div><Link href="/legal/privacidad" className="transition-colors hover:text-white">Privacidad</Link></div>
                <div><Link href="/legal/cookies" className="transition-colors hover:text-white">Cookies</Link></div>
                <div><Link href="/login" className="transition-colors hover:text-white">Entrar al panel</Link></div>
                <div>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-white">
                    WhatsApp <ExternalLink size={11} />
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[#232323] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-[#A1A1AA]/40">
            © {new Date().getFullYear()} BarberíaOS. Contacto:{" "}
            <a href={`mailto:${BUSINESS_CONFIG.legalEmail}`} className="hover:text-[#A1A1AA]">{BUSINESS_CONFIG.legalEmail}</a>
          </p>
          <div className="flex items-center gap-4 text-xs text-[#A1A1AA]/40">
            <span>Hecho en España 🇪🇸</span>
            <span>·</span>
            <span>0% comisión por reserva</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ROISection() {
  return (
    <MotionBlock className="bg-[#070707] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Calculadora de huecos</p>
            <h2 className="mt-4 text-4xl font-black leading-[1.05] tracking-[-0.03em] md:text-6xl">
              ¿Cuánto dinero pierdes cada semana?
            </h2>
            <p className="mt-5 text-base leading-8 text-white/60">
              Una barbería media tiene{" "}
              <strong className="text-white">5 huecos libres por semana</strong>. A 25€ de media, eso son más de{" "}
              <strong className="text-white">500€ al mes</strong> que se evaporan sin sistema.
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-red-400/15 bg-red-400/8 px-5 py-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-red-400/70">Sin BarberíaOS</p>
                  <p className="mt-1 text-2xl font-black text-red-400">–500€/mes perdidos</p>
                </div>
                <TrendingUp size={22} className="shrink-0 text-red-400/50" />
              </div>
              <div className="flex items-center justify-center">
                <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-black text-white/30">vs</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-5 py-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-[#D4AF37]/70">Con BarberíaOS Pro</p>
                  <p className="mt-1 text-2xl font-black text-[#F4D03F]">79€/mes · ROI desde el día 1</p>
                </div>
                <TrendingUp size={22} className="shrink-0 text-[#D4AF37]" />
              </div>
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/8 px-5 py-4">
                <p className="text-[11px] font-black uppercase tracking-wide text-emerald-400">Recuperas al año</p>
                <p className="mt-1 text-3xl font-black text-emerald-300">+5.000€ de margen</p>
                <p className="mt-1 text-xs text-emerald-400/60">Calculado sobre 5 huecos/semana a 25€ · 52 semanas</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {roiData.map(({ value, label, sub }) => (
              <article key={label} className="rounded-[26px] border border-white/10 bg-white/[0.055] p-6">
                <p className="text-4xl font-black text-white">{value}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">{label}</p>
                <p className="mt-3 text-sm leading-6 text-white/50">{sub}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

function ReservasOnlineSection() {
  return (
    <MotionBlock id="reservas" className="bg-[#070707] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Reservas online"
          title="El cliente reserva solo. Sin llamadas ni WhatsApp."
          text="Una página pública con tus servicios, precios y disponibilidad real. El cliente elige barbero, día y hora — la reserva entra directa en tu agenda."
          dark
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {([
            { Icon: Globe2, title: "Página pública", text: "URL propia de tu barbería lista en minutos. Sin instalar app ni pagar marketplace." },
            { Icon: QrCode, title: "QR de mostrador", text: "Pega el QR en el espejo, la caja o Instagram. Reservas directas sin fricción." },
            { Icon: CalendarDays, title: "Disponibilidad real", text: "El cliente ve exactamente qué huecos hay. Sin llamar para preguntar si hay sitio." },
            { Icon: ShieldCheck, title: "Sin doble reserva", text: "El sistema bloquea el hueco en el momento en que el cliente confirma. Nunca falla." },
          ] as const).map(({ Icon, title, text }) => (
            <article key={title} className="rounded-[26px] border border-white/10 bg-white/[0.045] p-6 transition-colors hover:bg-white/[0.07]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/18 bg-[#D4AF37]/10 text-[#F4D03F]">
                <Icon size={20} />
              </div>
              <h3 className="mt-5 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/55">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[26px] border border-[#D4AF37]/18 bg-[#D4AF37]/8 p-5 sm:flex-row">
          <p className="text-sm font-black text-white">Comparte el link en Instagram y recibe la primera reserva hoy.</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 min-h-11 items-center gap-2 rounded-2xl bg-gradient-to-b from-[#F4D03F] to-[#D4AF37] px-5 text-sm font-black text-[#070707] shadow-[0_8px_30px_rgba(213,168,76,0.30)] transition hover:-translate-y-0.5"
          >
            Ver demo en vivo <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </MotionBlock>
  );
}

function WhatsAppIASection() {
  const messages = [
    { from: "bot", text: "Hola Carlos, tenemos un hueco libre esta tarde a las 17:00 con Andrés. ¿Te viene bien para tu corte habitual?" },
    { from: "client", text: "Sí perfecto, me apunto 👍" },
    { from: "bot", text: "¡Confirmado! Te esperamos a las 17:00. Cualquier cambio avisa. 💈" },
  ] as const;
  return (
    <MotionBlock id="whatsapp" className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="rounded-[28px] border border-white/10 bg-[#0D0D0D] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.50)]">
              <div className="flex items-center gap-3 border-b border-white/8 pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <MessageCircle size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-white">BarberíaOS IA</p>
                  <p className="text-xs text-white/40">Plantilla generada automáticamente</p>
                </div>
                <span className="ml-auto shrink-0 rounded-full bg-[#25D366]/15 px-2.5 py-1 text-[10px] font-black text-[#25D366]">Listo</span>
              </div>
              <div className="mt-4 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "client" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                      msg.from === "client" ? "bg-[#25D366]/18 text-white" : "bg-white/[0.07] text-white/80"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-3 text-center text-xs font-black text-[#F4D03F]">
                  Hueco llenado · +25€ recuperados
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">WhatsApp IA</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Llena huecos con el mensaje exacto. Sin improvisar.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/60">
              BarberíaOS detecta el hueco libre y genera el mensaje correcto para el cliente correcto en el momento adecuado. Tú decides si enviarlo.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Plantillas según el cliente y su servicio habitual",
                "Mensaje para huecos de hoy antes de que pasen",
                "Recuperación de clientes dormidos con tono natural",
                "Sin bots ni automatizaciones que violen los términos de WhatsApp",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/65">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-gradient-to-b from-[#F4D03F] to-[#D4AF37] px-7 text-sm font-black text-[#070707] shadow-[0_12px_40px_rgba(213,168,76,0.35)] transition hover:-translate-y-0.5"
              >
                <MessageCircle size={16} /> Ver demo en vivo
              </a>
            </div>
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

function FidelizacionSection() {
  return (
    <MotionBlock className="bg-[#0C0C0C] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Fidelización</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Recuperar un cliente cuesta menos que encontrar uno nuevo.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#A1A1AA]">
              BarberíaOS tiene memoria. Sabe quién lleva semanas sin volver, qué servicio prefiere y qué mensaje tiene más sentido mandar. Tú firmas y envías.
            </p>
            <div className="mt-8 rounded-[26px] border border-[#232323] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#111111] text-[#D4AF37]">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-[#A1A1AA]">Acción sugerida ahora</p>
                  <p className="text-sm font-black text-white">23 clientes sin visita en 30+ días</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="cursor-pointer rounded-full bg-[#111111] px-3 py-1.5 text-[11px] font-black text-[#D4AF37] transition hover:bg-[#1a1a1a]">Enviar mensaje</span>
                <span className="cursor-pointer rounded-full border border-[#232323] px-3 py-1.5 text-[11px] font-black text-white/60 transition hover:bg-white/[0.03]">Ver lista</span>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fidelizacionStats.map(({ metric, label, text }) => (
              <article key={label} className="rounded-[26px] border border-[#232323] bg-white p-5 shadow-[0_12px_40px_rgba(8,10,15,0.06)]">
                <p className="text-3xl font-black text-white">{metric}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#D4AF37]">{label}</p>
                <p className="mt-3 text-sm leading-6 text-white/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

function ResenasIASection() {
  return (
    <MotionBlock className="bg-[#111111] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="space-y-4">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.055] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4285F4]/20 text-[#4285F4]">
                    <Search size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white">Google Business</p>
                    <p className="text-[10px] text-white/40">Reseña recibida</p>
                  </div>
                  <div className="ml-auto flex shrink-0 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className="fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  "El mejor corte que me han hecho. Reservé online desde Instagram en 2 minutos y me llegó confirmación al instante."
                </p>
                <p className="mt-2 text-xs text-white/30">— Carlos M. · hace 2 días</p>
              </div>
              <div className="rounded-[26px] border border-[#D4AF37]/20 bg-[#D4AF37]/8 p-5">
                <p className="text-[10px] font-black uppercase tracking-wide text-[#D4AF37]">BarberíaOS sugiere</p>
                <p className="mt-2 text-sm font-black text-white">Cliente satisfecho · Enviar solicitud de reseña</p>
                <p className="mt-2 text-xs leading-5 text-white/60">
                  "Carlos, gracias por venir hoy. Si te ha gustado el resultado, nos ayudaría mucho una reseña en Google. Solo tarda 1 minuto 🙏"
                </p>
                <button type="button" className="mt-4 rounded-xl bg-[#D4AF37] px-4 py-2 text-xs font-black text-white transition hover:bg-[#F4D03F]">
                  Enviar por WhatsApp
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(["4.9 ★ media", "+47% reseñas", "2 min/solicitud"] as const).map((v) => (
                  <div key={v} className="rounded-2xl border border-white/8 bg-white/[0.04] p-3 text-center">
                    <p className="text-sm font-black text-white">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">Reseñas IA</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Cada cliente satisfecho puede traerte diez más.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/60">
              BarberíaOS detecta cuándo un cliente acaba de salir bien atendido y genera el mensaje exacto para pedirle una reseña en Google. Más estrellas, más visibilidad, más clientes nuevos.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Mensaje personalizado con el nombre del cliente",
                "Timing inteligente: justo después de la visita",
                "Tu puntuación Google sube mes a mes con menos esfuerzo",
                "Sin automatizaciones de terceros ni APIs no oficiales",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/65">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

function ManifiestoSection() {
  const principles = [
    {
      n: "01",
      title: "Tu cliente es tuyo.",
      text: "Cuando reserva contigo, los datos son tuyos. No de un marketplace que te cobra por cada cita y te puede desconectar mañana.",
    },
    {
      n: "02",
      title: "El sistema trabaja. Tú decides.",
      text: "BarberíaOS no automatiza lo que no debes automatizar. Te muestra qué hacer y tú eliges. La relación con el cliente siempre es humana.",
    },
    {
      n: "03",
      title: "Construido para crecer.",
      text: "No es una agenda online. Es la infraestructura para que tu barbería pase de sobrevivir a operar como una empresa que escala.",
    },
  ] as const;

  return (
    <MotionBlock className="bg-[#070707] px-5 py-20 text-white md:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
              Por qué existe BarberíaOS
            </p>
            <h2 className="mt-4 text-4xl font-black leading-[1.05] tracking-[-0.03em] md:text-5xl">
              Construido para las barberías que no quieren depender de nadie.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#A1A1AA]">
              Creemos que cada barbería merece el mismo nivel de tecnología que tienen las grandes empresas. Sin comisiones. Sin intermediarios. Con sus datos.
            </p>
            <div className="mt-8">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-[#D4AF37] px-7 text-sm font-black text-[#070707] shadow-[0_0_0_1px_rgba(212,175,55,0.25),0_8px_24px_rgba(212,175,55,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F4D03F]"
              >
                <MessageCircle size={15} />
                Hablar con el equipo
              </a>
            </div>
          </div>
          <div className="space-y-4">
            {principles.map(({ n, title, text }) => (
              <article
                key={n}
                className="group rounded-[28px] border border-[#232323] bg-[#111111] p-7 transition-colors hover:border-[#D4AF37]/25 hover:bg-[#141414]"
              >
                <div className="flex items-start gap-5">
                  <span className="shrink-0 text-[11px] font-black tabular-nums text-[#D4AF37]/50 mt-0.5">{n}</span>
                  <div>
                    <h3 className="text-xl font-black text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#A1A1AA]">{text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MotionBlock>
  );
}

function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          setVisible(window.scrollY > 700);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-4 bottom-4 z-50 hidden md:flex md:justify-center transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-2xl border border-white/12 bg-[#07090F]/95 px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        <div className="min-w-0">
          <p className="text-xs font-black text-white">BarberíaOS</p>
          <p className="text-[10px] text-white/45">Más reservas · Más caja · Sin caos</p>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 min-h-[38px] items-center gap-1.5 rounded-xl bg-gradient-to-b from-[#F4D03F] to-[#D4AF37] px-4 text-xs font-black text-[#070707] shadow-[0_6px_20px_rgba(213,168,76,0.40)] transition hover:from-[#EFD07C] hover:to-[#D4AF37]"
        >
          <MessageCircle size={13} />
          Pedir demo gratis
        </a>
      </div>
    </div>
  );
}

export function UltraVipLanding() {
  return (
    <LandingExperience>
      <StickyNav />
      <FloatingCTA />
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-2xl focus:bg-[#D4AF37] focus:px-4 focus:py-2 focus:text-sm focus:font-black focus:text-white"
      >
        Saltar al contenido
      </a>
      <div id="contenido-principal">
        {/* 1. Hook — quién eres y qué prometes */}
        <PremiumHero />
        <SocialProofBar />

        {/* 2. El problema y el coste de no actuar */}
        <ROISection />

        {/* 3. El sistema en acción — 4 capacidades core */}
        <ReservasOnlineSection />
        <WhatsAppIASection />
        <FidelizacionSection />
        <ResenasIASection />

        {/* 4. Antes vs después — elimina objeciones */}
        <BeforeAfterSection />

        {/* 5. Manifiesto — por qué existe, misión, confianza */}
        <ManifiestoSection />

        {/* 6. Prueba social — barberías reales con resultados */}
        <TestimonialsSection />

        {/* 6. Precio con contexto — el ROI ya está en la mente */}
        <PricingSection />

        {/* 7. Dudas y cierre */}
        <FAQSection />
        <FinalCTA />
        <Footer />
      </div>
    </LandingExperience>
  );
}
