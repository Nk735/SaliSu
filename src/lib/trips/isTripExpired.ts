const TRIP_EXPIRY_GRACE_MS = 24 * 60 * 60 * 1000;

export function isTripExpired(
  trip: { departure_at: string; return_departure_at?: string | null },
  now = Date.now(),
) {
  const departureAt = Date.parse(trip.departure_at);
  const returnAt = trip.return_departure_at ? Date.parse(trip.return_departure_at) : departureAt;
  return Math.max(departureAt, returnAt) <= now - TRIP_EXPIRY_GRACE_MS;
}
