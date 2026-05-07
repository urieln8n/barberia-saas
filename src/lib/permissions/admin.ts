import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export async function isSuperAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("is_super_admin")
    .eq("id", user.id)
    .single();

  return data?.is_super_admin === true;
}

export async function requireSuperAdmin(): Promise<void> {
  const ok = await isSuperAdmin();
  if (!ok) redirect("/dashboard");
}
