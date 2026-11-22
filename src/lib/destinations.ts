export const DESTINATIONS = ["Bari Centro", "Lungomare"] as const;
export type Destination = (typeof DESTINATIONS)[number];
