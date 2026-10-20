import React, { useState, useEffect } from "react";
import { PlayerProfile } from "@/data/staff-initial-data";
import { RoleType, RoleIconOnly, RoleBadge } from "@/components/RoleBadge";
import { CHAMPIONS_CATALOG, findChampion, getChampionAvatar } from "@/data/champions";
import { X, UserPlus, Edit3, Trash2, Shield, Crown, Sparkles, Check } from "lucide-react";

interface PlayerModalProps {
  player: PlayerProfile | null; // null => Crear, non-null => Editar
  onClose: () => void;
  onSave: (data: PlayerProfile) => void;
  onDelete?: (name: string) => void;
  existingPlayers: PlayerProfile[];
}

const ROLES: RoleType[] = ["TOP", "JGL", "MID", "ADC", "SUPP"];

const ROLE_COLORS: Record<RoleType, string> = {
  TOP: "text-amber-400",
  JGL: "text-emerald-400",
  MID: "text-cyan-400",
  ADC: "text-purple-400",
  SUPP: "text-rose-400",
};

const DEFAULT_SIGNATURES: Record<RoleType, string> = {
  TOP: "Ornn",
  JGL: "RekSai",
  MID: "Mel",
  ADC: "Aphelios",
  SUPP: "Braum",
};

export function PlayerModal({
  player,
  onClose,
  onSave,
  onDelete,
  existingPlayers,
}: PlayerModalProps) {
  const isEditing = !!player;

  const [name, setName] = useState<string>(player?.name || "");
  const [displayName, setDisplayName] = useState<string>(player?.displayName || "");
  const [role, setRole] = useState<RoleType>(player?.role || "MID");
  const [signatureChamp, setSignatureChamp] = useState<string>(player?.signatureChamp || DEFAULT_SIGNATURES[player?.role || "MID"]);
  const [isStarter, setIsStarter] = useState<boolean>(player ? player.isStarter : false);
  const [champSearch, setChampSearch] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (player) {
      setName(player.name);
      setDisplayName(player.displayName);
      setRole(player.role);
      setSignatureChamp(player.signatureChamp);
      setIsStarter(player.isStarter);
    } else {
      setName("");
      setDisplayName("");
      setRole("MID");
      setSignatureChamp(DEFAULT_SIGNATURES["MID"]);
      setIsStarter(false);
    }
  }, [player]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg("El nombre de invocador es obligatorio.");
      return;
    }

    if (!isEditing && existingPlayers.some((p) => p.name.toLowerCase() === cleanName.toLowerCase())) {
      setErrorMsg(`Ya existe un jugador registrado con el nombre "${cleanName}".`);
      return;
    }

    const cleanDisplay = displayName.trim() || cleanName;
    const cleanSignature = signatureChamp.trim() || DEFAULT_SIGNATURES[role];

    onSave({
      name: cleanName,
      displayName: cleanDisplay,
      role,
      laneTitle: `${role === "JGL" ? "Jungle" : role} Laner`,
      signatureChamp: cleanSignature,
      isStarter,
      color: ROLE_COLORS[role] || "text-purple-400",
    });

    onClose();
  };

  const filteredChamps = champSearch.trim()
    ? CHAMPIONS_CATALOG.filter((c) =>
        c.name.toLowerCase().includes(champSearch.toLowerCase()) ||
        c.id.toLowerCase().includes(champSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border-2 border-purple-500/60 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative space-y-5">
        {/* CABECERA */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-950/80 border border-purple-500/40 rounded-xl text-purple-300">
              {isEditing ? <Edit3 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white uppercase tracking-wide">
                {isEditing ? `Editar Jugador: ${player.displayName}` : "Nuevo Jugador en el Roster"}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Define su posición, titularidad y campeón firma
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-950/70 border border-rose-500/50 p-3 rounded-xl text-xs text-rose-200 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre & Display Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Nombre / ID de Invocador:
              </label>
              <input
                type="text"
                value={name}
                disabled={isEditing}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!displayName) setDisplayName(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Ej: Kaserolo, Tamudor, Baus..."
                className={`w-full bg-zinc-900 border rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all ${
                  isEditing
                    ? "border-zinc-800 opacity-60 cursor-not-allowed"
                    : "border-zinc-700 focus:border-purple-500"
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Nombre a Mostrar:
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nombre visible"
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Posición / Rol */}
          <div>
            <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Posición / Rol Principal:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ROLES.map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      if (!player) setSignatureChamp(DEFAULT_SIGNATURES[r]);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-mono font-black uppercase tracking-wider border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/40 scale-105"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <RoleIconOnly role={r} size="sm" />
                    <span>{r === "JGL" ? "JNGL" : r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estado de Titularidad (Titular vs Suplente) */}
          <div>
            <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Condición en el Equipo:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsStarter(true)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isStarter
                    ? "bg-emerald-950/80 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Crown className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-white">⭐ TITULAR</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Quinteto inicial oficial</span>
                  </div>
                </div>
                {isStarter && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setIsStarter(false)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  !isStarter
                    ? "bg-amber-950/60 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-white">SUPLENTE</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Banquillo y rotación</span>
                  </div>
                </div>
                {!isStarter && <Check className="h-4 w-4 text-amber-400 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Campeón Firma (Signature Champion) */}
          <div>
            <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Campeón Firma / Emblema:
            </label>
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5">
              <img
                src={getChampionAvatar(signatureChamp)}
                alt={signatureChamp}
                className="h-10 w-10 rounded-lg object-cover border border-purple-500/50 shrink-0"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={champSearch || signatureChamp}
                  onChange={(e) => setChampSearch(e.target.value)}
                  placeholder="Buscar campeón..."
                  className="w-full bg-transparent text-xs text-white font-bold placeholder-zinc-500 outline-none"
                />
                <span className="text-[10px] text-purple-300 font-mono">
                  Seleccionado: {signatureChamp}
                </span>
              </div>
            </div>

            {/* Resultados de búsqueda de campeón firma */}
            {filteredChamps.length > 0 && (
              <div className="mt-1.5 p-2 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                {filteredChamps.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSignatureChamp(c.id);
                      setChampSearch("");
                    }}
                    className="flex items-center gap-1.5 bg-zinc-950 hover:bg-purple-950/80 border border-zinc-800 hover:border-purple-400 rounded-lg p-1 pr-2.5 text-xs text-white transition-all cursor-pointer"
                  >
                    <img
                      src={getChampionAvatar(c.id)}
                      alt={c.name}
                      className="h-6 w-6 rounded object-cover"
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
            {isEditing && onDelete && existingPlayers.length > 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Estás seguro de que quieres eliminar a ${player.displayName} del roster?`)) {
                    onDelete(player.name);
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-600/40 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Eliminar Jugador</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono uppercase tracking-wider shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
              >
                {isEditing ? "Guardar Cambios" : "Añadir al Roster"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
