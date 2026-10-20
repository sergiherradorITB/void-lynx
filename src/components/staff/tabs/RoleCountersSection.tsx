import React, { useState, useMemo } from "react";
import { RoleType, RoleIconOnly, RoleBadge } from "@/components/RoleBadge";
import { PlayerChampionEntry } from "@/data/staff-initial-data";
import { findChampion, getChampionAvatar } from "@/data/champions";
import {
  ROLE_COUNTER_ARCHETYPES,
  EnemyRoleArchetype,
  CounterPickDetail,
  findArchetypesForChampion,
  findCounterRolesForChampion,
} from "@/data/draft-role-counters";
import {
  Crosshair,
  Shield,
  AlertTriangle,
  Sparkles,
  Search,
  CheckCircle2,
  X,
  Swords,
  Target,
  Info,
  Crown,
  ChevronRight,
} from "lucide-react";

interface RoleCountersSectionProps {
  playerChampions: PlayerChampionEntry[];
  initialRole?: RoleType;
  onClose?: () => void;
}

const ROLES_ORDER: RoleType[] = ["ADC", "TOP", "JGL", "MID", "SUPP"];

export function RoleCountersSection({
  playerChampions,
  initialRole = "ADC",
  onClose,
}: RoleCountersSectionProps) {
  const [selectedRole, setSelectedRole] = useState<RoleType>(initialRole);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Map of roster champions for instant lookup
  const rosterMap = useMemo(() => {
    const map = new Map<string, PlayerChampionEntry[]>();
    playerChampions.forEach((pc) => {
      const key = pc.campeon_id.toLowerCase().replace(/[^a-z0-9]/g, "");
      const existing = map.get(key) || [];
      existing.push(pc);
      map.set(key, existing);
    });
    return map;
  }, [playerChampions]);

  // Check if a champion is in Void Lynx roster
  const getRosterEntries = (champName: string) => {
    const key = champName.toLowerCase().replace(/[^a-z0-9]/g, "");
    return rosterMap.get(key) || [];
  };

  // Archetypes for the selected role
  const roleArchetypes = useMemo(() => {
    return ROLE_COUNTER_ARCHETYPES.filter((arch) => arch.role === selectedRole);
  }, [selectedRole]);

  // Search results if there is an active search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const clean = searchQuery.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    // 1. Check if the searched champ is an enemy threat in any archetype
    const enemyMatches = ROLE_COUNTER_ARCHETYPES.filter((arch) =>
      arch.enemyChampions.some((c) => {
        const k = c.toLowerCase().replace(/[^a-z0-9]/g, "");
        return k.includes(clean) || clean.includes(k);
      })
    );

    // 2. Check if the searched champ is listed as a counterpick
    const counterMatches = findCounterRolesForChampion(searchQuery.trim());

    // 3. Check if archetypes match by title or description
    const textMatches = ROLE_COUNTER_ARCHETYPES.filter(
      (arch) =>
        arch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        arch.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const allMatchedArchetypes = Array.from(
      new Set([...enemyMatches, ...textMatches])
    );

    return {
      enemyMatches,
      counterMatches,
      allMatchedArchetypes,
    };
  }, [searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* CABECERA PRINCIPAL */}
      <div className="bg-gradient-to-r from-zinc-950 via-purple-950/50 to-zinc-950 border border-purple-900/50 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 shadow">
                <Crosshair className="h-5 w-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white">
                Guía Táctica de Counters por Rol & Arquetipos
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
              Consulta al instante cómo neutralizar las elecciones rivales según su clase (inmóviles, splitpushers, hypercarries, invaders o enchanters).
              Descubre qué selecciones de <strong className="text-purple-300">Void Lynx</strong> destruyen su condición de victoria.
            </p>
          </div>

          {/* Buscador Rápido de Campeón Enemigo */}
          <div className="w-full lg:w-80 shrink-0">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-purple-400" />
              Buscador de Campeón Rival o Counter:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ej: Jinx, Fiora, Jarvan IV, Viktor..."
                className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all pr-8 shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SELECTOR DE ROLES */}
        <div className="mt-5 pt-4 border-t border-purple-900/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 uppercase font-bold mr-1">
              Posición Rival:
            </span>
            {ROLES_ORDER.map((role) => {
              const isSelected = selectedRole === role && !searchQuery;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50 scale-105 border border-purple-400"
                      : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <RoleIconOnly role={role} size="sm" />
                  <span>{role === "JGL" ? "JNGL" : role}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Roster Void Lynx conectado</span>
          </div>
        </div>
      </div>

      {/* CASO: RESULTADOS DE BÚSQUEDA */}
      {searchResults && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-purple-950/40 border border-purple-500/40 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-purple-200">
              <Target className="h-4 w-4 text-purple-400" />
              <span>
                Resultados para <strong className="text-white">"{searchQuery}"</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs font-mono text-purple-300 hover:text-white underline"
            >
              Limpiar búsqueda
            </button>
          </div>

          {/* Si el campeón buscado es un counter directo */}
          {searchResults.counterMatches.length > 0 && (
            <div className="bg-zinc-950 border border-emerald-500/40 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-300 font-display font-bold text-base uppercase">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span>
                  "{searchQuery}" es un Counter-Pick de Élite contra:
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.counterMatches.map(({ archetype, counterDetail }, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3"
                  >
                    <img
                      src={getChampionAvatar(counterDetail.champion)}
                      alt={counterDetail.champion}
                      className="h-12 w-12 rounded-lg object-cover border-2 border-emerald-500/50 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{counterDetail.champion}</span>
                        <RoleBadge role={counterDetail.role} size="sm" showLabel={true} />
                        <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40 px-2 py-0.2 rounded">
                          {counterDetail.category}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-zinc-300 block mb-1">
                        Castiga el arquetipo: <strong className="text-purple-300">{archetype.title} ({archetype.role})</strong>
                      </span>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        {counterDetail.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Arquetipos coincidentes */}
          {searchResults.allMatchedArchetypes.length > 0 ? (
            <div className="space-y-6">
              {searchResults.allMatchedArchetypes.map((archetype) => (
                <ArchetypeCard
                  key={archetype.id}
                  archetype={archetype}
                  getRosterEntries={getRosterEntries}
                />
              ))}
            </div>
          ) : (
            searchResults.counterMatches.length === 0 && (
              <div className="text-center py-12 bg-zinc-950 rounded-2xl border border-zinc-800 text-zinc-400 text-sm">
                No se encontraron arquetipos directos para "{searchQuery}". Intenta buscar por nombre de tirador (ej: Jinx, Aphelios), duelista (Fiora), o iniciador (Jarvan IV).
              </div>
            )
          )}
        </div>
      )}

      {/* CASO: VISTA REGULAR POR ROL */}
      {!searchResults && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RoleBadge role={selectedRole} size="md" showLabel={true} />
              <span className="text-sm font-mono text-zinc-400">
                — {roleArchetypes.length} Arquetipos de Amenaza Identificados
              </span>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              Consejo: Haz clic en cualquier counter para verificar su viabilidad en roster
            </span>
          </div>

          <div className="space-y-6">
            {roleArchetypes.map((archetype) => (
              <ArchetypeCard
                key={archetype.id}
                archetype={archetype}
                getRosterEntries={getRosterEntries}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponente: Tarjeta de Arquetipo de Amenaza y sus Counters
interface ArchetypeCardProps {
  archetype: EnemyRoleArchetype;
  getRosterEntries: (champName: string) => PlayerChampionEntry[];
}

function ArchetypeCard({ archetype, getRosterEntries }: ArchetypeCardProps) {
  return (
    <div className="rounded-2xl border-2 border-zinc-800/90 bg-zinc-950/95 overflow-hidden shadow-2xl transition-all hover:border-purple-900/60">
      {/* CABECERA DEL ARQUETIPO */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950 border-b border-zinc-800">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <RoleBadge role={archetype.role} size="sm" showLabel={true} />
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-wide text-white">
                {archetype.title}
              </h3>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300">
                Arquetipo Rival
              </span>
            </div>

            <p className="text-xs sm:text-sm font-mono text-zinc-300 font-medium">
              {archetype.tagline}
            </p>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-4xl">
              {archetype.description}
            </p>
          </div>

          {/* Campeones Rival Ejemplo con Retratos */}
          <div className="shrink-0 bg-black/60 border border-zinc-800 rounded-xl p-3">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-2">
              Campeones Enemigos Típicos:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {archetype.enemyChampions.map((c) => {
                const champData = findChampion(c);
                return (
                  <div
                    key={c}
                    title={champData ? champData.name : c}
                    className="group relative"
                  >
                    <img
                      src={getChampionAvatar(c)}
                      alt={c}
                      className="h-9 w-9 rounded-lg object-cover border border-zinc-700 hover:border-rose-500 transition-all hover:scale-110 shadow"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vulnerabilidad & Win Condition Callout */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-zinc-800/80">
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-rose-300 block mb-0.5">
                Vulnerabilidad Estratégica:
              </span>
              <p className="text-xs text-rose-100/90 leading-snug">
                {archetype.vulnerability}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-purple-300 block mb-0.5">
                Regla de Oro en Draft de Void Lynx:
              </span>
              <p className="text-xs text-purple-100/90 leading-snug">
                {archetype.draftTip}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LISTA DE COUNTERS DIRECTOS RECOMENDADOS */}
      <div className="p-5 sm:p-6 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Swords className="h-4 w-4 text-purple-400" />
            <span>Picks de Respuesta & Counters Recomendados ({archetype.counterPicks.length})</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            Cruza roles: iniciadores en jungla, flanqueadores y counters de carril
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {archetype.counterPicks.map((cp, idx) => {
            const rosterEntries = getRosterEntries(cp.champion);
            const isInRoster = rosterEntries.length > 0;
            const champData = findChampion(cp.champion);

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isInRoster
                    ? "bg-gradient-to-br from-zinc-900/90 via-purple-950/30 to-zinc-950 border-purple-700/60 shadow-lg hover:border-purple-400"
                    : "bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div>
                  {/* Encabezado del counter */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={getChampionAvatar(cp.champion)}
                        alt={cp.champion}
                        className={`h-11 w-11 rounded-xl object-cover border-2 shadow-md shrink-0 ${
                          isInRoster ? "border-purple-400" : "border-zinc-700"
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-black text-sm text-white">
                            {champData ? champData.name : cp.champion}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <RoleBadge role={cp.role} size="sm" showLabel={true} />
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              cp.category === "Hard Counter"
                                ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                                : cp.category === "Synergy Lockdown"
                                ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                                : "bg-zinc-800 text-zinc-300"
                            }`}
                          >
                            {cp.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Habilidad clave */}
                  {cp.keyAbility && (
                    <div className="mb-2">
                      <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md inline-block">
                        ⚡ {cp.keyAbility}
                      </span>
                    </div>
                  )}

                  {/* Razón táctica */}
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {cp.reason}
                  </p>
                </div>

                {/* Sinergia con el Roster de Void Lynx */}
                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
                  {isInRoster ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        En roster: {rosterEntries.map((e) => `${e.jugador} (${e.tier})`).join(", ")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-zinc-500 text-[10px]">
                      Fuera de pool habitual
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
