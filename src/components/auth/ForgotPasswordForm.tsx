"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, "");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
    });
    setMessage(error ? error.message : "Controlla la tua email: abbiamo inviato il link per reimpostare la password.");
    setLoading(false);
  }

  return <form onSubmit={submit} className="space-y-3">
    <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email personale" className="w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm outline-none focus:border-accentWarm"/>
    <button disabled={loading || !email} className="w-full rounded-xl bg-brand py-3 text-sm font-extrabold text-brandText disabled:opacity-50">Invia link di recupero</button>
    {message && <p className="rounded-xl bg-accentWarmSoft p-3 text-xs font-semibold text-accentWarm">{message}</p>}
    <Link href="/login" className="block pt-1 text-center text-xs font-bold text-muted">Torna al login</Link>
  </form>;
}
