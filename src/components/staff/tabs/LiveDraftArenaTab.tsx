import React, { useState, useMemo } from "react";
import { CompositionData, PlayerChampionEntry, PriorityLevel, PlayerProfile } from "@/data/staff-initial-data";
import { Champion, CHAMPIONS_CATALOG, findChampion, getChampionAvatar } from "@/data/champions";
import { RoleIconOnly, RoleType } from "@/components/RoleBadge";
import {
  Swords,
  Share2,
  History,
  Save,
  RotateCcw,
  AlertTriangle,
  Trash2,
  Crosshair,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Flame,
  Check,
  Zap,
  Target,
  Sparkles,
  Lock,
  Crown,
  Filter,
  ExternalLink,
  Loader2,
  Radio,
  X,
  XCircle,
} from "lucide-react";
import { ActiveTab, DraftSlot, DraftSequenceStep, DrafterSyncStatus, LaneConfig } from "../types";
import { SavedDraft } from "@/lib/staff-storage";
import { calculateCompMetrics, getSmartBans, getRosterCountersForEnemy } from "@/lib/draft-tactics";

interface LiveDraftArenaTabProps {
  players?: PlayerProfile[];
  starterPlayers?: PlayerProfile[];
  ourSide: "BLUE" | "RED";
  setOurSide: (side: "BLUE" | "RED") => void;
  rivalName: string;
  setRivalName: (name: string) => void;
  matchResult: "VICTORIA" | "DERROTA" | "PENDING";
  setMatchResult: (res: "VICTORIA" | "DERROTA" | "PENDING") => void;
  selectedCompId: string;
  setSelectedCompId: (id: string) => void;
  compositions: CompositionData[];
  currentComp: CompositionData;
  activeCompIds?: string[];
  handleToggleCompActive?: (id: string) => void;
  handleActivateAllComps?: () => void;
  handleDeactivateAllComps?: () => void;
  drafterArenaMode: "builtin" | "drafter_lol" | "split";
  setDrafterArenaMode: (mode: "builtin" | "drafter_lol" | "split") => void;
  cleanDrafterIframeUrl: string;
  handleOpenDrafterPopout: () => void;
  drafterInputUrl: string;
  setDrafterInputUrl: (url: string) => void;
  drafterRoomUrl: string;
  handleSetDrafterRoomUrl: (url: string) => void;
  enemyCountersDetected: string[];
  bluePicks: string[];
  blueBans: string[];
  redPicks: string[];
  redBans: string[];
  activeSlot: DraftSlot;
  setActiveSlot: (slot: DraftSlot) => void;
  currentTurnStep: DraftSequenceStep | null;
  handleNextTurnStep: () => void;
  handlePrevTurnStep: () => void;
  handleClearSlot: (side: "blue" | "red", type: "pick" | "ban", index: number) => void;
  handleResetDraftBoard: () => void;
  handleCopyDraftSummary: () => void;
  handleSaveCurrentDraft: () => void;
  draftSaveNotification: { message: string; type: "success" | "error" } | null;
  draftsHistory: SavedDraft[];
  showHistoryModal: boolean;
  setShowHistoryModal: (show: boolean) => void;
  handleLoadSavedDraft: (draft: SavedDraft) => void;
  handleDeleteSavedDraft: (id: string) => void;
  handleLockChampion: (champId: string, customSlot?: DraftSlot) => void;
  allUsedChampions: Set<string>;
  verticalBoardRoles: LaneConfig[];
  getRoleChampsForComp: (compName: string, role: RoleType, playerName?: string) => {
    player: any;
    S: PlayerChampionEntry[];
    A: PlayerChampionEntry[];
    B: PlayerChampionEntry[];
    C: PlayerChampionEntry[];
  };
  draftSearchInput: string;
  setDraftSearchInput: (s: string) => void;
  draftSearchMatches: Champion[];
  draftNotes: string;
  setDraftNotes: (notes: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  isDrafterAutoSync: boolean;
  setIsDrafterAutoSync: (val: boolean) => void;
  drafterSyncStatus: DrafterSyncStatus;
  drafterSocketStatus?: "disconnected" | "connecting" | "connected" | "error";
  drafterActionNotification?: string | null;
  isDrafterAutoForward?: boolean;
  setIsDrafterAutoForward?: (val: boolean) => void;
  isCreatingDrafterRoom?: boolean;
  handleCreateDrafterRoom?: () => Promise<any>;
  handleSendDrafterReady?: () => void;
  handleDisconnectDrafter?: () => void;
  lastDrafterSyncTime: Date | null;
  drafterLiveTime: number;
  fetchAndApplyDrafterLiveState: (roomId?: string) => Promise<boolean>;
  playerChampions: PlayerChampionEntry[];
}

export function LiveDraftArenaTab({
  ourSide,
  setOurSide,
  rivalName,
  setRivalName,
  matchResult,
  setMatchResult,
  selectedCompId,
  setSelectedCompId,
  compositions,
  currentComp,
  activeCompIds = [],
  handleToggleCompActive,
  handleActivateAllComps,
  handleDeactivateAllComps,
  bluePicks,
  blueBans,
  redPicks,
  redBans,
  activeSlot,
  setActiveSlot,
  currentTurnStep,
  handleNextTurnStep,
  handlePrevTurnStep,
  handleClearSlot,
  handleResetDraftBoard,
  handleCopyDraftSummary,
  handleSaveCurrentDraft,
  draftSaveNotification,
  draftsHistory,
  showHistoryModal,
  setShowHistoryModal,
  handleLoadSavedDraft,
  handleDeleteSavedDraft,
  handleLockChampion,
  allUsedChampions,
  verticalBoardRoles,
  getRoleChampsForComp,
  draftNotes,
  setDraftNotes,
  playerChampions,
  players = [],
  starterPlayers = [],
  drafterArenaMode = "builtin",
  setDrafterArenaMode,
  cleanDrafterIframeUrl = "",
  handleOpenDrafterPopout,
  drafterInputUrl = "",
  setDrafterInputUrl,
  drafterRoomUrl = "",
  handleSetDrafterRoomUrl,
  drafterSyncStatus = "idle",
  drafterSocketStatus = "disconnected",
  drafterActionNotification = null,
  isDrafterAutoForward = true,
  setIsDrafterAutoForward,
  isCreatingDrafterRoom = false,
  handleCreateDrafterRoom,
  handleSendDrafterReady,
  handleDisconnectDrafter,
  drafterLiveTime = 30,
}: LiveDraftArenaTabProps) {
  // Pestañas del selector inferior de campeones
  const [bottomTab, setBottomTab] = useState<"starters" | "adapted" | "catalog" | "counters">("starters");
  const [starterPrioFilter, setStarterPrioFilter] = useState<"ALL" | "FP" | "TIER_S_A" | "AVAILABLE">("ALL");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "TOP" | "JGL" | "MID" | "ADC" | "SUPP">("ALL");
  const [catalogSearch, setCatalogSearch] = useState<string>("");

  // Métricas tácticas en tiempo real
  const blueMetrics = useMemo(() => calculateCompMetrics(bluePicks), [bluePicks]);
  const redMetrics = useMemo(() => calculateCompMetrics(redPicks), [redPicks]);

  const ourPicks = ourSide === "BLUE" ? bluePicks : redPicks;
  const enemyPicks = ourSide === "BLUE" ? redPicks : bluePicks;

  // Determinar en qué fase de draft estamos (Fase 1 vs Fase 2)
  const totalPicksMade = [...bluePicks, ...redPicks].filter(Boolean).length;
  const isDraftPhase1 = totalPicksMade < 6; // Los primeros 3 picks de cada equipo

  // Cálculo de bans inteligentes y counters
  const smartBansData = useMemo(() => {
    return getSmartBans(enemyPicks, ourPicks, totalPicksMade >= 6 ? 12 : 0);
  }, [enemyPicks, ourPicks, totalPicksMade]);

  const rosterCounters = useMemo(() => {
    return getRosterCountersForEnemy(enemyPicks, playerChampions || []);
  }, [enemyPicks, playerChampions]);

  // Roles clasificados por Fase de Pick según la composición activa
  const phaseRoles = useMemo(() => {
    const p1: { role: RoleType; player: string; prio: PriorityLevel }[] = [];
    const p2: { role: RoleType; player: string; prio: PriorityLevel }[] = [];

    verticalBoardRoles.forEach((r) => {
      const prio = currentComp.role_priorities?.[r.role] || "Media";
      if (prio === "Alta") {
        p1.push({ role: r.role, player: r.player, prio });
      } else {
        p2.push({ role: r.role, player: r.player, prio });
      }
    });

    return { phase1: p1, phase2: p2 };
  }, [verticalBoardRoles, currentComp]);

  // Campeones adaptados a la compo actual filtrados por rol
  const adaptedChamps = useMemo(() => {
    const list: {
      entry: PlayerChampionEntry;
      role: RoleType;
      player: string;
      tier: "S" | "A" | "B" | "C";
      isFP: boolean;
      isLP: boolean;
      isRisky: boolean;
    }[] = [];

    verticalBoardRoles.forEach((lane) => {
      if (roleFilter !== "ALL" && lane.role !== roleFilter) return;
      const data = getRoleChampsForComp(currentComp.nombre, lane.role, lane.player);

      [...data.S, ...data.A, ...data.B].forEach((entry) => {
        const tag = entry.pick_tag || (entry.is_first_pickable ? "FP" : undefined);
        list.push({
          entry,
          role: lane.role,
          player: lane.player,
          tier: entry.tier,
          isFP: tag === "FP",
          isLP: tag === "LP",
          isRisky: tag === "Risky",
        });
      });
    });

    return list;
  }, [verticalBoardRoles, roleFilter, getRoleChampsForComp, currentComp]);

  // Pools de los 5 Titulares oficiales para la fase de picks (con First Picks FP, LP y Tiers)
  const starterPoolsData = useMemo(() => {
    const roles: RoleType[] = ["TOP", "JGL", "MID", "ADC", "SUPP"];
    const themes: Record<RoleType, {
      name: string;
      laneTitle: string;
      badgeBg: string;
      badgeBorder: string;
      badgeText: string;
      colBorder: string;
      headerBg: string;
      accentColor: string;
    }> = {
      TOP: {
        name: "TOP LANE",
        laneTitle: "Top Laner",
        badgeBg: "bg-amber-950/80",
        badgeBorder: "border-amber-500/40",
        badgeText: "text-amber-400",
        colBorder: "border-amber-900/30 hover:border-amber-600/50",
        headerBg: "from-amber-950/50 via-zinc-900 to-transparent",
        accentColor: "text-amber-400",
      },
      JGL: {
        name: "JUNGLA",
        laneTitle: "Jungler",
        badgeBg: "bg-emerald-950/80",
        badgeBorder: "border-emerald-500/40",
        badgeText: "text-emerald-400",
        colBorder: "border-emerald-900/30 hover:border-emerald-600/50",
        headerBg: "from-emerald-950/50 via-zinc-900 to-transparent",
        accentColor: "text-emerald-400",
      },
      MID: {
        name: "MID LANE",
        laneTitle: "Mid Laner",
        badgeBg: "bg-cyan-950/80",
        badgeBorder: "border-cyan-500/40",
        badgeText: "text-cyan-400",
        colBorder: "border-cyan-900/30 hover:border-cyan-600/50",
        headerBg: "from-cyan-950/50 via-zinc-900 to-transparent",
        accentColor: "text-cyan-400",
      },
      ADC: {
        name: "BOT CARRY",
        laneTitle: "ADC / Bot Laner",
        badgeBg: "bg-purple-950/80",
        badgeBorder: "border-purple-500/40",
        badgeText: "text-purple-400",
        colBorder: "border-purple-900/30 hover:border-purple-600/50",
        headerBg: "from-purple-950/50 via-zinc-900 to-transparent",
        accentColor: "text-purple-400",
      },
      SUPP: {
        name: "SUPPORT",
        laneTitle: "Support",
        badgeBg: "bg-rose-950/80",
        badgeBorder: "border-rose-500/40",
        badgeText: "text-rose-400",
        colBorder: "border-rose-900/30 hover:border-rose-600/50",
        headerBg: "from-rose-950/50 via-zinc-900 to-transparent",
        accentColor: "text-rose-400",
      },
    };

    return roles
      .filter((r) => roleFilter === "ALL" || roleFilter === r)
      .map((role) => {
        // Encontrar titular asignado para esta posición
        const starter =
          starterPlayers.find((p) => p.role === role) ||
          players.find((p) => p.role === role && p.isStarter) ||
          players.find((p) => p.role === role) ||
          verticalBoardRoles.find((v) => v.role === role) || {
            name: role,
            displayName: role,
            role,
            laneTitle: `${role} Laner`,
            signatureChamp: "Ornn",
            isStarter: true,
            color: "text-zinc-400",
          };

        const rawChamps = playerChampions.filter((pc) => pc.jugador === starter.name);

        const filtered = rawChamps.filter((c) => {
          const isFP = c.is_first_pickable === true || c.pick_tag === "FP";
          const isUsed = allUsedChampions.has(c.campeon_id.toLowerCase());

          if (starterPrioFilter === "FP" && !isFP) return false;
          if (starterPrioFilter === "TIER_S_A" && c.tier !== "S" && c.tier !== "A") return false;
          if (starterPrioFilter === "AVAILABLE" && isUsed) return false;
          return true;
        });

        const tierWeights: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };
        const sorted = [...filtered].sort((a, b) => {
          const wA = tierWeights[a.tier] || 0;
          const wB = tierWeights[b.tier] || 0;
          if (wA !== wB) return wB - wA;

          const fpA = a.is_first_pickable || a.pick_tag === "FP" ? 1 : 0;
          const fpB = b.is_first_pickable || b.pick_tag === "FP" ? 1 : 0;
          if (fpA !== fpB) return fpB - fpA;

          return a.campeon_id.localeCompare(b.campeon_id);
        });

        const fpCount = rawChamps.filter((c) => c.is_first_pickable || c.pick_tag === "FP").length;

        return {
          role,
          starter,
          champions: sorted,
          totalCount: rawChamps.length,
          fpCount,
          theme: themes[role],
        };
      });
  }, [starterPlayers, players, verticalBoardRoles, playerChampions, allUsedChampions, starterPrioFilter, roleFilter]);

  // Catálogo completo filtrado para el buscador inferior
  const filteredCatalog = useMemo(() => {
    const q = catalogSearch.trim().toLowerCase();
    return CHAMPIONS_CATALOG.filter((c) => {
      if (roleFilter !== "ALL" && !c.roles.includes(roleFilter)) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    });
  }, [catalogSearch, roleFilter]);

  return (
    <>
      {draftSaveNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-zinc-950 border-2 border-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-mono font-bold">{draftSaveNotification.message}</span>
          </div>
        </div>
      )}

      <div className="space-y-4 animate-in fade-in duration-300">
        {/* ========================================================================= */}
        {/* 1. TOP HEADER: CONTROLES DE SCRIM & ACCIONES                              */}
        {/* ========================================================================= */}
        <div className="bg-zinc-950 border border-purple-900/40 p-4 rounded-2xl shadow-xl space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="bg-purple-950 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-purple-500/30">
                  Void Lynx • Esports Tactical Assistant
                </span>
                <span className="text-zinc-500 text-xs font-mono">
                  Planificación por Fases de Pick • Counters en Vivo
                </span>
              </div>
              <h2 className="font-display font-black text-lg uppercase tracking-wider text-white flex items-center gap-2">
                <Swords className="h-5 w-5 text-purple-400" />
                <span>Asistente Táctico de Draft & Sala de Scrim</span>
              </h2>
            </div>

            {/* Acciones principales: Discord, Historial, Guardar, Reiniciar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyDraftSummary}
                title="Copiar resumen del draft para Discord"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-zinc-200 text-xs font-semibold transition-colors"
              >
                <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Discord</span>
              </button>

              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-purple-500 text-zinc-200 text-xs font-semibold transition-colors"
              >
                <History className="h-3.5 w-3.5 text-purple-400" />
                <span>Historial ({draftsHistory.length})</span>
              </button>

              <button
                type="button"
                onClick={handleSaveCurrentDraft}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all hover:scale-105"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Guardar Scrim</span>
              </button>

              <button
                type="button"
                onClick={handleResetDraftBoard}
                title="Limpiar todos los picks y bans de la mesa"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 text-xs transition-colors border border-zinc-800"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Limpiar</span>
              </button>
            </div>
          </div>

          {/* Fila de Configuración Limpia: Compo Objetivo, Lado, Rival, Resultado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center text-xs">
            {/* Composición Objetivo (4 cols) */}
            <div className="lg:col-span-4 flex items-center gap-2 bg-black/60 border border-purple-500/40 rounded-lg px-2.5 py-1.5">
              <Crosshair className="h-4 w-4 text-purple-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold block leading-none mb-0.5">
                  Composición Objetivo:
                </span>
                <select
                  value={selectedCompId}
                  onChange={(e) => setSelectedCompId(e.target.value)}
                  className="w-full bg-transparent text-white font-display font-black text-xs outline-none cursor-pointer truncate"
                >
                  {compositions.map((comp) => {
                    const isCompActive = activeCompIds.includes(comp.id);
                    return (
                      <option key={comp.id} value={comp.id} className="bg-zinc-900 text-white">
                        {isCompActive ? "✓ " : "✕ [DESCARTADA] "}
                        {comp.nombre} ({comp.enfoque})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Lado (3 cols) */}
            <div className="lg:col-span-3 flex gap-1 bg-black/60 border border-zinc-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setOurSide("BLUE")}
                className={`flex-1 py-1 rounded font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  ourSide === "BLUE"
                    ? "bg-blue-600 text-white shadow border border-blue-400"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-blue-300" />
                <span>LADO AZUL</span>
              </button>
              <button
                type="button"
                onClick={() => setOurSide("RED")}
                className={`flex-1 py-1 rounded font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  ourSide === "RED"
                    ? "bg-rose-600 text-white shadow border border-rose-400"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-rose-300" />
                <span>LADO ROJO</span>
              </button>
            </div>

            {/* Equipo Rival (3 cols) */}
            <div className="lg:col-span-3">
              <input
                type="text"
                value={rivalName}
                onChange={(e) => setRivalName(e.target.value)}
                placeholder="Equipo Rival (ej: KOI, Heretics)..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-semibold"
              />
            </div>

            {/* Resultado Scrim (2 cols) */}
            <div className="lg:col-span-2">
              <select
                value={matchResult}
                onChange={(e) => setMatchResult(e.target.value as any)}
                className={`w-full bg-zinc-900 border rounded-lg px-2 py-2 text-xs font-bold font-mono focus:outline-none transition-all ${
                  matchResult === "VICTORIA"
                    ? "text-emerald-400 border-emerald-500/50 bg-emerald-950/40"
                    : matchResult === "DERROTA"
                    ? "text-rose-400 border-rose-500/50 bg-rose-950/40"
                    : "text-zinc-300 border-zinc-800"
                }`}
              >
                <option value="PENDING">PENDIENTE</option>
                <option value="VICTORIA">VICTORIA</option>
                <option value="DERROTA">DERROTA</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1.5. BARRA DE CONTROL DRAFTER.LOL LIVE BRIDGE (ENLACE Y ENVÍO EN VIVO)   */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-zinc-950 via-purple-950/20 to-zinc-950 border border-purple-500/30 p-3.5 rounded-2xl shadow-xl space-y-3">
          {/* Fila superior: Estado de Conexión + Notificaciones + Toggles de Modo */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-2.5 border-b border-zinc-800/80">
            {/* Estado y Sala Actual */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Badge Estado Socket */}
              {drafterSocketStatus === "connected" || drafterSyncStatus === "connected" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  <span>CONECTADO A DRAFTER.LOL</span>
                </span>
              ) : drafterSocketStatus === "connecting" || drafterSyncStatus === "syncing" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold">
                  <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
                  <span>CONECTANDO A SALA...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-750 text-zinc-400 text-xs font-mono font-semibold">
                  <span className="h-2 w-2 rounded-full bg-zinc-600" />
                  <span>DRAFTER DESCONECTADO</span>
                </span>
              )}

              {/* ID de la sala y Link si está conectado */}
              {drafterRoomUrl && (
                <a
                  href={cleanDrafterIframeUrl || `https://drafter.lol/draft/${drafterRoomUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir sala en Drafter.lol en una pestaña nueva"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 hover:text-white text-xs font-mono transition-colors group"
                >
                  <span className="text-zinc-500 text-[10px]">Sala:</span>
                  <span className="font-bold text-purple-300 group-hover:underline">
                    {drafterRoomUrl.replace(/^https?:\/\/(www\.)?drafter\.lol\/(draft\/)?/, "").split("?")[0]?.slice(0, 14)}...
                  </span>
                  <ExternalLink className="h-3 w-3 text-zinc-400 group-hover:text-purple-400" />
                </a>
              )}

              {/* Tiempo en Vivo reportado por Drafter si hay */}
              {(drafterSocketStatus === "connected" || drafterSyncStatus === "connected") && drafterLiveTime > 0 && (
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                  <span className="text-zinc-600">•</span>
                  <span>Timer Drafter: <strong className="text-amber-300">{drafterLiveTime}s</strong></span>
                </span>
              )}

              {/* Notificación de Acción en Vivo (ej: "🚀 Transmitido a Drafter.lol: Jinx") */}
              {drafterActionNotification && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-400 text-purple-200 text-xs font-mono font-bold animate-in fade-in slide-in-from-left-2 duration-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                  <Zap className="h-3 w-3 text-amber-300 animate-pulse" />
                  <span>{drafterActionNotification}</span>
                </span>
              )}
            </div>

            {/* Controles de Vista & Modo Pantalla Dividida */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Reenvío automático toggle */}
              <button
                type="button"
                onClick={() => setIsDrafterAutoForward?.(!isDrafterAutoForward)}
                title="Al estar activo, cada pick o ban que selecciones en Void Lynx se enviará y lockeará inmediatamente a tu sala de Drafter.lol"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                  isDrafterAutoForward
                    ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isDrafterAutoForward ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-zinc-600"}`} />
                <span>Envío a Drafter: {isDrafterAutoForward ? "ACTIVO" : "PAUSADO"}</span>
              </button>

              {/* Selector de modo Pizarra vs Split Screen */}
              <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setDrafterArenaMode?.("builtin")}
                  className={`px-2.5 py-1 rounded font-mono font-bold transition-all cursor-pointer ${
                    drafterArenaMode === "builtin"
                      ? "bg-purple-600 text-white shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Pizarra
                </button>
                <button
                  type="button"
                  onClick={() => setDrafterArenaMode?.("split")}
                  title="Ver Void Lynx y Drafter.lol lado a lado en pantalla dividida"
                  className={`px-2.5 py-1 rounded font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    drafterArenaMode === "split"
                      ? "bg-purple-600 text-white shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>⚔️ Pantalla Dividida</span>
                </button>
              </div>

              {/* Abrir Popout en Drafter.lol */}
              <button
                type="button"
                onClick={handleOpenDrafterPopout}
                title="Abrir Drafter.lol en una ventana externa independiente"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              >
                <ExternalLink className="h-3 w-3 text-purple-400" />
                <span className="hidden sm:inline">Popout</span>
              </button>
            </div>
          </div>

          {/* Fila inferior: Input de sala, Conectar/Desconectar, Crear Sala Automática y Ready */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Input de URL o ID de sala */}
            <div className="relative flex-1">
              <input
                type="text"
                value={drafterInputUrl}
                onChange={(e) => setDrafterInputUrl?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && drafterInputUrl.trim()) {
                    handleSetDrafterRoomUrl?.(drafterInputUrl.trim());
                  }
                }}
                placeholder="Pega URL o ID de Drafter.lol (ej: https://drafter.lol/draft/41df... o 41df...)"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-20 py-2 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-purple-500"
              />
              {drafterInputUrl.trim() && (
                <button
                  type="button"
                  onClick={() => handleSetDrafterRoomUrl?.(drafterInputUrl.trim())}
                  className="absolute right-1 top-1 bottom-1 px-3 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-mono font-bold transition-colors cursor-pointer"
                >
                  Conectar
                </button>
              )}
            </div>

            {/* Si ya hay sala conectada, botón Desconectar */}
            {drafterRoomUrl && (
              <button
                type="button"
                onClick={handleDisconnectDrafter}
                className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500/50 text-zinc-400 hover:text-rose-400 text-xs font-mono font-semibold transition-colors shrink-0 cursor-pointer"
              >
                Desconectar
              </button>
            )}

            {/* ⚡ Crear Sala en Drafter.lol (Automática) */}
            <button
              type="button"
              onClick={handleCreateDrafterRoom}
              disabled={isCreatingDrafterRoom}
              title="Crea una sala competitiva en Drafter.lol automáticamente con Void Lynx vs Rival y conecta en 1 click"
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-mono font-bold shadow-md shadow-purple-950/40 transition-all hover:scale-[1.02] disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {isCreatingDrafterRoom ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Zap className="h-3.5 w-3.5 text-amber-300" />
              )}
              <span>{isCreatingDrafterRoom ? "Creando en Drafter..." : "⚡ Crear Sala en Drafter.lol"}</span>
            </button>

            {/* ★ Confirmar Listo / Ready (Solo visible cuando conectado) */}
            {(drafterSocketStatus === "connected" || drafterSyncStatus === "connected") && (
              <button
                type="button"
                onClick={handleSendDrafterReady}
                title="Enviar confirmación de Listo (Ready) a Drafter.lol"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono font-bold shadow-md shadow-emerald-950/30 transition-all hover:scale-[1.02] shrink-0 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                <span>★ Estoy Listo (Ready)</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTENEDOR PRINCIPAL: PIZARRA VOID LYNX [+ PREVIEW DRAFTER EN SPLIT]      */}
        {/* ========================================================================= */}
        <div className={drafterArenaMode === "split" ? "grid grid-cols-1 xl:grid-cols-12 gap-4 items-start" : "space-y-4"}>
          <div className={drafterArenaMode === "split" ? "xl:col-span-7 2xl:col-span-8 space-y-4" : "space-y-4"}>
            {/* ========================================================================= */}
            {/* 2. ÁRBOL DE COMPOSICIONES TÁCTICAS EN VIVO (TODAS EN GRANDE)              */}
            {/* ========================================================================= */}
            <div className="bg-zinc-950 border border-purple-900/50 p-4 rounded-2xl shadow-xl space-y-3">
              {/* Header de Viabilidad de Composiciones */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-zinc-800">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Swords className="h-5 w-5 text-purple-400" />
                    <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                      Composiciones Estratégicas // Árbol de Viabilidad en Vivo
                    </h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black border transition-all ${
                      activeCompIds.length === 0
                        ? "bg-rose-950/80 border-rose-500/50 text-rose-300"
                        : activeCompIds.length === compositions.length
                        ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                        : "bg-purple-950/80 border-purple-500/50 text-purple-300"
                    }`}
                  >
                    {activeCompIds.length} / {compositions.length} ACTIVAS Y VIABLES
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono hidden md:inline">
                    (Todas activas por defecto. Haz clic para descartar o reactivar según avance el draft)
                  </span>
                </div>

                {/* Botones de acción rápida: Activar Todas / Descartar Todas */}
                <div className="flex items-center gap-2">
                  {handleActivateAllComps && (
                    <button
                      type="button"
                      onClick={handleActivateAllComps}
                      title="Marcar todas las composiciones como activas y viables"
                      className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Activar Todas</span>
                    </button>
                  )}
                  {handleDeactivateAllComps && (
                    <button
                      type="button"
                      onClick={handleDeactivateAllComps}
                      title="Descartar todas las composiciones"
                      className="text-xs px-2.5 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 border border-rose-600/40 text-rose-300 font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <X className="h-3.5 w-3.5 text-rose-400" />
                      <span>Descartar Todas</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tarjetas EN GRANDE de cada composición */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {compositions.map((comp) => {
                  const isActive = activeCompIds.includes(comp.id);
                  const isSelected = comp.id === selectedCompId;

                  return (
                    <div
                      key={comp.id}
                      onClick={() => {
                        if (!isActive) {
                          handleToggleCompActive?.(comp.id);
                          setSelectedCompId(comp.id);
                        } else {
                          setSelectedCompId(comp.id);
                        }
                      }}
                      className={`group p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[140px] cursor-pointer select-none ${
                        !isActive
                          ? "bg-zinc-950/40 border-zinc-900/90 text-zinc-500 opacity-50 hover:opacity-85 shadow-none"
                          : isSelected
                          ? "bg-gradient-to-br from-purple-900/70 via-purple-950/90 to-zinc-950 border-purple-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.45)] ring-2 ring-purple-400/80 scale-[1.02]"
                          : "bg-zinc-950/80 border-purple-900/30 text-zinc-300 hover:border-purple-500/60 hover:bg-zinc-900/90 hover:scale-[1.01]"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                              !isActive
                                ? "bg-zinc-900 text-zinc-500 border border-zinc-800"
                                : "bg-purple-950 text-purple-300 border border-purple-500/40"
                            }`}
                          >
                            {comp.enfoque}
                          </span>

                          {/* Botón de toggle directo Activa / Descartada */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCompActive?.(comp.id);
                            }}
                            title={
                              isActive
                                ? "Haz clic para descartar esta compo de la partida"
                                : "Haz clic para reactivar esta compo"
                            }
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                              isActive
                                ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300 hover:bg-rose-950 hover:border-rose-500 hover:text-rose-300"
                                : "bg-rose-950/80 border-rose-500/40 text-rose-300 hover:bg-emerald-950 hover:border-emerald-500 hover:text-emerald-300"
                            }`}
                          >
                            {isActive ? (
                              <>
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>VIABLE</span>
                              </>
                            ) : (
                              <>
                                <span>✕</span>
                                <span>DESCARTADA</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div
                          className={`font-display font-black text-base uppercase tracking-wide leading-tight mb-1.5 ${
                            !isActive ? "line-through text-zinc-500" : "text-white"
                          }`}
                        >
                          {comp.nombre}
                        </div>

                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-2.5">
                          {comp.descripcion}
                        </p>
                      </div>

                      <div>
                        {/* First Picks Clave */}
                        {comp.first_pick_safe && comp.first_pick_safe.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-zinc-800/80">
                            <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">First Picks:</span>
                            {comp.first_pick_safe.slice(0, 4).map((c) => (
                              <span
                                key={c}
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono ${
                                  !isActive
                                    ? "bg-zinc-900 text-zinc-500 grayscale"
                                    : "bg-black/60 border border-purple-500/30 text-purple-200"
                                }`}
                              >
                                <img
                                  src={getChampionAvatar(c)}
                                  alt={c}
                                  className="h-3.5 w-3.5 rounded-full object-cover"
                                />
                                <span>{c}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Indicador de seleccionado en pizarra */}
                        {isSelected && isActive && (
                          <div className="mt-2 text-[9px] font-mono font-black text-purple-300 tracking-wider uppercase flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
                            <span>● ENFOQUE TÁCTICO EN PIZARRA</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 3. PANEL TÁCTICO: DETALLES DE LA COMPO OBJETIVO & PLAN DE FASES           */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Tarjeta Izquierda: Identidad de Composición & Counters a Vigilar (6 cols) */}
          <div className="lg:col-span-6 bg-zinc-950 border border-purple-900/40 rounded-2xl p-4 shadow-xl space-y-3 flex flex-col justify-between">
            <div>
              {!activeCompIds.includes(currentComp.id) && (
                <div className="mb-2.5 p-2 rounded-lg bg-rose-950/60 border border-rose-500/50 flex items-center justify-between text-xs text-rose-200">
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>Esta composición está marcada como DESCARTADA.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleCompActive?.(currentComp.id)}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-900/80 hover:bg-emerald-900 text-rose-200 hover:text-emerald-200 transition-colors cursor-pointer"
                  >
                    Reactivar
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                  <span className="font-display font-black text-sm uppercase tracking-wide text-white">
                    {currentComp.nombre}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                    {currentComp.enfoque}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  {currentComp.prioridad}
                </span>
              </div>

              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                {currentComp.descripcion}
              </p>
            </div>

            {/* Counters que amenazan nuestra composición */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-mono font-bold">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                <span>Amenazas & Counters a Nuestra Composición:</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                {currentComp.counters_descripcion}
              </p>

              {/* Chips de Campeones Counter a Banear */}
              {currentComp.counters_campeones.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[9px] font-mono text-zinc-500 font-bold">Peligro:</span>
                  {currentComp.counters_campeones.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-950/70 border border-rose-500/40 text-[10px] font-mono text-rose-200"
                    >
                      <img
                        src={getChampionAvatar(c)}
                        alt={c}
                        className="h-3.5 w-3.5 rounded-full object-cover"
                      />
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta Derecha: EL PLAN ESTRATÉGICO DE FASES DE PICK (6 cols) */}
          <div className="lg:col-span-6 bg-zinc-950 border border-purple-900/40 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-400" />
                <span className="font-display font-black text-sm uppercase tracking-wide text-white">
                  Plan de Fases de Pick
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
                <span className="text-zinc-400">FASE ACTUAL:</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  isDraftPhase1
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse"
                    : "bg-purple-950 text-purple-300 border border-purple-500/60 shadow-[0_0_8px_rgba(168,85,247,0.3)] animate-pulse"
                }`}>
                  {isDraftPhase1 ? "FASE 1 (Picks 1-3)" : "FASE 2 (Picks 4-5)"}
                </span>
              </div>
            </div>

            {/* Visualización FASE 1 vs FASE 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Bloque FASE 1: First Picks Seguros */}
              <div className={`p-3 rounded-xl border transition-all ${
                isDraftPhase1
                  ? "bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30"
                  : "bg-black/40 border-zinc-800 opacity-70"
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-display font-black text-xs uppercase text-emerald-400 flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    FASE 1 • PICKS 1 A 3
                  </span>
                  <span className="text-[9px] font-mono px-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                    PRIO ALTA
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mb-2 leading-tight">
                  Blind picks seguros sin counters duros para asegurar power-picks sin revelar la estrategia.
                </p>

                {/* Roles a priorizar en Fase 1 */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[9px] font-mono text-zinc-400">Roles sugeridos:</span>
                    {phaseRoles.phase1.map((r) => (
                      <span key={r.role} className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-[9px] font-mono font-bold">
                        {r.role} ({r.player})
                      </span>
                    ))}
                  </div>

                  {/* Campeones seguros de blind-pick */}
                  {currentComp.first_pick_safe.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-emerald-900/30">
                      <span className="text-[9px] font-mono text-zinc-400">First Picks:</span>
                      {currentComp.first_pick_safe.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-300 bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          <img src={getChampionAvatar(c)} alt={c} className="h-3 w-3 rounded-full object-cover" />
                          <span>{c}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bloque FASE 2: Counterpicks & Respuestas */}
              <div className={`p-3 rounded-xl border transition-all ${
                !isDraftPhase1
                  ? "bg-purple-950/30 border-purple-500/60 ring-1 ring-purple-500/30"
                  : "bg-black/40 border-zinc-800 opacity-70"
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-display font-black text-xs uppercase text-purple-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    FASE 2 • PICKS 4 Y 5
                  </span>
                  <span className="text-[9px] font-mono px-1 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-bold">
                    COUNTERPICK
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mb-2 leading-tight">
                  Guardar estos roles para responder a lo que el rival haya elegido y ganar el matchup decisivo.
                </p>

                {/* Roles a guardar para Fase 2 */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[9px] font-mono text-zinc-400">Roles de respuesta:</span>
                    {phaseRoles.phase2.map((r) => (
                      <span key={r.role} className="px-1.5 py-0.2 rounded bg-purple-950 border border-purple-500/50 text-purple-200 text-[9px] font-mono font-bold">
                        {r.role} ({r.player})
                      </span>
                    ))}
                  </div>

                  <span className="text-[9px] text-zinc-500 font-mono block pt-1 border-t border-purple-900/30">
                    💡 Evita blind-pickear estos roles si el enemigo aún no los ha mostrado.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MESA DE DRAFT BROADCAST HORIZONTAL: CAMPEONES GRANDES                 */}
        {/* ========================================================================= */}
        <div className="bg-zinc-950 border border-purple-900/40 rounded-2xl p-4 shadow-2xl space-y-4">
          {/* ===================================================================== */}
          {/* FILA SUPERIOR: LADO AZUL (PICKS GRANDES B1 - B5)                      */}
          {/* ===================================================================== */}
          <div className={`p-3.5 rounded-2xl border-2 transition-all ${
            ourSide === "BLUE"
              ? "bg-blue-950/20 border-blue-500/70 shadow-lg shadow-blue-950/30"
              : "bg-zinc-900/40 border-zinc-800"
          }`}>
            {/* Header Lado Azul: Nombre + Bans + Daño */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-3 border-b border-blue-900/40">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse" />
                <span className="font-display font-black text-sm uppercase text-blue-400 tracking-wider">
                  {ourSide === "BLUE" ? "VOID LYNX (AZUL)" : `${rivalName || "RIVAL"} (AZUL)`}
                </span>
                {ourSide === "BLUE" && (
                  <span className="bg-blue-950 border border-blue-400 text-blue-300 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                    NOSOTROS
                  </span>
                )}
                <span className="text-xs font-mono text-zinc-400 font-bold">
                  ({bluePicks.filter(Boolean).length}/5 Picks)
                </span>
              </div>

              {/* Bans Azul (5 Slots compactos) */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase mr-1">Bans:</span>
                {blueBans.map((ban, idx) => {
                  const isActive = activeSlot.side === "blue" && activeSlot.type === "ban" && activeSlot.index === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlot({ side: "blue", type: "ban", index: idx })}
                      className={`h-8 w-8 rounded-lg border overflow-hidden transition-all relative ${
                        isActive
                          ? "border-blue-400 ring-2 ring-blue-400 bg-blue-950 scale-105"
                          : ban
                          ? "border-blue-900/60 bg-zinc-900"
                          : "border-dashed border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                      }`}
                      title={ban ? `Ban: ${ban}` : `Asignar Ban Azul #${idx + 1}`}
                    >
                      {ban ? (
                        <>
                          <img src={getChampionAvatar(ban)} alt={ban} className="w-full h-full object-cover grayscale brightness-75" />
                          <div className="absolute inset-0 bg-blue-950/50 flex items-center justify-center">
                            <span className="text-blue-400 font-bold text-[10px]">✕</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-[9px] font-mono text-zinc-600 font-bold">B{idx + 1}</span>
                      )}
                    </button>
                  );
                })}

                {/* Mini Balance Daño Azul */}
                <div className="ml-3 pl-3 border-l border-blue-900/40 text-[10px] font-mono hidden md:flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">{blueMetrics.adPercent}% AD</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-sky-400 font-bold">{blueMetrics.apPercent}% AP</span>
                </div>
              </div>
            </div>

            {/* 5 Cartas GRANDES Horizontales de Picks Azul (B1 - B5) */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {bluePicks.map((pick, idx) => {
                const isActive = activeSlot.side === "blue" && activeSlot.type === "pick" && activeSlot.index === idx;
                const champ = findChampion(pick);
                const isPhaseOneSlot = idx < 3;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveSlot({ side: "blue", type: "pick", index: idx })}
                    className={`rounded-xl border-2 p-2.5 flex flex-col justify-between cursor-pointer transition-all relative min-h-[110px] ${
                      isActive
                        ? "border-blue-400 bg-blue-950/60 ring-2 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] -translate-y-1"
                        : pick
                        ? "border-blue-900/50 bg-zinc-900/90 hover:border-blue-500/60"
                        : "border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                    }`}
                  >
                    {/* Header del Slot */}
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                      <span className="text-blue-400">PICK B{idx + 1}</span>
                      <span className={`text-[8px] px-1 rounded uppercase ${
                        isPhaseOneSlot ? "bg-emerald-950 text-emerald-300" : "bg-purple-950 text-purple-300"
                      }`}>
                        {isPhaseOneSlot ? "Fase 1" : "Fase 2"}
                      </span>
                    </div>

                    {/* Contenido del Pick: Avatar Grande + Nombre */}
                    {pick ? (
                      <div className="flex items-center gap-2.5 my-auto">
                        <img
                          src={getChampionAvatar(pick)}
                          alt={pick}
                          className="h-12 w-12 rounded-xl border border-blue-400/60 object-cover shadow-lg shrink-0"
                        />
                        <div className="min-w-0 flex-1 truncate">
                          <span className="font-display font-black text-sm text-white block truncate">
                            {champ ? champ.name : pick}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono block">
                            {champ?.roles.join(" • ") || champ?.category || "Champion"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto text-center py-2">
                        <span className="text-xs font-mono text-zinc-500 italic block">
                          {isActive ? "👉 Selecciona abajo" : `+ Clic para B${idx + 1}`}
                        </span>
                      </div>
                    )}

                    {/* Footer / Botón Limpiar */}
                    {pick && (
                      <div className="flex justify-end pt-1 border-t border-blue-900/20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearSlot("blue", "pick", idx);
                          }}
                          className="text-zinc-500 hover:text-rose-400 text-[10px] font-mono flex items-center gap-1 transition-colors"
                          title="Quitar campeón"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                          <span>Quitar</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* BARRA CENTRAL DE TURNO & SECUENCIA BROADCAST                           */}
          {/* ===================================================================== */}
          <div className="bg-zinc-900/90 border border-purple-900/50 rounded-xl p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            {/* Botón Turno Anterior */}
            <button
              type="button"
              onClick={handlePrevTurnStep}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs font-bold transition-all flex items-center gap-1 shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Turno Ant.</span>
            </button>

            {/* Banner Central de Turno */}
            <div className="flex-1 flex flex-wrap items-center justify-center gap-2.5 text-center min-w-0">
              {currentTurnStep ? (
                <div className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 shadow-lg ${
                  currentTurnStep.side === "blue"
                    ? "bg-blue-950 border-blue-400 text-blue-100 shadow-blue-950/50"
                    : "bg-rose-950 border-rose-400 text-rose-100 shadow-rose-950/50"
                }`}>
                  <span className={`h-2.5 w-2.5 rounded-full animate-ping shrink-0 ${
                    currentTurnStep.side === "blue" ? "bg-blue-400" : "bg-rose-400"
                  }`} />
                  <span className="font-mono text-xs uppercase font-bold text-zinc-300">
                    {currentTurnStep.ourTurn ? "★ TU TURNO:" : "TURNO RIVAL:"}
                  </span>
                  <span className="font-display font-black text-sm uppercase tracking-wide">
                    {currentTurnStep.label}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-500/40">
                  ✓ DRAFT OFICIAL COMPLETADO
                </span>
              )}

              {/* Indicador de Slot Seleccionado */}
              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border font-bold shrink-0 ${
                activeSlot.side === "blue"
                  ? "bg-blue-950 text-blue-300 border-blue-500/50"
                  : "bg-rose-950 text-rose-300 border-rose-500/50"
              }`}>
                SLOT ACTIVO: {activeSlot.side.toUpperCase()} {activeSlot.type.toUpperCase()} #{activeSlot.index + 1}
              </span>
            </div>

            {/* Botón Siguiente Turno */}
            <button
              type="button"
              onClick={handleNextTurnStep}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs font-bold transition-all flex items-center gap-1 shrink-0"
            >
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* ===================================================================== */}
          {/* FILA INFERIOR: LADO ROJO (PICKS GRANDES R1 - R5)                      */}
          {/* ===================================================================== */}
          <div className={`p-3.5 rounded-2xl border-2 transition-all ${
            ourSide === "RED"
              ? "bg-rose-950/20 border-rose-500/70 shadow-lg shadow-rose-950/30"
              : "bg-zinc-900/40 border-zinc-800"
          }`}>
            {/* Header Lado Rojo: Nombre + Bans + Daño */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-3 border-b border-rose-900/40">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse" />
                <span className="font-display font-black text-sm uppercase text-rose-400 tracking-wider">
                  {ourSide === "RED" ? "VOID LYNX (ROJO)" : `${rivalName || "RIVAL"} (ROJO)`}
                </span>
                {ourSide === "RED" && (
                  <span className="bg-rose-950 border border-rose-400 text-rose-300 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                    NOSOTROS
                  </span>
                )}
                <span className="text-xs font-mono text-zinc-400 font-bold">
                  ({redPicks.filter(Boolean).length}/5 Picks)
                </span>
              </div>

              {/* Bans Rojo (5 Slots compactos) */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase mr-1">Bans:</span>
                {redBans.map((ban, idx) => {
                  const isActive = activeSlot.side === "red" && activeSlot.type === "ban" && activeSlot.index === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlot({ side: "red", type: "ban", index: idx })}
                      className={`h-8 w-8 rounded-lg border overflow-hidden transition-all relative ${
                        isActive
                          ? "border-rose-400 ring-2 ring-rose-400 bg-rose-950 scale-105"
                          : ban
                          ? "border-rose-900/60 bg-zinc-900"
                          : "border-dashed border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                      }`}
                      title={ban ? `Ban: ${ban}` : `Asignar Ban Rojo #${idx + 1}`}
                    >
                      {ban ? (
                        <>
                          <img src={getChampionAvatar(ban)} alt={ban} className="w-full h-full object-cover grayscale brightness-75" />
                          <div className="absolute inset-0 bg-rose-950/50 flex items-center justify-center">
                            <span className="text-rose-400 font-bold text-[10px]">✕</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-[9px] font-mono text-zinc-600 font-bold">R{idx + 1}</span>
                      )}
                    </button>
                  );
                })}

                {/* Mini Balance Daño Rojo */}
                <div className="ml-3 pl-3 border-l border-rose-900/40 text-[10px] font-mono hidden md:flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">{redMetrics.adPercent}% AD</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-sky-400 font-bold">{redMetrics.apPercent}% AP</span>
                </div>
              </div>
            </div>

            {/* 5 Cartas GRANDES Horizontales de Picks Rojo (R1 - R5) */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {redPicks.map((pick, idx) => {
                const isActive = activeSlot.side === "red" && activeSlot.type === "pick" && activeSlot.index === idx;
                const champ = findChampion(pick);
                const isPhaseOneSlot = idx < 3;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveSlot({ side: "red", type: "pick", index: idx })}
                    className={`rounded-xl border-2 p-2.5 flex flex-col justify-between cursor-pointer transition-all relative min-h-[110px] ${
                      isActive
                        ? "border-rose-400 bg-rose-950/60 ring-2 ring-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] -translate-y-1"
                        : pick
                        ? "border-rose-900/50 bg-zinc-900/90 hover:border-rose-500/60"
                        : "border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                    }`}
                  >
                    {/* Header del Slot */}
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                      <span className="text-rose-400">PICK R{idx + 1}</span>
                      <span className={`text-[8px] px-1 rounded uppercase ${
                        isPhaseOneSlot ? "bg-emerald-950 text-emerald-300" : "bg-purple-950 text-purple-300"
                      }`}>
                        {isPhaseOneSlot ? "Fase 1" : "Fase 2"}
                      </span>
                    </div>

                    {/* Contenido del Pick: Avatar Grande + Nombre */}
                    {pick ? (
                      <div className="flex items-center gap-2.5 my-auto">
                        <img
                          src={getChampionAvatar(pick)}
                          alt={pick}
                          className="h-12 w-12 rounded-xl border border-rose-400/60 object-cover shadow-lg shrink-0"
                        />
                        <div className="min-w-0 flex-1 truncate">
                          <span className="font-display font-black text-sm text-white block truncate">
                            {champ ? champ.name : pick}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono block">
                            {champ?.roles.join(" • ") || champ?.category || "Champion"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto text-center py-2">
                        <span className="text-xs font-mono text-zinc-500 italic block">
                          {isActive ? "👉 Selecciona abajo" : `+ Clic para R${idx + 1}`}
                        </span>
                      </div>
                    )}

                    {/* Footer / Botón Limpiar */}
                    {pick && (
                      <div className="flex justify-end pt-1 border-t border-rose-900/20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearSlot("red", "pick", idx);
                          }}
                          className="text-zinc-500 hover:text-rose-400 text-[10px] font-mono flex items-center gap-1 transition-colors"
                          title="Quitar campeón"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                          <span>Quitar</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. ABAJO DE TODO: PANEL DE SELECCIÓN DE CAMPEONES                         */}
        {/* ========================================================================= */}
        <div className="bg-zinc-950 border border-purple-900/40 rounded-2xl p-4 shadow-2xl space-y-3.5">
          {/* Header con Switcher de Pestañas y Filtro de Carril */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            {/* Pestañas Principales */}
            <div className="flex flex-wrap items-center gap-1 bg-black/60 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setBottomTab("starters")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  bottomTab === "starters"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span>🌟 Pools 5 Titulares (FP / LP)</span>
              </button>

              <button
                type="button"
                onClick={() => setBottomTab("adapted")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  bottomTab === "adapted"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Adaptados a {currentComp.nombre}</span>
              </button>

              <button
                type="button"
                onClick={() => setBottomTab("catalog")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  bottomTab === "catalog"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                <span>Todos los Campeones</span>
              </button>

              <button
                type="button"
                onClick={() => setBottomTab("counters")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  bottomTab === "counters"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5 text-emerald-400" />
                <span>Counters Detectados ({rosterCounters.length})</span>
              </button>
            </div>

            {/* Filtros de Carril [TODOS • TOP • JGL • MID • ADC • SUPP] */}
            <div className="flex items-center gap-1">
              {(["ALL", "TOP", "JGL", "MID", "ADC", "SUPP"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all border cursor-pointer ${
                    roleFilter === r
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                  }`}
                >
                  {r === "ALL" ? "TODOS" : r}
                </button>
              ))}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* PESTAÑA PRINCIPAL: POOLS DE LOS 5 TITULARES (FP / LP)                 */}
          {/* ===================================================================== */}
          {bottomTab === "starters" && (
            <div className="space-y-3.5">
              {/* Banner de Fase Táctica con Asesoría de Blind/First-Pick */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border bg-zinc-900/90 border-purple-900/40">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isDraftPhase1
                      ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-400"
                      : "bg-purple-950/80 border border-purple-500/50 text-purple-400"
                  }`}>
                    {isDraftPhase1 ? <CheckCircle2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-xs uppercase tracking-wider text-white">
                        {isDraftPhase1 ? "Fase 1 de Picks (B1-B3 / R1-R3)" : "Fase 2 de Picks (B4-B5 / R4-R5)"}
                      </span>
                      <span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                        isDraftPhase1
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : "bg-purple-950 text-purple-300 border border-purple-500/40"
                      }`}>
                        {isDraftPhase1 ? "PRIORIDAD: FIRST PICKS (FP)" : "PRIORIDAD: COUNTERS (LP)"}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {isDraftPhase1
                        ? "Picks seguros a ciegas: no revelan tu estrategia ni tienen counters duros. Busca etiquetas ✓ FP SEGURO."
                        : "Castiga el draft rival con respuestas directas LP COUNTER o completa la sinergia de tu composición."}
                    </p>
                  </div>
                </div>

                {/* Filtros Rápidos de la Pool */}
                <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setStarterPrioFilter("ALL")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                      starterPrioFilter === "ALL"
                        ? "bg-zinc-200 text-black border-white shadow"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setStarterPrioFilter("FP")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border flex items-center gap-1 ${
                      starterPrioFilter === "FP"
                        ? "bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/30"
                        : "bg-emerald-950/60 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/50"
                    }`}
                  >
                    <span>✓</span> Solo FP Seguros
                  </button>
                  <button
                    type="button"
                    onClick={() => setStarterPrioFilter("TIER_S_A")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                      starterPrioFilter === "TIER_S_A"
                        ? "bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30"
                        : "bg-amber-950/60 text-amber-300 border-amber-600/40 hover:bg-amber-900/50"
                    }`}
                  >
                    Tier S & A
                  </button>
                  <button
                    type="button"
                    onClick={() => setStarterPrioFilter("AVAILABLE")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                      starterPrioFilter === "AVAILABLE"
                        ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/40"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    Solo Disponibles
                  </button>
                </div>
              </div>

              {/* Grid de las 5 Columnas de Titulares */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {starterPoolsData.map(({ role, starter, champions, totalCount, fpCount, theme }) => {
                  return (
                    <div
                      key={role}
                      className={`bg-zinc-900/70 border ${theme.colBorder} rounded-xl p-2.5 flex flex-col justify-between transition-all shadow-xl`}
                    >
                      {/* Cabecera del Carril y Titular */}
                      <div className={`pb-2 mb-2 border-b border-zinc-800 bg-gradient-to-b ${theme.headerBg} -mx-2.5 -mt-2.5 p-2.5 rounded-t-xl`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} flex items-center gap-1 shadow`}>
                            <RoleIconOnly role={role} size="sm" />
                            <span>{theme.name}</span>
                          </span>

                          <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-500/40 px-1.5 py-0.5 rounded flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{fpCount} FP</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <img
                            src={getChampionAvatar(starter.signatureChamp)}
                            alt={starter.displayName}
                            className="h-8 w-8 rounded-lg object-cover border border-purple-500/40 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <Crown className="h-3 w-3 text-amber-400 shrink-0" />
                              <span className="font-display font-black text-xs text-white truncate block">
                                {starter.displayName}
                              </span>
                            </div>
                            <span className="text-[9px] text-zinc-400 font-mono block truncate">
                              Titular • {totalCount} picks
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Lista de Campeones del Titular */}
                      <div className="space-y-1.5 flex-1 max-h-[380px] overflow-y-auto pr-0.5">
                        {champions.length === 0 ? (
                          <div className="p-4 text-center text-zinc-500 text-xs font-mono">
                            Sin campeones con este filtro
                          </div>
                        ) : (
                          champions.map((champ) => {
                            const isUsed = allUsedChampions.has(champ.campeon_id.toLowerCase());
                            const isFP = champ.is_first_pickable === true || champ.pick_tag === "FP";
                            const isLP = champ.pick_tag === "LP";
                            const isRisky = champ.pick_tag === "Risky";

                            const isPickedBlue = bluePicks.includes(champ.campeon_id);
                            const isPickedRed = redPicks.includes(champ.campeon_id);
                            const isBanned = [...blueBans, ...redBans].includes(champ.campeon_id);

                            return (
                              <button
                                key={champ.id}
                                type="button"
                                disabled={isUsed}
                                onClick={() => handleLockChampion(champ.campeon_id)}
                                title={
                                  isUsed
                                    ? `${champ.campeon_id} ya se encuentra en mesa (Pick/Ban)`
                                    : `Lockear ${champ.campeon_id} en ${activeSlot.side.toUpperCase()} ${activeSlot.type.toUpperCase()} #${activeSlot.index + 1}`
                                }
                                className={`w-full p-1.5 rounded-lg border text-left flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                                  isUsed
                                    ? "bg-zinc-950/40 border-zinc-800/60 opacity-40 cursor-not-allowed"
                                    : isFP
                                    ? "bg-zinc-900/90 hover:bg-emerald-950/50 border-zinc-800 hover:border-emerald-400 hover:shadow-md hover:scale-[1.02]"
                                    : "bg-zinc-900/70 hover:bg-zinc-800 border-zinc-800 hover:border-purple-400 hover:shadow-md hover:scale-[1.02]"
                                }`}
                              >
                                {/* Avatar + Nombre + Tier */}
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <div className="relative shrink-0">
                                    <img
                                      src={getChampionAvatar(champ.campeon_id)}
                                      alt={champ.campeon_id}
                                      className={`h-7 w-7 rounded-md object-cover ${
                                        isUsed
                                          ? "grayscale"
                                          : isFP
                                          ? "border-2 border-emerald-400 ring-1 ring-emerald-500/30"
                                          : "border border-zinc-700"
                                      }`}
                                    />
                                    {isUsed && (
                                      <div className="absolute inset-0 bg-black/60 rounded-md flex items-center justify-center">
                                        <Lock className="h-3 w-3 text-zinc-400" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1">
                                      <span className="font-bold text-xs text-white truncate block">
                                        {champ.campeon_id}
                                      </span>
                                      <span
                                        className={`text-[8px] font-black px-1 rounded font-mono shrink-0 ${
                                          champ.tier === "S"
                                            ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                                            : champ.tier === "A"
                                            ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                                            : "bg-zinc-800 text-zinc-400"
                                        }`}
                                      >
                                        {champ.tier}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Pick Tag / Estado Badge */}
                                <div className="shrink-0 flex items-center">
                                  {isPickedBlue ? (
                                    <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40">
                                      AZUL
                                    </span>
                                  ) : isPickedRed ? (
                                    <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
                                      ROJO
                                    </span>
                                  ) : isBanned ? (
                                    <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                                      BAN
                                    </span>
                                  ) : isFP ? (
                                    <span className="text-[8px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)] flex items-center gap-0.5">
                                      <span>✓</span> FP
                                    </span>
                                  ) : isLP ? (
                                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                                      LP
                                    </span>
                                  ) : isRisky ? (
                                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                                      RISK
                                    </span>
                                  ) : null}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* PESTAÑA 2: CAMPEONES ADAPTADOS A LA COMPOSICIÓN                       */}
          {/* ===================================================================== */}
          {/* ===================================================================== */}
          {bottomTab === "adapted" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>
                  Mostrando <strong className="text-white">{adaptedChamps.length}</strong> opciones del roster de Void Lynx para esta compo:
                </span>
                <span className="text-[10px]">
                  Click en cualquier campeón para lockearlo en {activeSlot.side.toUpperCase()} {activeSlot.type.toUpperCase()} #{activeSlot.index + 1}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {adaptedChamps.map(({ entry, role, player, tier, isFP, isLP, isRisky }) => {
                  const isUsed = allUsedChampions.has(entry.campeon_id.toLowerCase());

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      disabled={isUsed}
                      onClick={() => handleLockChampion(entry.campeon_id)}
                      title={
                        isUsed
                          ? `${entry.campeon_id} ya está en la mesa`
                          : `Lockear ${entry.campeon_id} en ${activeSlot.side.toUpperCase()} ${activeSlot.type.toUpperCase()} #${activeSlot.index + 1}`
                      }
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all relative group cursor-pointer ${
                        isUsed
                          ? "bg-zinc-900/30 border-zinc-800 opacity-40 cursor-not-allowed"
                          : "bg-zinc-900/70 hover:bg-zinc-850 border-zinc-800 hover:border-purple-400 shadow hover:scale-105 active:scale-95"
                      }`}
                    >
                      {/* Avatar del Campeón */}
                      <div className="relative mb-1">
                        <img
                          src={getChampionAvatar(entry.campeon_id)}
                          alt={entry.campeon_id}
                          className={`h-11 w-11 rounded-lg object-cover ${
                            isUsed
                              ? "grayscale"
                              : isFP
                              ? "border-2 border-emerald-400 ring-2 ring-emerald-500/30"
                              : isLP
                              ? "border-2 border-purple-400"
                              : isRisky
                              ? "border-2 border-amber-400"
                              : "border border-zinc-700"
                          }`}
                        />
                        {/* Badge de Fase / Tag */}
                        {isFP ? (
                          <span
                            title="First Pick Seguro en Fase 1"
                            className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[7px] font-black px-1 rounded shadow"
                          >
                            FP
                          </span>
                        ) : isLP ? (
                          <span
                            title="Late Pick / Counter en Fase 2"
                            className="absolute -top-1 -right-1 bg-purple-500 text-white text-[7px] font-black px-1 rounded shadow"
                          >
                            LP
                          </span>
                        ) : isRisky ? (
                          <span
                            title="Arriesgado a ciegas"
                            className="absolute -top-1 -right-1 bg-amber-500 text-black text-[7px] font-black px-1 rounded shadow"
                          >
                            R
                          </span>
                        ) : null}

                        {isUsed && (
                          <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                            <Lock className="h-4 w-4 text-zinc-400" />
                          </div>
                        )}
                      </div>

                      <span className="font-bold text-xs text-white truncate w-full">
                        {entry.campeon_id}
                      </span>

                      <div className="flex items-center gap-1 mt-0.5 text-[8px] font-mono">
                        <span className={`px-1 rounded font-black ${
                          tier === "S"
                            ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                            : tier === "A"
                            ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                            : "bg-sky-950 text-sky-300 border border-sky-500/40"
                        }`}>
                          T{tier}
                        </span>
                        <span className="text-zinc-400 font-bold">{role}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* PESTAÑA 2: CATÁLOGO COMPLETO DE TODOS LOS CAMPEONES                   */}
          {/* ===================================================================== */}
          {bottomTab === "catalog" && (
            <div className="space-y-2.5">
              {/* Buscador de Texto */}
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2">
                <Search className="h-4 w-4 text-purple-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Escribe el nombre de cualquier campeón (ej: Ahri, K'Sante, Lillia)..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white font-mono text-xs outline-none placeholder-zinc-500"
                />
                {catalogSearch && (
                  <button
                    type="button"
                    onClick={() => setCatalogSearch("")}
                    className="text-zinc-400 hover:text-white text-xs px-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Grid Completo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {filteredCatalog.map((c) => {
                  const isUsed = allUsedChampions.has(c.id.toLowerCase());

                  return (
                    <button
                      key={c.id}
                      type="button"
                      disabled={isUsed}
                      onClick={() => handleLockChampion(c.name)}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        isUsed
                          ? "bg-zinc-900/30 border-zinc-800 opacity-40 cursor-not-allowed"
                          : "bg-zinc-900/70 hover:bg-zinc-800 border-zinc-800 hover:border-purple-400 shadow hover:scale-105 active:scale-95"
                      }`}
                    >
                      <img
                        src={getChampionAvatar(c.id)}
                        alt={c.name}
                        className={`h-11 w-11 rounded-lg object-cover mb-1 ${isUsed ? "grayscale" : "border border-zinc-700"}`}
                      />
                      <span className="font-bold text-xs text-white truncate w-full">
                        {c.name}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-mono">
                        {c.roles.join(" • ")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* PESTAÑA 3: COUNTERS DETECTADOS & BANS INTELIGENTES                     */}
          {/* ===================================================================== */}
          {bottomTab === "counters" && (
            <div className="space-y-3">
              {/* Sección 1: Counters Directos a los Picks Rivales */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-purple-300 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-emerald-400" />
                    COUNTERS DEL ROSTER DE VOID LYNX
                  </span>
                  <span className="text-[10px] text-zinc-400">Calculado según picks rivales</span>
                </div>

                {rosterCounters.length === 0 ? (
                  <div className="p-4 text-center text-xs font-mono text-zinc-400 bg-black/40 rounded-lg border border-zinc-800/80">
                    {enemyPicks.filter(Boolean).length === 0
                      ? "Esperando picks del rival... En cuanto el rival lockee un campeón en la mesa, aquí se mostrarán los counters que nuestros jugadores (Kaserolo, Tamudor, Upss, arnoop88, Liber) dominan para destrozarles la línea."
                      : "No se detectaron counters directos críticos de kit en el roster actual contra las selecciones rivales."}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {rosterCounters.map(({ enemyChamp, ourCounters }) => (
                      <div key={enemyChamp} className="bg-black/50 p-2 rounded-xl border border-rose-900/40 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={getChampionAvatar(enemyChamp)}
                            alt={enemyChamp}
                            className="h-6 w-6 rounded border border-rose-500/60 object-cover"
                          />
                          <span className="text-xs font-bold font-mono text-rose-300">
                            Rival eligió {enemyChamp}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-mono">
                            — Opciones con ventaja de línea de nuestro roster:
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {ourCounters.map(({ playerChamp, reason }) => (
                            <div
                              key={playerChamp.id}
                              className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-900/90 border border-emerald-500/40 hover:border-emerald-400 transition-all"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={getChampionAvatar(playerChamp.campeon_id)}
                                  alt={playerChamp.campeon_id}
                                  className="h-7 w-7 rounded object-cover border border-emerald-500/50"
                                />
                                <div className="min-w-0 truncate">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white truncate">
                                      {playerChamp.campeon_id}
                                    </span>
                                    <span className="text-[8px] font-mono px-1 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                                      {playerChamp.jugador}
                                    </span>
                                    <span className="text-[8px] font-mono px-1 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/30">
                                      T{playerChamp.tier}
                                    </span>
                                  </div>
                                  <span className="text-[8px] text-zinc-400 font-mono truncate block">
                                    {reason}
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleLockChampion(playerChamp.campeon_id)}
                                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[9px] font-bold shadow transition-all shrink-0 ml-1"
                              >
                                Lockear
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sección 2: Bans Recomendados */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-purple-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    BANS RECOMENDADOS SEGÚN FASE
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-zinc-400 font-mono">Líneas rivales sin pickear:</span>
                    {smartBansData.missingEnemyRoles.map((role) => (
                      <span key={role} className="px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[8px] font-mono font-bold">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {smartBansData.recommendedBans.map((b) => (
                    <div
                      key={b.champion}
                      className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-zinc-800 hover:border-purple-500 transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={getChampionAvatar(b.champion)}
                          alt={b.champion}
                          className="h-7 w-7 rounded object-cover border border-rose-500/50"
                        />
                        <div className="min-w-0 truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white truncate">
                              {b.champion}
                            </span>
                            <span className="text-[8px] font-mono px-1 rounded bg-zinc-800 text-zinc-300">
                              {b.role}
                            </span>
                          </div>
                          <span className="text-[8px] text-zinc-400 font-mono truncate block">
                            {b.reason}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleLockChampion(b.champion)}
                        className="px-2 py-1 rounded bg-rose-700 hover:bg-rose-600 text-white font-mono text-[9px] font-bold shadow transition-all shrink-0 ml-1"
                      >
                        Banear
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 5. NOTAS TÁCTICAS DEL DRAFT (INFERIOR COMPACTO)                            */}
        {/* ========================================================================= */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 shadow-lg">
          <label className="block text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
            Notas Tácticas // Instrucciones de Partida para el Equipo:
          </label>
          <textarea
            value={draftNotes}
            onChange={(e) => setDraftNotes(e.target.value)}
            placeholder="Apunta aquí la condición de victoria, hechizos de invocador a rastrear, pathing del jungla rival o instrucciones clave para el equipo..."
            rows={2}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
          />
        </div>
      </div>

          {/* ========================================================================= */}
          {/* COLUMNA DERECHA: PREVIEW DE DRAFTER.LOL EN MODO SPLIT SCREEN              */}
          {/* ========================================================================= */}
          {drafterArenaMode === "split" && (
            <div className="xl:col-span-5 2xl:col-span-4 sticky top-4 space-y-3">
              <div className="bg-zinc-950 border-2 border-purple-500/40 rounded-2xl p-3 shadow-2xl flex flex-col h-[calc(100vh-140px)] min-h-[750px]">
                {/* Cabecera de la ventana Drafter */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                    <span className="font-display font-black text-xs text-white uppercase tracking-wider">
                      Drafter.lol • Transmisión en Vivo
                    </span>
                    {drafterRoomUrl && (
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-950/70 border border-purple-500/30 px-1.5 py-0.2 rounded font-bold">
                        SALA CONECTADA
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenDrafterPopout}
                    title="Abrir Drafter.lol en ventana externa independiente"
                    className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="h-3 w-3 text-purple-400" />
                    <span>Ventana Externa</span>
                  </button>
                </div>

                {/* Vista Iframe de la Sala Drafter */}
                {cleanDrafterIframeUrl ? (
                  <div className="flex-1 w-full rounded-xl overflow-hidden bg-black border border-zinc-900 relative">
                    <iframe
                      src={cleanDrafterIframeUrl}
                      title="Drafter.lol Live Room"
                      className="w-full h-full border-0"
                      allow="fullscreen"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                    <Radio className="h-8 w-8 text-zinc-600 mb-2 animate-pulse" />
                    <p className="text-xs text-zinc-400 font-mono mb-2">No hay ninguna sala conectada a Drafter.lol</p>
                    <button
                      type="button"
                      onClick={handleCreateDrafterRoom}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      ⚡ Crear Sala Automática
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MODAL: HISTORIAL DE DRAFTS GUARDADOS                                      */}
        {/* ========================================================================= */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-950 border border-purple-900/50 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-purple-400" />
                  <h3 className="font-display font-black text-sm uppercase tracking-wide text-white">
                    Historial de Drafts & Scrims Guardadas ({draftsHistory.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {draftsHistory.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 text-xs font-mono">
                    No hay ningún draft guardado aún. Pulsa en "Guardar Scrim" para registrar la sesión.
                  </div>
                ) : (
                  draftsHistory.map((draft) => (
                    <div
                      key={draft.id}
                      className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-purple-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            draft.resultado === "VICTORIA"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                              : draft.resultado === "DERROTA"
                              ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                              : "bg-zinc-800 text-zinc-400"
                          }`}>
                            {draft.resultado}
                          </span>
                          <span className="font-bold text-xs text-white">
                            vs {draft.rival || "Rival Desconocido"}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            • {new Date(draft.created_at).toLocaleString()}
                          </span>
                        </div>

                        {/* Picks del draft guardado */}
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <div className="flex items-center gap-1">
                            <span className="text-blue-400 text-[10px] font-bold">AZUL:</span>
                            {(draft.blue_picks || []).filter(Boolean).map((p: string, i: number) => (
                              <img key={i} src={getChampionAvatar(p)} alt={p} className="h-4 w-4 rounded-full object-cover" title={p} />
                            ))}
                          </div>
                          <span className="text-zinc-600">vs</span>
                          <div className="flex items-center gap-1">
                            <span className="text-rose-400 text-[10px] font-bold">ROJO:</span>
                            {(draft.red_picks || []).filter(Boolean).map((p: string, i: number) => (
                              <img key={i} src={getChampionAvatar(p)} alt={p} className="h-4 w-4 rounded-full object-cover" title={p} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            handleLoadSavedDraft(draft);
                            setShowHistoryModal(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all"
                        >
                          Cargar Mesa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedDraft(draft.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Eliminar de historial"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
