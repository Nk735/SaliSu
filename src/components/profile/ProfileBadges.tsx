"use client";

import {useEffect,useState} from "react";
import {BadgeCheck,CarFront,Medal,Route,ShieldCheck,Sparkles,X,type LucideIcon} from "lucide-react";
import {createClient} from "@/lib/supabase/client";

type BadgeDefinition={label:string;description:string;icon:LucideIcon};

const BADGES:Record<string,BadgeDefinition>={
  first_100:{label:"Primi 100",description:"Ti sei iscritto a SaliSu tra i primi 100 utenti.",icon:Medal},
  super_reviewed:{label:"Super Recensito",description:"Hai una media di almeno 4,8 stelle su almeno 5 recensioni ricevute.",icon:Sparkles},
  km_100:{label:"Macina Km · 100 km",description:"Hai percorso almeno 100 km in viaggi completati.",icon:Route},
  km_500:{label:"Macina Km · 500 km",description:"Hai percorso almeno 500 km in viaggi completati.",icon:Route},
  km_1000:{label:"Macina Km · 1.000 km",description:"Hai percorso almeno 1.000 km in viaggi completati.",icon:Route},
  safe_5:{label:"Passaggio Sicuro · 5 persone",description:"Hai accompagnato almeno 5 persone in viaggi completati.",icon:CarFront},
  safe_20:{label:"Passaggio Sicuro · 20 persone",description:"Hai accompagnato almeno 20 persone in viaggi completati.",icon:CarFront},
  safe_50:{label:"Passaggio Sicuro · 50 persone",description:"Hai accompagnato almeno 50 persone in viaggi completati.",icon:ShieldCheck}
};

export function ProfileBadges({profileId}:{profileId:string}){
  const [badgeCodes,setBadgeCodes]=useState<string[]>([]);
  const [selectedBadge,setSelectedBadge]=useState<(BadgeDefinition & {earned:boolean})|null>(null);

  useEffect(()=>{
    let active=true;
    const supabase=createClient();
    void supabase.from("user_badges").select("badge_code").eq("user_id",profileId).then(({data})=>{
      if(active)setBadgeCodes((data||[]).map((badge:any)=>badge.badge_code));
    });
    return ()=>{active=false;};
  },[profileId]);

  return <>
    <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Badge e traguardi">
      {Object.entries(BADGES).map(([code,badge])=>{
        const Icon=badge.icon;
        const earned=badgeCodes.includes(code);
        return <button key={code} type="button" onClick={()=>setSelectedBadge({...badge,earned})} aria-label={`${badge.label}: ${earned?"ottenuto":"da ottenere"}`} aria-haspopup="dialog" className={`inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold ${earned?"border-accentWarm bg-accentWarm text-ink":"border-line bg-subtle text-muted opacity-65"}`}>
          <Icon size={12} aria-hidden="true"/><span>{badge.label}</span>
        </button>;
      })}
    </div>
    {selectedBadge&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5" onClick={event=>{if(event.target===event.currentTarget)setSelectedBadge(null);}}>
      <section role="dialog" aria-modal="true" aria-labelledby="badge-title" className="w-full max-w-xs rounded-2xl border border-line bg-card p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2"><BadgeCheck size={19} className={selectedBadge.earned?"text-accentWarm":"text-muted"}/><h3 id="badge-title" className="text-sm font-extrabold text-ink">{selectedBadge.label}</h3></div>
          <button type="button" onClick={()=>setSelectedBadge(null)} aria-label="Chiudi dettagli badge" className="rounded-lg p-1 text-muted"><X size={17}/></button>
        </div>
        <p className="mt-3 text-sm text-muted">{selectedBadge.description}</p>
        <p className={`mt-3 text-xs font-extrabold ${selectedBadge.earned?"text-accentWarm":"text-muted"}`}>{selectedBadge.earned?"Ottenuto":"Da ottenere"}</p>
      </section>
    </div>}
  </>;
}