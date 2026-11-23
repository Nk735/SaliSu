"use client";
import { useEffect,useMemo,useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TripFeed } from "@/components/trips/TripFeed";
import { TripFilters } from "@/components/trips/TripFilters";
import { SupportCard } from "@/components/support/SupportCard";
import { FILTER_BY_USER_ZONE } from "@/lib/features";

type ActiveNode={starting_zone:string;destination:string;users_count:number};

export default function HomePage() {
  const supabase=createClient(); const [trips,setTrips]=useState<any[]>([]); const [type,setType]=useState(""); const [direction,setDirection]=useState("Tutti i tipi"); const [days,setDays]=useState<number[]>([]); const [zone,setZone]=useState<string|null>(null); const [nodes,setNodes]=useState<ActiveNode[]>([]); const [profile,setProfile]=useState<any>(null); const [userId,setUserId]=useState(""); const [supportVisible,setSupportVisible]=useState(true);
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;setUserId(user.id);const [{data:p},{data:activeNodes}]=await Promise.all([supabase.from("profiles").select("*").eq("id",user.id).single(),supabase.rpc("get_active_route_nodes")]);setProfile(p);setNodes(activeNodes||[]);})();},[supabase]);
  useEffect(()=>{(async()=>{let q=supabase.from("trips").select("*,profiles(full_name,maps_label,maps_url)").eq("status","active").order("departure_at",{ascending:true});if(profile?.preferred_destination)q=q.eq("destination",profile.preferred_destination);const {data}=await q;setTrips(data||[]);})();},[supabase,profile?.preferred_destination]);
  const filtered=useMemo(()=>{
   let result=[...trips];
   if(zone)result=result.filter((trip)=>trip.origin_zone===zone);
   if(FILTER_BY_USER_ZONE&&profile?.starting_zone)result=result.filter((trip)=>trip.origin_zone===profile.starting_zone);
   if(type)result=result.filter((trip)=>trip.type===type);
   if(direction!=="Tutti i tipi")result=result.filter((trip)=>(trip.direction||"Sola andata")===direction);
   if(days.length)result=result.filter((trip)=>{const covered=new Set((trip.recurrence_days?.length?trip.recurrence_days:[new Date(trip.departure_at).getDay()]));return days.some(day=>covered.has(day));});
   if(profile?.starting_zone)result.sort((a,b)=>Number(b.origin_zone===profile.starting_zone)-Number(a.origin_zone===profile.starting_zone)||new Date(a.departure_at).getTime()-new Date(b.departure_at).getTime());
   return result;
  },[trips,zone,type,direction,days,profile]);
  const displayedNodes=useMemo(()=>{
   const preferredDestination=profile?.preferred_destination;
   if(!preferredDestination){const totals=new Map<string,number>();nodes.forEach((node)=>totals.set(node.starting_zone,(totals.get(node.starting_zone)||0)+Number(node.users_count||0)));return [...totals].map(([starting_zone,users_count])=>({starting_zone,users_count})).filter((node)=>node.users_count>0);}
   return nodes.filter((node)=>node.destination===preferredDestination&&Number(node.users_count)>0);
  },[nodes,profile?.preferred_destination]);
  const zoneCount=zone?displayedNodes.find((node)=>node.starting_zone===zone)?.users_count||0:0;
  return <><TripFilters type={type} setType={setType} direction={direction} setDirection={setDirection} days={days} setDays={setDays}/>
  <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">{displayedNodes.map((node)=><button key={node.starting_zone} onClick={()=>setZone(zone===node.starting_zone?null:node.starting_zone)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold ${zone===node.starting_zone?"border-brand bg-brand text-[#0E1110]":"border-line bg-card text-muted"}`}>{node.starting_zone} · {node.users_count}</button>)}</div>
  <div className="space-y-3 px-4 pb-5">{filtered.length?<TripFeed trips={filtered} currentUserId={userId} selectedDays={days}/>:<div className="card rounded-2xl p-5 text-center"><p className="text-sm font-extrabold">Nessun tragitto disponibile</p>{zone&&<p className="mt-1 text-xs text-muted">{zoneCount} colleghi iscritti su questo nodo. Offri tu il primo passaggio.</p>}</div>}{supportVisible&&<SupportCard onClose={()=>setSupportVisible(false)}/>}</div></>;
}
