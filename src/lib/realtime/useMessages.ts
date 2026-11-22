"use client";
import {useEffect,useState} from "react";
import {createClient} from "@/lib/supabase/client";
export function useMessages(conversationId:string){
 const supabase=createClient();const [messages,setMessages]=useState<any[]>([]);
 useEffect(()=>{if(!conversationId)return;(async()=>{const {data}=await supabase.from("messages").select("*,profiles(full_name)").eq("conversation_id",conversationId).order("created_at",{ascending:true});setMessages(data||[]);})();const channel=supabase.channel(`messages:${conversationId}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`conversation_id=eq.${conversationId}`},p=>setMessages(v=>[...v,p.new])).subscribe();return()=>{supabase.removeChannel(channel)};},[conversationId,supabase]);
 return {messages,supabase};
}
