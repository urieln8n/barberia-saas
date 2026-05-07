type PlatformAdminRole = "super_admin" | "creator" | "admin";

type PlatformAdminProfile = {
  is_super_admin?: boolean | null;
  platform_role?: string | null;
  role?: string | null;
};

const PLATFORM_ADMIN_ROLES = new Set<PlatformAdminRole>([
  "super_admin",
  "creator",
  "admin"
]);

export const PLATFORM_ADMIN_PROFILE_SELECT = "is_super_admin";

export function isPlatformAdminProfile(profile: PlatformAdminProfile | null | undefined): boolean {
  if (!profile) return false;
  if (profile.is_super_admin === true) return true;

  const role = profile.platform_role ?? profile.role;
  return typeof role === "string" && PLATFORM_ADMIN_ROLES.has(role as PlatformAdminRole);
}

export async function isPlatformAdmin(): Promise<boolean> {
  const { createClient } = await import("@/src/lib/supabase/server");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select(PLATFORM_ADMIN_PROFILE_SELECT)
    .eq("id", user.id)
    .single();

  return isPlatformAdminProfile(data);
}

export async function requirePlatformAdmin(): Promise<void> {
  const { redirect } = await import("next/navigation");

  const ok = await isPlatformAdmin();
  if (!ok) redirect("/login");
}

// Compatibilidad temporal: hoy la BD solo define profiles.is_super_admin.
// Para roles separados, añadir una columna de plataforma en profiles
// (por ejemplo platform_role) y actualizar PLATFORM_ADMIN_PROFILE_SELECT.
