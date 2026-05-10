type RetentionMessageInput = {
  name: string;
  bookingUrl: string;
};

export function buildRetentionMessage({
  name,
  bookingUrl,
}: RetentionMessageInput) {
  const displayName = name.trim() || "cliente";

  return `Hola ${displayName}, ya toca repasar tu corte. Puedes reservar aquí: ${bookingUrl}`;
}
