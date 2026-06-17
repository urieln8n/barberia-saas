"use client";

import { useState, useRef } from "react";
import { REEL_TEMPLATES, interpolate } from "@/lib/studio/reel-templates";
import type { ReelTemplate } from "@/lib/studio/reel-templates";
import { STYLES } from "@/lib/studio/generate-content";
import type { ContentStyle } from "@/lib/studio/generate-content";
import type { MusicMood } from "@/lib/studio/reels-engine/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadedAsset = {
  url: string;
  type: "image" | "video";
  filename: string;
};

type WizardStep = 1 | 2 | 3 | 4 | 5;

type Props = {
  barbershopName: string;
  logoUrl: string | null;
  studioCredits: { current: number; monthly: number; extra: number; plan: string };
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DURATION_OPTIONS: { value: 15 | 30 | 60; label: string; note: string }[] = [
  { value: 15, label: "15 s",  note: "Viral rápido" },
  { value: 30, label: "30 s",  note: "Más impacto" },
  { value: 60, label: "60 s",  note: "Presentación" },
];

const MUSIC_OPTIONS: { value: MusicMood; label: string; icon: string }[] = [
  { value: "energetico", label: "Energético",  icon: "⚡" },
  { value: "relajado",   label: "Relajado",    icon: "🌊" },
  { value: "premium",    label: "Premium",     icon: "💎" },
  { value: "urbano",     label: "Urbano",      icon: "🏙️" },
  { value: "none",       label: "Sin música",  icon: "🔇" },
];

const STYLE_COLOR: Record<ContentStyle, string> = {
  premium_morado:     "#7C3AED",
  lujo_dorado:        "#C9A227",
  urbano_moderno:     "#1F2937",
  minimalista_limpio: "#94A3B8",
  barberia_clasica:   "#92400E",
};

const CREDITS_IMAGE_BASED = 3;
const CREDITS_VIDEO_BASED: Record<number, number> = { 15: 3, 30: 5, 60: 8 };

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: WizardStep }) {
  const steps = ["Plantilla", "Contenido", "Estilo", "Config", "Generar"];
  return (
    <div className="mb-6">
      <div className="flex items-center gap-1">
        {steps.map((label, i) => {
          const n = (i + 1) as WizardStep;
          const done   = n < step;
          const active = n === step;
          return (
            <div key={n} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`h-1.5 w-full rounded-full transition-colors ${
                  done ? "bg-[#7C3AED]" : active ? "bg-[#A78BFA]" : "bg-white/[0.10]"
                }`}
              />
              <span className={`text-[10px] font-semibold ${active ? "text-[#A78BFA]" : done ? "text-[#A78BFA]/70" : "text-white/40"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Credits pill ─────────────────────────────────────────────────────────────

function CreditsBadge({ credits }: { credits: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/[0.08] px-2.5 py-1 text-xs font-black text-amber-400">
      ⚡ {credits} crédito{credits !== 1 ? "s" : ""}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReelWizardClient({ barbershopName, logoUrl, studioCredits }: Props) {
  // Wizard navigation
  const [step, setStep]               = useState<WizardStep>(1);
  const [template, setTemplate]       = useState<ReelTemplate | null>(null);

  // Step 2 — Content
  const [assets, setAssets]           = useState<(UploadedAsset | null)[]>([]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [hookText, setHookText]       = useState("");
  const [ctaText, setCtaText]         = useState("");
  const [hashtagsInput, setHashtagsInput] = useState("");
  const fileInputRefs                 = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3 — Style
  const [style, setStyle]             = useState<ContentStyle>("premium_morado");

  // Step 4 — Config
  const [duration, setDuration]       = useState<15 | 30 | 60>(30);
  const [musicMood, setMusicMood]     = useState<MusicMood>("energetico");

  // Step 5 — Generate / Result
  const [generating, setGenerating]   = useState(false);
  const [reelJobId, setReelJobId]     = useState<string | null>(null);
  const [finalUrl, setFinalUrl]       = useState<string | null>(null);
  const [reelError, setReelError]     = useState<string | null>(null);
  const [copied, setCopied]           = useState(false);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function selectTemplate(t: ReelTemplate) {
    setTemplate(t);
    setStyle(t.defaultStyle);
    setDuration(t.recommendedDuration);
    setAssets(Array(t.maxAssets).fill(null));
    setHookText(interpolate(t.hookSuggestions[0], { barbershopName }));
    setCtaText(t.ctaSuggestions[0]);
    setHashtagsInput(t.defaultHashtags.map(h => `#${h}`).join(" "));
    fileInputRefs.current = Array(t.maxAssets).fill(null);
    setStep(2);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(idx);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/studio/media/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload fallido");
      }
      const { url, type } = await res.json() as { url: string; type: "image" | "video"; filename: string };
      const next = [...assets];
      next[idx] = { url, type, filename: file.name };
      setAssets(next);
    } catch (err) {
      alert(`Error al subir: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploadingIdx(null);
      e.target.value = "";
    }
  }

  function removeAsset(idx: number) {
    const next = [...assets];
    next[idx] = null;
    setAssets(next);
  }

  function uploadedAssets(): UploadedAsset[] {
    return assets.filter((a): a is UploadedAsset => a !== null);
  }

  function creditsNeeded(): number {
    const all = uploadedAssets();
    const allImages = all.length > 0 && all.every(a => a.type === "image");
    return allImages ? CREDITS_IMAGE_BASED : (CREDITS_VIDEO_BASED[duration] ?? 5);
  }

  function buildCaption(): string {
    const parts: string[] = [];
    if (hookText) parts.push(hookText);
    if (ctaText)  parts.push(ctaText);
    if (hashtagsInput) {
      const tags = hashtagsInput.trim().split(/\s+/).filter(Boolean)
        .map(h => (h.startsWith("#") ? h : `#${h}`)).join(" ");
      if (tags) parts.push(tags);
    }
    return parts.join("\n\n");
  }

  function canProceedToStep3(): boolean {
    if (!template) return false;
    const uploaded = uploadedAssets();
    return uploaded.length >= template.minAssets;
  }

  // ─── Generate + poll ───────────────────────────────────────────────────────

  async function handleGenerate() {
    if (!template) return;
    const uploaded = uploadedAssets();
    if (uploaded.length < template.minAssets) return;

    setGenerating(true);
    setReelError(null);
    setReelJobId(null);
    setFinalUrl(null);

    try {
      const hashtags = hashtagsInput.trim().split(/\s+/).filter(Boolean)
        .map(h => h.replace(/^#/, ""));

      const body = {
        clip_urls:    uploaded.map(a => a.url),
        asset_types:  uploaded.map(a => a.type),
        hook_text:    hookText || undefined,
        cta_text:     ctaText  || undefined,
        hashtags,
        music_mood:   musicMood,
        duration,
        style,
        logo_url:     logoUrl ?? undefined,
        template_slug: template.slug,
        clip_effect:  template.clipEffect,
      };

      const res = await fetch("/api/studio/reel/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const { reelJobId: jobId } = await res.json() as { reelJobId: string };
      setReelJobId(jobId);
      pollJob(jobId);
    } catch (err) {
      setReelError(err instanceof Error ? err.message : "Error al generar el Reel");
      setGenerating(false);
    }
  }

  function pollJob(jobId: string) {
    const check = async () => {
      try {
        const res  = await fetch(`/api/studio/reel/status/${jobId}`);
        const data = await res.json() as {
          status: string;
          finalUrl?: string;
          errorMsg?: string;
        };

        if (data.status === "completed" && data.finalUrl) {
          setFinalUrl(data.finalUrl);
          setGenerating(false);
          return;
        }
        if (data.status === "failed") {
          setReelError(data.errorMsg ?? "El Reel falló. Inténtalo de nuevo.");
          setGenerating(false);
          return;
        }
        // Still assembling — check again in 5 s
        setTimeout(check, 5000);
      } catch {
        setReelError("Error de conexión. Recarga la página.");
        setGenerating(false);
      }
    };
    setTimeout(check, 3000);
  }

  function handleReset() {
    setStep(1);
    setTemplate(null);
    setAssets([]);
    setHookText("");
    setCtaText("");
    setHashtagsInput("");
    setStyle("premium_morado");
    setDuration(30);
    setMusicMood("energetico");
    setGenerating(false);
    setReelJobId(null);
    setFinalUrl(null);
    setReelError(null);
  }

  async function copyCaption() {
    await navigator.clipboard.writeText(buildCaption());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#A78BFA]">Studio IA</p>
          <h1 className="mt-0.5 text-xl font-black text-white">Crear Reel</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white/60">
            ⚡ {studioCredits.current} créditos
          </span>
        </div>
      </div>

      <ProgressBar step={step} />

      {/* ── Step 1: Template selection ─────────────────────────────────────── */}
      {step === 1 && (
        <div>
          <h2 className="mb-1 text-base font-black text-white">¿Qué tipo de Reel?</h2>
          <p className="mb-4 text-sm text-white/50">Elige la plantilla y la IA pre-rellena el resto</p>
          <div className="grid grid-cols-2 gap-3">
            {REEL_TEMPLATES.map(t => (
              <button
                key={t.slug}
                onClick={() => selectTemplate(t)}
                className="group relative flex flex-col items-start rounded-2xl border-2 border-white/[0.08] bg-white/[0.04] p-4 text-left transition-all hover:border-[#A78BFA]/40 hover:shadow-md active:scale-95"
              >
                {t.badge && (
                  <span className="mb-2 rounded-full bg-[#7C3AED]/20 px-2 py-0.5 text-[10px] font-black uppercase text-[#A78BFA]">
                    {t.badge}
                  </span>
                )}
                <span className="text-2xl">{t.icon}</span>
                <p className="mt-1 text-sm font-black text-white leading-tight">{t.name}</p>
                <p className="mt-0.5 text-[11px] text-white/50 leading-snug">{t.description}</p>
                <p className="mt-2 text-[10px] font-semibold text-[#A78BFA]">
                  {t.recommendedDuration}s · {t.minAssets}–{t.maxAssets} fotos
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Content upload + text ─────────────────────────────────── */}
      {step === 2 && template && (
        <div>
          <button onClick={() => setStep(1)} className="mb-4 flex items-center gap-1 text-sm text-white/50 hover:text-[#A78BFA]">
            ← Cambiar plantilla
          </button>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xl">{template.icon}</span>
            <h2 className="text-base font-black text-white">{template.name}</h2>
          </div>
          <p className="mb-4 text-sm text-white/50">
            Sube al menos {template.minAssets} {template.minAssets === 1 ? "foto/vídeo" : "fotos/vídeos"}
          </p>

          {/* Asset upload slots */}
          <div className="mb-5 space-y-2">
            {Array.from({ length: template.maxAssets }).map((_, i) => {
              const asset = assets[i] ?? null;
              const label = template.assetLabels[i] ?? `Foto ${i + 1}`;
              const isUploading = uploadingIdx === i;
              const isOptional  = i >= template.minAssets;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-colors ${
                    asset ? "border-[#A78BFA]/30 bg-[#7C3AED]/[0.08]" : "border-dashed border-white/[0.12] bg-white/[0.04]"
                  }`}
                >
                  {isUploading ? (
                    <div className="flex flex-1 items-center gap-2">
                      <div className="h-12 w-12 animate-pulse rounded-lg bg-white/[0.10]" />
                      <p className="text-sm text-white/50">Subiendo...</p>
                    </div>
                  ) : asset ? (
                    <>
                      {asset.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={asset.url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/[0.10] text-xl">🎥</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-white/70">{label}</p>
                        <p className="truncate text-[11px] text-white/40">{asset.filename}</p>
                      </div>
                      <button
                        onClick={() => removeAsset(i)}
                        className="rounded-full p-1 text-white/40 hover:bg-red-500/[0.08] hover:text-red-400"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-1 cursor-pointer items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-white/[0.15] text-white/40">
                        📸
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white/70">
                          {label}
                          {isOptional && <span className="ml-1 text-xs font-normal text-white/40">(opcional)</span>}
                        </p>
                        <p className="text-[11px] text-white/40">
                          {template.assetType === "both" ? "Foto o vídeo" : template.assetType === "video" ? "Vídeo" : "Foto"}
                        </p>
                      </div>
                      <span className="rounded-lg bg-[#7C3AED]/20 px-3 py-1.5 text-xs font-black text-[#A78BFA]">
                        Subir
                      </span>
                      <input
                        ref={el => { fileInputRefs.current[i] = el; }}
                        type="file"
                        accept={template.assetType === "video" ? "video/*" : template.assetType === "image" ? "image/*" : "image/*,video/*"}
                        className="hidden"
                        onChange={e => handleFileChange(e, i)}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>

          {/* Text fields */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-black uppercase tracking-wide text-white/60">
                Hook (primera frase)
              </label>
              <input
                value={hookText}
                onChange={e => setHookText(e.target.value)}
                placeholder={interpolate(template.hookSuggestions[0], { barbershopName })}
                maxLength={80}
                className="w-full rounded-xl border border-white/[0.10] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 outline-none focus:border-[#A78BFA]/50 focus:ring-2 focus:ring-[#A78BFA]/20"
              />
              <p className="mt-0.5 text-right text-[10px] text-white/40">{hookText.length}/80</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-black uppercase tracking-wide text-white/60">
                CTA (llamada a la acción)
              </label>
              <input
                value={ctaText}
                onChange={e => setCtaText(e.target.value)}
                placeholder={template.ctaSuggestions[0]}
                maxLength={60}
                className="w-full rounded-xl border border-white/[0.10] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 outline-none focus:border-[#A78BFA]/50 focus:ring-2 focus:ring-[#A78BFA]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-black uppercase tracking-wide text-white/60">
                Hashtags
              </label>
              <input
                value={hashtagsInput}
                onChange={e => setHashtagsInput(e.target.value)}
                placeholder="#barberia #fade #reserva"
                className="w-full rounded-xl border border-white/[0.10] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 outline-none focus:border-[#A78BFA]/50 focus:ring-2 focus:ring-[#A78BFA]/20"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={!canProceedToStep3()}
            className="mt-6 w-full rounded-2xl bg-[#7C3AED] py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente → Elegir estilo
          </button>
        </div>
      )}

      {/* ── Step 3: Style ─────────────────────────────────────────────────── */}
      {step === 3 && (
        <div>
          <button onClick={() => setStep(2)} className="mb-4 flex items-center gap-1 text-sm text-white/50 hover:text-[#A78BFA]">
            ← Volver
          </button>
          <h2 className="mb-1 text-base font-black text-white">¿Qué estilo visual?</h2>
          <p className="mb-4 text-sm text-white/50">Define la paleta de colores y la tipografía del Reel</p>
          <div className="space-y-2">
            {STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  style === s.id
                    ? "border-[#A78BFA]/60 bg-[#7C3AED]/10 shadow-sm"
                    : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.16]"
                }`}
              >
                <div
                  className="h-8 w-8 shrink-0 rounded-full shadow-inner"
                  style={{ backgroundColor: STYLE_COLOR[s.id] }}
                />
                <div className="flex-1">
                  <p className="font-black text-white">{s.label}</p>
                  <p className="text-xs text-white/50">{s.description}</p>
                </div>
                {style === s.id && (
                  <span className="text-[#A78BFA] font-black">✓</span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(4)}
            className="mt-6 w-full rounded-2xl bg-[#7C3AED] py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-[#6D28D9]"
          >
            Siguiente → Duración y música
          </button>
        </div>
      )}

      {/* ── Step 4: Config ────────────────────────────────────────────────── */}
      {step === 4 && (
        <div>
          <button onClick={() => setStep(3)} className="mb-4 flex items-center gap-1 text-sm text-white/50 hover:text-[#A78BFA]">
            ← Volver
          </button>
          <h2 className="mb-1 text-base font-black text-white">Duración y música</h2>
          <p className="mb-4 text-sm text-white/50">Configura el ritmo y el ambiente del Reel</p>

          {/* Duration */}
          <div className="mb-5">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-white/60">Duración</p>
            <div className="grid grid-cols-3 gap-2">
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDuration(opt.value)}
                  className={`flex flex-col items-center rounded-xl border-2 p-3 transition-all ${
                    duration === opt.value
                      ? "border-[#A78BFA]/60 bg-[#7C3AED]/10 shadow-sm"
                      : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.16]"
                  }`}
                >
                  <span className={`text-base font-black ${duration === opt.value ? "text-[#A78BFA]" : "text-white"}`}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-white/50">{opt.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Music */}
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-white/60">Música</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {MUSIC_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setMusicMood(opt.value)}
                  className={`flex items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                    musicMood === opt.value
                      ? "border-[#A78BFA]/60 bg-[#7C3AED]/10 shadow-sm"
                      : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.16]"
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span className={`text-sm font-semibold ${musicMood === opt.value ? "text-[#A78BFA]" : "text-white/70"}`}>
                    {opt.label}
                  </span>
                  {musicMood === opt.value && <span className="ml-auto text-[#A78BFA] text-xs font-black">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(5)}
            className="mt-6 w-full rounded-2xl bg-[#7C3AED] py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-[#6D28D9]"
          >
            Ver resumen y generar →
          </button>
        </div>
      )}

      {/* ── Step 5: Summary + Generate ────────────────────────────────────── */}
      {step === 5 && template && !generating && !finalUrl && (
        <div>
          <button onClick={() => setStep(4)} className="mb-4 flex items-center gap-1 text-sm text-white/50 hover:text-[#A78BFA]">
            ← Volver
          </button>
          <h2 className="mb-4 text-base font-black text-white">Resumen del Reel</h2>

          {/* Summary card */}
          <div className="mb-4 space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}>
            <Row label="Plantilla" value={`${template.icon} ${template.name}`} />
            <Row label="Archivos"  value={`${uploadedAssets().length} subidos`} />
            <Row label="Estilo"    value={STYLES.find(s => s.id === style)?.label ?? style} />
            <Row label="Duración"  value={`${duration} s`} />
            <Row label="Música"    value={MUSIC_OPTIONS.find(m => m.value === musicMood)?.label ?? musicMood} />
          </div>

          {/* Script preview */}
          <div className="mb-4 rounded-2xl border border-[#A78BFA]/20 bg-[#7C3AED]/[0.06] p-4">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-[#A78BFA]">Vista previa del texto</p>
            <div className="space-y-2">
              {hookText && (
                <div className="rounded-lg bg-white/[0.06] p-2.5">
                  <p className="text-[10px] font-semibold uppercase text-white/40">Hook (arriba)</p>
                  <p className="text-sm font-semibold text-white/80">{hookText}</p>
                </div>
              )}
              {ctaText && (
                <div className="rounded-lg bg-[#7C3AED] p-2.5">
                  <p className="text-[10px] font-semibold uppercase text-violet-200">CTA (abajo)</p>
                  <p className="text-sm font-black text-white">{ctaText}</p>
                </div>
              )}
              {hashtagsInput && (
                <div className="rounded-lg bg-white/[0.06] p-2.5">
                  <p className="text-[10px] font-semibold uppercase text-white/40">Hashtags</p>
                  <p className="text-xs text-[#A78BFA]">{hashtagsInput}</p>
                </div>
              )}
            </div>
          </div>

          {/* Credits + error */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-amber-500/[0.08] px-4 py-3">
            <span className="text-sm text-amber-300">Coste de generación</span>
            <CreditsBadge credits={creditsNeeded()} />
          </div>

          {studioCredits.current < creditsNeeded() && (
            <p className="mb-3 rounded-xl bg-red-500/[0.08] px-4 py-2 text-sm text-red-400">
              Sin créditos suficientes. Tienes {studioCredits.current} crédito{studioCredits.current !== 1 ? "s" : ""}.
            </p>
          )}

          {reelError && (
            <p className="mb-3 rounded-xl bg-red-500/[0.08] px-4 py-2 text-sm text-red-400">{reelError}</p>
          )}

          <button
            onClick={handleGenerate}
            disabled={studioCredits.current < creditsNeeded()}
            className="w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] to-purple-700 py-4 text-base font-black text-white shadow-xl transition hover:from-[#6D28D9] hover:to-purple-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            🎞️ Generar Reel
          </button>
        </div>
      )}

      {/* ── Generating / polling ─────────────────────────────────────────── */}
      {generating && (
        <div className="flex flex-col items-center gap-6 py-16">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-[#7C3AED]/20 opacity-60" />
            <div className="relative text-4xl">🎞️</div>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-white">Generando tu Reel...</p>
            <p className="mt-1 text-sm text-white/50">
              Shotstack está ensamblando clips, texto y música.
            </p>
            <p className="mt-1 text-sm text-white/40">Esto puede tardar 1–2 minutos.</p>
          </div>
          <div className="w-full max-w-xs rounded-full bg-white/[0.10]">
            <div className="animate-pulse h-2 rounded-full bg-[#A78BFA]" style={{ width: "60%" }} />
          </div>
          {reelJobId && (
            <p className="text-[10px] text-white/30">Job: {reelJobId}</p>
          )}
        </div>
      )}

      {/* ── Result ───────────────────────────────────────────────────────── */}
      {finalUrl && !generating && (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/[0.12] text-xl">✅</div>
            <div>
              <p className="font-black text-white">¡Tu Reel está listo!</p>
              <p className="text-xs text-white/50">Descárgalo y publícalo en tus redes</p>
            </div>
          </div>

          {/* Video player */}
          <div className="mb-4 overflow-hidden rounded-2xl bg-black shadow-xl">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={finalUrl}
              controls
              playsInline
              className="mx-auto max-h-[480px] w-full"
            />
          </div>

          {/* Actions */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <a
              href={finalUrl}
              download="reel-barberia.mp4"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] py-3 text-sm font-black text-white shadow-md hover:bg-[#6D28D9]"
            >
              ⬇ Descargar MP4
            </a>
            <button
              onClick={copyCaption}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#A78BFA]/30 bg-[#7C3AED]/10 py-3 text-sm font-black text-[#A78BFA] hover:bg-[#7C3AED]/20"
            >
              {copied ? "✓ Copiado" : "📋 Copiar caption"}
            </button>
          </div>

          {/* Caption preview */}
          {buildCaption() && (
            <div className="mb-5 rounded-xl bg-white/[0.04] p-4">
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-white/50">Caption para Instagram</p>
              <p className="whitespace-pre-line text-sm text-white/70">{buildCaption()}</p>
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full rounded-2xl border-2 border-white/[0.10] bg-white/[0.04] py-3 text-sm font-black text-white/70 hover:bg-white/[0.08]"
          >
            + Crear otro Reel
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Tiny helper ──────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm font-semibold text-white/80">{value}</span>
    </div>
  );
}
