"use client";
import {useEffect,useMemo,useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {groupTrips} from "@/lib/groupTrips";

export function MyTrips(){
 const supabase=createClient();const [trips,setTrips]=useState<any[]>([]);
 const [showDates,setShowDates]=useState(false);
 useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data}=await supabase.from("trips").select("*,trip_requests(status,seats)").eq("driver_id",user.id).order("departure_at",{ascending:false});setTrips(data||[]);})();},[supabase]);
 async function remove(group:any){if(!window.confirm("Eliminare definitivamente questa serie?"))return;const ids=group.items.map((t:any)=>t.id);const {error}=await supabase.from("trips").delete().in("id",ids);if(error){window.alert("Impossibile eliminare il tragitto: "+error.message);return;}setTrips(v=>v.filter(t=>!ids.includes(t.id)));}
 const groups=useMemo(()=>groupTrips(trips).map(group=>({...group,items:group.groupedTrips})),[trips]);
 return <div className="card rounded-2xl p-4"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-extrabold">I miei tragitti</h3>{groups.some(g=>g.items.length>1)&&<label className="flex items-center gap-1.5 text-[10px] font-bold text-muted"><input type="checkbox" checked={showDates} onChange={e=>setShowDates(e.target.checked)} className="accent-[#86BC25]"/> Mostra date</label>}</div><div className="space-y-2">{groups.length?groups.map(group=>{
   const accepted=group.items.reduce((sum:number,t:any)=>sum+(t.trip_requests||[]).filter((r:any)=>r.status==="accepted").reduce((n:number,r:any)=>n+Number(r.seats||1),0),0);
   const first=new Date(group.departure_at);const days=Array.from(new Set<number>(group.items.map((t:any)=>new Date(t.departure_at).getDay()))).sort((a,b)=>a-b);const labels=["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];const direction=group.direction||(group.type==="request"?"Richiesta":"Andata");
   return <div key={group.id} className="rounded-xl bg-subtle p-3"><div className="flex items-center justify-between gap-2"><div className="min-w-0"><p className="truncate text-xs font-bold">{group.origin_zone} → {group.destination}</p><p className="mt-1 text-[10px] text-muted">{group.items.length>1?days.map(d=>labels[d]).join(" · "):first.toLocaleDateString("it-IT",{day:"2-digit",month:"short"})} · {first.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"})}{group.return_departure_at&&` ↔ ${new Date(group.return_departure_at).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"})}`} · {direction}</p><p className="mt-1 text-[10px] font-bold text-greenText">{accepted} posti prenotati</p></div><button onClick={()=>remove(group)} className="shrink-0 text-xs font-bold text-destructive">Elimina</button></div>{showDates&&group.items.length>1&&<p className="mt-2 border-t border-line pt-2 text-[10px] text-muted">{group.items.map((t:any)=>new Date(t.departure_at).toLocaleDateString("it-IT",{day:"2-digit",month:"short"})).join(" · ")}</p>}</div>;
 }):<p className="text-xs text-muted">Nessun tragitto pubblicato.</p>}</div></div>;
}
