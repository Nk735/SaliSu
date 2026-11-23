"use client";
import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {RatingBottomSheet} from "./RatingBottomSheet";

export function DriverRatingBadge({driverId}:{driverId?:string}){
	const supabase=createClient();const [open,setOpen]=useState(false);const [reviews,setReviews]=useState<any[]>([]);
	useEffect(()=>{if(!driverId)return;supabase.from("reviews").select("id,rating,tags,comment,created_at,reviewer_id,profiles(full_name)").eq("driver_id",driverId).order("created_at",{ascending:false}).then(({data})=>setReviews(data||[]));},[driverId,supabase]);
	const average=reviews.length?reviews.reduce((sum,review)=>sum+Number(review.rating),0)/reviews.length:0;
	return <><button onClick={()=>setOpen(true)} className="text-[10px] font-bold text-accentWarm">{reviews.length?`★ ${average.toFixed(1)} (${reviews.length})`:"Nuovo"}</button><RatingBottomSheet open={open} onClose={()=>setOpen(false)} reviews={reviews}/></>;
}
