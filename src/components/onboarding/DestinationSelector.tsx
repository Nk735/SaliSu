"use client";
import { DESTINATIONS } from "@/lib/destinations";

export function DestinationSelector({value,onChange}:{value:string;onChange:(v:string)=>void}) {
  return <div className="grid grid-cols-2 gap-2">{DESTINATIONS.map(d=><button type="button" key={d} onClick={()=>onChange(d)} className={`rounded-xl border p-3 text-sm font-bold ${value===d?"border-crimson bg-crimsonSoft text-crimson":"border-line bg-card text-ink"}`}>{d}</button>)}</div>;
}
