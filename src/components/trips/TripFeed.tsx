import { TripCard } from "./TripCard";

function groupKey(trip:any) {
  if (trip.recurrence_group_id) return `series:${trip.recurrence_group_id}`;
  if (!trip.is_recurring) return `trip:${trip.id}`;
  return [
    "legacy-series",
    trip.driver_id,
    trip.origin_zone,
    trip.destination,
    trip.direction,
    trip.departure_at.slice(11, 16),
    trip.return_departure_at?.slice(11, 16) || "",
    (trip.recurrence_days || []).join(","),
    trip.recurrence_until || "",
  ].join(":");
}

function groupTrips(trips:any[]) {
  const groups = new Map<string, any>();
  trips.forEach((trip) => {
    const key = groupKey(trip);
    const existing = groups.get(key);
    if (existing) {
      existing.groupedTrips.push(trip);
    } else {
      groups.set(key, {...trip, groupedTrips: [trip]});
    }
  });
  return [...groups.values()];
}

export function TripFeed({trips,currentUserId}:{trips:any[];currentUserId?:string}) {
  if(!trips.length)return <div className="rounded-2xl border border-line bg-card p-6 text-center text-sm text-muted">Nessun tragitto disponibile.</div>;
  return <div className="space-y-3.5">{groupTrips(trips).map(trip=><TripCard key={trip.id} trip={trip} profile={trip.profiles} currentUserId={currentUserId}/>)}</div>;
}
