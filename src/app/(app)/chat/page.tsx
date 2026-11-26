"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {Search} from "lucide-react";
import {createClient} from "@/lib/supabase/client";

function initials(name:string){return name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join("").toUpperCase()||"S";}

export default function ChatPage(){
 const supabase=createClient();
 const [conversations,setConversations]=useState<any[]>([]);
 const [profiles,setProfiles]=useState<Record<string,any>>({});
 const [query,setQuery]=useState("");
 const [filter,setFilter]=useState<"active"|"archived"|"unread">("active");

 useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data}=await supabase.from("conversations").select("*,trips(origin_zone,destination,departure_at,driver_id),messages(body,created_at,sender_id)").contains("participant_ids",[user.id]).order("created_at",{ascending:false});const rows=data||[];setConversations(rows);const ids=Array.from(new Set(rows.flatMap((conversation:any)=>conversation.participant_ids||[]).filter((id:string)=>id!==user.id)));if(ids.length){const {data:profileRows}=await supabase.from("profiles").select("id,full_name").in("id",ids);setProfiles(Object.fromEntries((profileRows||[]).map((profile:any)=>[profile.id,profile])));}})();},[supabase]);

 const items=useMemo(()=>conversations.map((conversation:any)=>{const sorted=[...(conversation.messages||[])].sort((a:any,b:any)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime());const last=sorted[0];const unread=Number(localStorage.getItem(`salisu-unread:${conversation.id}`)||0);return {...conversation,last,unread};}),[conversations]);
 const filtered=useMemo(()=>items.filter(item=>{if(filter==="archived"?!item.archived_at:Boolean(item.archived_at))return false;if(filter==="unread"&&!item.unread)return false;const name=profiles[item.participant_ids.find((id:string)=>profiles[id])]?.full_name||"Collega";const route=`${item.trips?.origin_zone||""} ${item.trips?.destination||""}`;return `${name} ${route}`.toLowerCase().includes(query.toLowerCase());}),[items,filter,profiles,query]);

 return <div className="chat-wallpaper min-h-full px-4 pb-36 pt-5">
  <div className="mb-4"><h2 className="text-2xl font-extrabold tracking-normal">Messaggi</h2><p className="mt-1 text-[11px] leading-4 text-muted">Organizza i passaggi per raggiungere la tua sede di lavoro</p></div>
  <label className="flex h-12 items-center gap-2.5 rounded-2xl border border-line bg-card px-4 shadow-sm"><Search size={17} className="text-muted"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Cerca collega o zona..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"/></label>
  <div className="mt-3 flex gap-2"><button onClick={()=>setFilter("active")} className={`rounded-full px-4 py-2 text-xs font-extrabold ${filter==="active"?"bg-brand text-brandText":"border border-line bg-card text-muted"}`}>Attive</button><button onClick={()=>setFilter("archived")} className={`rounded-full px-4 py-2 text-xs font-extrabold ${filter==="archived"?"bg-brand text-brandText":"border border-line bg-card text-muted"}`}>Archiviate</button><button onClick={()=>setFilter("unread")} className={`rounded-full px-4 py-2 text-xs font-extrabold ${filter==="unread"?"bg-brand text-brandText":"border border-line bg-card text-muted"}`}>Non lette</button></div>
  <div className="mt-4 space-y-2.5">{filtered.length?filtered.map((conversation:any)=>{const colleagueId=conversation.participant_ids?.find((id:string)=>profiles[id]);const colleague=profiles[colleagueId];const name=colleague?.full_name||"Pendolare";const lastDate=conversation.last?.created_at?new Date(conversation.last.created_at):new Date(conversation.created_at);const route=`${conversation.trips?.origin_zone||"Conversazione"} → ${conversation.trips?.destination||""}`;return <Link key={conversation.id} href={`/chat/${conversation.id}`} onClick={()=>localStorage.setItem(`salisu-unread:${conversation.id}`,"0")} className={`card flex gap-3 rounded-2xl p-3.5 ${conversation.unread>0?"border-brand/50 bg-brandSoft/20":""}`}><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-brandText">{initials(name)}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="truncate text-sm font-extrabold">{name}</p><time className="shrink-0 text-[10px] font-bold text-muted">{lastDate.toLocaleDateString("it-IT",{day:"2-digit",month:"short"})}</time></div><span className="mt-1.5 inline-flex max-w-full truncate rounded-full bg-subtle px-2 py-1 text-[9px] font-extrabold text-muted">{route}</span><div className="mt-2 flex items-center gap-2"><p className="min-w-0 flex-1 truncate text-[11px] text-muted">{conversation.last?.body||"Apri la conversazione"}</p>{conversation.unread>0&&<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-extrabold text-brandText">{conversation.unread}</span>}</div></div></Link>;}) : <div className="card rounded-2xl p-8 text-center text-sm text-muted">Nessuna conversazione trovata.</div>}</div>
 </div>
}
