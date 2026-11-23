import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export default async function OnboardingPage() {
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect("/login");
  const {data:profile}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();
  if(profile?.onboarding_completed) redirect("/home");
  return <main className="min-h-[100dvh] bg-base p-5 flex items-center justify-center"><div className="card w-full max-w-[430px] rounded-[28px] p-6"><h1 className="text-2xl font-extrabold">Benvenuto su SaliSu</h1><p className="mb-6 mt-1 text-sm text-muted">Completa il profilo una sola volta.</p><OnboardingForm userId={user.id} initialName={profile?.full_name||""} initialZone={profile?.starting_zone||""}/></div></main>;
}
