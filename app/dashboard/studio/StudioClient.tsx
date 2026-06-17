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
          ? "border-amber-500/30 bg-amber-500/[0.08] text-amber-400 hover:bg-amber-500/[0.14]"
          : "border-[#A78BFA]/30 bg-[#7C3AED]/10 text-[#A78BFA] hover:bg-[#7C3AED]/20"
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
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-3">
        <Film size={14} className="shrink-0 text-emerald-400" />
        <p className="flex-1 text-xs font-black text-emerald-300">Vídeo del anuncio listo</p>
        <a href={videoUrl} target="_blank" rel="noreferrer"
          className="shrink-0 text-xs font-black text-emerald-400 underline hover:text-emerald-300">
          Ver →
        </a>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="space-y-2">
        <p className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-2.5 text-xs font-semibold text-red-400">
          {errorMsg ?? "Error al generar el vídeo"}
        </p>
        <button onClick={() => { setState("idle"); setErrorMsg(null); }}
          className="text-xs font-semibold text-white/50 underline hover:text-white/70">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleClick} disabled={state === "loading"}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#A78BFA]/30 bg-[#7C3AED]/10 px-4 py-3 text-sm font-black text-[#A78BFA] transition hover:bg-[#7C3AED]/20 disabled:opacity-60">
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
      <div className="flex items-center gap-2 rounded-2xl border border-[#A78BFA]/20 bg-[#7C3AED]/10 px-4 py-3">
        <span className="text-lg">{campaignDef?.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-white">{campaignDef?.label}</p>
          <p className="text-[10px] text-[#A78BFA]">{platformDef?.label} · {platformDef?.subline}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#7C3AED]/20 px-2 py-0.5 text-[10px] font-black text-[#A78BFA]">
          1 crédito
        </span>
      </div>

      {/* Hook — highlighted */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.08] p-4">
        <p className="mb-1.5 text-[10px] font-black tracking-wide text-amber-400">🎯 HOOK — LO QUE PARA EL SCROLL</p>
        <p className="text-sm font-black leading-snug text-white">{result.hook}</p>
      </div>

      {/* Caption */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black text-white/70">Caption</p>
          <button onClick={() => copy(`${result.caption}\n\n${hashtagStr}`, "caption")}
            className="flex items-center gap-1 rounded-lg border border-white/[0.10] px-2 py-1 text-[11px] font-semibold text-white/50 transition hover:border-[#A78BFA]/30 hover:text-[#A78BFA]">
            {copied === "caption" ? <><Check size={10} /> Copiado</> : <><Copy size={10} /> Copiar</>}
          </button>
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">{result.caption}</p>
        <p className="mt-2 text-sm text-[#A78BFA]">{hashtagStr}</p>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
        <p className="mb-0.5 text-[10px] font-black tracking-wide text-white/50">CTA</p>
        <p className="text-sm font-black text-white/80">"{result.cta}"</p>
      </div>

      {/* On-screen text */}
      <div className="rounded-2xl bg-black/40 p-4">
        <p className="mb-2 text-[10px] font-black tracking-wide text-white/50">TEXTO EN PANTALLA</p>
        <p className="whitespace-pre-line text-sm font-black leading-relaxed text-white">{result.onScreenText}</p>
      </div>

      {/* Visual idea */}
      <div className="rounded-2xl border border-[#A78BFA]/20 bg-[#7C3AED]/[0.06] p-4">
        <p className="mb-1.5 text-[10px] font-black tracking-wide text-[#A78BFA]">💡 CÓMO GRABARLO</p>
        <p className="text-sm leading-relaxed text-white/70">{result.visualIdea}</p>
      </div>

      {/* Best posting time */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
        <p className="mb-0.5 text-[10px] font-black tracking-wide text-emerald-400">⏱ MEJOR HORA PARA PUBLICAR</p>
        <p className="text-sm font-semibold text-white/70">{result.bestPostingTime}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={() => copy(allText, "all")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3 text-sm font-black text-white/70 transition hover:border-[#A78BFA]/30 hover:bg-[#7C3AED]/10">
          {copied === "all" ? <><Check size={14} /> Copiado</> : <><Download size={14} /> Copiar todo</>}
        </button>
        <button onClick={onReset}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-3 text-sm font-black text-white transition hover:bg-[#6D28D9]">
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
                        done   ? "bg-[#7C3AED] text-white" :
                        active ? "bg-[#7C3AED]/20 text-[#A78BFA] ring-2 ring-[#A78BFA]/50" :
                                  "bg-white/[0.06] text-white/40"
                      }`}>
                        {done ? <Check size={12} /> : s}
                      </div>
                      <span className={`hidden text-[10px] font-semibold sm:block ${active ? "text-[#A78BFA]" : "text-white/40"}`}>{label}</span>
                    </div>
                    {i < 1 && <div className={`mx-1 h-px flex-1 transition-colors ${step > i + 1 ? "bg-[#A78BFA]/60" : "bg-white/[0.10]"}`} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── No credits warning ── */}
        {noCredits && (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.08] p-4">
            <p className="text-sm font-black text-amber-300">Sin créditos disponibles</p>
            <p className="mt-0.5 text-xs text-amber-400/80">Necesitas créditos para generar anuncios con Studio IA.</p>
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
            <p className="text-sm font-black text-white/80">¿Qué resultado necesitas hoy?</p>

            <div className="grid grid-cols-2 gap-3">
              {CAMPAIGNS.map((c) => (
                <button
                  key={c.type}
                  onClick={() => setCampaign(c.type)}
                  disabled={noCredits}
                  className={`relative flex flex-col rounded-2xl border p-4 text-left transition-all ${
                    campaign === c.type
                      ? "border-[#A78BFA]/50 bg-[#7C3AED]/10 ring-1 ring-[#A78BFA]/50"
                      : "border-white/[0.08] bg-white/[0.04] hover:border-[#A78BFA]/30 hover:bg-[#7C3AED]/[0.06]"
                  } ${noCredits ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {c.badge && (
                    <span className="absolute right-2 top-2 rounded-full bg-[#7C3AED]/20 px-1.5 py-0.5 text-[9px] font-black text-[#A78BFA]">
                      {c.badge}
                    </span>
                  )}
                  <span className="mb-2 text-xl">{c.icon}</span>
                  <p className="text-xs font-black text-white">{c.label}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-white/50">{c.goalLine}</p>
                  {campaign === c.type && (
                    <Check size={12} className="absolute bottom-2 right-2 text-[#A78BFA]" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!campaign}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-3.5 text-sm font-black text-white transition disabled:opacity-40 hover:bg-[#6D28D9]"
            >
              Continuar <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ── Step 2: Platform + personalize + style ── */}
        {!result && step === 2 && campaign && (
          <div className="space-y-5">
            <button onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white/70">
              <ArrowLeft size={12} /> {campaignDef?.icon} {campaignDef?.label}
            </button>

            {/* Platform */}
            <div>
              <p className="mb-2 text-xs font-black text-white/80">¿Dónde vas a publicarlo?</p>
              <div className="grid grid-cols-4 gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`rounded-xl border px-2 py-2.5 text-center transition-all ${
                      platform === p.id
                        ? "border-[#A78BFA]/50 bg-[#7C3AED]/10 ring-1 ring-[#A78BFA]/50"
                        : "border-white/[0.08] bg-white/[0.04] hover:border-[#A78BFA]/30"
                    }`}
                  >
                    <p className="text-xs font-black text-white">{p.label}</p>
                    <p className="mt-0.5 text-[9px] text-white/40">{p.subline}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Personalization */}
            <div className="space-y-3">
              <p className="text-xs font-black text-white/50">Personalizar <span className="font-normal">(opcional — mejora el resultado)</span></p>

              <input
                type="text"
                value={offerDetail}
                onChange={(e) => setOfferDetail(e.target.value)}
                placeholder={OFFER_PLACEHOLDER[campaign]}
                className="w-full rounded-xl border border-white/[0.10] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 placeholder:text-white/30 focus:border-[#A78BFA]/50 focus:outline-none focus:ring-1 focus:ring-[#A78BFA]/30"
              />

              {barbers.length > 0 ? (
                <select
                  value={barberName}
                  onChange={(e) => setBarberName(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.10] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 focus:border-[#A78BFA]/50 focus:outline-none focus:ring-1 focus:ring-[#A78BFA]/30"
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
                  className="w-full rounded-xl border border-white/[0.10] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 placeholder:text-white/30 focus:border-[#A78BFA]/50 focus:outline-none focus:ring-1 focus:ring-[#A78BFA]/30"
                />
              )}

              <input
                type="text"
                value={urgencyMessage}
                onChange={(e) => setUrgencyMessage(e.target.value)}
                placeholder='Mensaje urgente (ej: "Solo quedan 2 plazas esta semana")'
                className="w-full rounded-xl border border-white/[0.10] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 placeholder:text-white/30 focus:border-[#A78BFA]/50 focus:outline-none focus:ring-1 focus:ring-[#A78BFA]/30"
              />
            </div>

            {/* Style */}
            <div>
              <p className="mb-2 text-xs font-black text-white/80">Estilo visual</p>
              <div className="grid grid-cols-5 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`rounded-xl border px-1 py-2.5 text-center transition-all ${
                      style === s.id
                        ? "border-[#A78BFA]/50 bg-[#7C3AED]/10 ring-1 ring-[#A78BFA]/50"
                        : "border-white/[0.08] bg-white/[0.04] hover:border-[#A78BFA]/30"
                    }`}
                  >
                    <div className="mx-auto mb-1.5 h-4 w-4 rounded-md" style={{ backgroundColor: s.color }} />
                    <p className="text-[10px] font-black text-white">{s.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {genError && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-2.5 text-xs font-semibold text-red-400">
                {genError}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || noCredits}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-4 text-sm font-black text-white shadow-lg shadow-[#7C3AED]/20 transition hover:bg-[#6D28D9] disabled:opacity-70"
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
  );
}
