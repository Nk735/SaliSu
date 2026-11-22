"use client";
import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {FavoritesList} from "@/components/companions/FavoritesList";
export default function CompagniPage(){const supabase=createClient();const [favorites,setFavorites]=useState<any[]>([]);useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data}=await supabase.from("favorites").select("favorite_user_id,profiles(full_name)").eq("user_id",user.id);setFavorites(data||[]);})();},[supabase]);return <div className="px-4 pt-4"><h2 className="text-xl font-extrabold">Compagni di viaggio</h2><p className="mb-4 mt-1 text-xs text-muted">I colleghi salvati con il cuore</p><FavoritesList favorites={favorites}/></div>}
