"use client";

import { useRef, useState } from "react";
import {
  ShieldCheck,
  Search,
  TrendingUp,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Loader2,
  Globe,
  ExternalLink,
  RotateCcw,
  Clock,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type CheckStatus = "ok" | "warn" | "error";

type AuditCheck = {
  name: string;
  status: CheckStatus;
  detail: string;
  recommendation?: string;
};

type AuditResult = {
  audit_id: string;
  url: string;
  score: number;
  security: AuditCheck[];
  seo: AuditCheck[];
  conversion: AuditCheck[];
  barberiaos: AuditCheck[];
  summary: AuditCheck[];
};

export type AuditHistoryEntry = {
  id: string;
  website_url: string;
  score: number | null;
  status: string;
  created_at: string;
  report: Record<string, AuditCheck[]> | null;
};

type Phase = "idle" | "loading" | "done" | "error";

// ── Score gauge ───────────────────────────────────────────────────────────────

function scoreTheme(score: number) {
  if (score >= 80) return { stroke: "#10B981", text: "text-emerald-600", label: "Bueno",     bg: "bg-emerald-50 border-emerald-200" };
  if (score >= 60) return { stroke: "#D5A84C", text: "text-amber-600",   label: "Mejorable", bg: "bg-amber-50 border-amber-200" };
  if (score >= 40) return { stroke: "#F97316", text: "text-orange-600",  label: "Atención",  bg: "bg-orange-50 border-orange-200" };
  return           { stroke: "#EF4444", text: "text-red-600",     label: "Revisar",   bg: "bg-red-50 border-red-200" };
}

function ScoreGauge({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const theme = scoreTheme(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="136" height="136" viewBox="0 0 136 136" aria-label={`Puntuación: ${score} de 100`}>
        <circle cx="68" cy="68" r={r} fill="none" stroke="#EEF3F8" strokeWidth="12" />
        <circle
          cx="68" cy="68" r={r}
          fill="none"
          stroke={theme.stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 68 68)"
        />
        <text x="68" y="63" textAnchor="middle" fontSize="32" fontWeight="900" fill="#080A0F">{score}</text>
        <text x="68" y="80" textAnchor="middle" fontSize="11" fontWeight="600" fill="#94A3B8">de 100</text>
      </svg>
      <span className={`text-sm font-black ${theme.text}`}>{theme.label}</span>
    </div>
  );
}

// ── Individual check ──────────────────────────────────────────────────────────

const CHECK_STYLE: Record<CheckStatus, { icon: typeof CheckCircle2; color: string; bg: string; border: string; label: string }> = {
  ok:    { icon: CheckCircle2,  color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", label: "Correcto" },
  warn:  { icon: AlertTriangle, color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200",   label: "Mejora" },
  error: { icon: Info,          color: "text-red-700",     bg: "bg-red-50",      border: "border-red-200",     label: "Atención" },
};

function CheckItem({ check }: { check: AuditCheck }) {
  const [open, setOpen] = useState(false);
  const cfg = CHECK_STYLE[check.status] ?? CHECK_STYLE.warn;
  const Icon = cfg.icon;

  return (
    <div className={`rounded-2xl border px-4 py-3 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start gap-3">
        <Icon size={15} className={`mt-0.5 shrink-0 ${cfg.color}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-[#080A0F]">{check.name}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${cfg.color}`}
              style={{ background: "rgba(255,255,255,0.6)" }}
            >
              {cfg.label}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">{check.detail}</p>
          {check.recommendation && (
            <>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                {open ? "Ocultar consejo" : "Ver recomendación"}
              </button>
              {open && (
                <p className="mt-2 border-l-2 border-[#2563EB]/30 pl-3 text-xs leading-5 text-slate-700">
                  {check.recommendation}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Category section ──────────────────────────────────────────────────────────

type CategoryKey = "security" | "seo" | "conversion" | "barberiaos";

const CATEGORY_META: Record<CategoryKey, { label: string; icon: typeof ShieldCheck; description: string }> = {
  security:   { label: "Seguridad",  icon: ShieldCheck, description: "HTTPS, TLS y cabeceras de seguridad HTTP" },
  seo:        { label: "SEO",        icon: Search,       description: "Visibilidad en buscadores y metadatos" },
  conversion: { label: "Conversión", icon: TrendingUp,   description: "Contacto, reservas y precios visibles" },
  barberiaos: { label: "BarberíaOS", icon: Scissors,     description: "Integración y presencia en BarberíaOS" },
};

function CategorySection({ categoryKey, checks }: { categoryKey: CategoryKey; checks: AuditCheck[] }) {
  const meta = CATEGORY_META[categoryKey];
  const Icon = meta.icon;
  const errors = checks.filter(c => c.status === "error").length;
  const warns  = checks.filter(c => c.status === "warn").length;
  const oks    = checks.filter(c => c.status === "ok").length;

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#080A0F]">
          <Icon size={16} className="text-[#D5A84C]" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-[#080A0F]">{meta.label}</h3>
            {errors > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-700">
                {errors} atención
              </span>
            )}
            {warns > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">
                {warns} mejora
              </span>
            )}
            {oks > 0 && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                {oks} correcto
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{meta.description}</p>
        </div>
      </div>

      {checks.length > 0 ? (
        <div className="space-y-2">
          {checks.map((check, i) => (
            <CheckItem key={`${check.name}-${i}`} check={check} />
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-slate-400">Sin datos para esta categoría.</p>
      )}
    </div>
  );
}

// ── History row ───────────────────────────────────────────────────────────────

function HistoryRow({
  entry,
  onLoad,
}: {
  entry: AuditHistoryEntry;
  onLoad: (result: AuditResult) => void;
}) {
  const date = new Date(entry.created_at).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = new Date(entry.created_at).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const theme = entry.score !== null ? scoreTheme(entry.score) : null;

  function handleLoad() {
    if (!entry.report) return;
    onLoad({
      audit_id:   entry.id,
      url:        entry.website_url,
      score:      entry.score ?? 0,
      security:   entry.report.security   ?? [],
      seo:        entry.report.seo        ?? [],
      conversion: entry.report.conversion ?? [],
      barberiaos: entry.report.barberiaos ?? [],
      summary:    entry.report.summary    ?? [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-[#F6F8FB] px-4 py-3">
      <Globe size={13} className="shrink-0 text-slate-400" />
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-600" title={entry.website_url}>
        {entry.website_url}
      </span>

      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Clock size={11} />
        {date} · {time}
      </div>

      {entry.score !== null && theme ? (
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-black ${theme.text} ${theme.bg}`}>
          {entry.score}
        </span>
      ) : (
        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-400">
          {entry.status === "error" ? "Error" : "—"}
        </span>
      )}

      {entry.report && entry.score !== null ? (
        <button
          type="button"
          onClick={handleLoad}
          className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Ver
        </button>
      ) : (
        <span className="w-[45px]" />
      )}
    </div>
  );
}

// ── Results panel ─────────────────────────────────────────────────────────────

function AuditResultPanel({ result }: { result: AuditResult }) {
  const allOk     = (result.security ?? []).filter(c => c.status === "ok").length
                  + (result.seo ?? []).filter(c => c.status === "ok").length
                  + (result.conversion ?? []).filter(c => c.status === "ok").length
                  + (result.barberiaos ?? []).filter(c => c.status === "ok").length;
  const allErrors = (result.security ?? []).filter(c => c.status === "error").length
                  + (result.seo ?? []).filter(c => c.status === "error").length
                  + (result.conversion ?? []).filter(c => c.status === "error").length
                  + (result.barberiaos ?? []).filter(c => c.status === "error").length;
  const allWarns  = (result.security ?? []).filter(c => c.status === "warn").length
                  + (result.seo ?? []).filter(c => c.status === "warn").length
                  + (result.conversion ?? []).filter(c => c.status === "warn").length
                  + (result.barberiaos ?? []).filter(c => c.status === "warn").length;

  return (
    <div className="space-y-4">
      {/* Score summary card */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <ScoreGauge score={result.score} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-black text-[#080A0F]">Resultado del análisis</h2>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                {result.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                <ExternalLink size={11} />
              </a>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Análisis pasivo completado. Los puntos de atención son oportunidades de mejora,
              no fallos de seguridad graves.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {allErrors > 0 && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2">
                  <Info size={14} className="text-red-600" />
                  <span className="text-sm font-semibold text-red-700">
                    {allErrors} {allErrors === 1 ? "punto de atención" : "puntos de atención"}
                  </span>
                </div>
              )}
              {allWarns > 0 && (
                <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2">
                  <AlertTriangle size={14} className="text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">
                    {allWarns} {allWarns === 1 ? "mejora recomendada" : "mejoras recomendadas"}
                  </span>
                </div>
              )}
              {allOk > 0 && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">
                    {allOk} {allOk === 1 ? "control correcto" : "controles correctos"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid gap-4 lg:grid-cols-2">
        {(["security", "seo", "conversion", "barberiaos"] as CategoryKey[]).map(key => (
          <CategorySection key={key} categoryKey={key} checks={result[key] ?? []} />
        ))}
      </div>
    </div>
  );
}

// ── Main client component ─────────────────────────────────────────────────────

export function SecurityAuditClient({ history }: { history: AuditHistoryEntry[] }) {
  const [url, setUrl]             = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [phase, setPhase]         = useState<Phase>("idle");
  const [result, setResult]       = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg]   = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirmed) return;

    setPhase("loading");
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/security-audit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url: url.trim(), confirmed_authorized: true }),
      });
      const data = await res.json() as Record<string, unknown>;

      if (!res.ok) {
        const msg = typeof data.error === "string"
          ? data.error
          : "No se pudo completar el análisis. Inténtalo de nuevo.";
        setErrorMsg(msg);
        setPhase("error");
        return;
      }

      setResult(data as unknown as AuditResult);
      setPhase("done");
    } catch {
      setErrorMsg("Error de conexión. Comprueba tu red e inténtalo de nuevo.");
      setPhase("error");
    }
  }

  function handleLoadHistory(r: AuditResult) {
    setResult(r);
    setPhase("done");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const isLoading = phase === "loading";

  return (
    <div className="space-y-5" ref={formRef}>

      {/* ── Disclaimer ──────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/5 px-4 py-3">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#2563EB]" />
        <p className="text-xs leading-5 text-slate-600">
          <strong className="font-semibold text-[#080A0F]">Auditoría pasiva.</strong>{" "}
          Esta herramienta solo lee información pública de tu web (cabeceras, HTML visible). No accede
          a paneles de administración, no modifica nada ni realiza pruebas activas. No sustituye una
          auditoría de seguridad profesional completa.
        </p>
      </div>

      {/* ── Form ────────────────────────────────────────────────────────────── */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
        <h2 className="mb-5 font-black text-[#080A0F]">Analizar web</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL input */}
          <div className="flex flex-col gap-1.5">
            <label className="form-label" htmlFor="audit-url">
              URL de la web a analizar
            </label>
            <div className="flex gap-2">
              <input
                id="audit-url"
                type="url"
                className="input flex-1"
                placeholder="https://mibarberia.es"
                value={url}
                onChange={e => setUrl(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="submit"
                disabled={isLoading || !confirmed || !url.trim()}
                className="btn-primary shrink-0 gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <><Loader2 size={14} className="animate-spin" /> Analizando…</>
                ) : (
                  <><Search size={14} /> Analizar</>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Introduce la URL completa incluyendo https://
            </p>
          </div>

          {/* Authorization checkbox */}
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-[#F6F8FB] px-4 py-3">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#2563EB]"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              disabled={isLoading}
            />
            <span className="text-sm leading-5 text-slate-600">
              <strong className="font-semibold text-[#080A0F]">Confirmo</strong> que soy propietario
              o tengo autorización expresa para analizar esta web.
            </span>
          </label>
        </form>

        {/* Loading progress */}
        {isLoading && (
          <div className="mt-5 flex flex-col items-center gap-3 py-4">
            <Loader2 size={28} className="animate-spin text-[#2563EB]" />
            <div className="text-center">
              <p className="font-semibold text-[#080A0F]">Analizando tu web…</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Revisando HTTPS, cabeceras, SEO y señales de conversión. Puede tardar hasta 30 s.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-[11px] text-slate-400">
              {["Conexión segura", "Cabeceras HTTP", "Contenido SEO", "Botones de contacto"].map(step => (
                <span key={step} className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1">
                  <Loader2 size={9} className="animate-spin" />
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {phase === "error" && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <Info size={15} className="mt-0.5 shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">{errorMsg}</p>
              <button
                type="button"
                onClick={() => setPhase("idle")}
                className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
              >
                <RotateCcw size={11} /> Intentar de nuevo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {phase === "done" && result && (
        <AuditResultPanel result={result} />
      )}

      {/* ── History ─────────────────────────────────────────────────────────── */}
      {history.length > 0 && (
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-4 font-black text-[#080A0F]">Análisis anteriores</h2>
          <div className="space-y-2">
            {history.map(entry => (
              <HistoryRow key={entry.id} entry={entry} onLoad={handleLoadHistory} />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty history ────────────────────────────────────────────────────── */}
      {history.length === 0 && phase === "idle" && (
        <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-[#F6F8FB]">
            <ShieldCheck size={22} className="text-slate-300" />
          </div>
          <p className="mt-4 font-semibold text-[#080A0F]">Sin análisis todavía</p>
          <p className="mt-1.5 max-w-xs text-sm leading-6 text-slate-400">
            Introduce la URL de tu web o la de un cliente y obtén un informe de mejoras en segundos.
          </p>
        </div>
      )}

    </div>
  );
}
