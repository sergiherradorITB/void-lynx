import { TwitterTimelineEmbed } from 'react-twitter-embed';

export function TwitterFeed() {
  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] bg-zinc-950 p-6 border border-purple-500/30">
      <h2 className="text-2xl font-black mb-6 text-white text-center tracking-tight uppercase">
        Última Hora
      </h2>
      <div className="min-h-[500px]">
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="VoidLynxLOL"
          options={{ height: 500, theme: 'dark' }}
          noHeader
          noFooter
          noBorders
          transparent
        />
      </div>
    </div>
  );
}
