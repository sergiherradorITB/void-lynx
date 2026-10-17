// Cloudflare Pages Function: /api/composiciones
// Maneja GET y POST/PUT para la tabla composiciones en Cloudflare D1

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
    const { results } = await db.prepare("SELECT * FROM composiciones ORDER BY id ASC").all();
    const formatted = (results || []).map((row: any) => ({
      ...row,
      counters_campeones: safeJsonParse(row.counters_campeones, []),
      first_pick_safe: safeJsonParse(row.first_pick_safe, []),
      no_first_pick_reasons: safeJsonParse(row.no_first_pick_reasons, []),
      bans_recomendados: safeJsonParse(row.bans_recomendados, []),
      role_priorities: safeJsonParse(row.role_priorities, {
        TOP: "Media",
        JGL: "Alta",
        MID: "Alta",
        ADC: "Alta",
        SUPP: "Media",
      }),
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
      INSERT INTO composiciones (
        nombre, prioridad, descripcion, counters_descripcion, counters_campeones,
        enfoque, first_pick_safe, no_first_pick_reasons, bans_recomendados, role_priorities, notas_staff
      )
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
      ON CONFLICT(nombre) DO UPDATE SET
        prioridad=excluded.prioridad,
        descripcion=excluded.descripcion,
        counters_descripcion=excluded.counters_descripcion,
        counters_campeones=excluded.counters_campeones,
        enfoque=excluded.enfoque,
        first_pick_safe=excluded.first_pick_safe,
        no_first_pick_reasons=excluded.no_first_pick_reasons,
        bans_recomendados=excluded.bans_recomendados,
        role_priorities=excluded.role_priorities,
        notas_staff=excluded.notas_staff
    `);

    const batch = items.map((c: any) =>
      stmt.bind(
        c.nombre,
        c.prioridad || "Situacional",
        c.descripcion || "",
        c.counters_descripcion || "",
        typeof c.counters_campeones === "string" ? c.counters_campeones : JSON.stringify(c.counters_campeones || []),
        c.enfoque || "",
        typeof c.first_pick_safe === "string" ? c.first_pick_safe : JSON.stringify(c.first_pick_safe || []),
        typeof c.no_first_pick_reasons === "string" ? c.no_first_pick_reasons : JSON.stringify(c.no_first_pick_reasons || []),
        typeof c.bans_recomendados === "string" ? c.bans_recomendados : JSON.stringify(c.bans_recomendados || []),
        typeof c.role_priorities === "string" ? c.role_priorities : JSON.stringify(c.role_priorities || {
          TOP: "Media",
          JGL: "Alta",
          MID: "Alta",
          ADC: "Alta",
          SUPP: "Media",
        }),
        c.notas_staff || ""
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

