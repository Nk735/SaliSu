export const fallbackFuelPrices = { benzina:1.82, diesel:1.69, gpl:.74, metano:1.45, elettrico:.31 };
export type FuelType = keyof typeof fallbackFuelPrices;
