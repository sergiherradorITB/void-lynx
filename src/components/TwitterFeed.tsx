import { useEffect, useRef, useState } from 'react';

export function TwitterFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Load script if not present
    const scriptId = 'twitter-wjs';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }
    
    // Force widget reload safely
    const loadTwitter = () => {
      // @ts-ignore
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load(containerRef.current);
      } else {
        setTimeout(loadTwitter, 500);
      }
    };
    
    loadTwitter();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] bg-zinc-950 p-6 border border-purple-500/30">
        <h2 className="text-2xl font-black mb-6 text-white text-center tracking-tight uppercase">
          Última Hora
        </h2>
        <div className="min-h-[500px] flex justify-center items-center">
          <span className="text-zinc-500">Iniciando feed...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] bg-zinc-950 p-6 border border-purple-500/30">
      <h2 className="text-2xl font-black mb-6 text-white text-center tracking-tight uppercase">
        Última Hora
      </h2>
      <div ref={containerRef} className="min-h-[500px] flex justify-center">
        <a
          className="twitter-timeline"
          data-height="500"
          data-theme="dark"
          data-tweet-limit="3"
          href="https://twitter.com/VoidLynxLOL?ref_src=twsrc%5Etfw"
        >
          Cargando posts de Void Lynx...
        </a>
      </div>
    </div>
  );
}
