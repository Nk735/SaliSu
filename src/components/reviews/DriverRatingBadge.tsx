"use client";
import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {RatingBottomSheet} from "./RatingBottomSheet";

type RatingSummary = { average: number; count: number };

export function DriverRatingBadge({driverId,ratingSummary={average:0,count:0}}:{driverId?:string;ratingSummary?:RatingSummary}){
	const supabase=createClient();const [open,setOpen]=useState(false);const [reviews,setReviews]=useState<any[]>([]);const [loading,setLoading]=useState(false);const [loaded,setLoaded]=useState(false);
	useEffect(()=>{
		if(!open||!driverId||loaded)return;
		let cancelled=false;
		setLoading(true);
		supabase.from("reviews").select("id,rating,tags,comment,created_at,reviewer_id,profiles(full_name)").eq("driver_id",driverId).order("created_at",{ascending:false}).then(({data,error})=>{
			if(cancelled)return;
			if(error){console.error("Impossibile caricare le recensioni:",error);setLoading(false);return;}
			setReviews(data||[]);
			setLoaded(true);
			setLoading(false);
		},(error)=>{if(!cancelled){console.error("Impossibile caricare le recensioni:",error);setLoading(false);}});
		return()=>{cancelled=true;};
	},[open,driverId,loaded,supabase]);
	return <><button onClick={()=>setOpen(true)} className="text-[10px] font-bold text-accentWarm">{ratingSummary.count?`★ ${ratingSummary.average.toFixed(1)} (${ratingSummary.count})`:"Nuovo"}</button><RatingBottomSheet open={open} onClose={()=>setOpen(false)} reviews={reviews} ratingSummary={ratingSummary} loading={loading}/></>;
}
