import { LaneConfig } from "./types";
import { RoleType } from "@/components/RoleBadge";

export const ROLE_LANE_METADATA: Record<
  RoleType,
  {
    laneTitle: string;
    badgeBg: string;
    textColor: string;
    borderAccent: string;
    headerGradient: string;
    tagline: string;
  }
> = {
  TOP: {
    laneTitle: "Toplane (Línea Superior)",
    badgeBg: "bg-amber-950/90 text-amber-300 border-amber-500/50",
    textColor: "text-amber-400",
    borderAccent: "border-amber-500/40 hover:border-amber-500/70",
    headerGradient: "from-amber-950/40 via-zinc-950 to-zinc-950",
    tagline: "Splitpush, tanques de frontline o duelistas de aislamiento",
  },
  JGL: {
    laneTitle: "Jungle (Jungla & Control)",
    badgeBg: "bg-emerald-950/90 text-emerald-300 border-emerald-500/50",
    textColor: "text-emerald-400",
    borderAccent: "border-emerald-500/40 hover:border-emerald-500/70",
    headerGradient: "from-emerald-950/40 via-zinc-950 to-zinc-950",
    tagline: "Iniciadores, control de mapa, pathing de objetivos y ganks",
  },
  MID: {
    laneTitle: "Midlane (Línea Central)",
    badgeBg: "bg-cyan-950/90 text-cyan-300 border-cyan-500/50",
    textColor: "text-cyan-400",
    borderAccent: "border-cyan-500/40 hover:border-cyan-500/70",
    headerGradient: "from-cyan-950/40 via-zinc-950 to-zinc-950",
    tagline: "Magos de control, asesinos, roamers y daño mágico/burst",
  },
  ADC: {
    laneTitle: "AD Carry (Botlane DPS)",
    badgeBg: "bg-purple-950/90 text-purple-300 border-purple-500/50",
    textColor: "text-purple-400",
    borderAccent: "border-purple-500/40 hover:border-purple-500/70",
    headerGradient: "from-purple-950/40 via-zinc-950 to-zinc-950",
    tagline: "Daño sostenido, escalado a late game y asedio de torres",
  },
  SUPP: {
    laneTitle: "Support (Apoyo & Visión)",
    badgeBg: "bg-rose-950/90 text-rose-300 border-rose-500/50",
    textColor: "text-rose-400",
    borderAccent: "border-rose-500/40 hover:border-rose-500/70",
    headerGradient: "from-rose-950/40 via-zinc-950 to-zinc-950",
    tagline: "Hard engage, peel, control de visión y disengage táctico",
  },
};

export const VERTICAL_BOARD_ROLES: LaneConfig[] = [
  {
    role: "TOP",
    player: "Kaserolo",
    laneTitle: "Toplane (Línea Superior)",
    badgeBg: "bg-amber-950/90 text-amber-300 border-amber-500/50",
    textColor: "text-amber-400",
    borderAccent: "border-amber-500/40 hover:border-amber-500/70",
    headerGradient: "from-amber-950/40 via-zinc-950 to-zinc-950",
    tagline: "Splitpush, tanques de frontline o duelistas de aislamiento",
  },
  {
    role: "JGL",
    player: "Tamudor",
    laneTitle: "Jungle (Jungla & Control)",
    badgeBg: "bg-emerald-950/90 text-emerald-300 border-emerald-500/50",
    textColor: "text-emerald-400",
    borderAccent: "border-emerald-500/40 hover:border-emerald-500/70",
    headerGradient: "from-emerald-950/40 via-zinc-950 to-zinc-950",
    tagline: "Iniciadores, control de mapa, pathing de objetivos y ganks",
  },
  {
    role: "MID",
    player: "Upss",
    laneTitle: "Midlane (Línea Central)",
    badgeBg: "bg-cyan-950/90 text-cyan-300 border-cyan-500/50",
    textColor: "text-cyan-400",
    borderAccent: "border-cyan-500/40 hover:border-cyan-500/70",
    headerGradient: "from-cyan-950/40 via-zinc-950 to-zinc-950",
    tagline: "Magos de control, asesinos, roamers y daño mágico/burst",
  },
  {
    role: "ADC",
    player: "arnoop88",
    laneTitle: "AD Carry (Botlane DPS)",
    badgeBg: "bg-purple-950/90 text-purple-300 border-purple-500/50",
    textColor: "text-purple-400",
    borderAccent: "border-purple-500/40 hover:border-purple-500/70",
    headerGradient: "from-purple-950/40 via-zinc-950 to-zinc-950",
    tagline: "Daño sostenido, escalado a late game y asedio de torres",
  },
  {
    role: "SUPP",
    player: "Liber",
    laneTitle: "Support (Apoyo & Visión)",
    badgeBg: "bg-rose-950/90 text-rose-300 border-rose-500/50",
    textColor: "text-rose-400",
    borderAccent: "border-rose-500/40 hover:border-rose-500/70",
    headerGradient: "from-rose-950/40 via-zinc-950 to-zinc-950",
    tagline: "Hard engage, peel, control de visión y disengage táctico",
  },
];
