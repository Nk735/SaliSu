"use client";
import { useEffect,useMemo,useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TripFeed } from "@/components/trips/TripFeed";
import { TripFilters } from "@/components/trips/TripFilters";
import { SupportCard } from "@/components/support/SupportCard";
import { FILTER_BY_USER_ZONE } from "@/lib/features";

type ActiveNode={starting_zone:string;destination:string;users_count:number};

export default function HomePage() {
  const supabase=createClient(); const [trips,setTrips]=useState<any[]>([]); const [destination,setDestination]=useState("Tutte"); const [direction,setDirection]=useState("Tutte"); const [day,setDay]=useState("Tutti"); const [zone,setZone]=useState<string|null>(null); const [nodes,setNodes]=useState<ActiveNode[]>([]); const [profile,setProfile]=useState<any>(null); const [userId,setUserId]=useState(""); const [supportVisible,setSupportVisible]=useState(true);
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;setUserId(user.id);const [{data:p},{data:activeNodes}]=await Promise.all([supabase.from("profiles").select("*").eq("id",user.id).single(),supabase.rpc("get_active_route_nodes")]);setProfile(p);setNodes(activeNodes||[]);})();},[supabase]);
  useEffect(()=>{(async()=>{let q=supabase.from("trips").select("*,profiles(full_name,maps_label,maps_url)").eq("status","active").order("departure_at",{ascending:true});if(destination!=="Tutte")q=q.eq("destination",destination);const {data}=await q;setTrips(data||[]);})();},[supabase,destination]);
  const filtered=useMemo(()=>{
   let result=[...trips];
   if(zone)result=result.filter((trip)=>trip.origin_zone===zone);
   if(FILTER_BY_USER_ZONE&&profile?.starting_zone)result=result.filter((trip)=>trip.origin_zone===profile.starting_zone);
   if(direction!=="Tutte")result=result.filter((trip)=>(trip.direction||((trip.type==="Ritorno"||trip.type==="request")?"Solo ritorno":"Sola andata"))===direction);
   if(day!=="Tutti"){const base=new Date();base.setHours(0,0,0,0);const target=new Date(base);if(day==="Domani")target.setDate(target.getDate()+1);const next=new Date(target);next.setDate(next.getDate()+1);result=result.filter((trip)=>{const date=new Date(trip.departure_at);return date>=target&&date<next;});}
   if(profile?.starting_zone)result.sort((a,b)=>Number(b.origin_zone===profile.starting_zone)-Number(a.origin_zone===profile.starting_zone)||new Date(a.departure_at).getTime()-new Date(b.departure_at).getTime());
   return result;
  },[trips,zone,direction,day,profile]);
  const displayedNodes=useMemo(()=>{
   if(destination==="Tutte"){const totals=new Map<string,number>();nodes.forEach((node)=>totals.set(node.starting_zone,(totals.get(node.starting_zone)||0)+Number(node.users_count||0)));return [...totals].map(([starting_zone,users_count])=>({starting_zone,users_count})).filter((node)=>node.users_count>0);}
   return nodes.filter((node)=>node.destination===destination&&Number(node.users_count)>0);
  },[nodes,destination]);
  const zoneCount=zone?displayedNodes.find((node)=>node.starting_zone===zone)?.users_count||0:0;
  return <><TripFilters destination={destination} setDestination={setDestination} direction={direction} setDirection={setDirection} day={day} setDay={setDay}/>
  <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">{displayedNodes.map((node)=><button key={node.starting_zone} onClick={()=>setZone(zone===node.starting_zone?null:node.starting_zone)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold ${zone===node.starting_zone?"border-brand bg-brand text-[#0E1110]":"border-line bg-card text-muted"}`}>{node.starting_zone} · {node.users_count}</button>)}</div>
  <div className="space-y-3 px-4 pb-5">{filtered.length?<TripFeed trips={filtered} currentUserId={userId}/>:<div className="card rounded-2xl p-5 text-center"><p className="text-sm font-extrabold">Nessun tragitto disponibile</p>{zone&&<p className="mt-1 text-xs text-muted">{zoneCount} colleghi iscritti su questo nodo. Offri tu il primo passaggio.</p>}</div>}{supportVisible&&<SupportCard onClose={()=>setSupportVisible(false)}/>}</div></>;
}
