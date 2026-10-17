import React from "react";
import { CompositionData, PlayerChampionEntry } from "@/data/staff-initial-data";
import { Champion, CHAMPIONS_CATALOG, findChampion, getChampionAvatar } from "@/data/champions";
import { RoleIconOnly, RoleType } from "@/components/RoleBadge";
import {
  Swords,
  Globe,
  Share2,
  History,
  Save,
  RotateCcw,
  ExternalLink,
  Layers,
  AlertTriangle,
  Trash2,
  Crosshair,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { ActiveTab, DraftSlot, DraftSequenceStep, LaneConfig } from "../types";
import { SavedDraft } from "@/lib/staff-storage";

interface LiveDraftArenaTabProps {
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
  drafterArenaMode,
  setDrafterArenaMode,
  cleanDrafterIframeUrl,
  handleOpenDrafterPopout,
  drafterInputUrl,
  setDrafterInputUrl,
  drafterRoomUrl,
  handleSetDrafterRoomUrl,
  enemyCountersDetected,
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
  draftSearchInput,
  setDraftSearchInput,
  draftSearchMatches,
  draftNotes,
  setDraftNotes,
  setActiveTab,
}: LiveDraftArenaTabProps) {
  const VERTICAL_BOARD_ROLES = verticalBoardRoles;

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
        {/* 1. TOP HEADER: CONTROLES DE PARTIDA & CONEXIÓN DRAFTER.LOL               */}
        {/* ========================================================================= */}
        <div className="bg-zinc-950 border border-purple-900/40 p-4 rounded-2xl shadow-xl relative overflow-hidden space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="bg-purple-950 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-purple-500/30">
                  Esports Command Center 2.0
                </span>
                <span className="text-zinc-500 text-xs font-mono">
                  Mesa de Draft Unificada • Zero-Scroll • Drafter.lol Sync
                </span>
              </div>
              <h2 className="font-display font-black text-lg uppercase tracking-wider text-white flex items-center gap-2">
                <Swords className="h-5 w-5 text-purple-400" />
                <span>Sala de Draft en Vivo & Asistente Táctico</span>
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all hover:scale-105"
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

          {/* Fila compacta de Configuración: Drafter URL, Rival, Lado, Compo, Resultado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center text-xs">
            {/* Drafter.lol Room (4 cols) */}
            <div className="lg:col-span-4 flex items-center gap-1.5 bg-black/60 border border-zinc-800 rounded-lg px-2.5 py-1">
              <Globe className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <input
                type="text"
                placeholder="URL Drafter.lol (ej: drafter.lol/draft/Vdg8...)"
                value={drafterInputUrl || drafterRoomUrl}
                onChange={(e) => setDrafterInputUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && drafterInputUrl.trim()) {
                    handleSetDrafterRoomUrl(drafterInputUrl);
                  }
                }}
                className="flex-1 bg-transparent text-white font-mono text-xs outline-none placeholder-zinc-500 min-w-0"
              />
              <button
                type="button"
                onClick={handleOpenDrafterPopout}
                title="Abrir en Popout para doble monitor"
                className="text-purple-300 hover:text-white px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0"
              >
                <span>Popout</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </button>
              {cleanDrafterIframeUrl && (
                <button
                  type="button"
                  onClick={() => setDrafterArenaMode(drafterArenaMode === "split" ? "builtin" : "split")}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${
                    drafterArenaMode === "split"
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-zinc-800 text-zinc-400 hover:text-white border-zinc-700"
                  }`}
                >
                  {drafterArenaMode === "split" ? "Cerrar" : "Dividir"}
                </button>
              )}
            </div>

            {/* Rival (2 cols) */}
            <div className="lg:col-span-2">
              <input
                type="text"
                value={rivalName}
                onChange={(e) => setRivalName(e.target.value)}
                placeholder="Equipo Rival..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-semibold"
              />
            </div>

            {/* Lado (2 cols) */}
            <div className="lg:col-span-2 flex gap-1">
              <button
                type="button"
                onClick={() => setOurSide("BLUE")}
                className={`flex-1 py-1 rounded font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                  ourSide === "BLUE"
                    ? "bg-blue-600 text-white shadow border border-blue-400"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                <span>AZUL</span>
              </button>
              <button
                type="button"
                onClick={() => setOurSide("RED")}
                className={`flex-1 py-1 rounded font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                  ourSide === "RED"
                    ? "bg-rose-600 text-white shadow border border-rose-400"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
                <span>ROJO</span>
              </button>
            </div>

            {/* Composición Objetivo (2 cols) */}
            <div className="lg:col-span-2">
              <select
                value={selectedCompId}
                onChange={(e) => setSelectedCompId(e.target.value)}
                className="w-full bg-zinc-900 border border-purple-500/50 rounded px-2 py-1.5 text-xs text-white focus:outline-none font-semibold truncate"
              >
                {compositions.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Resultado Scrim (2 cols) */}
            <div className="lg:col-span-2">
              <select
                value={matchResult}
                onChange={(e) => setMatchResult(e.target.value as any)}
                className={`w-full bg-zinc-900 border rounded px-2 py-1.5 text-xs font-bold font-mono focus:outline-none ${
                  matchResult === "VICTORIA"
                    ? "text-emerald-400 border-emerald-500/50"
                    : matchResult === "DERROTA"
                    ? "text-rose-400 border-rose-500/50"
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

        {/* Pantalla dividida colapsable con Drafter.lol si se activa */}
        {drafterArenaMode === "split" && cleanDrafterIframeUrl && (
          <div className="rounded-2xl border-2 border-purple-500/50 bg-black shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
            <div className="bg-zinc-900/90 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-purple-300 flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-purple-400" />
                <strong>SALA DRAFTER.LOL EN DIRECTO:</strong> {cleanDrafterIframeUrl}
              </span>
              <button
                type="button"
                onClick={() => setDrafterArenaMode("builtin")}
                className="text-zinc-400 hover:text-rose-400 text-xs px-2 py-0.5 rounded bg-zinc-800"
              >
                ✕ Ocultar
              </button>
            </div>
            <iframe
              src={cleanDrafterIframeUrl}
              title="Drafter.lol Live Room"
              className="w-full h-[450px] bg-black border-none"
              allow="clipboard-write"
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. MESA UNIFICADA ESPORTS: 3 COLS AZUL + 6 COLS COMPANION + 3 COLS ROJO  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 xl:gap-4 items-start">
          {/* ===================================================================== */}
          {/* COLUMNA IZQUIERDA: LADO AZUL (3 COLS)                                 */}
          {/* ===================================================================== */}
          <div
            className={`lg:col-span-3 bg-zinc-950 rounded-2xl p-3.5 border-2 shadow-xl flex flex-col justify-between transition-all ${
              ourSide === "BLUE"
                ? "border-blue-500/70 shadow-blue-950/40 ring-1 ring-blue-500/30"
                : "border-zinc-800/90"
            }`}
          >
            <div>
              {/* Header Lado Azul */}
              <div className="flex items-center justify-between border-b border-blue-900/40 pb-2.5 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse shrink-0" />
                  <span className="font-display font-black text-sm tracking-wide uppercase text-blue-400 truncate">
                    {ourSide === "BLUE" ? "VOID LYNX" : rivalName}
                  </span>
                  {ourSide === "BLUE" && (
                    <span className="bg-blue-950 border border-blue-400/50 text-blue-300 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0">
                      NOSOTROS
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-zinc-400 font-bold shrink-0">
                  {bluePicks.filter(Boolean).length}/5
                </span>
              </div>

              {/* Bans Lado Azul (5 Slots) */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1 font-bold">
                  <span>Bans Azul (B1-B5):</span>
                  <span className="text-zinc-600">FASE DE BLOQUEO</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {blueBans.map((ban, idx) => {
                    const isActive =
                      activeSlot.side === "blue" &&
                      activeSlot.type === "ban" &&
                      activeSlot.index === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlot({ side: "blue", type: "ban", index: idx })}
                        className={`relative aspect-square rounded-lg border flex flex-col items-center justify-center overflow-hidden transition-all group ${
                          isActive
                            ? "border-blue-400 ring-2 ring-blue-400 bg-blue-950/60 shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-105"
                            : ban
                            ? "border-blue-900/60 bg-zinc-900"
                            : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                        }`}
                      >
                        {ban ? (
                          <>
                            <img
                              src={getChampionAvatar(ban)}
                              alt={ban}
                              className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all"
                            />
                            <div className="absolute inset-0 bg-blue-950/40 flex items-center justify-center">
                              <span className="text-blue-400 font-bold text-xs">✕</span>
                            </div>
                            <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] text-zinc-300 font-mono truncate text-center px-0.5 leading-tight">
                              {ban}
                            </span>
                          </>
                        ) : (
                          <span className="text-[9px] font-mono text-zinc-600 font-bold">
                            B{idx + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Picks Lado Azul (5 Slots B1 - B5) */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block font-bold mb-1">
                  Picks Lado Azul (B1 - B5):
                </span>
                {bluePicks.map((pick, idx) => {
                  const isActive =
                    activeSlot.side === "blue" &&
                    activeSlot.type === "pick" &&
                    activeSlot.index === idx;
                  const champ = findChampion(pick);
                  const isCounter =
                    ourSide === "RED" &&
                    pick &&
                    currentComp.counters_campeones.some(
                      (c) => c.toLowerCase() === pick.toLowerCase()
                    );

                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveSlot({ side: "blue", type: "pick", index: idx })}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                        isActive
                          ? "border-blue-400 bg-blue-950/60 ring-2 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] -translate-y-0.5"
                          : isCounter
                          ? "border-rose-500 bg-rose-950/20"
                          : pick
                          ? "border-zinc-800 bg-zinc-900/90 hover:border-zinc-700"
                          : "border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono font-black text-blue-400 w-6 shrink-0">
                          B{idx + 1}
                        </span>
                        {pick ? (
                          <>
                            <img
                              src={getChampionAvatar(pick)}
                              alt={pick}
                              className="h-9 w-9 rounded-lg border border-blue-500/50 object-cover shrink-0 shadow"
                            />
                            <div className="min-w-0 truncate">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-xs text-white truncate">
                                  {champ ? champ.name : pick}
                                </span>
                                {isCounter && (
                                  <span className="bg-rose-600 text-white text-[8px] font-bold px-1 rounded">
                                    COUNTER
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] text-zinc-400 font-mono block">
                                {champ?.category || "Champion"}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="text-[11px] text-zinc-500 font-mono italic truncate">
                            {isActive ? "👉 Seleccionando..." : "Click para asignar B" + (idx + 1)}
                          </span>
                        )}
                      </div>

                      {pick && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearSlot("blue", "pick", idx);
                          }}
                          className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-rose-950/30 transition-colors text-xs"
                          title="Quitar campeón"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* COLUMNA CENTRAL: EL CORAZÓN TÁCTICO & 5 COLUMNAS VERTICALES (6 COLS)  */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 flex flex-col space-y-3">
            {/* HUD SUPERIOR: CONTROLADOR DE TURNO ACTIVO & ALERTAS */}
            <div className="bg-zinc-950 border border-purple-900/50 rounded-2xl p-3 shadow-xl space-y-2">
              <div className="flex items-center justify-between gap-2">
                {/* Botón Turno Anterior */}
                <button
                  type="button"
                  onClick={handlePrevTurnStep}
                  title="Ir al turno anterior"
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Ant.</span>
                </button>

                {/* Banner de Turno Actual */}
                <div className="flex-1 flex items-center justify-center gap-2 text-center min-w-0">
                  {currentTurnStep ? (
                    <div className={`px-3 py-1 rounded-xl border flex items-center gap-2 truncate ${
                      currentTurnStep.side === "blue"
                        ? "bg-blue-950/80 border-blue-500 text-blue-200"
                        : "bg-rose-950/80 border-rose-500 text-rose-200"
                    }`}>
                      <span className={`h-2 w-2 rounded-full animate-ping shrink-0 ${
                        currentTurnStep.side === "blue" ? "bg-blue-400" : "bg-rose-400"
                      }`} />
                      <span className="text-[10px] font-mono uppercase font-bold text-zinc-300">
                        {currentTurnStep.ourTurn ? "★ TU TURNO:" : "TURNO RIVAL:"}
                      </span>
                      <span className="font-display font-black text-xs uppercase tracking-wide truncate">
                        {currentTurnStep.label}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      ✓ DRAFT COMPLETADO
                    </span>
                  )}

                  {/* Indicador Slot Activo */}
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold shrink-0 ${
                    activeSlot.side === "blue"
                      ? "bg-blue-950 text-blue-300 border-blue-500/40"
                      : "bg-rose-950 text-rose-300 border-rose-500/40"
                  }`}>
                    SLOT: {activeSlot.side.toUpperCase()} {activeSlot.type.toUpperCase()} #{activeSlot.index + 1}
                  </span>
                </div>

                {/* Botón Siguiente Turno */}
                <button
                  type="button"
                  onClick={handleNextTurnStep}
                  title="Ir al siguiente turno"
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Sig.</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Alerta de Counters Detectados */}
              {enemyCountersDetected.length > 0 && (
                <div className="bg-rose-950/40 border border-rose-500/60 rounded-xl p-2 flex items-center gap-2 animate-pulse">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span className="text-[10px] text-rose-200 font-mono truncate flex-1">
                    <strong>¡ALERTA!</strong> Rival pickeó {enemyCountersDetected.length} counter(s): {enemyCountersDetected.join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* LAS 5 COLUMNAS VERTICALES EN PARALELO (TOP - JNGL - MID - ADC - SUPP) */}
            <div className="bg-zinc-950 border border-purple-900/40 rounded-2xl p-3 shadow-2xl">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-purple-400" />
                  <span className="font-display font-black text-xs uppercase tracking-wider text-white">
                    COMPANION: {currentComp.nombre}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                    1-CLICK LOCK
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Haz clic en cualquier pick para lockearlo en {activeSlot.side.toUpperCase()} {activeSlot.type.toUpperCase()} #{activeSlot.index + 1}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 items-stretch">
                {VERTICAL_BOARD_ROLES.map((laneConfig) => {
                  const roleData = getRoleChampsForComp(currentComp.nombre, laneConfig.role, laneConfig.player);
                  const prio = currentComp.role_priorities?.[laneConfig.role] || "Media";

                  const roleWarnings = (currentComp.no_first_pick_reasons || []).filter((w) => {
                    const champ = findChampion(w.champ);
                    if (champ && champ.roles.includes(laneConfig.role)) return true;
                    return [...roleData.S, ...roleData.A, ...roleData.B].some(
                      (e) => e.campeon_id.toLowerCase() === w.champ.toLowerCase()
                    );
                  });

                  const displayRoleName = laneConfig.role === "JGL" ? "JNGL" : laneConfig.role;
                  const isAlta = prio === "Alta";
                  const isMedia = prio === "Media";

                  return (
                    <div
                      key={laneConfig.role}
                      className={`rounded-xl border bg-zinc-950/90 flex flex-col justify-between overflow-hidden shadow transition-all ${
                        isAlta
                          ? "border-emerald-500/50"
                          : isMedia
                          ? "border-amber-500/50"
                          : "border-purple-500/50"
                      }`}
                    >
                      <div>
                        {/* Cabecera del Rol */}
                        <div className="p-1.5 bg-zinc-900/70 border-b border-zinc-800 text-center">
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            <RoleIconOnly role={laneConfig.role} size="sm" />
                            <span className="font-mono font-black text-[10px] text-white uppercase">
                              {displayRoleName}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-400 block truncate">
                            {laneConfig.player}
                          </span>
                          <span className={`inline-block mt-0.5 px-1 py-0.1 rounded text-[8px] font-mono font-bold uppercase ${
                            isAlta
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                              : isMedia
                              ? "bg-amber-950 text-amber-300 border border-amber-500/30"
                              : "bg-purple-950 text-purple-300 border border-purple-500/30"
                          }`}>
                            {prio}
                          </span>
                        </div>

                        {/* Listado de Tiers (S, A, B) */}
                        <div className="p-1 space-y-1.5">
                          {[
                            { name: "S", list: roleData.S, color: "text-amber-400 bg-amber-500/20 border-amber-500/40" },
                            { name: "A", list: roleData.A, color: "text-purple-300 bg-purple-500/20 border-purple-500/40" },
                            { name: "B", list: roleData.B, color: "text-sky-300 bg-sky-500/20 border-sky-500/40" },
                          ].map(({ name, list, color }) => (
                            <div key={name} className="space-y-0.5">
                              <div className="flex items-center justify-between text-[8px] font-mono px-1">
                                <span className={`font-black px-1 rounded border ${color}`}>
                                  T{name}
                                </span>
                                <span className="text-zinc-500">({list.length})</span>
                              </div>

                              {list.length === 0 ? (
                                <div className="text-[8px] text-zinc-600 italic text-center py-0.5">-</div>
                              ) : (
                                <div className="space-y-1">
                                  {list.map((entry) => {
                                    const tag = entry.pick_tag || (entry.is_first_pickable ? "FP" : undefined);
                                    const isUsed = allUsedChampions.has(entry.campeon_id.toLowerCase());
                                    const isFP = tag === "FP";
                                    const isLP = tag === "LP";
                                    const isRisky = tag === "Risky";

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
                                        className={`w-full flex items-center gap-1.5 p-1 rounded-lg border text-left transition-all cursor-pointer ${
                                          isUsed
                                            ? "bg-zinc-900/40 border-zinc-800 opacity-40 cursor-not-allowed"
                                            : "bg-zinc-900/70 hover:bg-zinc-800 border-zinc-800 hover:border-purple-400 shadow-sm active:scale-95"
                                        }`}
                                      >
                                        <div className="relative shrink-0">
                                          <img
                                            src={getChampionAvatar(entry.campeon_id)}
                                            alt={entry.campeon_id}
                                            className={`h-7 w-7 rounded-md object-cover ${
                                              isUsed
                                                ? "grayscale border border-zinc-700"
                                                : isFP
                                                ? "border border-emerald-400"
                                                : isLP
                                                ? "border border-purple-400"
                                                : isRisky
                                                ? "border border-amber-400"
                                                : "border border-zinc-700"
                                            }`}
                                          />
                                          {isUsed ? (
                                            <span className="absolute -top-1 -right-1 px-0.5 py-0 rounded bg-emerald-600 text-white text-[6px] font-mono font-bold leading-none">
                                              ✓
                                            </span>
                                          ) : isFP ? (
                                            <span className="absolute -top-1 -right-1 px-0.5 py-0 rounded bg-emerald-500 text-black text-[7px] font-mono font-black leading-none">
                                              FP
                                            </span>
                                          ) : isLP ? (
                                            <span className="absolute -top-1 -right-1 px-0.5 py-0 rounded bg-purple-600 text-white text-[7px] font-mono font-black leading-none">
                                              LP
                                            </span>
                                          ) : isRisky ? (
                                            <span className="absolute -top-1 -right-1 px-0.5 py-0 rounded bg-amber-500 text-black text-[7px] font-mono font-black leading-none">
                                              R
                                            </span>
                                          ) : null}
                                        </div>

                                        <span className="text-[10px] font-bold text-zinc-200 group-hover:text-white truncate flex-1 leading-tight">
                                          {entry.campeon_id}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Warnings / Intel rápido */}
                      {roleWarnings.length > 0 && roleWarnings[0] && (
                        <div className="p-1 m-1 rounded bg-rose-950/20 border border-rose-500/30 text-[7px] font-mono text-zinc-300 truncate">
                          <strong className="text-rose-400">{roleWarnings[0].champ}:</strong> {roleWarnings[0].reason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BUSCADOR RÁPIDO DE CUALQUIER CAMPEÓN PARA PICKS OFF-META */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 shadow space-y-2">
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  placeholder="¿Pick sorpresa / off-meta? Escribe el nombre aquí..."
                  value={draftSearchInput}
                  onChange={(e) => setDraftSearchInput(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-400"
                />
                {draftSearchInput && (
                  <button
                    type="button"
                    onClick={() => setDraftSearchInput("")}
                    className="text-zinc-400 hover:text-white text-xs px-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Tira horizontal de resultados rápidos */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {(draftSearchInput.trim()
                  ? draftSearchMatches
                  : CHAMPIONS_CATALOG.filter((c) => !allUsedChampions.has(c.id.toLowerCase())).slice(0, 16)
                ).map((champ) => (
                  <button
                    key={champ.id}
                    type="button"
                    onClick={() => handleLockChampion(champ.name)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 hover:bg-purple-950 border border-zinc-800 hover:border-purple-400 shrink-0 transition-all text-left"
                  >
                    <img
                      src={getChampionAvatar(champ.id)}
                      alt={champ.name}
                      className="h-5 w-5 rounded object-cover"
                    />
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">
                      {champ.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* COLUMNA DERECHA: LADO ROJO (3 COLS)                                   */}
          {/* ===================================================================== */}
          <div
            className={`lg:col-span-3 bg-zinc-950 rounded-2xl p-3.5 border-2 shadow-xl flex flex-col justify-between transition-all ${
              ourSide === "RED"
                ? "border-rose-500/70 shadow-rose-950/40 ring-1 ring-rose-500/30"
                : "border-zinc-800/90"
            }`}
          >
            <div>
              {/* Header Lado Rojo */}
              <div className="flex items-center justify-between border-b border-rose-900/40 pb-2.5 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse shrink-0" />
                  <span className="font-display font-black text-sm tracking-wide uppercase text-rose-400 truncate">
                    {ourSide === "RED" ? "VOID LYNX" : rivalName}
                  </span>
                  {ourSide === "RED" && (
                    <span className="bg-rose-950 border border-rose-400/50 text-rose-300 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0">
                      NOSOTROS
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-zinc-400 font-bold shrink-0">
                  {redPicks.filter(Boolean).length}/5
                </span>
              </div>

              {/* Bans Lado Rojo (5 Slots) */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1 font-bold">
                  <span>Bans Rojo (R1-R5):</span>
                  <span className="text-zinc-600">FASE DE BLOQUEO</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {redBans.map((ban, idx) => {
                    const isActive =
                      activeSlot.side === "red" &&
                      activeSlot.type === "ban" &&
                      activeSlot.index === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlot({ side: "red", type: "ban", index: idx })}
                        className={`relative aspect-square rounded-lg border flex flex-col items-center justify-center overflow-hidden transition-all group ${
                          isActive
                            ? "border-rose-400 ring-2 ring-rose-400 bg-rose-950/60 shadow-[0_0_15px_rgba(244,63,94,0.6)] scale-105"
                            : ban
                            ? "border-rose-900/60 bg-zinc-900"
                            : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                        }`}
                      >
                        {ban ? (
                          <>
                            <img
                              src={getChampionAvatar(ban)}
                              alt={ban}
                              className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all"
                            />
                            <div className="absolute inset-0 bg-rose-950/40 flex items-center justify-center">
                              <span className="text-rose-400 font-bold text-xs">✕</span>
                            </div>
                            <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] text-zinc-300 font-mono truncate text-center px-0.5 leading-tight">
                              {ban}
                            </span>
                          </>
                        ) : (
                          <span className="text-[9px] font-mono text-zinc-600 font-bold">
                            R{idx + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Picks Lado Rojo (5 Slots R1 - R5) */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block font-bold mb-1">
                  Picks Lado Rojo (R1 - R5):
                </span>
                {redPicks.map((pick, idx) => {
                  const isActive =
                    activeSlot.side === "red" &&
                    activeSlot.type === "pick" &&
                    activeSlot.index === idx;
                  const champ = findChampion(pick);
                  const isCounter =
                    ourSide === "BLUE" &&
                    pick &&
                    currentComp.counters_campeones.some(
                      (c) => c.toLowerCase() === pick.toLowerCase()
                    );

                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveSlot({ side: "red", type: "pick", index: idx })}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                        isActive
                          ? "border-rose-400 bg-rose-950/60 ring-2 ring-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] -translate-y-0.5"
                          : isCounter
                          ? "border-rose-500 bg-rose-950/20"
                          : pick
                          ? "border-zinc-800 bg-zinc-900/90 hover:border-zinc-700"
                          : "border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono font-black text-rose-400 w-6 shrink-0">
                          R{idx + 1}
                        </span>
                        {pick ? (
                          <>
                            <img
                              src={getChampionAvatar(pick)}
                              alt={pick}
                              className="h-9 w-9 rounded-lg border border-rose-500/50 object-cover shrink-0 shadow"
                            />
                            <div className="min-w-0 truncate">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-xs text-white truncate">
                                  {champ ? champ.name : pick}
                                </span>
                                {isCounter && (
                                  <span className="bg-rose-600 text-white text-[8px] font-bold px-1 rounded">
                                    COUNTER
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] text-zinc-400 font-mono block">
                                {champ?.category || "Champion"}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="text-[11px] text-zinc-500 font-mono italic truncate">
                            {isActive ? "👉 Seleccionando..." : "Click para asignar R" + (idx + 1)}
                          </span>
                        )}
                      </div>

                      {pick && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearSlot("red", "pick", idx);
                          }}
                          className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-rose-950/30 transition-colors text-xs"
                          title="Quitar campeón"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. NOTAS TÁCTICAS DEL DRAFT (INFERIOR COMPACTO)                            */}
        {/* ========================================================================= */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 shadow-lg">
          <label className="block text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
            Notas Tácticas // Instrucciones para la partida:
          </label>
          <textarea
            value={draftNotes}
            onChange={(e) => setDraftNotes(e.target.value)}
            placeholder="Apunta aquí la condición de victoria, hechizos de invocador a rastrear, pathing del jungla rival o instrucciones clave para el equipo..."
            rows={2}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
          />
        </div>

        {/* MODAL: HISTORIAL DE DRAFTS GUARDADOS */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-purple-900/50 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/80">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-purple-400" />
                  <h3 className="font-display font-bold text-base uppercase tracking-wider text-white">
                    Historial de Drafts & Scrims Guardadas
                  </h3>
                  <span className="bg-purple-950 text-purple-300 text-xs font-mono px-2 py-0.5 rounded font-bold">
                    {draftsHistory.length} partidas
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {draftsHistory.length > 0 ? (
                  draftsHistory.map((draft) => (
                    <div
                      key={draft.id}
                      className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 hover:border-purple-500/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-display font-bold text-sm text-white">
                            vs {draft.rival}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              draft.resultado === "VICTORIA"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                                : draft.resultado === "DERROTA"
                                ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {draft.resultado}
                          </span>
                          <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40">
                            {draft.composicion_id}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Lado {draft.nuestro_lado} • {new Date(draft.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono pt-1">
                          <div className="flex items-center gap-1">
                            <span className="text-blue-400 text-[10px] font-bold">AZUL:</span>
                            {draft.blue_picks?.filter(Boolean).map((p, i) => (
                              <img
                                key={i}
                                src={getChampionAvatar(p)}
                                alt={p}
                                title={p}
                                className="h-5 w-5 rounded object-cover border border-blue-500/40"
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-rose-400 text-[10px] font-bold">ROJO:</span>
                            {draft.red_picks?.filter(Boolean).map((p, i) => (
                              <img
                                key={i}
                                src={getChampionAvatar(p)}
                                alt={p}
                                title={p}
                                className="h-5 w-5 rounded object-cover border border-rose-500/40"
                              />
                            ))}
                          </div>
                        </div>

                        {draft.notas && (
                          <p className="text-[11px] text-zinc-400 italic line-clamp-1 pt-0.5">
                            "{draft.notas}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleLoadSavedDraft(draft)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                        >
                          Cargar en Mesa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedDraft(draft.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Eliminar registro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-zinc-500 text-xs">
                    No hay drafts guardados todavía. Realiza un draft en la mesa y pulsa "Guardar Scrim".
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
