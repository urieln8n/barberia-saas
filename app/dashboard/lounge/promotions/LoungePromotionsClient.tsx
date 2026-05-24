"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import type { LoungePromotionRow } from "@/src/lib/lounge/promotions";
import { Plus, Tag, Pencil, Trash2, ToggleLeft, ToggleRight, X, Loader2 } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  title: string;
  description: string;
  price_label: string;
  cta_label: string;
  active: boolean;
  sort_order: number;
};

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  price_label: "",
  cta_label: "Me interesa",
  active: true,
  sort_order: 0,
};

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  initialPromotions: LoungePromotionRow[];
};

// ── Component ─────────────────────────────────────────────────────────────────

export function LoungePromotionsClient({ initialPromotions }: Props) {
  const [promotions, setPromotions] = useState<LoungePromotionRow[]>(initialPromotions);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(promo: LoungePromotionRow) {
    setEditingId(promo.id);
    setForm({
      title: promo.title,
      description: promo.description ?? "",
      price_label: promo.price_label ?? "",
      cta_label: promo.cta_label,
      active: promo.active,
      sort_order: promo.sort_order,
    });
    setFormError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  }

  // ── CRUD actions ──────────────────────────────────────────────────────────

  async function handleSave() {
    if (!form.title.trim()) {
      setFormError("El título es obligatorio.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        price_label: form.price_label.trim() || null,
        cta_label: form.cta_label.trim() || "Me interesa",
        active: form.active,
        sort_order: form.sort_order,
      };

      if (editingId) {
        const res = await fetch(`/api/lounge/promotions/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) {
          setFormError(json.error ?? "Error al actualizar.");
          return;
        }
        setPromotions((prev) =>
          prev.map((p) => (p.id === editingId ? json.promotion : p))
        );
      } else {
        const res = await fetch("/api/lounge/promotions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) {
          setFormError(json.error ?? "Error al crear.");
          return;
        }
        setPromotions((prev) => [...prev, json.promotion]);
      }

      closeForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta promoción? Esta acción no se puede deshacer.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/lounge/promotions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPromotions((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(promo: LoungePromotionRow) {
    setTogglingId(promo.id);
    try {
      const res = await fetch(`/api/lounge/promotions/${promo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !promo.active }),
      });
      if (res.ok) {
        setPromotions((prev) =>
          prev.map((p) => (p.id === promo.id ? { ...p, active: !p.active } : p))
        );
      }
    } finally {
      setTogglingId(null);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Lounge · Módulo"
        title="Promociones Lounge"
        description="Crea y gestiona las ofertas que verán tus clientes en la sala de espera."
        action={
          <button type="button" onClick={openCreate} className="btn-gold">
            <Plus size={15} /> Crear promoción
          </button>
        }
      />

      {/* ── Formulario de creación/edición ── */}
      {showForm && (
        <div className="surface-frame p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-heading">
              {editingId ? "Editar promoción" : "Nueva promoción"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="label-section mb-1 block">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ej: Corte + barba por 18€"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#D5A84C] focus:outline-none focus:ring-2 focus:ring-[#D5A84C]/20"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="label-section mb-1 block">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Ej: Promoción válida de lunes a jueves durante todo el mes."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#D5A84C] focus:outline-none focus:ring-2 focus:ring-[#D5A84C]/20"
              />
            </div>

            {/* Price label */}
            <div>
              <label className="label-section mb-1 block">Etiqueta de precio</label>
              <input
                type="text"
                value={form.price_label}
                onChange={(e) => setForm((f) => ({ ...f, price_label: e.target.value }))}
                placeholder="Ej: 18€, Gratis, Desde 10€"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#D5A84C] focus:outline-none focus:ring-2 focus:ring-[#D5A84C]/20"
              />
            </div>

            {/* CTA label */}
            <div>
              <label className="label-section mb-1 block">Texto del botón CTA</label>
              <input
                type="text"
                value={form.cta_label}
                onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))}
                placeholder="Ej: Me interesa, Reservar, Más info"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#D5A84C] focus:outline-none focus:ring-2 focus:ring-[#D5A84C]/20"
              />
            </div>

            {/* Sort order */}
            <div>
              <label className="label-section mb-1 block">Orden</label>
              <input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-[#D5A84C] focus:outline-none focus:ring-2 focus:ring-[#D5A84C]/20"
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3 pt-5">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                {form.active ? (
                  <ToggleRight size={24} className="text-emerald-500" />
                ) : (
                  <ToggleLeft size={24} className="text-slate-300" />
                )}
                {form.active ? "Activa" : "Inactiva"}
              </button>
            </div>
          </div>

          {formError && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {formError}
            </p>
          )}

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-gold"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {saving ? "Guardando…" : editingId ? "Guardar cambios" : "Crear promoción"}
            </button>
            <button type="button" onClick={closeForm} className="btn-outline">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Lista de promociones ── */}
      {promotions.length === 0 ? (
        <div className="surface-frame flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-slate-50">
            <Tag size={22} className="text-slate-400" />
          </div>
          <div>
            <p className="font-black text-slate-700">Todavía no tienes promociones</p>
            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Crea tu primera oferta para convertir la sala de espera en un canal de ventas.
            </p>
          </div>
          <button type="button" onClick={openCreate} className="btn-gold mt-1">
            <Plus size={15} /> Crear promoción
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="flex flex-col gap-3 rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="truncate font-black text-[#080A0F]">{promo.title}</p>
                  {promo.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                      {promo.description}
                    </p>
                  )}
                </div>
                {/* Active badge */}
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                    promo.active
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border border-slate-200 bg-slate-100 text-slate-500"
                  }`}
                >
                  {promo.active ? "Activa" : "Inactiva"}
                </span>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-2">
                {promo.price_label && (
                  <span className="rounded-xl border border-[#D5A84C]/25 bg-[#FDF8EE] px-3 py-1 text-xs font-black text-[#8A641F]">
                    {promo.price_label}
                  </span>
                )}
                <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                  CTA: {promo.cta_label}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => openEdit(promo)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  <Pencil size={12} /> Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleToggle(promo)}
                  disabled={togglingId === promo.id}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  {togglingId === promo.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : promo.active ? (
                    <ToggleRight size={12} />
                  ) : (
                    <ToggleLeft size={12} />
                  )}
                  {promo.active ? "Desactivar" : "Activar"}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(promo.id)}
                  disabled={deletingId === promo.id}
                  className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === promo.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
