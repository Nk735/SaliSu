"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();
  const router = useRouter();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("Le password non coincidono.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
    } else {
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    }
    setLoading(false);
  }

  return <form onSubmit={submit} className="space-y-3">
    <input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nuova password" className="w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm outline-none focus:border-accentWarm"/>
    <input required type="password" minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Conferma nuova password" className="w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm outline-none focus:border-accentWarm"/>
    <button disabled={loading || password.length < 6} className="w-full rounded-xl bg-brand py-3 text-sm font-extrabold text-brandText disabled:opacity-50">Aggiorna password</button>
    {message && <p className="rounded-xl bg-accentWarmSoft p-3 text-xs font-semibold text-accentWarm">{message}</p>}
  </form>;
}
