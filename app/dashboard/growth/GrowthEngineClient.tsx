"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clipboard,
  FileText,
  Flame,
  Hash,
  Lock,
  Megaphone,
  MessageCircle,
  Rocket,
  Settings,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

type TabId =
  | "resumen"
  | "leads"
  | "campanas"
  | "keywords"
  | "plantillas"
  | "prompts"
  | "contenido"
  | "reportes"
  | "ajustes";

type LeadStatus =
  | "new"
  | "contacted"
  | "demo_sent"
  | "interested"
  | "booked"
  | "customer"
  | "lost";

type Temperature = "cold" | "warm" | "hot";

type Lead = {
  id: string;
  name: string;
  instagram: string;
  phone: string;
  source: string;
  keyword: string;
  campaign: string;
  status: LeadStatus;
  temperature: Temperature;
  lastInteraction: string;
  nextAction: string;
};

type Campaign = {
  name: string;
  objective: string;
  channel: "Reel" | "Story" | "Carrusel" | "WhatsApp" | "Ads" | "Mixto";
  keyword: string;
  cta: string;
  status: "draft" | "active" | "paused" | "completed";
  message: string;
};

type Keyword = {
  keyword: string;
  publicReply: string;
  privateMessage: string;
  destinationUrl: string;
  priority: "alta" | "media" | "baja";
  leadTag: string;
};

type Template = {
  name: string;
  channel: "DM" | "WhatsApp";
  category: string;
  body: string;
};

type PromptItem = {
  title: string;
  category: string;
  objective: string;
  prompt: string;
  cta: string;
};

type ContentIdea = {
  day: number;
  type: "Reel" | "Story" | "Carrusel" | "Live";
  title: string;
  hook: string;
  script: string;
  cta: string;
  keyword: string;
};

type Props = {
  hasAccess: boolean;
  planLabel: string;
  canAccessAds: boolean;
  canAccessWhatsappIA: boolean;
  barbershopName: string | null;
  instagramUsername: string | null;
  whatsapp: string | null;
  bookingUrl: string | null;
  city: string | null;
};

type MetricItem = [string, string | number, LucideIcon];

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "resumen", label: "Resumen", icon: Rocket },
  { id: "leads", label: "Leads", icon: Users },
  { id: "campanas", label: "Campañas", icon: Megaphone },
  { id: "keywords", label: "Keywords", icon: Hash },
  { id: "plantillas", label: "Plantillas", icon: FileText },
  { id: "prompts", label: "Prompts", icon: Sparkles },
  { id: "contenido", label: "Contenido", icon: CalendarDays },
  { id: "reportes", label: "Reportes", icon: BarChart3 },
  { id: "ajustes", label: "Ajustes", icon: Settings },
];

const initialLeads: Lead[] = [
  {
    id: "lead-1",
    name: "Carlos Medina",
    instagram: "@carlosfade",
    phone: "+34 600 111 222",
    source: "Instagram",
    keyword: "DEMO",
    campaign: "Demo web premium",
    status: "new",
    temperature: "hot",
    lastInteraction: "Hoy 10:20",
    nextAction: "Enviar demo y link de reserva",
  },
  {
    id: "lead-2",
    name: "Urban Cuts",
    instagram: "@urbancuts",
    phone: "+34 600 333 444",
    source: "Story",
    keyword: "IA",
    campaign: "Auditoría gratis IA",
    status: "contacted",
    temperature: "warm",
    lastInteraction: "Ayer 18:05",
    nextAction: "Seguimiento 24h",
  },
  {
    id: "lead-3",
    name: "Nico Barber",
    instagram: "@nicobarber",
    phone: "+34 600 555 666",
    source: "WhatsApp",
    keyword: "CITA",
    campaign: "Huecos libres esta semana",
    status: "demo_sent",
    temperature: "warm",
    lastInteraction: "Lun 12:40",
    nextAction: "Resolver objecion de precio",
  },
];

const campaigns: Campaign[] = [
  ["Lanzamiento BarberíaOS", "Presentar el sistema", "Reel", "DEMO", "Ver demo", "active", "Te enseño como una barberia convierte seguidores en reservas."],
  ["Auditoría gratis IA", "Generar conversaciones", "Story", "IA", "Pedir auditoria", "active", "Responde IA y te digo 3 mejoras para llenar agenda."],
  ["Demo web premium", "Enviar enlace comercial", "Carrusel", "WEB", "Abrir demo", "draft", "Tu web puede reservar mientras estas cortando."],
  ["Automatización WhatsApp", "Preparar upsell", "WhatsApp", "IA", "Solicitar activacion", "paused", "Tus recordatorios y seguimientos listos para usar."],
  ["Captación barberías", "Crear leads B2B", "Mixto", "BARBERIA", "Hablar por WhatsApp", "active", "Buscamos barberias que quieran depender menos de plataformas externas."],
  ["Huecos libres esta semana", "Llenar agenda", "Story", "CITA", "Reservar ahora", "active", "Quedan huecos esta semana. Te paso horarios por DM."],
  ["Clientes perdidos 30 días", "Recuperar clientes", "WhatsApp", "PROMO", "Volver a reservar", "draft", "Hace tiempo que no te vemos. Esta semana tienes una oferta especial."],
  ["Reseñas Google", "Aumentar prueba social", "WhatsApp", "RESEÑA", "Dejar reseña", "completed", "Tu reseña ayuda a que mas vecinos nos encuentren."],
].map(([name, objective, channel, keyword, cta, status, message]) => ({
  name,
  objective,
  channel: channel as Campaign["channel"],
  keyword,
  cta,
  status: status as Campaign["status"],
  message,
}));

const keywords: Keyword[] = [
  ["DEMO", "Te paso la demo por privado.", "Hola [NOMBRE], aqui tienes una demo de BarberiaOS: [LINK_DEMO]", "[LINK_DEMO]", "alta", "demo"],
  ["IA", "Te explico como la IA ayuda a llenar agenda.", "Hola [NOMBRE], te preparo una auditoria IA para [BARBERIA].", "[WHATSAPP]", "alta", "ia"],
  ["BARBERIA", "Si tienes barberia, esto te interesa.", "Hola [NOMBRE], BarberiaOS conecta reservas, caja y crecimiento.", "[LINK_WEB]", "media", "b2b"],
  ["CITA", "Te envio horarios disponibles.", "Hola [NOMBRE], puedes reservar aqui: [LINK_RESERVA]", "[LINK_RESERVA]", "alta", "reserva"],
  ["WEB", "Te muestro una web premium con reservas.", "Hola [NOMBRE], mira este ejemplo: [LINK_WEB]", "[LINK_WEB]", "media", "web"],
  ["AUDITORIA", "Te revisamos gratis tu presencia online.", "Hola [NOMBRE], hago una auditoria rapida de [BARBERIA] en [CIUDAD].", "[WHATSAPP]", "media", "auditoria"],
  ["PROMO", "Te paso la oferta por privado.", "Hola [NOMBRE], esta es la oferta de [SERVICIO]: [OFERTA]", "[LINK_RESERVA]", "baja", "promo"],
].map(([keyword, publicReply, privateMessage, destinationUrl, priority, leadTag]) => ({
  keyword,
  publicReply,
  privateMessage,
  destinationUrl,
  priority: priority as Keyword["priority"],
  leadTag,
}));

const templates: Template[] = [
  ["Enviar demo BarberíaOS", "DM", "Demo", "Hola [NOMBRE], te paso la demo de BarberiaOS para que veas como convertir Instagram y WhatsApp en reservas: [LINK_DEMO]"],
  ["Ofrecer auditoría gratis", "DM", "Auditoria", "Hola [NOMBRE], te puedo preparar una auditoria gratis de [BARBERIA] con 3 acciones para conseguir mas reservas en [CIUDAD]."],
  ["Responder interesado en IA", "DM", "IA", "Hola [NOMBRE], la IA puede ayudarte a responder, recuperar clientes y preparar mensajes. Te enseño un ejemplo?"],
  ["Responder interesado en web premium", "DM", "Web", "Hola [NOMBRE], una web premium con reserva directa reduce dependencia de plataformas. Mira esto: [LINK_WEB]"],
  ["Seguimiento 24h", "WhatsApp", "Seguimiento", "Hola [NOMBRE], ayer te pase la info. Quieres que te envie una demo corta para [BARBERIA]?"],
  ["Seguimiento 48h", "WhatsApp", "Seguimiento", "Hola [NOMBRE], cierro seguimiento por aqui. Si quieres activar reservas y crecimiento, te dejo el enlace: [LINK_DEMO]"],
  ["Cierre suave", "WhatsApp", "Cierre", "Tiene sentido que lo activemos esta semana y midamos reservas generadas desde Instagram y WhatsApp?"],
  ["Invitación a llamada", "WhatsApp", "Llamada", "Te va bien una llamada de 15 minutos el [FECHA]? Te enseño como quedaria para [BARBERIA]."],
  ["Huecos libres hoy", "WhatsApp", "Reservas", "Hola [NOMBRE], hoy queda hueco para [SERVICIO]. Reserva aqui: [LINK_RESERVA]"],
  ["Cliente perdido 30 días", "WhatsApp", "Recuperacion", "Hola [NOMBRE], hace tiempo que no vienes por [BARBERIA]. Esta semana tienes [OFERTA]."],
  ["Pedir reseña Google", "WhatsApp", "Reseñas", "Gracias por venir, [NOMBRE]. Nos ayudas dejando una reseña? [LINK_WEB]"],
  ["Promoción producto de inventario", "WhatsApp", "Producto", "Hola [NOMBRE], tenemos [PRODUCTO] para mantener tu corte en casa. Te lo guardamos?"],
].map(([name, channel, category, body]) => ({
  name,
  channel: channel as Template["channel"],
  category,
  body,
}));

const prompts: PromptItem[] = [
  ["Llenar huecos libres hoy", "Reservas", "Publicar disponibilidad con urgencia", "Crea 3 mensajes cortos para llenar huecos libres hoy en una barberia. Usa tono cercano, urgencia real y CTA a reserva.", "Reserva ahora"],
  ["Captar clientes desde Instagram", "Reels", "Convertir seguidores en leads", "Dame un guion de Reel para que una barberia convierta seguidores de Instagram en reservas usando una keyword por comentario.", "Comenta DEMO"],
  ["Crear Reel viral de barberia", "Reels", "Alcance local", "Escribe un guion de Reel con hook fuerte, problema local y cierre para reservar corte + barba.", "Guarda este Reel"],
  ["Story con encuesta", "Stories", "Generar respuestas", "Crea una secuencia de 4 stories con encuesta para detectar clientes que necesitan corte esta semana.", "Responde CITA"],
  ["Recuperar clientes 30 dias", "Clientes perdidos", "Reactivar clientes", "Escribe un WhatsApp para clientes que llevan 30 dias sin venir, con oferta suave y sin sonar agresivo.", "Volver a reservar"],
  ["Pedir reseña Google", "Reseñas", "Mejorar reputacion", "Crea 3 versiones de mensaje para pedir reseña en Google despues de una visita.", "Dejar reseña"],
  ["Vender producto inventario", "Productos", "Aumentar ticket medio", "Escribe un mensaje para vender un producto de peinado despues de un corte premium.", "Te lo guardo"],
  ["Campaña corte + barba", "WhatsApp", "Promocionar combo", "Crea una campaña de WhatsApp para vender corte + barba esta semana.", "Quiero combo"],
  ["Anuncio Meta Ads", "ADS", "Captar reservas", "Escribe copy de Meta Ads para una barberia local con oferta de primera visita.", "Reservar cita"],
  ["Responder DM interesado", "WhatsApp", "Cerrar conversacion", "Crea una respuesta para un cliente que pregunta precio y disponibilidad por DM.", "Ver horarios"],
  ["Convertir seguidores en reservas", "Reels", "Conversion", "Dame 5 hooks para convertir seguidores de una barberia en reservas directas.", "Link en bio"],
  ["Antes/despues de corte", "Reels", "Prueba social", "Crea copy y guion para publicar un antes/despues de corte premium.", "Reserva tu cambio"],
  ["Oferta primera visita", "ADS", "Adquisicion", "Crea una oferta de primera visita para barberia sin devaluar la marca.", "Primera visita"],
  ["Campaña fidelizacion", "WhatsApp", "Retencion", "Crea un mensaje de fidelizacion para clientes recurrentes con tono premium.", "Guardar cita"],
  ["Promocionar QR reservas", "Stories", "Autoservicio", "Crea stories para explicar que el QR permite reservar sin esperar respuesta.", "Escanea y reserva"],
].map(([title, category, objective, prompt, cta]) => ({ title, category, objective, prompt, cta }));

const contentIdeas: ContentIdea[] = Array.from({ length: 30 }, (_, index) => {
  const ideas = [
    ["Reel", "Tu barbería pierde reservas por responder tarde", "Responder tarde cuesta dinero", "Muestra una conversacion perdida y como resolverla con link de reserva.", "Comenta DEMO", "DEMO"],
    ["Story", "Cómo llenar huecos libres con WhatsApp", "Hoy quedan huecos?", "Publica 3 horarios libres y pide respuesta rapida.", "Responde CITA", "CITA"],
    ["Carrusel", "Antes y después de un corte premium", "El cambio se nota", "Secuencia con antes, proceso, resultado y reserva.", "Reserva tu cambio", "CITA"],
    ["Reel", "Cómo funciona el QR de reservas", "Tus clientes no quieren esperar", "Enseña el QR en mostrador y el flujo de reserva.", "Escanea y reserva", "WEB"],
    ["Carrusel", "Por qué no depender solo de Booksy", "Tu cliente debe ser tuyo", "Explica marca, base de datos, WhatsApp y reserva directa.", "Pide auditoria", "AUDITORIA"],
    ["WhatsApp", "Cómo recuperar clientes que no vienen hace 30 días", "Hace tiempo que no te vemos", "Mensaje directo con oferta suave y link.", "Volver a reservar", "PROMO"],
  ] as const;
  const item = ideas[index % ideas.length];

  return {
    day: index + 1,
    type: item[0] === "WhatsApp" ? "Story" : item[0],
    title: item[1],
    hook: item[2],
    script: item[3],
    cta: item[4],
    keyword: item[5],
  } as ContentIdea;
});

const variables = [
  "[NOMBRE]",
  "[BARBERIA]",
  "[SERVICIO]",
  "[LINK_DEMO]",
  "[LINK_RESERVA]",
  "[LINK_WEB]",
  "[WHATSAPP]",
  "[FECHA]",
  "[OFERTA]",
  "[CIUDAD]",
  "[PRODUCTO]",
];

const statusLabels: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  demo_sent: "Demo enviada",
  interested: "Interesado",
  booked: "Reserva",
  customer: "Cliente",
  lost: "Perdido",
};

function badgeClass(value: string) {
  if (["hot", "active", "booked", "customer"].includes(value)) return "badge-success";
  if (["warm", "contacted", "demo_sent", "interested", "draft"].includes(value)) return "badge-warning";
  if (["lost", "paused"].includes(value)) return "badge-danger";
  return "badge-neutral";
}

function normalizePhone(value: string | null) {
  return String(value ?? "").replace(/[^\d+]/g, "");
}

export function GrowthEngineClient({
  hasAccess,
  planLabel,
  canAccessAds,
  canAccessWhatsappIA,
  barbershopName,
  instagramUsername,
  whatsapp,
  bookingUrl,
  city,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("resumen");
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [copied, setCopied] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const context = {
    "[NOMBRE]": "Carlos",
    "[BARBERIA]": barbershopName ?? "tu barberia",
    "[SERVICIO]": "corte + barba",
    "[LINK_DEMO]": bookingUrl ?? "https://demo.barberiaos.com",
    "[LINK_RESERVA]": bookingUrl ?? "/dashboard/qr",
    "[LINK_WEB]": bookingUrl ?? "https://barberiaos.com",
    "[WHATSAPP]": whatsapp ?? "+34 600 000 000",
    "[FECHA]": "esta semana",
    "[OFERTA]": "primera visita con detalle incluido",
    "[CIUDAD]": city ?? "tu ciudad",
    "[PRODUCTO]": "pomada mate",
  };

  const metrics = useMemo<MetricItem[]>(
    () => [
      ["Leads nuevos", leads.filter((lead) => lead.status === "new").length, Users],
      ["Leads contactados", leads.filter((lead) => lead.status === "contacted").length, MessageCircle],
      ["Demos enviadas", leads.filter((lead) => lead.status === "demo_sent").length, Clipboard],
      ["Reservas generadas", leads.filter((lead) => lead.status === "booked").length + 4, CalendarDays],
      ["Clientes recuperados", 3, Star],
      ["Campañas activas", campaigns.filter((campaign) => campaign.status === "active").length, Megaphone],
      ["Mensajes pendientes", leads.filter((lead) => lead.status !== "customer" && lead.status !== "lost").length, Flame],
      ["Ingresos atribuidos", "780 EUR", BarChart3],
    ],
    [leads],
  );

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(personalize(text));
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1800);
  }

  function personalize(text: string) {
    return Object.entries(context).reduce(
      (value, [key, replacement]) => value.replaceAll(key, replacement),
      text,
    );
  }

  function updateLeadStatus(id: string, status: LeadStatus) {
    setLeads((items) =>
      items.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              status,
              lastInteraction: "Ahora",
              nextAction: status === "lost" || status === "customer" ? "Sin accion pendiente" : "Seguimiento manual",
            }
          : lead,
      ),
    );
  }

  if (!hasAccess) {
    return (
      <section className="section-band-dark overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black uppercase text-[#D5A84C]">
              <Lock size={13} /> Plan actual: {planLabel}
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
              Desbloquea BarberíaOS Growth Engine
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Convierte Instagram, WhatsApp y campañas en reservas reales. Starter mantiene la operacion; Pro y Growth activan la capa manual de crecimiento.
            </p>
            <a href="/dashboard/ajustes" className="btn-gold mt-5">
              Solicitar activación <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5">
            {["CRM de leads", "Keywords manuales", "Prompts virales", "Reportes de conversion"].map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0">
                <CheckCircle2 size={16} className="text-[#D5A84C]" />
                <span className="text-sm font-semibold text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      {copied && (
        <div className="fixed right-4 top-20 z-50 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 shadow-lg">
          {copied} copiado
        </div>
      )}

      <section className="section-band-dark overflow-hidden p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[11px] font-black uppercase text-[#D5A84C]">Fase 1 manual</p>
            <h2 className="mt-2 text-2xl font-black text-white">Convierte Instagram, WhatsApp y campañas en reservas reales.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
              CRM, campañas, keywords, plantillas, prompts y reportes preparados sin conectar APIs externas todavia.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[360px]">
            <span className="badge-gold justify-center">Plan {planLabel}</span>
            <span className={canAccessWhatsappIA ? "badge-success justify-center" : "badge-neutral justify-center"}>WhatsApp IA prep</span>
            <span className={canAccessAds ? "badge-success justify-center" : "badge-neutral justify-center"}>ADS prep</span>
          </div>
        </div>
      </section>

      <div role="tablist" className="flex gap-0 overflow-x-auto border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                active
                  ? "border-[#C9922A] text-[#080A0F]"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon size={16} className={active ? "text-[#C9922A]" : "text-slate-500"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "resumen" && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([label, value, Icon]) => (
            <div key={String(label)} className="metric-card">
              <Icon size={18} className="text-[#C9922A]" />
              <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
              <p className="mt-1 text-3xl font-black text-[#080A0F]">{value}</p>
            </div>
          ))}
        </section>
      )}

      {activeTab === "leads" && (
        <section className="table-shell overflow-x-auto">
          <table className="data-table min-w-[1080px]">
            <thead>
              <tr>
                {["Nombre", "Instagram", "Telefono", "Fuente", "Keyword", "Campaña", "Estado", "Temp.", "Ultima", "Proxima accion", "Acciones"].map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="font-bold text-[#080A0F]">{lead.name}</td>
                  <td>{lead.instagram}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.source}</td>
                  <td><span className="badge-gold">{lead.keyword}</span></td>
                  <td>{lead.campaign}</td>
                  <td><span className={badgeClass(lead.status)}>{statusLabels[lead.status]}</span></td>
                  <td><span className={badgeClass(lead.temperature)}>{lead.temperature}</span></td>
                  <td>{lead.lastInteraction}</td>
                  <td>{lead.nextAction}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-outline min-h-0 px-3 py-1.5 text-xs" onClick={() => copyText("DM", `Hola [NOMBRE], vi tu interes por ${lead.keyword}. Te paso la demo: [LINK_DEMO]`)}>
                        Copiar DM
                      </button>
                      <a className="btn-outline min-h-0 px-3 py-1.5 text-xs" href={`https://wa.me/${normalizePhone(lead.phone)}`} target="_blank" rel="noreferrer">
                        WhatsApp
                      </a>
                      {(["contacted", "demo_sent", "interested", "booked", "lost"] as LeadStatus[]).map((status) => (
                        <button key={status} className="btn-ghost min-h-0 px-2 py-1 text-xs" onClick={() => updateLeadStatus(lead.id, status)}>
                          {statusLabels[status]}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === "campanas" && (
        <section className="grid gap-4 lg:grid-cols-2">
          {campaigns.map((campaign) => (
            <article key={campaign.name} className="panel">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="section-heading">{campaign.name}</h2>
                  <p className="section-subtext">{campaign.objective}</p>
                </div>
                <span className={badgeClass(campaign.status)}>{campaign.status}</span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <span className="badge-neutral">{campaign.channel}</span>
                <span className="badge-gold">{campaign.keyword}</span>
                <span className="badge-teal">{campaign.cta}</span>
              </div>
              <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">{campaign.message}</p>
            </article>
          ))}
        </section>
      )}

      {activeTab === "keywords" && (
        <section className="grid gap-4 lg:grid-cols-2">
          {keywords.map((item) => (
            <article key={item.keyword} className="panel">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#080A0F]">{item.keyword}</span>
                <span className={item.priority === "alta" ? "badge-success" : "badge-warning"}>{item.priority}</span>
              </div>
              <p className="mt-4 text-sm font-bold text-slate-700">{item.publicReply}</p>
              <p className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">{personalize(item.privateMessage)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge-neutral">{item.destinationUrl}</span>
                <span className="badge-teal">{item.leadTag}</span>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === "plantillas" && (
        <section className="space-y-4">
          <div className="panel">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Variables soportadas</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {variables.map((variable) => <span key={variable} className="badge-neutral font-mono">{variable}</span>)}
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {templates.map((template) => (
              <article key={template.name} className="panel">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="section-heading">{template.name}</h2>
                    <p className="section-subtext">{template.channel} · {template.category}</p>
                  </div>
                  <span className="badge-gold">{template.channel}</span>
                </div>
                <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">{personalize(template.body)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn-dark" onClick={() => copyText(template.name, template.body)}>Copiar plantilla</button>
                  <button className="btn-outline" onClick={() => copyText("Version personalizada", `${personalize(template.body)}\n\nPD: lo adapto a ${barbershopName ?? "tu barberia"} en 2 minutos.`)}>
                    Generar version local
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "prompts" && (
        <section className="grid gap-4 lg:grid-cols-2">
          {prompts.map((prompt) => {
            const favorite = favorites.includes(prompt.title);

            return (
              <article key={prompt.title} className="panel">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="section-heading">{prompt.title}</h2>
                    <p className="section-subtext">{prompt.objective}</p>
                  </div>
                  <span className="badge-teal">{prompt.category}</span>
                </div>
                <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">{prompt.prompt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn-dark" onClick={() => copyText(prompt.title, prompt.prompt)}>Copiar prompt</button>
                  <button className="btn-outline" onClick={() => copyText("CTA", prompt.cta)}>Copiar CTA</button>
                  <button
                    className={favorite ? "btn-gold" : "btn-outline"}
                    onClick={() => setFavorites((items) => favorite ? items.filter((item) => item !== prompt.title) : [...items, prompt.title])}
                  >
                    {favorite ? "Favorito" : "Guardar favorito"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {activeTab === "contenido" && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {contentIdeas.map((idea) => (
            <article key={idea.day} className="panel">
              <div className="flex items-center justify-between">
                <span className="badge-gold">Dia {idea.day}</span>
                <span className="badge-neutral">{idea.type}</span>
              </div>
              <h2 className="mt-4 section-heading">{idea.title}</h2>
              <p className="mt-2 text-sm font-bold text-[#C9922A]">{idea.hook}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{idea.script}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge-teal">{idea.cta}</span>
                <span className="badge-neutral">{idea.keyword}</span>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === "reportes" && (
        <section className="grid gap-4 lg:grid-cols-2">
          {[
            ["Leads por fuente", "Instagram 42%, WhatsApp 33%, Ads 15%, Referidos 10%"],
            ["Leads por keyword", "DEMO y CITA concentran la mayor intencion"],
            ["Mejor conversion", "Huecos libres esta semana convierte 28% a reserva"],
            ["Reservas generadas", "4 reservas manuales atribuidas esta semana"],
            ["Ingresos estimados", "780 EUR atribuidos a Growth"],
            ["Clientes recuperados", "3 clientes volvieron con campaña 30 dias"],
            ["Proximas acciones", "Contactar leads hot y reactivar campana IA"],
          ].map(([title, detail]) => (
            <article key={title} className="panel">
              <h2 className="section-heading">{title}</h2>
              <p className="section-subtext">{detail}</p>
            </article>
          ))}
        </section>
      )}

      {activeTab === "ajustes" && (
        <section className="panel">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Instagram", instagramUsername ?? "@tu_barberia"],
              ["WhatsApp", whatsapp ?? "Sin configurar"],
              ["Link de reserva", bookingUrl ?? "Sin perfil publico"],
              ["Ciudad", city ?? "Sin ciudad"],
              ["Oferta principal", "Primera visita con experiencia premium"],
              ["Estado del modulo", "Fase 1 manual preparada"],
              ["Plan requerido", "Pro para manual, Growth para CRM avanzado, Premium para ADS"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
                <p className="mt-1 break-words text-sm font-bold text-[#080A0F]">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
