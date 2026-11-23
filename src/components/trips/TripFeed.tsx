import { TripCard } from "./TripCard";

export function TripFeed({trips,currentUserId}:{trips:any[];currentUserId?:string}) {
  if(!trips.length)return <div className="rounded-2xl border border-line bg-card p-6 text-center text-sm text-muted">Nessun tragitto disponibile.</div>;
  return <div className="space-y-3.5">{trips.map(trip=><TripCard key={trip.id} trip={trip} profile={trip.profiles} currentUserId={currentUserId}/>)}</div>;
}
