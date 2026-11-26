"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

type Toast = { id: number; message: string; tone: "success" | "error" };

export function showToast(message: string, tone: Toast["tone"] = "success") {
  window.dispatchEvent(new CustomEvent("salisu-toast", { detail: { message, tone } }));
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<Pick<Toast, "message" | "tone">>).detail;
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { ...detail, id }]);
      window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 5000);
    };
    window.addEventListener("salisu-toast", handleToast);
    return () => window.removeEventListener("salisu-toast", handleToast);
  }, []);
  return <div className="toast-stack pointer-events-none fixed inset-x-0 z-[100] flex flex-col items-center gap-2 px-4" aria-live="polite">{toasts.map((toast) => <div key={toast.id} role={toast.tone==="error"?"alert":"status"} className={`toast pointer-events-auto flex max-w-[360px] items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold shadow-lg ${toast.tone === "error" ? "border-destructive/40 bg-card text-destructive" : "border-brand/40 bg-card text-greenText"}`}>{toast.tone === "error" ? <X size={15}/> : <Check size={15}/>}<span>{toast.message}</span></div>)}</div>;
}