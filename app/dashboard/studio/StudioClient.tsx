"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, Clapperboard, Copy,
  CreditCard, Download, Film, RefreshCw, Sparkles, Zap,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  CONTENT_TYPES,
  CONTENT_STYLES,
  type ContentType,
  type ContentStyle,
  type StudioContentOutput,
  type StudioContentInput,
} from "@/lib/studio/generate-content";
import { generateStudio } from "./actions";

// ─── Props ────────────────────────────────────────────────────────────────────

type StudioCredits = { current: number; monthly: number; extra: number; plan: string };

type Props = {
  barbershopName: string;
  barbers: { id: string; name: string }[];
  services: { id: string; name: string; price: number | null }[];
  products: { id: string; name: string }[];
  studioCredits: StudioCredits;
  initialType?: ContentType;
  initialServiceName?: string;
  initialReviewId?: string;
};

// ─── Step indicator ──────────────────────────────────────────────────────────

function StepDot({ step, current, label }: { step: number; current: number; label: string }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black transition-all ${
        done    ? "bg-violet-600 text-white" :
        active  ? "bg-violet-100 text-violet-700 ring-2 ring-violet-400" :
                  "bg-slate-100 text-slate-400"
      }`}>
        {done ? <Check size={12} /> : step}
      </div>
      <span className={`hidden text-[10px] font-semibold sm:block ${active ? "text-violet-700" : "text-slate-400"}`}>{label}</span>
    </div>
  );
}

// ─── Credits pill ─────────────────────────────────────────────────────────────

function CreditsPill({ credits }: { credits: StudioCredits }) {
  const low = credits.current <= 1;
  return (
    <Link
      href="/dashboard/studio/credits"
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black transition-colors ${
        low
          ? "border-amber-300/50 bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "border-violet-200/60 bg-violet-50 text-violet-700 hover:bg-violet-100"
      }`}
    >
      <Sparkles size={11} />
      {credits.current} crédito{credits.current !== 1 ? "s" : ""}
      {low && <span className="ml-0.5 text-[10px]">⚠️ pocos</span>}
    </Link>
  );
}

// ─── Video generate button (self-contained) ───────────────────────────────────

function VideoGenerateButton({ templateType, style }: { templateType: string; style: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  async function handleClick() {
    setState("loading");
    try {
      const res = await fetch("/api/studio/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateType, style, inputData: {} }),
      });
      const job = await res.json();
      if (!res.ok) { setState("error"); return; }

      // Poll status up to ~15 s (mock completes after 5 s)
      for (let i = 0; i < 12; i++) {
        await new Promise((r) => setTimeout(r, 1500));
        const statusRes = await fetch(`/api/studio/video/status/${job.jobId}`);
        const status = await statusRes.json();
        if (status.status === "completed") { setVideoUrl(status.videoUrl); setState("done"); return; }
        if (status.status === "failed") { setState("error"); return; }
      }
      setState("error");
    } catch {
      setState("error");
    }
  }

  if (state === "done" && videoUrl) {
    return (
      <div className="flex w-full items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <Film size={14} className="shrink-0 text-emerald-700" />
        <p className="flex-1 truncate text-xs font-black text-emerald-800">Vídeo generado (mock)</p>
        <a
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-xs font-black text-emerald-700 underline hover:text-emerald-900"
        >
          Ver →
        </a>
      </div>
    );
  }

  if (state === "error") {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
        Error al generar el vídeo. Aplica la migración studio_video_jobs en Supabase.
      </p>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-300 bg-violet-50 px-4 py-3 text-sm font-black text-violet-700 transition hover:bg-violet-100 disabled:opacity-60"
    >
      {state === "loading" ? (
        <><RefreshCw size={14} className="animate-spin" /> Generando vídeo...</>
      ) : (
        <><Film size={14} /> Generar vídeo IA</>
      )}
    </button>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({
  result,
  onReset,
  templateType,
  style,
}: {
  result: StudioContentOutput;
  onReset: () => void;
  templateType: string;
  style: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50 to-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Sparkles size={14} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">{result.title}</p>
            <p className="text-[11px] text-slate-500">{result.creditsEstimated} crédito usado</p>
          </div>
        </div>

        {/* On-screen text preview */}
        <div className="rounded-xl bg-slate-900 p-4 text-center">
          <p className="whitespace-pre-line text-sm font-black leading-relaxed text-white">{result.onScreenText}</p>
        </div>
      </div>

      {/* Script */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black text-slate-700">Guión del video</p>
          <button
            onClick={() => copy(result.script, "script")}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500 transition hover:border-violet-200 hover:text-violet-700"
          >
            {copied === "script" ? <Check size={10} /> : <Copy size={10} />}
            {copied === "script" ? "Copiado" : "Copiar"}
          </button>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{result.script}</p>
      </div>

      {/* Subtitles */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="mb-2 text-xs font-black text-slate-700">Subtítulos</p>
        <ol className="space-y-1">
          {result.subtitles.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-black text-violet-700">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* Instagram caption */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black text-slate-700">Copy para Instagram</p>
          <button
            onClick={() => copy(result.instagramCaption + result.hashtags.join(" "), "caption")}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500 transition hover:border-violet-200 hover:text-violet-700"
          >
            {copied === "caption" ? <Check size={10} /> : <Copy size={10} />}
            {copied === "caption" ? "Copiado" : "Copiar todo"}
          </button>
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{result.instagramCaption}</p>
        <p className="mt-2 text-sm text-violet-600">{result.hashtags.join(" ")}</p>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="mb-1 text-xs font-black text-slate-700">CTA sugerido</p>
        <p className="text-sm text-slate-700 font-medium">"{result.cta}"</p>
      </div>

      {/* Visual idea */}
      <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
        <p className="mb-1 text-xs font-black text-violet-700">💡 Idea visual</p>
        <p className="text-sm leading-relaxed text-slate-600">{result.visualIdea}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => copy(
            `GUIÓN:\n${result.script}\n\nSUBTÍTULOS:\n${result.subtitles.join("\n")}\n\nCAPTION:\n${result.instagramCaption}${result.hashtags.join(" ")}\n\nCTA: ${result.cta}\n\nIDEA VISUAL: ${result.visualIdea}`,
            "all"
          )}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
        >
          {copied === "all" ? <Check size={14} /> : <Download size={14} />}
          {copied === "all" ? "Copiado" : "Copiar todo"}
        </button>
        <button
          onClick={onReset}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-700"
        >
          <RefreshCw size={14} />
          Crear otro
        </button>
      </div>

      {/* Video generation (Phase A — MockProvider) */}
      <VideoGenerateButton templateType={templateType} style={style} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StudioClient({ barbershopName, barbers, services, products, studioCredits, initialType, initialServiceName, initialReviewId }: Props) {
  // If a type is preselected via query params, start on step 2 (Detalles)
  const [step, setStep] = useState(initialType ? 2 : 1);
  const [selectedType, setSelectedType] = useState<ContentType | null>(initialType ?? null);
  const [selectedStyle, setSelectedStyle] = useState<ContentStyle>("premium_morado");
  const [message, setMessage] = useState("");
  const [selectedService, setSelectedService] = useState(initialServiceName ?? "");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [reviewText, setReviewText] = useState(initialReviewId ? "Reseña vinculada — añade el texto aquí." : "");
  const [result, setResult] = useState<StudioContentOutput | null>(null);
  const [generating, setGenerating] = useState(false);
  const [creditsError, setCreditsError] = useState<string | null>(null);

  const noCredits = studioCredits.current <= 0;
  const steps = ["Tipo", "Detalles", "Estilo", "Generar"];

  async function handleGenerate() {
    if (!selectedType || noCredits || generating) return;
    setGenerating(true);
    setCreditsError(null);
    try {
      const input: StudioContentInput = {
        type: selectedType,
        barbershopName,
        message: message || undefined,
        style: selectedStyle,
        serviceName: selectedService || undefined,
        barberName: selectedBarber || undefined,
        productName: selectedProduct || undefined,
        reviewText: reviewText || undefined,
      };
      const { data, error } = await generateStudio(input);
      if (error) {
        setCreditsError(error);
      } else if (data) {
        setResult(data);
        setStep(5);
      }
    } finally {
      setGenerating(false);
    }
  }

  function handleReset() {
    setStep(1);
    setSelectedType(null);
    setMessage("");
    setSelectedService("");
    setSelectedBarber("");
    setSelectedProduct("");
    setReviewText("");
    setResult(null);
    // Clear URL params without full page reload
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/dashboard/studio");
    }
  }

  const needsService  = selectedType === "corte_premium" || selectedType === "antes_despues";
  const needsBarber   = selectedType === "barbero_destacado";
  const needsProduct  = selectedType === "producto_destacado";
  const needsReview   = selectedType === "resena_cliente";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24">

        {/* ── Header ── */}
        <div className="mb-6">
          <PageHeader
            section="Studio IA"
            title="Crear contenido"
            description="Genera reels, ofertas y campañas para llenar tu agenda."
            variant="studio"
            action={<CreditsPill credits={studioCredits} />}
          />

          {/* Step indicator */}
          {step < 5 && (
            <div className="mt-4 flex items-center gap-2 px-1">
              {steps.map((label, i) => (
                <div key={i} className="flex flex-1 items-center">
                  <StepDot step={i + 1} current={step} label={label} />
                  {i < steps.length - 1 && (
                    <div className={`mx-1 h-px flex-1 transition-colors ${step > i + 1 ? "bg-violet-400" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── No credits warning ── */}
        {noCredits && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-black text-amber-800">Sin créditos disponibles</p>
            <p className="mt-0.5 text-xs text-amber-700">Necesitas créditos para crear contenido con Studio IA.</p>
            <Link
              href="/dashboard/studio/credits"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-black text-white transition hover:bg-amber-700"
            >
              <CreditCard size={12} />
              Comprar créditos
            </Link>
          </div>
        )}

        {/* ── Result ── */}
        {step === 5 && result && (
          <ResultCard
            result={result}
            onReset={handleReset}
            templateType={selectedType ?? ""}
            style={selectedStyle}
          />
        )}

        {/* ── Step 1: Content type ── */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-black text-slate-700">¿Qué tipo de contenido quieres crear?</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CONTENT_TYPES.map(({ type, label, description, icon, credits }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  disabled={noCredits}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                    selectedType === type
                      ? "border-violet-400 bg-violet-50 ring-1 ring-violet-400"
                      : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/30"
                  } ${noCredits ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="text-2xl">{icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-900">{label}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
                    <p className="mt-1 text-[10px] font-semibold text-violet-600">{credits} crédito</p>
                  </div>
                  {selectedType === type && (
                    <Check size={14} className="mt-0.5 shrink-0 text-violet-600" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedType}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-black text-white transition disabled:opacity-40 hover:bg-violet-700"
            >
              Continuar <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ── Step 2: Details ── */}
        {step === 2 && selectedType && (
          <div className="space-y-4">
            <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">
              <ArrowLeft size={12} /> Volver
            </button>

            <p className="text-sm font-black text-slate-700">Añade detalles para personalizar el contenido</p>

            {/* Servicio */}
            {(needsService || selectedType === "oferta_semanal" || selectedType === "llenar_huecos") && services.length > 0 && (
              <div>
                <label className="mb-1.5 block text-xs font-black text-slate-700">Servicio (opcional)</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
                >
                  <option value="">Seleccionar servicio...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}{s.price ? ` — ${s.price}€` : ""}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Barbero */}
            {needsBarber && barbers.length > 0 && (
              <div>
                <label className="mb-1.5 block text-xs font-black text-slate-700">Barbero</label>
                <select
                  value={selectedBarber}
                  onChange={(e) => setSelectedBarber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
                >
                  <option value="">Seleccionar barbero...</option>
                  {barbers.map((b) => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Producto */}
            {needsProduct && (
              <div>
                <label className="mb-1.5 block text-xs font-black text-slate-700">Producto</label>
                {products.length > 0 ? (
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
                  >
                    <option value="">Seleccionar producto...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    placeholder="Ej: Pomada texturizante, Aceite de barba..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
                  />
                )}
              </div>
            )}

            {/* Reseña */}
            {needsReview && (
              <div>
                <label className="mb-1.5 block text-xs font-black text-slate-700">Texto de la reseña</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Pega aquí la reseña positiva del cliente..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200 resize-none"
                />
              </div>
            )}

            {/* Mensaje libre */}
            <div>
              <label className="mb-1.5 block text-xs font-black text-slate-700">
                Mensaje o detalle extra <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ej: 20% de descuento esta semana, combo corte + barba..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
              />
            </div>

            <button
              onClick={() => setStep(3)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-black text-white transition hover:bg-violet-700"
            >
              Continuar <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ── Step 3: Style ── */}
        {step === 3 && (
          <div className="space-y-4">
            <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">
              <ArrowLeft size={12} /> Volver
            </button>

            <p className="text-sm font-black text-slate-700">Elige el estilo visual</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CONTENT_STYLES.map(({ style, label, description, color }) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    selectedStyle === style
                      ? "border-violet-400 bg-violet-50 ring-1 ring-violet-400"
                      : "border-slate-200 bg-white hover:border-violet-200"
                  }`}
                >
                  <div className="mb-2 h-6 w-6 rounded-lg" style={{ backgroundColor: color }} />
                  <p className="text-xs font-black text-slate-900">{label}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{description}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(4)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-black text-white transition hover:bg-violet-700"
            >
              Ver resumen <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ── Step 4: Review & generate ── */}
        {step === 4 && selectedType && (
          <div className="space-y-4">
            <button onClick={() => setStep(3)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">
              <ArrowLeft size={12} /> Volver
            </button>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-4 text-sm font-black text-slate-900">Resumen del contenido</p>
              <div className="space-y-2.5">
                <Row label="Tipo" value={CONTENT_TYPES.find(t => t.type === selectedType)?.label ?? selectedType} />
                <Row label="Estilo" value={CONTENT_STYLES.find(s => s.style === selectedStyle)?.label ?? selectedStyle} />
                {selectedService && <Row label="Servicio" value={selectedService} />}
                {selectedBarber && <Row label="Barbero" value={selectedBarber} />}
                {selectedProduct && <Row label="Producto" value={selectedProduct} />}
                {message && <Row label="Mensaje" value={message} />}
                <Row label="Créditos" value="1 crédito" highlight />
              </div>
            </div>

            {creditsError && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700 border border-red-200">
                {creditsError}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-4 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-70"
            >
              {generating ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Generando contenido...
                </>
              ) : (
                <>
                  <Zap size={14} />
                  Generar contenido con IA
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-xs font-black ${highlight ? "text-violet-700" : "text-slate-900"}`}>{value}</span>
    </div>
  );
}
