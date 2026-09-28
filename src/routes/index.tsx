import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
import { TwitterFeed } from "@/components/TwitterFeed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Void Lynx — Equipo de esports de League of Legends" },
      {
        name: "description",
        content:
          "Void Lynx: roster y staff del equipo competitivo de League of Legends. Síguenos en nuestras redes.",
      },
      { property: "og:title", content: "Void Lynx — Esports LoL" },
      {
        property: "og:description",
        content: "Roster y staff del equipo de League of Legends Void Lynx.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<
    (PlayerHighlight & { player: string; champ: string }) | null
  >(null);

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-purple-500 selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto flex w-full max-w-[2560px] items-center justify-between px-6 py-6 lg:px-12">
          <a href="#top" className="flex items-center gap-4 hover:opacity-70 transition-opacity">
            <img
              src={newLogo}
              alt="Void Lynx Logo"
              className="h-10 w-10 object-contain brightness-[2.5] contrast-[1.2]"
            />
            <span className="font-bold tracking-[0.3em] text-xs uppercase text-zinc-100">
              VOID LYNX
            </span>
          </a>
          <nav className="hidden gap-10 text-xs font-medium tracking-[0.2em] text-zinc-500 sm:flex uppercase">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-white transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto w-full max-w-[2560px] pt-32 pb-16 sm:pb-32">
        <section className="flex flex-col items-center text-center mt-24 mb-48 px-6">
          <div className="relative group cursor-pointer mb-8">
            <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full scale-150 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            <img
              src={newLogo}
              alt="Void Lynx Logo"
              className="w-48 sm:w-80 object-contain relative z-10 mix-blend-lighten contrast-[1.2]"
            />
          </div>

          <h1 className="text-7xl sm:text-9xl lg:text-[12rem] font-extrabold uppercase tracking-tighter text-white drop-shadow-2xl mb-16 leading-none">
            VOID LYNX
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                title={s.name}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <span className="h-6 w-6 block overflow-visible shrink-0">
                  {socialIcons[s.name]}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section id="roster" className="mb-48 scroll-mt-32">
          <div className="px-6 lg:px-12 mb-16 flex items-baseline gap-4">
            <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-zinc-500">
              Roster Activo
            </h2>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <div className="flex flex-col">
            {roster.map((p) => {
              const isExpanded = expandedPlayer === p.nick;

              return (
                <div key={p.role} className="border-b border-white/5 flex flex-col">
                  {/* Main Player Row (Click to toggle expansion preview) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpandedPlayer(isExpanded ? null : p.nick)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setExpandedPlayer(isExpanded ? null : p.nick)
                    }
                    className={`group relative py-16 lg:py-24 px-6 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between cursor-pointer transition-colors duration-500 overflow-hidden ${
                      isExpanded ? "bg-purple-950/20" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Champion Background Artwork */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none z-0 mix-blend-screen flex items-center justify-center">
                      <div className="absolute inset-0 bg-purple-950/80 group-hover:bg-purple-900/50 mix-blend-color transition-colors duration-1000 z-10" />
                      <img
                        src={p.champ}
                        alt=""
                        className={`w-full h-full object-cover object-[center_20%] grayscale scale-105 group-hover:scale-100 transition-transform duration-[3s] ease-out ${
                          p.imageClass || "contrast-110 brightness-100"
                        }`}
                      />
                    </div>

                    {/* Left: Flag, Nickname, OP.GG & Expand Trigger */}
                    <div className="flex flex-wrap items-baseline gap-6 lg:gap-10 z-10 relative">
                      <span className="text-xs font-medium tracking-[0.3em] uppercase text-zinc-600 w-8">
                        {p.flag}
                      </span>
                      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                        <h3 className="text-6xl sm:text-7xl lg:text-9xl font-extrabold uppercase tracking-tighter text-white/90 group-hover:text-white transition-colors drop-shadow-2xl">
                          {p.nick}
                        </h3>

                        {p.opgg && (
                          <a
                            href={p.opgg}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="pointer-events-auto opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 flex items-center gap-1.5 bg-white/10 hover:bg-purple-500/30 backdrop-blur-sm border border-white/10 hover:border-purple-400/40 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-300 hover:text-white shrink-0"
                          >
                            <span>OP.GG</span>
                            <svg
                              className="w-2.5 h-2.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                              />
                            </svg>
                          </a>
                        )}

                        {/* Interactive Preview Trigger Badge */}
                        <div
                          className={`pointer-events-auto flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                            isExpanded
                              ? "border-purple-400/80 bg-purple-600/30 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                              : "border-white/10 bg-white/5 text-zinc-400 group-hover:border-purple-500/40 group-hover:bg-purple-950/50 group-hover:text-purple-300"
                          }`}
                        >
                          <span className="hidden sm:inline">
                            {isExpanded ? "Cerrar" : "Ver jugadas y perfil"}
                          </span>
                          <span className="sm:hidden">{isExpanded ? "Cerrar" : "Jugadas"}</span>
                          <svg
                            className={`h-3 w-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Right: Role, Social Handle & Quote */}
                    <div className="flex flex-col items-start lg:items-end mt-6 lg:mt-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500 z-10 relative">
                      <span className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-purple-400 mb-2 drop-shadow-md">
                        {p.role}
                      </span>
                      {p.href ? (
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm font-medium tracking-widest text-zinc-200 hover:text-purple-300 transition-colors uppercase drop-shadow flex items-center gap-2 pointer-events-auto"
                        >
                          <span className="h-3 w-3 shrink-0">{socialIcons.X}</span>
                          {p.social}
                        </a>
                      ) : (
                        <span className="text-sm font-medium tracking-widest text-zinc-500 uppercase drop-shadow flex items-center gap-2">
                          {p.social}
                        </span>
                      )}
                      <span className="text-sm text-zinc-400 max-w-xs text-left lg:text-right mt-4 leading-relaxed drop-shadow italic">
                        "{p.desc}"
                      </span>
                    </div>
                  </div>

                  {/* Expanded Player Preview Showcase */}
                  {isExpanded && (
                    <div className="relative z-20 border-t border-purple-500/30 bg-gradient-to-b from-purple-950/25 via-zinc-950 to-black px-6 lg:px-12 py-10 lg:py-14 overflow-hidden animate-in fade-in-50 slide-in-from-top-4 duration-500">
                      {/* Ambient purple aura bloom */}
                      <div className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
                        {/* Left Column: Player Profile, Socials & Stats (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-purple-950/60 border border-purple-500/30 text-purple-300 shadow-sm">
                                {p.role}
                              </span>
                              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                LoL Competitivo
                              </span>
                            </div>

                            <h4 className="text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
                              {p.nick}
                            </h4>

                            <p className="mt-2 text-sm text-zinc-400 italic">"{p.desc}"</p>
                          </div>

                          {/* Social Networks & Verified Profiles */}
                          <div>
                            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-3">
                              Redes sociales y perfiles
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                              {p.href && (
                                <a
                                  href={p.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm group/soc"
                                >
                                  <span className="h-3.5 w-3.5 text-zinc-400 group-hover/soc:text-purple-300 transition-colors">
                                    {socialIcons.X}
                                  </span>
                                  <span>{p.social}</span>
                                </a>
                              )}

                              {p.opgg && (
                                <a
                                  href={p.opgg}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 hover:border-purple-400/60 text-xs font-bold text-purple-200 hover:text-white transition-all shadow-sm"
                                >
                                  <span>VER PERFIL EN OP.GG</span>
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                                    />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Signature Champion Pool */}
                          {p.signatureChampions && p.signatureChampions.length > 0 && (
                            <div className="pt-2">
                              <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-zinc-500 mb-2.5">
                                Campeones principales
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {p.signatureChampions.map((champ) => (
                                  <span
                                    key={champ}
                                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-bold text-zinc-200 tracking-wider hover:border-purple-500/40 hover:text-white transition-colors"
                                  >
                                    {champ}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column: Highlights & Featured Plays (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-400">
                                Jugadas destacadas
                              </p>
                              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest">
                                Void Lynx LoL
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {p.highlights?.map((hl, idx) => (
                                <div
                                  key={idx}
                                  onClick={() =>
                                    setActiveHighlight({ player: p.nick, champ: p.champ, ...hl })
                                  }
                                  className="group/clip relative flex flex-col justify-between rounded-xl border border-white/10 bg-zinc-950/80 p-4 transition-all duration-300 hover:border-purple-500/50 hover:bg-zinc-900/70 hover:-translate-y-0.5 cursor-pointer shadow-lg overflow-hidden"
                                >
                                  {/* Thumbnail banner with video or champion visual */}
                                  <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-black">
                                    <img
                                      src={getYouTubeThumbnail(hl.youtubeUrl, p.champ)}
                                      alt={hl.title}
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = p.champ;
                                      }}
                                      className="w-full h-full object-cover grayscale group-hover/clip:grayscale-0 group-hover/clip:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[10px] font-bold text-zinc-300">
                                      {hl.duration}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-10 h-10 rounded-full bg-purple-600/90 group-hover/clip:bg-purple-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.7)] group-hover/clip:scale-110 transition-all duration-300">
                                        <svg
                                          className="w-4 h-4 translate-x-0.5 fill-current"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-purple-400">
                                      {hl.tournament}
                                    </span>
                                    <h5 className="text-sm font-bold text-white group-hover/clip:text-purple-200 transition-colors mt-0.5">
                                      {hl.title}
                                    </h5>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
                            <p className="text-xs text-zinc-500">
                              Haz clic en una jugada para ver el vídeo.
                            </p>
                            <button
                              type="button"
                              onClick={() => setExpandedPlayer(null)}
                              className="text-xs font-bold tracking-wider uppercase text-zinc-400 hover:text-purple-300 transition-colors"
                            >
                              Cerrar ✕
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

        <section id="staff" className="relative scroll-mt-32 py-12">
          <div className="px-6 lg:px-12 mb-16 flex items-baseline gap-4">
            <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-zinc-500">Staff</h2>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 px-6 lg:px-12">
            {staff.map((s) => (
              <div
                key={s.nick}
                className="group relative flex flex-col justify-between min-h-[220px] p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-black hover:border-purple-500/50 transition-all duration-500 overflow-hidden shadow-xl hover:shadow-[0_16px_50px_-12px_rgba(168,85,247,0.35)] hover:-translate-y-1"
              >
                {/* Big Void Lynx Logo on the side with gradient fade and ambient glow */}
                <div className="pointer-events-none absolute -right-6 -bottom-6 sm:-right-8 sm:-bottom-8 w-44 h-44 sm:w-52 sm:h-52 select-none overflow-visible">
                  {/* Purple aura bloom */}
                  <div className="absolute inset-0 rounded-full bg-purple-600/15 blur-2xl transition-all duration-700 group-hover:bg-purple-500/30 group-hover:scale-125" />

                  {/* Large Void Lynx Logo */}
                  <img
                    src={newLogo}
                    alt=""
                    className="relative z-10 w-full h-full object-contain mix-blend-lighten contrast-[1.2] brightness-[2.2] opacity-25 transition-all duration-700 group-hover:opacity-45 group-hover:scale-105 drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                    style={{
                      maskImage: "linear-gradient(to top left, black 40%, transparent 95%)",
                      WebkitMaskImage: "linear-gradient(to top left, black 40%, transparent 95%)",
                    }}
                  />
                </div>

                {/* Subtle gradient sweep across the card */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/0 to-transparent transition-opacity duration-500 group-hover:via-purple-500/50" />

                {/* Card content */}
                <div className="relative z-10">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-purple-400/90 group-hover:text-purple-300 transition-colors drop-shadow">
                    {s.role}
                  </span>

                  <h3 className="mt-3 font-black uppercase tracking-tight text-3xl sm:text-4xl text-white group-hover:text-purple-100 transition-colors drop-shadow-md">
                    {s.nick}
                  </h3>

                  <div className="h-px bg-white/15 w-12 my-5 group-hover:w-full group-hover:bg-purple-500/60 transition-all duration-500" />
                </div>

                {/* Social links */}
                {s.socials && s.socials.length > 0 ? (
                  <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2">
                    {s.socials.map((soc) => (
                      <a
                        key={soc.name}
                        href={soc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${s.nick} en ${soc.name}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-purple-950/80 border border-white/10 hover:border-purple-500/50 text-xs font-medium tracking-wider text-zinc-300 hover:text-white transition-all backdrop-blur-sm group/soc shadow-sm"
                      >
                        <span className="h-3.5 w-3.5 text-zinc-400 group-hover/soc:text-purple-300 transition-colors shrink-0">
                          {socialIcons[soc.name]}
                        </span>
                        <span>{soc.handle}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="relative z-10 pt-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-600">
                      Void Lynx Staff
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      <section id="social" className="w-full pb-32 px-6 lg:px-12 pt-16"><TwitterFeed /></section></main>

      <footer className="border-t border-white/5 py-16 mt-32 bg-black">
        <div className="mx-auto w-full max-w-[2560px] px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs font-medium tracking-[0.2em] text-zinc-600 uppercase">
          <div className="flex items-center gap-4 mb-6 sm:mb-0">
            <img
              src={newLogo}
              alt="Void Lynx"
              className="h-6 w-6 opacity-90 brightness-[2.5] contrast-[1.2]"
            />
            <p>Void Lynx © {new Date().getFullYear()}</p>
          </div>
          <p>Silence before the leap.</p>
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
            className="relative w-full max-w-4xl rounded-2xl border border-purple-500/40 bg-zinc-950 p-6 sm:p-8 shadow-[0_0_80px_rgba(168,85,247,0.3)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient purple aura */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300">
                    {activeHighlight.tournament}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {activeHighlight.player}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold uppercase text-white tracking-tight">
                  {activeHighlight.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveHighlight(null)}
                className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Player Display Area (Real YouTube Iframe Embed) */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl">
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
