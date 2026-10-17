// Cloudflare Pages Function: /api/drafter-sync
// Consulta el estado en tiempo real de una sala de Drafter.lol vía proxy HTTP Socket.IO

export const onRequestGet = async (context: { request: Request }) => {
  const url = new URL(context.request.url);
  const roomId = url.searchParams.get("roomId") || url.searchParams.get("room") || "";

  const cleanId = roomId
    .replace(/^https?:\/\/(www\.)?drafter\.lol\/(draft\/)?/, "")
    .split("?")[0]
    .split("/")[0]
    .trim();

  if (!cleanId) {
    return new Response(JSON.stringify({ error: "Parámetro roomId requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 1. Handshake inicial con socket.drafter.lol
    const hsRes = await fetch("https://socket.drafter.lol/socket.io/?EIO=4&transport=polling", {
      headers: { Origin: "https://drafter.lol" },
    });
    if (!hsRes.ok) {
      return new Response(JSON.stringify({ error: "Fallo de conexión con Drafter.lol" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hsText = await hsRes.text();
    const sid = JSON.parse(hsText.substring(1)).sid;
    if (!sid) {
      return new Response(JSON.stringify({ error: "SID no recibido de Drafter.lol" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Conectar a namespace /guest
    await fetch(`https://socket.drafter.lol/socket.io/?EIO=4&transport=polling&sid=${sid}`, {
      method: "POST",
      headers: { Origin: "https://drafter.lol" },
      body: "40/guest,",
    });

    // 3. Consumir confirmación de conexión
    await fetch(`https://socket.drafter.lol/socket.io/?EIO=4&transport=polling&sid=${sid}`, {
      headers: { Origin: "https://drafter.lol" },
    });

    // 4. Enviar join-room
    await fetch(`https://socket.drafter.lol/socket.io/?EIO=4&transport=polling&sid=${sid}`, {
      method: "POST",
      headers: { Origin: "https://drafter.lol" },
      body: `42/guest,["join-room","${cleanId}"]`,
    });

    // 5. Poll para obtener update-state
    const pollRes = await fetch(`https://socket.drafter.lol/socket.io/?EIO=4&transport=polling&sid=${sid}`, {
      headers: { Origin: "https://drafter.lol" },
    });
    const pollText = await pollRes.text();

    const commaIdx = pollText.indexOf(",");
    if (commaIdx === -1) {
      return new Response(JSON.stringify({ error: "Respuesta no válida de Drafter.lol" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const jsonStr = pollText.substring(commaIdx + 1);
    const [eventName, data] = JSON.parse(jsonStr);

    if (eventName !== "update-state" || !data || !data.draft) {
      return new Response(JSON.stringify({ error: "Formato inesperado de Drafter.lol" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const bPicks = [
      data.draft.pick?.blue?.["1"] || "",
      data.draft.pick?.blue?.["2"] || "",
      data.draft.pick?.blue?.["3"] || "",
      data.draft.pick?.blue?.["4"] || "",
      data.draft.pick?.blue?.["5"] || "",
    ];
    const bBans = [
      data.draft.ban?.blue?.["1"] || "",
      data.draft.ban?.blue?.["2"] || "",
      data.draft.ban?.blue?.["3"] || "",
      data.draft.ban?.blue?.["4"] || "",
      data.draft.ban?.blue?.["5"] || "",
    ];
    const rPicks = [
      data.draft.pick?.red?.["1"] || "",
      data.draft.pick?.red?.["2"] || "",
      data.draft.pick?.red?.["3"] || "",
      data.draft.pick?.red?.["4"] || "",
      data.draft.pick?.red?.["5"] || "",
    ];
    const rBans = [
      data.draft.ban?.red?.["1"] || "",
      data.draft.ban?.red?.["2"] || "",
      data.draft.ban?.red?.["3"] || "",
      data.draft.ban?.red?.["4"] || "",
      data.draft.ban?.red?.["5"] || "",
    ];

    return new Response(
      JSON.stringify({
        success: true,
        roomId: cleanId,
        done: !!data.done,
        step: data.step || "",
        currentTime: typeof data.currentTime === "number" ? data.currentTime : 30,
        blueName: data.blueName || "",
        redName: data.redName || "",
        blueReady: !!data.blueReady,
        redReady: !!data.redReady,
        bluePicks: bPicks,
        blueBans: bBans,
        redPicks: rPicks,
        redBans: rBans,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
