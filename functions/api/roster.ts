// Cloudflare Pages Function: /api/roster
// Maneja perfiles de jugadores (titulares y suplentes) en Cloudflare D1 con fallback seguro

interface Env {
  DB?: any;
}

const DEFAULT_PLAYERS = [
  { name: "Kaserolo", role: "TOP", laneTitle: "Top Laner", displayName: "Kaserolo", signatureChamp: "Ornn", isStarter: 1, color: "text-amber-400" },
  { name: "Tamudor", role: "JGL", laneTitle: "Jungler", displayName: "Tamudor", signatureChamp: "RekSai", isStarter: 1, color: "text-emerald-400" },
  { name: "Upss", role: "MID", laneTitle: "Mid Laner", displayName: "Upss", signatureChamp: "Mel", isStarter: 1, color: "text-cyan-400" },
  { name: "arnoop88", role: "ADC", laneTitle: "ADC / Bot Laner", displayName: "arnoop88", signatureChamp: "Aphelios", isStarter: 1, color: "text-purple-400" },
  { name: "Liber", role: "SUPP", laneTitle: "Support", displayName: "Liber", signatureChamp: "Braum", isStarter: 1, color: "text-rose-400" },
];

async function ensureTable(db: any) {
  await db
    .prepare(`
      CREATE TABLE IF NOT EXISTS jugadores_perfiles (
        name TEXT PRIMARY KEY,
        role TEXT NOT NULL DEFAULT 'MID',
        laneTitle TEXT NOT NULL DEFAULT '',
        displayName TEXT NOT NULL DEFAULT '',
        signatureChamp TEXT NOT NULL DEFAULT '',
        isStarter INTEGER NOT NULL DEFAULT 1,
        color TEXT NOT NULL DEFAULT 'text-purple-400'
      )
    `)
    .run();
}

export const onRequestGet = async (context: { env: Env }) => {
  const db = context.env?.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "D1 database binding 'DB' not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await ensureTable(db);
    const { results } = await db.prepare("SELECT * FROM jugadores_perfiles ORDER BY role, isStarter DESC, name ASC").all();

    if (!results || results.length === 0) {
      // Sembrar datos por defecto si está vacía
      const insertStmt = db.prepare(`
        INSERT OR IGNORE INTO jugadores_perfiles (name, role, laneTitle, displayName, signatureChamp, isStarter, color)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
      `);
      await db.batch(
        DEFAULT_PLAYERS.map((p) =>
          insertStmt.bind(p.name, p.role, p.laneTitle, p.displayName, p.signatureChamp, p.isStarter, p.color)
        )
      );

      const formattedDefaults = DEFAULT_PLAYERS.map((p) => ({
        ...p,
        isStarter: p.isStarter === 1,
      }));
      return new Response(JSON.stringify(formattedDefaults), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formatted = results.map((row: any) => ({
      ...row,
      isStarter: row.isStarter === 1 || row.isStarter === true,
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
  const db = context.env?.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "D1 database binding 'DB' not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await ensureTable(db);
    const body = await context.request.json();
    const items = Array.isArray(body) ? body : [body];

    const stmt = db.prepare(`
      INSERT INTO jugadores_perfiles (name, role, laneTitle, displayName, signatureChamp, isStarter, color)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
      ON CONFLICT(name) DO UPDATE SET
        role=excluded.role,
        laneTitle=excluded.laneTitle,
        displayName=excluded.displayName,
        signatureChamp=excluded.signatureChamp,
        isStarter=excluded.isStarter,
        color=excluded.color
    `);

    const batch = items.map((p: any) =>
      stmt.bind(
        p.name,
        p.role || "MID",
        p.laneTitle || "",
        p.displayName || p.name,
        p.signatureChamp || "",
        p.isStarter === false ? 0 : 1,
        p.color || "text-purple-400"
      )
    );

    // Si enviamos la lista completa, borramos y reinsertamos para reflejar eliminaciones
    if (items.length >= 3) {
      const deleteStmt = db.prepare("DELETE FROM jugadores_perfiles");
      await db.batch([deleteStmt, ...batch]);
    } else {
      await db.batch(batch);
    }

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

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  const db = context.env?.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "D1 database binding 'DB' not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await ensureTable(db);
    const url = new URL(context.request.url);
    const name = url.searchParams.get("name");
    if (!name) {
      return new Response(JSON.stringify({ error: "Missing player name query param" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.prepare("DELETE FROM jugadores_perfiles WHERE name = ?1").bind(name).run();

    return new Response(JSON.stringify({ success: true }), {
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
