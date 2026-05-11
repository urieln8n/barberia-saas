export function createMarketingId(): string {
  try {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
  } catch {
    // Fallback below covers browsers or runtimes with restricted crypto access.
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
