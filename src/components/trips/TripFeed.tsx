import { TripCard } from "./TripCard";
import { groupTrips } from "@/lib/groupTrips";

export function TripFeed({trips,currentUserId,selectedDays=[]}:{trips:any[];currentUserId?:string;selectedDays?:number[]}) {
  if(!trips.length)return <div className="rounded-2xl border border-line bg-card p-6 text-center text-sm text-muted">Nessun tragitto disponibile.</div>;
  return <div className="space-y-3.5">{groupTrips(trips,selectedDays).map(trip=><TripCard key={trip.id} trip={trip} profile={trip.profiles} currentUserId={currentUserId}/>)}</div>;
}
