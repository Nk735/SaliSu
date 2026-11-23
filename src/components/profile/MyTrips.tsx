"use client";
import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";

export function MyTrips(){
 const supabase=createClient();const [trips,setTrips]=useState<any[]>([]);
 useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data}=await supabase.from("trips").select("*,trip_requests(status,seats)").eq("driver_id",user.id).order("departure_at",{ascending:false});setTrips(data||[]);})();},[supabase]);
 async function remove(id:string){if(!window.confirm("Eliminare definitivamente questo tragitto?"))return;await supabase.from("trips").delete().eq("id",id);setTrips(v=>v.filter(t=>t.id!==id));}
 return <div className="card rounded-2xl p-4"><h3 className="mb-3 text-sm font-extrabold">I miei tragitti</h3><div className="space-y-2">{trips.length?trips.map(t=>{
   const accepted=(t.trip_requests||[]).filter((r:any)=>r.status==="accepted").reduce((sum:number,r:any)=>sum+Number(r.seats||1),0);
   const date=new Date(t.departure_at);
   const direction=t.type==="Ritorno"||t.type==="request"?"Ritorno":"Andata";
   return <div key={t.id} className="flex items-center justify-between gap-2 rounded-xl bg-subtle p-3"><div className="min-w-0"><p className="truncate text-xs font-bold">{t.origin_zone} → {t.destination}</p><p className="mt-1 text-[10px] text-muted">{date.toLocaleDateString("it-IT",{day:"2-digit",month:"short"})} · {date.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"})} · {direction}</p><p className="mt-1 text-[10px] font-bold text-greenText">{accepted} posti prenotati</p></div><button onClick={()=>remove(t.id)} className="shrink-0 text-xs font-bold text-destructive">Elimina</button></div>;
 }):<p className="text-xs text-muted">Nessun tragitto pubblicato.</p>}</div></div>;
}
