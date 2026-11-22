import { requireProfile } from "@/lib/auth/requireProfile";
import { AppShell } from "@/components/shell/AppShell";

export default async function AppLayout({children}:{children:React.ReactNode}) {
  const {profile}=await requireProfile();
  return <AppShell name={profile.full_name||undefined}>{children}</AppShell>;
}
