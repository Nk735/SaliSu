"use client";
import { useMemo, useState } from "react";
import { PUGLIA_MUNICIPALITIES, normalizeMunicipality } from "@/lib/pugliaMunicipalities";

export function ZoneAutocomplete({value,onChange,label="Comune di partenza",placeholder="Cerca un comune"}:{value:string;onChange:(value:string)=>void;label?:string;placeholder?:string}) {
  const [query,setQuery]=useState(value);
  const matches=useMemo(()=>{
    const normalized=normalizeMunicipality(query);
    if(!normalized)return PUGLIA_MUNICIPALITIES.slice(0,8);
    return PUGLIA_MUNICIPALITIES.filter((zone)=>normalizeMunicipality(zone).includes(normalized)).slice(0,8);
  },[query]);
  function select(zone:string){setQuery(zone);onChange(zone);}
  return <div className="relative">
    <label className="mb-1.5 block text-xs font-bold">{label}</label>
    <input required value={query} onChange={(event)=>{setQuery(event.target.value);onChange(event.target.value)}} placeholder={placeholder} autoComplete="off" className="w-full rounded-xl border border-line bg-input px-3.5 py-3 text-sm outline-none focus:border-brand"/>
    {query && !PUGLIA_MUNICIPALITIES.some((zone)=>normalizeMunicipality(zone)===normalizeMunicipality(query)) && matches.length>0 && <div className="absolute left-0 right-0 top-[68px] z-40 max-h-44 overflow-y-auto rounded-xl border border-line bg-card p-1 shadow-xl">
      {matches.map((zone)=><button type="button" key={zone} onClick={()=>select(zone)} className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold hover:bg-subtle">{zone}</button>)}
    </div>}
  </div>;
}
