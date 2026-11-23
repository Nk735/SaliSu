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

function groupTrips(trips:any[],selectedDays:number[]) {
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
  return [...groups.values()].sort((a,b)=>{
    const overlap=(group:any)=>selectedDays.reduce((count,day)=>count+(group.groupedTrips.some((trip:any)=>new Date(trip.departure_at).getDay()===day)?1:0),0);
    return overlap(b)-overlap(a);
  });
}

export function TripFeed({trips,currentUserId,selectedDays=[]}:{trips:any[];currentUserId?:string;selectedDays?:number[]}) {
  if(!trips.length)return <div className="rounded-2xl border border-line bg-card p-6 text-center text-sm text-muted">Nessun tragitto disponibile.</div>;
  return <div className="space-y-3.5">{groupTrips(trips,selectedDays).map(trip=><TripCard key={trip.id} trip={trip} profile={trip.profiles} currentUserId={currentUserId}/>)}</div>;
}
