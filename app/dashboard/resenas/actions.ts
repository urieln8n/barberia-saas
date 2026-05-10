"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

async function getContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);

  if (!barbershopId) {
    redirect("/onboarding");
  }

  return { supabase, barbershopId };
}

export async function createReviewLinkAction() {
  const { supabase, barbershopId } = await getContext();

  await supabase.from("reviews").insert({
    business_id: barbershopId,
    source: "manual_link",
    status: "pending",
    is_public: false,
  });

  revalidatePath("/dashboard/resenas");
}

export async function saveGoogleReviewUrlAction(formData: FormData) {
  const { supabase, barbershopId } = await getContext();
  const googleReviewUrl = String(formData.get("google_review_url") ?? "").trim();

  await supabase
    .from("barbershops")
    .update({
      google_review_url: googleReviewUrl || null,
    })
    .eq("id", barbershopId);

  revalidatePath("/dashboard/resenas");
}
