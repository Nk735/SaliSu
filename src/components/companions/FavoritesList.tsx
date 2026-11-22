import {CompanionCard} from "./CompanionCard";
export function FavoritesList({favorites}:{favorites:any[]}){return <div className="space-y-2">{favorites.length?favorites.map(f=><CompanionCard key={f.favorite_user_id} name={f.profiles?.full_name||"Pendolare"} />):<div className="card rounded-2xl p-6 text-center text-sm text-muted">Nessun compagno salvato.</div>}</div>}
