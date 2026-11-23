"use client";
export function FairPriceSlider({percent,setPercent,price}:{percent:number;setPercent:(v:number)=>void;price:number}) {
  const adjusted=percent<=-100?0:Math.max(0,price*(1+percent/100));
  const high=percent>40;
  return <div className="space-y-2">
    <div className="flex items-end justify-between"><div><span className="text-[11px] font-bold text-muted">Prezzo al passeggero</span><div className={`mt-0.5 text-2xl font-extrabold ${percent===-100?"text-emerald-600":high?"text-crimson":"text-ink"}`}>{adjusted===0?"0,00 €":adjusted.toLocaleString("it-IT",{style:"currency",currency:"EUR"})}</div></div>{percent===-100&&<span className="rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-extrabold text-emerald-700">Gratis</span>}<span className={`text-xs font-extrabold ${high?"text-crimson":"text-muted"}`}>{percent>0?"+":""}{percent}%</span></div>
    <input aria-label="Percentuale prezzo" type="range" min="-100" max="100" value={percent} onChange={e=>setPercent(Number(e.target.value))} className="w-full accent-brand"/>
    {high&&<p className="rounded-lg bg-crimsonSoft p-2 text-[11px] font-semibold text-crimson">SaliSu serve solo a dividere le spese, non a guadagnare.</p>}
  </div>;
}
