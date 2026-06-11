import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) return NextResponse.json({ error: "Barbería no encontrada" }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Body inválido" }, { status: 400 });

  const { cancelBeforeHours, cancellationPolicyText } = body as {
    barbershopId: string;
    cancelBeforeHours: number | null;
    cancellationPolicyText: string | null;
  };

  // biome-ignore lint: cancel_before_hours/cancellation_policy_text not yet in generated types
  const { error } = await (supabase as any)
    .from("barbershops")
    .update({
      cancel_before_hours:      cancelBeforeHours ?? null,
      cancellation_policy_text: cancellationPolicyText ?? null,
    })
    .eq("id", barbershopId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
