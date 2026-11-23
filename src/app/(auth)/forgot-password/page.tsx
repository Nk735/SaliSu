import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return <div className="card rounded-[28px] p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold">Password dimenticata</h1>
      <p className="mt-1 text-sm text-muted">Inserisci la tua email per ricevere un link sicuro.</p>
    </div>
    <ForgotPasswordForm />
  </div>;
}
