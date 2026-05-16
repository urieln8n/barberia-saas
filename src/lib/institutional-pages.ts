import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export type InstitutionalPageKey =
  | "vision"
  | "mision"
  | "proposito"
  | "movimiento"
  | "impacto"
  | "academia"
  | "historias";

export type InstitutionalPage = {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  lead: string;
  primaryCta: string;
  primaryCtaHref?: string;
  secondaryCta: string;
  secondaryCtaHref?: string;
  stats?: Array<{ value: string; label: string }>;
  sections: Array<{
    eyebrow?: string;
    title: string;
    text: string;
    items?: string[];
  }>;
  featureGridTitle: string;
  featureGridText?: string;
  features: Array<{ title: string; text: string }>;
  highlight?: {
    eyebrow: string;
    title: string;
    text: string;
  };
  founderStatement?: boolean;
};

const sharedKeywords =
  "software para barberías, sistema para barberías, reservas para barberías, agenda para barberías, caja para barberías, gestión de clientes para barberías, software para barberos independientes";

const founderWhatsappUrl =
  `${BUSINESS_CONFIG.whatsappUrl.split("?")[0]}?text=Hola%2C%20quiero%20informaci%C3%B3n%20para%20unirme%20como%20barber%C3%ADa%20fundadora%20de%20Barber%C3%ADaOS.`;

export const institutionalPages: Record<InstitutionalPageKey, InstitutionalPage> = {
  vision: {
    path: "/vision",
    title: "Visión de BarberíaOS | Tecnología para barberías con propósito",
    description:
      "La visión de BarberíaOS: ayudar a barberías independientes a recuperar el control de su agenda, clientes, caja y crecimiento sin depender de comisiones abusivas.",
    eyebrow: "Visión de BarberíaOS",
    h1: "Tecnología para que cada barbería tenga más control, orden y libertad.",
    intro:
      "No estamos creando solo un software. Estamos construyendo una herramienta para que cada barbero tenga control, orden y libertad sobre su negocio.",
    lead:
      "BarberíaOS ayuda a las barberías a recuperar el control de su agenda, sus clientes, su caja y su crecimiento. La visión es clara: que miles de negocios locales puedan operar con herramientas modernas sin perder su independencia.",
    primaryCta: "Ver demo de BarberíaOS",
    secondaryCta: "Hablar por WhatsApp",
    stats: [
      { value: "1.000+", label: "barberías que queremos ayudar a ordenar" },
      { value: "0%", label: "comisión por reserva como principio de producto" },
      { value: "24/7", label: "reservas desde QR, enlace y página pública" },
    ],
    sections: [
      {
        eyebrow: "Largo plazo",
        title: "Digitalizar miles de barberías en España y Latinoamérica.",
        text:
          "La barbería independiente necesita tecnología pensada para su realidad: agenda rápida, clientes propios, caja clara, productos conectados y decisiones simples para crecer.",
      },
      {
        eyebrow: "Independencia",
        title: "Una alternativa moderna frente a plataformas con comisión.",
        text:
          "La tecnología debe servir al trabajador, no hacerlo depender de comisiones abusivas. BarberíaOS quiere que el dueño construya su propio sistema y conserve la relación con sus clientes.",
      },
      {
        eyebrow: "Dignidad operativa",
        title: "Un negocio pequeño también merece herramientas grandes.",
        text:
          "El tamaño de una barbería no debería limitar la calidad de sus herramientas. Orden, datos, automatización y marketing deben estar al alcance de quienes trabajan duro cada día.",
      },
    ],
    featureGridTitle: "Lo que queremos hacer posible",
    featureGridText:
      "Una visión no se sostiene con frases bonitas. Se sostiene con producto, soporte y decisiones que protegen al dueño.",
    features: [
      { title: "Agenda propia", text: "Reservas organizadas sin perder el contacto directo con el cliente." },
      { title: "Caja clara", text: "Ingresos, productos, propinas y cierre diario visibles para el dueño." },
      { title: "Clientes propios", text: "Historial, frecuencia y recuperación comercial dentro del sistema." },
      { title: "Crecimiento medible", text: "Señales para llenar huecos, pedir reseñas y reactivar clientes." },
    ],
    highlight: {
      eyebrow: "Principio",
      title: "Construir una herramienta útil antes que una plataforma extractiva.",
      text:
        "BarberíaOS existe para que la barbería gane control. El negocio debe crecer porque el producto resuelve un dolor real, no porque encierra al dueño en una dependencia injusta.",
    },
  },
  mision: {
    path: "/mision",
    title: "Misión de BarberíaOS | Ayudar a barberías a crecer con orden",
    description:
      "Misión de BarberíaOS: ayudar a barberías, barberos autónomos y pequeños negocios a crecer con reservas, agenda, caja, clientes, productos y tecnología simple.",
    eyebrow: "Misión práctica",
    h1: "Ayudar a barberías a crecer con orden, claridad y tecnología simple.",
    intro:
      "Nuestra misión es ayudar a barberías, barberos autónomos y pequeños negocios a organizar su agenda, automatizar reservas, cuidar clientes, controlar caja, vender productos y crecer sin depender de plataformas externas.",
    lead:
      "El objetivo no es añadir más pantallas al día del dueño. Es quitar caos: menos citas olvidadas, menos huecos vacíos, menos caja desordenada y más decisiones claras.",
    primaryCta: "Ver demo comercial",
    secondaryCta: "Pedir demo por WhatsApp",
    sections: [
      {
        title: "Problemas reales que resolvemos",
        text:
          "BarberíaOS nace de observar el día a día: mensajes sueltos, agenda rota, clientes que no vuelven, productos sin control y falta de seguimiento.",
        items: [
          "Citas olvidadas y huecos vacíos",
          "Clientes que no vuelven por falta de seguimiento",
          "Caja desordenada y productos sin control",
          "Dependencia de plataformas externas",
        ],
      },
      {
        title: "Cómo ayuda BarberíaOS",
        text:
          "Conecta reservas, QR, clientes, caja, barberos, servicios, productos, IA del dueño, Marketing Studio, reseñas y recordatorios en un solo sistema para barberías.",
        items: [
          "Reservas online y agenda para barberías",
          "Gestión de clientes, reseñas y recordatorios",
          "Caja diaria, productos y rendimiento de barberos",
          "Marketing Studio e IA para acciones concretas",
        ],
      },
      {
        title: "Una misión para negocios reales",
        text:
          "La misión se mide en menos estrés operativo, más control del dueño y más capacidad para atender mejor al cliente sin perder tiempo en tareas repetidas.",
      },
    ],
    featureGridTitle: "Áreas que ordena BarberíaOS",
    features: [
      { title: "Reservas", text: "Agenda online para barberías con enlace público, QR y disponibilidad visible." },
      { title: "Clientes", text: "Historial, frecuencia, notas y base propia para recuperar visitas." },
      { title: "Caja", text: "Cobros, métodos de pago, propinas, productos y cierre diario." },
      { title: "Crecimiento", text: "Campañas, reseñas, WhatsApp, huecos libres e IA del dueño." },
    ],
    highlight: {
      eyebrow: "Misión en una frase",
      title: "Convertir el caos diario de una barbería en un sistema claro de trabajo.",
      text:
        `Esa misión se apoya en ${sharedKeywords} y en una experiencia que el dueño pueda usar sin complicarse.`,
    },
  },
  proposito: {
    path: "/proposito",
    title: "Propósito de BarberíaOS | Software para barberías con impacto real",
    description:
      "Propósito de BarberíaOS: dignificar el trabajo de los barberos y ayudarles a vivir de su oficio con más orden, paz, control y tecnología justa.",
    eyebrow: "Propósito",
    h1: "Dignificar el trabajo de los barberos con tecnología que sirve.",
    intro:
      "BarberíaOS existe para dignificar el trabajo de los barberos y ayudarles a vivir de su oficio con más orden, paz y control.",
    lead:
      "La rentabilidad debe ser el fruto de servir bien, resolver un dolor real y construir con excelencia. Ese principio guía el producto, el diseño y la forma de acompañar a cada negocio.",
    primaryCta: "Conocer la demo",
    secondaryCta: "Hablar con BarberíaOS",
    sections: [
      {
        title: "Por qué existe BarberíaOS",
        text:
          "Porque detrás de cada barbería hay personas que madrugan, atienden clientes, pagan alquiler, sostienen familias y necesitan herramientas que les ayuden de verdad.",
      },
      {
        title: "A quién queremos ayudar",
        text:
          "A dueños de barbería, barberos independientes y equipos pequeños que quieren profesionalizar su negocio sin entregar sus clientes a plataformas que cobran por cada reserva.",
      },
      {
        title: "Construir con excelencia",
        text:
          "Excelencia significa cuidar el detalle, escribir buen software, diseñar con respeto por el usuario y tomar decisiones que reduzcan fricción en el trabajo diario.",
      },
    ],
    featureGridTitle: "Qué creemos",
    features: [
      { title: "Tecnología grande", text: "Creemos que un negocio pequeño merece tecnología grande." },
      { title: "Clientes propios", text: "Creemos que el barbero debe ser dueño de sus clientes y de su relación comercial." },
      { title: "Tecnología justa", text: "Creemos que la tecnología debe servir, no explotar ni crear dependencia injusta." },
      { title: "Orden que abre camino", text: "Creemos que el orden trae crecimiento, foco y mejores decisiones." },
    ],
    highlight: {
      eyebrow: "Principio fundador",
      title: "Servir bien primero.",
      text:
        "La rentabilidad no es el dios del proyecto. La rentabilidad debe ser el fruto de servir bien, resolver un dolor real y construir con excelencia.",
    },
    founderStatement: true,
  },
  movimiento: {
    path: "/movimiento",
    title: "Movimiento BarberíaOS | 1.000 barberías más ordenadas",
    description:
      "Movimiento 1000 Barberías Ordenadas: la meta de BarberíaOS para ayudar a barberías independientes a digitalizarse y generar reservas sin comisión.",
    eyebrow: "1000 Barberías Ordenadas",
    h1: "Un movimiento para que las barberías independientes recuperen el control.",
    intro:
      "Nuestra meta es ayudar a 1.000 barberías independientes a digitalizarse con orden.",
    lead:
      "Queremos que cada dueño pueda gestionar sus reservas, clientes y caja desde un sistema propio, sin depender siempre de terceros ni pagar comisión por cada cliente que vuelve.",
    primaryCta: "Únete como barbería fundadora",
    primaryCtaHref: founderWhatsappUrl,
    secondaryCta: "Hablar por WhatsApp",
    stats: [
      { value: "1.000", label: "barberías independientes digitalizadas con orden" },
      { value: "1.000.000", label: "reservas sin comisión como objetivo a largo plazo" },
      { value: "0", label: "comisión por cada cliente reservado" },
    ],
    sections: [
      {
        title: "Meta pública",
        text:
          "Ayudar a 1.000 barberías a gestionar sus reservas, clientes y caja desde un sistema propio.",
      },
      {
        title: "Sistema propio",
        text:
          "No queremos que el dueño dependa siempre de terceros. Queremos que construya su propio sistema, con su enlace, su QR, su agenda y sus clientes.",
      },
      {
        title: "Barberías pioneras",
        text:
          "El movimiento empieza con dueños que quieren ordenar su operación, probar una alternativa justa y construir una relación directa con sus clientes.",
      },
    ],
    featureGridTitle: "Lo que significa unirse",
    features: [
      { title: "Agenda ordenada", text: "Reservas para barberías desde un sistema claro y accesible." },
      { title: "Clientes que vuelven", text: "Gestión de clientes para barberías con historial y acciones de recuperación." },
      { title: "Caja bajo control", text: "Caja para barberías conectada a servicios, productos y cierre diario." },
      { title: "Menos dependencia", text: "Alternativa a plataformas de reservas con comisión por cliente." },
    ],
    highlight: {
      eyebrow: "Objetivo largo plazo",
      title: "1 millón de reservas sin comisión.",
      text:
        "Queremos ayudar a generar 1.000.000 de reservas sin comisión para barberías independientes. La reserva debe fortalecer al negocio, no descontarle margen cada vez que un cliente vuelve.",
    },
  },
  impacto: {
    path: "/impacto",
    title: "Impacto de BarberíaOS | Tecnología que ayuda a negocios reales",
    description:
      "Impacto de BarberíaOS en dueños, barberos, clientes y economía local: más control, menos caos, mejor experiencia y tecnología para negocios reales.",
    eyebrow: "Impacto real",
    h1: "Tecnología que ayuda a negocios reales, no solo a métricas de software.",
    intro:
      "BarberíaOS mide su impacto en dueños con más claridad, barberos con agenda mejor organizada, clientes con mejor experiencia y negocios con más control económico.",
    lead:
      "El impacto de un sistema para barberías no está solo en automatizar reservas. Está en reducir estrés, mejorar decisiones y hacer visible lo que antes quedaba perdido entre mensajes, papel y memoria.",
    primaryCta: "Ver demo de impacto",
    secondaryCta: "Hablar por WhatsApp",
    sections: [
      {
        title: "Impacto en dueños de barbería",
        text:
          "Más control, menos caos, más claridad y más clientes que vuelven porque el negocio deja de depender de apuntes dispersos.",
      },
      {
        title: "Impacto en barberos",
        text:
          "Agenda más organizada, servicios mejor registrados y comisiones o rendimiento más claros para trabajar con transparencia.",
      },
      {
        title: "Impacto en clientes",
        text:
          "Reservas más rápidas, menos esperas, mejor experiencia y una relación directa con la barbería que ya conocen.",
      },
    ],
    featureGridTitle: "Impacto por área",
    features: [
      { title: "Económico", text: "Menos citas perdidas, más ventas de productos y mejor caja diaria." },
      { title: "Educativo", text: "Academia BarberíaOS, guías de crecimiento y formación para dueños." },
      { title: "Operativo", text: "Agenda, servicios, barberos y productos conectados en un sistema para barberías." },
      { title: "Comercial", text: "Reseñas, recordatorios y recuperación de clientes con acciones simples." },
    ],
    highlight: {
      eyebrow: "Impacto empresarial",
      title: "Ayudar a que el dueño vea su negocio con claridad.",
      text:
        "Cuando el dueño entiende su agenda, su caja, sus clientes y sus productos, puede tomar mejores decisiones sin esperar a final de mes para descubrir qué pasó.",
    },
  },
  academia: {
    path: "/academia",
    title: "Academia BarberíaOS | Aprende a hacer crecer tu barbería",
    description:
      "Academia BarberíaOS enseñará a dueños de barberías a usar mejor su agenda, caja, clientes, marketing, productos, reseñas e Instagram para crecer.",
    eyebrow: "Academia BarberíaOS",
    h1: "Aprende a convertir tu barbería en un negocio más ordenado, rentable y profesional.",
    intro:
      "BarberíaOS no solo entrega software. También quiere enseñar a los dueños a usar mejor su agenda, caja, clientes, marketing, productos y reseñas.",
    lead:
      "La academia nace para traducir la tecnología en hábitos concretos: llenar huecos, recuperar clientes, pedir reseñas, controlar caja y medir si la barbería está creciendo.",
    primaryCta: "Ver demo del sistema",
    secondaryCta: "Quiero saber más",
    sections: [
      {
        title: "Formación para operar mejor",
        text:
          "Guías directas para que el dueño use sus datos sin complicarse: qué mirar, qué corregir y qué acción tomar esta semana.",
      },
      {
        title: "Marketing práctico",
        text:
          "WhatsApp, Instagram, reseñas y campañas de recuperación pensadas para barberías, no para negocios genéricos.",
      },
      {
        title: "Barbería Digital Certificada",
        text:
          "En el futuro, las barberías podrán obtener un sello de barbería digital certificada para demostrar que gestionan reservas, caja, clientes y experiencia con estándares profesionales.",
      },
    ],
    featureGridTitle: "Módulos futuros",
    features: [
      { title: "Llenar la agenda", text: "Cómo detectar huecos y convertirlos en reservas reales." },
      { title: "Recuperar clientes", text: "Cómo usar WhatsApp para reactivar clientes perdidos." },
      { title: "Pedir reseñas", text: "Cómo solicitar reseñas sin incomodar y mejorar reputación." },
      { title: "Controlar caja", text: "Cómo revisar caja diaria, productos y crecimiento semanal." },
      { title: "Vender productos", text: "Cómo conectar recomendación, stock y venta en mostrador." },
      { title: "Usar Instagram", text: "Cómo atraer reservas con publicaciones y llamadas a la acción claras." },
      { title: "Medir crecimiento", text: "Cómo saber si la barbería avanza con datos simples." },
      { title: "Profesionalizar el negocio", text: "Cómo convertir rutinas dispersas en procesos claros." },
    ],
    highlight: {
      eyebrow: "Educación",
      title: "Software más criterio de negocio.",
      text:
        "La herramienta ayuda, pero el crecimiento mejora cuando el dueño entiende qué hacer con su agenda, clientes, reseñas, caja y productos.",
    },
  },
  historias: {
    path: "/historias",
    title: "Historias BarberíaOS | Casos reales de barberías que crecen",
    description:
      "Historias BarberíaOS prepara casos reales de barberías que crecen. Ejemplos de impacto esperado sin testimonios inventados.",
    eyebrow: "Historias BarberíaOS",
    h1: "Historias que queremos construir junto a barberías reales.",
    intro:
      "Esta página está preparada para reunir casos reales cuando existan. Mientras tanto, mostramos escenarios de impacto esperado, no testimonios inventados.",
    lead:
      "Queremos documentar transformaciones honestas: de agenda desordenada a agenda controlada, de clientes perdidos a clientes reactivados, de caja confusa a caja clara y de dependencia de terceros a sistema propio.",
    primaryCta: "Ser barbería fundadora",
    secondaryCta: "Hablar por WhatsApp",
    sections: [
      {
        title: "De agenda desordenada a agenda controlada",
        text:
          "Escenario esperado: una barbería pasa de gestionar citas por mensajes dispersos a tener reservas online, horarios visibles y huecos claros.",
      },
      {
        title: "De clientes perdidos a clientes reactivados",
        text:
          "Escenario esperado: el dueño identifica clientes dormidos y lanza acciones de recuperación por WhatsApp o campañas simples.",
      },
      {
        title: "De caja confusa a caja clara",
        text:
          "Escenario esperado: servicios, productos, propinas y métodos de pago quedan registrados para cerrar el día con datos fiables.",
      },
    ],
    featureGridTitle: "Transformaciones que queremos construir",
    features: [
      { title: "Sistema propio", text: "La barbería deja de depender solo de plataformas externas." },
      { title: "Reservas sin comisión", text: "El cliente vuelve por un enlace propio sin descontar margen por cita." },
      { title: "Operación visible", text: "Barberos, servicios, caja y clientes dejan de vivir en sitios separados." },
      { title: "Casos reales próximos", text: "Cuando haya datos y permiso, publicaremos historias reales con nombres y contexto." },
    ],
    highlight: {
      eyebrow: "Próximamente",
      title: "Casos reales, sin testimonios falsos.",
      text:
        "No vamos a inventar resultados. Las historias reales se publicarán cuando existan barberías que acepten compartir su proceso, sus aprendizajes y su impacto.",
    },
  },
};

export const institutionalPageList = Object.values(institutionalPages).map((page) => ({
  path: page.path,
  title: page.title,
  description: page.description,
}));

export function getInstitutionalPageJsonLd(page: InstitutionalPage) {
  const pageUrl = `${BUSINESS_CONFIG.siteUrl}${page.path}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${BUSINESS_CONFIG.siteUrl}/#organization`,
      name: BUSINESS_CONFIG.commercialName,
      url: BUSINESS_CONFIG.siteUrl,
      email: BUSINESS_CONFIG.legalEmail,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: BUSINESS_CONFIG.supportEmail,
        url: `${BUSINESS_CONFIG.siteUrl}/demo`,
        areaServed: ["ES", "LatAm"],
        availableLanguage: ["es"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.title,
      description: page.description,
      inLanguage: "es-ES",
      isPartOf: {
        "@type": "WebSite",
        name: BUSINESS_CONFIG.commercialName,
        url: BUSINESS_CONFIG.siteUrl,
      },
      publisher: {
        "@id": `${BUSINESS_CONFIG.siteUrl}/#organization`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: BUSINESS_CONFIG.siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.eyebrow,
          item: pageUrl,
        },
      ],
    },
  ];
}
