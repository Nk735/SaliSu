export function calculateFairPrice(km:number, consumption:number, fuelPrice:number, passengerSeats:number) {
  if (!km || !consumption || !fuelPrice) return 0;
  return ((km / consumption) * fuelPrice) / (passengerSeats + 1);
}

export function adjustPrice(base:number, percent:number) {
  return Math.max(0, base * (1 + percent / 100));
}
