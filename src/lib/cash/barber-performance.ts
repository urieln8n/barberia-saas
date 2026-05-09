export type BarberPerformanceMovement = {
  amount: number | string | null;
  discount_amount: number | string | null;
  tip_amount: number | string | null;
  payment_method: string | null;
  movement_type: string | null;
  barber_id: string | null;
  client_id?: string | null;
  service_id?: string | null;
};

export type BarberPerformanceBarber = {
  id: string;
  name: string;
};

export type BarberPerformanceItem = {
  barberId: string;
  barberName: string;
  totalSold: number;
  clientsServed: number;
  servicesDone: number;
  averageTicket: number;
  totalTips: number;
  paymentMethods: string[];
  performanceStatus: "high" | "normal" | "low";
};

function signedMovementTotal(movement: BarberPerformanceMovement) {
  const amount = Number(movement.amount ?? 0);
  const discount = Number(movement.discount_amount ?? 0);
  const tip = Number(movement.tip_amount ?? 0);
  const total = amount - discount + tip;

  if (movement.movement_type === "refund" || movement.movement_type === "expense") {
    return -total;
  }

  return total;
}

function getPerformanceStatus(
  totalSold: number,
  servicesDone: number
): BarberPerformanceItem["performanceStatus"] {
  if (totalSold >= 150 || servicesDone >= 5) return "high";
  if (totalSold <= 0 || servicesDone <= 1) return "low";
  return "normal";
}

export function buildBarberPerformance(
  barbers: BarberPerformanceBarber[],
  movements: BarberPerformanceMovement[]
): BarberPerformanceItem[] {
  return barbers
    .map((barber) => {
      const barberMovements = movements.filter(
        (movement) => movement.barber_id === barber.id && movement.movement_type === "payment"
      );
      const clientIds = new Set<string>();
      let anonymousClients = 0;
      let servicesDone = 0;
      const paymentMethods = new Set<string>();

      const totalSold = barberMovements.reduce((sum, movement) => {
        if (movement.client_id) {
          clientIds.add(movement.client_id);
        } else {
          anonymousClients += 1;
        }

        if (movement.service_id) {
          servicesDone += 1;
        }

        if (movement.payment_method) {
          paymentMethods.add(movement.payment_method);
        }

        return sum + signedMovementTotal(movement);
      }, 0);

      const totalTips = barberMovements.reduce(
        (sum, movement) => sum + Number(movement.tip_amount ?? 0),
        0
      );
      const clientsServed = clientIds.size + anonymousClients;
      const averageTicket =
        barberMovements.length > 0 ? totalSold / barberMovements.length : 0;

      return {
        barberId: barber.id,
        barberName: barber.name,
        totalSold,
        clientsServed,
        servicesDone,
        averageTicket,
        totalTips,
        paymentMethods: Array.from(paymentMethods).sort(),
        performanceStatus: getPerformanceStatus(totalSold, servicesDone),
      };
    })
    .sort((a, b) => b.totalSold - a.totalSold);
}
