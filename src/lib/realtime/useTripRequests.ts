"use client";
import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";
export function useTripRequests(tripId:string){
 const supabase=createClient();const [requests,setRequests]=useState<any[]>([]);
 useEffect(()=>{if(!tripId)return;(async()=>{const {data}=await supabase.from("trip_requests").select("*").eq("trip_id",tripId);setRequests(data||[]);})();const channel=supabase.channel(`requests:${tripId}`).on("postgres_changes",{event:"*",schema:"public",table:"trip_requests",filter:`trip_id=eq.${tripId}`},()=>{supabase.from("trip_requests").select("*").eq("trip_id",tripId).then(r=>setRequests(r.data||[]));}).subscribe();return()=>{supabase.removeChannel(channel)};},[tripId,supabase]);
 return requests;
}
