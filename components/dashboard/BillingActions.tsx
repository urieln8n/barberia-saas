"use client";

import { useState } from "react";
import { CreditCard, ExternalLink } from "lucide-react";

type BillingPlan = {
  name: string;
  label: string;
  amountMonthly: number;
  checkoutEnabled: boolean;
};

type Props = {
  currentPlan: string;
  hasStripeCustomer: boolean;
  plans: BillingPlan[];
};

async function openBillingUrl(path: string, body?: Record<string, unknown>) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!response.ok || !data.url) {
    throw new Error(data.error ?? "No se pudo abrir Stripe.");
  }

  window.location.href = data.url;
}

export function BillingActions({ currentPlan, hasStripeCustomer, plans }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(plan: string) {
    setLoading(plan);
    setError(null);
    try {
      await openBillingUrl("/api/stripe/checkout", { plan });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error abriendo checkout.");
      setLoading(null);
    }
  }

  async function openPortal() {
    setLoading("portal");
    setError(null);
    try {
      await openBillingUrl("/api/stripe/portal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error abriendo portal.");
      setLoading(null);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">
            Facturacion
          </p>
          <h2 className="mt-1 font-black text-[#111827]">Plan y pagos</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Plan actual: <span className="font-bold text-[#111827]">{currentPlan}</span>
          </p>
        </div>
        {hasStripeCustomer && (
          <button
            type="button"
            onClick={openPortal}
            disabled={loading !== null}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-[#F8FAFC] disabled:opacity-50"
          >
            Gestionar pagos <ExternalLink size={14} />
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {plans
          .filter((plan) => plan.checkoutEnabled)
          .map((plan) => (
            <button
              key={plan.name}
              type="button"
              onClick={() => startCheckout(plan.name)}
              disabled={loading !== null || currentPlan.toLowerCase() === plan.name}
              className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-left transition-colors hover:border-[#2F6FEB]/40 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-black text-[#111827]">{plan.label}</span>
                <CreditCard size={15} className="text-[#2F6FEB]" />
              </span>
              <span className="mt-1 block text-sm font-semibold text-neutral-500">
                {plan.amountMonthly} €/mes
              </span>
              <span className="mt-3 block text-xs font-bold uppercase tracking-wide text-[#2F6FEB]">
                {loading === plan.name
                  ? "Abriendo Stripe..."
                  : currentPlan.toLowerCase() === plan.name
                  ? "Plan actual"
                  : "Contratar"}
              </span>
            </button>
          ))}
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
