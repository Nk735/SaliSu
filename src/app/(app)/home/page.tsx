"use client";
import { useEffect,useMemo,useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TripFeed } from "@/components/trips/TripFeed";
import { TripFilters } from "@/components/trips/TripFilters";
import { SupportCard } from "@/components/support/SupportCard";
import { getTripExpiryTime,isTripExpired } from "@/lib/trips/isTripExpired";

type RequestStatus = "pending" | "accepted" | "declined";
type RatingSummary = { average: number; count: number };

export default function HomePage() {
  const supabase=createClient(); const [trips,setTrips]=useState<any[]>([]); const [requestStatuses,setRequestStatuses]=useState<Record<string,RequestStatus>>({}); const [ratingSummaries,setRatingSummaries]=useState<Record<string,RatingSummary>>({}); const [type,setType]=useState(""); const [direction,setDirection]=useState("Tutti i tipi"); const [days,setDays]=useState<number[]>([]); const [profile,setProfile]=useState<any>(null); const [userId,setUserId]=useState(""); const [supportVisible,setSupportVisible]=useState(true); const [now,setNow]=useState(Date.now());
  useEffect(()=>{
    const nextExpiry=trips.map(getTripExpiryTime).filter((expiry)=>expiry>now).sort((a,b)=>a-b)[0];
    if(!nextExpiry)return;
    const timer=window.setTimeout(()=>setNow(Date.now()),Math.max(0,nextExpiry-Date.now()+1));
    return()=>window.clearTimeout(timer);
  },[trips,now]);
  useEffect(()=>{
    let cancelled=false;
    async function loadFeed(){
      const {data:{user},error:userError}=await supabase.auth.getUser();
      if(userError){console.error("Impossibile verificare l'utente del feed:",userError);return;}
      if(!user||cancelled)return;
      setUserId(user.id);

      const {data:feedProfile,error:profileError}=await supabase.from("profiles").select("starting_zone,show_only_starting_zone,additional_starting_zones,additional_starting_zone,preferred_destination").eq("id",user.id).single();
      if(profileError){console.error("Impossibile caricare le preferenze del feed:",profileError);return;}
      if(cancelled)return;
      setProfile(feedProfile);

      let tripsQuery=supabase.from("trips").select("id,driver_id,type,seats_available,departure_at,direction,is_recurring,recurrence_group_id,recurrence_days,recurrence_until,origin_zone,destination,return_departure_at,distance_km,price_per_passenger,maps_url,maps_label,profiles(id,full_name,maps_label,maps_url)").eq("status","active").order("departure_at",{ascending:true});
      if(feedProfile.preferred_destination)tripsQuery=tripsQuery.eq("destination",feedProfile.preferred_destination);
      const additionalZones=feedProfile.additional_starting_zones||(feedProfile.additional_starting_zone?[feedProfile.additional_starting_zone]:[]);
      const startingZones=[feedProfile.starting_zone,...(feedProfile.show_only_starting_zone===false?additionalZones:[])].filter(Boolean);
      if(startingZones.length)tripsQuery=tripsQuery.in("origin_zone",startingZones);
      const {data:tripRows,error:tripsError}=await tripsQuery;
      if(tripsError){console.error("Impossibile caricare il feed:",tripsError);return;}
      const availableTrips=(tripRows||[]).filter((trip)=>!isTripExpired(trip));
      if(cancelled)return;
      setTrips(availableTrips);
      const offerTripIds=availableTrips.filter((trip)=>trip.type!=="request"&&trip.driver_id!==user.id).map((trip)=>trip.id);
      const requestTripIds=availableTrips.filter((trip)=>trip.type==="request").map((trip)=>trip.id);
      const driverIds=Array.from(new Set(availableTrips.map((trip)=>trip.driver_id).filter(Boolean)));

      const [tripRequests,carInvites,reviews]=await Promise.all([
        offerTripIds.length
          ? supabase.from("trip_requests").select("trip_id,status").eq("passenger_id",user.id).in("trip_id",offerTripIds)
          : Promise.resolve({data:[],error:null}),
        requestTripIds.length
          ? supabase.from("car_invites").select("trip_id,status").eq("inviter_id",user.id).in("trip_id",requestTripIds)
          : Promise.resolve({data:[],error:null}),
        driverIds.length
          ? supabase.from("reviews").select("driver_id,rating").in("driver_id",driverIds)
          : Promise.resolve({data:[],error:null}),
      ]);
      if(tripRequests.error)console.error("Impossibile caricare lo stato delle richieste:",tripRequests.error);
      if(carInvites.error)console.error("Impossibile caricare lo stato degli inviti:",carInvites.error);
      if(reviews.error)console.error("Impossibile caricare le valutazioni:",reviews.error);
      if(cancelled)return;

      const statusMap:Record<string,RequestStatus>={};
      for(const row of [...(tripRequests.data||[]),...(carInvites.data||[])]){
        if(row.status==="pending"||row.status==="accepted"||row.status==="declined")statusMap[row.trip_id]=row.status;
      }
      const ratingMap:Record<string,RatingSummary>={};
      for(const review of reviews.data||[]){
        const summary=ratingMap[review.driver_id]||{average:0,count:0};
        summary.average+=Number(review.rating);
        summary.count+=1;
        ratingMap[review.driver_id]=summary;
      }
      for(const summary of Object.values(ratingMap))summary.average/=summary.count;

      setRequestStatuses(statusMap);
      setRatingSummaries(ratingMap);
    }
    void loadFeed();
    return()=>{cancelled=true;};
  },[supabase]);
  const filtered=useMemo(()=>{
   let result=trips.filter((trip)=>!isTripExpired(trip,now));
   const additionalZones=profile?.additional_starting_zones|| (profile?.additional_starting_zone?[profile.additional_starting_zone]:[]);
   const startingZones=[profile?.starting_zone,...(profile?.show_only_starting_zone===false?additionalZones:[])].filter(Boolean);
   if(startingZones.length)result=result.filter((trip)=>startingZones.includes(trip.origin_zone));
   if(type)result=result.filter((trip)=>trip.type===type);
   if(direction!=="Tutti i tipi")result=result.filter((trip)=>(trip.direction||"Sola andata")===direction);
   if(days.length)result=result.filter((trip)=>{const covered=new Set((trip.recurrence_days?.length?trip.recurrence_days:[new Date(trip.departure_at).getDay()]));return days.some(day=>covered.has(day));});
   if(profile?.starting_zone)result.sort((a,b)=>Number(b.origin_zone===profile.starting_zone)-Number(a.origin_zone===profile.starting_zone)||new Date(a.departure_at).getTime()-new Date(b.departure_at).getTime());
   return result;
  },[trips,type,direction,days,profile,now]);
  return <><TripFilters type={type} setType={setType} direction={direction} setDirection={setDirection} days={days} setDays={setDays}/>
  <div className="space-y-3 px-4 pb-36 pt-4">{supportVisible&&<SupportCard onClose={()=>setSupportVisible(false)}/>} {filtered.length?<TripFeed trips={filtered} currentUserId={userId} selectedDays={days} requestStatuses={requestStatuses} ratingSummaries={ratingSummaries}/>:<div className="card rounded-2xl p-5 text-center"><p className="text-sm font-extrabold">Nessun tragitto disponibile</p></div>}</div></>;
}
