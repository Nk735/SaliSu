"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ZoneAutocomplete } from "@/components/ui/ZoneAutocomplete";
import { showToast } from "@/components/ui/ToastProvider";

type ActiveNode = { starting_zone: string; users_count: number | string };

export function FeedPreferences({ profile }: { profile: any }) {
  const supabase = createClient();
  const [showOnlyStartingZone, setShowOnlyStartingZone] = useState(profile.show_only_starting_zone ?? true);
  const [additionalZone, setAdditionalZone] = useState(profile.additional_starting_zone || "");
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

  async function savePreference(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const values = {
      show_only_starting_zone: showOnlyStartingZone,
      additional_starting_zone: showOnlyStartingZone ? null : additionalZone,
    };
    const { error } = await supabase.from("profiles").update(values).eq("id", profile.id);
    setSaving(false);
    if (error) {
      showToast("Impossibile salvare la preferenza del feed: " + error.message, "error");
      return;
    }
    showToast("Preferenza del feed salvata");
  }

  const countText = loadingCount
    ? "Caricamento utenti..."
    : usersCount === null
      ? "Numero utenti non disponibile"
      : `${usersCount} utenti partono da ${profile.starting_zone || "questa città"}`;

  return (
    <div className="card rounded-2xl p-4">
      <div className="mb-3">
        <h3><span className="inline-flex rounded-full border border-brand/30 bg-brandSoft px-3 py-1 text-[10px] font-extrabold text-greenText">Feed per te</span></h3>
        <p className="mt-1 text-xs text-muted">{countText}</p>
      </div>
      <form onSubmit={savePreference} className="space-y-3">
        <label className="flex items-center justify-between gap-3 rounded-xl border border-line bg-input p-3 text-xs font-bold">
          <span>Mostra nel feed solo la tua città di partenza</span>
          <input
            type="checkbox"
            checked={showOnlyStartingZone}
            onChange={(event) => setShowOnlyStartingZone(event.target.checked)}
            className="h-4 w-4 accent-brand"
          />
        </label>
        {!showOnlyStartingZone && (
          <ZoneAutocomplete
            value={additionalZone}
            onChange={setAdditionalZone}
            label="Aggiungi un'altra città di partenza"
          />
        )}
        <button
          type="submit"
          disabled={saving || (!showOnlyStartingZone && !additionalZone)}
          className="w-full rounded-xl bg-brand py-2.5 text-xs font-extrabold text-brandText disabled:opacity-50"
        >
          {saving ? "Salvataggio..." : "Salva preferenza"}
        </button>
      </form>
    </div>
  );
}
