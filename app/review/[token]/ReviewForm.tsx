"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, MessageSquareText, ShieldCheck, Star } from "lucide-react";
import { submitPublicReview } from "./actions";

type Props = {
  token: string;
  barbershopName: string;
  initialStatus: string;
  initialRating: number | null;
  googleReviewUrl: string | null;
};

export function ReviewForm({
  token,
  barbershopName,
  initialStatus,
  initialRating,
  googleReviewUrl,
}: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRating, setSubmittedRating] = useState<number | null>(
    initialStatus === "pending" ? null : initialRating
  );

  const isSubmitted = submittedRating !== null;
  const isPositive = submittedRating !== null && submittedRating >= 4;

  async function handleSubmit() {
    if (!rating) {
      setError("Selecciona una valoración del 1 al 5.");
      return;
    }

    setSaving(true);
    setError(null);

    const result = await submitPublicReview({
      token,
      rating,
      comment,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSubmittedRating(result.rating ?? rating);
  }

  if (isSubmitted) {
    return (
      <div className="rounded-[28px] border border-[#E7E2D8] bg-white p-6 shadow-xl shadow-slate-900/10 md:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          {isPositive ? <Star size={24} /> : <MessageSquareText size={24} />}
        </div>
        <h1 className="mt-5 text-2xl font-black text-[#111827]">
          {isPositive ? "Gracias por tu valoración" : "Gracias por contárnoslo"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          {isPositive
            ? `Nos alegra saber que tu experiencia en ${barbershopName} fue buena.`
            : "Sentimos que la experiencia no haya estado a la altura. Tu comentario queda como feedback privado para el equipo."}
        </p>

        {isPositive && googleReviewUrl && (
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0F172A]"
          >
            Dejar reseña en Google <ExternalLink size={16} />
          </a>
        )}

        <div className="mt-5 flex items-start gap-2 rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-4 text-xs leading-5 text-neutral-500">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#8A641F]" />
          Las valoraciones privadas no se muestran públicamente desde BarberiaOS.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-[#E7E2D8] bg-white p-6 shadow-xl shadow-slate-900/10 md:p-8">
      <p className="label-section">Valoración</p>
      <h1 className="mt-2 text-2xl font-black text-[#111827]">
        ¿Cómo fue tu experiencia en {barbershopName}?
      </h1>
      <p className="mt-2 text-sm leading-6 text-neutral-500">
        Tu opinión ayuda a mejorar el servicio. Si algo no fue bien, lo revisará el equipo de forma privada.
      </p>

      <div className="mt-6 grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setRating(value);
              setError(null);
            }}
            className={`flex aspect-square items-center justify-center rounded-2xl border text-lg font-black transition active:scale-[0.97] ${
              rating === value
                ? "border-[#111827] bg-[#111827] text-white"
                : "border-[#E7E2D8] bg-[#FDFBF7] text-neutral-500 hover:border-[#111827]"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <label className="mt-5 block text-sm font-bold text-[#111827]">
        Comentario opcional
      </label>
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        rows={4}
        placeholder="Cuéntanos qué te gustó o qué deberíamos mejorar."
        className="input mt-2 resize-none py-3"
      />

      {rating !== null && rating <= 3 && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-800">
            Sentimos que no haya sido una buena experiencia.
          </p>
          <p className="mt-1 text-sm leading-6 text-amber-700">
            Tu comentario se guardará como feedback privado para que la barbería pueda revisarlo.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={saving}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0F172A] disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Enviar valoración"}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-neutral-400">
        Al enviar tu valoración confirmas que has leído la{" "}
        <Link href="/legal/privacidad" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
          Política de Privacidad
        </Link>
        .
      </p>
    </div>
  );
}
