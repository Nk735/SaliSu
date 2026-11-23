"use client";
import { Coffee, Instagram, X } from "lucide-react";

export const CURRENT_AMOUNT = 15;
export const GOAL_AMOUNT = 99;
export const GOAL_LABEL = "App Store & Server";

export function SupportCard({onClose,compact=false}:{onClose?:()=>void;compact?:boolean}) {
  const percent=Math.min(100,(CURRENT_AMOUNT/GOAL_AMOUNT)*100);
  return <section className="card relative rounded-2xl p-4" aria-label="Supporta SaliSu">
    {onClose && <button onClick={onClose} aria-label="Chiudi" className="absolute right-2.5 top-2.5 rounded-lg p-1.5 text-muted hover:bg-subtle"><X size={18}/></button>}
    <div className="pr-8"><div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-accentWarmSoft text-accentWarm"><Coffee size={18}/></div><h3 className={`${compact?"text-sm":"text-base"} font-extrabold text-ink`}>SaliSu è gratis, offrimi un caffè ☕</h3></div>
    <p className="mt-2 text-xs leading-relaxed text-muted">Progetto indipendente nato a Bari. Ogni contributo aiuta a coprire server e pubblicazione sugli store.</p>
    <div className="mt-3">
      <div className="mb-1.5 flex justify-between text-[10px] font-bold"><span className="text-muted">{GOAL_LABEL}</span><span className="text-accentWarm">{CURRENT_AMOUNT.toFixed(0)} € / {GOAL_AMOUNT.toFixed(0)} €</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-subtle"><div className="h-full rounded-full bg-accentWarm" style={{width:`${percent}%`}}/></div>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-2">
      <a href="https://py.pl/cqEM7JNkVGb0EbPstYkXmA" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-accentWarm px-3 py-2.5 text-xs font-extrabold text-[#0E1110]"><Coffee size={16}/>PayPal</a>
      <a href="https://www.instagram.com/nicolacucinella?hvrq=c2U4ZHNzd2drdmQ=" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-accentWarmBorder bg-accentWarmSoft px-3 py-2.5 text-xs font-extrabold text-accentWarm"><Instagram size={16}/>Instagram</a>
    </div>
  </section>;
}
