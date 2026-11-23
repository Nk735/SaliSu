import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  if (code) {
    redirect(`/auth/callback?code=${encodeURIComponent(code)}&next=/home`);
  }

  const supabase = await createClient();
  const { data:{ user } } = await supabase.auth.getUser();
  redirect(user ? "/home" : "/login");
}
