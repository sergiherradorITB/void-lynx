import React from "react";
import { CompositionData, PlayerChampionEntry } from "@/data/staff-initial-data";
import { getChampionAvatar } from "@/data/champions";
import { RoleType } from "@/components/RoleBadge";
import { Shield, Plus, Edit3, Trash2 } from "lucide-react";
import { ActiveTab } from "../types";

interface CompositionsTabProps {
  compositions: CompositionData[];
  playerChampions: PlayerChampionEntry[];
  handlePersist: (newComps: CompositionData[], newChamps: PlayerChampionEntry[]) => void;
  handleOpenCreateComp: () => void;
  handleOpenEditComp: (comp: CompositionData) => void;
  handleDeleteComp: (id: string) => void;
  handleCycleRolePriority: (compId: string, role: RoleType) => void;
  setSelectedCompId: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export function CompositionsTab({
  compositions,
  playerChampions,
  handlePersist,
  handleOpenCreateComp,
  handleOpenEditComp,
  handleDeleteComp,
  handleCycleRolePriority,
  setSelectedCompId,
  setActiveTab,
}: CompositionsTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
        <div>
          <h2 className="font-display font-bold text-lg uppercase tracking-wider text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            <span>Matriz de Composiciones Tácticas</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gestiona las composiciones del equipo, sus counters directos, bans clave y advertencias para el draft.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateComp}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-lg shadow-purple-900/30"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Composición</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {compositions.map((comp) => (
          <div
            key={comp.id}
            className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-5 hover:border-purple-600/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-bold text-base text-white tracking-wide">
                    {comp.nombre}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      comp.prioridad.includes("Alta")
                        ? "bg-purple-900/40 text-purple-300 border border-purple-500/30"
                        : comp.prioridad.includes("Media")
                        ? "bg-blue-900/40 text-blue-300 border border-blue-500/30"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {comp.prioridad}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500">{comp.enfoque}</span>
                  <button
                    type="button"
                    onClick={() => handleOpenEditComp(comp)}
                    className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Editar composición"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-purple-400" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                {comp.descripcion}
              </p>

              <div className="space-y-3 border-t border-zinc-800/80 pt-3">
                <div>
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1">
                    Counters Directos (Amenazas):
                  </span>
                  <p className="text-xs text-zinc-400 mb-2">{comp.counters_descripcion}</p>
                  <div className="flex flex-wrap gap-2">
                    {comp.counters_campeones.map((cId) => (
                      <span
                        key={cId}
                        className="inline-flex items-center gap-2 bg-zinc-900 border border-rose-500/40 text-rose-200 text-xs px-2.5 py-1 rounded-lg shadow"
                      >
                        <img
                          src={getChampionAvatar(cId)}
                          alt={cId}
                          className="h-7 w-7 rounded-md object-cover border border-rose-500/40"
                        />
                        <span className="font-bold">{cId}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = compositions.map((c) =>
                              c.id === comp.id
                                ? {
                                    ...c,
                                    counters_campeones: c.counters_campeones.filter((x) => x !== cId),
                                  }
                                : c
                            );
                            handlePersist(updated, playerChampions);
                          }}
                          className="text-zinc-500 hover:text-rose-400 font-bold ml-1 text-sm leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleOpenEditComp(comp)}
                      className="text-xs text-purple-300 hover:text-white bg-purple-950/60 border border-purple-500/40 hover:border-purple-400 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors font-semibold"
                    >
                      + Gestionar Counters
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                    First Picks Seguros:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {comp.first_pick_safe.map((sId) => (
                      <span
                        key={sId}
                        className="inline-flex items-center gap-2 bg-zinc-900 border border-emerald-500/40 text-emerald-200 text-xs px-2.5 py-1 rounded-lg shadow"
                      >
                        <img
                          src={getChampionAvatar(sId)}
                          alt={sId}
                          className="h-7 w-7 rounded-md object-cover border border-emerald-500/40"
                        />
                        <span className="font-bold">{sId}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prioridades de Pick por Rol (5 Columnas) */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Prioridad de Pick por Rol:
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                    {(["TOP", "JGL", "MID", "ADC", "SUPP"] as RoleType[]).map((r) => {
                      const prio = comp.role_priorities?.[r] || "Media";
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleCycleRolePriority(comp.id, r)}
                          title={`${r}: ${prio} — Clic para alternar prioridad`}
                          className={`p-1.5 rounded border text-[10px] font-bold transition-all ${
                            prio === "Alta"
                              ? "bg-rose-950/70 border-rose-500/40 text-rose-300 hover:bg-rose-900/60"
                              : prio === "Media"
                              ? "bg-amber-950/70 border-amber-500/40 text-amber-300 hover:bg-amber-900/60"
                              : "bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60"
                          }`}
                        >
                          <div className="text-[9px] text-zinc-500">{r}</div>
                          <div>{prio}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditComp(comp)}
                  className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5 text-purple-400" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteComp(comp.id)}
                  className="p-1.5 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  title="Eliminar composición"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCompId(comp.id);
                  setActiveTab("drafter");
                }}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                <span>Ver en Asistente de Draft</span> →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
