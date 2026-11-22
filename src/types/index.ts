export type Profile = {
  id:string; full_name:string|null; preferred_destination:"Bari Centro"|"Lungomare"|null;
  starting_zone:string|null; maps_label:string|null; maps_url:string|null;
  fuel_type:"benzina"|"diesel"|"gpl"|"metano"|"elettrico"|null;
  consumption_km_l:number|null; onboarding_completed:boolean;
};
