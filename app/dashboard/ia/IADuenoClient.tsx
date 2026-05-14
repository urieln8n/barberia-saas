"use client";

import { useState, useTransition } from "react";
import { Bot, Clipboard, Instagram, Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { askOwnerAI } from "./actions";
import type { OwnerAIResult } from "@/src/lib/ai/owner-ai";

const quickQuestions = [
  "¿Qué pasó hoy en mi barbería?",
  "¿Qué clientes debo recuperar?",
  "¿Qué promoción lanzo esta semana?",
  "¿Qué barbero está rindiendo mejor?",
  "¿Qué producto se vende más?",
  "¿Qué horas están vacías?",
  "¿Cuánto puedo facturar si lleno mis huecos?",
  "Dame un resumen para cerrar el día",
];

const priorityClass = {
  low: "border-emerald-100 bg-emerald-50 text-emerald-700",
  medium: "border-amber-100 bg-amber-50 text-amber-700",
  high: "border-red-100 bg-red-50 text-red-700",
};

function CopyBlock({ title, text, icon: Icon }: { title: string; text: string; icon: typeof MessageCircle }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-[#C9922A]" />
          <h3 className="font-black text-[#111827]">{title}</h3>
        </div>
        <button type="button" onClick={copy} className="btn-outline min-h-0 px-3 py-2 text-xs">
          <Clipboard size={13} />
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-4 text-sm font-semibold leading-6 text-neutral-700">
        {text || "Aun no hay texto sugerido."}
      </p>
    </div>
  );
}

export function IADuenoClient({ openAIConfigured }: { openAIConfigured: boolean }) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<OwnerAIResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function ask(nextQuestion?: string) {
    const finalQuestion = (nextQuestion ?? question).trim();
    setError("");

    startTransition(async () => {
      const response = await askOwnerAI(finalQuestion);

      if (!response.ok || !response.result) {
        setError(response.error ?? "No se pudo generar la respuesta.");
        return;
      }

      setResult(response.result);
      setQuestion(finalQuestion);
    });
  }

  return (
    <div className="space-y-6">
      <section className="section-band-dark p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D9B766]">IA del Dueño</p>
            <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">
              Pregunta qué está pasando en tu barbería
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Recibe acciones para vender más, llenar huecos, recuperar clientes, controlar caja y mover productos.
            </p>
          </div>
          <span className={openAIConfigured ? "badge-success" : "badge-warning"}>
            {openAIConfigured ? "OpenAI conectado" : "Modo análisis local activo"}
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value.slice(0, 280))}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                ask();
              }
            }}
            placeholder="Ej: ¿Qué promoción lanzo esta semana?"
            className="input min-h-12 flex-1 py-3"
          />
          <button type="button" onClick={() => ask()} disabled={isPending || question.trim().length === 0} className="btn-dark">
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Preguntar
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickQuestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => ask(item)}
              disabled={isPending}
              className="rounded-full border border-[#E7E2D8] bg-[#FDFBF7] px-3 py-2 text-xs font-bold text-neutral-600 transition hover:border-[#C9922A]/40 hover:text-[#8A641F] disabled:opacity-50"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {isPending && (
        <section className="rounded-2xl border border-[#E7E2D8] bg-white p-8 text-center shadow-sm">
          <Loader2 size={24} className="mx-auto animate-spin text-[#C9922A]" />
          <p className="mt-4 font-black text-[#111827]">Analizando citas, caja, clientes e inventario...</p>
          <p className="mt-1 text-sm text-neutral-500">La IA recibe solo métricas resumidas de tu barbería.</p>
        </section>
      )}

      {error && (
        <section className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-semibold leading-6 text-red-700">
          {error}
        </section>
      )}

      {!result && !isPending && (
        <section className="rounded-2xl border border-dashed border-[#E7E2D8] bg-[#FDFBF7] p-8 text-center">
          <Bot size={28} className="mx-auto text-[#C9922A]" />
          <h2 className="mt-4 text-xl font-black text-[#111827]">Tu IA está lista</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-500">
            Haz una pregunta o usa un botón rápido. Si OpenAI no está configurado, BarberíaOS usará análisis local sin romper la página.
          </p>
        </section>
      )}

      {result && (
        <div className="space-y-6">
          {result.notice && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
              {result.notice}
            </div>
          )}

          <section className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="label-section">{result.mode === "openai" ? `Modelo ${result.model}` : "Análisis local"}</p>
                <h2 className="mt-2 text-2xl font-black text-[#111827]">{result.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-500">{result.summary}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-black ${priorityClass[result.priority]}`}>
                Prioridad {result.priority}
              </span>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {result.insights.map((insight) => (
              <article key={`${insight.label}-${insight.value}`} className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
                <Sparkles size={17} className="text-[#C9922A]" />
                <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-neutral-400">{insight.label}</p>
                <p className="mt-1 text-2xl font-black text-[#080A0F]">{insight.value}</p>
                <p className="mt-2 text-sm leading-6 text-neutral-500">{insight.description}</p>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
            <h2 className="section-heading">Acciones recomendadas</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {result.recommended_actions.map((action) => (
                <div key={`${action.action_type}-${action.title}`} className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-4">
                  <p className="font-black text-[#111827]">{action.title}</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">{action.description}</p>
                  <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-[#8A641F]">
                    {action.action_type}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <CopyBlock title="Mensaje WhatsApp" text={result.whatsapp_message} icon={MessageCircle} />
            <CopyBlock title="Caption Instagram" text={result.instagram_caption} icon={Instagram} />
          </section>
        </div>
      )}
    </div>
  );
}
