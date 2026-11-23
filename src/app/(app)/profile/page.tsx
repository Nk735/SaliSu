import { requireProfile } from "@/lib/auth/requireProfile";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { MapsPointForm } from "@/components/profile/MapsPointForm";
import { VehicleSettings } from "@/components/profile/VehicleSettings";
import { ThemeSwitch } from "@/components/profile/ThemeSwitch";
import { MyTrips } from "@/components/profile/MyTrips";

export default async function ProfilePage(){const {profile}=await requireProfile();return <div className="space-y-4 px-4 pb-6 pt-4"><ProfileCard profile={profile}/><MapsPointForm profile={profile}/><VehicleSettings profile={profile}/><MyTrips/><ThemeSwitch/></div>}
