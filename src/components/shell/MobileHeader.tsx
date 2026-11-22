"use client";
export function MobileHeader({name}:{name?:string}) {
  return <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-line bg-card/95 px-4 backdrop-blur-md">
    <div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-crimson text-xl font-extrabold text-white">↗</div><div><div className="flex items-center gap-1.5"><h1 className="text-lg font-extrabold">SaliSu</h1><span className="rounded-md border border-accentWarmBorder bg-accentWarmSoft px-1.5 py-0.5 text-[10px] font-bold text-accentWarm">ALFA BARI</span></div><p className="mt-0.5 text-[11px] text-muted">{name||"Pendolare verificato"}</p></div></div>
  </header>;
}
