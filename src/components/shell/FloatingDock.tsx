"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MessageCircle, House, Plus, Users, User } from "lucide-react";
import { CreateTripSheet } from "@/components/trips/CreateTripSheet";

export function FloatingDock() {
  const path=usePathname(); const [open,setOpen]=useState(false);
  const items=[{href:"/chat",label:"Chat",icon:MessageCircle},{href:"/home",label:"Home",icon:House},{href:"/compagni",label:"Compagni",icon:Users},{href:"/profile",label:"Profilo",icon:User}];
  return <>
    {open&&<CreateTripSheet onClose={()=>setOpen(false)} />}
    <nav className="apple-dock absolute bottom-3.5 left-3.5 right-3.5 z-30 grid grid-cols-5 items-center px-2 py-1.5">
      {items.slice(0,2).map(({href,label,icon:Icon})=><Link key={href} href={href} className={`dock-item flex flex-col items-center py-1.5 text-[10px] font-bold ${path.startsWith(href)?"is-active text-accentWarm":"text-muted"}`}><Icon size={20}/>{label}</Link>)}
      <button onClick={()=>setOpen(true)} aria-label="Crea tragitto" className="fab-plus mx-auto flex items-center justify-center"><Plus size={24}/></button>
      {items.slice(2).map(({href,label,icon:Icon})=><Link key={href} href={href} className={`dock-item flex flex-col items-center py-1.5 text-[10px] font-bold ${path.startsWith(href)?"is-active text-accentWarm":"text-muted"}`}><Icon size={20}/>{label}</Link>)}
    </nav>
  </>;
}
