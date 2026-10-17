import React from "react";
import { SavedDraft } from "@/lib/staff-storage";
import { getChampionAvatar } from "@/data/champions";
import {
  BarChart3,
  Trophy,
  Swords,
  Search,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { ActiveTab } from "../types";

interface ScrimHistoryTabProps {
  draftsHistory: SavedDraft[];
  historySearch: string;
  setHistorySearch: (s: string) => void;
  historyFilterResult: "ALL" | "VICTORIA" | "DERROTA" | "PENDING";
  setHistoryFilterResult: (res: "ALL" | "VICTORIA" | "DERROTA" | "PENDING") => void;
  historyFilterSide: "ALL" | "BLUE" | "RED";
  setHistoryFilterSide: (side: "ALL" | "BLUE" | "RED") => void;
  historyFilterComp: string;
  setHistoryFilterComp: (comp: string) => void;
  draftStats: {
    total: number;
    wins: number;
    losses: number;
    pending: number;
    winrate: number;
    blueWR: number;
    blueWins: number;
    blueDrafts: number;
    redWR: number;
    redWins: number;
    redDrafts: number;
    compStatsList: {
      compName: string;
      total: number;
      wins: number;
      losses: number;
      pending: number;
      winrate: number;
    }[];
  };
  filteredHistory: SavedDraft[];
  handleLoadSavedDraft: (draft: SavedDraft) => void;
  handleDeleteSavedDraft: (id: string) => void;
  handleUpdateDraftResult: (id: string, newResult: "VICTORIA" | "DERROTA" | "PENDING") => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export function ScrimHistoryTab({
  draftsHistory,
  historySearch,
  setHistorySearch,
  historyFilterResult,
  setHistoryFilterResult,
  historyFilterSide,
  setHistoryFilterSide,
  historyFilterComp,
  setHistoryFilterComp,
  draftStats,
  filteredHistory,
  handleLoadSavedDraft,
  handleDeleteSavedDraft,
  handleUpdateDraftResult,
  setActiveTab,
}: ScrimHistoryTabProps) {
  const allCompNames = Array.from(new Set(draftsHistory.map((d) => d.composicion_id).filter(Boolean)));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. HEADER DE LA SECCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-950 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-purple-500/30">
              Database Analytics & Match Logs
            </span>
            <span className="text-zinc-500 text-xs font-mono">Cloudflare D1 Sincronizado</span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-white flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-purple-400" />
            <span>Historial de Scrims & Estadísticas de Draft</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Registro histórico de partidas competitivas, winrates por composición y efectividad táctica del equipo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("live")}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 self-start sm:self-auto transition-all shadow-lg shadow-purple-900/30 hover:scale-105"
        >
          <Swords className="h-4 w-4" />
          <span>+ Iniciar Nuevo Draft en Vivo</span>
        </button>
      </div>

      {/* 2. KPIS Y TARJETAS ESTADÍSTICAS GLOBALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Winrate Global */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>WINRATE GLOBAL</span>
            <Trophy className="h-4 w-4 text-amber-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-display font-black text-white">
              {draftStats.winrate}%
            </div>
            <div className="text-xs font-mono text-zinc-400 mt-0.5">
              <span className="text-emerald-400 font-bold">{draftStats.wins}V</span> - <span className="text-rose-400 font-bold">{draftStats.losses}D</span> ({draftStats.pending} en curso)
            </div>
          </div>
          <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${draftStats.winrate}%` }}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${100 - draftStats.winrate}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Lado Azul */}
        <div className="bg-zinc-950 border border-blue-900/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-blue-300">
            <span>LADO AZUL (BLUE SIDE)</span>
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-display font-black text-blue-400">
              {draftStats.blueWR}%
            </div>
            <div className="text-xs font-mono text-zinc-400 mt-0.5">
              {draftStats.blueWins} victorias en {draftStats.blueDrafts} partidas
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            First Pick B1 asegurado
          </span>
        </div>

        {/* KPI 3: Lado Rojo */}
        <div className="bg-zinc-950 border border-rose-900/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-rose-300">
            <span>LADO ROJO (RED SIDE)</span>
            <span className="h-2 w-2 rounded-full bg-rose-500" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-display font-black text-rose-400">
              {draftStats.redWR}%
            </div>
            <div className="text-xs font-mono text-zinc-400 mt-0.5">
              {draftStats.redWins} victorias en {draftStats.redDrafts} partidas
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Counterpick R5 / Last Pick
          </span>
        </div>

        {/* KPI 4: Partidas Totales */}
        <div className="bg-zinc-950 border border-purple-900/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-purple-300">
            <span>TOTAL REGISTROS</span>
            <Calendar className="h-4 w-4 text-purple-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-display font-black text-purple-300">
              {draftStats.total}
            </div>
            <div className="text-xs font-mono text-zinc-400 mt-0.5">
              Drafts guardados en base de datos
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            ✓ Copia de seguridad en la nube
          </span>
        </div>
      </div>

      {/* 3. DESGLOSE POR COMPOSICIÓN (WINRATES) */}
      {draftStats.compStatsList.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-400" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white">
              Efectividad por Composición Táctica
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {draftStats.compStatsList.map((cs) => (
              <div
                key={cs.compName}
                className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-xs text-white truncate">{cs.compName}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      cs.winrate >= 60
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                        : cs.winrate >= 40
                        ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                        : "bg-rose-950 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {cs.winrate}% WR
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
                  <span>Partidas: {cs.total}</span>
                  <span>{cs.wins}V - {cs.losses}D</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{ width: `${cs.winrate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FILTROS Y BÚSQUEDA DE SCRIMS */}
      <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por rival, composición o notas..."
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-semibold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Filtro Resultado */}
          <select
            value={historyFilterResult}
            onChange={(e) => setHistoryFilterResult(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs text-zinc-300 font-mono font-bold outline-none"
          >
            <option value="ALL">Resultados: Todos</option>
            <option value="VICTORIA">Solo Victorias</option>
            <option value="DERROTA">Solo Derrotas</option>
            <option value="PENDING">Solo Pendientes</option>
          </select>

          {/* Filtro Lado */}
          <select
            value={historyFilterSide}
            onChange={(e) => setHistoryFilterSide(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs text-zinc-300 font-mono font-bold outline-none"
          >
            <option value="ALL">Lados: Todos</option>
            <option value="BLUE">Lado Azul</option>
            <option value="RED">Lado Rojo</option>
          </select>

          {/* Filtro Composición */}
          {allCompNames.length > 0 && (
            <select
              value={historyFilterComp}
              onChange={(e) => setHistoryFilterComp(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs text-zinc-300 font-mono font-bold outline-none"
            >
              <option value="ALL">Composiciones: Todas</option>
              {allCompNames.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* 5. LISTADO DE PARTIDAS GUARDADAS */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((draft) => (
            <div
              key={draft.id}
              className="bg-zinc-950 border border-zinc-800 hover:border-purple-500/60 rounded-2xl p-4 sm:p-5 transition-all shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display font-extrabold text-base sm:text-lg text-white">
                    vs {draft.rival}
                  </span>

                  {/* Selector rápido interactivo de resultado */}
                  <div className="flex items-center gap-1">
                    {(["VICTORIA", "DERROTA", "PENDING"] as const).map((res) => {
                      const isActive = draft.resultado === res;
                      return (
                        <button
                          key={res}
                          type="button"
                          onClick={() => handleUpdateDraftResult(draft.id, res)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
                            isActive
                              ? res === "VICTORIA"
                                ? "bg-emerald-600 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                : res === "DERROTA"
                                ? "bg-rose-600 text-white border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                                : "bg-amber-600 text-white border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                              : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
                          }`}
                        >
                          {res === "VICTORIA" ? "✓ Victoria" : res === "DERROTA" ? "✕ Derrota" : "⋯ En curso"}
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800/50 font-bold">
                    {draft.composicion_id}
                  </span>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      draft.nuestro_lado === "BLUE"
                        ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                        : "bg-rose-950 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    Lado {draft.nuestro_lado}
                  </span>

                  <span className="text-[10px] font-mono text-zinc-500">
                    {new Date(draft.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleLoadSavedDraft(draft)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span>Cargar en Mesa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSavedDraft(draft.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Eliminar de BBDD"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Picks y Bans visuales de la partida */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lado Azul */}
                <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-blue-400 font-bold">
                      🔵 LADO AZUL {draft.nuestro_lado === "BLUE" ? "(VOID LYNX)" : `(${draft.rival})`}
                    </span>
                    <span className="text-zinc-500 text-[10px]">
                      Bans: {draft.blue_bans?.filter(Boolean).join(", ") || "-"}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {draft.blue_picks?.map((pick, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <img
                          src={getChampionAvatar(pick)}
                          alt={pick || "None"}
                          title={pick}
                          className="h-10 w-10 rounded-lg object-cover border border-blue-500/40 shadow"
                        />
                        <span className="text-[9px] font-mono font-bold text-zinc-300 truncate mt-1 max-w-full">
                          {pick || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lado Rojo */}
                <div className="bg-zinc-900/60 border border-rose-900/30 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 font-bold">
                      🔴 LADO ROJO {draft.nuestro_lado === "RED" ? "(VOID LYNX)" : `(${draft.rival})`}
                    </span>
                    <span className="text-zinc-500 text-[10px]">
                      Bans: {draft.red_bans?.filter(Boolean).join(", ") || "-"}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {draft.red_picks?.map((pick, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <img
                          src={getChampionAvatar(pick)}
                          alt={pick || "None"}
                          title={pick}
                          className="h-10 w-10 rounded-lg object-cover border border-rose-500/40 shadow"
                        />
                        <span className="text-[9px] font-mono font-bold text-zinc-300 truncate mt-1 max-w-full">
                          {pick || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notas de la partida */}
              {draft.notas && (
                <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-300 italic">
                  <strong>Notas del Staff:</strong> "{draft.notas}"
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-zinc-950 border border-dashed border-zinc-800 rounded-2xl p-6">
            <Trophy className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
            <h4 className="font-display font-bold text-zinc-300 text-sm">
              No hay partidas guardadas con los filtros actuales
            </h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              Realiza tus drafts de entrenamiento o scrims en la <strong>Sala de Draft en Vivo</strong> y pulsa "Guardar Partida" para registrar el resultado en BBDD.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
