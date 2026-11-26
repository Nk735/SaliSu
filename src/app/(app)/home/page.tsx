"use client";
import { useEffect,useMemo,useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TripFeed } from "@/components/trips/TripFeed";
import { TripFilters } from "@/components/trips/TripFilters";
import { SupportCard } from "@/components/support/SupportCard";

export default function HomePage() {
  const supabase=createClient(); const [trips,setTrips]=useState<any[]>([]); const [type,setType]=useState(""); const [direction,setDirection]=useState("Tutti i tipi"); const [days,setDays]=useState<number[]>([]); const [profile,setProfile]=useState<any>(null); const [userId,setUserId]=useState(""); const [supportVisible,setSupportVisible]=useState(true);
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;setUserId(user.id);const {data:p}=await supabase.from("profiles").select("*").eq("id",user.id).single();setProfile(p);})();},[supabase]);
  useEffect(()=>{(async()=>{let q=supabase.from("trips").select("*,profiles(full_name,maps_label,maps_url)").eq("status","active").order("departure_at",{ascending:true});if(profile?.preferred_destination)q=q.eq("destination",profile.preferred_destination);const {data}=await q;setTrips(data||[]);})();},[supabase,profile?.preferred_destination]);
  const filtered=useMemo(()=>{
   let result=[...trips];
   const startingZones=[profile?.starting_zone,...(profile?.show_only_starting_zone===false?[profile?.additional_starting_zone]:[])].filter(Boolean);
   if(startingZones.length)result=result.filter((trip)=>startingZones.includes(trip.origin_zone));
   if(type)result=result.filter((trip)=>trip.type===type);
   if(direction!=="Tutti i tipi")result=result.filter((trip)=>(trip.direction||"Sola andata")===direction);
   if(days.length)result=result.filter((trip)=>{const covered=new Set((trip.recurrence_days?.length?trip.recurrence_days:[new Date(trip.departure_at).getDay()]));return days.some(day=>covered.has(day));});
   if(profile?.starting_zone)result.sort((a,b)=>Number(b.origin_zone===profile.starting_zone)-Number(a.origin_zone===profile.starting_zone)||new Date(a.departure_at).getTime()-new Date(b.departure_at).getTime());
   return result;
  },[trips,type,direction,days,profile]);
  return <><TripFilters type={type} setType={setType} direction={direction} setDirection={setDirection} days={days} setDays={setDays}/>
  <div className="space-y-3 px-4 pb-36">{supportVisible&&<SupportCard onClose={()=>setSupportVisible(false)}/>} {filtered.length?<TripFeed trips={filtered} currentUserId={userId} selectedDays={days}/>:<div className="card rounded-2xl p-5 text-center"><p className="text-sm font-extrabold">Nessun tragitto disponibile</p></div>}</div></>;
}
