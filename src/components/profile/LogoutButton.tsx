"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BottomSheet } from "@/components/ui/BottomSheet";

export function LogoutButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function logout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return <>
    <button onClick={() => setOpen(true)} className="w-full rounded-xl border border-destructive/30 bg-card px-4 py-3 text-sm font-extrabold text-destructive">Esci dall'account</button>
    <BottomSheet open={open} onClose={() => setOpen(false)} title="Uscire da SaliSu?">
      <p className="mb-4 text-sm text-muted">La tua sessione verrà chiusa su questo dispositivo.</p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setOpen(false)} className="rounded-xl border border-line bg-card py-3 text-sm font-bold">Annulla</button>
        <button onClick={logout} disabled={loading} className="rounded-xl bg-destructive py-3 text-sm font-extrabold text-white disabled:opacity-50">Esci</button>
      </div>
    </BottomSheet>
  </>;
}
