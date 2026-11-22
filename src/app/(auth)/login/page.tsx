import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthDivider } from "@/components/auth/AuthDivider";

export default function LoginPage() {
  return <div className="card rounded-[28px] p-6">
    <div className="mb-6"><h1 className="text-2xl font-extrabold">SaliSu <span className="text-sm text-accentWarm">Alfa Bari</span></h1><p className="mt-1 text-sm text-muted">Accedi al carpooling quotidiano.</p></div>
    <AuthForm/><AuthDivider/><p className="text-center text-xs text-muted">Nuovo su SaliSu? <Link className="font-bold text-crimson" href="/register">Registrati</Link></p>
  </div>;
}
