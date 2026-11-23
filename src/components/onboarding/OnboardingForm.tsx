"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DestinationSelector } from "./DestinationSelector";
import { useRouter } from "next/navigation";
import { ZoneAutocomplete } from "@/components/ui/ZoneAutocomplete";
import { PUGLIA_MUNICIPALITIES, normalizeMunicipality } from "@/lib/pugliaMunicipalities";

export function OnboardingForm({ userId, initialName="", initialZone="" }:{userId:string;initialName?:string;initialZone?:string}) {
  const [name,setName]=useState(initialName); const [dest,setDest]=useState("Bari Centro"); const [zone,setZone]=useState(initialZone); const [loading,setLoading]=useState(false);
  const router=useRouter(); const supabase=createClient();
  async function submit(e:React.FormEvent){
    e.preventDefault();
    const valid=PUGLIA_MUNICIPALITIES.some((item)=>normalizeMunicipality(item)===normalizeMunicipality(zone));
    if(!valid)return;
    setLoading(true);
    await supabase.from("profiles").upsert({id:userId,full_name:name,preferred_destination:dest,starting_zone:zone,onboarding_completed:true,updated_at:new Date().toISOString()});
    router.replace("/home");
  }
  return <form onSubmit={submit} className="space-y-5">
    <div><label className="mb-2 block text-xs font-bold">Nome completo</label><input required value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-xl border border-line bg-input px-3.5 py-3 text-sm outline-none"/></div>
    <ZoneAutocomplete value={zone} onChange={setZone}/>
    <div><label className="mb-2 block text-xs font-bold">Destinazione preferita</label><DestinationSelector value={dest} onChange={setDest}/></div>
    <button disabled={loading||!name||!PUGLIA_MUNICIPALITIES.some((item)=>normalizeMunicipality(item)===normalizeMunicipality(zone))} className="w-full rounded-xl bg-brand py-3 text-sm font-extrabold text-[#0E1110] disabled:opacity-50">Completa onboarding</button>
  </form>;
}
