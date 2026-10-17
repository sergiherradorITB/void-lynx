import React from "react";
import { CompositionData, PlayerChampionEntry, PlayerProfile, PLAYERS_LIST, PriorityLevel } from "@/data/staff-initial-data";
import { Champion, CHAMPIONS_CATALOG, findChampion, getChampionAvatar } from "@/data/champions";
import { RoleBadge, RoleIconOnly, RoleType } from "@/components/RoleBadge";
import {
  Crosshair,
  Shield,
  Check,
  LayoutGrid,
  Sparkles,
  Info,
  AlertTriangle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Table,
  CheckCircle2,
  Crown,
  Layers,
  Edit3,
  X,
  XCircle,
} from "lucide-react";
import { ActiveTab, CompDraftAnalysis, LaneConfig } from "../types";

interface TacticalAssistantTabProps {
  compositions: CompositionData[];
  currentComp: CompositionData;
  setSelectedCompId: (id: string) => void;
  compDraftAnalysis: CompDraftAnalysis;
  drafterViewMode: "vertical" | "matrix" | "cards";
  setDrafterViewMode: (mode: "vertical" | "matrix" | "cards") => void;
  matrixShowAll: boolean;
  setMatrixShowAll: (show: boolean) => void;
  drafterPickHighlight: "ALL" | "FP" | "LP" | "RISKY";
  setDrafterPickHighlight: (h: "ALL" | "FP" | "LP" | "RISKY") => void;
  playerChampions: PlayerChampionEntry[];
  handleOpenCreateComp: () => void;
  handleOpenEditComp: (comp: CompositionData) => void;
  setQuickAddRole: (role: RoleType | null) => void;
  handleCycleRolePriority: (compId: string, role: RoleType) => void;
  handleCyclePickTag: (id: string) => void;
  handleShiftTier: (id: string, direction: "up" | "down") => void;
  setQuickAddSearch: (s: string) => void;
  setQuickAddTier: (t: "S" | "A" | "B") => void;
  setQuickAddTag: (tag: "FP" | "LP" | "Risky" | "Normal") => void;
  getRoleChampsForComp: (compName: string, role: RoleType, playerName?: string) => {
    player: any;
    S: PlayerChampionEntry[];
    A: PlayerChampionEntry[];
    B: PlayerChampionEntry[];
    C: PlayerChampionEntry[];
  };
  handleRemoveChampFromComp: (id: string, compName: string) => void;
  verticalBoardRoles: LaneConfig[];
  setActiveTab: (tab: ActiveTab) => void;
}

export function TacticalAssistantTab({
  compositions,
  currentComp,
  setSelectedCompId,
  compDraftAnalysis,
  drafterViewMode,
  setDrafterViewMode,
  matrixShowAll,
  setMatrixShowAll,
  drafterPickHighlight,
  setDrafterPickHighlight,
  playerChampions,
  handleOpenCreateComp,
  handleOpenEditComp,
  setQuickAddRole,
  handleCycleRolePriority,
  handleCyclePickTag,
  handleShiftTier,
  setQuickAddSearch,
  setQuickAddTier,
  setQuickAddTag,
  getRoleChampsForComp,
  handleRemoveChampFromComp,
  verticalBoardRoles,
  setActiveTab,
}: TacticalAssistantTabProps) {
  const VERTICAL_BOARD_ROLES = verticalBoardRoles;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
            {/* Selector de Composición */}
            <div className="bg-zinc-950/80 border border-purple-900/40 rounded-xl p-5 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white flex items-center gap-3">
                    <Crosshair className="h-6 w-6 text-purple-400" />
                    <span>Planificación de Draft por Composición</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Selecciona qué composición táctica va a ejecutar Void Lynx para obtener los First Picks seguros, las advertencias de picks a ciegas y los counters a banear.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="text-xs text-zinc-400 uppercase font-mono">Cobertura del Equipo:</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono ${
                      compDraftAnalysis.coveredRolesCount === 5
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-600/40"
                        : "bg-amber-950 text-amber-300 border border-amber-600/40"
                    }`}
                  >
                    {compDraftAnalysis.coveredRolesCount}/5 Roles con S/A
                  </span>
                </div>
              </div>

              {/* Botones de Selección Rápida de Composición — Más Grandes, Fáciles y Sin Efecto de Bola */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                {compositions.map((comp) => {
                  const isSelected = comp.id === currentComp.id;
                  const isHigh = comp.prioridad.includes("Alta");
                  const isMed = comp.prioridad.includes("Media");

                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedCompId(comp.id)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[96px] cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-br from-purple-900/70 via-purple-950/90 to-zinc-950 border-purple-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.45)] ring-2 ring-purple-400/80 scale-[1.02]"
                          : "bg-zinc-950/80 border-zinc-800/90 text-zinc-300 hover:border-purple-500/60 hover:bg-zinc-900/90 hover:scale-[1.01]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-display font-black text-base sm:text-lg uppercase tracking-wide text-white leading-tight">
                          {comp.nombre}
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-purple-300 bg-purple-950/90 border border-purple-500/50 px-2 py-0.5 rounded-full shrink-0">
                            <Check className="h-3 w-3 text-purple-400" /> ACTIVA
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/5">
                        <span className="text-[11px] font-mono text-zinc-400 font-medium truncate">
                          {comp.enfoque}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isHigh
                              ? "bg-rose-950/90 text-rose-300 border border-rose-500/50"
                              : isMed
                              ? "bg-amber-950/90 text-amber-300 border border-amber-500/50"
                              : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                          }`}
                        >
                          {comp.prioridad.replace(" Prioridad", "")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Ficha Resumen de la Composición Seleccionada con Counters Destacados (Solo fuera de Pizarra Vertical) */}
              {drafterViewMode !== "vertical" && (
                <div className="mt-6 pt-5 border-t border-purple-900/40 space-y-4">
                  {/* Fila 1: Concepto, Enfoque y Prioridad */}
                  <div className="flex flex-col lg:flex-row gap-4 items-start justify-between bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
                    <div className="flex-1">
                      <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                        <Crosshair className="h-4 w-4 text-purple-400" />
                        CONCEPTO TÁCTICO & WIN CONDITION:
                      </span>
                      <p className="text-sm sm:text-base text-zinc-100 leading-relaxed font-sans font-medium">
                        {currentComp.descripcion}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs font-mono shrink-0">
                      <div className="bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-800 shadow">
                        <span className="text-zinc-500 block text-[10px] uppercase font-bold">ENFOQUE:</span>
                        <span className="text-white font-bold text-xs sm:text-sm">{currentComp.enfoque}</span>
                      </div>
                      <div className="bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-800 shadow">
                        <span className="text-zinc-500 block text-[10px] uppercase font-bold">PRIORIDAD DRAFT:</span>
                        <span className="text-amber-400 font-bold text-xs sm:text-sm">{currentComp.prioridad}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fila 2: MÓDULO DESTACADO DE COUNTERS (AMENAZAS Y CAMPEONES A EVITAR) */}
                  <div className="rounded-2xl border-2 border-rose-500/50 bg-gradient-to-br from-rose-950/40 via-zinc-950 to-zinc-950 p-5 sm:p-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-rose-900/40">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-sm sm:text-base font-display font-extrabold text-rose-200 uppercase tracking-wider block">
                            COUNTERS DIRECTOS & AMENAZAS PARA "{currentComp.nombre}"
                          </span>
                          <span className="text-xs text-rose-300/70 font-mono">
                            Peligros clave que desmontan la estrategia o castigan la composición
                          </span>
                        </div>
                      </div>

                      {/* Bans sugeridos rápidos */}
                      {currentComp.bans_recomendados?.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-400 uppercase font-bold">Bans recomendados:</span>
                          <div className="flex items-center gap-1.5">
                            {currentComp.bans_recomendados.map((b) => (
                              <span
                                key={b}
                                className="bg-rose-950 text-rose-200 border border-rose-500/60 font-mono font-bold text-xs px-2.5 py-1 rounded-lg shadow"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-black/50 border border-rose-900/40 rounded-xl p-3.5 mb-4">
                      <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
                        {currentComp.counters_descripcion || "No se han definido counters directos para esta composición."}
                      </p>
                    </div>

                    {/* Campeones Counter con retratos grandes y legibles */}
                    {currentComp.counters_campeones.length > 0 && (
                      <div>
                        <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-2.5">
                          Campeones rivales peligrosos a denegar o banear ({currentComp.counters_campeones.length}):
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {currentComp.counters_campeones.map((cId) => (
                            <div
                              key={cId}
                              className="group flex items-center gap-3 bg-zinc-900/90 hover:bg-rose-950/60 border border-rose-500/40 hover:border-rose-400 rounded-xl p-2 pr-4 transition-all shadow-lg hover:scale-105"
                            >
                              <img
                                src={getChampionAvatar(cId)}
                                alt={cId}
                                className="h-12 w-12 rounded-lg object-cover border-2 border-rose-500/50 group-hover:border-rose-400 shadow shrink-0"
                              />
                              <div>
                                <span className="font-bold text-sm text-white block leading-tight">{cId}</span>
                                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                  <AlertTriangle className="h-3 w-3 shrink-0" /> Counter
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* BARRA DE HERRAMIENTAS Y VISTAS: PIZARRA VERTICAL vs MATRIZ EXCEL 8 COMPOS vs CARDS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/90 border border-purple-900/40 p-4 rounded-xl shadow-xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setDrafterViewMode("vertical")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                      drafterViewMode === "vertical"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                    <span>Pizarra Vertical ({currentComp.nombre})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrafterViewMode("matrix")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                      drafterViewMode === "matrix"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Table className="h-4 w-4" />
                    <span>Matriz General (8 Compos)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrafterViewMode("cards")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                      drafterViewMode === "cards"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Apertura & First Picks</span>
                  </button>
                </div>

                {drafterViewMode === "matrix" && (
                  <button
                    type="button"
                    onClick={() => setMatrixShowAll(!matrixShowAll)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-mono font-semibold transition-colors ${
                      matrixShowAll
                        ? "bg-purple-950 text-purple-200 border-purple-500/50"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    {matrixShowAll ? "✓ Vista Panorámica (Todas las 8 Compos)" : `Solo ${currentComp.nombre}`}
                  </button>
                )}
              </div>

              {/* Botones de acción: Editar Compo & Crear Compo */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => handleOpenEditComp(currentComp)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-purple-500 text-zinc-200 text-xs font-semibold transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5 text-purple-400" />
                  <span>Editar {currentComp.nombre}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenCreateComp}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nueva Composición</span>
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* PIZARRA TÁCTICA VERTICAL (DEDICADA A LA COMPOSICIÓN ACTIVA) */}
            {/* ========================================================= */}
            {drafterViewMode === "vertical" && (
              <div className="space-y-6">
                {/* ========================================================= */}
                {/* 1. INFORMACIÓN GENERAL ARRIBA (5 BLOQUES DE LA MATRIZ)     */}
                {/* ========================================================= */}
                <div className="bg-zinc-950 border border-purple-900/40 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
                  {/* Fila de Título y Fases */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        <Crosshair className="h-4 w-4" /> GUÍA ESTRATÉGICA DE COMPOSICIÓN & DRAFT
                      </span>
                      <span className="bg-purple-900/60 border border-purple-400/40 text-purple-200 text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
                        {currentComp.nombre}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <div className="bg-black/60 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <span className="text-zinc-500 text-[10px] uppercase font-bold">FASE 1 (B1 / R1-R2):</span>
                        <span className="text-emerald-400 font-black">
                          {VERTICAL_BOARD_ROLES.filter(r => (currentComp.role_priorities?.[r.role] || "Media") === "Alta").map(r => r.role).join(", ") || "Según bans"}
                        </span>
                      </div>
                      <div className="bg-black/60 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <span className="text-zinc-500 text-[10px] uppercase font-bold">GUARDAR R4-R5:</span>
                        <span className="text-rose-400 font-black">
                          {VERTICAL_BOARD_ROLES.filter(r => (currentComp.role_priorities?.[r.role] || "Media") === "Baja").map(r => r.role).join(", ") || "Counterpick"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Los 5 Bloques Informativos de la Matriz (1 fila panorámica) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
                    {/* BLOQUE 1: COMPOSICIÓN TÁCTICA */}
                    <div className="flex flex-col justify-between p-4 rounded-xl bg-zinc-900/60 border border-purple-800/40 shadow-inner">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                            COMPOSICIÓN TÁCTICA
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenEditComp(currentComp)}
                            title="Editar detalles de esta composición"
                            className="p-1 rounded text-zinc-400 hover:text-purple-300 hover:bg-purple-950/60 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <h2 className="text-xl font-display font-black text-white tracking-wide uppercase">
                          {currentComp.nombre}
                        </h2>
                        <span className="inline-block mt-0.5 text-xs font-mono font-semibold text-zinc-400">
                          {currentComp.enfoque || "Mid / Late Game"}
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
                        Void Lynx Draft System
                      </div>
                    </div>

                    {/* BLOQUE 2: PRIORIDAD DRAFT */}
                    <div className="flex flex-col justify-between p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 shadow-inner">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                          PRIORIDAD DRAFT
                        </span>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rose-500/60 bg-rose-950/50 text-rose-300 font-bold text-xs shadow-md shadow-rose-950/40">
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                          <span>{currentComp.prioridad || "Alta Prioridad"}</span>
                        </div>
                      </div>

                      {currentComp.first_pick_safe && currentComp.first_pick_safe.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-zinc-800/80">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block mb-1">
                            FP Seguros:
                          </span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {currentComp.first_pick_safe.map((c) => (
                              <span key={c} className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BLOQUE 3: CONCEPTO / OBJETIVO CLAVE */}
                    <div className="flex flex-col p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 shadow-inner">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-purple-400" /> CONCEPTO / OBJETIVO CLAVE
                      </span>
                      <p className="text-xs text-zinc-300 font-normal leading-relaxed overflow-y-auto max-h-[140px] pr-1">
                        {currentComp.descripcion || "Sin descripción táctica registrada."}
                      </p>
                    </div>

                    {/* BLOQUE 4: COUNTERS DIRECTOS */}
                    <div className="flex flex-col p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 shadow-inner">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" /> COUNTERS DIRECTOS
                      </span>
                      <p className="text-xs text-zinc-300 font-normal leading-relaxed overflow-y-auto max-h-[90px] pr-1">
                        {currentComp.counters_descripcion || "Amenazas de iniciación frontal directa o asedio split."}
                      </p>
                      {currentComp.bans_recomendados && currentComp.bans_recomendados.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-rose-900/40">
                          <span className="text-[9px] font-mono font-bold text-rose-300 uppercase block mb-1">
                            Bans Sugeridos:
                          </span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {currentComp.bans_recomendados.map((b) => (
                              <span key={b} className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-950/90 border border-rose-600/50 text-rose-200">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BLOQUE 5: COUNTERS (CAMPEONES) */}
                    <div className="flex flex-col p-4 rounded-xl bg-zinc-900/60 border border-rose-900/40 shadow-inner">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                          <Shield className="h-3.5 w-3.5 text-rose-400" /> COUNTERS (CAMPEONES)
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-950 border border-rose-500/40 text-rose-300">
                          {(currentComp.counters_campeones || []).length}
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto max-h-[140px] pr-1">
                        {(currentComp.counters_campeones || []).length === 0 ? (
                          <div className="text-xs text-zinc-500 italic py-3 text-center">
                            Sin campeones counter
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-1.5">
                            {currentComp.counters_campeones.map((cId) => (
                              <div
                                key={cId}
                                className="group relative flex flex-col items-center bg-black/60 border border-rose-500/50 rounded-lg p-1 shadow hover:border-rose-400 transition-all"
                                title={`Counter: ${cId}`}
                              >
                                <img
                                  src={getChampionAvatar(cId)}
                                  alt={cId}
                                  className="h-9 w-9 rounded object-cover border border-rose-500/40 group-hover:scale-105 transition-transform"
                                />
                                <span className="text-[9px] font-bold text-rose-200 mt-0.5 truncate max-w-[50px] text-center leading-tight">
                                  {cId}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenEditComp(currentComp)}
                        className="mt-2 w-full py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 hover:border-rose-400 text-rose-300 text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="h-3 w-3" /> Modificar Counters
                      </button>
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* 2. PICKS ABAJO: 5 COLUMNAS VERTICALES GRANDES             */}
                {/* TOP - JNGL - MID - ADC - SUPP                             */}
                {/* ========================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 xl:gap-4 items-stretch">
                  {VERTICAL_BOARD_ROLES.map((laneConfig) => {
                    const roleData = getRoleChampsForComp(currentComp.nombre, laneConfig.role, laneConfig.player);
                    const prio = currentComp.role_priorities?.[laneConfig.role] || "Media";

                    // Warnings for this role
                    const roleWarnings = (currentComp.no_first_pick_reasons || []).filter((w) => {
                      const champ = findChampion(w.champ);
                      if (champ && champ.roles.includes(laneConfig.role)) return true;
                      return [...roleData.S, ...roleData.A, ...roleData.B].some(
                        (e) => e.campeon_id.toLowerCase() === w.champ.toLowerCase()
                      );
                    });

                    // Direct counters from comp that match this role
                    const roleCounters = (currentComp.counters_campeones || []).filter((cId) => {
                      const champ = findChampion(cId);
                      return champ && champ.roles.includes(laneConfig.role);
                    });

                    // Role display name: JNGL for JGL
                    const displayRoleName = laneConfig.role === "JGL" ? "JNGL" : laneConfig.role;

                    const isAlta = prio === "Alta";
                    const isMedia = prio === "Media";
                    const isBaja = prio === "Baja";

                    return (
                      <div
                        key={laneConfig.role}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950/90 flex flex-col justify-between overflow-hidden shadow-xl transition-all hover:border-zinc-700"
                      >
                        {/* CONTENIDO SUPERIOR Y TIERS */}
                        <div className="flex-1 flex flex-col">
                          {/* CABECERA DE LA COLUMNA DE ROL */}
                          <div className="p-3.5 bg-zinc-900/60 border-b border-zinc-800">
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-black/70 border border-zinc-700/60 shadow-sm">
                                  <RoleIconOnly role={laneConfig.role} size="sm" />
                                </div>
                                <span className={`px-2 py-0.5 rounded text-xs font-mono font-black uppercase tracking-wider ${laneConfig.badgeBg}`}>
                                  {displayRoleName}
                                </span>
                              </div>
                              <span className="font-display font-black text-sm text-white tracking-wide truncate">
                                {laneConfig.player}
                              </span>
                            </div>

                            {/* BOTÓN PRIO LIMPIO ESTILO MATRIZ OFICIAL */}
                            <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-zinc-800/60">
                              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                                PRIO:
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCycleRolePriority(currentComp.id, laneConfig.role)}
                                title="Haz clic para alternar: Baja (Verde) → Media (Amarillo) → Alta (Rojo)"
                                className={`px-3 py-1 rounded-md text-xs font-mono font-black uppercase tracking-wider border transition-all cursor-pointer shadow-sm ${
                                  isAlta
                                    ? "bg-rose-950/40 border-rose-500/80 text-rose-300 hover:bg-rose-900/60"
                                    : isMedia
                                    ? "bg-amber-950/40 border-amber-500/80 text-amber-300 hover:bg-amber-900/60"
                                    : "bg-emerald-950/40 border-emerald-500/80 text-emerald-300 hover:bg-emerald-900/60"
                                }`}
                              >
                                {prio.toUpperCase()}
                              </button>
                            </div>
                          </div>

                          {/* TIERS DE PICKS (S, A, B) */}
                          <div className="p-3 space-y-3.5 flex-1">
                            {[
                              { tierName: "TIER S", list: roleData.S, badgeStyle: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
                              { tierName: "TIER A", list: roleData.A, badgeStyle: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
                              { tierName: "TIER B", list: roleData.B, badgeStyle: "bg-sky-500/20 text-sky-300 border-sky-500/40" },
                            ].map(({ tierName, list, badgeStyle }, tIdx) => (
                              <div key={tierName} className={`space-y-1.5 ${tIdx > 0 ? "pt-2.5 border-t border-zinc-800/60" : ""}`}>
                                <div className="flex items-center justify-between">
                                  <span className={`text-[11px] font-black px-2 py-0.5 rounded border shadow-sm ${badgeStyle}`}>
                                    {tierName}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono">
                                    ({list.length})
                                  </span>
                                </div>

                                {list.length === 0 ? (
                                  <div className="text-[10px] text-zinc-600 italic py-2 text-center bg-zinc-900/20 rounded-lg border border-dashed border-zinc-800">
                                    -
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-2">
                                    {list.map((entry) => {
                                      const tag = entry.pick_tag || (entry.is_first_pickable ? "FP" : undefined);
                                      const isFP = tag === "FP";
                                      const isLP = tag === "LP";
                                      const isRisky = tag === "Risky";

                                      return (
                                        <div
                                          key={entry.id}
                                          className="group relative flex flex-col items-center p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/90 hover:border-purple-500/50 transition-all cursor-pointer shadow-sm"
                                        >
                                          {/* Avatar con Tag en la esquina superior derecha */}
                                          <div className="relative">
                                            <img
                                              src={getChampionAvatar(entry.campeon_id)}
                                              alt={entry.campeon_id}
                                              className="h-11 w-11 sm:h-12 sm:w-12 rounded-lg object-cover border border-zinc-700/80 group-hover:border-purple-400 transition-colors shadow"
                                            />

                                            {/* Badge FP / LP / Risky en la esquina superior derecha */}
                                            {isFP && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleCyclePickTag(entry.id); }}
                                                title="First Pick Seguro (Clic para cambiar)"
                                                className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-emerald-500 text-black text-[9px] font-mono font-black shadow border border-emerald-300 leading-none cursor-pointer hover:scale-110 transition-transform"
                                              >
                                                FP
                                              </button>
                                            )}
                                            {isLP && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleCyclePickTag(entry.id); }}
                                                title="Last Pick R4/R5 (Clic para cambiar)"
                                                className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-purple-600 text-white text-[9px] font-mono font-black shadow border border-purple-400 leading-none cursor-pointer hover:scale-110 transition-transform"
                                              >
                                                LP
                                              </button>
                                            )}
                                            {isRisky && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleCyclePickTag(entry.id); }}
                                                title="Pick de Riesgo (Clic para cambiar)"
                                                className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-amber-500 text-black text-[9px] font-mono font-black shadow border border-amber-300 leading-none cursor-pointer hover:scale-110 transition-transform"
                                              >
                                                Risky
                                              </button>
                                            )}
                                            {!tag && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleCyclePickTag(entry.id); }}
                                                title="Asignar tag (FP / LP / Risky)"
                                                className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-zinc-800 text-zinc-500 text-[8px] font-mono opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                                              >
                                                +tag
                                              </button>
                                            )}
                                          </div>

                                          {/* Nombre del Campeón */}
                                          <span className="text-xs font-bold text-zinc-200 mt-1.5 truncate max-w-full text-center leading-tight group-hover:text-white">
                                            {entry.campeon_id}
                                          </span>

                                          {/* Micro-acciones en Hover */}
                                          <div className="absolute inset-0 bg-black/85 backdrop-blur-[1px] rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                                            {tierName !== "TIER S" && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleShiftTier(entry.id, "up"); }}
                                                title="Subir de Tier"
                                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                                              >
                                                <ChevronUp className="h-3.5 w-3.5" />
                                              </button>
                                            )}
                                            {tierName !== "TIER B" && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleShiftTier(entry.id, "down"); }}
                                                title="Bajar de Tier"
                                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                                              >
                                                <ChevronDown className="h-3.5 w-3.5" />
                                              </button>
                                            )}
                                            <button
                                              type="button"
                                              onClick={(e) => { e.stopPropagation(); handleRemoveChampFromComp(entry.id, currentComp.nombre); }}
                                              title="Quitar de esta compo"
                                              className="p-1 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 transition-colors"
                                            >
                                              <X className="h-3.5 w-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* PIE DE COLUMNA: BOTÓN DE AÑADIR PICK & INTEL DE LÍNEA */}
                        <div className="p-3 pt-0 space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              setQuickAddRole(laneConfig.role);
                              setQuickAddSearch("");
                              setQuickAddTier("S");
                              setQuickAddTag("FP");
                            }}
                            className="w-full py-1.5 px-2 rounded-xl border border-dashed border-zinc-700 hover:border-purple-400 bg-zinc-900/50 hover:bg-purple-950/30 text-zinc-400 hover:text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                          >
                            <Plus className="h-3.5 w-3.5 text-purple-400" />
                            <span>+ Añadir Pick ({displayRoleName})</span>
                          </button>

                          {(roleWarnings.length > 0 || roleCounters.length > 0) && (
                            <div className="p-2 rounded-xl bg-rose-950/20 border border-rose-500/30 text-[10px] space-y-1">
                              <span className="font-bold text-rose-400 flex items-center gap-1 uppercase font-mono text-[9px]">
                                <AlertTriangle className="h-3 w-3" /> Intel de Línea
                              </span>
                              {roleWarnings.slice(0, 1).map((w, idx) => (
                                <p key={idx} className="text-zinc-300 leading-tight">
                                  <strong className="text-rose-300">{w.champ}:</strong> {w.reason}
                                </p>
                              ))}
                              {roleCounters.length > 0 && (
                                <div className="flex items-center gap-1 pt-1 border-t border-rose-900/30 flex-wrap">
                                  <span className="text-zinc-500 text-[9px] font-mono">Counters:</span>
                                  {roleCounters.slice(0, 3).map((cId) => (
                                    <span key={cId} className="text-[9px] font-bold text-rose-300 bg-black/60 px-1 rounded border border-rose-500/40">
                                      {cId}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MATRIZ EXCEL TÁCTICA DE 5 COLUMNAS (ESTILO HOJA DE CÁLCULO) */}
            {/* ========================================================= */}
            {drafterViewMode === "matrix" && (
              <div className="space-y-4">
                {/* Tabla Horizontal Estilo Excel con Counters Grandes y Legibles */}
                <div className="overflow-x-auto rounded-2xl border border-purple-900/30 bg-zinc-950 shadow-2xl">
                  <table className="w-full border-collapse text-left text-xs min-w-[1550px]">
                    <thead>
                      <tr className="bg-zinc-900/90 border-b border-zinc-800 text-[11px] font-mono uppercase tracking-wider text-zinc-300">
                        <th className="p-3.5 w-48 border-r border-zinc-800">COMPOSICIÓN TÁCTICA</th>
                        <th className="p-3.5 w-28 border-r border-zinc-800 text-center">PRIORIDAD DRAFT</th>
                        <th className="p-3.5 w-56 border-r border-zinc-800">CONCEPTO / OBJETIVO CLAVE</th>
                        <th className="p-3.5 w-72 border-r border-zinc-800 text-rose-400">COUNTERS DIRECTOS</th>
                        <th className="p-3.5 w-80 border-r border-zinc-800 text-rose-400">COUNTERS (CAMPEONES)</th>
                        <th className="p-2 w-16 border-r border-zinc-800 text-center font-bold text-zinc-400">
                          TIER (★ FP)
                        </th>
                        <th className="p-3 w-48 border-r border-zinc-800 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold">
                            <RoleIconOnly role="TOP" size="sm" />
                            <span>TOP - Kaserolo</span>
                          </div>
                        </th>
                        <th className="p-3 w-48 border-r border-zinc-800 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                            <RoleIconOnly role="JGL" size="sm" />
                            <span>JGL - Tamudor</span>
                          </div>
                        </th>
                        <th className="p-3 w-48 border-r border-zinc-800 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-cyan-400 font-bold">
                            <RoleIconOnly role="MID" size="sm" />
                            <span>MID - Upss</span>
                          </div>
                        </th>
                        <th className="p-3 w-48 border-r border-zinc-800 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-purple-400 font-bold">
                            <RoleIconOnly role="ADC" size="sm" />
                            <span>ADC - arnoop88</span>
                          </div>
                        </th>
                        <th className="p-3 w-48 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold">
                            <RoleIconOnly role="SUPP" size="sm" />
                            <span>SUPP - Liber</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(matrixShowAll ? compositions : [currentComp]).map((comp, compIdx) => {
                        const topData = getRoleChampsForComp(comp.nombre, "TOP", "Kaserolo");
                        const jglData = getRoleChampsForComp(comp.nombre, "JGL", "Tamudor");
                        const midData = getRoleChampsForComp(comp.nombre, "MID", "Upss");
                        const adcData = getRoleChampsForComp(comp.nombre, "ADC", "arnoop88");
                        const suppData = getRoleChampsForComp(comp.nombre, "SUPP", "Liber");

                        const roleCols = [
                          { role: "TOP" as RoleType, data: topData },
                          { role: "JGL" as RoleType, data: jglData },
                          { role: "MID" as RoleType, data: midData },
                          { role: "ADC" as RoleType, data: adcData },
                          { role: "SUPP" as RoleType, data: suppData },
                        ];

                        return (
                          <React.Fragment key={comp.id}>
                            {/* FILA 1: PRIO */}
                            <tr className={`border-t-2 border-purple-900/50 ${compIdx % 2 === 0 ? "bg-black/40" : "bg-zinc-950"}`}>
                              {/* COL 1: Composición */}
                              <td rowSpan={4} className="p-4 align-top border-r border-zinc-800 bg-zinc-950/70">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-display font-extrabold text-sm text-white tracking-wide uppercase">
                                      {comp.nombre}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditComp(comp)}
                                      title="Editar composición"
                                      className="text-zinc-500 hover:text-purple-400 p-1 rounded hover:bg-zinc-800 transition-colors"
                                    >
                                      <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <span className="text-[10px] font-mono text-zinc-500 block">
                                    {comp.enfoque}
                                  </span>
                                  {comp.id !== currentComp.id && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedCompId(comp.id)}
                                      className="text-[10px] text-purple-400 hover:text-purple-300 font-mono font-semibold"
                                    >
                                      Seleccionar →
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* COL 2: Prioridad */}
                              <td rowSpan={4} className="p-3 align-top border-r border-zinc-800 bg-zinc-950/50 text-center">
                                <span
                                  className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                    comp.prioridad.includes("Alta")
                                      ? "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                                      : comp.prioridad.includes("Media")
                                      ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                  }`}
                                >
                                  {comp.prioridad}
                                </span>
                              </td>

                              {/* COL 3: Concepto */}
                              <td rowSpan={4} className="p-3.5 align-top border-r border-zinc-800 text-xs text-zinc-300 leading-relaxed bg-zinc-950/40">
                                {comp.descripcion}
                              </td>

                              {/* COL 4: Counters Directos (Texto Destacado en Rojo) */}
                              <td rowSpan={4} className="p-4 align-top border-r border-zinc-800 bg-rose-950/25 text-rose-200">
                                <div className="flex items-start gap-2.5">
                                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                                  <p className="text-xs text-rose-100 font-medium leading-relaxed">
                                    {comp.counters_descripcion}
                                  </p>
                                </div>
                              </td>

                              {/* COL 5: Counters (Campeones) — Retratos Grandes y Legibles */}
                              <td rowSpan={4} className="p-4 align-top border-r border-zinc-800 bg-rose-950/15">
                                <div className="flex flex-wrap gap-2.5">
                                  {comp.counters_campeones.map((cId) => (
                                    <div
                                      key={cId}
                                      title={`Counter: ${cId}`}
                                      className="group flex flex-col items-center bg-zinc-900 border-2 border-rose-500/50 hover:border-rose-400 rounded-xl p-2 transition-all shadow-md hover:scale-105"
                                    >
                                      <img
                                        src={getChampionAvatar(cId)}
                                        alt={cId}
                                        className="h-12 w-12 rounded-lg object-cover shadow border border-rose-500/40"
                                      />
                                      <span className="text-[11px] font-mono font-bold text-rose-200 mt-1 max-w-[56px] truncate text-center">
                                        {cId}
                                      </span>
                                    </div>
                                  ))}
                                  {comp.counters_campeones.length === 0 && (
                                    <span className="text-xs text-zinc-500 italic">Sin campeones asignados</span>
                                  )}
                                </div>
                              </td>

                              {/* COL 6: TIER LABEL (PRIO) */}
                              <td className="p-2 border-r border-zinc-800 text-center font-mono font-bold text-[10px] text-zinc-400 bg-zinc-900/60">
                                PRIO
                              </td>

                              {/* 5 COLUMNAS DE ROLES: FILA PRIO */}
                              {roleCols.map(({ role }) => {
                                const prio = comp.role_priorities?.[role] || "Media";
                                return (
                                  <td
                                    key={role}
                                    className="p-2 border-r border-zinc-800 last:border-r-0 text-center bg-zinc-900/30"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleCycleRolePriority(comp.id, role)}
                                      title="Clic para cambiar prioridad de pickeo (Baja -> Media -> Alta)"
                                      className={`w-full py-1 px-2 rounded font-mono text-[10px] font-bold uppercase transition-all shadow ${
                                        prio === "Alta"
                                          ? "bg-rose-950/90 text-rose-300 border border-rose-500/60 hover:bg-rose-900/80"
                                          : prio === "Media"
                                          ? "bg-amber-950/90 text-amber-300 border border-amber-500/60 hover:bg-amber-900/80"
                                          : "bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 hover:bg-emerald-900/80"
                                      }`}
                                    >
                                      {prio}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>

                            {/* FILA 2: TIER S */}
                            <tr className="border-t border-zinc-800/60">
                              <td className="p-2 border-r border-zinc-800 text-center font-mono font-extrabold text-xs text-amber-400 bg-amber-950/20">
                                S
                              </td>
                              {roleCols.map(({ role, data }) => (
                                <td key={role} className="p-2 border-r border-zinc-800 last:border-r-0 align-top bg-black/20">
                                  <div className="flex flex-wrap gap-1.5 min-h-[38px] items-center">
                                    {data.S.length > 0 ? (
                                      data.S.map((entry) => {
                                        const champ = findChampion(entry.campeon_id);
                                        const isFp = entry.pick_tag === "FP" || (!entry.pick_tag && entry.is_first_pickable !== false);
                                        const isLp = entry.pick_tag === "LP";
                                        const isRisky = entry.pick_tag === "Risky";
                                        return (
                                          <div
                                            key={entry.id}
                                            onClick={() => handleCyclePickTag(entry.id)}
                                            title={`${champ?.name || entry.campeon_id} (${entry.tier}) — Clic para alternar tag (FP/LP/Risky)`}
                                            className="relative group cursor-pointer"
                                          >
                                            <img
                                              src={getChampionAvatar(entry.campeon_id)}
                                              alt={entry.campeon_id}
                                              className="h-9 w-9 rounded-md object-cover border border-amber-500/40 group-hover:border-amber-400 shadow group-hover:scale-105 transition-all"
                                            />
                                            {isFp && (
                                              <span className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                FP
                                              </span>
                                            )}
                                            {isLp && (
                                              <span className="absolute -top-1 -right-1 bg-rose-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                LP
                                              </span>
                                            )}
                                            {isRisky && (
                                              <span className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-mono font-bold text-black px-1 rounded shadow">
                                                Risky
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <span className="text-[10px] text-zinc-650 font-mono italic">-</span>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>

                            {/* FILA 3: TIER A */}
                            <tr className="border-t border-zinc-800/60">
                              <td className="p-2 border-r border-zinc-800 text-center font-mono font-extrabold text-xs text-purple-300 bg-purple-950/20">
                                A
                              </td>
                              {roleCols.map(({ role, data }) => (
                                <td key={role} className="p-2 border-r border-zinc-800 last:border-r-0 align-top bg-black/20">
                                  <div className="flex flex-wrap gap-1.5 min-h-[38px] items-center">
                                    {data.A.length > 0 ? (
                                      data.A.map((entry) => {
                                        const champ = findChampion(entry.campeon_id);
                                        const isFp = entry.pick_tag === "FP" || (!entry.pick_tag && entry.is_first_pickable !== false);
                                        const isLp = entry.pick_tag === "LP";
                                        const isRisky = entry.pick_tag === "Risky";
                                        return (
                                          <div
                                            key={entry.id}
                                            onClick={() => handleCyclePickTag(entry.id)}
                                            title={`${champ?.name || entry.campeon_id} (${entry.tier}) — Clic para alternar tag (FP/LP/Risky)`}
                                            className="relative group cursor-pointer"
                                          >
                                            <img
                                              src={getChampionAvatar(entry.campeon_id)}
                                              alt={entry.campeon_id}
                                              className="h-9 w-9 rounded-md object-cover border border-purple-500/40 group-hover:border-purple-400 shadow group-hover:scale-105 transition-all"
                                            />
                                            {isFp && (
                                              <span className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                FP
                                              </span>
                                            )}
                                            {isLp && (
                                              <span className="absolute -top-1 -right-1 bg-rose-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                LP
                                              </span>
                                            )}
                                            {isRisky && (
                                              <span className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-mono font-bold text-black px-1 rounded shadow">
                                                Risky
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <span className="text-[10px] text-zinc-650 font-mono italic">-</span>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>

                            {/* FILA 4: TIER B */}
                            <tr className="border-t border-zinc-800/60">
                              <td className="p-2 border-r border-zinc-800 text-center font-mono font-extrabold text-xs text-blue-300 bg-blue-950/20">
                                B
                              </td>
                              {roleCols.map(({ role, data }) => (
                                <td key={role} className="p-2 border-r border-zinc-800 last:border-r-0 align-top bg-black/20">
                                  <div className="flex flex-wrap gap-1.5 min-h-[38px] items-center">
                                    {data.B.length > 0 ? (
                                      data.B.map((entry) => {
                                        const champ = findChampion(entry.campeon_id);
                                        const isFp = entry.pick_tag === "FP";
                                        const isLp = entry.pick_tag === "LP" || (!entry.pick_tag && comp.no_first_pick_reasons?.some((r) => r.champ.toLowerCase() === entry.campeon_id.toLowerCase()));
                                        const isRisky = entry.pick_tag === "Risky";
                                        return (
                                          <div
                                            key={entry.id}
                                            onClick={() => handleCyclePickTag(entry.id)}
                                            title={`${champ?.name || entry.campeon_id} (${entry.tier}) — Clic para alternar tag (FP/LP/Risky)`}
                                            className="relative group cursor-pointer"
                                          >
                                            <img
                                              src={getChampionAvatar(entry.campeon_id)}
                                              alt={entry.campeon_id}
                                              className="h-9 w-9 rounded-md object-cover border border-blue-500/40 group-hover:border-blue-400 shadow group-hover:scale-105 transition-all"
                                            />
                                            {isFp && (
                                              <span className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                FP
                                              </span>
                                            )}
                                            {isLp && (
                                              <span className="absolute -top-1 -right-1 bg-rose-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                LP
                                              </span>
                                            )}
                                            {isRisky && (
                                              <span className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-mono font-bold text-black px-1 rounded shadow">
                                                Risky
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <span className="text-[10px] text-zinc-650 font-mono italic">-</span>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VISTA 3: FICHAS TÁCTICAS DE APERTURA (QUÉ FP vs QUÉ NO FP) */}
            {/* ========================================================= */}
            {drafterViewMode === "cards" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* QUÉ SE PUEDE FIRST-PICKEAR */}
                <div className="bg-gradient-to-br from-emerald-950/20 to-zinc-950 border border-emerald-900/40 rounded-xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base uppercase tracking-wider text-emerald-300">
                        ¿Qué SE PUEDE First-Pickear?
                      </h3>
                      <p className="text-[11px] text-zinc-400">
                        Picks de apertura seguros (B1 / R1-R2) que no delatan la composición ni son vulnerables a hard-counters.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {compDraftAnalysis.safeFirstPicks.length > 0 ? (
                      compDraftAnalysis.safeFirstPicks.map((entry) => {
                        const champ = findChampion(entry.campeon_id);
                        const player = PLAYERS_LIST.find((p: PlayerProfile) => p.name === entry.jugador);
                        return (
                          <div
                            key={entry.id}
                            className="flex items-center gap-3 bg-zinc-900/80 border border-emerald-800/30 rounded-lg p-2.5 hover:border-emerald-500/50 transition-colors"
                          >
                            <div className="relative shrink-0">
                              <img
                                src={getChampionAvatar(entry.campeon_id)}
                                alt={entry.campeon_id}
                                className="h-12 w-12 rounded-lg border border-emerald-500/40 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                              {player && (
                                <span className="absolute -bottom-1 -right-1 bg-black/90 rounded border border-zinc-700 p-0.5 shadow">
                                  <RoleIconOnly role={player.role} size="sm" />
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {player && <RoleBadge role={player.role} size="sm" showLabel={true} />}
                                <span className="font-bold text-sm text-white truncate">
                                  {champ ? champ.name : entry.campeon_id}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                    entry.tier === "S"
                                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                      : "bg-purple-400/20 text-purple-300 border border-purple-400/30"
                                  }`}
                                >
                                  Tier {entry.tier}
                                </span>
                              </div>
                              <div className="text-[11px] text-zinc-400 truncate mt-1">
                                {player ? `${player.displayName} (${player.laneTitle})` : entry.jugador}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-2 text-center py-6 text-zinc-500 text-xs">
                        No hay picks marcados como seguros para first-pickear en esta composición.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-emerald-950/40 rounded border border-emerald-900/50 text-[11px] text-emerald-200/90 leading-relaxed flex items-start gap-2">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>
                      <strong>Estrategia de First Pick:</strong> Abre siempre con campeones polivalentes (flex picks entre top/mid/supp o adc seguro) para no revelar a qué juegas y forzar que el rival gaste bans o picks a ciegas.
                    </span>
                  </div>
                </div>

                {/* QUÉ NO SE PUEDE FIRST-PICKEAR */}
                <div className="bg-gradient-to-br from-rose-950/20 to-zinc-950 border border-rose-900/40 rounded-xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base uppercase tracking-wider text-rose-300">
                        ¿Qué NO SE DEBE First-Pickear?
                      </h3>
                      <p className="text-[11px] text-zinc-400">
                        Picks reservados para segunda rotación o last pick (R4-R5). Abrirlos antes te expone a counters fatales.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {currentComp.no_first_pick_reasons && currentComp.no_first_pick_reasons.length > 0 ? (
                      currentComp.no_first_pick_reasons.map((item, idx) => {
                        const champ = findChampion(item.champ);
                        const inferredRole: RoleType = champ?.roles[0] || "MID";
                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-3 bg-zinc-900/80 border border-rose-900/30 rounded-lg p-2.5"
                          >
                            <div className="relative shrink-0 mt-0.5">
                              <img
                                src={getChampionAvatar(item.champ)}
                                alt={item.champ}
                                className="h-11 w-11 rounded-lg border border-rose-500/40 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                              <span className="absolute -bottom-1 -right-1 bg-black/90 rounded border border-zinc-700 p-0.5 shadow">
                                <RoleIconOnly role={inferredRole} size="sm" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-1">
                                <RoleBadge role={inferredRole} size="sm" showLabel={true} />
                                <span className="font-bold text-xs text-rose-200">
                                  {champ ? champ.name : item.champ}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400 leading-snug">
                                {item.reason}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-zinc-500 text-xs py-4 text-center">
                        No hay advertencias especiales configuradas para esta composición.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-rose-950/40 rounded border border-rose-900/50 text-[11px] text-rose-200/90 leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>
                      <strong>Regla de oro Void Lynx:</strong> Los carries con condición de victoria muy marcada (splitpusher frágil o poke puro) deben reservarse para R4-R5 para evitar que el rival responda con hard engage directo.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* POOL DEL EQUIPO PARA ESTA COMPOSICIÓN (POR POSICIÓN) */}
            {drafterViewMode !== "vertical" && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-xl">
                <div className="mb-4">
                  <h3 className="font-display font-bold text-base uppercase tracking-wider text-purple-300 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-purple-400" />
                    <span>Pool de Void Lynx para "{currentComp.nombre}"</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Opciones que tienen entrenadas nuestros jugadores específicamente para esta composición, ordenadas por su Tier individual.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {(["TOP", "JGL", "MID", "ADC", "SUPP"] as const).map((role) => {
                    const roleData = compDraftAnalysis.byRole[role];
                    if (!roleData) return null;
                    return (
                      <div
                        key={role}
                        className="bg-zinc-900/70 border border-zinc-800/80 rounded-lg p-3.5 flex flex-col"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-purple-950 text-purple-300 font-mono text-xs px-2 py-0.5 rounded font-bold">
                              {role}
                            </span>
                            <span className="text-xs font-semibold text-white">
                              {roleData.player.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {roleData.champs.length} picks
                          </span>
                        </div>

                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[360px] pr-1">
                          {roleData.champs.length > 0 ? (
                            roleData.champs.map((entry) => {
                              const champ = findChampion(entry.campeon_id);
                              return (
                                <div
                                  key={entry.id}
                                  className="flex items-center justify-between bg-zinc-950/80 border border-zinc-800/80 rounded p-1.5"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img
                                      src={getChampionAvatar(entry.campeon_id)}
                                      alt={entry.campeon_id}
                                      className="h-8 w-8 rounded object-cover border border-zinc-700 shrink-0"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = "none";
                                      }}
                                    />
                                    <div className="min-w-0 truncate">
                                      <span className="text-xs font-medium text-white truncate block">
                                        {champ ? champ.name : entry.campeon_id}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                        entry.tier === "S"
                                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                          : entry.tier === "A"
                                          ? "bg-purple-400/20 text-purple-300 border border-purple-400/30"
                                          : entry.tier === "B"
                                          ? "bg-blue-400/20 text-blue-300 border border-blue-400/30"
                                          : "bg-zinc-800 text-zinc-400"
                                      }`}
                                    >
                                      {entry.tier}
                                    </span>
                                    {entry.is_first_pickable && (
                                      <span
                                        title="First pick seguro"
                                        className="text-[9px] text-emerald-400 font-mono font-bold"
                                      >
                                        FP
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-8 text-zinc-500 text-xs">
                              Sin picks asignados
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
  );
}
