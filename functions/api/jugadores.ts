// Cloudflare Pages Function: /api/jugadores
// Maneja GET y POST/PUT para la tabla jugador_campeones en Cloudflare D1

interface Env {
  DB?: any;
  STAFF_SECRET?: string;
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
    const { results } = await db.prepare("SELECT * FROM jugador_campeones ORDER BY jugador, tier, campeon_id ASC").all();
    const formatted = (results || []).map((row: any) => ({
      ...row,
      tipos_comp: safeJsonParse(row.tipos_comp, []),
      is_first_pickable: row.is_first_pickable !== 0,
      pick_tag: row.pick_tag || (row.is_first_pickable !== 0 ? "FP" : "Normal"),
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
    return new Response(JSON.stringify({ message: "Mock saved (DB not bound in dev)" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await context.request.json();
    const items = Array.isArray(body) ? body : [body];

    const stmt = db.prepare(`
      INSERT INTO jugador_campeones (jugador, campeon_id, tier, tipos_comp, is_first_pickable, pick_tag, notas_staff)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
      ON CONFLICT(jugador, campeon_id) DO UPDATE SET
        tier=excluded.tier,
        tipos_comp=excluded.tipos_comp,
        is_first_pickable=excluded.is_first_pickable,
        pick_tag=excluded.pick_tag,
        notas_staff=excluded.notas_staff
    `);

    const batch = items.map((jc: any) =>
      stmt.bind(
        jc.jugador,
        jc.campeon_id,
        jc.tier || "C",
        typeof jc.tipos_comp === "string" ? jc.tipos_comp : JSON.stringify(jc.tipos_comp || []),
        jc.is_first_pickable === false ? 0 : 1,
        jc.pick_tag || (jc.is_first_pickable === false ? "Normal" : "FP"),
        jc.notas_staff || ""
      )
    );

    await db.batch(batch);

    return new Response(JSON.stringify({ success: true, count: items.length }), {
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

function safeJsonParse(raw: any, fallback: any) {
  if (!raw) return fallback;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

