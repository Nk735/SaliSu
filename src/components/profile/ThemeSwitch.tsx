"use client";
import { useEffect,useState } from "react";
import { setTheme } from "@/lib/theme";

export function ThemeSwitch(){
 const [dark,setDark]=useState(false);
 useEffect(()=>setDark(localStorage.getItem("salisu-theme")==="dark"),[]);
 function toggle(){const next=!dark;setDark(next);setTheme(next?"dark":"light");}
 return <button onClick={toggle} className="flex w-full items-center justify-between rounded-xl border border-line bg-card p-3"><span className="text-xs font-bold">Tema scuro</span><span className={`h-6 w-11 rounded-full p-1 transition ${dark?"bg-crimson":"bg-subtle"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${dark?"translate-x-5":"translate-x-0"}`}/></span></button>;
}
