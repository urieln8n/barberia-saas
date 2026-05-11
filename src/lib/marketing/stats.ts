export const MARKETING_TEMPLATE_STATS_KEY =
  "barberiaos:marketing-template-stats:v1";

export type MarketingTemplateStat = {
  templateId: string;
  templateTitle: string;
  copiedCount: number;
  lastCopiedAt: string;
};

function readStats(): MarketingTemplateStat[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(MARKETING_TEMPLATE_STATS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isMarketingTemplateStat);
  } catch {
    return [];
  }
}

function isMarketingTemplateStat(value: unknown): value is MarketingTemplateStat {
  if (!value || typeof value !== "object") return false;

  const stat = value as Partial<MarketingTemplateStat>;
  return (
    typeof stat.templateId === "string" &&
    typeof stat.templateTitle === "string" &&
    typeof stat.copiedCount === "number" &&
    Number.isFinite(stat.copiedCount) &&
    typeof stat.lastCopiedAt === "string"
  );
}

function saveStats(stats: MarketingTemplateStat[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MARKETING_TEMPLATE_STATS_KEY, JSON.stringify(stats));
}

function sortStats(stats: MarketingTemplateStat[]): MarketingTemplateStat[] {
  return [...stats].sort((a, b) => {
    if (b.copiedCount !== a.copiedCount) {
      return b.copiedCount - a.copiedCount;
    }

    return (
      new Date(b.lastCopiedAt).getTime() - new Date(a.lastCopiedAt).getTime()
    );
  });
}

export function getMarketingTemplateStats(): MarketingTemplateStat[] {
  return sortStats(readStats());
}

export function incrementMarketingTemplateStat(
  templateId: string,
  templateTitle: string,
): void {
  const now = new Date().toISOString();
  const existing = readStats();
  const current = existing.find((stat) => stat.templateId === templateId);

  if (!current) {
    saveStats([
      ...existing,
      {
        templateId,
        templateTitle,
        copiedCount: 1,
        lastCopiedAt: now,
      },
    ]);
    return;
  }

  saveStats(
    existing.map((stat) =>
      stat.templateId === templateId
        ? {
            ...stat,
            templateTitle,
            copiedCount: stat.copiedCount + 1,
            lastCopiedAt: now,
          }
        : stat,
    ),
  );
}

export function clearMarketingTemplateStats(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(MARKETING_TEMPLATE_STATS_KEY);
}

export function getTopMarketingTemplates(
  limit = 3,
): MarketingTemplateStat[] {
  return getMarketingTemplateStats().slice(0, limit);
}
