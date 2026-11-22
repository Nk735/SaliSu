"use client";
import { DESTINATIONS } from "@/lib/destinations";

export function TripFilters({destination,setDestination,zone,setZone}:{destination:string;setDestination:(v:string)=>void;zone:string;setZone:(v:string)=>void}) {
  return <div className="sticky top-0 z-20 space-y-2 border-b border-line bg-base/95 px-4 py-3 backdrop-blur-md"><div className="grid grid-cols-3 gap-1.5">{["Tutte",...DESTINATIONS].map(d=><button key={d} onClick={()=>setDestination(d)} className={`rounded-xl border py-2 text-[11px] font-bold ${destination===d?"border-crimson bg-crimson text-white":"border-line bg-card text-muted"}`}>{d}</button>)}</div><select value={zone} onChange={e=>setZone(e.target.value)} className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-xs font-semibold"><option value="ALL">Tutte le zone di partenza</option>{["Poggiofranco","Carrassi","Japigia","Modugno","Bitonto","Triggiano","Molfetta","San Paolo","Noicattaro"].map(z=><option key={z}>{z}</option>)}</select></div>;
}
