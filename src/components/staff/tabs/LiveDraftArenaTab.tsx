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
<div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. BARRA SUPERIOR DE CONEXIÓN CON DRAFTER.LOL & CONTROLES DE PARTIDA */}
            <div className="bg-zinc-950 border border-purple-900/40 p-5 rounded-2xl shadow-2xl relative overflow-hidden space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-purple-950 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-purple-500/30">
                      Live Draft Engine 2.0
                    </span>
                    <span className="text-zinc-500 text-xs font-mono">
                      Mesa de Draft • Sincronización Drafter.lol • Companion del Coach
                    </span>
                  </div>
                  <h2 className="font-display font-black text-xl uppercase tracking-wider text-white flex items-center gap-2.5">
                    <Swords className="h-6 w-6 text-purple-400" />
                    <span>Sala de Draft en Vivo & Asistente Táctico</span>
                  </h2>
                </div>

                {/* Acciones principales: Copiar, Historial, Guardar, Limpiar */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyDraftSummary}
                    title="Copiar resumen del draft para Discord"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-zinc-200 text-xs font-semibold transition-colors"
                  >
                    <Share2 className="h-4 w-4 text-emerald-400" />
                    <span>Copiar Draft (Discord)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowHistoryModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-purple-500 text-zinc-200 text-xs font-semibold transition-colors"
                  >
                    <History className="h-4 w-4 text-purple-400" />
                    <span>Historial ({draftsHistory.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCurrentDraft}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all hover:scale-105"
                  >
                    <Save className="h-4 w-4" />
                    <span>Guardar Partida</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDraftBoard}
                    title="Limpiar todos los picks y bans de la mesa"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 text-xs transition-colors border border-zinc-800"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reiniciar Mesa</span>
                  </button>
                </div>
              </div>

              {/* BARRA DE CONEXIÓN CON DRAFTER.LOL & SELECTOR DE PANTALLA */}
              <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Globe className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-mono font-bold text-zinc-300">Sala Drafter.lol:</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Pega la URL de drafter.lol (ej: https://drafter.lol/room/abc123)..."
                    value={drafterInputUrl || drafterRoomUrl}
                    onChange={(e) => setDrafterInputUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && drafterInputUrl.trim()) {
                        handleSetDrafterRoomUrl(drafterInputUrl);
                      }
                    }}
                    className="flex-1 bg-black/70 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (drafterInputUrl.trim()) {
                        handleSetDrafterRoomUrl(drafterInputUrl);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold transition-colors shrink-0"
                  >
                    Guardar
                  </button>
                </div>

                {/* Acciones de Drafter.lol: Popout & Split Screen */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={handleOpenDrafterPopout}
                    title="Abre la sala de drafter.lol en una ventana flotante limpia para doble pantalla"
                    className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-purple-400" />
                    <span>↗ Popout (Doble Monitor)</span>
                  </button>

                  {cleanDrafterIframeUrl && (
                    <button
                      type="button"
                      onClick={() => setDrafterArenaMode(drafterArenaMode === "split" ? "builtin" : "split")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors flex items-center gap-1.5 ${
                        drafterArenaMode === "split"
                          ? "bg-purple-600 text-white border-purple-400 shadow"
                          : "bg-zinc-900 text-zinc-400 hover:text-white border-zinc-700"
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>{drafterArenaMode === "split" ? "Ocultar Dividida" : "Pantalla Dividida"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Barra de Configuración de la Scrim / Partido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {/* Rival */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                    Equipo Rival:
                  </label>
                  <input
                    type="text"
                    value={rivalName}
                    onChange={(e) => setRivalName(e.target.value)}
                    placeholder="Ej: Movistar KOI, GIANTX..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-semibold"
                  />
                </div>

                {/* Lado de Void Lynx */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                    Lado de Void Lynx:
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setOurSide("BLUE")}
                      className={`flex-1 py-1.5 rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        ourSide === "BLUE"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      <span>AZUL (B1 First Pick)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOurSide("RED")}
                      className={`flex-1 py-1.5 rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        ourSide === "RED"
                          ? "bg-rose-600 text-white shadow-md shadow-rose-900/40 border border-rose-400"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      <span>ROJO (R5 Last Pick)</span>
                    </button>
                  </div>
                </div>

                {/* Composición Objetivo que queremos ejecutar */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                    Composición Objetivo:
                  </label>
                  <select
                    value={selectedCompId}
                    onChange={(e) => setSelectedCompId(e.target.value)}
                    className="w-full bg-zinc-900 border border-purple-500/50 rounded px-3 py-1.5 text-xs text-white focus:outline-none font-semibold"
                  >
                    {compositions.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.nombre} ({comp.prioridad.replace(" Prioridad", "")})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Resultado Scrim */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                    Resultado Match:
                  </label>
                  <select
                    value={matchResult}
                    onChange={(e) => setMatchResult(e.target.value as any)}
                    className={`w-full bg-zinc-900 border rounded px-3 py-1.5 text-xs font-bold font-mono focus:outline-none ${
                      matchResult === "VICTORIA"
                        ? "text-emerald-400 border-emerald-500/50"
                        : matchResult === "DERROTA"
                        ? "text-rose-400 border-rose-500/50"
                        : "text-zinc-300 border-zinc-800"
                    }`}
                  >
                    <option value="PENDING">PENDIENTE (En Curso)</option>
                    <option value="VICTORIA">VICTORIA (Void Lynx)</option>
                    <option value="DERROTA">DERROTA</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SI PANTALLA DIVIDIDA ESTÁ ACTIVA: IFRAME EN CONTENEDOR COLAPSABLE */}
            {drafterArenaMode === "split" && cleanDrafterIframeUrl && (
              <div className="rounded-2xl border-2 border-purple-500/50 bg-black shadow-2xl overflow-hidden">
                <div className="bg-zinc-900/90 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-300 flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-purple-400" />
                    <strong>SALA DRAFTER.LOL EN DIRECTO:</strong> {cleanDrafterIframeUrl}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenDrafterPopout}
                      className="text-purple-300 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <span>Abrir Popout</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrafterArenaMode("builtin")}
                      className="text-zinc-400 hover:text-rose-400 text-xs px-2 py-0.5 rounded bg-zinc-800"
                    >
                      ✕ Ocultar
                    </button>
                  </div>
                </div>
                <iframe
                  src={cleanDrafterIframeUrl}
                  title="Drafter.lol Live Room"
                  className="w-full h-[480px] bg-black border-none"
                  allow="clipboard-write"
                />
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. MESA DE DRAFT INTEGRADA (SIEMPRE ACTIVA, INTERACTIVA Y CON AUTO-TURNO) */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              {/* ALERTA EN VIVO: Counters detectados en el equipo rival */}
              {enemyCountersDetected.length > 0 && (
                <div className="bg-gradient-to-r from-rose-950/90 via-red-950/80 to-zinc-950 border-2 border-rose-500 rounded-xl p-4 shadow-2xl animate-pulse">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 bg-rose-600/20 border border-rose-500 rounded-lg shrink-0">
                      <AlertTriangle className="h-6 w-6 text-rose-400 animate-bounce" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm uppercase tracking-wide text-rose-200">
                          ¡ALERTA TÁCTICA! El rival ha drafteado counters de "{currentComp.nombre}"
                        </h4>
                        <span className="bg-rose-600 text-[10px] text-white font-mono font-bold px-2 py-0.2 rounded-full">
                          {enemyCountersDetected.length} DETECTADOS
                        </span>
                      </div>
                      <p className="text-xs text-rose-200/80 mt-0.5 leading-relaxed">
                        Peligro para tu composición: {currentComp.counters_descripcion}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        {enemyCountersDetected.map((cId) => (
                          <span
                            key={cId}
                            className="bg-black/80 border border-rose-400 text-rose-200 text-xs px-2.5 py-1 rounded-md flex items-center gap-2 font-bold shadow"
                          >
                            <img
                              src={getChampionAvatar(cId)}
                              alt={cId}
                              className="h-5 w-5 rounded object-cover"
                            />
                            <span>{cId}</span>
                            <span className="text-[10px] text-rose-400 font-mono">COUNTER DIRECTO</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MESA DE DRAFT: LADO AZUL vs TRACKER vs LADO ROJO */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-5 items-stretch">
                {/* ===================== LADO AZUL (lg:col-span-5) ===================== */}
                <div
                  className={`lg:col-span-5 bg-zinc-950 rounded-2xl p-4 sm:p-5 border-2 shadow-2xl flex flex-col justify-between transition-all ${
                    ourSide === "BLUE"
                      ? "border-blue-500/70 shadow-blue-950/40 ring-1 ring-blue-500/30"
                      : "border-zinc-800"
                  }`}
                >
                  <div>
                    {/* Cabecera Lado Azul */}
                    <div className="flex items-center justify-between border-b border-blue-900/40 pb-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6] animate-pulse" />
                        <span className="font-display font-extrabold text-base tracking-wider uppercase text-blue-400">
                          LADO AZUL // {ourSide === "BLUE" ? "VOID LYNX" : rivalName}
                        </span>
                        {ourSide === "BLUE" && (
                          <span className="bg-blue-950 border border-blue-400/50 text-blue-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                            NOSOTROS
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-zinc-400 font-bold">
                        {bluePicks.filter(Boolean).length}/5 Picks
                      </span>
                    </div>

                    {/* BANS LADO AZUL (5 Slots) */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5 font-bold">
                        Bans Lado Azul (1-5):
                      </span>
                      <div className="grid grid-cols-5 gap-2">
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
                                  ? "border-blue-400 ring-2 ring-blue-400 bg-blue-950/60 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105"
                                  : ban
                                  ? "border-rose-900/60 bg-zinc-900"
                                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/40"
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
                                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-zinc-300 font-mono truncate text-center px-0.5">
                                    {ban}
                                  </span>
                                </>
                              ) : (
                                <span className="text-[10px] font-mono text-zinc-600 font-bold">
                                  B{idx + 1}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* PICKS LADO AZUL (5 Slots B1 - B5) */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
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
                            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                              isActive
                                ? "border-blue-400 bg-blue-950/50 ring-2 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)] -translate-y-0.5"
                                : isCounter
                                ? "border-rose-500 bg-rose-950/20"
                                : pick
                                ? "border-zinc-800 bg-zinc-900/80 hover:border-zinc-700"
                                : "border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-xs font-mono font-black text-blue-400 w-7 shrink-0">
                                B{idx + 1}
                              </span>
                              {pick ? (
                                <>
                                  <img
                                    src={getChampionAvatar(pick)}
                                    alt={pick}
                                    className="h-10 w-10 rounded-lg border border-blue-500/50 object-cover shrink-0 shadow"
                                  />
                                  <div className="min-w-0 truncate">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-sm text-white truncate">
                                        {champ ? champ.name : pick}
                                      </span>
                                      {isCounter && (
                                        <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 rounded">
                                          COUNTER
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-zinc-400 font-mono block">
                                      {champ?.category || "Champion"}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <span className="text-xs text-zinc-500 font-mono italic">
                                  {isActive ? "👉 Seleccionando campeón..." : "Click para asignar pick B" + (idx + 1)}
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
                                className="text-zinc-500 hover:text-rose-400 p-1.5 rounded hover:bg-rose-950/30 transition-colors text-xs"
                                title="Quitar campeón"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ===================== CENTRO: CONTROLADOR DE TURNOS (lg:col-span-2) ===================== */}
                <div className="lg:col-span-2 flex flex-col items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 self-center shadow-xl w-full">
                  <div className="w-full text-center space-y-1">
                    <span className="text-[10px] font-mono uppercase font-black tracking-wider text-purple-400 block">
                      SECUENCIA OFICIAL
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">
                      Riot Games Competitive Draft
                    </span>
                  </div>

                  {currentTurnStep ? (
                    <div className="w-full text-center space-y-2">
                      <div className={`p-3 rounded-xl border-2 shadow-lg transition-all ${
                        currentTurnStep.side === "blue"
                          ? "bg-blue-950/80 border-blue-500 text-blue-200 shadow-blue-950/50"
                          : "bg-rose-950/80 border-rose-500 text-rose-200 shadow-rose-950/50"
                      }`}>
                        <span className="text-[9px] font-mono block uppercase font-bold text-zinc-300">
                          {currentTurnStep.ourTurn ? "★ TU TURNO (VOID LYNX)" : "TURNO RIVAL"}
                        </span>
                        <span className="font-display font-black text-base block mt-0.5">
                          {currentTurnStep.label}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveSlot({
                            side: currentTurnStep.side,
                            type: currentTurnStep.type,
                            index: currentTurnStep.index,
                          });
                        }}
                        className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-[11px] font-bold transition-all shadow"
                      >
                        👉 Ir al turno actual
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 rounded-xl w-full">
                      ✓ Draft Completo
                    </div>
                  )}

                  {/* Controles manuales de navegación de turnos */}
                  <div className="w-full space-y-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={handlePrevTurnStep}
                        title="Ir al turno anterior"
                        className="flex-1 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px] font-bold transition-colors"
                      >
                        ← Ant.
                      </button>
                      <button
                        type="button"
                        onClick={handleNextTurnStep}
                        title="Ir al siguiente turno"
                        className="flex-1 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px] font-bold transition-colors"
                      >
                        Sig. →
                      </button>
                    </div>

                    <div className="text-center">
                      <span className="text-[9px] font-mono text-purple-300 block font-bold">
                        Slot: {activeSlot.side.toUpperCase()} {activeSlot.type.toUpperCase()} #{activeSlot.index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ===================== LADO ROJO (lg:col-span-5) ===================== */}
                <div
                  className={`lg:col-span-5 bg-zinc-950 rounded-2xl p-4 sm:p-5 border-2 shadow-2xl flex flex-col justify-between transition-all ${
                    ourSide === "RED"
                      ? "border-rose-500/70 shadow-rose-950/40 ring-1 ring-rose-500/30"
                      : "border-zinc-800"
                  }`}
                >
                  <div>
                    {/* Cabecera Lado Rojo */}
                    <div className="flex items-center justify-between border-b border-rose-900/40 pb-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse" />
                        <span className="font-display font-extrabold text-base tracking-wider uppercase text-rose-400">
                          LADO ROJO // {ourSide === "RED" ? "VOID LYNX" : rivalName}
                        </span>
                        {ourSide === "RED" && (
                          <span className="bg-rose-950 border border-rose-400/50 text-rose-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                            NOSOTROS
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-zinc-400 font-bold">
                        {redPicks.filter(Boolean).length}/5 Picks
                      </span>
                    </div>

                    {/* BANS LADO ROJO (5 Slots) */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5 font-bold">
                        Bans Lado Rojo (1-5):
                      </span>
                      <div className="grid grid-cols-5 gap-2">
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
                                  ? "border-rose-400 ring-2 ring-rose-400 bg-rose-950/60 shadow-[0_0_15px_rgba(244,63,94,0.5)] scale-105"
                                  : ban
                                  ? "border-rose-900/60 bg-zinc-900"
                                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/40"
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
                                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-zinc-300 font-mono truncate text-center px-0.5">
                                    {ban}
                                  </span>
                                </>
                              ) : (
                                <span className="text-[10px] font-mono text-zinc-600 font-bold">
                                  R{idx + 1}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* PICKS LADO ROJO (5 Slots R1 - R5) */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
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
                            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                              isActive
                                ? "border-rose-400 bg-rose-950/50 ring-2 ring-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.35)] -translate-y-0.5"
                                : isCounter
                                ? "border-rose-500 bg-rose-950/20"
                                : pick
                                ? "border-zinc-800 bg-zinc-900/80 hover:border-zinc-700"
                                : "border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-xs font-mono font-black text-rose-400 w-7 shrink-0">
                                R{idx + 1}
                              </span>
                              {pick ? (
                                <>
                                  <img
                                    src={getChampionAvatar(pick)}
                                    alt={pick}
                                    className="h-10 w-10 rounded-lg border border-rose-500/50 object-cover shrink-0 shadow"
                                  />
                                  <div className="min-w-0 truncate">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-sm text-white truncate">
                                        {champ ? champ.name : pick}
                                      </span>
                                      {isCounter && (
                                        <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 rounded">
                                          COUNTER
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-zinc-400 font-mono block">
                                      {champ?.category || "Champion"}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <span className="text-xs text-zinc-500 font-mono italic">
                                  {isActive ? "👉 Seleccionando campeón..." : "Click para asignar pick R" + (idx + 1)}
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
                                className="text-zinc-500 hover:text-rose-400 p-1.5 rounded hover:bg-rose-950/30 transition-colors text-xs"
                                title="Quitar campeón"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 3. COMPANION TÁCTICO: LAS 5 COLUMNAS CON 1-CLICK LOCK DIRECTO             */}
            {/* ========================================================================= */}
            <div className="bg-zinc-950 border border-purple-900/40 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Crosshair className="h-4 w-4 text-purple-400" />
                    <span className="font-display font-black text-sm uppercase tracking-wider text-white">
                      COMPANION EN VIVO: {currentComp.nombre}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                      1-CLICK LOCK
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Haz clic en cualquier campeón abajo para <strong>lockearlo directamente</strong> en el slot activo de la mesa ({activeSlot.side.toUpperCase()} {activeSlot.type.toUpperCase()} #{activeSlot.index + 1}) y avanzar al siguiente turno.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-zinc-500">Pickeando para:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    activeSlot.side === "blue" ? "bg-blue-950 text-blue-300 border border-blue-500/40" : "bg-rose-950 text-rose-300 border border-rose-500/40"
                  }`}>
                    {activeSlot.side.toUpperCase()} {activeSlot.type.toUpperCase()} #{activeSlot.index + 1}
                  </span>
                </div>
              </div>

              {/* 5 COLUMNAS VERTICALES DEL COMPANION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-stretch">
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

                  const roleCounters = (currentComp.counters_campeones || []).filter((cId) => {
                    const champ = findChampion(cId);
                    return champ && champ.roles.includes(laneConfig.role);
                  });

                  const displayRoleName = laneConfig.role === "JGL" ? "JNGL" : laneConfig.role;
                  const isAlta = prio === "Alta";
                  const isMedia = prio === "Media";

                  return (
                    <div
                      key={laneConfig.role}
                      className={`rounded-2xl border bg-zinc-950 flex flex-col justify-between overflow-hidden shadow-lg transition-all ${
                        isAlta
                          ? "border-emerald-500/60"
                          : isMedia
                          ? "border-amber-500/60"
                          : "border-purple-500/60"
                      }`}
                    >
                      <div>
                        {/* Cabecera del Rol */}
                        <div className="p-3 bg-zinc-900/60 border-b border-zinc-800">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5">
                              <RoleIconOnly role={laneConfig.role} size="sm" />
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${laneConfig.badgeBg}`}>
                                {displayRoleName}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-300 font-bold">
                              {laneConfig.player}
                            </span>
                          </div>

                          <div className={`mt-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-center border ${
                            isAlta
                              ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                              : isMedia
                              ? "bg-amber-950/60 border-amber-500/50 text-amber-300"
                              : "bg-purple-950/60 border-purple-500/50 text-purple-300"
                          }`}>
                            {isAlta ? "PRIO ALTA" : isMedia ? "PRIO MEDIA" : "PRIO BAJA"}
                          </div>
                        </div>

                        {/* Listado de Picks por Tiers (S, A, B) con 1-Click Lock */}
                        <div className="p-2.5 space-y-3">
                          {[
                            { name: "TIER S", list: roleData.S, badgeStyle: "text-amber-400 border-amber-500/40 bg-amber-500/20" },
                            { name: "TIER A", list: roleData.A, badgeStyle: "text-purple-300 border-purple-500/40 bg-purple-500/20" },
                            { name: "TIER B", list: roleData.B, badgeStyle: "text-sky-300 border-sky-500/40 bg-sky-500/20" },
                          ].map(({ name, list, badgeStyle }) => (
                            <div key={name} className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className={`font-black px-1.5 py-0.2 rounded border ${badgeStyle}`}>
                                  {name}
                                </span>
                                <span className="text-zinc-500">({list.length})</span>
                              </div>

                              {list.length === 0 ? (
                                <div className="text-[10px] text-zinc-600 italic py-1 text-center">-</div>
                              ) : (
                                <div className="grid grid-cols-2 gap-1.5">
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
                                            ? `${entry.campeon_id} ya está en la mesa de draft`
                                            : `Lockear ${entry.campeon_id} en el slot activo (${activeSlot.side.toUpperCase()} ${activeSlot.type.toUpperCase()} #${activeSlot.index + 1})`
                                        }
                                        className={`group relative flex flex-col items-center p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                                          isUsed
                                            ? "bg-zinc-900/40 border-zinc-800 opacity-40 cursor-not-allowed"
                                            : "bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 hover:border-purple-400 hover:scale-105 shadow-sm active:scale-95"
                                        }`}
                                      >
                                        <div className="relative">
                                          <img
                                            src={getChampionAvatar(entry.campeon_id)}
                                            alt={entry.campeon_id}
                                            className={`h-10 w-10 sm:h-11 sm:w-11 rounded-lg object-cover shadow ${
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

                                          {/* Badge en la esquina */}
                                          {isUsed ? (
                                            <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-emerald-600 text-white text-[8px] font-mono font-bold shadow leading-none border border-emerald-400">
                                              ✓ MESA
                                            </span>
                                          ) : isFP ? (
                                            <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-emerald-500 text-black text-[9px] font-mono font-black border border-emerald-300 shadow leading-none">
                                              FP
                                            </span>
                                          ) : isLP ? (
                                            <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-purple-600 text-white text-[9px] font-mono font-black border border-purple-400 shadow leading-none">
                                              LP
                                            </span>
                                          ) : isRisky ? (
                                            <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-amber-500 text-black text-[9px] font-mono font-black border border-amber-300 shadow leading-none">
                                              Risky
                                            </span>
                                          ) : null}
                                        </div>

                                        <span className="text-[11px] font-bold text-zinc-200 group-hover:text-white mt-1 truncate max-w-full leading-tight">
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

                      {/* Warnings / Counters en el pie de columna */}
                      {(roleWarnings.length > 0 || roleCounters.length > 0) && (
                        <div className="p-2 m-2 rounded-xl bg-rose-950/20 border border-rose-500/30 text-[9px] font-mono space-y-1">
                          <span className="text-rose-400 font-bold block uppercase flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Intel de Línea
                          </span>
                          {roleWarnings.slice(0, 1).map((w, idx) => (
                            <p key={idx} className="text-zinc-300 truncate">
                              <strong className="text-rose-300">{w.champ}:</strong> {w.reason}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 4. BUSCADOR GENERAL & SELECTOR DE CUALQUIER CAMPEÓN PARA EL SLOT ACTIVO    */}
            {/* ========================================================================= */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    activeSlot.side === "blue"
                      ? "bg-blue-950 text-blue-300 border-blue-500/50"
                      : "bg-rose-950 text-rose-300 border-rose-500/50"
                  }`}>
                    Asignando a: {activeSlot.side.toUpperCase()} — {activeSlot.type.toUpperCase()} #{activeSlot.index + 1}
                  </span>
                  <span className="text-xs text-zinc-400">
                    O busca cualquier campeón del catálogo completo:
                  </span>
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="h-4 w-4 absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar campeón en catálogo..."
                    value={draftSearchInput}
                    onChange={(e) => setDraftSearchInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400 font-semibold"
                  />
                  {draftSearchInput && (
                    <button
                      type="button"
                      onClick={() => setDraftSearchInput("")}
                      className="absolute right-2.5 top-2 text-zinc-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Grid de campeones filtrados */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1.5 max-h-48 overflow-y-auto p-1">
                {(draftSearchInput.trim()
                  ? draftSearchMatches
                  : CHAMPIONS_CATALOG.filter((c) => !allUsedChampions.has(c.id.toLowerCase())).slice(0, 24)
                ).map((champ) => (
                  <button
                    key={champ.id}
                    type="button"
                    onClick={() => handleLockChampion(champ.name)}
                    className="flex flex-col items-center p-1.5 rounded-lg bg-zinc-900 hover:bg-purple-950/60 border border-zinc-800 hover:border-purple-400 transition-all text-center group cursor-pointer"
                  >
                    <img
                      src={getChampionAvatar(champ.id)}
                      alt={champ.name}
                      className="h-8 w-8 rounded object-cover border border-zinc-700 group-hover:border-purple-400"
                    />
                    <span className="text-[10px] font-bold text-white truncate max-w-full mt-0.5">
                      {champ.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. NOTAS TÁCTICAS DEL DRAFT // OBSERVACIONES DE LA PARTIDA */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Notas Tácticas del Draft // Adaptaciones de partida:
              </label>
              <textarea
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                placeholder="Apunta aquí la condición de victoria, hechizos de invocador a rastrear, pathing del jungla rival o instrucciones clave para el equipo..."
                rows={2}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
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
                                Lado {draft.nuestro_lado} •{" "}
                                {new Date(draft.created_at).toLocaleDateString()}
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
                        No hay drafts guardados todavía. Realiza un draft en la mesa y pulsa "Guardar Partida".
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
