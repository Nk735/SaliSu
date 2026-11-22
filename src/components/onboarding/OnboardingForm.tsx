"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DestinationSelector } from "./DestinationSelector";
import { useRouter } from "next/navigation";

export function OnboardingForm({ userId, initialName="" }:{userId:string;initialName?:string}) {
  const [name,setName]=useState(initialName); const [dest,setDest]=useState("Bari Centro"); const [loading,setLoading]=useState(false);
  const router=useRouter(); const supabase=createClient();
  async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);await supabase.from("profiles").upsert({id:userId,full_name:name,preferred_destination:dest,onboarding_completed:true,updated_at:new Date().toISOString()});router.replace("/home");}
  return <form onSubmit={submit} className="space-y-5"><div><label className="mb-2 block text-xs font-bold">Nome completo</label><input required value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm outline-none"/></div><div><label className="mb-2 block text-xs font-bold">Destinazione preferita</label><DestinationSelector value={dest} onChange={setDest}/></div><button disabled={loading||!name} className="w-full rounded-xl bg-crimson py-3 text-sm font-extrabold text-white">Completa onboarding</button></form>;
}
