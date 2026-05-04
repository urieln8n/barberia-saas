"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export async function createBarbershop(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name     = formData.get("name") as string;
  const slug     = formData.get("slug") as string;
  const phone    = formData.get("phone") as string;
  const city     = formData.get("city") as string;

  if (!name?.trim() || !slug?.trim()) return;

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

  redirect("/dashboard");
}
