import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export type LegalTable = {
  headers: string[];
  rows: string[][];
};

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: LegalTable;
};

export type LegalPageContent = {
  slug: string;
  href: string;
  title: string;
  description: string;
  lastUpdated: string;
  summary: string[];
  sections: LegalSection[];
};

export const LEGAL_LAST_UPDATED = BUSINESS_CONFIG.lastUpdated;
export const PENDING = "Información configurable según el servicio contratado";
const COMMERCIAL_NAME = BUSINESS_CONFIG.commercialName;
const LEGAL_OWNER = BUSINESS_CONFIG.legalOwner;
const LEGAL_EMAIL = BUSINESS_CONFIG.legalEmail;
const PRIVACY_EMAIL = BUSINESS_CONFIG.privacyEmail;
const SUPPORT_EMAIL = BUSINESS_CONFIG.supportEmail;
const DOMAIN = BUSINESS_CONFIG.domain;
const ADDRESS = BUSINESS_CONFIG.registeredAddress;
const TAX_ID = BUSINESS_CONFIG.taxId;
const JURISDICTION = BUSINESS_CONFIG.jurisdiction;
const APPLICABLE_LAW = BUSINESS_CONFIG.applicableLaw;
const COOKIE_SETTINGS_URL = BUSINESS_CONFIG.cookieSettingsUrl;

export const legalPages: LegalPageContent[] = [
  {
    slug: "aviso-legal",
    href: "/legal/aviso-legal",
    title: "Aviso Legal",
    description: "Información identificativa del titular del sitio, condiciones generales de uso y marco aplicable a BarberíaOS.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      `Nombre comercial: ${COMMERCIAL_NAME}.`,
      "Actividad: software SaaS para gestión de barberías, reservas, agenda, caja, QR, reportes y suscripciones.",
      "La información identificativa y de contacto se publica de forma centralizada en este documento y puede actualizarse para comunicaciones formales.",
    ],
    sections: [
      {
        id: "titular",
        title: "Titular del sitio",
        paragraphs: [
          `Nombre comercial: ${COMMERCIAL_NAME}.`,
          `Denominación social o autónomo: ${LEGAL_OWNER}.`,
          `NIF/CIF: ${TAX_ID}.`,
          `Domicilio: ${ADDRESS}.`,
          `Email legal: ${LEGAL_EMAIL}.`,
          `Dominio web: ${DOMAIN}.`,
          "Actividad: software SaaS para gestión de barberías, reservas online, clientes, barberos, servicios, agenda, caja/TPV, QR de reservas, reportes, comunicaciones y suscripciones.",
        ],
      },
      {
        id: "uso",
        title: "Condiciones de uso del sitio",
        paragraphs: [
          "El acceso y uso del sitio web implica la aceptación de este aviso legal y de las políticas que resulten aplicables en cada momento.",
          "El usuario se compromete a utilizar el sitio de forma lícita, diligente y conforme a la buena fe, evitando cualquier uso que pueda dañar BarberíaOS, a otros usuarios o a terceros.",
        ],
      },
      {
        id: "responsabilidad",
        title: "Responsabilidad del titular y del usuario",
        paragraphs: [
          "El titular procurará mantener el sitio disponible, seguro y actualizado, sin garantizar la ausencia total de interrupciones, errores o incidencias técnicas.",
          "El usuario responde de la veracidad de los datos que facilite y del uso que realice del sitio, del software y de las funcionalidades contratadas.",
        ],
      },
      {
        id: "enlaces",
        title: "Enlaces externos",
        paragraphs: [
          "El sitio puede incluir enlaces a páginas o servicios de terceros. BarberíaOS no controla ni asume responsabilidad sobre sus contenidos, políticas o prácticas.",
        ],
      },
      {
        id: "propiedad",
        title: "Propiedad intelectual",
        paragraphs: [
          "El software, diseño, marca, textos, interfaces, estructura y elementos visuales de BarberíaOS están protegidos por derechos de propiedad intelectual o industrial, salvo indicación expresa en contrario.",
        ],
      },
      {
        id: "ley",
        title: "Legislación aplicable y jurisdicción",
        paragraphs: [
          `Legislación aplicable: ${APPLICABLE_LAW}.`,
          `Jurisdicción competente: ${JURISDICTION}.`,
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "privacidad",
    href: "/legal/privacidad",
    title: "Política de Privacidad",
    description: "Información por capas sobre el tratamiento de datos personales en BarberíaOS conforme al RGPD y la LOPDGDD.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      `Responsable: ${LEGAL_OWNER}.`,
      "Finalidades principales: crear cuenta, prestar el servicio SaaS, gestionar reservas, soporte, seguridad, facturación y comunicaciones con consentimiento cuando corresponda.",
      "Derechos: acceso, rectificación, supresión, oposición, portabilidad y limitación.",
    ],
    sections: [
      {
        id: "primera-capa",
        title: "Primera capa informativa",
        table: {
          headers: ["Apartado", "Información"],
          rows: [
            ["Responsable", LEGAL_OWNER],
            ["Finalidades", "Cuenta, SaaS, reservas, clientes, barberos, pagos/suscripciones si aplica, soporte, seguridad, comunicaciones comerciales con consentimiento y mejora del producto."],
            ["Legitimación", "Ejecución de contrato, consentimiento, interés legítimo y obligación legal según el tratamiento."],
            ["Destinatarios", "Proveedores necesarios para prestar el servicio y terceros legalmente exigibles."],
            ["Derechos", "Acceso, rectificación, supresión, oposición, portabilidad y limitación."],
            ["Conservación", "Durante la relación contractual y los plazos legales aplicables."],
            ["Información adicional", "Disponible en la segunda capa de esta política."],
          ],
        },
      },
      {
        id: "responsable",
        title: "Responsable del tratamiento",
        paragraphs: [
          `Responsable: ${LEGAL_OWNER}.`,
          `Email de privacidad: ${PRIVACY_EMAIL}.`,
          `Domicilio: ${ADDRESS}.`,
          "Cuando BarberíaOS trata datos de clientes finales por cuenta de una barbería cliente, BarberíaOS puede actuar como encargado del tratamiento conforme al Acuerdo de Encargo de Tratamiento.",
        ],
      },
      {
        id: "datos",
        title: "Datos tratados",
        bullets: [
          "Datos de contacto: nombre, email, teléfono y datos profesionales.",
          "Datos de cuenta: identificadores, credenciales gestionadas por el proveedor de autenticación y perfil de usuario.",
          "Datos de barbería: nombre comercial, slug público, ciudad, dirección, teléfono, enlaces públicos y configuración del negocio.",
          "Datos de reservas: servicio, barbero, fecha, hora, estado, precio y notas operativas si existieran.",
          "Datos de clientes finales: nombre, teléfono, email opcional y datos necesarios para gestionar la cita.",
          "Datos de barberos/empleados: nombre, rol, disponibilidad, actividad asociada y rendimiento operativo.",
          "Datos de facturación: plan, estado de suscripción, identificadores de cliente y datos necesarios para emitir facturas si aplica.",
          "Datos técnicos: IP, dispositivo, navegador, logs, eventos de seguridad y datos de uso.",
          "Datos de comunicaciones: mensajes de soporte, emails transaccionales y preferencias comerciales.",
        ],
      },
      {
        id: "finalidades",
        title: "Finalidades del tratamiento",
        bullets: [
          "Crear y administrar la cuenta de usuario.",
          "Prestar el servicio SaaS contratado.",
          "Gestionar reservas online y disponibilidad.",
          "Gestionar clientes, barberos, servicios, caja y reportes.",
          "Procesar pagos y suscripciones si aplica.",
          "Prestar soporte técnico y atención al cliente.",
          "Mantener la seguridad, prevenir fraude y resolver incidencias.",
          "Enviar comunicaciones comerciales cuando exista consentimiento u otra base válida.",
          "Mejorar el producto mediante métricas agregadas o información operativa no excesiva.",
        ],
      },
      {
        id: "base-juridica",
        title: "Base jurídica",
        bullets: [
          "Ejecución de contrato: alta, acceso, prestación del SaaS, soporte y facturación.",
          "Consentimiento: comunicaciones comerciales, cookies no necesarias y preferencias opcionales.",
          "Interés legítimo: seguridad, prevención de abuso, mejora razonable del servicio y comunicaciones operativas a clientes existentes cuando proceda.",
          "Obligación legal: conservación fiscal, contable, atención de requerimientos y cumplimiento normativo.",
        ],
      },
      {
        id: "destinatarios",
        title: "Cesiones, proveedores y transferencias internacionales",
        paragraphs: [
          "BarberíaOS podrá trabajar con proveedores tecnológicos necesarios para hosting, base de datos, autenticación, pagos, email, comunicaciones o analítica si procede.",
          "No se venderán datos personales a terceros.",
          "Las transferencias internacionales, si existieran, deberán apoyarse en garantías adecuadas conforme al RGPD, como decisiones de adecuación o cláusulas contractuales tipo.",
        ],
      },
      {
        id: "derechos",
        title: "Derechos ARSOPL y reclamaciones",
        paragraphs: [
          `Las personas interesadas pueden ejercer sus derechos de acceso, rectificación, supresión, oposición, portabilidad y limitación escribiendo a ${PRIVACY_EMAIL}.`,
          "También pueden presentar una reclamación ante la Agencia Española de Protección de Datos si consideran que el tratamiento no se ajusta a la normativa aplicable.",
        ],
      },
      {
        id: "conservacion",
        title: "Conservación, seguridad y menores",
        paragraphs: [
          "Los datos se conservarán durante la relación contractual y, posteriormente, durante los plazos necesarios para atender responsabilidades legales, fiscales, técnicas o contractuales.",
          "BarberíaOS aplicará medidas técnicas y organizativas razonables para proteger los datos frente a accesos no autorizados, pérdida, alteración o divulgación indebida.",
          "El servicio está dirigido a profesionales y negocios. No está orientado a menores de edad.",
        ],
      },
      {
        id: "cambios",
        title: "Cambios y contacto",
        paragraphs: [
          "Esta política podrá actualizarse para reflejar cambios legales, técnicos o de producto.",
          `Contacto privacidad: ${PRIVACY_EMAIL}.`,
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "cookies",
    href: "/legal/cookies",
    title: "Política de Cookies",
    description: "Información sobre cookies técnicas, preferencias, analíticas y marketing, con una tabla editable para completar antes de producción.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "Las cookies necesarias pueden usarse para prestar el servicio.",
      "Las cookies analíticas o de marketing no deben cargarse hasta tener consentimiento.",
      "La tabla de cookies queda preparada para completar con proveedores reales.",
    ],
    sections: [
      {
        id: "que-son",
        title: "Qué son las cookies",
        paragraphs: [
          "Las cookies son pequeños archivos o tecnologías similares que permiten almacenar o recuperar información en el dispositivo del usuario cuando visita un sitio web o usa una aplicación.",
        ],
      },
      {
        id: "tipos",
        title: "Tipos de cookies",
        bullets: [
          "Técnicas o necesarias: permiten navegación, seguridad, sesión, consentimiento y funcionamiento básico.",
          "Preferencias: recuerdan opciones de configuración no esenciales.",
          "Analíticas: ayudan a entender el uso del producto de forma agregada.",
          "Marketing o publicidad: permiten medir campañas o personalizar comunicaciones comerciales si aplica.",
        ],
      },
      {
        id: "quien",
        title: "Quién utiliza cookies",
        bullets: [
          "Cookies propias: gestionadas por BarberíaOS o por su dominio.",
          "Cookies de terceros: gestionadas por proveedores externos cuando se integren servicios como pagos, analítica, soporte o marketing.",
        ],
      },
      {
        id: "tabla",
        title: "Tabla editable de cookies",
        table: {
          headers: ["Nombre", "Proveedor", "Finalidad", "Duración", "Tipo", "Base legal"],
          rows: [
            ["barberiaos:cookie-consent", "BarberíaOS", "Guardar preferencias de cookies", "Persistente local", "Necesaria", "Interés legítimo / obligación normativa"],
            ["sb-*", "Supabase", "Autenticación y sesión, si aplica", PENDING, "Técnica", "Ejecución de contrato"],
            [PENDING, PENDING, PENDING, PENDING, "Analítica", "Consentimiento"],
            [PENDING, PENDING, PENDING, PENDING, "Marketing", "Consentimiento"],
          ],
        },
      },
      {
        id: "gestionar",
        title: "Cómo aceptar, rechazar o configurar",
        paragraphs: [
          "El banner de cookies permite aceptar todas, rechazar las no necesarias o configurar preferencias por categoría.",
          "El consentimiento puede retirarse eliminando las preferencias guardadas en el navegador o mediante el panel de configuración cuando esté disponible.",
          `Enlace a configuración de cookies: ${COOKIE_SETTINGS_URL}.`,
        ],
      },
      {
        id: "necesarias",
        title: "Cookies necesarias",
        paragraphs: [
          "Las cookies o tecnologías necesarias no requieren consentimiento cuando son imprescindibles para prestar un servicio solicitado por el usuario o cumplir obligaciones técnicas y de seguridad.",
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "terminos",
    href: "/legal/terminos",
    title: "Términos y Condiciones del Servicio",
    description: "Condiciones generales de uso del SaaS BarberíaOS para barberías, titulares de cuenta y usuarios autorizados.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "BarberíaOS es una herramienta tecnológica B2B para barberías.",
      "La barbería cliente es responsable del uso de su cuenta, datos introducidos y relación con sus clientes finales.",
      "El servicio puede cambiar, suspenderse o mantenerse conforme a estas condiciones.",
    ],
    sections: [
      {
        id: "objeto",
        title: "Objeto del servicio",
        paragraphs: [
          "BarberíaOS es un software SaaS vertical para barberías que facilita reservas online, gestión de agenda, clientes, barberos, servicios, caja/TPV, QR, reportes y suscripciones.",
          "Estas condiciones regulan el acceso y uso del servicio por parte de barberías, titulares de cuenta, administradores y usuarios autorizados.",
        ],
      },
      {
        id: "uso",
        title: "Quién puede usarlo y registro",
        paragraphs: [
          "El servicio está dirigido a profesionales, autónomos, sociedades o negocios del sector barbería y peluquería.",
          "Para usar determinadas funcionalidades puede ser necesario crear una cuenta, facilitar datos veraces y mantener las credenciales protegidas.",
        ],
      },
      {
        id: "obligaciones",
        title: "Obligaciones del cliente SaaS y de la barbería",
        bullets: [
          "Usar el software conforme a la ley, estas condiciones y la documentación disponible.",
          "Mantener actualizada la información de la barbería, servicios, precios, horarios y equipo.",
          "Informar a sus clientes finales sobre el tratamiento de datos cuando corresponda.",
          "No introducir datos sin base legal suficiente.",
          "Gestionar cambios, cancelaciones, precios, cobros y prestación real de servicios de barbería.",
        ],
      },
      {
        id: "prohibiciones",
        title: "Uso correcto y prohibiciones",
        bullets: [
          "Acceder sin autorización a cuentas, sistemas o datos.",
          "Interferir en la seguridad o disponibilidad del servicio.",
          "Usar BarberíaOS para spam, fraude, suplantación o actividades ilícitas.",
          "Copiar, revender, sublicenciar o explotar el software fuera de la licencia contratada.",
        ],
      },
      {
        id: "disponibilidad",
        title: "Disponibilidad, mantenimiento y cambios",
        paragraphs: [
          "BarberíaOS procurará mantener el servicio disponible, aunque pueden existir interrupciones por mantenimiento, incidencias técnicas, proveedores o causas ajenas.",
          "El producto puede evolucionar con nuevas funciones, cambios de interfaz, mejoras, retirada de funcionalidades obsoletas o ajustes de planes.",
        ],
      },
      {
        id: "suspension",
        title: "Suspensión o cancelación de cuenta",
        paragraphs: [
          "BarberíaOS podrá suspender o cancelar cuentas en caso de incumplimiento grave, impago, uso abusivo, riesgo de seguridad o requerimiento legal.",
        ],
      },
      {
        id: "responsabilidad",
        title: "Limitación de responsabilidad",
        paragraphs: [
          "BarberíaOS actúa como herramienta tecnológica. La prestación del servicio de barbería corresponde a cada barbería cliente.",
          "El cliente es responsable de la configuración de su negocio, datos introducidos, precios mostrados, relación con clientes finales y cumplimiento sectorial aplicable.",
        ],
      },
      {
        id: "datos",
        title: "Propiedad intelectual, datos e integraciones",
        paragraphs: [
          "BarberíaOS conserva la titularidad del software, diseño, marca y tecnología. El cliente conserva sus datos y contenidos, sin perjuicio de la licencia necesaria para prestar el servicio.",
          "Las integraciones de terceros, si existen, pueden estar sujetas a sus propias condiciones.",
        ],
      },
      {
        id: "ley-contacto",
        title: "Legislación aplicable y contacto",
        paragraphs: [
          `Legislación aplicable: ${APPLICABLE_LAW}.`,
          `Contacto: ${LEGAL_EMAIL}.`,
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "condiciones-contratacion",
    href: "/legal/condiciones-contratacion",
    title: "Condiciones de Contratación",
    description: "Condiciones de planes, suscripciones, facturación, cambios de plan, impuestos, impagos y baja del servicio.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "Planes modelo: Fundador, Básico, Pro y Premium.",
      "Los precios y beneficios comerciales vigentes se muestran en la landing o se facilitan durante el proceso de contratación.",
      "Puede existir facturación mensual o anual y renovación automática si se activa.",
    ],
    sections: [
      {
        id: "planes",
        title: "Planes disponibles",
        table: {
          headers: ["Plan", "Precio", "Incluye"],
          rows: [
            ["Starter", "39 €/mes", "Reservas online, agenda, clientes, QR, caja básica y página pública."],
            ["Pro", "79 €/mes", "Todo Starter, caja avanzada, productos, Marketing Studio y rendimiento por barbero."],
            ["Growth", "149 €/mes", "Todo Pro, IA del dueño, CRM de leads, reportes avanzados y campañas de recuperación."],
            ["Planes a medida", "A concretar", "Soporte ampliado, integraciones o necesidades específicas según alcance."],
          ],
        },
      },
      {
        id: "prueba",
        title: "Periodo de prueba",
        paragraphs: [
          "Periodo de prueba gratuito: cuando exista, se informará antes del alta o contratación.",
          "Durante la prueba pueden existir limitaciones funcionales, técnicas o comerciales según el plan ofrecido.",
        ],
      },
      {
        id: "facturacion",
        title: "Facturación mensual/anual, renovación e impuestos",
        paragraphs: [
          "La facturación podrá ser mensual o anual según el plan contratado.",
          "La renovación será automática si así se informa y acepta durante el proceso de contratación.",
          "Métodos de pago aceptados: los disponibles durante el proceso de checkout o contratación asistida.",
          "Los precios podrán estar sujetos a impuestos aplicables, como IVA u otros tributos según el caso.",
        ],
      },
      {
        id: "cambios",
        title: "Cambios de plan, impagos y suspensión",
        paragraphs: [
          "El cliente podrá solicitar cambios de plan conforme a las opciones disponibles en cada momento.",
          "El impago puede provocar limitación, suspensión o cancelación del servicio tras los avisos razonables o legalmente exigibles.",
        ],
      },
      {
        id: "baja",
        title: "Baja, facturas y soporte",
        paragraphs: [
          `Procedimiento de baja: solicitud desde el panel o escribiendo a ${SUPPORT_EMAIL}.`,
          "Emisión de facturas: conforme a los datos fiscales facilitados por el cliente y la normativa aplicable.",
          "Soporte incluido por plan: según las condiciones comerciales vigentes de cada plan.",
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "cancelacion-reembolsos",
    href: "/legal/cancelacion-reembolsos",
    title: "Política de Cancelación y Reembolsos",
    description: "Reglas modelo para cancelación de suscripción, prueba gratuita, cambios de plan y reembolsos.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "La cancelación debe definirse según el sistema de facturación activo.",
      "Los reembolsos quedan sujetos a la política final del titular.",
      "No se introducen importes ni plazos no confirmados.",
    ],
    sections: [
      {
        id: "cancelar",
        title: "Cómo cancelar la suscripción",
        paragraphs: [
          `El cliente podrá cancelar su suscripción mediante: ${PENDING}.`,
          "La cancelación no elimina necesariamente los datos de forma inmediata, ya que pueden existir plazos de conservación legales o técnicos.",
        ],
      },
      {
        id: "efectos",
        title: "Cuándo se hace efectiva",
        paragraphs: [
          `Fecha efectiva de cancelación: ${PENDING}.`,
          "Puede ser al final del periodo ya pagado, de forma inmediata o conforme a las condiciones aceptadas durante la contratación.",
        ],
      },
      {
        id: "reembolsos",
        title: "Reembolsos, prueba gratuita y servicios prestados",
        bullets: [
          `Política de reembolsos: ${PENDING}.`,
          `Condiciones de prueba gratuita: ${PENDING}.`,
          "Los servicios ya prestados o periodos ya disfrutados pueden no ser reembolsables si así se informa válidamente.",
          "Los cambios de plan podrán generar prorrateos, cargos o ajustes según el plan contratado.",
        ],
      },
      {
        id: "excepciones",
        title: "Casos excepcionales y contacto",
        paragraphs: [
          `Casos excepcionales: ${PENDING}.`,
          `Contacto soporte/facturación: ${PENDING}.`,
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "encargo-tratamiento",
    href: "/legal/encargo-tratamiento",
    title: "Acuerdo de Encargo de Tratamiento",
    description: "Modelo de DPA para el tratamiento de datos de clientes finales y empleados por cuenta de cada barbería.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "La barbería actúa como responsable del tratamiento de sus clientes finales.",
      "BarberíaOS actúa como encargado cuando trata datos por cuenta de la barbería.",
      "Debe revisarse y completarse legalmente antes de uso contractual.",
    ],
    sections: [
      {
        id: "partes",
        title: "Identificación de las partes",
        paragraphs: [
          `Responsable del tratamiento: la barbería cliente, con datos identificativos ${PENDING}.`,
          `Encargado del tratamiento: BarberíaOS / titular ${PENDING}.`,
          "BarberíaOS tratará determinados datos personales por cuenta de la barbería únicamente para prestar el servicio contratado.",
        ],
      },
      {
        id: "objeto",
        title: "Objeto, duración, naturaleza y finalidades",
        bullets: [
          "Objeto: prestación del SaaS BarberíaOS y funcionalidades asociadas.",
          "Duración: mientras exista relación contractual y durante los plazos de devolución, supresión o bloqueo aplicables.",
          "Naturaleza: recogida, registro, organización, consulta, conservación, modificación, comunicación técnica, supresión y soporte.",
          "Finalidades: reservas, agenda, gestión de clientes, barberos, servicios, caja, reportes, soporte y seguridad.",
        ],
      },
      {
        id: "datos-interesados",
        title: "Tipos de datos y categorías de interesados",
        bullets: [
          "Clientes finales: nombre, teléfono, email opcional, reservas, servicios y preferencias operativas si se introducen.",
          "Reservas: fecha, hora, servicio, precio, barbero asignado y estado.",
          "Servicios: nombre, descripción, duración y precio.",
          "Datos de contacto: teléfono, email y datos necesarios para comunicación.",
          "Barberos/empleados: nombre, disponibilidad, actividad y métricas operativas.",
          "Categorías de interesados: clientes de barberías, usuarios del panel y barberos/empleados.",
        ],
      },
      {
        id: "obligaciones",
        title: "Obligaciones de BarberíaOS como encargado",
        bullets: [
          "Tratar los datos solo siguiendo instrucciones documentadas del responsable.",
          "Garantizar que las personas autorizadas se comprometan a confidencialidad.",
          "Aplicar medidas técnicas y organizativas razonables.",
          "Asistir al responsable en la atención de derechos de interesados cuando sea posible.",
          "Notificar brechas de seguridad conforme a los plazos y procedimientos aplicables.",
          "No subcontratar tratamientos sin las condiciones previstas en este acuerdo.",
        ],
      },
      {
        id: "subencargados",
        title: "Subencargados y transferencias internacionales",
        paragraphs: [
          "BarberíaOS podrá recurrir a subencargados necesarios para hosting, base de datos, autenticación, pagos, comunicaciones o soporte, conforme a la lista de subencargados publicada.",
          "Las transferencias internacionales, si existieran, deberán contar con garantías adecuadas conforme al RGPD.",
        ],
      },
      {
        id: "finalizacion",
        title: "Finalización, auditorías y contacto",
        paragraphs: [
          "Al terminar el contrato, BarberíaOS suprimirá o devolverá los datos conforme a las instrucciones del responsable y obligaciones legales o técnicas aplicables.",
          "Las auditorías deberán ser razonables, proporcionadas y no comprometer seguridad, confidencialidad ni derechos de terceros.",
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "subencargados",
    href: "/legal/subencargados",
    title: "Subencargados",
    description: "Listado de proveedores tecnológicos usados o potenciales, con estado operativo de cada servicio.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "Supabase y Stripe aparecen confirmados en el proyecto.",
      "Vercel, email, WhatsApp API, analítica y otros proveedores se revisan cuando se activan en producción.",
      "La tabla debe mantenerse actualizada.",
    ],
    sections: [
      {
        id: "tabla",
        title: "Tabla de subencargados",
        table: {
          headers: ["Proveedor", "Servicio", "Finalidad", "Ubicación", "Transferencias internacionales", "Enlace", "Estado", "Última actualización"],
          rows: [
            ["Supabase", "Base de datos/autenticación", "Infraestructura de datos y sesión", PENDING, PENDING, PENDING, "Activo confirmado en código", LEGAL_LAST_UPDATED],
            ["Stripe", "Pagos/suscripciones", "Checkout, portal y webhooks de facturación", PENDING, PENDING, PENDING, "Activo confirmado en código", LEGAL_LAST_UPDATED],
            ["Vercel", "Hosting/deploy", "Alojamiento y despliegue web", PENDING, PENDING, PENDING, "sujeto a validación operativa", LEGAL_LAST_UPDATED],
            ["Resend/Email provider", "Email transaccional", "Notificaciones y soporte", PENDING, PENDING, PENDING, "sujeto a validación operativa", LEGAL_LAST_UPDATED],
            ["WhatsApp/Meta/Twilio", "Comunicaciones", "WhatsApp/SMS si se activa integración", PENDING, PENDING, PENDING, "sujeto a validación operativa", LEGAL_LAST_UPDATED],
            ["Analytics provider", "Analítica", "Métricas de uso si se activa", PENDING, PENDING, PENDING, "sujeto a validación operativa", LEGAL_LAST_UPDATED],
            ["Otros", PENDING, PENDING, PENDING, PENDING, PENDING, "Sujeto a validación", LEGAL_LAST_UPDATED],
          ],
        },
      },
      {
        id: "cambios",
        title: "Actualización de la lista",
        paragraphs: [
          "La lista debe revisarse cuando se añadan, sustituyan o eliminen proveedores que traten datos personales por cuenta de BarberíaOS o de sus clientes.",
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "seguridad",
    href: "/legal/seguridad",
    title: "Política de Seguridad",
    description: "Resumen de medidas técnicas y organizativas, buenas prácticas y gestión de incidencias.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "BarberíaOS debe aplicar controles razonables de acceso, autenticación, seguridad en tránsito e incidencias.",
      "Las medidas concretas se revisan con cada cambio relevante de infraestructura o producto.",
      "Los usuarios también deben proteger sus cuentas y dispositivos.",
    ],
    sections: [
      {
        id: "medidas",
        title: "Medidas técnicas y organizativas",
        bullets: [
          "Control de acceso a cuentas y áreas protegidas.",
          "Autenticación mediante proveedor de identidad configurado en el proyecto.",
          "Gestión de permisos según roles y pertenencia a barbería cuando aplique.",
          "Cifrado en tránsito mediante HTTPS en entornos desplegados correctamente.",
          `Backups: ${PENDING}.`,
          `Registro de actividad: ${PENDING}.`,
          "Separación lógica por barbershop_id en datos operativos multi-tenant.",
        ],
      },
      {
        id: "incidencias",
        title: "Gestión de incidencias y brechas",
        paragraphs: [
          "BarberíaOS evaluará incidencias de seguridad y adoptará medidas de contención, análisis y mitigación razonables.",
          "Cuando una brecha de seguridad pueda afectar a datos personales, se valorará la notificación a clientes, interesados o autoridades conforme a la normativa aplicable.",
        ],
      },
      {
        id: "usuario",
        title: "Buenas prácticas del usuario",
        bullets: [
          "Usar contraseñas robustas y no compartir credenciales.",
          "Cerrar sesión en dispositivos compartidos.",
          "Asignar accesos solo a personal autorizado.",
          "Mantener actualizados navegadores y dispositivos.",
          "Revisar regularmente usuarios, servicios, barberos y datos públicos.",
        ],
      },
      {
        id: "limitaciones",
        title: "Limitaciones y contacto",
        paragraphs: [
          "Ningún sistema es completamente inmune a riesgos. BarberíaOS trabajará para reducirlos, detectarlos y responder a ellos de forma proporcionada.",
          `Contacto seguridad: ${SUPPORT_EMAIL}.`,
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "comunicaciones-comerciales",
    href: "/legal/comunicaciones-comerciales",
    title: "Política de Comunicaciones Comerciales",
    description: "Información sobre emails transaccionales, comunicaciones comerciales y mensajes por WhatsApp/SMS si se activan.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "Las comunicaciones transaccionales son necesarias para prestar el servicio.",
      "Las comunicaciones comerciales requieren base jurídica adecuada.",
      "Las barberías son responsables de contactar a sus propios clientes conforme a la normativa aplicable.",
    ],
    sections: [
      {
        id: "tipos",
        title: "Qué comunicaciones puede enviar BarberíaOS",
        bullets: [
          "Emails transaccionales: alta, acceso, seguridad, facturación, soporte y avisos operativos.",
          "Emails comerciales: novedades, promociones, funcionalidades o contenidos de BarberíaOS cuando exista base jurídica válida.",
          "WhatsApp/SMS: solo si se activa y existe base válida, consentimiento o solicitud del usuario según el caso.",
        ],
      },
      {
        id: "base",
        title: "Base jurídica, consentimiento y baja",
        paragraphs: [
          "La base jurídica podrá ser ejecución de contrato, interés legítimo o consentimiento según el tipo de comunicación.",
          "Las comunicaciones comerciales basadas en consentimiento deberán poder retirarse de forma sencilla.",
          `Mecanismo de baja: ${PENDING}.`,
        ],
      },
      {
        id: "clientes-finales",
        title: "Comunicaciones a clientes finales por parte de barberías",
        paragraphs: [
          "Cuando una barbería contacta con sus clientes finales usando datos gestionados en BarberíaOS, la barbería es responsable de contar con una base legal válida y de informar adecuadamente a sus clientes.",
          "BarberíaOS actúa como herramienta tecnológica y no sustituye el cumplimiento propio de cada barbería.",
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "uso-aceptable",
    href: "/legal/uso-aceptable",
    title: "Política de Uso Aceptable",
    description: "Reglas mínimas para proteger BarberíaOS, sus clientes, usuarios finales y terceros.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "No se permite uso ilegal, spam, fraude ni ataques al sistema.",
      "No deben subirse datos sin base legal.",
      "El incumplimiento puede provocar suspensión.",
    ],
    sections: [
      {
        id: "prohibiciones",
        title: "Usos prohibidos",
        bullets: [
          "Uso ilegal o contrario a derechos de terceros.",
          "Spam o comunicaciones masivas no autorizadas.",
          "Subida o tratamiento de datos sin base legal suficiente.",
          "Suplantación de identidad, marcas, negocios o personas.",
          "Ataques al sistema, explotación de vulnerabilidades o acceso no autorizado.",
          "Scraping abusivo o extracción automatizada no permitida.",
          "Fraude, pagos no autorizados o manipulación de suscripciones.",
          "Contenido ofensivo, ilícito, discriminatorio o que vulnere derechos.",
          "Reventa no autorizada del servicio.",
          "Manipulación del servicio, límites, métricas o disponibilidad.",
        ],
      },
      {
        id: "suspension",
        title: "Suspensión por incumplimiento",
        paragraphs: [
          "BarberíaOS podrá limitar, suspender o cancelar el acceso cuando detecte un incumplimiento de esta política, riesgo de seguridad, abuso o requerimiento legal.",
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "propiedad-intelectual",
    href: "/legal/propiedad-intelectual",
    title: "Propiedad Intelectual",
    description: "Condiciones sobre marca, software, código, diseño, contenidos, licencia de uso y feedback.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "BarberíaOS conserva la titularidad del software y elementos propios.",
      "El cliente recibe una licencia limitada de uso.",
      "Los usuarios conservan sus contenidos, con licencia técnica para prestar el servicio.",
    ],
    sections: [
      {
        id: "activos",
        title: "Marca, software, código, diseño y contenidos",
        paragraphs: [
          "BarberíaOS, su marca, software, código, arquitectura, diseño, interfaz, textos, recursos visuales y documentación pertenecen a su titular o licenciantes.",
          `Titular de derechos: ${LEGAL_OWNER}.`,
        ],
      },
      {
        id: "licencia",
        title: "Licencia limitada de uso",
        paragraphs: [
          "Durante la vigencia del contrato, el cliente recibe una licencia limitada, no exclusiva, revocable y no transferible para usar BarberíaOS conforme al plan contratado.",
          "Queda prohibida la copia, reventa, sublicencia, ingeniería inversa, explotación no autorizada o creación de servicios competidores a partir del software salvo autorización expresa.",
        ],
      },
      {
        id: "usuarios",
        title: "Contenido aportado por usuarios y feedback",
        paragraphs: [
          "El cliente conserva la titularidad de los datos y contenidos que introduce en BarberíaOS.",
          "El cliente concede a BarberíaOS la licencia técnica necesaria para alojar, procesar y mostrar dichos contenidos con el fin de prestar el servicio.",
          "Las sugerencias o feedback podrán utilizarse para mejorar el producto sin obligación de compensación, salvo pacto distinto.",
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "accesibilidad",
    href: "/legal/accesibilidad",
    title: "Accesibilidad",
    description: "Compromiso de accesibilidad, estado de conformidad, limitaciones conocidas y canal de contacto.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "BarberíaOS aspira a ofrecer una experiencia accesible y usable.",
      "El estado formal de conformidad se revisa de forma periódica dentro de la mejora continua del producto.",
      "Se habilita contacto para reportar barreras.",
    ],
    sections: [
      {
        id: "compromiso",
        title: "Compromiso de accesibilidad",
        paragraphs: [
          "BarberíaOS busca que sus interfaces sean claras, legibles y utilizables en dispositivos móviles y escritorio.",
          `Estado de conformidad: ${PENDING}.`,
        ],
      },
      {
        id: "medidas",
        title: "Medidas adoptadas",
        bullets: [
          "Diseño responsive mobile-first.",
          "Contrastes visuales cuidados dentro del design system.",
          "Uso de HTML semántico cuando procede.",
          "Estados de foco visibles definidos globalmente.",
          "Textos de apoyo y jerarquía visual consistente.",
        ],
      },
      {
        id: "limitaciones",
        title: "Limitaciones conocidas y contacto",
        paragraphs: [
          `Limitaciones conocidas: ${PENDING}.`,
          `Contacto para reportar problemas: ${SUPPORT_EMAIL}.`,
          `Procedimiento de reclamación: ${PENDING}.`,
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "condiciones-reservas",
    href: "/legal/condiciones-reservas",
    title: "Condiciones de Reservas para Clientes Finales",
    description: "Condiciones aplicables a usuarios finales que reservan en una barbería mediante BarberíaOS.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "BarberíaOS actúa como herramienta tecnológica.",
      "La prestación del servicio corresponde a la barbería.",
      "Cambios, cancelaciones, precios y no-show dependen de la barbería.",
    ],
    sections: [
      {
        id: "rol",
        title: "Rol de BarberíaOS y de la barbería",
        paragraphs: [
          "BarberíaOS facilita una herramienta tecnológica para que las barberías gestionen reservas online.",
          "La prestación real del servicio de barbería corresponde exclusivamente a la barbería elegida por el cliente final.",
        ],
      },
      {
        id: "reserva",
        title: "Confirmación, cambios y cancelaciones",
        paragraphs: [
          "La reserva se registra con los datos introducidos por el cliente final y la disponibilidad mostrada en el momento de reservar.",
          "La barbería puede confirmar, modificar o cancelar una cita por motivos operativos.",
          "Para cambiar o cancelar una reserva, el cliente final debe contactar con la barbería salvo que exista una funcionalidad específica disponible.",
        ],
      },
      {
        id: "condiciones",
        title: "Puntualidad, precios, pagos y no-show",
        bullets: [
          "El cliente final debe acudir puntualmente a la cita.",
          "Los precios mostrados dependen de la configuración introducida por la barbería.",
          "Los pagos, si se activan, estarán sujetos a las condiciones informadas durante la reserva.",
          `Política de no-show: ${PENDING}.`,
        ],
      },
      {
        id: "datos",
        title: "Datos personales, contacto y responsabilidad",
        paragraphs: [
          "Los datos personales se tratan para gestionar la reserva y la relación con la barbería.",
          "La barbería es responsable de la prestación del servicio, precios, atención, cambios y comunicaciones con sus clientes.",
          `Contacto con la barbería: ${PENDING}.`,
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "contacto",
    href: "/legal/contacto",
    title: "Contacto Legal",
    description: "Canales de contacto para asuntos legales, privacidad, soporte y comunicaciones formales.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "No se crea formulario porque no existe infraestructura específica de contacto legal.",
      "Se muestran bloques visuales con placeholders.",
      "Todos los canales deben completarse por el titular.",
    ],
    sections: [
      {
        id: "canales",
        title: "Canales de contacto",
        table: {
          headers: ["Canal", "Dato"],
          rows: [
            ["Email legal", PENDING],
            ["Email privacidad", PENDING],
            ["Email soporte", PENDING],
            ["Dirección postal", PENDING],
          ],
        },
      },
      {
        id: "nota",
        title: "Nota sobre formularios",
        paragraphs: [
          "Actualmente esta página muestra canales informativos porque no se ha verificado una infraestructura específica de formulario legal.",
          "Si se habilita un formulario, deberá incluir información de privacidad y validación adecuada.",
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
  {
    slug: "ia",
    href: "/legal/ia",
    title: "Política de IA",
    description: "Modelo de política para funciones presentes o futuras de inteligencia artificial en BarberíaOS.",
    lastUpdated: LEGAL_LAST_UPDATED,
    summary: [
      "Las funciones de IA quedan como posibles o futuras si no están activadas.",
      "Debe existir supervisión humana.",
      "No se deben usar resultados de IA como asesoramiento legal, médico o financiero.",
    ],
    sections: [
      {
        id: "funciones",
        title: "Funciones que pueden usar IA",
        bullets: [
          "Generación de mensajes para WhatsApp o Instagram.",
          "Sugerencias de promociones.",
          "Insights de clientes o actividad del negocio.",
          "Resúmenes, plantillas o recomendaciones operativas.",
        ],
      },
      {
        id: "limitaciones",
        title: "Limitaciones y supervisión humana",
        paragraphs: [
          "Las funciones de IA pueden generar resultados inexactos, incompletos o no adecuados para cada negocio.",
          "El usuario debe revisar y validar cualquier contenido antes de enviarlo a clientes o publicarlo.",
          "La IA no debe utilizarse para tomar decisiones legales, médicas, financieras o de impacto significativo sin intervención profesional cualificada.",
        ],
      },
      {
        id: "datos",
        title: "Datos tratados y proveedores IA",
        paragraphs: [
          `Datos que podrían tratarse: ${PENDING}.`,
          `Proveedores IA: ${PENDING}.`,
          "Si se integran proveedores de IA, deberán revisarse sus términos, ubicación del tratamiento, garantías, conservación y uso de datos para entrenamiento.",
          `Última actualización: ${LEGAL_LAST_UPDATED}.`,
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug) ?? null;
}
