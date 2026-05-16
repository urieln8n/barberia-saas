"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

export type ActionResult = { success: true } | { success: false; error: string };

const PATH = "/admin/shield";
const ReviewIdSchema = z.string().trim().uuid("ID de solicitud no válido");
const StatusSchema = z.enum(["in_review", "completed"], {
  errorMap: () => ({ message: "Estado no válido" }),
});

export async function updateShieldManualReviewStatus(
  id: string,
  status: "in_review" | "completed",
): Promise<ActionResult> {
  await requirePlatformAdmin();

  const parsedId = ReviewIdSchema.safeParse(id);
  if (!parsedId.success) {
    return { success: false, error: parsedId.error.errors[0]?.message ?? "ID no válido" };
  }

  const parsedStatus = StatusSchema.safeParse(status);
  if (!parsedStatus.success) {
    return { success: false, error: parsedStatus.error.errors[0]?.message ?? "Estado no válido" };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("shield_manual_review_requests")
    .update({ status: parsedStatus.data })
    .eq("id", parsedId.data)
    .select("id")
    .single();

  if (error) {
    console.error("[admin/shield] Failed to update manual review status:", error.message);
    return { success: false, error: "No se pudo actualizar la solicitud Shield." };
  }

  revalidatePath(PATH);
  return { success: true };
}
