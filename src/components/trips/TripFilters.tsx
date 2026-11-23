"use client";
import { DESTINATIONS } from "@/lib/destinations";

export function TripFilters({destination,setDestination,direction,setDirection,day,setDay}:{destination:string;setDestination:(v:string)=>void;direction:string;setDirection:(v:string)=>void;day:string;setDay:(v:string)=>void}) {
 return <div className="sticky top-0 z-20 space-y-2 border-b border-line bg-base/95 px-4 py-2.5 backdrop-blur-md">
  <div className="grid grid-cols-3 gap-1.5">{["Tutte",...DESTINATIONS].map(d=><button key={d} onClick={()=>setDestination(d)} className={`rounded-xl border py-2 text-[11px] font-bold ${destination===d?"border-brand bg-brand text-[#0E1110]":"border-line bg-card text-muted"}`}>{d}</button>)}</div>
  <div className="grid grid-cols-2 gap-2"><div className="no-scrollbar flex overflow-x-auto rounded-xl border border-line bg-card p-1">{["Tutte","Sola andata","Andata e ritorno","Solo ritorno"].map(v=><button key={v} onClick={()=>setDirection(v)} className={`shrink-0 flex-1 rounded-lg px-2 py-1.5 text-[9px] font-bold ${direction===v?"bg-brand text-[#0E1110]":"text-muted"}`}>{v}</button>)}</div><div className="flex rounded-xl border border-line bg-card p-1">{["Tutti","Oggi","Domani"].map(v=><button key={v} onClick={()=>setDay(v)} className={`flex-1 rounded-lg px-1 py-1.5 text-[10px] font-bold ${day===v?"bg-brand text-[#0E1110]":"text-muted"}`}>{v}</button>)}</div></div>
 </div>;
}
