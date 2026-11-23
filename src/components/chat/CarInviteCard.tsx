"use client";

export function CarInviteCard({invite, isRequester, driverName, onAccept, onDecline}:{invite:any;isRequester:boolean;driverName:string;onAccept:()=>void;onDecline:()=>void}) {
  const pending=invite?.status==="pending";
  return <div className="rounded-2xl border border-accentWarmBorder bg-accentWarmSoft p-4">
    <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-accentWarm">Invito in auto</p>
    <p className="mt-1 text-sm font-extrabold">{isRequester?`Invito in auto da ${driverName}`:pending?"Invito inviato · In attesa di risposta":invite?.status==="accepted"?"Invito confermato":"Invito rifiutato"}</p>
    {isRequester&&pending&&<div className="mt-3 flex gap-2"><button onClick={onAccept} className="flex-1 rounded-xl bg-brand px-3 py-2.5 text-[11px] font-extrabold text-[#0E1110]">Accetta</button><button onClick={onDecline} className="flex-1 rounded-xl border border-accentWarmBorder bg-card px-3 py-2.5 text-[11px] font-extrabold text-accentWarm">Rifiuta</button></div>}
  </div>;
}