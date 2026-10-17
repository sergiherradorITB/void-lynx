export interface DrafterLiveState {
  roomId: string;
  done: boolean;
  step: string;
  currentTime: number;
  blueName: string;
  redName: string;
  blueReady: boolean;
  redReady: boolean;
  bluePicks: string[];
  blueBans: string[];
  redPicks: string[];
  redBans: string[];
}

/**
 * Realiza el handshake puro HTTP con socket.drafter.lol
 * para consultar en tiempo real el estado de una sala.
 */
export async function queryDrafterRoom(roomId: string): Promise<DrafterLiveState | null> {
  const cleanId = (roomId
    .replace(/^https?:\/\/(www\.)?drafter\.lol\/(draft\/)?/, "")
    .split("?")[0] ?? "")
    .split("/")[0]
    ?.trim() ?? "";

  if (!cleanId) return null;

  try {
    // 1. Handshake inicial
    const hsRes = await fetch("https://socket.drafter.lol/socket.io/?EIO=4&transport=polling", {
      headers: { Origin: "https://drafter.lol" },
    });
    if (!hsRes.ok) return null;

    const hsText = await hsRes.text();
    const sid = JSON.parse(hsText.substring(1)).sid;
    if (!sid) return null;

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
    if (commaIdx === -1) return null;

    const jsonStr = pollText.substring(commaIdx + 1);
    const [eventName, data] = JSON.parse(jsonStr);

    if (eventName !== "update-state" || !data || !data.draft) return null;

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

    return {
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
    };
  } catch (err) {
    console.error("Error querying drafter room:", err);
    return null;
  }
}
