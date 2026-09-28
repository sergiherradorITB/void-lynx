import { useEffect } from 'react';

export function TwitterFeed() {
  useEffect(() => {
    const scriptId = 'twitter-wjs';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
    }
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] bg-zinc-950 p-6 border border-purple-500/30">
      <h2 className="text-2xl font-black mb-6 text-white text-center tracking-tight uppercase">
        Última Hora
      </h2>
      <a
        className="twitter-timeline"
        data-height="500"
        data-theme="dark"
        href="https://twitter.com/VoidLynxLOL?ref_src=twsrc%5Etfw"
      >
        Cargando posts de Void Lynx...
      </a>
    </div>
  );
}
