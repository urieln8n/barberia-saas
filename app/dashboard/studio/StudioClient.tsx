"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, CreditCard,
  Copy, Download, Film, RefreshCw, Sparkles, Zap,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  CAMPAIGNS, PLATFORMS, STYLES, OFFER_PLACEHOLDER,
  type CampaignType, type ContentPlatform, type ContentStyle,
  type AdCampaignInput, type AdCampaignOutput,
} from "@/lib/studio/generate-content";
import { generateStudio } from "./actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type StudioCredits = { current: number; monthly: number; extra: number; plan: string };

type Props = {
  barbershopName: string;
  barbers: { id: string; name: string }[];
  studioCredits: StudioCredits;
  initialCampaign?: CampaignType;
};

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
      {low && <span className="ml-0.5 text-[10px]">⚠️</span>}
    </Link>
  );
}

// ─── Video generate button ────────────────────────────────────────────────────

function VideoGenerateButton({
  campaign, style, platform, inputData,
}: {
  campaign: string;
  style: string;
  platform: string;
  inputData: Record<string, string>;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleClick() {
    setState("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/studio/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateType: campaign,
          style,
          inputData: { ...inputData, platform },
        }),
      });
      const job = await res.json();
      if (!res.ok) {
        setErrorMsg(job?.error ?? `Error HTTP ${res.status}`);
        setState("error");
        return;
      }

      // Poll up to ~3 min (Kling kling-v1 std takes 60-180 s)
      for (let i = 0; i < 40; i++) {
        await new Promise((r) => setTimeout(r, 5000));
        const statusRes = await fetch(`/api/studio/video/status/${job.jobId}`);
        const status = await statusRes.json();
        if (status.status === "completed") { setVideoUrl(status.videoUrl); setState("done"); return; }
        if (status.status === "failed")    { setErrorMsg(status.errorMsg ?? "El proveedor de vídeo reportó un error"); setState("error"); return; }
      }
      setErrorMsg("Tiempo de espera agotado (>3 min).");
      setState("error");
    } catch (err) {
      console.error("[VideoGenerateButton]", err);
      setErrorMsg("Error de red o conexión");
      setState("error");
    }
  }

  if (state === "done" && videoUrl) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <Film size={14} className="shrink-0 text-emerald-700" />
        <p className="flex-1 text-xs font-black text-emerald-800">Vídeo del anuncio listo</p>
        <a href={videoUrl} target="_blank" rel="noreferrer"
          className="shrink-0 text-xs font-black text-emerald-700 underline hover:text-emerald-900">
          Ver →
        </a>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="space-y-2">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
          {errorMsg ?? "Error al generar el vídeo"}
        </p>
        <button onClick={() => { setState("idle"); setErrorMsg(null); }}
          className="text-xs font-semibold text-slate-500 underline hover:text-slate-700">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleClick} disabled={state === "loading"}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-300 bg-violet-50 px-4 py-3 text-sm font-black text-violet-700 transition hover:bg-violet-100 disabled:opacity-60">
      {state === "loading"
        ? <><RefreshCw size={14} className="animate-spin" /> Generando vídeo del anuncio (1-3 min)…</>
        : <><Film size={14} /> Crear vídeo del anuncio con IA</>}
    </button>
  );
}

// ─── Result display ───────────────────────────────────────────────────────────

function ResultCard({
  result, style, onReset, barbershopName, barberName, offerDetail, urgencyMessage,
}: {
  result: AdCampaignOutput;
  style: ContentStyle;
  onReset: () => void;
  barbershopName: string;
  barberName: string;
  offerDetail: string;
  urgencyMessage: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const campaignDef  = CAMPAIGNS.find(c => c.type === result.campaign);
  const platformDef  = PLATFORMS.find(p => p.id  === result.platform);
  const hashtagStr   = result.hashtags.map(h => `#${h}`).join(" ");
  const allText = [
    `🎯 HOOK\n${result.hook}`,
    `\nCAPTION\n${result.caption}`,
    `\n${hashtagStr}`,
    `\nCTA: ${result.cta}`,
    `\nTEXTO EN PANTALLA\n${result.onScreenText}`,
    `\nCÓMO GRABARLO\n${result.visualIdea}`,
    `\nMEJOR HORA: ${result.bestPostingTime}`,
  ].join("\n");

  return (
    <div className="space-y-3">

      {/* Header badge */}
      <div className="flex items-center gap-2 rounded-2xl border border-violet-200/60 bg-violet-50 px-4 py-3">
        <span className="text-lg">{campaignDef?.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-violet-900">{campaignDef?.label}</p>
          <p className="text-[10px] text-violet-600">{platformDef?.label} · {platformDef?.subline}</p>
        </div>
        <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-700">
          1 crédito
        </span>
      </div>

      {/* Hook — highlighted */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="mb-1.5 text-[10px] font-black tracking-wide text-amber-600">🎯 HOOK — LO QUE PARA EL SCROLL</p>
        <p className="text-sm font-black leading-snug text-slate-900">{result.hook}</p>
      </div>

      {/* Caption */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black text-slate-700">Caption</p>
          <button onClick={() => copy(`${result.caption}\n\n${hashtagStr}`, "caption")}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500 transition hover:border-violet-200 hover:text-violet-700">
            {copied === "caption" ? <><Check size={10} /> Copiado</> : <><Copy size={10} /> Copiar</>}
          </button>
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{result.caption}</p>
        <p className="mt-2 text-sm text-violet-600">{hashtagStr}</p>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <p className="mb-0.5 text-[10px] font-black tracking-wide text-slate-500">CTA</p>
        <p className="text-sm font-black text-slate-800">"{result.cta}"</p>
      </div>

      {/* On-screen text */}
      <div className="rounded-2xl bg-slate-900 p-4">
        <p className="mb-2 text-[10px] font-black tracking-wide text-slate-400">TEXTO EN PANTALLA</p>
        <p className="whitespace-pre-line text-sm font-black leading-relaxed text-white">{result.onScreenText}</p>
      </div>

      {/* Visual idea */}
      <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
        <p className="mb-1.5 text-[10px] font-black tracking-wide text-violet-600">💡 CÓMO GRABARLO</p>
        <p className="text-sm leading-relaxed text-slate-600">{result.visualIdea}</p>
      </div>

      {/* Best posting time */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3">
        <p className="mb-0.5 text-[10px] font-black tracking-wide text-emerald-700">⏱ MEJOR HORA PARA PUBLICAR</p>
        <p className="text-sm font-semibold text-slate-700">{result.bestPostingTime}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={() => copy(allText, "all")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-violet-200 hover:bg-violet-50">
          {copied === "all" ? <><Check size={14} /> Copiado</> : <><Download size={14} /> Copiar todo</>}
        </button>
        <button onClick={onReset}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-700">
          <RefreshCw size={14} /> Crear otro
        </button>
      </div>

      {/* Optional video generation */}
      <VideoGenerateButton
        campaign={result.campaign}
        style={style}
        platform={result.platform}
        inputData={{ barbershopName, barberName, offerDetail, urgencyMessage }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StudioClient({
  barbershopName, barbers, studioCredits, initialCampaign,
}: Props) {
  const [step,           setStep]           = useState<1 | 2>(initialCampaign ? 2 : 1);
  const [campaign,       setCampaign]       = useState<CampaignType | null>(initialCampaign ?? null);
  const [platform,       setPlatform]       = useState<ContentPlatform>("instagram_reel");
  const [style,          setStyle]          = useState<ContentStyle>("premium_morado");
  const [offerDetail,    setOfferDetail]    = useState("");
  const [barberName,     setBarberName]     = useState("");
  const [urgencyMessage, setUrgencyMessage] = useState("");
  const [result,         setResult]         = useState<AdCampaignOutput | null>(null);
  const [generating,     setGenerating]     = useState(false);
  const [genError,       setGenError]       = useState<string | null>(null);

  const noCredits = studioCredits.current <= 0;

  async function handleGenerate() {
    if (!campaign || noCredits || generating) return;
    setGenerating(true);
    setGenError(null);
    try {
      const input: AdCampaignInput = {
        campaign, platform, style,
        barbershopName,
        barberName:     barberName     || undefined,
        offerDetail:    offerDetail    || undefined,
        urgencyMessage: urgencyMessage || undefined,
      };
      const { data, error } = await generateStudio(input);
      if (error) {
        setGenError(error);
      } else if (data) {
        setResult(data);
      }
    } finally {
      setGenerating(false);
    }
  }

  function handleReset() {
    setStep(1);
    setCampaign(null);
    setOfferDetail("");
    setBarberName("");
    setUrgencyMessage("");
    setResult(null);
    setGenError(null);
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/dashboard/studio");
    }
  }

  const campaignDef = CAMPAIGNS.find(c => c.type === campaign);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24">

        {/* ── Header ── */}
        <div className="mb-6">
          <PageHeader
            section="Studio IA"
            title="Generador de anuncios"
            description="Crea piezas de marketing que llenan tu agenda."
            variant="studio"
            action={<CreditsPill credits={studioCredits} />}
          />

          {/* Step indicator */}
          {!result && (
            <div className="mt-4 flex items-center gap-2">
              {["Campaña", "Publicar"].map((label, i) => {
                const s = i + 1 as 1 | 2;
                const done   = step > s;
                const active = step === s;
                return (
                  <div key={i} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black transition-all ${
                        done   ? "bg-violet-600 text-white" :
                        active ? "bg-violet-100 text-violet-700 ring-2 ring-violet-400" :
                                  "bg-slate-100 text-slate-400"
                      }`}>
                        {done ? <Check size={12} /> : s}
                      </div>
                      <span className={`hidden text-[10px] font-semibold sm:block ${active ? "text-violet-700" : "text-slate-400"}`}>{label}</span>
                    </div>
                    {i < 1 && <div className={`mx-1 h-px flex-1 transition-colors ${step > i + 1 ? "bg-violet-400" : "bg-slate-200"}`} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── No credits warning ── */}
        {noCredits && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-black text-amber-800">Sin créditos disponibles</p>
            <p className="mt-0.5 text-xs text-amber-700">Necesitas créditos para generar anuncios con Studio IA.</p>
            <Link href="/dashboard/studio/credits"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-black text-white transition hover:bg-amber-700">
              <CreditCard size={12} /> Comprar créditos
            </Link>
          </div>
        )}

        {/* ── Result ── */}
        {result && (
          <ResultCard
            result={result}
            style={style}
            onReset={handleReset}
            barbershopName={barbershopName}
            barberName={barberName}
            offerDetail={offerDetail}
            urgencyMessage={urgencyMessage}
          />
        )}

        {/* ── Step 1: Campaign selection ── */}
        {!result && step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-black text-slate-700">¿Qué resultado necesitas hoy?</p>

            <div className="grid grid-cols-2 gap-3">
              {CAMPAIGNS.map((c) => (
                <button
                  key={c.type}
                  onClick={() => setCampaign(c.type)}
                  disabled={noCredits}
                  className={`relative flex flex-col rounded-2xl border p-4 text-left transition-all ${
                    campaign === c.type
                      ? "border-violet-400 bg-violet-50 ring-1 ring-violet-400"
                      : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/30"
                  } ${noCredits ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {c.badge && (
                    <span className="absolute right-2 top-2 rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-black text-violet-700">
                      {c.badge}
                    </span>
                  )}
                  <span className="mb-2 text-xl">{c.icon}</span>
                  <p className="text-xs font-black text-slate-900">{c.label}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{c.goalLine}</p>
                  {campaign === c.type && (
                    <Check size={12} className="absolute bottom-2 right-2 text-violet-600" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!campaign}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-black text-white transition disabled:opacity-40 hover:bg-violet-700"
            >
              Continuar <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ── Step 2: Platform + personalize + style ── */}
        {!result && step === 2 && campaign && (
          <div className="space-y-5">
            <button onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">
              <ArrowLeft size={12} /> {campaignDef?.icon} {campaignDef?.label}
            </button>

            {/* Platform */}
            <div>
              <p className="mb-2 text-xs font-black text-slate-700">¿Dónde vas a publicarlo?</p>
              <div className="grid grid-cols-4 gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`rounded-xl border px-2 py-2.5 text-center transition-all ${
                      platform === p.id
                        ? "border-violet-400 bg-violet-50 ring-1 ring-violet-400"
                        : "border-slate-200 bg-white hover:border-violet-200"
                    }`}
                  >
                    <p className="text-xs font-black text-slate-900">{p.label}</p>
                    <p className="mt-0.5 text-[9px] text-slate-400">{p.subline}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Personalization */}
            <div className="space-y-3">
              <p className="text-xs font-black text-slate-500">Personalizar <span className="font-normal">(opcional — mejora el resultado)</span></p>

              <input
                type="text"
                value={offerDetail}
                onChange={(e) => setOfferDetail(e.target.value)}
                placeholder={OFFER_PLACEHOLDER[campaign]}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
              />

              {barbers.length > 0 ? (
                <select
                  value={barberName}
                  onChange={(e) => setBarberName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
                >
                  <option value="">Barbero protagonista (opcional)...</option>
                  {barbers.map((b) => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={barberName}
                  onChange={(e) => setBarberName(e.target.value)}
                  placeholder="Nombre del barbero protagonista (opcional)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
                />
              )}

              <input
                type="text"
                value={urgencyMessage}
                onChange={(e) => setUrgencyMessage(e.target.value)}
                placeholder='Mensaje urgente (ej: "Solo quedan 2 plazas esta semana")'
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200"
              />
            </div>

            {/* Style */}
            <div>
              <p className="mb-2 text-xs font-black text-slate-700">Estilo visual</p>
              <div className="grid grid-cols-5 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`rounded-xl border px-1 py-2.5 text-center transition-all ${
                      style === s.id
                        ? "border-violet-400 bg-violet-50 ring-1 ring-violet-400"
                        : "border-slate-200 bg-white hover:border-violet-200"
                    }`}
                  >
                    <div className="mx-auto mb-1.5 h-4 w-4 rounded-md" style={{ backgroundColor: s.color }} />
                    <p className="text-[10px] font-black text-slate-900">{s.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {genError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
                {genError}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || noCredits}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-4 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-70"
            >
              {generating ? (
                <><RefreshCw size={14} className="animate-spin" /> Generando anuncio…</>
              ) : (
                <><Zap size={14} /> Generar anuncio — 1 crédito</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
