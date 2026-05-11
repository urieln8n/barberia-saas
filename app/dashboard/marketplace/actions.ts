"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

async function getAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  return { supabase, barbershopId };
}

export type ActionResult = { error: string } | { success: true };

export async function upsertPublicProfile(formData: FormData): Promise<ActionResult> {
  const { supabase, barbershopId } = await getAuth();
  if (!barbershopId) return { error: "No se encontró la barbería." };

  const slugRaw = formData.get("slug");
  if (!slugRaw || typeof slugRaw !== "string") {
    return { error: "El campo URL pública (slug) es obligatorio." };
  }
  const slug = slugRaw.trim().toLowerCase();
  if (!slug || (!/^[a-z0-9][a-z0-9-]{0,78}[a-z0-9]$/.test(slug) && !/^[a-z0-9]{2}$/.test(slug))) {
    return { error: "El slug solo puede contener letras minúsculas, números y guiones (mínimo 2 caracteres)." };
  }

  const publicNameRaw = formData.get("public_name");
  if (!publicNameRaw || typeof publicNameRaw !== "string" || !publicNameRaw.trim()) {
    return { error: "El nombre público es obligatorio." };
  }

  const latRaw = (formData.get("latitude") as string)?.trim();
  const lngRaw = (formData.get("longitude") as string)?.trim();
  const latitude  = latRaw  ? parseFloat(latRaw)  : null;
  const longitude = lngRaw ? parseFloat(lngRaw) : null;

  if (latitude !== null && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
    return { error: "La latitud debe estar entre -90 y 90." };
  }
  if (longitude !== null && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
    return { error: "La longitud debe estar entre -180 y 180." };
  }

  const payload = {
    barbershop_id:   barbershopId,
    slug,
    public_name:     publicNameRaw.trim(),
    city:            (formData.get("city") as string)?.trim() || null,
    neighborhood:    (formData.get("neighborhood") as string)?.trim() || null,
    address:         (formData.get("address") as string)?.trim() || null,
    phone:           (formData.get("phone") as string)?.trim() || null,
    whatsapp:        (formData.get("whatsapp") as string)?.trim() || null,
    instagram:       (formData.get("instagram") as string)?.trim() || null,
    website_url:     (formData.get("website_url") as string)?.trim() || null,
    description:     (formData.get("description") as string)?.trim() || null,
    cover_image_url: (formData.get("cover_image_url") as string)?.trim() || null,
    logo_url:        (formData.get("logo_url") as string)?.trim() || null,
    latitude,
    longitude,
    google_maps_url: (formData.get("google_maps_url") as string)?.trim() || null,
    map_visible:     formData.get("map_visible") === "true",
  };

  const { error } = await supabase
    .from("barbershop_public_profiles")
    .upsert(payload, { onConflict: "barbershop_id" });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/marketplace");
  return { success: true };
}

export async function togglePublished(isPublished: boolean): Promise<ActionResult> {
  const { supabase, barbershopId } = await getAuth();
  if (!barbershopId) return { error: "No se encontró la barbería." };

  const update: Record<string, boolean> = { is_published: isPublished };
  if (!isPublished) update.marketplace_enabled = false;

  const { error } = await supabase
    .from("barbershop_public_profiles")
    .update(update)
    .eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/marketplace");
  return { success: true };
}

export async function toggleMarketplace(enabled: boolean): Promise<ActionResult> {
  const { supabase, barbershopId } = await getAuth();
  if (!barbershopId) return { error: "No se encontró la barbería." };

  if (enabled) {
    const { data: profile } = await supabase
      .from("barbershop_public_profiles")
      .select("is_published")
      .eq("barbershop_id", barbershopId)
      .maybeSingle();

    if (!profile?.is_published) {
      return { error: "Debes publicar tu perfil antes de activar el marketplace." };
    }
  }

  const { error } = await supabase
    .from("barbershop_public_profiles")
    .update({ marketplace_enabled: enabled })
    .eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/marketplace");
  return { success: true };
}
