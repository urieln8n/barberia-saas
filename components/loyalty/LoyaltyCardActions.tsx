"use client";

import { useState } from "react";
import { Star, Trophy, Copy, MessageCircle, CheckCircle2, PlusCircle } from "lucide-react";
import { addManualStampAction, redeemRewardAction } from "./loyalty-actions";

interface Props {
  clientId: string;
  barbershopId: string;
  cardId: string | null;
  programId: string;
  clientName: string;
  phone?: string | null;
  stamps: number;
  required: number;
  hasReward: boolean;
  rewardDescription?: string | null;
}

export function LoyaltyCardActions({
  clientId,
  cardId,
  programId,
  clientName,
  phone,
  stamps,
  required,
  hasReward,
  rewardDescription,
}: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopyWhatsApp() {
    const remaining = required - stamps;
    const text = hasReward
      ? `Hola ${clientName}! 🎁 Tienes una recompensa lista: ${rewardDescription ?? "regalo especial"}. Pásate cuando quieras a reclamarla.`
      : `Hola ${clientName}! Te queda${remaining === 1 ? "" : "n"} ${remaining} sello${remaining === 1 ? "" : "s"} para conseguir tu recompensa. ¡Hasta pronto!`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-2">
      {/* Add manual stamp */}
      <form action={addManualStampAction}>
        <input type="hidden" name="client_id" value={clientId} />
        <input type="hidden" name="program_id" value={programId} />
        <input type="hidden" name="notes" value="Sello manual" />
        <button
          type="submit"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#0F172A]"
        >
          <PlusCircle size={15} />
          Añadir sello manual
        </button>
      </form>

      {/* Redeem reward */}
      {hasReward && cardId && (
        <form action={redeemRewardAction}>
          <input type="hidden" name="client_id" value={clientId} />
          <input type="hidden" name="card_id" value={cardId} />
          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#D9B766]/40 bg-[#FFFBEB] px-4 py-2.5 text-sm font-black text-[#8A641F] transition hover:bg-[#FEF3C7]"
          >
            <Trophy size={15} />
            Canjear recompensa
          </button>
        </form>
      )}

      {/* Copy WhatsApp message */}
      <button
        type="button"
        onClick={handleCopyWhatsApp}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50"
      >
        {copied ? <CheckCircle2 size={15} className="text-emerald-600" /> : <Copy size={15} />}
        {copied ? "Mensaje copiado" : "Copiar mensaje WhatsApp"}
      </button>

      {/* Direct WhatsApp link */}
      {phone && (
        <a
          href={`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
            hasReward
              ? `Hola ${clientName}! 🎁 Tienes una recompensa lista. Pásate cuando quieras.`
              : `Hola ${clientName}! Te queda${required - stamps === 1 ? "" : "n"} ${required - stamps} sello${required - stamps === 1 ? "" : "s"} para tu recompensa.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
        >
          <MessageCircle size={15} />
          Abrir WhatsApp
        </a>
      )}
    </div>
  );
}
