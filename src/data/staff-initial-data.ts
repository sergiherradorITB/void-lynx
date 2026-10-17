export type PriorityLevel = "Alta" | "Media" | "Baja";

export interface CompositionData {
  id: string;
  nombre: string;
  prioridad: "Alta Prioridad" | "Media Prioridad" | "Situacional";
  descripcion: string;
  enfoque: string;
  counters_descripcion: string;
  counters_campeones: string[];
  first_pick_safe: string[]; // Campeones que se pueden blind-pickear sin revelar la compo ni arriesgarse a counter
  no_first_pick_reasons: { champ: string; reason: string }[]; // Por qué no firstpickear
  bans_recomendados: string[];
  notas_staff: string;
  role_priorities?: {
    TOP: PriorityLevel;
    JGL: PriorityLevel;
    MID: PriorityLevel;
    ADC: PriorityLevel;
    SUPP: PriorityLevel;
  };
}

export interface PlayerChampionEntry {
  id: string;
  jugador: string;
  campeon_id: string;
  tier: "S" | "A" | "B" | "C";
  tipos_comp: string[];
  is_first_pickable?: boolean;
  pick_tag?: "FP" | "LP" | "Risky" | "Normal";
  notas_staff?: string;
}

export interface PlayerProfile {
  name: string;
  role: "TOP" | "JGL" | "MID" | "ADC" | "SUPP";
  laneTitle: string;
  displayName: string;
  signatureChamp: string;
  isStarter: boolean;
  color: string;
}

export const PLAYERS_LIST: PlayerProfile[] = [
  { name: "Kaserolo", role: "TOP", laneTitle: "Top Laner", displayName: "Kaserolo", signatureChamp: "Ornn", isStarter: true, color: "text-amber-400" },
  { name: "Tamudor", role: "JGL", laneTitle: "Jungler", displayName: "Tamudor", signatureChamp: "RekSai", isStarter: true, color: "text-emerald-400" },
  { name: "Upss", role: "MID", laneTitle: "Mid Laner", displayName: "Upss", signatureChamp: "Mel", isStarter: true, color: "text-cyan-400" },
  { name: "arnoop88", role: "ADC", laneTitle: "ADC / Bot Laner", displayName: "arnoop88", signatureChamp: "Aphelios", isStarter: true, color: "text-purple-400" },
  { name: "Liber", role: "SUPP", laneTitle: "Support", displayName: "Liber", signatureChamp: "Braum", isStarter: true, color: "text-rose-400" },
];

export const INITIAL_COMPOSITIONS: CompositionData[] = [
  {
    id: "siege-4",
    nombre: "SIEGE 4",
    prioridad: "Alta Prioridad",
    descripcion: "Asedio 4-1 con presión dividida y desgaste de torres. Poke a distancia en carril central y control absoluto de flancos.",
    enfoque: "Mid / Late Game",
    counters_descripcion: "Hard engage frontal directo, flanqueos rápidos y asesinos móviles que aíslan al carry o splitpusher.",
    counters_campeones: ["Malphite", "Nautilus", "Nocturne", "Zac", "JarvanIV", "Camille", "Hecarim", "Rakan"],
    first_pick_safe: ["RekSai", "Aphelios", "Gragas", "Senna"],
    no_first_pick_reasons: [
      { champ: "Jayce", reason: "Si lo abres en B1/R1 le sacan Malphite/Camille y no escala a tiempo" },
      { champ: "Fiora", reason: "Top isolado muy susceptible a counterpicks de línea" },
      { champ: "Ziggs", reason: "Revela poke y es vulnerable a hard-engage inmediato" },
    ],
    bans_recomendados: ["Malphite", "Nocturne", "JarvanIV", "Nautilus"],
    notas_staff: "Priorizar jungla con capacidad de contra-iniciación o peel si el rival intenta romper el 4-1.",
    role_priorities: {
      TOP: "Baja",
      JGL: "Baja",
      MID: "Alta",
      ADC: "Alta",
      SUPP: "Media",
    },
  },
  {
    id: "siege-5",
    nombre: "SIEGE 5",
    prioridad: "Media Prioridad",
    descripcion: "Asedio grupal frontal de 5 en carril único. Demolición directa de estructuras, superioridad de rango y oleadas seguras.",
    enfoque: "Mid / Late Game",
    counters_descripcion: "Flanqueo masivo, iniciación a larga distancia y dive explosivo con combo de área.",
    counters_campeones: ["Sion", "JarvanIV", "Kled", "Leona", "Malphite", "Nautilus", "Amumu", "Kennen"],
    first_pick_safe: ["Aphelios", "Senna", "RekSai", "Ornn"],
    no_first_pick_reasons: [
      { champ: "Lux", reason: "Inmóvil, si el rival saca dive masivo muere al primer flash engage" },
      { champ: "Smolder", reason: "Requiere tiempo de stack y el rival acelerará el ritmo" },
    ],
    bans_recomendados: ["Amumu", "Malphite", "Kennen", "JarvanIV"],
    notas_staff: "Necesitamos disengage sólido en support (Braum/Janna/Lulu) para frustrar el flanqueo.",
    role_priorities: {
      TOP: "Media",
      JGL: "Baja",
      MID: "Alta",
      ADC: "Alta",
      SUPP: "Media",
    },
  },
  {
    id: "diver",
    nombre: "DIVER",
    prioridad: "Alta Prioridad",
    descripcion: "Presión ultra-agresiva bajo torre y ejecución coordinada. Forzar dives en early antes de que limpien oleadas.",
    enfoque: "Early / Mid Game",
    counters_descripcion: "Disengage fuerte, poke defensivo y control de masas masivo bajo torre propia.",
    counters_campeones: ["Janna", "Poppy", "Gragas", "Anivia", "Lulu", "Morgana", "Braum", "Alistar"],
    first_pick_safe: ["Pantheon", "RekSai", "KaiSa", "KSante"],
    no_first_pick_reasons: [
      { champ: "Viego", reason: "Necesita resets para funcionar; si el rival pickea Janna/Poppy se queda vendido" },
      { champ: "Renekton", reason: "Si se telegrafía el dive top, el jungla rival hace countergank fácil" },
    ],
    bans_recomendados: ["Janna", "Poppy", "Gragas", "Lulu"],
    notas_staff: "Stackear las oleadas en bot o top. No divear sin visión del jungla rival tras el nivel 3.",
    role_priorities: {
      TOP: "Alta",
      JGL: "Alta",
      MID: "Media",
      ADC: "Media",
      SUPP: "Alta",
    },
  },
  {
    id: "teamfight",
    nombre: "TEAMFIGHT",
    prioridad: "Alta Prioridad",
    descripcion: "Peleas grupales 5v5 coordinadas con cadenas de CC continuo y daño de área masivo alrededor de objetivos mayores.",
    enfoque: "Pre y Post 15 min",
    counters_descripcion: "Split push agresivo 1-3-1 en laterales, composiciones de poke puro que desgastan antes de agruparse.",
    counters_campeones: ["Fiora", "Jayce", "Xerath", "Janna", "Camille", "Jax", "Ziggs", "Corki"],
    first_pick_safe: ["XinZhao", "RekSai", "Aphelios", "KaiSa", "Rell", "Ornn"],
    no_first_pick_reasons: [
      { champ: "Viktor", reason: "Sin movilidad, fácil de cazar si no tienes frontliner ya asegurada" },
      { champ: "Ambessa", reason: "Obliga a peleas cortas; si te pokean desde lejos pierde eficacia" },
    ],
    bans_recomendados: ["Fiora", "Jayce", "Janna", "Camille"],
    notas_staff: "Timing perfecto: sincronizar ultimates con la aparición de dragones y heraldos.",
    role_priorities: {
      TOP: "Media",
      JGL: "Alta",
      MID: "Alta",
      ADC: "Alta",
      SUPP: "Alta",
    },
  },
  {
    id: "soul-drake",
    nombre: "Soul Drake",
    prioridad: "Media Prioridad",
    descripcion: "Control total de neutrales inferiores y condición de victoria por Alma de Dragón. Botlane dominante y ritmo imparable.",
    enfoque: "Early / Neutrales",
    counters_descripcion: "Composiciones de robo de objetivos, escalado tardío superior o emboscadas continuas en el río.",
    counters_campeones: ["Smolder", "Kayle", "Nunu", "Fiddlesticks", "Karthus", "MasterYi", "AurelionSol", "ChoGath"],
    first_pick_safe: ["Aphelios", "Senna", "RekSai", "Braum", "Nautilus"],
    no_first_pick_reasons: [
      { champ: "Smolder", reason: "Early flojo que cede dragones iniciales" },
      { champ: "Kaisa", reason: "Alcance corto en early si el enemigo saca Caitlyn/Lux" },
    ],
    bans_recomendados: ["Smolder", "Nunu", "AurelionSol", "Karthus"],
    notas_staff: "Tamudor debe hacer pathing siempre hacia bot en los primeros 10 minutos.",
    role_priorities: {
      TOP: "Baja",
      JGL: "Alta",
      MID: "Media",
      ADC: "Alta",
      SUPP: "Alta",
    },
  },
  {
    id: "bloque-2",
    nombre: "Bloque 2",
    prioridad: "Situacional",
    descripcion: "Forzar alrededor del lado superior con el dúo TOP + JUNGLA. Requiere que mid y bot no mueran diveados y resistan con solvencia.",
    enfoque: "Early / Mid Game",
    counters_descripcion: "Escalado tardío descontrolado y rivales que castigan botlane en 4v2.",
    counters_campeones: ["Jax", "Kassadin", "Shen", "TwistedFate", "Fiora", "Camille", "Galio", "Ryze"],
    first_pick_safe: ["Ornn", "Galio", "Maokai", "RekSai", "Sejuani"],
    no_first_pick_reasons: [
      { champ: "Jayce", reason: "Si lo campean y muere una vez queda totalmente anulado" },
      { champ: "Chogath", reason: "Muy lento ante picks con movilidad lateral" },
    ],
    bans_recomendados: ["Jax", "Fiora", "TwistedFate", "Shen"],
    notas_staff: "Mid y Bot deben pickear campeones autárquicos con waveclear seguro (ej: Senna, Ryze, Galio).",
    role_priorities: {
      TOP: "Alta",
      JGL: "Alta",
      MID: "Baja",
      ADC: "Baja",
      SUPP: "Baja",
    },
  },
  {
    id: "bloque-3",
    nombre: "Bloque 3",
    prioridad: "Situacional",
    descripcion: "Forzar escaramuzas constantes teniendo un núcleo de 3 campeones fortísimos en peleas de nivel 3 a 6 (Top, Jgl, Mid o Jgl, Mid, Supp).",
    enfoque: "Early Game",
    counters_descripcion: "Ritmo vertiginoso rival en early que esquive el bloque de 3 o desenganche sostenido.",
    counters_campeones: ["LeeSin", "Elise", "Renekton", "Pantheon", "XinZhao", "Nidalee", "Olaf", "Taliyah"],
    first_pick_safe: ["KSante", "XinZhao", "Pantheon", "Rell", "Rakan"],
    no_first_pick_reasons: [
      { champ: "Kled", reason: "Si te sacan Jax o Fiora pierdes la prioridad de skirmish" },
      { champ: "Gwen", reason: "Tarda dos ítems en pelear al 100%" },
    ],
    bans_recomendados: ["LeeSin", "Elise", "Renekton", "Taliyah"],
    notas_staff: "Invasión a nivel 1 o 2 obligatoria para marcar el ritmo de las escaramuzas.",
    role_priorities: {
      TOP: "Alta",
      JGL: "Alta",
      MID: "Alta",
      ADC: "Baja",
      SUPP: "Media",
    },
  },
  {
    id: "los-dosh",
    nombre: "Los Dosh",
    prioridad: "Situacional",
    descripcion: "Composición táctica propia Void Lynx — dúo carry con sinergias específicas de control de línea y frontline inamovible.",
    enfoque: "Mid Game",
    counters_descripcion: "Asesinos con daño explosivo de flanco y campeones de splitpush que dividan la presión.",
    counters_campeones: ["Zed", "Akali", "LeBlanc", "Talon", "Kassadin", "Yone"],
    first_pick_safe: ["Ornn", "Mel", "Seraphine", "RekSai"],
    no_first_pick_reasons: [
      { champ: "Ahri", reason: "Si no tienes frontline asegurada sufre en peleas frontales" },
      { champ: "Udyr", reason: "Kiteable ante composiciones con mucho ralentizamiento" },
    ],
    bans_recomendados: ["Zed", "Akali", "Kassadin", "LeBlanc"],
    notas_staff: "Mantener siempre agrupado el núcleo de Upss y Kaserolo en el mid-game.",
    role_priorities: {
      TOP: "Media",
      JGL: "Media",
      MID: "Alta",
      ADC: "Alta",
      SUPP: "Alta",
    },
  },
];

export const INITIAL_PLAYER_CHAMPIONS: PlayerChampionEntry[] = [
  // ========== KASEROLO — TOP ==========
  { id: "kas-1", jugador: "Kaserolo", campeon_id: "KSante", tier: "S", tipos_comp: ["Bloque 3", "SIEGE 4", "TEAMFIGHT"], is_first_pickable: true, pick_tag: "FP" },
  { id: "kas-2", jugador: "Kaserolo", campeon_id: "Ornn", tier: "S", tipos_comp: ["Bloque 2", "Los Dosh", "SIEGE 4", "SIEGE 5", "TEAMFIGHT"], is_first_pickable: true, pick_tag: "FP" },
  { id: "kas-3", jugador: "Kaserolo", campeon_id: "Ambessa", tier: "A", tipos_comp: ["Bloque 3", "DIVER"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-4", jugador: "Kaserolo", campeon_id: "Galio", tier: "A", tipos_comp: ["Bloque 2", "SIEGE 4", "TEAMFIGHT"], is_first_pickable: true, pick_tag: "FP" },
  { id: "kas-5", jugador: "Kaserolo", campeon_id: "Garen", tier: "A", tipos_comp: ["Bloque 3"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-6", jugador: "Kaserolo", campeon_id: "Kled", tier: "A", tipos_comp: ["Bloque 3", "DIVER"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-7", jugador: "Kaserolo", campeon_id: "Maokai", tier: "A", tipos_comp: ["Bloque 2", "SIEGE 4", "TEAMFIGHT"], is_first_pickable: true, pick_tag: "FP" },
  { id: "kas-8", jugador: "Kaserolo", campeon_id: "Mordekaiser", tier: "A", tipos_comp: ["Bloque 3"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-9", jugador: "Kaserolo", campeon_id: "Sejuani", tier: "A", tipos_comp: ["Los Dosh", "Bloque 2"], is_first_pickable: true, pick_tag: "FP" },
  { id: "kas-10", jugador: "Kaserolo", campeon_id: "Vladimir", tier: "A", tipos_comp: ["TEAMFIGHT"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-11", jugador: "Kaserolo", campeon_id: "Gragas", tier: "B", tipos_comp: ["Bloque 2", "SIEGE 4", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "kas-12", jugador: "Kaserolo", campeon_id: "ChoGath", tier: "B", tipos_comp: ["Bloque 2"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-13", jugador: "Kaserolo", campeon_id: "Gwen", tier: "B", tipos_comp: ["Bloque 3", "TEAMFIGHT"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-14", jugador: "Kaserolo", campeon_id: "Jax", tier: "B", tipos_comp: ["Bloque 3", "SIEGE 4"], is_first_pickable: false, pick_tag: "Risky" },
  { id: "kas-15", jugador: "Kaserolo", campeon_id: "Jayce", tier: "B", tipos_comp: ["Bloque 2", "SIEGE 4"], is_first_pickable: false, pick_tag: "LP" },
  { id: "kas-16", jugador: "Kaserolo", campeon_id: "Kennen", tier: "B", tipos_comp: ["Bloque 3", "TEAMFIGHT"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-17", jugador: "Kaserolo", campeon_id: "Poppy", tier: "B", tipos_comp: ["Bloque 3", "DIVER", "SIEGE 4"], is_first_pickable: true, pick_tag: "FP" },
  { id: "kas-18", jugador: "Kaserolo", campeon_id: "Olaf", tier: "B", tipos_comp: ["Bloque 3", "DIVER"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-19", jugador: "Kaserolo", campeon_id: "Renekton", tier: "B", tipos_comp: ["Bloque 3", "DIVER"], is_first_pickable: false, pick_tag: "Risky" },
  { id: "kas-20", jugador: "Kaserolo", campeon_id: "Rumble", tier: "B", tipos_comp: ["Bloque 3", "TEAMFIGHT"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-21", jugador: "Kaserolo", campeon_id: "Udyr", tier: "B", tipos_comp: ["Los Dosh"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-22", jugador: "Kaserolo", campeon_id: "Gnar", tier: "B", tipos_comp: ["SIEGE 4"], is_first_pickable: true, pick_tag: "FP" },
  { id: "kas-23", jugador: "Kaserolo", campeon_id: "Aatrox", tier: "C", tipos_comp: ["TEAMFIGHT"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "kas-24", jugador: "Kaserolo", campeon_id: "Camille", tier: "C", tipos_comp: ["SIEGE 4", "DIVER"], is_first_pickable: false, pick_tag: "LP" },
  { id: "kas-25", jugador: "Kaserolo", campeon_id: "Fiora", tier: "C", tipos_comp: ["SIEGE 4"], is_first_pickable: false, pick_tag: "LP" },
  { id: "kas-26", jugador: "Kaserolo", campeon_id: "Shen", tier: "C", tipos_comp: ["Bloque 2"], is_first_pickable: false, pick_tag: "Normal" },

  // ========== TAMUDOR — JGL ==========
  { id: "tam-1", jugador: "Tamudor", campeon_id: "Trundle", tier: "S", tipos_comp: ["SIEGE 4", "SIEGE 5"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "tam-2", jugador: "Tamudor", campeon_id: "Viego", tier: "S", tipos_comp: ["SIEGE 4", "SIEGE 5", "DIVER"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "tam-3", jugador: "Tamudor", campeon_id: "XinZhao", tier: "S", tipos_comp: ["Bloque 3", "SIEGE 4", "SIEGE 5", "TEAMFIGHT"], is_first_pickable: true, pick_tag: "Normal" },
  { id: "tam-4", jugador: "Tamudor", campeon_id: "Pantheon", tier: "S", tipos_comp: ["Bloque 3", "SIEGE 4", "SIEGE 5", "DIVER", "TEAMFIGHT"], is_first_pickable: true, pick_tag: "FP" },
  { id: "tam-5", jugador: "Tamudor", campeon_id: "RekSai", tier: "S", tipos_comp: ["SIEGE 4", "SIEGE 5", "DIVER", "TEAMFIGHT", "Soul Drake", "Bloque 2", "Los Dosh", "Bloque 3"], is_first_pickable: true, pick_tag: "FP" },
  { id: "tam-6", jugador: "Tamudor", campeon_id: "Vi", tier: "A", tipos_comp: ["SIEGE 4", "SIEGE 5", "TEAMFIGHT", "DIVER"], is_first_pickable: true, pick_tag: "FP" },
  { id: "tam-7", jugador: "Tamudor", campeon_id: "JarvanIV", tier: "A", tipos_comp: ["SIEGE 4", "SIEGE 5", "TEAMFIGHT", "DIVER"], is_first_pickable: true, pick_tag: "FP" },
  { id: "tam-8", jugador: "Tamudor", campeon_id: "Sejuani", tier: "A", tipos_comp: ["SIEGE 4", "SIEGE 5", "TEAMFIGHT", "Bloque 2"], is_first_pickable: true, pick_tag: "FP" },
  { id: "tam-9", jugador: "Tamudor", campeon_id: "Nocturne", tier: "B", tipos_comp: ["SIEGE 4", "SIEGE 5", "DIVER", "Soul Drake"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "tam-10", jugador: "Tamudor", campeon_id: "Lillia", tier: "B", tipos_comp: ["SIEGE 4", "SIEGE 5"], is_first_pickable: false, pick_tag: "Risky" },
  { id: "tam-11", jugador: "Tamudor", campeon_id: "Ivern", tier: "B", tipos_comp: ["SIEGE 4", "SIEGE 5"], is_first_pickable: false, pick_tag: "LP" },
  { id: "tam-12", jugador: "Tamudor", campeon_id: "Renata", tier: "B", tipos_comp: ["SIEGE 4"], is_first_pickable: false, pick_tag: "LP" },
  { id: "tam-13", jugador: "Tamudor", campeon_id: "Renekton", tier: "B", tipos_comp: ["SIEGE 4"], is_first_pickable: false, pick_tag: "Risky" },
  { id: "tam-14", jugador: "Tamudor", campeon_id: "Maokai", tier: "A", tipos_comp: ["Soul Drake", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },

  // ========== UPSS — MID ==========
  { id: "ups-1", jugador: "Upss", campeon_id: "Ahri", tier: "S", tipos_comp: ["SIEGE 4", "SIEGE 5", "Los Dosh", "DIVER", "Bloque 3"], is_first_pickable: true, pick_tag: "FP" },
  { id: "ups-2", jugador: "Upss", campeon_id: "Jinx", tier: "S", tipos_comp: ["SIEGE 4", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "ups-3", jugador: "Upss", campeon_id: "Sivir", tier: "S", tipos_comp: ["SIEGE 4", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "ups-4", jugador: "Upss", campeon_id: "Mel", tier: "S", tipos_comp: ["Los Dosh", "SIEGE 4", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "ups-5", jugador: "Upss", campeon_id: "Lux", tier: "S", tipos_comp: ["Los Dosh", "SIEGE 5"], is_first_pickable: false, pick_tag: "LP" },
  { id: "ups-6", jugador: "Upss", campeon_id: "Seraphine", tier: "S", tipos_comp: ["Los Dosh", "TEAMFIGHT", "SIEGE 5", "SIEGE 4"], is_first_pickable: true, pick_tag: "FP" },
  { id: "ups-7", jugador: "Upss", campeon_id: "Senna", tier: "A", tipos_comp: ["SIEGE 4", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "ups-8", jugador: "Upss", campeon_id: "Smolder", tier: "A", tipos_comp: ["SIEGE 4", "SIEGE 5"], is_first_pickable: false, pick_tag: "Risky" },
  { id: "ups-9", jugador: "Upss", campeon_id: "Xayah", tier: "A", tipos_comp: ["SIEGE 4", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "ups-10", jugador: "Upss", campeon_id: "Orianna", tier: "A", tipos_comp: ["TEAMFIGHT", "SIEGE 4"], is_first_pickable: true, pick_tag: "FP" },
  { id: "ups-11", jugador: "Upss", campeon_id: "Syndra", tier: "A", tipos_comp: ["TEAMFIGHT", "Soul Drake"], is_first_pickable: true, pick_tag: "FP" },
  { id: "ups-12", jugador: "Upss", campeon_id: "Hwei", tier: "A", tipos_comp: ["SIEGE 5", "TEAMFIGHT"], is_first_pickable: false, pick_tag: "LP" },


  // ========== ARNOOP88 — ADC ==========
  { id: "arn-1", jugador: "arnoop88", campeon_id: "Aphelios", tier: "S", tipos_comp: ["SIEGE 5", "SIEGE 4", "TEAMFIGHT", "Soul Drake", "Bloque 2", "Bloque 3"], is_first_pickable: true, pick_tag: "FP" },
  { id: "arn-2", jugador: "arnoop88", campeon_id: "KaiSa", tier: "S", tipos_comp: ["TEAMFIGHT", "DIVER", "Bloque 2", "Bloque 3", "SIEGE 4"], is_first_pickable: true, pick_tag: "FP" },
  { id: "arn-3", jugador: "arnoop88", campeon_id: "Jinx", tier: "S", tipos_comp: ["SIEGE 4", "SIEGE 5", "TEAMFIGHT"], is_first_pickable: true, pick_tag: "FP" },
  { id: "arn-4", jugador: "arnoop88", campeon_id: "Sivir", tier: "S", tipos_comp: ["SIEGE 4", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "arn-5", jugador: "arnoop88", campeon_id: "Senna", tier: "A", tipos_comp: ["SIEGE 5", "SIEGE 4", "TEAMFIGHT", "Soul Drake", "Bloque 2", "Bloque 3"], is_first_pickable: true, pick_tag: "FP" },
  { id: "arn-6", jugador: "arnoop88", campeon_id: "Smolder", tier: "A", tipos_comp: ["TEAMFIGHT", "SIEGE 5", "SIEGE 4", "DIVER", "Soul Drake", "Bloque 3", "Bloque 2"], is_first_pickable: false, pick_tag: "Risky" },
  { id: "arn-7", jugador: "arnoop88", campeon_id: "Xayah", tier: "A", tipos_comp: ["SIEGE 4", "SIEGE 5", "TEAMFIGHT"], is_first_pickable: true, pick_tag: "FP" },
  { id: "arn-8", jugador: "arnoop88", campeon_id: "Varus", tier: "A", tipos_comp: ["SIEGE 4", "Soul Drake", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "arn-9", jugador: "arnoop88", campeon_id: "Ezreal", tier: "B", tipos_comp: ["SIEGE 4", "DIVER", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "arn-10", jugador: "arnoop88", campeon_id: "Caitlyn", tier: "B", tipos_comp: ["SIEGE 4", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },

  // ========== LIBER — SUPPORT ==========
  { id: "lib-1", jugador: "Liber", campeon_id: "Braum", tier: "S", tipos_comp: ["Bloque 2", "SIEGE 4", "SIEGE 5", "Soul Drake"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-2", jugador: "Liber", campeon_id: "Karma", tier: "S", tipos_comp: ["SIEGE 4", "Soul Drake", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-3", jugador: "Liber", campeon_id: "Lulu", tier: "S", tipos_comp: ["TEAMFIGHT", "SIEGE 4", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-4", jugador: "Liber", campeon_id: "Nami", tier: "S", tipos_comp: ["Soul Drake", "Los Dosh", "SIEGE 4"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-5", jugador: "Liber", campeon_id: "Nautilus", tier: "S", tipos_comp: ["Bloque 3", "DIVER", "TEAMFIGHT", "SIEGE 4"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-6", jugador: "Liber", campeon_id: "Rell", tier: "S", tipos_comp: ["Bloque 3", "TEAMFIGHT", "DIVER", "SIEGE 4"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-7", jugador: "Liber", campeon_id: "Seraphine", tier: "S", tipos_comp: ["TEAMFIGHT", "SIEGE 5", "Los Dosh", "SIEGE 4"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-8", jugador: "Liber", campeon_id: "Zyra", tier: "S", tipos_comp: ["Soul Drake", "SIEGE 5"], is_first_pickable: false, pick_tag: "Risky" },
  { id: "lib-9", jugador: "Liber", campeon_id: "Janna", tier: "A", tipos_comp: ["SIEGE 4", "TEAMFIGHT", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-10", jugador: "Liber", campeon_id: "Milio", tier: "A", tipos_comp: ["Bloque 2", "SIEGE 5", "SIEGE 4"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-11", jugador: "Liber", campeon_id: "Rakan", tier: "A", tipos_comp: ["Bloque 3", "DIVER", "TEAMFIGHT"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-12", jugador: "Liber", campeon_id: "Yuumi", tier: "A", tipos_comp: ["Los Dosh"], is_first_pickable: false, pick_tag: "Normal" },
  { id: "lib-13", jugador: "Liber", campeon_id: "Alistar", tier: "B", tipos_comp: ["DIVER", "TEAMFIGHT", "SIEGE 4"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-14", jugador: "Liber", campeon_id: "Leona", tier: "B", tipos_comp: ["Bloque 3", "DIVER"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-15", jugador: "Liber", campeon_id: "Thresh", tier: "B", tipos_comp: ["Soul Drake", "SIEGE 4", "SIEGE 5"], is_first_pickable: true, pick_tag: "FP" },
  { id: "lib-16", jugador: "Liber", campeon_id: "Renata", tier: "B", tipos_comp: ["SIEGE 4"], is_first_pickable: false, pick_tag: "LP" },
  { id: "lib-17", jugador: "Liber", campeon_id: "Blitzcrank", tier: "C", tipos_comp: ["Bloque 3"], is_first_pickable: false, pick_tag: "Normal" },
];
