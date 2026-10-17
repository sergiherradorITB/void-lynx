CREATE TABLE IF NOT EXISTS composiciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  prioridad TEXT NOT NULL DEFAULT 'Situacional',
  descripcion TEXT NOT NULL DEFAULT '',
  counters_descripcion TEXT NOT NULL DEFAULT '',
  counters_campeones TEXT NOT NULL DEFAULT '[]',
  enfoque TEXT NOT NULL DEFAULT '',
  first_pick_safe TEXT NOT NULL DEFAULT '[]',
  no_first_pick_reasons TEXT NOT NULL DEFAULT '[]',
  bans_recomendados TEXT NOT NULL DEFAULT '[]',
  role_priorities TEXT NOT NULL DEFAULT '{"TOP":"Media","JGL":"Media","MID":"Media","ADC":"Media","SUPP":"Media"}',
  notas_staff TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS jugador_campeones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jugador TEXT NOT NULL,
  campeon_id TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'C',
  tipos_comp TEXT NOT NULL DEFAULT '[]',
  is_first_pickable INTEGER NOT NULL DEFAULT 1,
  pick_tag TEXT NOT NULL DEFAULT 'Normal',
  notas_staff TEXT NOT NULL DEFAULT '',
  UNIQUE(jugador, campeon_id)
);

CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY,
  rival TEXT NOT NULL DEFAULT '',
  nuestro_lado TEXT NOT NULL DEFAULT 'BLUE',
  composicion_id TEXT NOT NULL DEFAULT '',
  resultado TEXT NOT NULL DEFAULT 'PENDING',
  blue_picks TEXT NOT NULL DEFAULT '[]',
  blue_bans TEXT NOT NULL DEFAULT '[]',
  red_picks TEXT NOT NULL DEFAULT '[]',
  red_bans TEXT NOT NULL DEFAULT '[]',
  notas TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jugador ON jugador_campeones(jugador);
CREATE INDEX IF NOT EXISTS idx_campeon ON jugador_campeones(campeon_id);
CREATE INDEX IF NOT EXISTS idx_tier ON jugador_campeones(tier);
CREATE INDEX IF NOT EXISTS idx_pick_tag ON jugador_campeones(pick_tag);
CREATE INDEX IF NOT EXISTS idx_draft_rival ON drafts(rival);
CREATE INDEX IF NOT EXISTS idx_draft_resultado ON drafts(resultado);
