"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { sendWelcomeEmail } from "@/src/lib/email/send-welcome-email";

export async function createBarbershop(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name  = (formData.get("name") as string)?.trim();
  const slug  = (formData.get("slug") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const city  = (formData.get("city") as string)?.trim();

  if (!name || !slug) redirect("/onboarding?error=required");

  // Slug: solo letras minúsculas, números y guiones, 2-80 caracteres
  if (!/^[a-z0-9][a-z0-9-]{0,78}[a-z0-9]$/.test(slug)) {
    redirect("/onboarding?error=invalid-slug");
  }

  // Crear perfil si no existe
  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: user.user_metadata?.full_name ?? "",
    email: user.email
  });

  // Crear barbería
  const { data: barbershop, error } = await supabase
    .from("barbershops")
    .insert({ name: name.trim(), slug: slug.trim(), phone, city, owner_id: user.id })
    .select("id")
    .single();

  if (error || !barbershop) {
    // El slug ya existe u otro error — se maneja en el cliente
    redirect("/onboarding?error=slug");
  }

  // Asociar usuario como owner
  await supabase.from("barbershop_members").insert({
    barbershop_id: barbershop.id,
    user_id: user.id,
    role: "owner"
  });

  // Email de bienvenida (fire-and-forget — no bloquea el redirect)
  sendWelcomeEmail({
    ownerName: user.user_metadata?.full_name ?? "Propietario",
    ownerEmail: user.email!,
    barbershopName: name.trim(),
    barbershopSlug: slug.trim(),
    appUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://barberiaos.com",
  }).catch((err) => console.error("[welcome-email] Error:", err));

  redirect("/dashboard");
}
