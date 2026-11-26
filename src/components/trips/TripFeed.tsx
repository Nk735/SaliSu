"use client";
import { useMemo } from "react";
import { TripCard } from "./TripCard";
import { groupTrips } from "@/lib/groupTrips";

type RequestStatus = "pending" | "accepted" | "declined";
type RatingSummary = { average: number; count: number };

export function TripFeed({trips,currentUserId,selectedDays=[],requestStatuses={},ratingSummaries={}}:{trips:any[];currentUserId?:string;selectedDays?:number[];requestStatuses?:Record<string,RequestStatus>;ratingSummaries?:Record<string,RatingSummary>}) {
  const groupedTrips=useMemo(()=>groupTrips(trips,selectedDays),[trips,selectedDays]);
  if(!trips.length)return <div className="rounded-2xl border border-line bg-card p-6 text-center text-sm text-muted">Nessun tragitto disponibile.</div>;
  return <div className="space-y-3.5">{groupedTrips.map(trip=><TripCard key={trip.id} trip={trip} profile={trip.profiles} currentUserId={currentUserId} requestStatuses={requestStatuses} ratingSummary={ratingSummaries[trip.driver_id]}/>)}</div>;
}
