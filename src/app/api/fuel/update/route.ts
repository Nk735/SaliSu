import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fallbackFuelPrices } from "@/lib/pricing/fuel";

const sourceUrl = "https://www.mimit.gov.it/it/energie-prezzi/osservaprezzi";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const cron = request.headers.get("x-vercel-cron");
  const secret = request.nextUrl.searchParams.get("secret");
  if (process.env.CRON_SECRET && !cron && auth !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const prices = { ...fallbackFuelPrices };
  try {
    const response = await fetch(sourceUrl, { headers: { "user-agent": "SaliSu-PWA/1.0" }, next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`MIMIT source returned ${response.status}`);
    const html = await response.text();
    const pumpPrice = (fuel: "benzina" | "diesel") => {
      const match = html.match(new RegExp(`${fuel}[\\s\\S]{0,500}?([0-9],[0-9]{3})`, "i"));
      if (!match) return null;
      const value = Number(match[1].replace(",", "."));
      return value >= 1 && value <= 3 ? value : null;
    };
    const benzina = pumpPrice("benzina"); const diesel = pumpPrice("diesel");
    if (benzina) prices.benzina = benzina;
    if (diesel) prices.diesel = diesel;
  } catch {
    // Safe regional fallback values are persisted when the public source is unavailable.
  }

  const rows = Object.entries(prices).map(([fuel_type, price]) => ({
    fuel_type,
    price,
    region: "Puglia",
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from("fuel_prices").upsert(rows, { onConflict: "fuel_type" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ source: sourceUrl, region: "Puglia", prices, updated_at: new Date().toISOString() });
}
