import React from "react";
import { CompositionData, PriorityLevel } from "@/data/staff-initial-data";
import { CHAMPIONS_CATALOG, findChampion, getChampionAvatar } from "@/data/champions";
import { RoleIconOnly, RoleType } from "@/components/RoleBadge";
import {
  Shield,
  X,
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Save,
} from "lucide-react";

interface EditCompositionModalProps {
  editingComp: CompositionData;
  isNewComp: boolean;
  compCounterSearch: string;
  setCompCounterSearch: (val: string) => void;
  newNoFpChamp: string;
  setNewNoFpChamp: (val: string) => void;
  newNoFpReason: string;
  setNewNoFpReason: (val: string) => void;
  newBanInput: string;
  setNewBanInput: (val: string) => void;
  setEditingComp: (comp: CompositionData | null) => void;
  handleSaveEditingComp: () => void;
  handleDeleteComp: (id: string) => void;
}

export function EditCompositionModal({
  editingComp,
  isNewComp,
  compCounterSearch,
  setCompCounterSearch,
  newNoFpChamp,
  setNewNoFpChamp,
  newNoFpReason,
  setNewNoFpReason,
  newBanInput,
  setNewBanInput,
  setEditingComp,
  handleSaveEditingComp,
  handleDeleteComp,
}: EditCompositionModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-zinc-950 border border-purple-900/60 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg uppercase tracking-wider text-white">
                {isNewComp ? "Crear Nueva Composición Táctica" : `Editar Composición: ${editingComp.nombre}`}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Configura el concepto táctico, prioridades de pickeo por rol, first picks seguros y counters directos.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditingComp(null)}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* 1. INFORMACIÓN PRINCIPAL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Nombre de la Composición:
              </label>
              <input
                type="text"
                value={editingComp.nombre}
                onChange={(e) => setEditingComp({ ...editingComp, nombre: e.target.value.toUpperCase() })}
                placeholder="Ej: SIEGE 4, DIVER, TEAMFIGHT..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white font-display font-bold text-sm tracking-wide focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Prioridad Global en Draft:
              </label>
              <select
                value={editingComp.prioridad}
                onChange={(e) => setEditingComp({ ...editingComp, prioridad: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="Alta Prioridad">Alta Prioridad</option>
                <option value="Media Prioridad">Media Prioridad</option>
                <option value="Baja Prioridad">Baja Prioridad</option>
                <option value="Situacional">Situacional</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Enfoque Temporal:
              </label>
              <select
                value={editingComp.enfoque}
                onChange={(e) => setEditingComp({ ...editingComp, enfoque: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="Early Game">Early Game</option>
                <option value="Early / Mid Game">Early / Mid Game</option>
                <option value="Mid Game">Mid Game</option>
                <option value="Mid / Late Game">Mid / Late Game</option>
                <option value="Late Game">Late Game</option>
                <option value="Early / Neutrales">Early / Neutrales</option>
                <option value="Pre y Post 15 min">Pre y Post 15 min</option>
              </select>
            </div>
          </div>

          {/* Concepto / Win Condition */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Concepto Táctico / Objetivo Clave (Win Condition):
            </label>
            <textarea
              value={editingComp.descripcion}
              onChange={(e) => setEditingComp({ ...editingComp, descripcion: e.target.value })}
              placeholder="Describe la condición de victoria: qué líneas se priorizan, cómo se ejecutan las peleas o asedios y cuál es la rotación..."
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
            />
          </div>

          {/* 2. PRIORIDADES DE PICKEO DE LOS 5 ROLES */}
          <div className="bg-zinc-900/60 border border-purple-900/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                ★ Prioridad de Pickeo por Rol (Fila PRIO en Excel):
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                Determina qué roles tienen prioridad de pick (Baja, Media o Alta) en esta composición
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(["TOP", "JGL", "MID", "ADC", "SUPP"] as RoleType[]).map((r) => {
                const curVal = editingComp.role_priorities?.[r] || "Media";
                return (
                  <div key={r} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2 font-mono font-bold text-xs text-zinc-200">
                      <RoleIconOnly role={r} size="sm" />
                      <span>{r}</span>
                    </div>
                    <div className="flex gap-1 justify-center">
                      {(["Baja", "Media", "Alta"] as PriorityLevel[]).map((level) => {
                        const active = curVal === level;
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => {
                              setEditingComp({
                                ...editingComp,
                                role_priorities: {
                                  ...(editingComp.role_priorities || {
                                    TOP: "Media",
                                    JGL: "Alta",
                                    MID: "Alta",
                                    ADC: "Alta",
                                    SUPP: "Media",
                                  }),
                                  [r]: level,
                                },
                              });
                            }}
                            className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                              active
                                ? level === "Alta"
                                  ? "bg-rose-950 text-rose-300 border border-rose-500 shadow"
                                  : level === "Media"
                                  ? "bg-amber-950 text-amber-300 border border-amber-500 shadow"
                                  : "bg-emerald-950 text-emerald-300 border border-emerald-500 shadow"
                                : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300"
                            }`}
                          >
                            {level}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. COUNTERS DIRECTOS */}
          <div className="bg-zinc-900/40 border border-rose-900/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span className="text-[11px] font-mono font-bold text-rose-300 uppercase tracking-wider">
                Counters Directos (Estilo & Campeones Amenaza):
              </span>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 mb-1">
                Descripción del estilo rival que anula esta composición:
              </label>
              <input
                type="text"
                value={editingComp.counters_descripcion}
                onChange={(e) => setEditingComp({ ...editingComp, counters_descripcion: e.target.value })}
                placeholder="Ej: Hard engage frontal, flanqueos rápidos y asesinos móviles..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 mb-1.5">
                Campeones counters específicos:
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[32px] p-2 bg-zinc-950/70 rounded-lg border border-zinc-800">
                {editingComp.counters_campeones.length > 0 ? (
                  editingComp.counters_campeones.map((cId) => (
                    <span
                      key={cId}
                      className="inline-flex items-center gap-2 bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs px-2.5 py-1.5 rounded-lg shadow-sm"
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
                          setEditingComp({
                            ...editingComp,
                            counters_campeones: editingComp.counters_campeones.filter((c) => c !== cId),
                          });
                        }}
                        className="text-rose-400 hover:text-white font-bold ml-1 text-sm leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-600 italic text-[11px]">No hay campeones counters añadidos.</span>
                )}
              </div>

              {/* Buscador Rápido de Campeones para Añadir */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={compCounterSearch}
                    onChange={(e) => setCompCounterSearch(e.target.value)}
                    placeholder="Buscar campeón en catálogo oficial para añadir como counter..."
                    className="w-full bg-zinc-900 border border-zinc-700 pl-8 pr-3 py-1.5 rounded-lg text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                {compCounterSearch.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-20 mt-1 max-h-40 overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-1 p-1">
                    {CHAMPIONS_CATALOG.filter(
                      (c) =>
                        c.name.toLowerCase().includes(compCounterSearch.toLowerCase()) ||
                        c.id.toLowerCase().includes(compCounterSearch.toLowerCase())
                    )
                      .slice(0, 12)
                      .map((champ) => (
                        <button
                          key={champ.id}
                          type="button"
                          onClick={() => {
                            if (!editingComp.counters_campeones.includes(champ.id)) {
                              setEditingComp({
                                ...editingComp,
                                counters_campeones: [...editingComp.counters_campeones, champ.id],
                              });
                            }
                            setCompCounterSearch("");
                          }}
                          className="flex items-center gap-1.5 p-1.5 rounded hover:bg-zinc-800 text-left text-zinc-200 transition-colors"
                        >
                          <img
                            src={getChampionAvatar(champ.id)}
                            alt={champ.name}
                            className="h-5 w-5 rounded object-cover"
                          />
                          <span className="text-[11px] truncate">{champ.name}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. FIRST PICKS SEGUROS & BANS RECOMENDADOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Picks Seguros */}
            <div className="bg-zinc-900/40 border border-emerald-900/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  First Picks Seguros (B1 / R1-R2):
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-zinc-950/70 rounded-lg border border-zinc-800">
                {editingComp.first_pick_safe.map((sId) => (
                  <span
                    key={sId}
                    className="inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs px-2.5 py-1.5 rounded-lg shadow-sm"
                  >
                    <img
                      src={getChampionAvatar(sId)}
                      alt={sId}
                      className="h-7 w-7 rounded-md object-cover border border-emerald-500/40"
                    />
                    <span className="font-bold">{sId}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingComp({
                          ...editingComp,
                          first_pick_safe: editingComp.first_pick_safe.filter((c) => c !== sId),
                        });
                      }}
                      className="text-emerald-400 hover:text-white font-bold ml-1 text-sm leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe campeón y pulsa Enter para FP..."
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val && !editingComp.first_pick_safe.includes(val)) {
                        const found = findChampion(val);
                        const idToAdd = found ? found.id : val;
                        setEditingComp({
                          ...editingComp,
                          first_pick_safe: [...editingComp.first_pick_safe, idToAdd],
                        });
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Bans Recomendados */}
            <div className="bg-zinc-900/40 border border-purple-900/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-purple-400" />
                <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                  Bans Recomendados:
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-zinc-950/70 rounded-lg border border-zinc-800">
                {editingComp.bans_recomendados.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1 bg-purple-950/60 border border-purple-800/60 text-purple-200 text-xs px-2 py-0.5 rounded-md"
                  >
                    <span className="font-semibold">{b}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingComp({
                          ...editingComp,
                          bans_recomendados: editingComp.bans_recomendados.filter((x) => x !== b),
                        });
                      }}
                      className="text-purple-400 hover:text-white font-bold ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBanInput}
                  onChange={(e) => setNewBanInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newBanInput.trim() && !editingComp.bans_recomendados.includes(newBanInput.trim())) {
                        setEditingComp({
                          ...editingComp,
                          bans_recomendados: [...editingComp.bans_recomendados, newBanInput.trim()],
                        });
                        setNewBanInput("");
                      }
                    }
                  }}
                  placeholder="Nombre de campeón a banear..."
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newBanInput.trim() && !editingComp.bans_recomendados.includes(newBanInput.trim())) {
                      setEditingComp({
                        ...editingComp,
                        bans_recomendados: [...editingComp.bans_recomendados, newBanInput.trim()],
                      });
                      setNewBanInput("");
                    }
                  }}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-semibold text-xs"
                >
                  + Añadir
                </button>
              </div>
            </div>
          </div>

          {/* 5. ADVERTENCIAS: QUÉ NO FIRST-PICKEAR */}
          <div className="bg-zinc-900/40 border border-rose-900/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                ¿Qué NO Se Debe First-Pickear? (Reservas R4-R5):
              </span>
            </div>

            <div className="space-y-2">
              {editingComp.no_first_pick_reasons && editingComp.no_first_pick_reasons.length > 0 ? (
                editingComp.no_first_pick_reasons.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={getChampionAvatar(item.champ)}
                        alt={item.champ}
                        className="h-6 w-6 rounded object-cover border border-rose-500/40 shrink-0"
                      />
                      <span className="font-bold text-xs text-white">{item.champ}:</span>
                      <span className="text-zinc-400 text-xs truncate">{item.reason}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingComp({
                          ...editingComp,
                          no_first_pick_reasons: editingComp.no_first_pick_reasons.filter((_, i) => i !== idx),
                        });
                      }}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-zinc-500 text-xs italic block">No hay advertencias configuradas.</span>
              )}
            </div>

            {/* Formulario para añadir advertencia */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-zinc-800">
              <input
                type="text"
                value={newNoFpChamp}
                onChange={(e) => setNewNoFpChamp(e.target.value)}
                placeholder="Campeón (ej: Jayce, Lux)..."
                className="sm:w-1/3 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={newNoFpReason}
                onChange={(e) => setNewNoFpReason(e.target.value)}
                placeholder="Motivo / Exposición al counter (ej: Inmóvil, diveable)..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (newNoFpChamp.trim() && newNoFpReason.trim()) {
                    setEditingComp({
                      ...editingComp,
                      no_first_pick_reasons: [
                        ...(editingComp.no_first_pick_reasons || []),
                        { champ: newNoFpChamp.trim(), reason: newNoFpReason.trim() },
                      ],
                    });
                    setNewNoFpChamp("");
                    setNewNoFpReason("");
                  }
                }}
                className="px-3 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-200 rounded-lg font-semibold text-xs transition-colors shrink-0"
              >
                + Añadir Advertencia
              </button>
            </div>
          </div>

          {/* 6. NOTAS DEL STAFF */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Notas Tácticas del Staff:
            </label>
            <textarea
              value={editingComp.notas_staff}
              onChange={(e) => setEditingComp({ ...editingComp, notas_staff: e.target.value })}
              placeholder="Instrucciones internas del coach, directrices de warding o sinergias..."
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/90">
          <div>
            {!isNewComp && (
              <button
                type="button"
                onClick={() => handleDeleteComp(editingComp.id)}
                className="px-3 py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Eliminar Composición</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingComp(null)}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveEditingComp}
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/40 flex items-center gap-1.5 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{isNewComp ? "Crear Composición" : "Guardar Cambios"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
