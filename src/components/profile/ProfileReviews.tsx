"use client";

import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";

export function ProfileReviews(){
  const supabase=createClient();const [reviews,setReviews]=useState<any[]>([]);
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data}=await supabase.from("reviews").select("id,rating,tags,comment,created_at,profiles!reviews_reviewer_id_fkey(full_name)").eq("driver_id",user.id).order("created_at",{ascending:false});setReviews(data||[]);})();},[supabase]);
  const average=reviews.length?reviews.reduce((sum,review)=>sum+Number(review.rating),0)/reviews.length:0;
  return <section className="card rounded-2xl p-4"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-extrabold">Recensioni ricevute</h3><span className="text-xs font-bold text-accentWarm">{reviews.length?`★ ${average.toFixed(1)} · ${reviews.length}`:"Nuovo"}</span></div>{reviews.length?<div className="space-y-2">{reviews.map(review=><div key={review.id} className="rounded-xl bg-subtle p-3"><div className="flex items-center justify-between gap-2"><span className="text-xs font-extrabold text-accentWarm">{"★".repeat(Number(review.rating))}</span><span className="text-[10px] text-muted">{review.profiles?.full_name||"Pendolare"}</span></div>{review.tags?.length>0&&<p className="mt-1 text-[10px] font-bold text-muted">{review.tags.join(" · ")}</p>}{review.comment&&<p className="mt-1 text-xs text-textMain">{review.comment}</p>}</div>)}</div>:<p className="text-xs text-muted">Le recensioni appariranno qui dopo i tuoi viaggi.</p>}</section>;
}