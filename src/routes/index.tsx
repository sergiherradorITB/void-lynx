import { createFileRoute } from "@tanstack/react-router";
import newLogo from "@/assets/new-logo.png";
import { socials, roster, staff, nav, socialIcons } from "@/config/constants";

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
        content:
          "Roster y staff del equipo de League of Legends Void Lynx.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-purple-500 selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto flex w-full max-w-[2560px] items-center justify-between px-6 py-6 lg:px-12">
          <a href="#top" className="flex items-center gap-4 hover:opacity-70 transition-opacity">
            <img src={newLogo} alt="Void Lynx Logo" className="h-10 w-10 object-contain brightness-[2.5] contrast-[1.2]" />
            <span className="font-bold tracking-[0.3em] text-xs uppercase text-zinc-100">VOID LYNX</span>
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
            <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-zinc-500">Active Roster</h2>
            <div className="h-px bg-white/10 flex-1" />
          </div>
          
          <div className="flex flex-col">
            {roster.map((p) => (
              <div 
                key={p.role} 
                className="group relative border-b border-white/5 py-20 lg:py-32 px-6 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between cursor-default transition-colors hover:bg-white/[0.02] overflow-hidden"
              >
                <div className="absolute inset-0 opacity-20 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none z-0 mix-blend-screen flex items-center justify-center">
                  <div className="absolute inset-0 bg-purple-950/80 group-hover:bg-purple-900/50 mix-blend-color transition-colors duration-1000 z-10" />
                  <img src={p.champ} alt="" className={`w-full h-full object-cover object-[center_20%] grayscale scale-105 group-hover:scale-100 transition-transform duration-[3s] ease-out ${p.imageClass || "contrast-110 brightness-100"}`} />
                </div>

                <div className="flex items-baseline gap-6 lg:gap-12 z-10 relative">
                  <span className="text-xs font-medium tracking-[0.3em] uppercase text-zinc-600 w-8">{p.flag}</span>
                  <h3 className="text-6xl sm:text-7xl lg:text-9xl font-extrabold uppercase tracking-tighter text-white/90 group-hover:text-white transition-colors drop-shadow-2xl">
                    {p.nick}
                  </h3>
                </div>
                
                <div className="flex flex-col items-start lg:items-end mt-6 lg:mt-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500 z-10 relative">
                  <span className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-purple-400 mb-2 drop-shadow-md">{p.role}</span>
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium tracking-widest text-zinc-200 hover:text-purple-300 transition-colors uppercase drop-shadow flex items-center gap-2">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                      {p.social}
                    </a>
                  ) : (
                    <span className="text-sm font-medium tracking-widest text-zinc-500 uppercase drop-shadow flex items-center gap-2">
                      {p.social}
                    </span>
                  )}
                  <span className="text-sm text-zinc-400 max-w-xs text-left lg:text-right mt-4 leading-relaxed drop-shadow italic">"{p.desc}"</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="staff" className="scroll-mt-32">
          <div className="px-6 lg:px-12 mb-16 flex items-baseline gap-4">
            <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-zinc-500">Staff</h2>
            <div className="h-px bg-white/10 flex-1" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 px-6 lg:px-12">
            {staff.map((s) => (
              <div key={s.role} className="flex flex-col group">
                <p className="font-bold uppercase tracking-wide text-2xl text-white/90 group-hover:text-white transition-colors">{s.nick}</p>
                <div className="h-px bg-white/10 w-12 my-4 group-hover:w-full group-hover:bg-purple-500/50 transition-all duration-500" />
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">{s.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-16 mt-32 bg-black">
        <div className="mx-auto w-full max-w-[2560px] px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs font-medium tracking-[0.2em] text-zinc-600 uppercase">
          <div className="flex items-center gap-4 mb-6 sm:mb-0">
            <img src={newLogo} alt="Void Lynx" className="h-6 w-6 opacity-90 brightness-[2.5] contrast-[1.2]" />
            <p>Void Lynx © {new Date().getFullYear()}</p>
          </div>
          <p>Silence before the leap.</p>
        </div>
      </footer>
    </div>
  );
}
