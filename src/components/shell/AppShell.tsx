"use client";
import { useEffect } from "react";
import { MobileHeader } from "./MobileHeader";
import { FloatingDock } from "./FloatingDock";

export function AppShell({children,name}:{children:React.ReactNode;name?:string}) {
  useEffect(()=>{const saved=localStorage.getItem("salisu-theme");document.documentElement.dataset.theme=saved==="dark"?"dark":"light";},[]);
  return <div className="relative flex min-h-[100dvh] justify-center bg-outer p-0 sm:py-[4dvh]"><div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-base sm:h-[92dvh] sm:max-h-[890px] sm:max-w-[430px] sm:rounded-[38px] sm:border-[6px] sm:border-[#221D19] sm:shadow-2xl"><MobileHeader name={name}/><main className="app-scroll flex-1 overflow-y-auto pb-[112px]">{children}</main><FloatingDock/></div></div>;
}
