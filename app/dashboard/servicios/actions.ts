"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { assertCanCreateService, getBarbershopPlanUsage } from "@/src/lib/plans/limits";

async function getBarbershopId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  return { supabase, barbershopId };
}

export async function createService(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const usage = await getBarbershopPlanUsage(supabase, barbershopId);
  const limitError = assertCanCreateService(usage);
  if (limitError) return { error: limitError };

  const { error } = await supabase.from("services").insert({
    barbershop_id:    barbershopId,
    name:             (formData.get("name") as string).trim(),
    price:            parseFloat(formData.get("price") as string),
    duration_minutes: parseInt(formData.get("duration_minutes") as string),
    description:      (formData.get("description") as string)?.trim() || null,
    active:           true,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/servicios");
  return { success: true };
}

export async function updateService(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };
  const id = formData.get("id") as string;

  const { error } = await supabase.from("services").update({
    name:             (formData.get("name") as string).trim(),
    price:            parseFloat(formData.get("price") as string),
    duration_minutes: parseInt(formData.get("duration_minutes") as string),
    description:      (formData.get("description") as string)?.trim() || null,
  }).eq("id", id).eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/servicios");
  return { success: true };
}

export async function deleteService(id: string) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/servicios");
  return { success: true };
}

export async function uploadServiceImage(serviceId: string, file: File): Promise<{ url: string | null; error: string | null }> {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { url: null, error: "No se encontró la barbería." };

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { url: null, error: "Solo se aceptan imágenes JPG, PNG o WebP." };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { url: null, error: "La imagen no puede superar 2 MB." };
  }

  const { data: service } = await supabase
    .from("services")
    .select("id")
    .eq("id", serviceId)
    .eq("barbershop_id", barbershopId)
    .maybeSingle();

  if (!service) return { url: null, error: "Servicio no válido." };

  const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
  const path = `services/${barbershopId}/${serviceId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("barberiaos-media")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { url: null, error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage.from("barberiaos-media").getPublicUrl(path);

  // image_url existe tras migración 035
  await (supabase as any)
    .from("services")
    .update({ image_url: publicUrl })
    .eq("id", serviceId)
    .eq("barbershop_id", barbershopId);

  revalidatePath("/dashboard/servicios");
  return { url: publicUrl, error: null };
}
