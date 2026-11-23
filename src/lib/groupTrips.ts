export function getTripGroupKey(trip: any) {
  if (trip.recurrence_group_id) return `series:${trip.recurrence_group_id}`;
  if (!trip.is_recurring) return `trip:${trip.id}`;
  return [
    "legacy-series",
    trip.driver_id,
    trip.origin_zone,
    trip.destination,
    trip.direction,
    trip.departure_at?.slice(11, 16),
    trip.return_departure_at?.slice(11, 16) || "",
    (trip.recurrence_days || []).join(","),
    trip.recurrence_until || "",
  ].join(":");
}

export function groupTrips(trips: any[], selectedDays: number[] = []) {
  const groups = new Map<string, any>();

  trips.forEach((trip) => {
    const key = getTripGroupKey(trip);
    const existing = groups.get(key);
    if (existing) {
      existing.groupedTrips.push(trip);
    } else {
      groups.set(key, { ...trip, groupedTrips: [trip] });
    }
  });

  return [...groups.values()].sort((a, b) => {
    const overlap = (group: any) =>
      selectedDays.reduce(
        (count, day) =>
          count +
          (group.groupedTrips.some(
            (trip: any) => new Date(trip.departure_at).getDay() === day,
          )
            ? 1
            : 0),
        0,
      );
    return overlap(b) - overlap(a);
  });
}
