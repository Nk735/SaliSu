import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthDivider } from "@/components/auth/AuthDivider";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <div className="card rounded-[28px] p-6">
    <div className="mb-6"><h1 className="text-2xl font-extrabold">SaliSu</h1><p className="mt-1 text-sm text-muted">Accedi al carpooling quotidiano.</p></div>
    {error === "auth" && <p className="mb-3 rounded-xl bg-accentWarmSoft p-3 text-xs font-semibold text-accentWarm">Il link non è più valido o non può essere verificato. Richiedi un nuovo link.</p>}
    <AuthForm/><p className="mt-3 text-center"><Link className="text-xs font-bold text-muted" href="/forgot-password">Password dimenticata?</Link></p><AuthDivider/><p className="text-center text-xs text-muted">Nuovo su SaliSu? <Link className="font-bold text-crimson" href="/register">Registrati</Link></p>
  </div>;
}
