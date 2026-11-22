"use client";
import { useEffect,useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TripFeed } from "@/components/trips/TripFeed";
import { TripFilters } from "@/components/trips/TripFilters";

export default function HomePage() {
  const supabase=createClient(); const [trips,setTrips]=useState<any[]>([]); const [destination,setDestination]=useState("Tutte"); const [zone,setZone]=useState("ALL");
  useEffect(()=>{(async()=>{let q=supabase.from("trips").select("*,profiles(full_name,maps_label,maps_url)").eq("status","active").order("departure_at",{ascending:true});if(destination!=="Tutte")q=q.eq("destination",destination);if(zone!=="ALL")q=q.eq("origin_zone",zone);const {data}=await q;setTrips(data||[]);})();},[supabase,destination,zone]);
  return <><TripFilters destination={destination} setDestination={setDestination} zone={zone} setZone={setZone}/><div className="px-4 pt-3.5"><TripFeed trips={trips}/></div></>;
}
