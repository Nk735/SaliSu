"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ZoneAutocomplete } from "@/components/ui/ZoneAutocomplete";

export function getInitials(name:string){
  const parts=name.trim().split(/\s+/).filter(Boolean);
  return (parts.length>1?`${parts[0][0]}${parts[parts.length-1][0]}`:(parts[0]?.slice(0,2)||"SU")).toUpperCase();
}

export function ProfileCard({profile}:{profile:any}){
  const supabase=createClient(); const [zone,setZone]=useState(profile.starting_zone||""); const [saving,setSaving]=useState(false);
  async function save(){setSaving(true);await supabase.from("profiles").update({starting_zone:zone}).eq("id",profile.id);setSaving(false);}
  return <div className="card space-y-3 rounded-2xl p-4">
    <div className="flex items-center gap-3.5"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-base font-extrabold text-[#0E1110]">{getInitials(profile.full_name||"SU")}</div><div className="min-w-0"><h2 className="truncate text-base font-extrabold text-main">{profile.full_name||"Pendolare"}</h2><p className="text-xs text-muted">{profile.preferred_destination||"Destinazione non impostata"}</p></div></div>
    <div className="border-t border-line pt-3"><ZoneAutocomplete value={zone} onChange={setZone} label="Comune di partenza"/><button onClick={save} disabled={saving||!zone} className="mt-2 w-full rounded-xl bg-brand py-2.5 text-xs font-extrabold text-[#0E1110] disabled:opacity-50">{saving?"Salvataggio...":"Salva punto"}</button></div>
  </div>;
}
