// Cloudflare Pages Function: /api/drafter-create
// Crea una nueva sala en Drafter.lol vía Next-Action de forma automatizada

export const onRequestPost = async (context: { request: Request }) => {
  try {
    const body = await context.request.json().catch(() => ({}));
    const team1Name = body.team1Name || "Void Lynx";
    const team2Name = body.team2Name || "Rival";
    const fearless = !!body.fearless;
    const ironman = !!body.ironman;
    const firstSelection = !!body.firstSelection;
    const gameAmount = typeof body.gameAmount === "number" ? body.gameAmount : 1;
    const disabledChampions = Array.isArray(body.disabledChampions) ? body.disabledChampions : [];

    const payload = JSON.stringify([
      {
        team1Name,
        team2Name,
        fearless,
        ironman,
        firstSelection,
        gameAmount,
        disabledChampions,
      },
    ]);

    const res = await fetch("https://drafter.lol", {
      method: "POST",
      headers: {
        "Next-Action": "407675613cedb5f180895d4f000a5b67e670f3fb54",
        "Content-Type": "text/plain;charset=UTF-8",
        Origin: "https://drafter.lol",
        Referer: "https://drafter.lol/",
      },
      body: payload,
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Drafter.lol respondió con código HTTP ${res.status}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const text = await res.text();
    // Next.js server actions return chunks like:
    // 1:{"status":200,"data":{"id":"z16XkiHF","url":"https://drafter.lol/draft/z16XkiHF"}}
    const match = text.match(/\{"status":200,"data":\{"id":"([^"]+)","url":"([^"]+)"\}\}/);
    if (match) {
      const id = match[1];
      const draftUrl = match[2];
      return new Response(
        JSON.stringify({
          success: true,
          id,
          url: draftUrl,
          spectatorUrl: `https://drafter.lol/draft/${id}`,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Alternativa: buscar cualquier "id":"..."
    const fallbackMatch = text.match(/"id":"([a-zA-Z0-9_-]+)"/);
    if (fallbackMatch) {
      const id = fallbackMatch[1];
      return new Response(
        JSON.stringify({
          success: true,
          id,
          url: `https://drafter.lol/draft/${id}`,
          spectatorUrl: `https://drafter.lol/draft/${id}`,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "No se pudo extraer el ID de la sala creada", raw: text.slice(0, 500) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Error al crear sala en Drafter.lol" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
