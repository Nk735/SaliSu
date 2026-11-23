"use client";
import { Coffee } from "lucide-react";

export function MobileHeader({name,onCoffee}:{name?:string;onCoffee:()=>void}) {
  return <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-line bg-card/95 px-4 backdrop-blur-md">
    <div className="flex min-w-0 items-center gap-2.5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-xl font-extrabold text-brandText">↗</div><div className="min-w-0"><div className="flex items-center gap-1.5"><h1 className="text-lg font-extrabold">SaliSu</h1><span className="shrink-0 rounded-md border border-accentWarmBorder bg-accentWarmSoft px-1.5 py-0.5 text-[10px] font-bold text-accentWarm">ALFA BARI</span></div><p className="mt-0.5 truncate text-[11px] text-muted">{name||"Pendolare verificato"}</p></div></div>
    <button onClick={onCoffee} aria-label="Offri un caffè" className="ml-2 flex shrink-0 items-center gap-1.5 rounded-full border border-accentWarmBorder bg-accentWarmSoft px-2.5 py-2 text-[10px] font-extrabold text-accentWarm"><Coffee size={15}/><span className="hidden min-[380px]:inline">Offri un caffè</span></button>
  </header>;
}
