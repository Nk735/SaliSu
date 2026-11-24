"use client";
import {useState} from "react";
import {ProfileCard} from "./ProfileCard";
import {MapsPointForm} from "./MapsPointForm";
import {VehicleSettings} from "./VehicleSettings";
import {ProfileBadges} from "./ProfileBadges";

export function ProfileSections({profile}:{profile:any}) {
  const [editing,setEditing]=useState(false);
  const [activeSection,setActiveSection]=useState<string|null>(null);
  const [currentProfile,setCurrentProfile]=useState(profile);
  function finishEditing(){setEditing(false);setActiveSection(null);}
  function updateProfile(values:any){setCurrentProfile((value:any)=>({...value,...values}));setActiveSection(null);}
  return <div className="space-y-4">
    <ProfileCard profile={currentProfile} editing={editing} activeSection={activeSection} onToggle={()=>editing?finishEditing():setEditing(true)} onEditSection={setActiveSection} onSaved={updateProfile}/>
    <MapsPointForm profile={currentProfile} editing={editing} active={activeSection==="maps"} onEdit={()=>setActiveSection("maps")} onSaved={updateProfile}/>
    <ProfileBadges profileId={currentProfile.id}/>
    <VehicleSettings profile={currentProfile} editing={editing} active={activeSection==="vehicle"} onEdit={()=>setActiveSection("vehicle")} onSaved={updateProfile}/>
  </div>;
}
