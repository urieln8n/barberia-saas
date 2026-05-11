import { createMarketingId } from "./id";

const STORAGE_KEY = "barberiaos:marketing-history:v1";
const MAX_ITEMS   = 10;

export type MarketingHistoryItem = {
  id: string;
  source: "template" | "campaign";
  title: string;
  text: string;
  unresolvedPlaceholders: string[];
  createdAt: string;
};

export function getMarketingHistory(): MarketingHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MarketingHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: MarketingHistoryItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addMarketingHistoryItem(
  item: Omit<MarketingHistoryItem, "id" | "createdAt">,
): void {
  const existing = getMarketingHistory();
  const newItem: MarketingHistoryItem = {
    ...item,
    id:        createMarketingId(),
    createdAt: new Date().toISOString(),
  };
  saveHistory([newItem, ...existing].slice(0, MAX_ITEMS));
}

export function removeMarketingHistoryItem(id: string): void {
  saveHistory(getMarketingHistory().filter((item) => item.id !== id));
}

export function clearMarketingHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
