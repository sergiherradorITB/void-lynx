// Cloudflare Pages Function: /api/drafts
// Maneja GET (listar historial), POST (guardar/actualizar) y DELETE (eliminar) en Cloudflare D1

interface Env {
  DB?: any;
}

function safeJsonParse(raw: any, fallback: any) {
  if (!raw) return fallback;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export const onRequestGet = async (context: { env: Env }) => {
  const db = context.env.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "D1 database binding 'DB' not configured" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { results } = await db
      .prepare("SELECT * FROM drafts ORDER BY created_at DESC LIMIT 100")
      .all();

    const formatted = (results || []).map((row: any) => ({
      ...row,
      blue_picks: safeJsonParse(row.blue_picks, []),
      blue_bans: safeJsonParse(row.blue_bans, []),
      red_picks: safeJsonParse(row.red_picks, []),
      red_bans: safeJsonParse(row.red_bans, []),
    }));

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const db = context.env.DB;
  if (!db) {
    return new Response(JSON.stringify({ message: "Mock saved in dev (no DB binding)" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const draft = await context.request.json();
    const stmt = db.prepare(`
      INSERT INTO drafts (id, rival, nuestro_lado, composicion_id, resultado, blue_picks, blue_bans, red_picks, red_bans, notas)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
      ON CONFLICT(id) DO UPDATE SET
        rival=excluded.rival,
        nuestro_lado=excluded.nuestro_lado,
        composicion_id=excluded.composicion_id,
        resultado=excluded.resultado,
        blue_picks=excluded.blue_picks,
        blue_bans=excluded.blue_bans,
        red_picks=excluded.red_picks,
        red_bans=excluded.red_bans,
        notas=excluded.notas
    `);

    await stmt
      .bind(
        draft.id || `draft-${Date.now()}`,
        draft.rival || "Rival Desconocido",
        draft.nuestro_lado || "BLUE",
        draft.composicion_id || "",
        draft.resultado || "PENDING",
        typeof draft.blue_picks === "string" ? draft.blue_picks : JSON.stringify(draft.blue_picks || []),
        typeof draft.blue_bans === "string" ? draft.blue_bans : JSON.stringify(draft.blue_bans || []),
        typeof draft.red_picks === "string" ? draft.red_picks : JSON.stringify(draft.red_picks || []),
        typeof draft.red_bans === "string" ? draft.red_bans : JSON.stringify(draft.red_bans || []),
        draft.notas || ""
      )
      .run();

    return new Response(JSON.stringify({ success: true, id: draft.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  const db = context.env.DB;
  if (!db) {
    return new Response(JSON.stringify({ message: "Mock deleted in dev (no DB binding)" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Parámetro 'id' no proporcionado" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.prepare("DELETE FROM drafts WHERE id = ?1").bind(id).run();

    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
