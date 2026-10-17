// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

async function fetchDrafterState(roomId: string) {
  const cleanId = (roomId
    .replace(/^https?:\/\/(www\.)?drafter\.lol\/(draft\/)?/, "")
    .split("?")[0] ?? "")
    .split("/")[0]
    ?.trim() ?? "";

  if (!cleanId) return null;

  try {
    const hsRes = await fetch("https://socket.drafter.lol/socket.io/?EIO=4&transport=polling", {
      headers: { Origin: "https://drafter.lol" },
    });
    if (!hsRes.ok) return null;
    const hsText = await hsRes.text();
    const sid = JSON.parse(hsText.substring(1)).sid;
    if (!sid) return null;

    await fetch(`https://socket.drafter.lol/socket.io/?EIO=4&transport=polling&sid=${sid}`, {
      method: "POST",
      headers: { Origin: "https://drafter.lol" },
      body: "40/guest,",
    });

    await fetch(`https://socket.drafter.lol/socket.io/?EIO=4&transport=polling&sid=${sid}`, {
      headers: { Origin: "https://drafter.lol" },
    });

    await fetch(`https://socket.drafter.lol/socket.io/?EIO=4&transport=polling&sid=${sid}`, {
      method: "POST",
      headers: { Origin: "https://drafter.lol" },
      body: `42/guest,["join-room","${cleanId}"]`,
    });

    const pollRes = await fetch(`https://socket.drafter.lol/socket.io/?EIO=4&transport=polling&sid=${sid}`, {
      headers: { Origin: "https://drafter.lol" },
    });
    const pollText = await pollRes.text();
    const commaIdx = pollText.indexOf(",");
    if (commaIdx === -1) return null;

    const [eventName, data] = JSON.parse(pollText.substring(commaIdx + 1));
    if (eventName !== "update-state" || !data || !data.draft) return null;

    return {
      success: true,
      roomId: cleanId,
      done: !!data.done,
      step: data.step || "",
      currentTime: typeof data.currentTime === "number" ? data.currentTime : 30,
      blueName: data.blueName || "",
      redName: data.redName || "",
      blueReady: !!data.blueReady,
      redReady: !!data.redReady,
      bluePicks: [
        data.draft.pick?.blue?.["1"] || "",
        data.draft.pick?.blue?.["2"] || "",
        data.draft.pick?.blue?.["3"] || "",
        data.draft.pick?.blue?.["4"] || "",
        data.draft.pick?.blue?.["5"] || "",
      ],
      blueBans: [
        data.draft.ban?.blue?.["1"] || "",
        data.draft.ban?.blue?.["2"] || "",
        data.draft.ban?.blue?.["3"] || "",
        data.draft.ban?.blue?.["4"] || "",
        data.draft.ban?.blue?.["5"] || "",
      ],
      redPicks: [
        data.draft.pick?.red?.["1"] || "",
        data.draft.pick?.red?.["2"] || "",
        data.draft.pick?.red?.["3"] || "",
        data.draft.pick?.red?.["4"] || "",
        data.draft.pick?.red?.["5"] || "",
      ],
      redBans: [
        data.draft.ban?.red?.["1"] || "",
        data.draft.ban?.red?.["2"] || "",
        data.draft.ban?.red?.["3"] || "",
        data.draft.ban?.red?.["4"] || "",
        data.draft.ban?.red?.["5"] || "",
      ],
    };
  } catch {
    return null;
  }
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        name: "dev-drafter-sync-api",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith("/api/drafter-sync")) {
              const url = new URL(req.url, "http://localhost:8080");
              const roomId = url.searchParams.get("roomId") || url.searchParams.get("room") || "";
              const state = await fetchDrafterState(roomId);
              res.setHeader("Content-Type", "application/json");
              if (!state) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: "No se pudo sincronizar con la sala de Drafter.lol" }));
              } else {
                res.statusCode = 200;
                res.end(JSON.stringify(state));
              }
              return;
            }
            next();
          });
        },
      },
    ],
  },
});

