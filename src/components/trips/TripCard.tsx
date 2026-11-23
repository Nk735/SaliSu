"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DriverRatingBadge } from "@/components/reviews/DriverRatingBadge";
import { getInitials } from "@/components/profile/ProfileCard";
import { ENABLE_FAVORITES } from "@/lib/features";

export function TripCard({trip,profile,currentUserId}:{trip:any;profile:any;currentUserId?:string}) {
  const supabase=createClient();const [requested,setRequested]=useState(false);
  const name=profile?.full_name||trip.profiles?.full_name||"Pendolare";
  const own=trip.driver_id===currentUserId;
  const date=new Date(trip.departure_at);
  const direction=trip.type==="Ritorno"||trip.type==="request"?"Ritorno":"Andata";
  async function requestSeat(){if(!currentUserId||own)return;await supabase.from("trip_requests").upsert({trip_id:trip.id,passenger_id:currentUserId,status:"pending",seats:1},{onConflict:"trip_id,passenger_id"});setRequested(true);}
  return <article className="card space-y-3 rounded-2xl p-4">
    <div className="flex items-start justify-between gap-2"><div className="flex min-w-0 items-center gap-2.5"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-xs font-extrabold text-[#0E1110]">{getInitials(name)}</div><div className="min-w-0"><h3 className="truncate text-sm font-extrabold">{name}</h3><DriverRatingBadge/></div></div><div className="flex shrink-0 gap-1.5">{own?<span className="rounded-lg border border-line bg-subtle px-2 py-1.5 text-[10px] font-bold text-muted">Il tuo viaggio</span>:null}{Number(trip.seats_available)>0&&<div className="flex h-11 w-12 flex-col items-center justify-center rounded-xl border border-brand/30 bg-brandSoft text-greenText"><span className="text-xs font-extrabold">{trip.seats_available}</span><span className="text-[9px] font-bold">posti</span></div>}</div></div>
    <div className="flex items-center justify-between rounded-xl border border-line bg-subtle p-3"><div className="min-w-0"><p className="truncate text-xs font-bold">{trip.origin_zone}</p><p className="truncate text-[11px] text-muted">{trip.maps_label?`${trip.origin_zone} · ${trip.maps_label}`:`${trip.destination}`}</p></div><div className="ml-3 border-l border-line pl-3 text-right"><p className="text-[11px] font-bold text-muted">{date.toLocaleDateString("it-IT",{day:"2-digit",month:"short"})}</p><p className="text-lg font-extrabold">{date.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"})}</p><p className="text-[9px] font-bold text-muted">{direction.toUpperCase()}</p></div></div>
    {trip.maps_url&&<a href={trip.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full rounded-lg border border-accentWarmBorder bg-accentWarmSoft px-2.5 py-1.5 text-[11px] font-bold text-accentWarm">📍 {trip.maps_label||"Punto Maps"}</a>}
    <div className="flex items-center justify-between"><p className="text-xs text-muted">{trip.distance_km||0} km</p><p className="text-sm font-extrabold text-greenText">{Number(trip.price_per_passenger)===0?"Gratis":Number(trip.price_per_passenger).toLocaleString("it-IT",{style:"currency",currency:"EUR"})}<span className="text-[10px] text-muted"> / persona</span></p></div>
    {!own&&<button onClick={requestSeat} disabled={requested} className="w-full rounded-xl bg-brand py-2.5 text-xs font-extrabold text-[#0E1110] disabled:opacity-60">{requested?"Richiesta inviata":"Prenota posto"}</button>}
  </article>;
}
