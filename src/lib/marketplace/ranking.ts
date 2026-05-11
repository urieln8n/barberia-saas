export type PlanName = "starter" | "growth" | "premium" | "custom";

type RankableProfile = {
  featured: boolean;
  featured_until?: string | null;
  priority_score?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  cover_image_url?: string | null;
  logo_url?: string | null;
  description?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
};

const PLAN_BONUS: Record<PlanName, number> = {
  premium: 60,
  custom:  60,
  growth:  20,
  starter:  0,
};

export function calculatePriorityScore(
  profile: RankableProfile,
  planName: PlanName | null,
): number {
  let score = 0;

  const now = new Date();
  const activeFeatured =
    profile.featured &&
    (profile.featured_until == null || new Date(profile.featured_until) > now);
  if (activeFeatured) score += 100;

  score += PLAN_BONUS[planName ?? "starter"] ?? 0;

  // Profile completeness bonus
  const fields: Array<unknown> = [
    profile.cover_image_url,
    profile.logo_url,
    profile.description,
    profile.whatsapp,
    profile.instagram,
    profile.latitude,
    profile.longitude,
  ];
  const filled = fields.filter((v) => v != null && v !== "").length;
  if (filled >= 5) score += 10;

  return score;
}

export function sortByPriority<T extends RankableProfile>(profiles: T[]): T[] {
  return [...profiles].sort((a, b) => {
    const sa = a.priority_score ?? 0;
    const sb = b.priority_score ?? 0;
    if (sb !== sa) return sb - sa;
    // Tiebreak: featured first, then completeness
    const fa = a.featured ? 1 : 0;
    const fb = b.featured ? 1 : 0;
    return fb - fa;
  });
}
