import React from "react";
import { CompositionData, PlayerChampionEntry, PlayerProfile, PLAYERS_LIST } from "@/data/staff-initial-data";
import { Champion, findChampion, getChampionAvatar, getChampionSplash } from "@/data/champions";
import { RoleBadge } from "@/components/RoleBadge";
import {
  Users,
  Search,
  Plus,
  Trash2,
  Table,
  CheckCircle2,
  Crown,
  Trophy,
  LayoutGrid,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Layers,
  Shield,
} from "lucide-react";

interface PlayerPoolsTabProps {
  selectedPlayerName: string;
  setSelectedPlayerName: (name: string) => void;
  selectedPlayer: PlayerProfile;
  playerChampions: PlayerChampionEntry[];
  compositions: CompositionData[];
  playerViewMode: "tierlist" | "grid";
  setPlayerViewMode: (mode: "tierlist" | "grid") => void;
  playerFilterTier: string;
  setPlayerFilterTier: (tier: string) => void;
  playerFilterComp: string;
  setPlayerFilterComp: (comp: string) => void;
  newChampSearch: string;
  setNewChampSearch: (s: string) => void;
  newChampTier: "S" | "A" | "B" | "C";
  setNewChampTier: (t: "S" | "A" | "B" | "C") => void;
  newChampComps: string[];
  setNewChampComps: React.Dispatch<React.SetStateAction<string[]>>;
  newChampFirstPick: boolean;
  setNewChampFirstPick: (fp: boolean) => void;
  filteredPlayerChamps: PlayerChampionEntry[];
  champSearchResults: Champion[];
  handleAddChampToPlayer: (champId: string) => void;
  handleUpdateTier: (id: string, tier: "S" | "A" | "B" | "C") => void;
  handleShiftTier: (id: string, direction: "up" | "down") => void;
  handleToggleChampComp: (id: string, compName: string) => void;
  handleToggleFirstPick: (id: string) => void;
  handleDeleteChamp: (id: string) => void;
}

export function PlayerPoolsTab({
  selectedPlayerName,
  setSelectedPlayerName,
  selectedPlayer,
  playerChampions,
  compositions,
  playerViewMode,
  setPlayerViewMode,
  playerFilterTier,
  setPlayerFilterTier,
  playerFilterComp,
  setPlayerFilterComp,
  newChampSearch,
  setNewChampSearch,
  newChampTier,
  setNewChampTier,
  newChampComps,
  setNewChampComps,
  newChampFirstPick,
  setNewChampFirstPick,
  filteredPlayerChamps,
  champSearchResults,
  handleAddChampToPlayer,
  handleUpdateTier,
  handleShiftTier,
  handleToggleChampComp,
  handleToggleFirstPick,
  handleDeleteChamp,
}: PlayerPoolsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
            {/* VESTUARIO: SELECCIÓN DE JUGADOR CON SPLASH ARTS */}
            <div className="bg-zinc-950/90 border border-purple-900/40 p-5 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-purple-950 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-purple-500/30">
                      Roster Locker Room
                    </span>
                    <span className="text-zinc-500 text-xs font-mono">
                      Selecciona tu perfil de jugador
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-white flex items-center gap-2.5">
                    <Users className="h-6 w-6 text-purple-400" />
                    <span>Vestuario // Pools & Tiers por Jugador</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs text-zinc-400 font-mono">Editando:</span>
                  <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-purple-900/50 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    {selectedPlayer.displayName} ({selectedPlayer.role})
                  </span>
                </div>
              </div>

              {/* Grid de Tarjetas de Jugadores (Locker Room) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {PLAYERS_LIST.map((player) => {
                  const isSelected = player.name === selectedPlayerName;
                  const playerChamps = playerChampions.filter((p) => p.jugador === player.name);
                  const countS = playerChamps.filter((p) => p.tier === "S").length;
                  const countA = playerChamps.filter((p) => p.tier === "A").length;
                  const splashUrl = getChampionSplash(player.signatureChamp);

                  return (
                    <button
                      key={player.name}
                      onClick={() => setSelectedPlayerName(player.name)}
                      className={`group relative rounded-xl overflow-hidden border p-3.5 text-left transition-all duration-300 flex flex-col justify-between min-h-[140px] ${
                        isSelected
                          ? "border-purple-400 bg-purple-950/60 shadow-[0_0_30px_rgba(168,85,247,0.35)] ring-2 ring-purple-400 -translate-y-1"
                          : "border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/50 hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Splash Art de fondo con fade */}
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 transition-opacity duration-500 scale-105"
                        style={{
                          backgroundImage: `url(${splashUrl})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />

                      {/* Header de la tarjeta */}
                      <div className="relative z-10 flex items-center justify-between w-full mb-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            player.role === "TOP"
                              ? "bg-amber-950/90 text-amber-300 border border-amber-600/40"
                              : player.role === "JGL"
                              ? "bg-emerald-950/90 text-emerald-300 border border-emerald-600/40"
                              : player.role === "MID"
                              ? "bg-cyan-950/90 text-cyan-300 border border-cyan-600/40"
                              : player.role === "ADC"
                              ? "bg-purple-950/90 text-purple-300 border border-purple-600/40"
                              : "bg-rose-950/90 text-rose-300 border border-rose-600/40"
                          }`}
                        >
                          {player.role}
                        </span>

                        <span className="text-[9px] font-mono text-zinc-400">
                          {player.isStarter ? "Titular" : "Sub"}
                        </span>
                      </div>

                      {/* Nombre del jugador */}
                      <div className="relative z-10 my-auto">
                        <span className="font-display font-bold text-sm sm:text-base text-white tracking-wide block truncate">
                          {player.displayName}
                        </span>
                        <span className="text-[10px] text-zinc-400 block truncate font-mono">
                          {player.laneTitle}
                        </span>
                      </div>

                      {/* Desglose de Tiers rápido */}
                      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono w-full">
                        <div className="flex gap-1.5">
                          <span className="text-amber-400 font-bold" title="Tier S">S:{countS}</span>
                          <span className="text-purple-300 font-bold" title="Tier A">A:{countA}</span>
                        </div>
                        <span className="text-zinc-400 font-semibold">{playerChamps.length} picks</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONTROLES Y HERRAMIENTAS DEL JUGADOR SELECCIONADO */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <img
                  src={getChampionAvatar(selectedPlayer.signatureChamp)}
                  alt={selectedPlayer.displayName}
                  className="h-10 w-10 rounded-lg border border-purple-500/50 object-cover shrink-0"
                />
                <div>
                  <h3 className="font-display font-bold text-base uppercase tracking-wider text-white">
                    Pool de {selectedPlayer.displayName} ({selectedPlayer.laneTitle})
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {filteredPlayerChamps.length} campeones mostrados • Gestiona tus tiers y a qué composiciones aplicas
                  </p>
                </div>
              </div>

              {/* Selector de Modo de Vista y Filtro */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Switcher de Vista (Tierlist vs Grid) */}
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  <button
                    onClick={() => setPlayerViewMode("tierlist")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      playerViewMode === "tierlist"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Trophy className="h-3.5 w-3.5 text-amber-400" />
                    <span>Matriz Tier List</span>
                  </button>

                  <button
                    onClick={() => setPlayerViewMode("grid")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      playerViewMode === "grid"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Vista Detallada</span>
                  </button>
                </div>

                {/* Filtro por Composición */}
                <select
                  value={playerFilterComp}
                  onChange={(e) => setPlayerFilterComp(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="ALL">Todas las Composiciones</option>
                  {compositions.map((comp) => (
                    <option key={comp.id} value={comp.nombre}>
                      {comp.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ========================================================= */}
            {/* MODO 1: MATRIZ VISUAL TIER LIST (ESTILO TIERMAKER PROFESIONAL) */}
            {/* ========================================================= */}
            {playerViewMode === "tierlist" && (
              <div className="space-y-4">
                {(["S", "A", "B", "C"] as const).map((tierKey) => {
                  const tierChamps = filteredPlayerChamps.filter((c) => c.tier === tierKey);
                  const tierStyle = {
                    S: {
                      badgeBg: "bg-gradient-to-br from-amber-500/25 to-amber-950/60",
                      borderColor: "border-amber-500/40",
                      textColor: "text-amber-300",
                      label: "TIER S",
                      subtitle: "GOD TIER // FIRST PICK",
                      icon: <Crown className="h-5 w-5 text-amber-400" />,
                    },
                    A: {
                      badgeBg: "bg-gradient-to-br from-purple-500/25 to-purple-950/60",
                      borderColor: "border-purple-500/40",
                      textColor: "text-purple-300",
                      label: "TIER A",
                      subtitle: "CORE PICK // ÓPTIMO",
                      icon: <Sparkles className="h-5 w-5 text-purple-400" />,
                    },
                    B: {
                      badgeBg: "bg-gradient-to-br from-blue-500/25 to-blue-950/60",
                      borderColor: "border-blue-500/40",
                      textColor: "text-blue-300",
                      label: "TIER B",
                      subtitle: "SITUACIONAL // SEGUNDA OPCIÓN",
                      icon: <Layers className="h-5 w-5 text-blue-400" />,
                    },
                    C: {
                      badgeBg: "bg-gradient-to-br from-zinc-700/25 to-zinc-900/60",
                      borderColor: "border-zinc-700/40",
                      textColor: "text-zinc-400",
                      label: "TIER C",
                      subtitle: "POCKET // EXPERIMENTAL",
                      icon: <Shield className="h-5 w-5 text-zinc-400" />,
                    },
                  }[tierKey];

                  return (
                    <div
                      key={tierKey}
                      className={`flex flex-col md:flex-row rounded-xl border ${tierStyle.borderColor} bg-zinc-950/80 overflow-hidden shadow-xl`}
                    >
                      {/* Cabecera del Tier (Columna Izquierda) */}
                      <div
                        className={`md:w-48 p-4 shrink-0 flex md:flex-col items-center justify-between md:justify-center text-center gap-2 ${tierStyle.badgeBg} border-b md:border-b-0 md:border-r ${tierStyle.borderColor}`}
                      >
                        <div className="flex items-center md:flex-col gap-2">
                          {tierStyle.icon}
                          <span className={`font-display font-extrabold text-2xl tracking-wider ${tierStyle.textColor}`}>
                            {tierStyle.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                          {tierStyle.subtitle}
                        </span>
                        <span className="text-xs font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                          {tierChamps.length} campeones
                        </span>
                      </div>

                      {/* Campeones de este Tier */}
                      <div className="flex-1 p-3.5 flex flex-wrap gap-3 items-center min-h-[100px] bg-black/30">
                        {tierChamps.length > 0 ? (
                          tierChamps.map((entry) => {
                            const champ = findChampion(entry.campeon_id);
                            return (
                              <div
                                key={entry.id}
                                className="group relative bg-zinc-900/90 border border-zinc-800 hover:border-purple-500/60 rounded-xl p-2 transition-all duration-200 flex flex-col items-center w-28 sm:w-32 shadow-md hover:-translate-y-0.5"
                              >
                                {/* Imagen con badges */}
                                <div className="relative mb-1.5 w-16 h-16">
                                  <img
                                    src={getChampionAvatar(entry.campeon_id)}
                                    alt={entry.campeon_id}
                                    className="w-full h-full rounded-lg object-cover border border-zinc-700 group-hover:border-purple-400 shadow"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = "none";
                                    }}
                                  />
                                  {entry.is_first_pickable && (
                                    <span
                                      title="First Pick Seguro"
                                      className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] font-bold text-white px-1 py-0.2 rounded shadow"
                                    >
                                      FP
                                    </span>
                                  )}
                                </div>

                                {/* Nombre */}
                                <span className="font-bold text-xs text-white truncate w-full text-center">
                                  {champ ? champ.name : entry.campeon_id}
                                </span>

                                {/* Mini tags de composiciones */}
                                <div className="flex flex-wrap gap-0.5 justify-center mt-1 w-full max-h-8 overflow-hidden">
                                  {entry.tipos_comp.slice(0, 2).map((compName) => (
                                    <span
                                      key={compName}
                                      className="bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[8px] px-1 rounded font-mono truncate"
                                    >
                                      {compName}
                                    </span>
                                  ))}
                                  {entry.tipos_comp.length > 2 && (
                                    <span className="text-[8px] text-zinc-500 font-mono">
                                      +{entry.tipos_comp.length - 2}
                                    </span>
                                  )}
                                </div>

                                {/* Controles de cambio rápido de Tier (Flechas y Borrar) */}
                                <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between w-full text-zinc-400 text-[10px]">
                                  <button
                                    onClick={() => handleShiftTier(entry.id, "up")}
                                    disabled={tierKey === "S"}
                                    title="Subir de Tier"
                                    className="hover:text-amber-400 disabled:opacity-20 p-0.5 rounded transition-colors"
                                  >
                                    <ChevronUp className="h-3.5 w-3.5" />
                                  </button>

                                  {/* Selector rápido directo */}
                                  <div className="flex gap-0.5">
                                    {(["S", "A", "B", "C"] as const).map((t) => (
                                      <button
                                        key={t}
                                        onClick={() => handleUpdateTier(entry.id, t)}
                                        className={`font-mono text-[9px] font-bold px-1 rounded ${
                                          entry.tier === t
                                            ? "bg-purple-600 text-white"
                                            : "text-zinc-600 hover:text-white"
                                        }`}
                                      >
                                        {t}
                                      </button>
                                    ))}
                                  </div>

                                  <button
                                    onClick={() => handleShiftTier(entry.id, "down")}
                                    disabled={tierKey === "C"}
                                    title="Bajar de Tier"
                                    className="hover:text-blue-400 disabled:opacity-20 p-0.5 rounded transition-colors"
                                  >
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-zinc-600 text-xs italic py-6 px-4">
                            Ningún campeón en {tierStyle.label}. Asigna campeones aquí usando el formulario de abajo.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ========================================================= */}
            {/* MODO 2: VISTA DETALLADA EN CUADRÍCULA (CON EDICIÓN DE COMPOS) */}
            {/* ========================================================= */}
            {playerViewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPlayerChamps.map((entry) => {
                  const champ = findChampion(entry.campeon_id);
                  return (
                    <div
                      key={entry.id}
                      className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3.5 flex flex-col justify-between transition-colors shadow-lg"
                    >
                      <div>
                        {/* Cabecera del campeón */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={getChampionAvatar(entry.campeon_id)}
                              alt={entry.campeon_id}
                              className="h-11 w-11 rounded-lg border border-zinc-700 object-cover shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                            <div className="min-w-0 truncate">
                              <span className="font-bold text-sm text-white truncate block">
                                {champ ? champ.name : entry.campeon_id}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                {champ?.category || "Champion"}
                              </span>
                            </div>
                          </div>

                          {/* Botón rápido de Tier */}
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex gap-0.5 bg-zinc-900 p-0.5 rounded border border-zinc-800">
                              {(["S", "A", "B", "C"] as const).map((t) => (
                                <button
                                  key={t}
                                  onClick={() => handleUpdateTier(entry.id, t)}
                                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded transition-colors ${
                                    entry.tier === t
                                      ? t === "S"
                                        ? "bg-amber-400 text-black font-extrabold"
                                        : t === "A"
                                        ? "bg-purple-600 text-white"
                                        : t === "B"
                                        ? "bg-blue-600 text-white"
                                        : "bg-zinc-700 text-zinc-200"
                                      : "text-zinc-500 hover:text-white"
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Composiciones asignadas */}
                        <div className="mb-3">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Aplica a composiciones:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {entry.tipos_comp && entry.tipos_comp.length > 0 ? (
                              entry.tipos_comp.map((compName) => (
                                <span
                                  key={compName}
                                  className="bg-zinc-900 border border-zinc-800 text-purple-300 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-mono"
                                >
                                  {compName}
                                  <button
                                    onClick={() => handleToggleChampComp(entry.id, compName)}
                                    className="text-zinc-500 hover:text-rose-400 text-[9px]"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-zinc-600 italic">
                                Ninguna composición asignada
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Toggle de composiciones */}
                        <div className="pt-2 border-t border-zinc-900 flex flex-wrap gap-1">
                          {compositions.map((comp) => {
                            const hasIt = entry.tipos_comp.includes(comp.nombre);
                            return (
                              <button
                                key={comp.id}
                                onClick={() => handleToggleChampComp(entry.id, comp.nombre)}
                                className={`text-[9px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                                  hasIt
                                    ? "bg-purple-900/40 text-purple-200 border border-purple-500/40"
                                    : "text-zinc-500 hover:text-zinc-300"
                                }`}
                              >
                                {hasIt ? `✓ ${comp.nombre}` : `+ ${comp.nombre}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Acciones inferiores */}
                      <div className="mt-4 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleToggleFirstPick(entry.id)}
                          className={`text-[10px] font-mono flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                            entry.is_first_pickable
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{entry.is_first_pickable ? "First Pick Seguro" : "Poco Seguro a Ciegas"}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteChamp(entry.id)}
                          title="Eliminar del pool"
                          className="text-zinc-600 hover:text-rose-400 p-1 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* FORMULARIO: AÑADIR CAMPEÓN AL POOL DEL JUGADOR */}
            <div className="bg-zinc-950 border border-purple-900/40 p-5 rounded-2xl shadow-xl">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-purple-300 mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-purple-400" />
                <span>Añadir Campeón al Pool de {selectedPlayer.displayName}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Input Buscador con sugerencias */}
                <div className="relative">
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                    Campeón (Catálogo de 172 LoL):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ej: K'Sante, Viego, Jinx..."
                      value={newChampSearch}
                      onChange={(e) => setNewChampSearch(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                    />
                    <Search className="h-4 w-4 absolute right-2.5 top-2.5 text-zinc-500" />
                  </div>

                  {/* Dropdown de resultados */}
                  {champSearchResults.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-md shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                      {champSearchResults.map((champ) => (
                        <button
                          key={champ.id}
                          type="button"
                          onClick={() => {
                            handleAddChampToPlayer(champ.id);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-purple-900/40 text-xs text-white border-b border-zinc-800 last:border-b-0"
                        >
                          <img
                            src={getChampionAvatar(champ.id)}
                            alt={champ.name}
                            className="h-7 w-7 rounded object-cover"
                          />
                          <div>
                            <span className="font-semibold block">{champ.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {champ.category}
                            </span>
                          </div>
                          <span className="text-[10px] text-purple-400 ml-auto font-mono font-bold">
                            + Añadir
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selector de Tier */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                    Tier a Asignar:
                  </label>
                  <div className="flex gap-1.5">
                    {(["S", "A", "B", "C"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewChampTier(t)}
                        className={`flex-1 py-2 rounded font-mono text-xs font-bold transition-colors ${
                          newChampTier === t
                            ? t === "S"
                              ? "bg-amber-400 text-black font-extrabold shadow-md shadow-amber-900/40"
                              : t === "A"
                              ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                              : t === "B"
                              ? "bg-blue-600 text-white"
                              : "bg-zinc-700 text-zinc-200"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Composiciones a las que aplica (Selector de Tags) */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                    Composiciones en las que encaja:
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {compositions.map((comp) => {
                      const isChecked = newChampComps.includes(comp.nombre);
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => {
                            setNewChampComps((prev) =>
                              prev.includes(comp.nombre)
                                ? prev.filter((c) => c !== comp.nombre)
                                : [...prev, comp.nombre]
                            );
                          }}
                          className={`text-[10px] px-2.5 py-1 rounded font-semibold transition-colors ${
                            isChecked
                              ? "bg-purple-600 text-white shadow"
                              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {isChecked ? `✓ ${comp.nombre}` : comp.nombre}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
  );
}
