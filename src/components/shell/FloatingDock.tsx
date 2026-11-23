"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MessageCircle, House, Plus, User } from "lucide-react";
import { CreateTripSheet } from "@/components/trips/CreateTripSheet";

export function FloatingDock() {
  const path=usePathname(); const [open,setOpen]=useState(false);
  const items=[{href:"/home",label:"Home",icon:House},{href:"/chat",label:"Chat",icon:MessageCircle},{href:"/profile",label:"Profilo",icon:User}];
  return <>
    {open&&<CreateTripSheet onClose={()=>setOpen(false)} />}
    {path.startsWith("/home")&&<button onClick={()=>setOpen(true)} aria-label="Crea tragitto" className="fab-plus absolute bottom-[92px] right-5 z-40 flex items-center justify-center"><Plus size={25} strokeWidth={3}/></button>}
    <nav className="apple-dock absolute bottom-3.5 left-3.5 right-3.5 z-30 grid grid-cols-3 items-center px-2 py-1.5">
      {items.map(({href,label,icon:Icon})=><Link key={href} href={href} className={`dock-item flex flex-col items-center py-1.5 text-[10px] font-bold ${path.startsWith(href)?"is-active text-brand":"text-muted"}`}><Icon size={20}/>{label}</Link>)}
    </nav>
  </>;
}
