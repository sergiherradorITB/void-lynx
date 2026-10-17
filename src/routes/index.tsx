import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import newLogo from "@/assets/new-logo.png";
import {
  socials,
  roster,
  staff,
  nav,
  socialIcons,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  type PlayerHighlight,
} from "@/config/constants";
import { RoleBadge, type RoleType } from "@/components/RoleBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Void Lynx — Equipo de Esports de League of Legends" },
      {
        name: "description",
        content:
          "Void Lynx: Roster oficial y staff táctico del equipo competitivo de League of Legends. Dominancia en la Grieta del Invocador.",
      },
      { property: "og:title", content: "Void Lynx — League of Legends Esports" },
      {
        property: "og:description",
        content: "Roster titular y staff del equipo competitivo de League of Legends Void Lynx.",
      },
    ],
  }),
  component: Index,
});

function getRoleKey(roleStr: string): RoleType {
  const upper = roleStr.toUpperCase();
  if (upper.includes("JUNGLE") || upper === "JGL") return "JGL";
  if (upper.includes("SUPPORT") || upper === "SUPP") return "SUPP";
  if (upper.includes("MID")) return "MID";
  if (upper.includes("TOP")) return "TOP";
  return "ADC";
}

const PLAYER_NUMBERS: Record<string, string> = {
  Kaserolo: "01",
  Tamudor: "02",
  Upss: "03",
  Arnoop88: "04",
  Liber: "05",
};

function Index() {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<
    (PlayerHighlight & { player: string; champ: string }) | null
  >(null);

  return (
    <div className="min-h-screen bg-[#07060b] text-zinc-100 font-sans selection:bg-purple-600 selection:text-white relative overflow-hidden tactical-grid">
      {/* Ambient background lighting */}
      <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-purple-900/20 via-fuchsia-950/10 to-transparent blur-[140px] z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-950/10 blur-[160px] z-0" />

      {/* Top Tactical Header */}
      <header className="fixed top-0 w-full z-50 bg-[#07060b]/80 backdrop-blur-2xl border-b border-purple-900/20 shadow-2xl">
        <div className="mx-auto flex w-full max-w-[2560px] items-center justify-between px-6 py-4 lg:px-12">
          <a href="#top" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-600/30 blur-md rounded-full group-hover:scale-125 transition-transform duration-500" />
              <img
                src={newLogo}
                alt="Void Lynx Logo"
                className="h-9 w-9 object-contain brightness-[2.2] contrast-[1.2] relative z-10 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <span className="font-display font-black tracking-[0.25em] text-sm uppercase text-white block leading-none">
                VOID LYNX
              </span>
              <span className="text-[9px] font-mono tracking-widest text-purple-400/80 uppercase block mt-0.5">
                LOL ESPORTS DIVISION
              </span>
            </div>
          </a>

          <nav className="flex items-center gap-6 sm:gap-8 text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="hover:text-purple-300 transition-colors hidden sm:inline relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-purple-500 after:transition-all after:duration-300"
              >
                {n.label}
              </a>
            ))}

            <Link
              to="/staff"
              className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-950/90 via-purple-900/80 to-purple-950/90 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white transition-all shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] font-mono text-[11px] font-bold tracking-wider"
            >
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-display font-bold uppercase tracking-widest">STAFF DRAFTER</span>
              <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </nav>
        </div>
      </header>

      <main id="top" className="relative z-10 mx-auto w-full max-w-[2560px] pt-28 pb-20 sm:pb-36">
        {/* HERO SECTION: Esports Stage Atmosphere */}
        <section className="relative flex flex-col items-center text-center mt-12 mb-36 px-6 overflow-hidden">
          {/* Tactical Status Eyebrow */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 backdrop-blur-md text-[11px] font-mono tracking-widest text-purple-300 uppercase mb-8 shadow-[0_0_20px_rgba(168,85,247,0.2)] animate-in fade-in slide-in-from-top-3 duration-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-zinc-400">CIRCUITO TORMENTA 2026</span>
            <span className="text-zinc-600">•</span>
            <span className="font-bold text-purple-300">COMPETITIVE ROSTER</span>
          </div>

          {/* Central Logo Aura */}
          <div className="relative group cursor-pointer mb-6">
            <div className="absolute inset-0 bg-purple-600/25 blur-[120px] rounded-full scale-150 group-hover:scale-175 opacity-60 group-hover:opacity-100 transition-all duration-1000" />
            <img
              src={newLogo}
              alt="Void Lynx Logo"
              className="w-44 sm:w-64 object-contain relative z-10 mix-blend-lighten contrast-[1.25] brightness-[2.2] transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Main Esports Heading */}
          <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-display font-black uppercase tracking-tight text-white drop-shadow-2xl mb-4 leading-none select-none">
            VOID LYNX
          </h1>

          <p className="text-base sm:text-xl font-display font-semibold tracking-[0.2em] text-purple-300 uppercase max-w-2xl mb-8">
            Silence before the leap.
          </p>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed font-sans">
            Equipo competitivo de League of Legends. Analítica táctica, draft predictivo y dominancia coordinada en la Grieta del Invocador.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-3xl mb-12 px-4">
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-purple-900/30 backdrop-blur-md">
              <span className="block font-display font-black text-2xl sm:text-3xl text-purple-400">
                5
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500 mt-1">
                Titulares Activos
              </span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-purple-900/30 backdrop-blur-md">
              <span className="block font-display font-black text-2xl sm:text-3xl text-purple-400">
                8
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500 mt-1">
                Compos Tácticas
              </span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-purple-900/30 backdrop-blur-md">
              <span className="block font-display font-black text-2xl sm:text-3xl text-purple-400">
                172
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500 mt-1">
                Campeones en BBDD
              </span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-purple-900/30 backdrop-blur-md">
              <span className="block font-display font-black text-2xl sm:text-3xl text-purple-400">
                D1
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500 mt-1">
                Cloudflare SQL
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-16">
            <Link
              to="/staff"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-display font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_35px_rgba(168,85,247,0.4)] hover:shadow-[0_0_55px_rgba(168,85,247,0.7)] hover:scale-105 active:scale-95"
            >
              <span>⚡ Staff Tactical Drafter</span>
              <span>→</span>
            </Link>

            <a
              href="#roster"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white font-display font-bold text-xs uppercase tracking-widest transition-all backdrop-blur-md"
            >
              <span>Ver Roster Titular</span>
              <span>↓</span>
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex flex-wrap items-center justify-center gap-7 pt-4 border-t border-purple-900/20 max-w-md mx-auto">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                title={s.name}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-purple-300 transition-colors hover:scale-110"
              >
                <span className="h-5 w-5 block overflow-visible shrink-0">
                  {socialIcons[s.name]}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ROSTER SECTION */}
        <section id="roster" className="mb-40 scroll-mt-28">
          <div className="px-6 lg:px-12 mb-12 flex items-baseline justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              <h2 className="text-sm font-display font-black tracking-[0.35em] uppercase text-white">
                Roster Titular 2026
              </h2>
            </div>
            <div className="h-px bg-gradient-to-r from-purple-500/30 to-transparent flex-1 hidden sm:block" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              5 Jugadores • Starting Five
            </span>
          </div>

          <div className="flex flex-col border-y border-purple-900/20">
            {roster.map((p, idx) => {
              const isExpanded = expandedPlayer === p.nick;
              const roleKey = getRoleKey(p.role);
              const numberTag = PLAYER_NUMBERS[p.nick] || `0${idx + 1}`;

              return (
                <div key={p.role} className="border-b border-purple-900/20 last:border-b-0 flex flex-col">
                  {/* Main Player Row */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpandedPlayer(isExpanded ? null : p.nick)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setExpandedPlayer(isExpanded ? null : p.nick)
                    }
                    className={`group relative py-12 lg:py-16 px-6 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between cursor-pointer transition-all duration-500 overflow-hidden ${
                      isExpanded
                        ? "bg-purple-950/30 shadow-[inset_0_0_60px_rgba(168,85,247,0.15)]"
                        : "hover:bg-purple-950/15"
                    }`}
                  >
                    {/* Champion Background Artwork */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-50 transition-opacity duration-1000 pointer-events-none z-0 mix-blend-screen flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#07060b] via-[#07060b]/80 to-transparent z-10" />
                      <img
                        src={p.champ}
                        alt=""
                        className={`w-full h-full object-cover object-[center_25%] grayscale scale-105 group-hover:scale-100 transition-transform duration-[3s] ease-out ${
                          p.imageClass || "contrast-115 brightness-95"
                        }`}
                      />
                    </div>

                    {/* Left: Number, Role Badge, Flag, Nickname */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-8 z-10 relative">
                      <span className="font-mono text-xs font-bold tracking-widest text-purple-400/60 w-8">
                        #{numberTag}
                      </span>

                      <RoleBadge role={roleKey} showLabel={false} size="md" />

                      <div className="flex flex-wrap items-baseline gap-4 sm:gap-6">
                        <h3 className="text-5xl sm:text-6xl lg:text-8xl font-display font-black uppercase tracking-tight text-white/90 group-hover:text-white transition-colors drop-shadow-xl">
                          {p.nick}
                        </h3>

                        {/* Signature champions chips on card preview */}
                        {p.signatureChampions && p.signatureChampions.length > 0 && (
                          <div className="hidden sm:flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            {p.signatureChampions.slice(0, 3).map((c) => (
                              <span
                                key={c}
                                className="px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-300"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* OP.GG link */}
                        {p.opgg && (
                          <a
                            href={p.opgg}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="pointer-events-auto opacity-70 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 bg-zinc-900/90 hover:bg-purple-900/70 border border-zinc-800 hover:border-purple-500/50 rounded-full px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-300 hover:text-white shrink-0"
                          >
                            <span>OP.GG</span>
                            <span className="text-[10px]">↗</span>
                          </a>
                        )}

                        {/* Expand Trigger Button */}
                        <div
                          className={`pointer-events-auto flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-300 ${
                            isExpanded
                              ? "border-purple-400 bg-purple-600/30 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                              : "border-zinc-800 bg-zinc-900/80 text-zinc-400 group-hover:border-purple-500/50 group-hover:text-purple-300"
                          }`}
                        >
                          <span>{isExpanded ? "Cerrar Dossier" : "Ver Perfil y Jugadas"}</span>
                          <span className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                            ▼
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Role, Handle & Quote */}
                    <div className="flex flex-col items-start lg:items-end mt-6 lg:mt-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500 z-10 relative">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg sm:text-xl font-display font-black tracking-widest uppercase text-purple-400">
                          {p.role}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500 tracking-wider">
                          [{p.flag}]
                        </span>
                      </div>

                      {p.href ? (
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-mono tracking-wider text-zinc-400 hover:text-purple-300 transition-colors uppercase flex items-center gap-1.5 pointer-events-auto"
                        >
                          <span className="h-3 w-3 shrink-0">{socialIcons.X}</span>
                          {p.social}
                        </a>
                      ) : (
                        <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                          {p.social}
                        </span>
                      )}

                      <span className="text-xs text-zinc-400 max-w-xs text-left lg:text-right mt-3 leading-relaxed italic">
                        "{p.desc}"
                      </span>
                    </div>
                  </div>

                  {/* Expanded Player Dossier */}
                  {isExpanded && (
                    <div className="relative z-20 border-t border-purple-500/30 bg-gradient-to-b from-[#100d1c] via-[#090812] to-[#07060b] px-6 lg:px-12 py-10 lg:py-14 overflow-hidden animate-in fade-in-50 slide-in-from-top-4 duration-500">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
                        {/* Left Column: Player Profile (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <RoleBadge role={roleKey} showLabel size="sm" />
                              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                                TITULAR // ROSTER 2026
                              </span>
                            </div>

                            <h4 className="text-4xl sm:text-5xl font-display font-black uppercase text-white tracking-tight">
                              {p.nick}
                            </h4>

                            <p className="mt-2 text-sm text-zinc-300 italic">"{p.desc}"</p>
                          </div>

                          {/* Socials & Profiles */}
                          <div>
                            <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 mb-2.5">
                              Perfiles Verificados
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                              {p.href && (
                                <a
                                  href={p.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-purple-900/40 border border-zinc-800 hover:border-purple-500/50 text-xs font-mono text-zinc-200 hover:text-white transition-all shadow-sm"
                                >
                                  <span className="h-3.5 w-3.5 text-zinc-400">{socialIcons.X}</span>
                                  <span>{p.social}</span>
                                </a>
                              )}

                              {p.opgg && (
                                <a
                                  href={p.opgg}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-xs font-mono font-bold text-purple-200 hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                >
                                  <span>ABRIR OP.GG</span>
                                  <span>↗</span>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Signature Champions */}
                          {p.signatureChampions && p.signatureChampions.length > 0 && (
                            <div className="pt-2">
                              <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 mb-2.5">
                                Campeones Insignia
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {p.signatureChampions.map((champ) => (
                                  <span
                                    key={champ}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-purple-900/40 text-xs font-mono font-bold text-purple-200 tracking-wider shadow-sm"
                                  >
                                    ★ {champ}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column: Highlights (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-xs font-mono font-bold tracking-widest uppercase text-purple-300">
                                Clutches & Jugadas Destacadas
                              </p>
                              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                                Void Lynx LoL
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {p.highlights?.map((hl, hlIdx) => (
                                <div
                                  key={hlIdx}
                                  onClick={() =>
                                    setActiveHighlight({ player: p.nick, champ: p.champ, ...hl })
                                  }
                                  className="group/clip relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/90 p-3.5 transition-all duration-300 hover:border-purple-500/60 hover:bg-zinc-900/80 hover:-translate-y-0.5 cursor-pointer shadow-lg overflow-hidden"
                                >
                                  <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2.5 bg-black">
                                    <img
                                      src={getYouTubeThumbnail(hl.youtubeUrl, p.champ)}
                                      alt={hl.title}
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = p.champ;
                                      }}
                                      className="w-full h-full object-cover grayscale group-hover/clip:grayscale-0 group-hover/clip:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[10px] font-mono font-bold text-zinc-300">
                                      {hl.duration}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-9 h-9 rounded-full bg-purple-600/90 group-hover/clip:bg-purple-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.7)] group-hover/clip:scale-110 transition-all duration-300">
                                        <span className="text-xs translate-x-0.5">▶</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-purple-400 block truncate">
                                      {hl.tournament}
                                    </span>
                                    <h5 className="text-xs font-bold text-white group-hover/clip:text-purple-200 transition-colors mt-0.5 line-clamp-2">
                                      {hl.title}
                                    </h5>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-6 mt-6 border-t border-purple-900/20">
                            <p className="text-xs font-mono text-zinc-500">
                              Haz clic en una jugada para ver la repetición.
                            </p>
                            <button
                              type="button"
                              onClick={() => setExpandedPlayer(null)}
                              className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-400 hover:text-purple-300 transition-colors"
                            >
                              Cerrar Dossier ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* STAFF SECTION */}
        <section id="staff" className="relative scroll-mt-28 py-8 mb-36">
          <div className="px-6 lg:px-12 mb-12 flex items-baseline justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              <h2 className="text-sm font-display font-black tracking-[0.35em] uppercase text-white">
                Cuerpo Técnico & Staff
              </h2>
            </div>
            <div className="h-px bg-gradient-to-r from-purple-500/30 to-transparent flex-1 hidden sm:block" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Dirección & Coaching
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:px-12">
            {staff.map((s) => (
              <div
                key={s.nick}
                className="group relative flex flex-col justify-between min-h-[220px] p-7 rounded-2xl border border-purple-900/30 bg-gradient-to-br from-zinc-950 via-[#0d0b16] to-[#07060b] hover:border-purple-500/50 transition-all duration-500 overflow-hidden shadow-xl hover:shadow-[0_16px_50px_-12px_rgba(168,85,247,0.3)] hover:-translate-y-1"
              >
                {/* Background Watermark Crest */}
                <div className="pointer-events-none absolute -right-6 -bottom-6 w-44 h-44 select-none opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                  <img
                    src={newLogo}
                    alt=""
                    className="w-full h-full object-contain mix-blend-lighten contrast-[1.2] brightness-[2.2]"
                  />
                </div>

                <div className="relative z-10">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-purple-400 group-hover:text-purple-300 transition-colors">
                    {s.role}
                  </span>

                  <h3 className="mt-2.5 font-display font-black uppercase tracking-tight text-3xl text-white group-hover:text-purple-100 transition-colors">
                    {s.nick}
                  </h3>

                  <div className="h-px bg-white/10 w-10 my-4 group-hover:w-full group-hover:bg-purple-500/50 transition-all duration-500" />
                </div>

                {s.socials && s.socials.length > 0 ? (
                  <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2">
                    {s.socials.map((soc) => (
                      <a
                        key={soc.name}
                        href={soc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${s.nick} en ${soc.name}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-purple-950/80 border border-zinc-800 hover:border-purple-500/50 text-xs font-mono text-zinc-300 hover:text-white transition-all backdrop-blur-sm"
                      >
                        <span className="h-3.5 w-3.5 text-zinc-400">{socialIcons[soc.name]}</span>
                        <span>{soc.handle}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="relative z-10 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                      Void Lynx Staff
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tactical Drafter Hub Card */}
          <div className="mt-14 px-6 lg:px-12">
            <div className="relative rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-950/50 via-zinc-950 to-[#07060b] p-8 sm:p-10 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.25)]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-purple-950/90 border border-purple-500/50 text-purple-300 text-xs px-3 py-1 rounded-full font-mono uppercase tracking-wider font-bold">
                      ⚡ War Room & Tactical Hub
                    </span>
                    <span className="text-zinc-500 text-xs font-mono uppercase">
                      Cloudflare D1 & Pages
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-display font-black uppercase text-white tracking-tight leading-tight">
                    Matriz Táctica de Composiciones & Draft Simulator
                  </h3>
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-sans">
                    Matriz interactiva inspirada en el Excel del equipo: 5 columnas tácticas para los 5 roles titulares (Kaserolo, Tamudor, Upss, arnoop88 y Liber), control de First Picks seguros, advertencias de no abrir a ciegas, counters directos y simulador de fase de bans con persistencia serverless.
                  </p>
                </div>

                <div className="shrink-0">
                  <Link
                    to="/staff"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] hover:scale-105"
                  >
                    <span>Entrar a la Matriz Táctica</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-purple-900/20 py-16 bg-[#050408]">
        <div className="mx-auto w-full max-w-[2560px] px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs font-mono tracking-widest text-zinc-500 uppercase">
          <div className="flex items-center gap-3.5 mb-6 sm:mb-0">
            <img
              src={newLogo}
              alt="Void Lynx"
              className="h-6 w-6 opacity-90 brightness-[2.2] contrast-[1.2]"
            />
            <p>Void Lynx Esports © {new Date().getFullYear()}</p>
          </div>
          <p className="text-purple-400/80">Silence before the leap.</p>
        </div>
      </footer>

      {/* Highlight Video Clip Modal */}
      {activeHighlight && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in-0 duration-300"
          onClick={() => setActiveHighlight(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl border border-purple-500/40 bg-zinc-950 p-6 sm:p-8 shadow-[0_0_80px_rgba(168,85,247,0.4)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300">
                    {activeHighlight.tournament}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {activeHighlight.player}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black uppercase text-white tracking-tight">
                  {activeHighlight.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveHighlight(null)}
                className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors font-mono text-sm"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
              <iframe
                src={`${getYouTubeEmbedUrl(activeHighlight.youtubeUrl)}?autoplay=1&rel=0&modestbranding=1`}
                title={activeHighlight.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
