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

const DISTANCE_CACHE = new Map<string, number>();
const DESTINATION_COORDINATES: Record<"Bari Centro" | "Lungomare", {lat:number;lon:number}> = {
  "Bari Centro": {lat:41.1171, lon:16.8719},
  Lungomare: {lat:41.1288, lon:16.8628},
};

function haversineKm(lat1:number, lon1:number, lat2:number, lon2:number) {
  const toRadians=(value:number)=>value*Math.PI/180;
  const dLat=toRadians(lat2-lat1);
  const dLon=toRadians(lon2-lon1);
  const a=Math.sin(dLat/2)**2
    +Math.cos(toRadians(lat1))*Math.cos(toRadians(lat2))*Math.sin(dLon/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

export async function getMunicipalityDistance(
  municipality:string,
  destination:"Bari Centro"|"Lungomare",
) {
  const cached=DISTANCE_CACHE.get(`${municipality}|${destination}`);
  if (cached !== undefined) return cached;

  const staticDistance=DISTANCES[municipality as BariLocation]?.[destination];
  if (staticDistance !== undefined) {
    DISTANCE_CACHE.set(`${municipality}|${destination}`, staticDistance);
    return staticDistance;
  }

  try {
    const params=new URLSearchParams({
      format:"json",
      limit:"1",
      countrycodes:"it",
      q:`${municipality}, Puglia, Italy`,
    });
    const response=await fetch(`https://nominatim.openstreetmap.org/search?${params}`,{
      headers:{Accept:"application/json"},
    });
    if (!response.ok) throw new Error("Geocoding failed");
    const results=await response.json() as Array<{lat:string;lon:string}>;
    if (!results.length) return 0;
    const point=results[0];
    const destinationPoint=DESTINATION_COORDINATES[destination];
    const straightDistance=haversineKm(
      Number(point.lat),
      Number(point.lon),
      destinationPoint.lat,
      destinationPoint.lon,
    );
    const roadDistance=Math.max(1,Math.round(straightDistance*1.25));
    DISTANCE_CACHE.set(`${municipality}|${destination}`,roadDistance);
    return roadDistance;
  } catch {
    return 0;
  }
}
