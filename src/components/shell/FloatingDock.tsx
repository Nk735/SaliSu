"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MessageCircle, House, Plus, User } from "lucide-react";
import { CreateTripSheet } from "@/components/trips/CreateTripSheet";

export function FloatingDock() {
  const path=usePathname(); const [open,setOpen]=useState(false);
  const items=[{href:"/chat",label:"Chat",icon:MessageCircle},{href:"/home",label:"Home",icon:House},{href:"/profile",label:"Profilo",icon:User}];
  const activeIndex=items.findIndex(({href})=>path.startsWith(href));
  return <>
    {open&&<CreateTripSheet onClose={()=>setOpen(false)} />}
    {path.startsWith("/home")&&<button onClick={()=>setOpen(true)} aria-label="Crea tragitto" className="fab-plus absolute right-5 z-40 flex items-center justify-center"><Plus size={25} strokeWidth={3}/></button>}
    <nav aria-label="Navigazione principale" className="apple-dock absolute left-3.5 right-3.5 z-30 grid grid-cols-3 items-center rounded-full p-1.5">
      {activeIndex>=0&&<span aria-hidden="true" className="dock-indicator" style={{transform:`translateX(${activeIndex*100}%)`}}/>}
      {items.map(({href,label,icon:Icon},index)=><Link key={href} href={href} aria-current={index===activeIndex?"page":undefined} className={`dock-item relative z-10 flex flex-col items-center rounded-full py-1.5 text-[10px] font-bold ${index===activeIndex?"is-active text-brand":"text-muted"}`}><Icon size={20}/>{label}</Link>)}
    </nav>
  </>;
}
