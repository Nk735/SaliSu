"use client";
import { Coffee } from "lucide-react";

export function MobileHeader({name,onCoffee}:{name?:string;onCoffee:()=>void}) {
  return <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-line bg-card/95 px-4 backdrop-blur-md">
    <div className="flex min-w-0 items-center gap-2.5"><div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-card"><img src="/icons/salisu-car.svg" alt="SaliSu" className="app-logo h-full w-full object-contain p-1"/></div><div className="min-w-0"><h1 className="text-lg font-extrabold">SaliSu</h1><p className="mt-0.5 truncate text-[11px] text-muted">{name||"Pendolare verificato"}</p></div></div>
    <button onClick={onCoffee} aria-label="Offri un caffè" className="ml-2 flex shrink-0 items-center gap-1.5 rounded-full border border-accentWarmBorder bg-accentWarmSoft px-2.5 py-2 text-[10px] font-extrabold text-accentWarm"><Coffee size={15}/><span className="hidden min-[380px]:inline">Offri un caffè</span></button>
  </header>;
}
