import React from "react";
import { RoleIconOnly, RoleType } from "@/components/RoleBadge";
import { PLAYERS_LIST } from "@/data/staff-initial-data";
import { Champion, getChampionAvatar } from "@/data/champions";
import { X, Search } from "lucide-react";

interface QuickAddChampModalProps {
  quickAddRole: RoleType;
  compName: string;
  quickAddTier: "S" | "A" | "B";
  setQuickAddTier: (tier: "S" | "A" | "B") => void;
  quickAddTag: "FP" | "LP" | "Risky" | "Normal";
  setQuickAddTag: (tag: "FP" | "LP" | "Risky" | "Normal") => void;
  quickAddSearch: string;
  setQuickAddSearch: (val: string) => void;
  quickAddMatches: Champion[];
  handleQuickAddChampion: (champId: string) => void;
  onClose: () => void;
}

export function QuickAddChampModal({
  quickAddRole,
  compName,
  quickAddTier,
  setQuickAddTier,
  quickAddTag,
  setQuickAddTag,
  quickAddSearch,
  setQuickAddSearch,
  quickAddMatches,
  handleQuickAddChampion,
  onClose,
}: QuickAddChampModalProps) {
  const player = PLAYERS_LIST.find((p) => p.role === quickAddRole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border-2 border-purple-500/60 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-950/80 border border-purple-500/40 rounded-xl text-purple-300">
              <RoleIconOnly role={quickAddRole} size="md" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white uppercase tracking-wide">
                Añadir Pick a {quickAddRole} ({player?.displayName || player?.name})
              </h3>
              <p className="text-xs text-purple-300/80 font-mono">
                Para composición: "{compName}"
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selectores de Tier y Tag */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block mb-1.5">
              Tier Inicial:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["S", "A", "B"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQuickAddTier(t)}
                  className={`py-1.5 rounded-lg font-mono font-black text-xs border transition-all ${
                    quickAddTier === t
                      ? t === "S"
                        ? "bg-amber-400 text-black border-amber-300"
                        : t === "A"
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-blue-600 text-white border-blue-400"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                  }`}
                >
                  Tier {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block mb-1.5">
              Etiqueta Táctica de Apertura:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "FP" as const, label: "★ FP", color: "bg-emerald-600 text-white border-emerald-400" },
                { id: "LP" as const, label: "Last Pick", color: "bg-rose-600 text-white border-rose-400" },
                { id: "Risky" as const, label: "Risky", color: "bg-amber-500 text-black border-amber-300" },
              ].map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setQuickAddTag(tag.id)}
                  className={`py-1.5 rounded-lg font-mono font-black text-xs border transition-all ${
                    quickAddTag === tag.id
                      ? tag.color
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Buscador de Campeón con Autocompletado */}
        <div>
          <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block mb-1.5">
            Buscar Campeón en el Catálogo:
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              autoFocus
              value={quickAddSearch}
              onChange={(e) => setQuickAddSearch(e.target.value)}
              placeholder="Escribe el nombre del campeón (ej: Aatrox, Mel, Cho'Gath...)"
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Resultados con avatares */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[220px] overflow-y-auto p-1">
          {quickAddMatches.map((champ) => (
            <button
              key={champ.id}
              type="button"
              onClick={() => handleQuickAddChampion(champ.id)}
              className="flex items-center gap-2 bg-zinc-900/90 hover:bg-purple-950/80 border border-zinc-800 hover:border-purple-400 rounded-xl p-2 transition-all text-left group"
            >
              <img
                src={getChampionAvatar(champ.id)}
                alt={champ.name}
                className="h-10 w-10 rounded-lg object-cover border border-zinc-700 group-hover:border-purple-400 shrink-0"
              />
              <div className="min-w-0">
                <span className="font-bold text-xs text-white block truncate leading-tight group-hover:text-purple-200">
                  {champ.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block truncate">
                  {champ.roles.join(", ")}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
