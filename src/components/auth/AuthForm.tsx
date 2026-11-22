"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AuthForm({ register=false }: { register?:boolean }) {
  const [email,setEmail] = useState(""); const [password,setPassword] = useState("");
  const [fullName,setFullName] = useState(""); const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState(""); const supabase=createClient(); const router=useRouter();
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setLoading(true); setMessage("");
    if (register) {
      const { error } = await supabase.auth.signUp({ email,password,options:{emailRedirectTo:`${location.origin}/auth/callback`,data:{full_name:fullName}} });
      setMessage(error ? error.message : "Controlla la tua email per confermare la registrazione.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({email,password});
      if (error) setMessage(error.message); else router.replace("/home");
    }
    setLoading(false);
  }
  async function magic() {
    setLoading(true);
    const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:`${location.origin}/auth/callback`}});
    setMessage(error?error.message:"Link magico inviato alla tua email.");
    setLoading(false);
  }
  return <form onSubmit={submit} className="space-y-3">
    {register && <input required value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Nome e cognome" className="w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm outline-none focus:border-accentWarm"/>}
    <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email personale" className="w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm outline-none focus:border-accentWarm"/>
    <input required type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-line bg-card px-3.5 py-3 text-sm outline-none focus:border-accentWarm"/>
    <button disabled={loading} className="w-full rounded-xl bg-crimson py-3 text-sm font-extrabold text-white shadow-md disabled:opacity-60">{register?"Crea account":"Accedi"}</button>
    <button type="button" onClick={magic} disabled={!email||loading} className="w-full rounded-xl border border-line bg-card py-3 text-sm font-bold text-ink disabled:opacity-50">Accedi con link magico</button>
    {message && <p className="rounded-xl bg-accentWarmSoft p-3 text-xs font-semibold text-accentWarm">{message}</p>}
  </form>;
}
