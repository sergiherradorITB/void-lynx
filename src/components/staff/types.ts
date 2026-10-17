import { RoleType } from "@/components/RoleBadge";
import { CompositionData, PlayerChampionEntry, PriorityLevel } from "@/data/staff-initial-data";
import { SavedDraft } from "@/lib/staff-storage";

export type ActiveTab = "drafter" | "compositions" | "players" | "live" | "history";

export interface LaneConfig {
  role: RoleType;
  player: string;
  laneTitle: string;
  badgeBg: string;
  textColor: string;
  borderAccent: string;
  headerGradient: string;
  tagline: string;
}

export interface DraftSlot {
  side: "blue" | "red";
  type: "pick" | "ban";
  index: number;
}

export interface DraftSequenceStep {
  phase: string;
  side: "blue" | "red";
  type: "pick" | "ban";
  index: number;
  label: string;
  ourTurn: boolean;
}

export interface CompDraftAnalysis {
  byRole: Record<string, { player: any; champs: PlayerChampionEntry[] }>;
  safeFirstPicks: PlayerChampionEntry[];
  coveredRolesCount: number;
}
