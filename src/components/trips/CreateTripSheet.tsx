"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getMunicipalityDistance } from "@/lib/pricing/distances";
import { calculateFairPrice,adjustPrice } from "@/lib/pricing/calculatePrice";
import { fallbackFuelPrices } from "@/lib/pricing/fuel";
import { DESTINATIONS } from "@/lib/destinations";
import { FairPriceSlider } from "./FairPriceSlider";
import { ZoneAutocomplete } from "@/components/ui/ZoneAutocomplete";
import { showToast } from "@/components/ui/ToastProvider";

export function CreateTripSheet({onClose}:{onClose:()=>void}) {
  const supabase=createClient(); const [type,setType]=useState<"offer"|"request">("offer"); const [direction,setDirection]=useState<"Sola andata"|"Andata e ritorno"|"Solo ritorno">("Andata e ritorno"); const [zone,setZone]=useState("Modugno"); const [dest,setDest]=useState<"Bari Centro"|"Lungomare">("Bari Centro"); const [date,setDate]=useState(()=>new Date().toISOString().slice(0,10)); const [time,setTime]=useState("08:00"); const [returnTime,setReturnTime]=useState("17:30"); const [seats,setSeats]=useState(2); const [percent,setPercent]=useState(0); const [fuel,setFuel]=useState<keyof typeof fallbackFuelPrices>("benzina"); const [consumption,setConsumption]=useState(14); const [fuelPrice,setFuelPrice]=useState(fallbackFuelPrices.benzina); const [saving,setSaving]=useState(false); const [recurring,setRecurring]=useState(false); const [weekdays,setWeekdays]=useState<number[]>([1,3,4]); const [recurrenceUntil,setRecurrenceUntil]=useState(()=>{const end=new Date();end.setMonth(end.getMonth()+3);return end.toISOString().slice(0,10);}); const [profileMaps,setProfileMaps]=useState<{label:string|null;url:string|null}>({label:null,url:null}); const [km,setKm]=useState(0);
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data:p}=await supabase.from("profiles").select("starting_zone,preferred_destination,fuel_type,consumption_km_l,maps_label,maps_url").eq("id",user.id).single();if(p){if(p.starting_zone)setZone(p.starting_zone);if(p.preferred_destination==="Bari Centro"||p.preferred_destination==="Lungomare")setDest(p.preferred_destination);if(p.fuel_type)setFuel(p.fuel_type);if(p.consumption_km_l)setConsumption(Number(p.consumption_km_l));setProfileMaps({label:p.maps_label,url:p.maps_url});}const {data:f}=await supabase.from("fuel_prices").select("price").eq("fuel_type",fuel).maybeSingle();if(f) setFuelPrice(Number(f.price));})();},[supabase,fuel]);
  useEffect(()=>{let active=true;(async()=>{const distance=await getMunicipalityDistance(zone,dest);if(active)setKm(distance);})();return()=>{active=false};},[zone,dest]);
  const singleTripBase=calculateFairPrice(km,consumption,fuelPrice,seats);
  const base=direction==="Andata e ritorno"?singleTripBase*2:singleTripBase;
  const final=adjustPrice(base,percent);
  function toggleRecurring(enabled:boolean){
    setRecurring(enabled);
    if(enabled){
      const end=new Date(`${date}T12:00:00`);
      end.setDate(end.getDate()+7);
      setRecurrenceUntil(end.toISOString().slice(0,10));
    }
  }
  function changeDate(nextDate:string){
    setDate(nextDate);
    if(recurring){
      const end=new Date(`${nextDate}T12:00:00`);
      end.setDate(end.getDate()+7);
      setRecurrenceUntil(end.toISOString().slice(0,10));
    }
  }
  async function submit(e:React.FormEvent){e.preventDefault();setSaving(true);const {data:{user}}=await supabase.auth.getUser();if(!user)return setSaving(false);
    const [h,m]=time.split(":").map(Number);const [rh,rm]=returnTime.split(":").map(Number);
    const dates:string[]=[];
    if(recurring){
      if(!weekdays.length){setSaving(false);return;}
      const start=new Date(`${date}T12:00:00`);
      const end=new Date(`${recurrenceUntil}T12:00:00`);
      for(let cursor=new Date(start);cursor<=end;cursor.setDate(cursor.getDate()+1)){if(weekdays.includes(cursor.getDay()))dates.push(cursor.toISOString().slice(0,10));}
    }else{dates.push(date);}
    if(!dates.length){setSaving(false);return;}
    const recurrenceGroupId=recurring?crypto.randomUUID():null;
    const rows=dates.map((dateValue)=>{const departure=new Date(`${dateValue}T12:00:00`);departure.setHours(h,m,0,0);const returnDeparture=direction==="Andata e ritorno"?(()=>{const value=new Date(`${dateValue}T12:00:00`);value.setHours(rh,rm,0,0);return value.toISOString();})():null;return {driver_id:user.id,type,direction,origin_zone:zone,destination:dest,departure_at:departure.toISOString(),return_departure_at:returnDeparture,seats_available:type==="offer"?seats:0,price_per_passenger:type==="offer"?final:0,fuel_type:fuel,distance_km:km,note:null,maps_label:profileMaps.label,maps_url:profileMaps.url,status:"active",is_recurring:recurring,recurrence_days:recurring?weekdays:null,recurrence_until:recurring?recurrenceUntil:null,recurrence_group_id:recurrenceGroupId};});
    const {error}=await supabase.from("trips").insert(rows);
    setSaving(false);
    if(error){showToast("Impossibile pubblicare il tragitto: "+error.message,"error");return;}
    onClose();location.reload();
  }
  return <div onClick={e=>{if(e.target===e.currentTarget)onClose()}} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-[2px]"><div className="bottom-sheet liquid-glass max-h-[92dvh] w-full max-w-[430px] overflow-hidden rounded-t-3xl"><div className="flex items-center justify-between border-b border-line bg-card px-5 py-4"><div><h3 className="font-extrabold">Nuovo tragitto</h3><p className="text-[11px] text-muted">Solo Bari Centro e Lungomare</p></div><button onClick={onClose} className="rounded-xl p-2 text-muted hover:bg-subtle">✕</button></div><form onSubmit={submit} className="app-scroll max-h-[calc(92dvh-70px)] space-y-4 overflow-y-auto p-5">
    <div className="grid grid-cols-2 rounded-xl border border-line bg-card p-1"><button type="button" onClick={()=>setType("offer")} className={`rounded-lg py-2 text-xs font-bold ${type==="offer"?"bg-brand text-brandText":"text-muted"}`}>🚗 Offro passaggio</button><button type="button" onClick={()=>setType("request")} className={`rounded-lg py-2 text-xs font-bold ${type==="request"?"bg-brand text-brandText":"text-muted"}`}>🙋 Cerco passaggio</button></div>
    <div><p className="mb-1.5 text-xs font-bold">Tipo di viaggio</p><div className="grid grid-cols-3 gap-1.5 rounded-xl border border-line bg-card p-1">{(["Sola andata","Andata e ritorno","Solo ritorno"] as const).map(v=><button key={v} type="button" onClick={()=>setDirection(v)} className={`rounded-lg px-1 py-2 text-[10px] font-bold ${direction===v?"bg-brand text-brandText":"text-muted"}`}>{v}</button>)}</div></div>
    {direction==="Solo ritorno" ? <>
      <label className="block text-xs font-bold">Comune di partenza<select value={dest} onChange={e=>setDest(e.target.value as "Bari Centro"|"Lungomare")} className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-xs">{DESTINATIONS.map(d=><option key={d}>{d}</option>)}</select></label>
      <ZoneAutocomplete value={zone} onChange={setZone} label="Destinazione" placeholder="Cerca il comune"/>
    </> : <>
      <ZoneAutocomplete value={zone} onChange={setZone}/>
      <label className="block text-xs font-bold">Destinazione<select value={dest} onChange={e=>setDest(e.target.value as "Bari Centro"|"Lungomare")} className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-xs">{DESTINATIONS.map(d=><option key={d}>{d}</option>)}</select></label>
    </>}
    <div className="grid grid-cols-2 gap-2"><label className="text-xs font-bold">Data<input type="date" value={date} min={new Date().toISOString().slice(0,10)} onChange={e=>changeDate(e.target.value)} className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5"/></label>{type==="offer"&&<label className="text-xs font-bold">Posti<select value={seats} onChange={e=>setSeats(Number(e.target.value))} className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5">{[1,2,3,4].map(n=><option key={n}>{n}</option>)}</select></label>}</div>
    <div className="grid grid-cols-2 gap-2"><label className="text-xs font-bold">{direction==="Solo ritorno"?"Orario ritorno":"Orario andata"}<input type="time" value={time} onChange={e=>setTime(e.target.value)} className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5"/></label>{direction==="Andata e ritorno"&&<label className="text-xs font-bold">Orario ritorno<input type="time" value={returnTime} onChange={e=>setReturnTime(e.target.value)} className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5"/></label>}</div>
    <div className="rounded-2xl border border-line bg-card p-4"><label className="flex items-center justify-between text-xs font-bold"><span>Viaggio ricorrente</span><input type="checkbox" checked={recurring} onChange={e=>toggleRecurring(e.target.checked)} className="h-4 w-4 accent-brand"/></label>{recurring&&<div className="mt-3 space-y-3"><div className="grid grid-cols-7 gap-1">{[["Dom",0],["Lun",1],["Mar",2],["Mer",3],["Gio",4],["Ven",5],["Sab",6]].map(([label,day])=>{const value=Number(day);return <button key={value} type="button" onClick={()=>setWeekdays(v=>v.includes(value)?v.filter(d=>d!==value):[...v,value])} className={`rounded-lg py-2 text-[9px] font-bold ${weekdays.includes(value)?"bg-brand text-brandText":"bg-subtle text-muted"}`}>{label}</button>;})}</div><label className="block text-xs font-bold">Pubblica fino al<input type="date" value={recurrenceUntil} min={date} onChange={e=>setRecurrenceUntil(e.target.value)} className="mt-1.5 w-full rounded-xl border border-line bg-card px-3 py-2.5"/></label></div>}</div>
    {profileMaps.url&&<a href={profileMaps.url} target="_blank" rel="noreferrer" className="block rounded-xl border border-accentWarmBorder bg-accentWarmSoft p-3 text-xs font-bold text-accentWarm">📍 {profileMaps.label||"Punto Google Maps"}</a>}
    {type==="offer"&&<div className="rounded-2xl border border-line bg-card p-4"><div className="mb-3 flex justify-between text-[11px]"><span className="font-bold text-muted">Carburante medio Puglia</span><span className="font-extrabold text-ink">{fuelPrice.toLocaleString("it-IT",{style:"currency",currency:"EUR"})}/L</span></div><FairPriceSlider percent={percent} setPercent={setPercent} price={base}/><p className="mt-2 text-[10px] text-muted">{km} km · {consumption} km/L · prezzo consigliato {base.toLocaleString("it-IT",{style:"currency",currency:"EUR"})}</p></div>}
    <button disabled={saving} className="w-full rounded-xl bg-brand py-3 text-sm font-extrabold text-brandText disabled:opacity-60">{saving?"Salvataggio...":"Pubblica tragitto"}</button>
  </form></div></div>;
}
