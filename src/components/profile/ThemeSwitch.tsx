"use client";
import { useEffect,useState } from "react";
import { getInitialTheme,setTheme } from "@/lib/theme";

export function ThemeSwitch(){
 const [dark,setDark]=useState(true);
 useEffect(()=>{const initial=getInitialTheme();setDark(initial==="dark");setTheme(initial);},[]);
 function toggle(){const next=!dark;setDark(next);setTheme(next?"dark":"light");}
 return <div className="card rounded-2xl p-4"><h3 className="mb-3 text-sm font-extrabold">Preferenze app</h3><button onClick={toggle} className="flex w-full items-center justify-between rounded-xl border border-line bg-input p-3"><span className="text-xs font-bold">Tema scuro</span><span className={`h-6 w-11 rounded-full p-1 transition ${dark?"bg-brand":"bg-subtle"}`}><span className={`block h-4 w-4 rounded-full bg-card transition ${dark?"translate-x-5":"translate-x-0"}`}/></span></button></div>;
}
