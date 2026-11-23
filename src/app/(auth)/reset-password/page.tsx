import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return <div className="card rounded-[28px] p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold">Nuova password</h1>
      <p className="mt-1 text-sm text-muted">Scegli una password sicura per il tuo account.</p>
    </div>
    <ResetPasswordForm />
  </div>;
}
