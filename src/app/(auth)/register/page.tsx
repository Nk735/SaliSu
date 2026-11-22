import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return <div className="card rounded-[28px] p-6">
    <h1 className="mb-1 text-2xl font-extrabold">Crea il tuo account</h1><p className="mb-5 text-sm text-muted">Email personale, nessun blocco aziendale.</p>
    <AuthForm register/><p className="mt-4 text-center text-xs text-muted">Hai già un account? <Link className="font-bold text-crimson" href="/login">Accedi</Link></p>
  </div>;
}
