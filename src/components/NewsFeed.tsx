import { newsItems } from '@/config/constants';

export function NewsFeed() {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-zinc-950 p-6 sm:p-10 border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative">
      {/* Background glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-10 border-b border-white/5 pb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase drop-shadow-md">
          Última Hora
        </h2>
        <a 
          href="https://x.com/VoidLynxLOL" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-500/40 border border-purple-500/40 text-xs font-bold text-purple-100 hover:text-white transition-all"
        >
          SEGUIR EN X
        </a>
      </div>

      <div className="relative z-10 grid gap-6">
        {newsItems.map((news) => (
          <article 
            key={news.id} 
            className="group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/40 hover:bg-white/[0.04] transition-all duration-300"
          >
            <div className="flex-shrink-0 pt-1">
              <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 shadow-sm">
                {news.tag}
              </span>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-3 ml-1">
                {news.date}
              </p>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-200 transition-colors mb-2">
                {news.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {news.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
      
      <div className="relative z-10 mt-8 pt-6 border-t border-white/5 text-center sm:hidden">
        <a 
          href="https://x.com/VoidLynxLOL" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-500/40 border border-purple-500/40 text-sm font-bold text-purple-100 transition-all w-full justify-center"
        >
          SÍGUENOS EN X (TWITTER)
        </a>
      </div>
    </div>
  );
}
