"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ZoneAutocomplete } from "@/components/ui/ZoneAutocomplete";
import { Pencil } from "lucide-react";

export function getInitials(name:string){
  const parts=name.trim().split(/\s+/).filter(Boolean);
  return (parts.length>1?`${parts[0][0]}${parts[parts.length-1][0]}`:(parts[0]?.slice(0,2)||"SU")).toUpperCase();
}

export function ProfileCard({profile,editing,activeSection,onToggle,onEditSection,onSaved}:{profile:any;editing:boolean;activeSection:string|null;onToggle:()=>void;onEditSection:(section:string)=>void;onSaved:(values:any)=>void}){
  const supabase=createClient(); const [zone,setZone]=useState(profile.starting_zone||""); const [saving,setSaving]=useState(false);
  async function save(){setSaving(true);const {error}=await supabase.from("profiles").update({starting_zone:zone}).eq("id",profile.id);setSaving(false);if(error){window.alert("Impossibile salvare il comune: "+error.message);return;}onSaved({starting_zone:zone});}
  return <div className="card space-y-3 rounded-2xl p-4">
    <div className="flex items-center gap-3.5"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-base font-extrabold text-[#0E1110]">{getInitials(profile.full_name||"SU")}</div><div className="min-w-0 flex-1"><h2 className="truncate text-base font-extrabold text-ink">{profile.full_name||"Pendolare"}</h2><p className="text-xs text-muted">{profile.preferred_destination||"Destinazione non impostata"}</p></div><button onClick={onToggle} className="shrink-0 rounded-xl border border-line px-2.5 py-2 text-[10px] font-extrabold text-ink">{editing?"Fine":"Modifica profilo"}</button></div>
    <div className="border-t border-line pt-3"><div className="mb-1.5 flex items-center justify-between"><h3 className="text-sm font-extrabold">Comune di partenza</h3>{editing&&<button aria-label="Modifica comune" onClick={()=>onEditSection("zone")} className="rounded-lg p-1.5 text-muted"><Pencil size={15}/></button>}</div>{editing&&activeSection==="zone"?<><ZoneAutocomplete value={zone} onChange={setZone}/><div className="grid grid-cols-2 gap-2"><button onClick={()=>{setZone(profile.starting_zone||"");onEditSection("")}} className="mt-2 rounded-xl border border-line py-2.5 text-xs font-bold text-muted">Annulla</button><button onClick={save} disabled={saving||!zone} className="mt-2 rounded-xl bg-brand py-2.5 text-xs font-extrabold text-[#0E1110] disabled:opacity-50">{saving?"Salvataggio...":"Salva comune"}</button></div></>:<p className="text-sm text-muted">{profile.starting_zone||"Non impostato"}</p>}</div>
  </div>;
}
