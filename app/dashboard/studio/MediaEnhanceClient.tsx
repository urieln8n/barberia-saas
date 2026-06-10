"use client";

import { useCallback, useRef, useState } from "react";
import {
  ArrowLeft, Check, Copy, Download, Film,
  RefreshCw, Upload, X,
} from "lucide-react";
import {
  ENHANCE_MODES, MEDIA_PLATFORMS,
  type EnhanceMode, type EnhanceModeInput, type MediaPlatform,
  type EnhanceResult,
} from "@/lib/studio/media-enhance";

type StudioCredits = { current: number; monthly: number; extra: number; plan: string };
type Props = { studioCredits: StudioCredits };

// ─── File drop zone ───────────────────────────────────────────────────────────

function DropZone({
  label, accept, onFile, file, onClear,
}: {
  label: string;
  accept: string;
  onFile: (f: File) => void;
  file: File | null;
  onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }, [onFile]);

  if (file) {
    const isImage = file.type.startsWith("image/");
    const preview = isImage ? URL.createObjectURL(file) : null;
    return (
      <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-violet-50">
        {preview && (
          // biome-ignore lint: no alt needed for decorative preview
          <img src={preview} alt="" className="h-40 w-full object-cover" />
        )}
        {!preview && (
          <div className="flex h-24 items-center justify-center gap-2 text-sm text-violet-700">
            <Film size={16} />
            <span className="font-semibold">{file.name}</span>
          </div>
        )}
        <div className="flex items-center justify-between px-3 py-2">
          <p className="truncate text-xs text-slate-500">{file.name}</p>
          <button onClick={onClear} className="shrink-0 rounded-full p-1 hover:bg-slate-200">
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-colors ${
        dragging ? "border-violet-400 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/40"
      }`}
    >
      <Upload size={20} className="text-slate-400" />
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="text-[10px] text-slate-400">Pulsa o arrastra aquí</p>
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
    </button>
  );
}

// ─── Result display ───────────────────────────────────────────────────────────

function ImageResult({
  originalUrl, enhancedUrl, onReset,
}: { originalUrl: string; enhancedUrl: string; onReset: () => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <p className="bg-slate-50 px-3 py-1.5 text-[10px] font-black text-slate-500">ORIGINAL</p>
          {/* biome-ignore lint: decorative */}
          <img src={originalUrl} alt="" className="w-full object-cover" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-violet-200">
          <p className="bg-violet-50 px-3 py-1.5 text-[10px] font-black text-violet-600">MEJORADA ✨</p>
          {/* biome-ignore lint: decorative */}
          <img src={enhancedUrl} alt="" className="w-full object-cover" />
        </div>
      </div>
      <div className="flex gap-3">
        <a href={enhancedUrl} download target="_blank" rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-700">
          <Download size={14} /> Descargar
        </a>
        <button onClick={onReset}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
          <RefreshCw size={14} /> Otra imagen
        </button>
      </div>
    </div>
  );
}

function BeforeAfterResult({
  compositeUrl, onReset,
}: { compositeUrl: string; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(compositeUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-violet-200">
        <p className="bg-violet-50 px-3 py-1.5 text-[10px] font-black text-violet-600">ANTES / DESPUÉS ✨</p>
        {/* biome-ignore lint: decorative */}
        <img src={compositeUrl} alt="" className="w-full object-cover" />
      </div>
      <div className="flex gap-3">
        <a href={compositeUrl} download target="_blank" rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-700">
          <Download size={14} /> Descargar
        </a>
        <button onClick={copy}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
          {copied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar URL</>}
        </button>
        <button onClick={onReset}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  );
}

function VideoJobResult({
  jobId, onReset,
}: { jobId: string; onReset: () => void }) {
  const [state,    setState]    = useState<"polling" | "done" | "error">("polling");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [err,      setErr]      = useState<string | null>(null);

  // Start polling on mount
  const polled = useRef(false);
  if (!polled.current) {
    polled.current = true;
    (async () => {
      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 5000));
        try {
          const res    = await fetch(`/api/studio/video/status/${jobId}`);
          const status = await res.json();
          if (status.status === "completed") { setVideoUrl(status.videoUrl); setState("done"); return; }
          if (status.status === "failed")    { setErr(status.errorMsg ?? "Error"); setState("error"); return; }
        } catch { /* continue polling */ }
      }
      setErr("Tiempo de espera agotado"); setState("error");
    })();
  }

  if (state === "done" && videoUrl) {
    return (
      <div className="space-y-3">
        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-sm font-black text-emerald-800">Vídeo listo</p>
          <a href={videoUrl} target="_blank" rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 underline">
            <Film size={12} /> Ver vídeo →
          </a>
        </div>
        <div className="flex gap-3">
          <a href={videoUrl} download target="_blank" rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-700">
            <Download size={14} /> Descargar
          </a>
          <button onClick={onReset}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
            <RefreshCw size={14} /> Otra foto
          </button>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="space-y-3">
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {err}
        </p>
        <button onClick={onReset} className="text-xs font-semibold text-slate-500 underline">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6 text-center">
      <RefreshCw size={20} className="mx-auto mb-2 animate-spin text-violet-500" />
      <p className="text-sm font-black text-violet-800">Generando vídeo…</p>
      <p className="mt-1 text-xs text-violet-600">Esto puede tardar 1–3 minutos</p>
    </div>
  );
}

function SubtitlesResult({
  text, srt, onReset,
}: { text: string; srt: string; onReset: () => void }) {
  const [copiedText, setCopiedText] = useState<"text" | "srt" | null>(null);
  function copy(content: string, key: "text" | "srt") {
    navigator.clipboard.writeText(content).catch(() => {});
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  }
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black text-slate-700">Transcripción completa</p>
          <button onClick={() => copy(text, "text")}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500 transition hover:border-violet-200 hover:text-violet-700">
            {copiedText === "text" ? <><Check size={10} /> Copiado</> : <><Copy size={10} /> Copiar</>}
          </button>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{text}</p>
      </div>
      <div className="rounded-2xl bg-slate-900 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-black tracking-wide text-slate-400">ARCHIVO SRT</p>
          <button onClick={() => copy(srt, "srt")}
            className="flex items-center gap-1 rounded-lg border border-slate-600 px-2 py-1 text-[11px] font-semibold text-slate-400 transition hover:border-violet-400 hover:text-violet-300">
            {copiedText === "srt" ? <><Check size={10} /> Copiado</> : <><Copy size={10} /> Copiar .srt</>}
          </button>
        </div>
        <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">{srt.slice(0, 600)}{srt.length > 600 ? "\n…" : ""}</pre>
      </div>
      <button onClick={onReset}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
        <RefreshCw size={14} /> Otro vídeo
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MediaEnhanceClient({ studioCredits }: Props) {
  const [selectedMode, setSelectedMode] = useState<EnhanceMode | null>(null);
  const [platform,     setPlatform]     = useState<MediaPlatform>("instagram_reel");
  const [file,         setFile]         = useState<File | null>(null);
  const [fileAfter,    setFileAfter]    = useState<File | null>(null);
  const [processing,   setProcessing]   = useState(false);
  const [result,       setResult]       = useState<EnhanceResult | null>(null);
  const [error,        setError]        = useState<string | null>(null);

  const modeDef    = ENHANCE_MODES.find(m => m.mode === selectedMode);
  const noCredits  = studioCredits.current <= 0;
  const needsPlatform = selectedMode === "improve_image" || selectedMode === "social_format";
  const canProcess = !!selectedMode && !!file && !noCredits && !processing &&
    (selectedMode !== "before_after" || !!fileAfter);

  function reset() {
    setSelectedMode(null);
    setFile(null);
    setFileAfter(null);
    setResult(null);
    setError(null);
  }

  async function handleProcess() {
    if (!selectedMode || !file) return;
    setProcessing(true);
    setError(null);

    try {
      if (selectedMode === "image_to_video") {
        const fd = new FormData();
        fd.append("file",     file);
        fd.append("platform", platform);
        const res  = await fetch("/api/studio/media/i2v", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) { setError(json.error ?? `Error ${res.status}`); return; }
        setResult({ type: "video_job", jobId: json.jobId });
        return;
      }

      if (selectedMode === "subtitles") {
        const fd = new FormData();
        fd.append("file", file);
        const res  = await fetch("/api/studio/media/subtitles", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) { setError(json.error ?? `Error ${res.status}`); return; }
        setResult({ type: "subtitles", text: json.text, segments: json.segments, srt: json.srt });
        return;
      }

      // improve_image | social_format | before_after
      const fd = new FormData();
      fd.append("file",  file);
      fd.append("mode",  selectedMode);
      if (needsPlatform) fd.append("platform", platform);
      if (selectedMode === "before_after" && fileAfter) fd.append("file_after", fileAfter);

      const res  = await fetch("/api/studio/media/enhance", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? `Error ${res.status}`); return; }

      setResult(json as EnhanceResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de red");
    } finally {
      setProcessing(false);
    }
  }

  // ── Result view ──
  if (result) {
    if (result.type === "image") {
      return <ImageResult originalUrl={result.originalUrl} enhancedUrl={result.enhancedUrl} onReset={reset} />;
    }
    if (result.type === "before_after") {
      return <BeforeAfterResult compositeUrl={result.compositeUrl} onReset={reset} />;
    }
    if (result.type === "video_job") {
      return <VideoJobResult jobId={result.jobId} onReset={reset} />;
    }
    if (result.type === "subtitles") {
      return <SubtitlesResult text={result.text} srt={result.srt} onReset={reset} />;
    }
  }

  return (
    <div className="space-y-5">

      {/* Mode selection */}
      {!selectedMode && (
        <div className="space-y-3">
          <p className="text-sm font-black text-slate-700">¿Qué quieres mejorar?</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ENHANCE_MODES.map((m) => (
              <button
                key={m.mode}
                onClick={() => setSelectedMode(m.mode)}
                disabled={noCredits}
                className={`relative flex flex-col rounded-2xl border p-4 text-left transition-all hover:border-violet-200 hover:bg-violet-50/30 ${
                  noCredits ? "cursor-not-allowed opacity-50" : "border-slate-200 bg-white"
                }`}
              >
                {m.badge && (
                  <span className="absolute right-2 top-2 rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-black text-violet-700">
                    {m.badge}
                  </span>
                )}
                <span className="mb-2 text-xl">{m.icon}</span>
                <p className="text-xs font-black text-slate-900">{m.label}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{m.subline}</p>
                <p className="mt-2 text-[10px] font-black text-violet-600">{m.creditsUsed} crédito{m.creditsUsed > 1 ? "s" : ""}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode selected: show upload + options */}
      {selectedMode && !result && (
        <div className="space-y-4">
          <button onClick={() => { setSelectedMode(null); setFile(null); setFileAfter(null); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">
            <ArrowLeft size={12} /> {modeDef?.icon} {modeDef?.label}
          </button>

          {/* File upload */}
          {selectedMode === "before_after" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-[10px] font-black text-slate-500">ANTES</p>
                <DropZone
                  label="Foto original"
                  accept="image/*"
                  file={file}
                  onFile={setFile}
                  onClear={() => setFile(null)}
                />
              </div>
              <div>
                <p className="mb-1.5 text-[10px] font-black text-slate-500">DESPUÉS</p>
                <DropZone
                  label="Foto resultado"
                  accept="image/*"
                  file={fileAfter}
                  onFile={setFileAfter}
                  onClear={() => setFileAfter(null)}
                />
              </div>
            </div>
          ) : (
            <DropZone
              label={selectedMode === "subtitles" ? "Sube tu vídeo (máx 25 MB)" : "Sube tu imagen"}
              accept={selectedMode === "subtitles" ? "video/*,audio/*" : "image/*"}
              file={file}
              onFile={setFile}
              onClear={() => setFile(null)}
            />
          )}

          {/* Platform selector (for image modes) */}
          {needsPlatform && (
            <div>
              <p className="mb-2 text-xs font-black text-slate-700">¿Para qué red?</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {MEDIA_PLATFORMS.map((p) => (
                  <button key={p.id} onClick={() => setPlatform(p.id)}
                    className={`rounded-xl border px-2 py-2.5 text-center transition-all ${
                      platform === p.id
                        ? "border-violet-400 bg-violet-50 ring-1 ring-violet-400"
                        : "border-slate-200 bg-white hover:border-violet-200"
                    }`}>
                    <p className="text-[10px] font-black text-slate-900">{p.label}</p>
                    <p className="mt-0.5 text-[9px] text-slate-400">{p.subline}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
              {error}
            </p>
          )}

          <button
            onClick={handleProcess}
            disabled={!canProcess}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-4 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-50"
          >
            {processing
              ? <><RefreshCw size={14} className="animate-spin" /> Procesando…</>
              : <>{modeDef?.icon} {modeDef?.label} — {modeDef?.creditsUsed} crédito{(modeDef?.creditsUsed ?? 1) > 1 ? "s" : ""}</>
            }
          </button>
        </div>
      )}
    </div>
  );
}
