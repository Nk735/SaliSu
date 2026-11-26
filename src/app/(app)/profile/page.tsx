import { requireProfile } from "@/lib/auth/requireProfile";
import { FeedPreferences } from "@/components/profile/FeedPreferences";
import { ThemeSwitch } from "@/components/profile/ThemeSwitch";
import { MyTrips } from "@/components/profile/MyTrips";
import { ProfileSections } from "@/components/profile/ProfileSections";
import { ProfileReviews } from "@/components/profile/ProfileReviews";
import { LogoutButton } from "@/components/profile/LogoutButton";

export default async function ProfilePage(){const {profile}=await requireProfile();return <div className="space-y-4 px-4 pb-36 pt-4"><ProfileSections profile={profile}/><MyTrips/><ProfileReviews/><FeedPreferences profile={profile}/><ThemeSwitch/><LogoutButton/></div>}
