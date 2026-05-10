type PlatformAdminRole = "super_admin" | "creator" | "admin";

type PlatformAdminProfile = {
  is_super_admin?: boolean | null;
  platform_role?: string | null;
};

const PLATFORM_ADMIN_ROLES = new Set<PlatformAdminRole>([
  "super_admin",
  "creator",
  "admin"
]);

export const PLATFORM_ADMIN_PROFILE_SELECT = "is_super_admin, platform_role";

function isMissingPlatformRoleColumn(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === "42703" || error.message?.includes("platform_role") === true;
}

export function isPlatformAdminProfile(profile: PlatformAdminProfile | null | undefined): boolean {
  if (!profile) return false;
  if (profile.is_super_admin === true) return true;

  const role = profile.platform_role;
  return typeof role === "string" && PLATFORM_ADMIN_ROLES.has(role as PlatformAdminRole);
}

export async function isPlatformAdmin(): Promise<boolean> {
  const { createClient } = await import("@/src/lib/supabase/server");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select(PLATFORM_ADMIN_PROFILE_SELECT)
    .eq("id", user.id)
    .single();

  if (isMissingPlatformRoleColumn(error)) {
    const { data: legacyData } = await supabase
      .from("profiles")
      .select("is_super_admin")
      .eq("id", user.id)
      .single();

    return isPlatformAdminProfile(legacyData);
  }

  return isPlatformAdminProfile(data);
}

export async function requirePlatformAdmin(): Promise<void> {
  const { redirect } = await import("next/navigation");

  const ok = await isPlatformAdmin();
  if (!ok) redirect("/login");
}

// Compatibilidad: is_super_admin sigue siendo valido mientras platform_role
// permite separar roles de plataforma de roles de barberia.
