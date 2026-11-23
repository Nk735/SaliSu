"use client";
import { useEffect,useState } from "react";
import { usePathname } from "next/navigation";
import { MobileHeader } from "./MobileHeader";
import { FloatingDock } from "./FloatingDock";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { SupportCard } from "@/components/support/SupportCard";
import { ToastProvider } from "@/components/ui/ToastProvider";

export function AppShell({children,name}:{children:React.ReactNode;name?:string}) {
  const [supportOpen,setSupportOpen]=useState(false);
  const pathname=usePathname();
  const insideConversation=/^\/chat\/[^/]+/.test(pathname);
  useEffect(()=>{const saved=localStorage.getItem("salisu-theme");document.documentElement.dataset.theme=saved==="dark"?"dark":"light";},[]);
  return <div className="relative flex min-h-[100dvh] justify-center bg-outer p-0 sm:py-[4dvh]"><div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-base sm:h-[92dvh] sm:max-h-[890px] sm:max-w-[430px] sm:rounded-[38px] sm:border-[6px] sm:border-line sm:shadow-2xl">{!insideConversation&&<MobileHeader name={name} onCoffee={()=>setSupportOpen(true)}/>}<main className="app-scroll flex-1 overflow-y-auto">{children}</main>{!insideConversation&&<><FloatingDock/><BottomSheet open={supportOpen} onClose={()=>setSupportOpen(false)} title="Supporta SaliSu"><SupportCard compact/></BottomSheet></>}<ToastProvider/></div></div>;
}
