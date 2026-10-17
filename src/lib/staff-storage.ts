import {
  CompositionData,
  INITIAL_COMPOSITIONS,
  INITIAL_PLAYER_CHAMPIONS,
  PlayerChampionEntry,
} from "@/data/staff-initial-data";

const COMPOSITIONS_STORAGE_KEY = "void_lynx_compositions_v3";
const PLAYERS_CHAMPS_STORAGE_KEY = "void_lynx_player_champs_v3";
const DRAFTS_HISTORY_STORAGE_KEY = "void_lynx_drafts_history_v2";

export interface SavedDraft {
  id: string;
  rival: string;
  nuestro_lado: "BLUE" | "RED";
  composicion_id: string;
  resultado: "VICTORIA" | "DERROTA" | "PENDING";
  blue_picks: string[];
  blue_bans: string[];
  red_picks: string[];
  red_bans: string[];
  notas: string;
  created_at: string;
}

export function loadCompositions(): CompositionData[] {
  if (typeof window === "undefined") return INITIAL_COMPOSITIONS;
  try {
    const raw = localStorage.getItem(COMPOSITIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((c: any) => ({
          ...c,
          role_priorities: c.role_priorities || {
            TOP: "Media",
            JGL: "Alta",
            MID: "Alta",
            ADC: "Alta",
            SUPP: "Media",
          },
          first_pick_safe: c.first_pick_safe || [],
          no_first_pick_reasons: c.no_first_pick_reasons || [],
          bans_recomendados: c.bans_recomendados || [],
        }));
      }
    }
  } catch (e) {
    console.error("Error reading compositions from localStorage", e);
  }
  return INITIAL_COMPOSITIONS;
}

export function saveCompositionsToStorage(comps: CompositionData[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COMPOSITIONS_STORAGE_KEY, JSON.stringify(comps));
  } catch (e) {
    console.error("Error saving compositions to localStorage", e);
  }
}

export function loadPlayerChampions(): PlayerChampionEntry[] {
  if (typeof window === "undefined") return INITIAL_PLAYER_CHAMPIONS;
  try {
    const raw = localStorage.getItem(PLAYERS_CHAMPS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p: any) => ({
          ...p,
          is_first_pickable: p.is_first_pickable !== false,
          pick_tag: p.pick_tag || (p.is_first_pickable !== false ? "FP" : "Normal"),
        }));
      }
    }
  } catch (e) {
    console.error("Error reading player champions from localStorage", e);
  }
  return INITIAL_PLAYER_CHAMPIONS;
}

export function savePlayerChampionsToStorage(entries: PlayerChampionEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PLAYERS_CHAMPS_STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("Error saving player champions to localStorage", e);
  }
}

export function resetStaffDataToDefault(): {
  compositions: CompositionData[];
  playerChampions: PlayerChampionEntry[];
} {
  if (typeof window !== "undefined") {
    localStorage.removeItem(COMPOSITIONS_STORAGE_KEY);
    localStorage.removeItem(PLAYERS_CHAMPS_STORAGE_KEY);
    localStorage.removeItem("void_lynx_compositions_v2");
    localStorage.removeItem("void_lynx_player_champs_v2");
  }
  return {
    compositions: INITIAL_COMPOSITIONS,
    playerChampions: INITIAL_PLAYER_CHAMPIONS,
  };
}

export async function fetchRemoteCompositions(): Promise<CompositionData[] | null> {
  try {
    const res = await fetch("/api/composiciones");
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && !data[0]?.error) {
      saveCompositionsToStorage(data);
      return data;
    }
  } catch {
    // Fallback silencioso en entorno local o sin D1
  }
  return null;
}

export async function fetchRemotePlayerChampions(): Promise<PlayerChampionEntry[] | null> {
  try {
    const res = await fetch("/api/jugadores");
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && !data[0]?.error) {
      savePlayerChampionsToStorage(data);
      return data;
    }
  } catch {
    // Fallback silencioso en entorno local o sin D1
  }
  return null;
}

// Historial de Drafts y Scrims
export function loadDraftHistory(): SavedDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DRAFTS_HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Error reading drafts from localStorage", e);
  }
  return [];
}

export function saveDraftToStorage(draft: SavedDraft): SavedDraft[] {
  const current = loadDraftHistory();
  const existingIndex = current.findIndex((d) => d.id === draft.id);
  let updated: SavedDraft[];
  if (existingIndex >= 0) {
    updated = current.map((d) => (d.id === draft.id ? draft : d));
  } else {
    updated = [draft, ...current];
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(DRAFTS_HISTORY_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteDraftFromStorage(id: string): SavedDraft[] {
  const current = loadDraftHistory();
  const updated = current.filter((d) => d.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(DRAFTS_HISTORY_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

// Sincronización transparente con Cloudflare Pages Functions / D1 API
export async function syncCompositionsWithApi(comps: CompositionData[]): Promise<boolean> {
  try {
    const res = await fetch("/api/composiciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comps),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncPlayerChampionsWithApi(entries: PlayerChampionEntry[]): Promise<boolean> {
  try {
    const res = await fetch("/api/jugadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entries),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncDraftWithApi(draft: SavedDraft): Promise<boolean> {
  try {
    const res = await fetch("/api/drafts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    return res.ok;
  } catch {
    return false;
  }
}
