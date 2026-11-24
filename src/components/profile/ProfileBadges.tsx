"use client";

import {useEffect,useState} from "react";
import {BadgeCheck,CarFront,Medal,Route,Sparkles,X,type LucideIcon} from "lucide-react";
import {createClient} from "@/lib/supabase/client";

type BadgeCard={code:string;title:string;value:string;progress:number;icon:LucideIcon;earned:boolean;description:string};
type BadgeSnapshot={codes:string[];reviewCount:number;reviewAverage:number;distanceKm:number;people:number};
const RING_CIRCUMFERENCE=2*Math.PI*30;

function relationRows(value:any):any[]{return Array.isArray(value)?value:value?[value]:[];}

function nextMilestone(value:number,thresholds:number[]){
  const target=thresholds.find(threshold=>value<threshold)??thresholds[thresholds.length-1];
  const current=Math.min(Math.floor(value),target);
  return {current,target,progress:target?Math.min(current/target,1):1};
}

function ProgressRing({icon:Icon,progress}:{icon:LucideIcon;progress:number}){
  const clampedProgress=Math.max(0,Math.min(progress,1));
  return <div className="relative flex h-[68px] w-[68px] items-center justify-center">
    <svg aria-hidden="true" viewBox="0 0 68 68" className="absolute inset-0 h-full w-full -rotate-90">
      <circle cx="34" cy="34" r="30" fill="none" className="milestone-ring-track" strokeWidth="3.5"/>
      <circle cx="34" cy="34" r="30" fill="none" className="milestone-ring-progress" stroke={clampedProgress>0?"#a3e635":"#62646a"} strokeLinecap="round" strokeWidth="3.5" strokeDasharray={RING_CIRCUMFERENCE} strokeDashoffset={RING_CIRCUMFERENCE*(1-clampedProgress)}/>
    </svg>
    <Icon size={21} strokeWidth={1.7} className="milestone-card-icon" aria-hidden="true"/>
  </div>;
}

export function ProfileBadges({profileId}:{profileId:string}){
  const [snapshot,setSnapshot]=useState<BadgeSnapshot|null>(null);
  const [loaded,setLoaded]=useState(false);
  const [selectedBadge,setSelectedBadge]=useState<BadgeCard|null>(null);

  useEffect(()=>{
    let active=true;
    const supabase=createClient();
    const loadProgress=async()=>{
      try{
        const [badges,reviews,driverTrips,passengerRequests,carInvites]=await Promise.all([
          supabase.from("user_badges").select("badge_code").eq("user_id",profileId),
          supabase.from("reviews").select("rating").eq("driver_id",profileId),
          supabase.from("trips").select("distance_km,type,trip_requests(seats,status)").eq("driver_id",profileId).eq("status","completed"),
          supabase.from("trip_requests").select("seats,status,trips(distance_km,type,status)").eq("passenger_id",profileId).in("status",["accepted","completed"]),
          supabase.from("car_invites").select("status,trips(distance_km,status)").eq("inviter_id",profileId).eq("status","accepted")
        ]);
        if(!active)return;
        setLoaded(true);
        if(badges.error||reviews.error||driverTrips.error||passengerRequests.error||carInvites.error){setSnapshot(null);return;}

        const completedDriverTrips=driverTrips.data||[];
        const completedPassengerRequests=(passengerRequests.data||[]).filter((request:any)=>{
          const trip=relationRows(request.trips)[0];
          return trip?.type==="offer"&&trip.status==="completed";
        });
        const completedInvites=(carInvites.data||[]).filter((invite:any)=>relationRows(invite.trips)[0]?.status==="completed");
        const ratings=(reviews.data||[]).map((review:any)=>Number(review.rating));
        const distanceKm=completedDriverTrips.reduce((sum:number,trip:any)=>sum+Number(trip.distance_km||0),0)
          +completedPassengerRequests.reduce((sum:number,request:any)=>sum+Number(relationRows(request.trips)[0]?.distance_km||0),0)
          +completedInvites.reduce((sum:number,invite:any)=>sum+Number(relationRows(invite.trips)[0]?.distance_km||0),0);
        const people=completedDriverTrips.filter((trip:any)=>trip.type==="offer").reduce((sum:number,trip:any)=>sum
          +relationRows(trip.trip_requests).filter((request:any)=>["accepted","completed"].includes(request.status)).reduce((count:number,request:any)=>count+Number(request.seats||1),0),0)
          +completedInvites.length;
        setSnapshot({
          codes:(badges.data||[]).map((badge:any)=>badge.badge_code),
          reviewCount:ratings.length,
          reviewAverage:ratings.length?ratings.reduce((sum:number,rating:number)=>sum+rating,0)/ratings.length:0,
          distanceKm,
          people
        });
      }catch{
        if(active){setLoaded(true);setSnapshot(null);}
      }
    };
    void loadProgress();
    return ()=>{active=false;};
  },[profileId]);

  const codes=snapshot?.codes||[];
  const reviews=nextMilestone(snapshot?.reviewCount||0,[5]);
  const kilometres=nextMilestone(snapshot?.distanceKm||0,[100,500,1000]);
  const people=nextMilestone(snapshot?.people||0,[5,20,50]);
  const kilometerBadge=codes.some(code=>["km_100","km_500","km_1000"].includes(code));
  const safeBadge=codes.some(code=>["safe_5","safe_20","safe_50"].includes(code));
  const cards:BadgeCard[]=[
    {code:"first_100",title:"Primi 100",value:snapshot?(codes.includes("first_100")?"1/1":"0/1"):"—",progress:snapshot&&codes.includes("first_100")?1:0,icon:Medal,earned:codes.includes("first_100"),description:"È un riconoscimento automatico per chi si è iscritto tra i primi 100 utenti di SaliSu."},
    {code:"super_reviewed",title:"Super Recensito",value:snapshot?`${Math.min(snapshot.reviewCount,5)}/5`:"—",progress:snapshot?Math.min(snapshot.reviewCount/5,1):0,icon:Sparkles,earned:codes.includes("super_reviewed"),description:snapshot?`Ricevi almeno 5 recensioni con una media di almeno 4,8. Ora: ${snapshot.reviewCount} recensioni, media ${snapshot.reviewAverage.toFixed(1)}.`:"Ricevi almeno 5 recensioni con una media di almeno 4,8."},
    {code:"km",title:"Macina Km",value:snapshot?`${kilometres.current}/${kilometres.target} km`:"—",progress:snapshot?kilometres.progress:0,icon:Route,earned:kilometerBadge,description:snapshot?`Completa viaggi per accumulare chilometri. Progresso totale: ${Math.floor(snapshot.distanceKm)} km; soglie: 100, 500 e 1.000 km.`:"Completa viaggi per accumulare 100, poi 500 e infine 1.000 km."},
    {code:"safe",title:"Passaggio Sicuro",value:snapshot?`${people.current}/${people.target} persone`:"—",progress:snapshot?people.progress:0,icon:CarFront,earned:safeBadge,description:snapshot?`Accompagna persone nei tuoi viaggi completati. Hai accompagnato ${snapshot.people}; soglie: 5, 20 e 50 persone.`:"Accompagna persone nei tuoi viaggi completati: le soglie sono 5, 20 e 50 persone."}
  ];
  const unlockedCount=cards.filter(card=>card.earned).length;

  return <>
    <section className="card space-y-3 rounded-2xl p-4" aria-labelledby="profile-milestones-title">
      <div className="flex items-center justify-between gap-3">
        <h3 id="profile-milestones-title" className="text-sm font-extrabold">Traguardi</h3>
        <span className="text-xs font-bold tabular-nums text-muted" aria-label={`${snapshot?unlockedCount:"—"} di 4 sbloccati`}>{snapshot?unlockedCount:"—"}/4</span>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {cards.map(card=><button key={card.code} type="button" onClick={()=>setSelectedBadge(card)} aria-haspopup="dialog" className="milestone-card flex min-h-[150px] min-w-0 flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400">
          <ProgressRing icon={card.icon} progress={card.progress}/>
          <span className={`milestone-progress-value ${card.progress>0?"is-active":"is-idle"} max-w-full truncate text-[11px] font-bold tabular-nums`}>{card.value}</span>
          <span className="milestone-title line-clamp-2 min-h-8 text-[11px] font-semibold leading-4">{card.title}</span>
        </button>)}
      </div>
    </section>
    {selectedBadge&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5" onClick={event=>{if(event.target===event.currentTarget)setSelectedBadge(null);}}>
      <section role="dialog" aria-modal="true" aria-labelledby="milestone-dialog-title" className="w-full max-w-xs rounded-2xl border border-line bg-card p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2"><BadgeCheck size={19} className={selectedBadge.earned?"text-lime-400":"text-muted"}/><h3 id="milestone-dialog-title" className="text-sm font-extrabold text-ink">{selectedBadge.title}</h3></div>
          <button type="button" onClick={()=>setSelectedBadge(null)} aria-label="Chiudi dettagli traguardo" className="rounded-lg p-1 text-muted"><X size={17}/></button>
        </div>
        <p className="mt-3 text-sm text-muted">{selectedBadge.description}</p>
        <p className={`mt-3 text-xs font-extrabold ${selectedBadge.earned?"text-lime-400":"text-muted"}`}>{!loaded?"Caricamento progressi…":snapshot?(selectedBadge.earned?"Traguardo sbloccato":"Ancora da sbloccare"):"Dati dei traguardi non disponibili"}</p>
      </section>
    </div>}
  </>;
}