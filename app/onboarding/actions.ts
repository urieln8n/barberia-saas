"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export async function createBarbershop(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name  = formData.get("name") as string;
  const slug  = formData.get("slug") as string;
  const phone = formData.get("phone") as string;
  const city  = formData.get("city") as string;

  if (!name?.trim() || !slug?.trim()) {
    redirect("/onboarding?error=required");
  }

  // Crear perfil si no existe
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: user.user_metadata?.full_name ?? "",
    email: user.email,
  });

  if (profileError) {
    console.error("[onboarding] profiles.upsert error:", profileError.message, "code:", profileError.code);
  }

  // Crear barbería
  const { data: barbershop, error: barbershopError } = await supabase
    .from("barbershops")
    .insert({ name: name.trim(), slug: slug.trim(), phone, city, owner_id: user.id })
    .select("id")
    .single();

  if (barbershopError || !barbershop) {
    console.error("[onboarding] barbershops.insert error:", barbershopError?.message, "code:", barbershopError?.code);
    // code 23505 = unique_violation (slug duplicado)
    const errorCode = barbershopError?.code === "23505" ? "slug" : "server";
    redirect(`/onboarding?error=${errorCode}`);
  }

  // Asociar usuario como owner en tabla de miembros
  const { error: memberError } = await supabase.from("barbershop_members").insert({
    barbershop_id: barbershop.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    // No bloqueamos el flujo — owner_id en barbershops garantiza acceso fallback
    console.error("[onboarding] barbershop_members.insert error:", memberError.message, "code:", memberError.code);
  }

  redirect("/dashboard");
}
