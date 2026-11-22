export type BariLocation = "Poggiofranco" | "Carrassi" | "Japigia" | "San Paolo" | "Modugno" | "Bitonto" | "Triggiano" | "Molfetta" | "Noicattaro";

export const DISTANCES: Record<BariLocation, Record<"Bari Centro" | "Lungomare", number>> = {
  Poggiofranco:{ "Bari Centro":4, Lungomare:5 },
  Carrassi:{ "Bari Centro":5, Lungomare:6 },
  Japigia:{ "Bari Centro":6, Lungomare:4 },
  "San Paolo":{ "Bari Centro":8, Lungomare:10 },
  Modugno:{ "Bari Centro":9, Lungomare:11 },
  Bitonto:{ "Bari Centro":20, Lungomare:22 },
  Triggiano:{ "Bari Centro":10, Lungomare:12 },
  Molfetta:{ "Bari Centro":31, Lungomare:33 },
  Noicattaro:{ "Bari Centro":16, Lungomare:18 },
};
