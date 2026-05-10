"use client";

import { useRef, useState, useTransition } from "react";
import {
  Globe,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Eye,
  Store,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  upsertPublicProfile,
  togglePublished,
  toggleMarketplace,
  type ActionResult,
} from "./actions";

export type PublicProfile = {
  id: string;
  slug: string;
  public_name: string;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  website_url: string | null;
  description: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  is_published: boolean;
  marketplace_enabled: boolean;
};

type Props = {
  profile: PublicProfile | null;
  defaultSlug: string;
  siteUrl: string;
};

function StatusBanner({ profile }: { profile: PublicProfile }) {
  if (!profile.is_published) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          Tu perfil <strong>no está publicado</strong>. Los clientes no pueden encontrar tu
          barbería todavía. Activa la publicación para que el enlace público funcione.
        </p>
      </div>
    );
  }
  if (!profile.marketplace_enabled) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Eye size={16} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-sm text-blue-800">
          Perfil publicado. Tu enlace <strong>/r/{profile.slug}</strong> funciona, pero{" "}
          <strong>no apareces en el marketplace</strong> público. Activa el marketplace para
          que nuevos clientes te encuentren.
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
      <p className="text-sm text-emerald-800">
        Tu perfil está <strong>publicado y visible en el marketplace</strong>. Los clientes
        pueden encontrar tu barbería y reservar online.
      </p>
    </div>
  );
}

function CopyLinkBox({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-[#F6F8FB] px-4 py-3">
      <Globe size={14} className="shrink-0 text-slate-400" />
      <span className="min-w-0 flex-1 truncate font-mono text-sm text-slate-600">{url}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {copied ? (
          <span className="flex items-center gap-1 text-emerald-600">
            <Check size={12} /> Copiado
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Copy size={12} /> Copiar
          </span>
        )}
      </button>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <ExternalLink size={12} />
      </a>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`h-6 w-11 rounded-full transition-colors ${
            checked ? "bg-[#2563EB]" : "bg-slate-200"
          } ${disabled ? "opacity-50" : ""}`}
        />
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
      <span className="text-sm font-semibold text-[#080A0F]">{label}</span>
    </label>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="input"
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function MarketplaceClient({ profile, defaultSlug, siteUrl }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  const publicUrl = profile ? `${siteUrl}/r/${profile.slug}` : null;
  const qrUrl = publicUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}`
    : null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await upsertPublicProfile(fd);
      setResult(res);
    });
  }

  function handleTogglePublished(val: boolean) {
    startTransition(async () => {
      const res = await togglePublished(val);
      setResult(res);
    });
  }

  function handleToggleMarketplace(val: boolean) {
    startTransition(async () => {
      const res = await toggleMarketplace(val);
      setResult(res);
    });
  }

  return (
    <div className="space-y-6">

      {/* Status banner */}
      {profile && <StatusBanner profile={profile} />}

      {/* Public link + QR */}
      {profile && publicUrl && (
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB]/10">
              <Globe size={16} className="text-[#2563EB]" />
            </div>
            <h2 className="font-black text-[#080A0F]">Enlace público</h2>
          </div>

          <CopyLinkBox url={publicUrl} />

          {profile.is_published && (
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl!}
                    alt="QR de reservas"
                    width={120}
                    height={120}
                    className="rounded-xl"
                  />
                </div>
                <a
                  href={qrUrl!}
                  download="qr-reservas.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <QrCode size={11} />
                  Descargar QR
                </a>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Vista previa
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Comparte este enlace o QR con tus clientes para que reserven
                  directamente desde Instagram, WhatsApp o la calle.
                </p>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline mt-3 inline-flex text-xs"
                >
                  <ExternalLink size={13} />
                  Ver página pública
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visibility toggles */}
      {profile && (
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-5 font-black text-[#080A0F]">Visibilidad</h2>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-[#F6F8FB] p-4">
              <div>
                <p className="font-semibold text-[#080A0F]">Perfil publicado</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  Activa esto para que tu enlace /r/{profile.slug} funcione y los
                  clientes puedan reservar.
                </p>
              </div>
              <Toggle
                checked={profile.is_published}
                onChange={handleTogglePublished}
                label=""
                disabled={isPending}
              />
            </div>
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-[#F6F8FB] p-4">
              <div>
                <p className="font-semibold text-[#080A0F]">Visible en marketplace</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  Aparecerás en /barberias y los nuevos clientes te encontrarán por ciudad.
                  Requiere perfil publicado.
                </p>
              </div>
              <Toggle
                checked={profile.marketplace_enabled}
                onChange={handleToggleMarketplace}
                label=""
                disabled={isPending || !profile.is_published}
              />
            </div>
          </div>
          {isPending && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <Loader2 size={12} className="animate-spin" /> Guardando…
            </p>
          )}
        </div>
      )}

      {/* Profile form */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D5A84C]/15">
            <Store size={16} className="text-[#8A641F]" />
          </div>
          <h2 className="font-black text-[#080A0F]">
            {profile ? "Editar perfil público" : "Crear perfil público"}
          </h2>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

          {/* Slug */}
          <Field
            label="URL pública (slug)"
            name="slug"
            defaultValue={profile?.slug ?? defaultSlug}
            placeholder="mi-barberia"
            hint="Solo minúsculas, números y guiones. Mínimo 2 caracteres. Ej: barberia-juan"
          />

          {/* Public name */}
          <Field
            label="Nombre público"
            name="public_name"
            defaultValue={profile?.public_name}
            placeholder="BarberShop Premium"
          />

          {/* Location */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Ciudad"
              name="city"
              defaultValue={profile?.city}
              placeholder="Madrid"
            />
            <Field
              label="Barrio / Zona"
              name="neighborhood"
              defaultValue={profile?.neighborhood}
              placeholder="Malasaña"
            />
          </div>

          <Field
            label="Dirección"
            name="address"
            defaultValue={profile?.address}
            placeholder="Calle Gran Vía 42, 1º"
          />

          {/* Contact */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Teléfono"
              name="phone"
              defaultValue={profile?.phone}
              placeholder="+34 600 000 000"
              type="tel"
            />
            <Field
              label="WhatsApp"
              name="whatsapp"
              defaultValue={profile?.whatsapp}
              placeholder="34600000000"
              hint="Solo números con prefijo de país"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Instagram"
              name="instagram"
              defaultValue={profile?.instagram}
              placeholder="@mibarberiaos"
            />
            <Field
              label="Web propia"
              name="website_url"
              defaultValue={profile?.website_url}
              placeholder="https://mibarberia.es"
              type="url"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="form-label" htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={profile?.description ?? ""}
              placeholder="Barbería premium en el centro de Madrid. Especialistas en corte clásico y barba."
              className="input resize-none"
            />
          </div>

          {/* Images */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="URL logo"
              name="logo_url"
              defaultValue={profile?.logo_url}
              placeholder="https://..."
              type="url"
              hint="Imagen cuadrada, mínimo 200×200 px"
            />
            <Field
              label="URL foto de portada"
              name="cover_image_url"
              defaultValue={profile?.cover_image_url}
              placeholder="https://..."
              type="url"
              hint="Imagen horizontal, mínimo 800×400 px"
            />
          </div>

          {/* Result feedback */}
          {result && "error" in result && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              {result.error}
            </div>
          )}
          {result && "success" in result && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 size={15} className="shrink-0" />
              Perfil guardado correctamente.
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary gap-2 disabled:opacity-60"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {profile ? "Guardar cambios" : "Crear perfil público"}
            </button>
            {profile && (
              <a
                href={`/r/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm"
              >
                <Eye size={14} />
                Vista previa
              </a>
            )}
          </div>
        </form>
      </div>

    </div>
  );
}
