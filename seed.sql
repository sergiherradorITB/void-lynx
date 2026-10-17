-- =============================================
-- Void Lynx Drafter — Seed Data (from Excel)
-- =============================================

-- ========== COMPOSICIONES ==========
INSERT INTO composiciones (
  nombre, prioridad, descripcion, counters_descripcion, counters_campeones,
  enfoque, first_pick_safe, no_first_pick_reasons, bans_recomendados, role_priorities
) VALUES
  (
    'SIEGE 4', 'Alta Prioridad',
    'Asedio 4-1 con presión dividida y desgaste de torres. Poke a distancia y control de flancos.',
    'Hard engage frontal, flanqueos rápidos y asesinos móviles',
    '["Malphite","Nautilus","Nocturne","Zac","JarvanIV","Camille","Hecarim","Rakan"]',
    'Mid / Late Game',
    '["RekSai","Aphelios","Gragas","Senna"]',
    '[{"champ":"Jayce","reason":"Si lo abres en B1/R1 le sacan Malphite/Camille y no escala a tiempo"},{"champ":"Fiora","reason":"Top isolado muy susceptible a counterpicks de línea"},{"champ":"Ziggs","reason":"Revela poke y es vulnerable a hard-engage inmediato"}]',
    '["Malphite","Nocturne","JarvanIV","Nautilus"]',
    '{"TOP":"Baja","JGL":"Baja","MID":"Alta","ADC":"Alta","SUPP":"Media"}'
  ),
  (
    'SIEGE 5', 'Media Prioridad',
    'Asedio grupal frontal de 5 en carril único. Demolición directa, rango y control de oleadas.',
    'Flanqueo masivo, iniciación a larga distancia y dive explosivo',
    '["Sion","JarvanIV","Kled","Leona","Malphite","Nautilus","Amumu","Kennen"]',
    'Mid / Late Game',
    '["Aphelios","Senna","RekSai","Ornn"]',
    '[{"champ":"Lux","reason":"Inmóvil, si el rival saca dive masivo muere al primer flash engage"},{"champ":"Smolder","reason":"Requiere tiempo de stack y el rival acelerará el ritmo"}]',
    '["Amumu","Malphite","Kennen","JarvanIV"]',
    '{"TOP":"Media","JGL":"Baja","MID":"Alta","ADC":"Alta","SUPP":"Media"}'
  ),
  (
    'DIVER', 'Alta Prioridad',
    'Presión agresiva bajo torre y ejecución coordinada. Iniciar antes de que limpien oleadas.',
    'Disengage fuerte, poke defensivo y control de masas bajo torre propia',
    '["Janna","Poppy","Gragas","Anivia","Lulu","Morgana","Braum","Alistar"]',
    'Early / Mid Game',
    '["Pantheon","RekSai","KaiSa","KSante"]',
    '[{"champ":"Viego","reason":"Necesita resets para funcionar; si el rival pickea Janna/Poppy se queda vendido"},{"champ":"Renekton","reason":"Si se telegrafía el dive top, el jungla rival hace countergank fácil"}]',
    '["Janna","Poppy","Gragas","Lulu"]',
    '{"TOP":"Alta","JGL":"Alta","MID":"Media","ADC":"Media","SUPP":"Alta"}'
  ),
  (
    'TEAMFIGHT', 'Alta Prioridad',
    'Peleas grupales 5v5 coordinadas con cadenas de CC continuo y daño de área masivo.',
    'Split push agresivo 1-3-1, composiciones de poke y desenganche',
    '["Fiora","Jayce","Xerath","Janna","Camille","Jax","Ziggs","Corki"]',
    'Pre y Post 15 min',
    '["XinZhao","RekSai","Aphelios","KaiSa","Rell","Ornn"]',
    '[{"champ":"Viktor","reason":"Sin movilidad, fácil de cazar si no tienes frontliner ya asegurada"},{"champ":"Ambessa","reason":"Obliga a peleas cortas; si te pokean desde lejos pierde eficacia"}]',
    '["Fiora","Jayce","Janna","Camille"]',
    '{"TOP":"Media","JGL":"Alta","MID":"Alta","ADC":"Alta","SUPP":"Alta"}'
  ),
  (
    'Soul Drake', 'Media Prioridad',
    'Control de neutrales y condición de victoria por Alma de Dragón. Bot ganador y ritmo rápido.',
    'Composiciones de robo y escalado tardío o emboscadas en río',
    '["Smolder","Kayle","Nunu","Fiddlesticks","Karthus","MasterYi","AurelionSol","Chogath"]',
    'Early / Neutrales',
    '["Aphelios","Senna","RekSai","Braum","Nautilus"]',
    '[{"champ":"Smolder","reason":"Early flojo que cede dragones iniciales"},{"champ":"Kaisa","reason":"Alcance corto en early si el enemigo saca Caitlyn/Lux"}]',
    '["Smolder","Kayle","Nunu","Fiddlesticks"]',
    '{"TOP":"Baja","JGL":"Alta","MID":"Media","ADC":"Alta","SUPP":"Alta"}'
  ),
  (
    'Bloque 2', 'Situacional',
    'Forzar alrededor de top con TOP JUNGLA, necesito que mid y bot no puedan morir diveados',
    'Escalado tardío descontrolado y superioridad numérica en líneas laterales',
    '["Jax","Kassadin","Shen","TwistedFate","Fiora","Camille","Galio","Ryze"]',
    'Early / Mid Game',
    '["Ornn","RekSai","Galio","Braum"]',
    '[{"champ":"Gwen","reason":"Débil contra ganks tempranos si la aíslan"},{"champ":"Vladimir","reason":"Sin CC para apoyar las rotaciones de top-jg"}]',
    '["Jax","Kassadin","Fiora","Camille"]',
    '{"TOP":"Alta","JGL":"Alta","MID":"Baja","ADC":"Media","SUPP":"Media"}'
  ),
  (
    'Bloque 3', 'Situacional',
    'Forzar escaramuzas teniendo un buen bloque de 3 para pegarse',
    'Ritmo vertiginoso en early game y pérdida de iniciativa en neutrales',
    '["LeeSin","Elise","Renekton","Pantheon","XinZhao","Nidalee","Olaf","Taliyah"]',
    'Early Game',
    '["Pantheon","XinZhao","Rell","Nautilus"]',
    '[{"champ":"Mordekaiser","reason":"Fácil de kitear si el rival juega poke y retrocede"},{"champ":"Viktor","reason":"Escalado tardío que no aporta daño explosivo en escaramuzas de nivel 3-4"}]',
    '["LeeSin","Elise","Olaf","Renekton"]',
    '{"TOP":"Alta","JGL":"Alta","MID":"Alta","ADC":"Media","SUPP":"Alta"}'
  ),
  (
    'Los Dosh', 'Situacional',
    'Composición interna del equipo — duo carry con sinergias específicas',
    'Hard engage instantáneo y bloqueo de cooldowns',
    '[]',
    'Mid Game',
    '["Ornn","Sejuani","Seraphine","Nami"]',
    '[]',
    '[]',
    '{"TOP":"Media","JGL":"Media","MID":"Alta","ADC":"Alta","SUPP":"Alta"}'
  );

-- ========== KASEROLO — TOP ==========
INSERT INTO jugador_campeones (jugador, campeon_id, tier, tipos_comp) VALUES
  ('Kaserolo', 'KSante', 'S', '["Bloque 3"]'),
  ('Kaserolo', 'Ornn', 'S', '["Bloque 2","Los Dosh"]'),
  ('Kaserolo', 'Ambessa', 'A', '["Bloque 3"]'),
  ('Kaserolo', 'Galio', 'A', '["Bloque 2"]'),
  ('Kaserolo', 'Gragas', 'B', '["Bloque 2"]'),
  ('Kaserolo', 'Garen', 'A', '["Bloque 3"]'),
  ('Kaserolo', 'Chogath', 'B', '["Bloque 2"]'),
  ('Kaserolo', 'Gwen', 'B', '["Bloque 3"]'),
  ('Kaserolo', 'Jax', 'B', '["Bloque 3"]'),
  ('Kaserolo', 'Jayce', 'B', '["Bloque 2"]'),
  ('Kaserolo', 'Kennen', 'B', '["Bloque 3"]'),
  ('Kaserolo', 'Kled', 'A', '["Bloque 3"]'),
  ('Kaserolo', 'Maokai', 'A', '["Bloque 2"]'),
  ('Kaserolo', 'Mordekaiser', 'A', '["Bloque 3"]'),
  ('Kaserolo', 'Poppy', 'B', '["Bloque 3"]'),
  ('Kaserolo', 'Olaf', 'B', '["Bloque 3"]'),
  ('Kaserolo', 'Renekton', 'B', '["Bloque 3"]'),
  ('Kaserolo', 'Rumble', 'B', '["Bloque 3"]'),
  ('Kaserolo', 'Udyr', 'B', '["Los Dosh"]'),
  ('Kaserolo', 'Vladimir', 'A', '[]'),
  ('Kaserolo', 'Zaahen', 'B', '[]'),
  ('Kaserolo', 'Fiora', 'C', '[]'),
  ('Kaserolo', 'Aatrox', 'C', '[]'),
  ('Kaserolo', 'Camille', 'C', '[]'),
  ('Kaserolo', 'Gnar', 'B', '[]'),
  ('Kaserolo', 'Shen', 'C', '[]'),
  ('Kaserolo', 'Sejuani', 'A', '["Los Dosh"]');

-- ========== TAMUDOR — JGL ==========
INSERT INTO jugador_campeones (jugador, campeon_id, tier, tipos_comp) VALUES
  ('Tamudor', 'RekSai', 'S', '["SIEGE 5","SIEGE 4","DIVER","TEAMFIGHT","Soul Drake","Bloque 2","Los Dosh","Bloque 3"]'),
  ('Tamudor', 'Viego', 'S', '["SIEGE 4","SIEGE 5"]'),
  ('Tamudor', 'XinZhao', 'S', '["Bloque 3","SIEGE 4","SIEGE 5","TEAMFIGHT"]'),
  ('Tamudor', 'Pantheon', 'S', '["Bloque 3","SIEGE 4","SIEGE 5","DIVER","TEAMFIGHT"]');

-- ========== UPSS — MID ==========
INSERT INTO jugador_campeones (jugador, campeon_id, tier, tipos_comp) VALUES
  ('Upss', 'Mel', 'S', '["Los Dosh"]'),
  ('Upss', 'Lux', 'S', '["Los Dosh"]'),
  ('Upss', 'Seraphine', 'S', '["Los Dosh"]'),
  ('Upss', 'Ahri', 'A', '["Los Dosh"]');

-- ========== ARNOOP88 — ADC ==========
INSERT INTO jugador_campeones (jugador, campeon_id, tier, tipos_comp) VALUES
  ('arnoop88', 'Aphelios', 'S', '["SIEGE 5","SIEGE 4","TEAMFIGHT","Soul Drake","Bloque 2","Bloque 3"]'),
  ('arnoop88', 'Senna', 'A', '["SIEGE 5","SIEGE 4","TEAMFIGHT","Soul Drake","Bloque 2","Bloque 3"]'),
  ('arnoop88', 'Smolder', 'A', '["TEAMFIGHT","SIEGE 5","SIEGE 4","DIVER","Soul Drake","Bloque 3","Bloque 2"]'),
  ('arnoop88', 'Kaisa', 'S', '["TEAMFIGHT","DIVER","Bloque 2","Bloque 3"]');

-- ========== LIBER — SUPPORT ==========
INSERT INTO jugador_campeones (jugador, campeon_id, tier, tipos_comp) VALUES
  ('Liber', 'Alistar', 'B', '[]'),
  ('Liber', 'Annie', 'B', '[]'),
  ('Liber', 'Bard', 'C', '[]'),
  ('Liber', 'Blitzcrank', 'C', '[]'),
  ('Liber', 'Brand', 'C', '[]'),
  ('Liber', 'Braum', 'S', '[]'),
  ('Liber', 'Galio', 'C', '[]'),
  ('Liber', 'Janna', 'A', '[]'),
  ('Liber', 'Karma', 'S', '[]'),
  ('Liber', 'Leona', 'B', '[]'),
  ('Liber', 'Lulu', 'S', '[]'),
  ('Liber', 'Lux', 'C', '[]'),
  ('Liber', 'Milio', 'A', '[]'),
  ('Liber', 'Nami', 'S', '[]'),
  ('Liber', 'Nautilus', 'S', '[]'),
  ('Liber', 'Neeko', 'C', '[]'),
  ('Liber', 'Poppy', 'C', '[]'),
  ('Liber', 'Rakan', 'A', '[]'),
  ('Liber', 'Rell', 'S', '[]'),
  ('Liber', 'Renata', 'B', '[]'),
  ('Liber', 'Senna', 'B', '[]'),
  ('Liber', 'Shen', 'C', '[]'),
  ('Liber', 'Sona', 'C', '[]'),
  ('Liber', 'Soraka', 'C', '[]'),
  ('Liber', 'TahmKench', 'C', '[]'),
  ('Liber', 'Thresh', 'B', '[]'),
  ('Liber', 'Yuumi', 'A', '[]'),
  ('Liber', 'Zilean', 'B', '[]'),
  ('Liber', 'Zyra', 'S', '[]'),
  ('Liber', 'Seraphine', 'S', '[]');
