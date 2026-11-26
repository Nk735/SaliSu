"use client";
import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ZoneAutocomplete } from "@/components/ui/ZoneAutocomplete";
import { showToast } from "@/components/ui/ToastProvider";
import { PUGLIA_MUNICIPALITIES, normalizeMunicipality } from "@/lib/pugliaMunicipalities";

type ActiveNode = { starting_zone: string; users_count: number | string };

export function FeedPreferences({ profile }: { profile: any }) {
  const supabase = createClient();
  const [showOnlyStartingZone, setShowOnlyStartingZone] = useState(profile.show_only_starting_zone ?? true);
  const [additionalZones, setAdditionalZones] = useState<string[]>(
    profile.additional_starting_zones || (profile.additional_starting_zone ? [profile.additional_starting_zone] : []),
  );
  const [newZone, setNewZone] = useState("");
  const [addingZone, setAddingZone] = useState(false);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    if (!profile.starting_zone) {
      setLoadingCount(false);
      return () => {
        active = false;
      };
    }

    void (async () => {
      const { data, error } = await supabase.rpc("get_active_route_nodes");
      if (!active) return;
      if (error) {
        setUsersCount(null);
        showToast("Impossibile caricare il numero di utenti della tua città.", "error");
      } else {
        const cityNodes = (data || []) as ActiveNode[];
        const count = cityNodes
          .filter((node) => node.starting_zone === profile.starting_zone)
          .reduce((total, node) => total + Number(node.users_count || 0), 0);
        setUsersCount(count);
      }
      setLoadingCount(false);
    })();

    return () => {
      active = false;
    };
  }, [profile.starting_zone, supabase]);

  async function savePreference() {
    const nextValue = !showOnlyStartingZone;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ show_only_starting_zone: nextValue })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      showToast("Impossibile aggiornare il feed: " + error.message, "error");
      return;
    }
    setShowOnlyStartingZone(nextValue);
  }

  async function saveAdditionalZones(nextZones: string[]) {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ additional_starting_zones: nextZones })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      showToast("Impossibile aggiornare le città del feed: " + error.message, "error");
      return false;
    }
    setAdditionalZones(nextZones);
    return true;
  }

  async function addZone() {
    const selectedZone = PUGLIA_MUNICIPALITIES.find(
      (city) => normalizeMunicipality(city) === normalizeMunicipality(newZone),
    );
    if (!selectedZone) {
      showToast("Seleziona un comune dall'elenco.", "error");
      return;
    }
    const alreadyAdded = [profile.starting_zone, ...additionalZones].some(
      (city) => normalizeMunicipality(city || "") === normalizeMunicipality(selectedZone),
    );
    if (alreadyAdded) {
      showToast("Questo comune è già presente nel feed.", "error");
      return;
    }
    if (await saveAdditionalZones([...additionalZones, selectedZone])) {
      setNewZone("");
      setAddingZone(false);
    }
  }

  async function removeZone(zone: string) {
    await saveAdditionalZones(additionalZones.filter((city) => city !== zone));
  }

  const countText = loadingCount
    ? "Caricamento utenti..."
    : usersCount === null
      ? "Numero utenti non disponibile"
      : `${usersCount} ${usersCount === 1 ? "utente parte" : "utenti partono"} da ${profile.starting_zone || "questa città"}`;

  return (
    <div className="card rounded-2xl p-4">
      <div className="mb-3">
        <h3 className="text-sm font-extrabold">{profile.starting_zone ? countText : "Imposta la città di partenza"}</h3>
      </div>
      <div className="space-y-3">
        <button
          type="button"
          role="switch"
          aria-checked={showOnlyStartingZone}
          disabled={saving}
          onClick={savePreference}
          className="flex w-full items-center justify-between rounded-xl border border-line bg-input p-3 text-left disabled:opacity-50"
        >
          <span>Mostra nel feed solo la tua città di partenza</span>
          <span className={`h-6 w-11 rounded-full p-1 transition ${showOnlyStartingZone ? "bg-brand" : "bg-subtle"}`}>
            <span className={`block h-4 w-4 rounded-full bg-card transition ${showOnlyStartingZone ? "translate-x-5" : "translate-x-0"}`} />
          </span>
        </button>
        {!showOnlyStartingZone && (
          <div className="space-y-2">
            {additionalZones.map((zone) => (
              <div key={zone} className="flex items-center justify-between rounded-xl border border-line bg-input px-3 py-2">
                <span className="text-xs font-semibold">{zone}</span>
                <button
                  type="button"
                  aria-label={`Rimuovi ${zone}`}
                  disabled={saving}
                  onClick={() => removeZone(zone)}
                  className="rounded-lg p-1 text-muted hover:bg-subtle disabled:opacity-50"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
            {addingZone ? (
              <div className="space-y-2">
                <ZoneAutocomplete value={newZone} onChange={setNewZone} label="Nuova città di partenza" />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setAddingZone(false); setNewZone(""); }}
                    className="flex-1 rounded-xl border border-line py-2 text-xs font-bold text-muted"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    disabled={saving || !newZone}
                    onClick={addZone}
                    className="flex-1 rounded-xl bg-brand py-2 text-xs font-extrabold text-brandText disabled:opacity-50"
                  >
                    {saving ? "Salvataggio..." : "Aggiungi"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingZone(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line py-2.5 text-xs font-bold text-muted"
              >
                <Plus size={15} />
                Aggiungi una città
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
