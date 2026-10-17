import React from "react";
import { Link } from "@tanstack/react-router";
import newLogo from "@/assets/new-logo.png";
import {
  Shield,
  Users,
  Swords,
  Crosshair,
  BarChart3,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ActiveTab } from "./types";

interface StaffHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  saveStatus: "synced" | "saving" | "unsaved";
  handleReset: () => void;
  draftsCount: number;
}

export function StaffHeader({
  activeTab,
  setActiveTab,
  saveStatus,
  handleReset,
  draftsCount,
}: StaffHeaderProps) {
  return (
    <header className="border-b border-purple-900/30 bg-black/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-mono"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver a Web</span>
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <img src={newLogo} alt="Void Lynx" className="h-7 w-7 object-contain" />
          <div>
            <h1 className="font-display font-extrabold text-sm sm:text-base tracking-wider uppercase bg-gradient-to-r from-purple-300 via-white to-purple-400 bg-clip-text text-transparent">
              STAFF TACTICAL HUB & LIVE DRAFTER
            </h1>
            <p className="text-[10px] text-zinc-400 font-mono hidden sm:block">
              Void Lynx Coaching & Competitive Prep
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Indicador de estado de sincronización */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
              saveStatus === "synced"
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                : saveStatus === "saving"
                ? "bg-amber-950/60 border-amber-500/40 text-amber-300 animate-pulse"
                : "bg-rose-950/60 border-rose-500/40 text-rose-300"
            }`}
            title="Sincronización con Cloudflare D1 / LocalStorage"
          >
            {saveStatus === "synced" ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">BBDD Sincronizada</span>
              </>
            ) : saveStatus === "saving" ? (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                <span>Sin sincronizar</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleReset}
            title="Restablecer composiciones y pools a los valores originales del Excel"
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white hover:border-rose-500/50 hover:bg-rose-950/30 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Restablecer Excel</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-white/5 bg-zinc-950/60 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl gap-2 sm:gap-4 overflow-x-auto py-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("drafter")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
              activeTab === "drafter"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Crosshair className="h-4 w-4" />
            <span>1. Asistente Táctico</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("compositions")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
              activeTab === "compositions"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>2. Composiciones & Counters</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("players")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
              activeTab === "players"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>3. Pools de Jugadores</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("live")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
              activeTab === "live"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Swords className="h-4 w-4" />
            <span>4. Sala de Draft en Vivo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
              activeTab === "history"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>5. Historial & Stats ({draftsCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
