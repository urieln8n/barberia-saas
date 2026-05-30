"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, ExternalLink, Filter, Instagram, Mail, MapPin, MessageCircle, Pencil, Phone, Plus, Trash2, Users, X } from "lucide-react";
import { createLead, deleteLead, updateLead, updateLeadStatus } from "./actions";

type Lead = {
  id: string;
  business_name: string;
  contact_name: string | null;
  phone: string | null;
  whatsapp?: string | null;
  email: string | null;
  city: string | null;
  country: string | null;
  source: string | null;
  status: string;
  potential_mrr: number | null;
  notes: string | null;
  last_contacted_at: string | null;
  next_action_at: string | null;
  created_at: string;
  barbers_count?: string | null;
  instagram_username?: string | null;
  lead_temperature?: "cold" | "warm" | "hot" | null;
  utm_campaign?: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  demo_booked: "Demo agendada",
  closed: "Cerrado",
  lost: "Perdido",
  nuevo: "Nuevo",
  contactado: "Contactado",
  demo_agendada: "Demo agendada",
  propuesta_enviada: "Propuesta enviada",
  trial_activo: "Trial activo",
  ganado: "Ganado",
  perdido: "Perdido",
};

const STATUS_COLORS: Record<string, string> = {
  new: "border-emerald-200 bg-emerald-50 text-emerald-700",
  contacted: "border-blue-200 bg-blue-50 text-blue-700",
  demo_booked: "border-[#D5A84C]/35 bg-[#D5A84C]/12 text-[#8A641F]",
  closed: "border-green-200 bg-green-50 text-green-700",
  lost: "border-red-200 bg-red-50 text-red-600",
  nuevo: "border-neutral-200 bg-neutral-50 text-neutral-600",
  contactado: "border-blue-200 bg-blue-50 text-blue-700",
  demo_agendada: "border-[#D5A84C]/35 bg-[#D5A84C]/12 text-[#8A641F]",
  ganado: "border-green-200 bg-green-50 text-green-700",
  perdido: "border-red-200 bg-red-50 text-red-600",
};

const SOURCE_LABELS: Record<string, string> = {
  directo: "Directo",
  "barberiaos.com": "Web",
  instagram: "Instagram",
  referido: "Referido",
  google: "Google",
  linkedin: "LinkedIn",
  feria: "Feria",
  otro: "Otro",
};

const ALL_STATUSES = ["new", "contacted", "demo_booked", "closed", "lost"];
const ALL_SOURCES = ["directo", "barberiaos.com", "instagram", "referido", "google", "linkedin", "feria", "otro"];

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 16);
}

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function normalizePhone(phone: string | null | undefined) {
  return phone?.replace(/\D/g, "") ?? "";
}

function whatsappHref(lead: Lead) {
  const phone = normalizePhone(lead.whatsapp ?? lead.phone);
  if (!phone) return null;
  const text = encodeURIComponent(`Hola ${lead.contact_name ?? ""}, soy Andrés de BarberíaOS. Te escribo por la demo que pediste.`);
  return `https://wa.me/${phone}?text=${text}`;
}

export function LeadsClient({ leads }: { leads: Lead[] }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(
    () =>
      leads.filter((lead) => {
        const statusOk = statusFilter === "all" || lead.status === statusFilter;
        const sourceOk = sourceFilter === "all" || lead.source === sourceFilter;
        return statusOk && sourceOk;
      }),
    [leads, sourceFilter, statusFilter],
  );

  const instagramCount = leads.filter((lead) => lead.source === "instagram").length;
  const hotCount = leads.filter((lead) => lead.lead_temperature === "hot").length;
  const demoCount = leads.filter((lead) => lead.status === "demo_booked" || lead.status === "demo_agendada").length;

  function openCreate() {
    setEditing(null);
    setFormError(null);
    setShowModal(true);
  }

  function openEdit(lead: Lead) {
    setEditing(lead);
    setFormError(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setFormError(null);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setFormError(null);
    const result = editing ? await updateLead(formData) : await createLead(formData);
    setSaving(false);
    if (!result.success) {
      setFormError(result.error);
      return;
    }
    closeModal();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este lead?")) return;
    setPendingId(id);
    const result = await deleteLead(id);
    setPendingId(null);
    if (!result.success) alert(`Error al eliminar: ${result.error}`);
  }

  function changeStatus(id: string, status: string) {
    setPendingId(id);
    startTransition(async () => {
      const result = await updateLeadStatus(id, status);
      setPendingId(null);
      if (!result.success) alert(result.error);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-[#D5A84C]/20 bg-[#080A0F] p-5 text-white shadow-[0_22px_60px_rgba(8,10,15,0.20)] md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D5A84C]">Founder CRM</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Leads Instagram</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">
              Captación comercial de BarberíaOS con origen, estado, ciudad, WhatsApp y tamaño de barbería.
            </p>
          </div>
          <button type="button" onClick={openCreate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#D5A84C] px-5 py-3 text-sm font-black text-[#080A0F] transition hover:bg-[#E8C675]">
            <Plus size={16} /> Nuevo lead
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Metric label="Total leads" value={leads.length} />
          <Metric label="Instagram" value={instagramCount} icon={<Instagram size={16} />} />
          <Metric label="Demos" value={demoCount} />
          <Metric label="Calientes" value={hotCount} className="sm:hidden" />
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-black text-slate-700">
          <Filter size={16} className="text-[#B88917]" />
          Filtros
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["all", ...ALL_STATUSES].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black transition ${
                statusFilter === status ? "bg-[#080A0F] text-[#D5A84C]" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {status === "all" ? "Todos" : STATUS_LABELS[status]}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {["all", ...ALL_SOURCES].map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => setSourceFilter(source)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black transition ${
                sourceFilter === source ? "bg-[#D5A84C] text-[#080A0F]" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {source === "all" ? "Todos los orígenes" : SOURCE_LABELS[source] ?? source}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-black text-slate-600">No hay leads con esos filtros.</p>
          <button type="button" onClick={openCreate} className="btn-gold mt-4">
            <Plus size={14} /> Añadir lead
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((lead) => {
            const wa = whatsappHref(lead);
            return (
              <article key={lead.id} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#D5A84C]/35 md:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black text-slate-950">{lead.business_name}</h2>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${STATUS_COLORS[lead.status] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}>
                        {STATUS_LABELS[lead.status] ?? lead.status}
                      </span>
                      {lead.source === "instagram" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#D5A84C]/30 bg-[#D5A84C]/10 px-2.5 py-1 text-[11px] font-black text-[#8A641F]">
                          <Instagram size={12} /> Instagram
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                      {lead.contact_name && <span className="inline-flex items-center gap-1"><Users size={12} /> {lead.contact_name}</span>}
                      {lead.city && <span className="inline-flex items-center gap-1"><MapPin size={12} /> {lead.city}</span>}
                      {lead.barbers_count && <span>{lead.barbers_count} barberos</span>}
                      <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {formatDate(lead.created_at)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                      {(lead.whatsapp || lead.phone) && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1"><Phone size={12} /> {lead.whatsapp ?? lead.phone}</span>}
                      {lead.email && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1"><Mail size={12} /> {lead.email}</span>}
                      {lead.instagram_username && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">@{lead.instagram_username}</span>}
                      {lead.utm_campaign && <span className="rounded-full bg-slate-100 px-2.5 py-1">{lead.utm_campaign}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
                    <select
                      value={ALL_STATUSES.includes(lead.status) ? lead.status : "new"}
                      onChange={(event) => changeStatus(lead.id, event.target.value)}
                      disabled={pendingId === lead.id}
                      className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 outline-none focus:border-[#D5A84C]"
                    >
                      {ALL_STATUSES.map((status) => (
                        <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                      ))}
                    </select>
                    {wa && (
                      <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-black text-emerald-700 transition hover:bg-emerald-100">
                        WhatsApp <ExternalLink size={13} />
                      </a>
                    )}
                    <button type="button" onClick={() => openEdit(lead)} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => handleDelete(lead.id)} disabled={pendingId === lead.id} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-100 px-3 text-red-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {showModal && (
        <LeadModal editing={editing} saving={saving} error={formError} onClose={closeModal} onSubmit={handleSubmit} />
      )}
    </div>
  );
}

function Metric({ label, value, icon, className = "" }: { label: string; value: number; icon?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.06] p-4 ${className}`}>
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wide text-white/45">
        {label}
        {icon}
      </div>
      <p className="mt-2 text-3xl font-black tabular-nums text-[#D5A84C]">{value}</p>
    </div>
  );
}

function LeadModal({
  editing,
  saving,
  error,
  onClose,
  onSubmit,
}: {
  editing: Lead | null;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  async function submit(formData: FormData) {
    if (editing) formData.append("id", editing.id);
    await onSubmit(formData);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/55 px-3 py-3 sm:items-center sm:justify-center">
      <div className="max-h-[calc(100dvh-24px)] w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B88917]">Lead</p>
            <h2 className="text-xl font-black text-slate-950">{editing ? "Editar lead" : "Nuevo lead"}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form action={submit} className="max-h-[calc(100dvh-112px)] space-y-4 overflow-y-auto overscroll-contain p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre barbería *" name="business_name" defaultValue={editing?.business_name} required />
            <Field label="Contacto" name="contact_name" defaultValue={editing?.contact_name} />
            <Field label="WhatsApp" name="phone" type="tel" defaultValue={editing?.whatsapp ?? editing?.phone} />
            <Field label="Email" name="email" type="email" defaultValue={editing?.email} />
            <Field label="Ciudad" name="city" defaultValue={editing?.city} />
            <Field label="Barberos" name="barbers_count" defaultValue={editing?.barbers_count} />
            <Field label="Instagram" name="instagram_username" defaultValue={editing?.instagram_username} />
            <Field label="Campaña UTM" name="utm_campaign" defaultValue={editing?.utm_campaign} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Select label="Origen" name="source" options={ALL_SOURCES} labels={SOURCE_LABELS} defaultValue={editing?.source ?? "instagram"} />
            <Select label="Estado" name="status" options={ALL_STATUSES} labels={STATUS_LABELS} defaultValue={editing?.status ?? "new"} />
            <Select label="Temperatura" name="lead_temperature" options={["cold", "warm", "hot"]} labels={{ cold: "Frío", warm: "Templado", hot: "Caliente" }} defaultValue={editing?.lead_temperature ?? "warm"} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Último contacto" name="last_contacted_at" type="datetime-local" defaultValue={toDatetimeLocal(editing?.last_contacted_at ?? null)} />
            <Field label="Próxima acción" name="next_action_at" type="datetime-local" defaultValue={toDatetimeLocal(editing?.next_action_at ?? null)} />
          </div>

          <input type="hidden" name="country" value={editing?.country ?? "ES"} />
          <input type="hidden" name="potential_mrr" value={editing?.potential_mrr ?? 0} />

          <label className="block text-sm font-semibold text-slate-700">
            Notas
            <textarea name="notes" rows={4} defaultValue={editing?.notes ?? ""} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#D5A84C] focus:ring-2 focus:ring-[#D5A84C]/20" />
          </label>

          {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="button" onClick={onClose} className="min-h-11 flex-1 rounded-2xl border border-slate-200 px-5 text-sm font-black text-slate-600 transition hover:bg-slate-50">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="min-h-11 flex-1 rounded-2xl bg-[#080A0F] px-5 text-sm font-black text-[#D5A84C] transition hover:bg-[#111827] disabled:opacity-60">
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", defaultValue, required }: { label: string; name: string; type?: string; defaultValue?: string | number | null; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input name={name} type={type} required={required} defaultValue={defaultValue ?? ""} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#D5A84C] focus:ring-2 focus:ring-[#D5A84C]/20" />
    </label>
  );
}

function Select({ label, name, options, labels, defaultValue }: { label: string; name: string; options: string[]; labels: Record<string, string>; defaultValue: string }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <select name={name} defaultValue={defaultValue} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D5A84C] focus:ring-2 focus:ring-[#D5A84C]/20">
        {options.map((option) => (
          <option key={option} value={option}>{labels[option] ?? option}</option>
        ))}
      </select>
    </label>
  );
}
