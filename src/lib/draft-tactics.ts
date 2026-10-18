import { findChampion } from "@/data/champions";
import { PlayerChampionEntry } from "@/data/staff-initial-data";

export interface ChampionTacticalProfile {
  damageType: "AD" | "AP" | "Mixed" | "True";
  damageSplit: { ad: number; ap: number; trueDmg: number }; // suma = 100
  engage: number; // 1-5
  disengage: number; // 1-5
  waveclear: number; // 1-5
  frontline: number; // 1-5
  cc: number; // 1-5
  earlyPower: number; // 1-5
  midPower: number; // 1-5
  latePower: number; // 1-5
  winCondition: "Teamfight" | "Pick" | "Splitpush" | "Poke" | "ProtectCarry";
  counters: string[]; // Campeones a los que gana
  counteredBy: string[]; // Campeones con los que sufre
}

// Perfil táctico predeterminado si no está en la base de datos detallada
const DEFAULT_PROFILE: ChampionTacticalProfile = {
  damageType: "AD",
  damageSplit: { ad: 70, ap: 25, trueDmg: 5 },
  engage: 2,
  disengage: 2,
  waveclear: 3,
  frontline: 2,
  cc: 2,
  earlyPower: 3,
  midPower: 3,
  latePower: 3,
  winCondition: "Teamfight",
  counters: [],
  counteredBy: [],
};

// Base de datos de conocimiento táctico competitivo de campeones (metas y arquetipos pro)
export const TACTICAL_CHAMPION_PROFILES: Record<string, Partial<ChampionTacticalProfile>> = {
  // === TOP ===
  aatrox: {
    damageType: "AD",
    damageSplit: { ad: 90, ap: 0, trueDmg: 10 },
    engage: 3,
    disengage: 2,
    waveclear: 3,
    frontline: 3,
    cc: 3,
    earlyPower: 3,
    midPower: 5,
    latePower: 3,
    winCondition: "Teamfight",
    counters: ["sion", "gangplank", "drmundo"],
    counteredBy: ["fiora", "irelia", "kennen"],
  },
  ksante: {
    damageType: "Mixed",
    damageSplit: { ad: 60, ap: 10, trueDmg: 30 },
    engage: 4,
    disengage: 3,
    waveclear: 3,
    frontline: 5,
    cc: 4,
    earlyPower: 3,
    midPower: 4,
    latePower: 4,
    winCondition: "Teamfight",
    counters: ["renekton", "sion", "jax"],
    counteredBy: ["fiora", "gwen", "vayne"],
  },
  renekton: {
    damageType: "AD",
    damageSplit: { ad: 85, ap: 10, trueDmg: 5 },
    engage: 4,
    disengage: 2,
    waveclear: 3,
    frontline: 4,
    cc: 3,
    earlyPower: 5,
    midPower: 4,
    latePower: 2,
    winCondition: "Pick",
    counters: ["riven", "irelia", "yasuo"],
    counteredBy: ["illaoi", "gnar", "quinn"],
  },
  ornn: {
    damageType: "Mixed",
    damageSplit: { ad: 30, ap: 65, trueDmg: 5 },
    engage: 5,
    disengage: 3,
    waveclear: 3,
    frontline: 5,
    cc: 5,
    earlyPower: 2,
    midPower: 4,
    latePower: 5,
    winCondition: "Teamfight",
    counters: ["malphite", "sion"],
    counteredBy: ["fiora", "gwen", "vayne"],
  },
  gnar: {
    damageType: "AD",
    damageSplit: { ad: 75, ap: 20, trueDmg: 5 },
    engage: 4,
    disengage: 3,
    waveclear: 3,
    frontline: 3,
    cc: 4,
    earlyPower: 3,
    midPower: 4,
    latePower: 4,
    winCondition: "Teamfight",
    counters: ["renekton", "darius"],
    counteredBy: ["irelia", "yasuo", "malphite"],
  },
  fiora: {
    damageType: "AD",
    damageSplit: { ad: 60, ap: 0, trueDmg: 40 },
    engage: 2,
    disengage: 2,
    waveclear: 2,
    frontline: 2,
    cc: 2,
    earlyPower: 3,
    midPower: 4,
    latePower: 5,
    winCondition: "Splitpush",
    counters: ["aatrox", "ksante", "ornn", "sion"],
    counteredBy: ["malphite", "kennen", "quinn"],
  },
  jax: {
    damageType: "Mixed",
    damageSplit: { ad: 55, ap: 40, trueDmg: 5 },
    engage: 3,
    disengage: 2,
    waveclear: 2,
    frontline: 3,
    cc: 3,
    earlyPower: 3,
    midPower: 4,
    latePower: 5,
    winCondition: "Splitpush",
    counters: ["camille", "fiora", "irelia"],
    counteredBy: ["malphite", "poppy", "gragas"],
  },
  rumble: {
    damageType: "AP",
    damageSplit: { ad: 5, ap: 95, trueDmg: 0 },
    engage: 3,
    disengage: 2,
    waveclear: 4,
    frontline: 2,
    cc: 3,
    earlyPower: 5,
    midPower: 5,
    latePower: 3,
    winCondition: "Teamfight",
    counters: ["renekton", "sion", "aatrox"],
    counteredBy: ["kled", "irelia", "jayce"],
  },
  gwen: {
    damageType: "AP",
    damageSplit: { ad: 10, ap: 65, trueDmg: 25 },
    engage: 2,
    disengage: 2,
    waveclear: 4,
    frontline: 3,
    cc: 1,
    earlyPower: 2,
    midPower: 4,
    latePower: 5,
    winCondition: "Splitpush",
    counters: ["ornn", "sion", "ksante", "malphite"],
    counteredBy: ["renekton", "riven", "jax"],
  },

  // === JUNGLE ===
  sejuani: {
    damageType: "AP",
    damageSplit: { ad: 20, ap: 75, trueDmg: 5 },
    engage: 5,
    disengage: 3,
    waveclear: 2,
    frontline: 5,
    cc: 5,
    earlyPower: 3,
    midPower: 4,
    latePower: 4,
    winCondition: "Teamfight",
    counters: ["khazix", "nidalee"],
    counteredBy: ["trundle", "olaf", "lillia"],
  },
  maokai: {
    damageType: "AP",
    damageSplit: { ad: 15, ap: 80, trueDmg: 5 },
    engage: 5,
    disengage: 4,
    waveclear: 3,
    frontline: 5,
    cc: 5,
    earlyPower: 3,
    midPower: 4,
    latePower: 4,
    winCondition: "Teamfight",
    counters: ["rengar", "khazix"],
    counteredBy: ["sylas", "olaf"],
  },
  vi: {
    damageType: "AD",
    damageSplit: { ad: 85, ap: 0, trueDmg: 15 },
    engage: 5,
    disengage: 1,
    waveclear: 2,
    frontline: 3,
    cc: 4,
    earlyPower: 4,
    midPower: 4,
    latePower: 3,
    winCondition: "Pick",
    counters: ["zeri", "jinx", "aphelios"],
    counteredBy: ["jax", "morgana", "poppy"],
  },
  jarvaniv: {
    damageType: "AD",
    damageSplit: { ad: 85, ap: 10, trueDmg: 5 },
    engage: 5,
    disengage: 2,
    waveclear: 2,
    frontline: 4,
    cc: 4,
    earlyPower: 5,
    midPower: 4,
    latePower: 3,
    winCondition: "Teamfight",
    counters: ["jhin", "ashe", "aphelios"],
    counteredBy: ["poppy", "gragas", "vayne"],
  },
  viego: {
    damageType: "AD",
    damageSplit: { ad: 80, ap: 10, trueDmg: 10 },
    engage: 3,
    disengage: 1,
    waveclear: 3,
    frontline: 2,
    cc: 2,
    earlyPower: 3,
    midPower: 4,
    latePower: 5,
    winCondition: "Teamfight",
    counters: ["sejuani", "maokai"],
    counteredBy: ["rammus", "renekton", "poppy"],
  },
  lillia: {
    damageType: "AP",
    damageSplit: { ad: 5, ap: 80, trueDmg: 15 },
    engage: 4,
    disengage: 3,
    waveclear: 4,
    frontline: 2,
    cc: 4,
    earlyPower: 3,
    midPower: 5,
    latePower: 5,
    winCondition: "Teamfight",
    counters: ["sejuani", "sion", "ornn"],
    counteredBy: ["rengar", "khazix", "jarvaniv"],
  },
  poppy: {
    damageType: "AD",
    damageSplit: { ad: 75, ap: 20, trueDmg: 5 },
    engage: 3,
    disengage: 5,
    waveclear: 2,
    frontline: 5,
    cc: 5,
    earlyPower: 4,
    midPower: 4,
    latePower: 3,
    winCondition: "Teamfight",
    counters: ["jarvaniv", "vi", "lee sin", "diana"],
    counteredBy: ["olaf", "trundle", "lillia"],
  },
  leesin: {
    damageType: "AD",
    damageSplit: { ad: 90, ap: 5, trueDmg: 5 },
    engage: 4,
    disengage: 3,
    waveclear: 2,
    frontline: 3,
    cc: 3,
    earlyPower: 5,
    midPower: 4,
    latePower: 2,
    winCondition: "Pick",
    counters: ["nidalee", "kartus"],
    counteredBy: ["poppy", "renekton", "udyr"],
  },

  // === MID ===
  ahri: {
    damageType: "AP",
    damageSplit: { ad: 5, ap: 80, trueDmg: 15 },
    engage: 4,
    disengage: 3,
    waveclear: 4,
    frontline: 1,
    cc: 3,
    earlyPower: 3,
    midPower: 5,
    latePower: 3,
    winCondition: "Pick",
    counters: ["orianna", "viktor"],
    counteredBy: ["yasuo", "sylas", "tristana"],
  },
  orianna: {
    damageType: "AP",
    damageSplit: { ad: 10, ap: 90, trueDmg: 0 },
    engage: 4,
    disengage: 3,
    waveclear: 5,
    frontline: 1,
    cc: 4,
    earlyPower: 3,
    midPower: 4,
    latePower: 5,
    winCondition: "Teamfight",
    counters: ["azir", "syndra"],
    counteredBy: ["ahri", "lucian", "tristana"],
  },
  azir: {
    damageType: "AP",
    damageSplit: { ad: 5, ap: 95, trueDmg: 0 },
    engage: 4,
    disengage: 4,
    waveclear: 5,
    frontline: 1,
    cc: 4,
    earlyPower: 2,
    midPower: 4,
    latePower: 5,
    winCondition: "Teamfight",
    counters: ["galio", "ryze"],
    counteredBy: ["orianna", "syndra", "xerath"],
  },
  sylas: {
    damageType: "AP",
    damageSplit: { ad: 10, ap: 90, trueDmg: 0 },
    engage: 4,
    disengage: 2,
    waveclear: 3,
    frontline: 3,
    cc: 3,
    earlyPower: 3,
    midPower: 5,
    latePower: 4,
    winCondition: "Teamfight",
    counters: ["malphite", "alistar", "ashe"],
    counteredBy: ["cassiopeia", "galio", "renekton"],
  },
  taliyah: {
    damageType: "AP",
    damageSplit: { ad: 5, ap: 95, trueDmg: 0 },
    engage: 3,
    disengage: 4,
    waveclear: 5,
    frontline: 1,
    cc: 4,
    earlyPower: 4,
    midPower: 5,
    latePower: 4,
    winCondition: "Pick",
    counters: ["ahri", "leblanc", "zeri"],
    counteredBy: ["zed", "kassadin", "fizz"],
  },
  tristana: {
    damageType: "AD",
    damageSplit: { ad: 90, ap: 10, trueDmg: 0 },
    engage: 3,
    disengage: 3,
    waveclear: 4,
    frontline: 1,
    cc: 1,
    earlyPower: 5,
    midPower: 4,
    latePower: 5,
    winCondition: "Teamfight",
    counters: ["kassadin", "kayle", "veigar"],
    counteredBy: ["yasuo", "diana"],
  },
  corki: {
    damageType: "AD",
    damageSplit: { ad: 70, ap: 25, trueDmg: 5 },
    engage: 2,
    disengage: 2,
    waveclear: 5,
    frontline: 1,
    cc: 1,
    earlyPower: 3,
    midPower: 4,
    latePower: 5,
    winCondition: "Poke",
    counters: ["azir", "orianna"],
    counteredBy: ["lucian", "tristana"],
  },
  yone: {
    damageType: "Mixed",
    damageSplit: { ad: 60, ap: 25, trueDmg: 15 },
    engage: 4,
    disengage: 3,
    waveclear: 4,
    frontline: 2,
    cc: 4,
    earlyPower: 3,
    midPower: 4,
    latePower: 5,
    winCondition: "Teamfight",
    counters: ["aurelionsol", "veigar"],
    counteredBy: ["renekton", "pantheon", "sett"],
  },

  // === ADC ===
  varus: {
    damageType: "Mixed",
    damageSplit: { ad: 50, ap: 45, trueDmg: 5 },
    engage: 4,
    disengage: 2,
    waveclear: 4,
    frontline: 1,
    cc: 4,
    earlyPower: 5,
    midPower: 4,
    latePower: 3,
    winCondition: "Poke",
    counters: ["aphelios", "jinx", "zeri"],
    counteredBy: ["samira", "yasuo", "nautilus"],
  },
  jinx: {
    damageType: "AD",
    damageSplit: { ad: 95, ap: 5, trueDmg: 0 },
    engage: 1,
    disengage: 2,
    waveclear: 5,
    frontline: 1,
    cc: 2,
    earlyPower: 2,
    midPower: 4,
    latePower: 5,
    winCondition: "ProtectCarry",
    counters: ["aphelios", "sivir"],
    counteredBy: ["draven", "lucian", "blitzcrank"],
  },
  kaisa: {
    damageType: "Mixed",
    damageSplit: { ad: 45, ap: 45, trueDmg: 10 },
    engage: 3,
    disengage: 2,
    waveclear: 4,
    frontline: 1,
    cc: 0,
    earlyPower: 3,
    midPower: 5,
    latePower: 5,
    winCondition: "Teamfight",
    counters: ["ezreal", "jhin"],
    counteredBy: ["caitlyn", "draven", "ashe"],
  },
  ashe: {
    damageType: "AD",
    damageSplit: { ad: 90, ap: 10, trueDmg: 0 },
    engage: 5,
    disengage: 3,
    waveclear: 3,
    frontline: 1,
    cc: 5,
    earlyPower: 4,
    midPower: 4,
    latePower: 3,
    winCondition: "Pick",
    counters: ["kaisa", "zeri", "vayne"],
    counteredBy: ["braum", "samira", "sivir"],
  },
  kalista: {
    damageType: "AD",
    damageSplit: { ad: 95, ap: 0, trueDmg: 5 },
    engage: 4,
    disengage: 3,
    waveclear: 3,
    frontline: 1,
    cc: 3,
    earlyPower: 5,
    midPower: 4,
    latePower: 2,
    winCondition: "Teamfight",
    counters: ["ezreal", "jhin"],
    counteredBy: ["ashe", "nasus", "draven"],
  },
  aphelios: {
    damageType: "AD",
    damageSplit: { ad: 90, ap: 10, trueDmg: 0 },
    engage: 3,
    disengage: 2,
    waveclear: 4,
    frontline: 1,
    cc: 3,
    earlyPower: 2,
    midPower: 4,
    latePower: 5,
    winCondition: "ProtectCarry",
    counters: ["jinx", "zeri"],
    counteredBy: ["lucian", "draven", "nautilus"],
  },
  ezreal: {
    damageType: "Mixed",
    damageSplit: { ad: 65, ap: 30, trueDmg: 5 },
    engage: 1,
    disengage: 4,
    waveclear: 3,
    frontline: 1,
    cc: 0,
    earlyPower: 3,
    midPower: 5,
    latePower: 3,
    winCondition: "Poke",
    counters: ["blitzcrank", "nautilus"],
    counteredBy: ["sivir", "draven"],
  },
  lucian: {
    damageType: "AD",
    damageSplit: { ad: 85, ap: 15, trueDmg: 0 },
    engage: 2,
    disengage: 2,
    waveclear: 3,
    frontline: 1,
    cc: 0,
    earlyPower: 5,
    midPower: 4,
    latePower: 3,
    winCondition: "Teamfight",
    counters: ["ezreal", "jinx"],
    counteredBy: ["draven", "caitlyn"],
  },
  caitlyn: {
    damageType: "AD",
    damageSplit: { ad: 90, ap: 10, trueDmg: 0 },
    engage: 2,
    disengage: 3,
    waveclear: 4,
    frontline: 1,
    cc: 2,
    earlyPower: 5,
    midPower: 3,
    latePower: 4,
    winCondition: "Poke",
    counters: ["vayne", "kaisa", "short range"],
    counteredBy: ["sivir", "jhin"],
  },

  // === SUPPORT ===
  nautilus: {
    damageType: "AP",
    damageSplit: { ad: 10, ap: 85, trueDmg: 5 },
    engage: 5,
    disengage: 2,
    waveclear: 1,
    frontline: 5,
    cc: 5,
    earlyPower: 4,
    midPower: 4,
    latePower: 3,
    winCondition: "Pick",
    counters: ["yuumi", "sona", "soraka"],
    counteredBy: ["braum", "morgana", "alistar"],
  },
  rell: {
    damageType: "AP",
    damageSplit: { ad: 10, ap: 85, trueDmg: 5 },
    engage: 5,
    disengage: 2,
    waveclear: 1,
    frontline: 5,
    cc: 5,
    earlyPower: 4,
    midPower: 5,
    latePower: 4,
    winCondition: "Teamfight",
    counters: ["enchanters", "aphelios"],
    counteredBy: ["janna", "poppy", "thresh"],
  },
  leona: {
    damageType: "AP",
    damageSplit: { ad: 10, ap: 85, trueDmg: 5 },
    engage: 5,
    disengage: 2,
    waveclear: 1,
    frontline: 5,
    cc: 5,
    earlyPower: 5,
    midPower: 4,
    latePower: 3,
    winCondition: "Teamfight",
    counters: ["lulu", "yuumi"],
    counteredBy: ["braum", "alistar", "morgana"],
  },
  alistar: {
    damageType: "AP",
    damageSplit: { ad: 15, ap: 80, trueDmg: 5 },
    engage: 5,
    disengage: 4,
    waveclear: 1,
    frontline: 5,
    cc: 5,
    earlyPower: 3,
    midPower: 4,
    latePower: 4,
    winCondition: "Teamfight",
    counters: ["leona", "nautilus", "blitzcrank"],
    counteredBy: ["janna", "milio", "lulu"],
  },
  braum: {
    damageType: "AP",
    damageSplit: { ad: 20, ap: 75, trueDmg: 5 },
    engage: 3,
    disengage: 5,
    waveclear: 1,
    frontline: 5,
    cc: 4,
    earlyPower: 3,
    midPower: 4,
    latePower: 4,
    winCondition: "Teamfight",
    counters: ["nautilus", "ornn", "missfortune", "ezreal"],
    counteredBy: ["enchanters", "poke"],
  },
  rakan: {
    damageType: "AP",
    damageSplit: { ad: 10, ap: 85, trueDmg: 5 },
    engage: 5,
    disengage: 4,
    waveclear: 1,
    frontline: 2,
    cc: 5,
    earlyPower: 3,
    midPower: 5,
    latePower: 4,
    winCondition: "Teamfight",
    counters: ["ashe", "varus"],
    counteredBy: ["poppy", "thresh", "janna"],
  },
  lulu: {
    damageType: "AP",
    damageSplit: { ad: 10, ap: 90, trueDmg: 0 },
    engage: 1,
    disengage: 5,
    waveclear: 2,
    frontline: 1,
    cc: 3,
    earlyPower: 3,
    midPower: 5,
    latePower: 5,
    winCondition: "ProtectCarry",
    counters: ["assassins", "dive comps", "zed"],
    counteredBy: ["blitzcrank", "nautilus", "soraka"],
  },
  milio: {
    damageType: "AP",
    damageSplit: { ad: 5, ap: 95, trueDmg: 0 },
    engage: 1,
    disengage: 5,
    waveclear: 1,
    frontline: 1,
    cc: 3,
    earlyPower: 3,
    midPower: 4,
    latePower: 5,
    winCondition: "ProtectCarry",
    counters: ["amumu", "sejuani", "varus", "ashe"],
    counteredBy: ["blitzcrank", "pyke", "nautilus"],
  },
  janna: {
    damageType: "AP",
    damageSplit: { ad: 5, ap: 95, trueDmg: 0 },
    engage: 1,
    disengage: 5,
    waveclear: 2,
    frontline: 1,
    cc: 4,
    earlyPower: 3,
    midPower: 4,
    latePower: 4,
    winCondition: "ProtectCarry",
    counters: ["rell", "leona", "alistar", "kennen"],
    counteredBy: ["sona", "nami", "poke"],
  },
  renata: {
    damageType: "AP",
    damageSplit: { ad: 5, ap: 95, trueDmg: 0 },
    engage: 2,
    disengage: 5,
    waveclear: 1,
    frontline: 1,
    cc: 4,
    earlyPower: 3,
    midPower: 5,
    latePower: 4,
    winCondition: "Teamfight",
    counters: ["kalista", "hypercarries", "dive"],
    counteredBy: ["poke", "long range", "xerath"],
  },
};

/**
 * Obtiene el perfil táctico de un campeón
 */
export function getChampionProfile(champNameOrId: string): ChampionTacticalProfile {
  if (!champNameOrId) return DEFAULT_PROFILE;
  const key = champNameOrId.toLowerCase().replace(/[^a-z0-9]/g, "");
  const custom = TACTICAL_CHAMPION_PROFILES[key];
  if (custom) {
    return {
      ...DEFAULT_PROFILE,
      ...custom,
      damageSplit: custom.damageSplit || DEFAULT_PROFILE.damageSplit,
      counters: custom.counters || [],
      counteredBy: custom.counteredBy || [],
    };
  }

  // Si no está registrado en el detalle, inferir de la categoría
  const found = findChampion(champNameOrId);
  if (!found) return DEFAULT_PROFILE;

  if (found.category === "Tank") {
    return {
      ...DEFAULT_PROFILE,
      damageType: "Mixed",
      damageSplit: { ad: 30, ap: 65, trueDmg: 5 },
      frontline: 5,
      engage: 4,
      disengage: 3,
      cc: 4,
    };
  }

  if (found.roles.includes("ADC")) {
    return {
      ...DEFAULT_PROFILE,
      damageType: "AD",
      damageSplit: { ad: 90, ap: 5, trueDmg: 5 },
      frontline: 1,
      engage: 1,
      waveclear: 4,
      latePower: 5,
      winCondition: "ProtectCarry",
    };
  }

  if (found.roles.includes("SUPP") && (found.category === "Utility" || found.category === "Enabler")) {
    return {
      ...DEFAULT_PROFILE,
      damageType: "AP",
      damageSplit: { ad: 5, ap: 90, trueDmg: 5 },
      frontline: found.category === "Enabler" ? 4 : 1,
      engage: found.category === "Enabler" ? 5 : 1,
      disengage: found.category === "Utility" ? 5 : 2,
      cc: 4,
    };
  }

  return DEFAULT_PROFILE;
}

export interface CompositionMetrics {
  adPercent: number;
  apPercent: number;
  truePercent: number;
  damageWarning: { text: string; severity: "ok" | "warning" | "danger" };
  engageScore: number; // 0 - 100
  disengageScore: number; // 0 - 100
  waveclearScore: number; // 0 - 100
  frontlineScore: number; // 0 - 100
  ccScore: number; // 0 - 100
  earlyScore: number; // 0 - 100
  midScore: number; // 0 - 100
  lateScore: number; // 0 - 100
  tempoLabel: string;
  winCondition: string;
  warnings: string[];
  strengths: string[];
}

/**
 * Calcula las métricas avanzadas de una composición de 1 a 5 campeones
 */
export function calculateCompMetrics(picks: string[]): CompositionMetrics {
  const validPicks = picks.filter((p) => Boolean(p && p.trim()));
  if (validPicks.length === 0) {
    return {
      adPercent: 0,
      apPercent: 0,
      truePercent: 0,
      damageWarning: { text: "Sin campeones bloqueados", severity: "ok" },
      engageScore: 0,
      disengageScore: 0,
      waveclearScore: 0,
      frontlineScore: 0,
      ccScore: 0,
      earlyScore: 50,
      midScore: 50,
      lateScore: 50,
      tempoLabel: "Neutral",
      winCondition: "Por definir",
      warnings: [],
      strengths: [],
    };
  }

  let totalAd = 0;
  let totalAp = 0;
  let totalTrue = 0;
  let sumEngage = 0;
  let sumDisengage = 0;
  let sumWaveclear = 0;
  let sumFrontline = 0;
  let sumCc = 0;
  let sumEarly = 0;
  let sumMid = 0;
  let sumLate = 0;

  const winCondCounts: Record<string, number> = {};

  validPicks.forEach((champ) => {
    const prof = getChampionProfile(champ);
    totalAd += prof.damageSplit.ad;
    totalAp += prof.damageSplit.ap;
    totalTrue += prof.damageSplit.trueDmg;

    sumEngage += prof.engage;
    sumDisengage += prof.disengage;
    sumWaveclear += prof.waveclear;
    sumFrontline += prof.frontline;
    sumCc += prof.cc;

    sumEarly += prof.earlyPower;
    sumMid += prof.midPower;
    sumLate += prof.latePower;

    winCondCounts[prof.winCondition] = (winCondCounts[prof.winCondition] || 0) + 1;
  });

  const count = validPicks.length;
  const dmgTotal = totalAd + totalAp + totalTrue || 1;
  const adPercent = Math.round((totalAd / dmgTotal) * 100);
  const apPercent = Math.round((totalAp / dmgTotal) * 100);
  const truePercent = Math.max(0, 100 - adPercent - apPercent);

  // Escalas de 0 a 100
  const engageScore = Math.min(100, Math.round((sumEngage / (count * 5)) * 100));
  const disengageScore = Math.min(100, Math.round((sumDisengage / (count * 5)) * 100));
  const waveclearScore = Math.min(100, Math.round((sumWaveclear / (count * 5)) * 100));
  const frontlineScore = Math.min(100, Math.round((sumFrontline / (count * 5)) * 100));
  const ccScore = Math.min(100, Math.round((sumCc / (count * 5)) * 100));

  const earlyScore = Math.min(100, Math.round((sumEarly / (count * 5)) * 100));
  const midScore = Math.min(100, Math.round((sumMid / (count * 5)) * 100));
  const lateScore = Math.min(100, Math.round((sumLate / (count * 5)) * 100));

  // Advertencias de daño
  let damageWarning: { text: string; severity: "ok" | "warning" | "danger" } = {
    text: "Perfil de daño híbrido equilibrado",
    severity: "ok",
  };
  if (count >= 3) {
    if (adPercent >= 80) {
      damageWarning = {
        text: "¡PELIGRO FULL AD! El rival puede comprar Armadura pesada (Tabis/Thornmail/Frozen Heart)",
        severity: "danger",
      };
    } else if (apPercent >= 80) {
      damageWarning = {
        text: "¡PELIGRO FULL AP! El rival puede comprar Kaenic Rookern / Botas Mercurio",
        severity: "danger",
      };
    } else if (adPercent >= 70) {
      damageWarning = {
        text: "Sesgo AD elevado: Asegura al menos una fuente consistente de daño mágico",
        severity: "warning",
      };
    } else if (apPercent >= 70) {
      damageWarning = {
        text: "Sesgo AP elevado: Asegura daño de DPS físico para asedio de torres y dragones",
        severity: "warning",
      };
    }
  }

  // Advertencias tácticas
  const warnings: string[] = [];
  const strengths: string[] = [];

  if (count >= 3) {
    if (frontlineScore < 35) warnings.push("Falta Frontline: Equipo frágil que sufrirá contra iniciación masiva");
    if (engageScore < 35 && disengageScore < 35) warnings.push("Sin control de ritmo: Falta iniciación y falta disengage");
    if (waveclearScore < 40) warnings.push("Bajo Waveclear: Dificultad para defender torres y frenar Barón");
    if (ccScore < 40) warnings.push("Bajo CC: Dificultad para bloquear carries rivales de alta movilidad");

    if (engageScore >= 70) strengths.push("Iniciación devastadora: Alta capacidad de forzar teamfights");
    if (disengageScore >= 70) strengths.push("Gran Disengage / Peel: Excelente protección frente a dive y asesinos");
    if (frontlineScore >= 70) strengths.push("Frontline muy sólida: Gran absorción de recursos enemigos");
    if (ccScore >= 70) strengths.push("Cadena de CC opresiva: Enlace continuo de control");
    if (waveclearScore >= 75) strengths.push("Excelente Waveclear: Control total de la presión de líneas");
  }

  // Win condition dominante
  let winCondition = "Teamfight Front-to-Back";
  let maxCount = 0;
  Object.entries(winCondCounts).forEach(([wc, c]) => {
    if (c > maxCount) {
      maxCount = c;
      winCondition = wc;
    }
  });

  // Tempo de la composición
  let tempoLabel = "Mid Game Spikes";
  if (earlyScore >= 70 && earlyScore > lateScore) {
    tempoLabel = "Early Game Snowball (Urgente cerrar antes del min 28)";
  } else if (lateScore >= 70 && lateScore > earlyScore) {
    tempoLabel = "Late Game Hypercarry (Escalado favorable a partir del min 30)";
  } else if (midScore >= 65) {
    tempoLabel = "Mid Game Dragon/Baron Fights (Picos en 2-3 objetos)";
  }

  return {
    adPercent,
    apPercent,
    truePercent,
    damageWarning,
    engageScore,
    disengageScore,
    waveclearScore,
    frontlineScore,
    ccScore,
    earlyScore,
    midScore,
    lateScore,
    tempoLabel,
    winCondition,
    warnings,
    strengths,
  };
}

/**
 * Detecta qué líneas rivales faltan por elegir y devuelve recomendaciones de ban quirúrgico
 */
export function getSmartBans(
  enemyPicks: string[],
  ourPicks: string[],
  stepIndex: number
): {
  recommendedBans: { champion: string; role: string; reason: string }[];
  missingEnemyRoles: string[];
} {
  const ALL_ROLES: ("TOP" | "JGL" | "MID" | "ADC" | "SUPP")[] = ["TOP", "JGL", "MID", "ADC", "SUPP"];
  const coveredRoles = new Set<string>();

  enemyPicks.forEach((champ) => {
    if (!champ) return;
    const found = findChampion(champ);
    if (found && found.roles.length > 0) {
      // Tomamos el rol principal
      coveredRoles.add(found.roles[0] || "");
    }
  });

  const missingEnemyRoles = ALL_ROLES.filter((r) => !coveredRoles.has(r));

  // Bans recomendados
  const recommendedBans: { champion: string; role: string; reason: string }[] = [];

  // Fase 2 de bans (después de 3 picks por bando)
  const isPhase2 = stepIndex >= 12;

  if (isPhase2) {
    missingEnemyRoles.forEach((missingRole) => {
      if (missingRole === "JGL") {
        recommendedBans.push({
          champion: "Sejuani",
          role: "JGL",
          reason: "Bloquear iniciador tank y synergy para el rival",
        });
        recommendedBans.push({
          champion: "Vi",
          role: "JGL",
          reason: "Prevenir punto y click contra nuestros carries",
        });
      } else if (missingRole === "SUPP") {
        recommendedBans.push({
          champion: "Rell",
          role: "SUPP",
          reason: "Prevenir combo masivo de iniciación",
        });
        recommendedBans.push({
          champion: "Nautilus",
          role: "SUPP",
          reason: "Prevenir engage directo en línea",
        });
      } else if (missingRole === "TOP") {
        recommendedBans.push({
          champion: "Aatrox",
          role: "TOP",
          reason: "Evitar blind pick sólido con impacto en teamfight",
        });
        recommendedBans.push({
          champion: "K'Sante",
          role: "TOP",
          reason: "Prevenir flex pick tanque de alto rendimiento",
        });
      } else if (missingRole === "MID") {
        recommendedBans.push({
          champion: "Orianna",
          role: "MID",
          reason: "Eliminar control de zona y daño constante",
        });
        recommendedBans.push({
          champion: "Ahri",
          role: "MID",
          reason: "Evitar presión de mapa y cazadas con Charm",
        });
      } else if (missingRole === "ADC") {
        recommendedBans.push({
          champion: "Varus",
          role: "ADC",
          reason: "Denegar poder de línea y flecha de iniciación",
        });
        recommendedBans.push({
          champion: "Kalista",
          role: "ADC",
          reason: "Evitar opresión de early game y control de objetivos",
        });
      }
    });
  } else {
    // Fase 1: Power bans
    recommendedBans.push(
      { champion: "Rell", role: "SUPP", reason: "Power-pick prioritario de iniciación" },
      { champion: "Varus", role: "ADC", reason: "Flexibilidad y opresión de línea" },
      { champion: "Sejuani", role: "JGL", reason: "Garante de frontline y CC" }
    );
  }

  // Filtrar los que ya estén seleccionados
  const used = new Set([...enemyPicks, ...ourPicks].map((c) => c?.toLowerCase()));
  const filtered = recommendedBans.filter((b) => !used.has(b.champion.toLowerCase()));

  return {
    recommendedBans: filtered.slice(0, 4),
    missingEnemyRoles,
  };
}

/**
 * Encuentra counters dentro del roster de Void Lynx para los picks que el enemigo ya bloqueó
 */
export function getRosterCountersForEnemy(
  enemyPicks: string[],
  playerChampions: PlayerChampionEntry[]
): {
  enemyChamp: string;
  ourCounters: { playerChamp: PlayerChampionEntry; reason: string }[];
}[] {
  const results: {
    enemyChamp: string;
    ourCounters: { playerChamp: PlayerChampionEntry; reason: string }[];
  }[] = [];

  const validEnemyPicks = enemyPicks.filter(Boolean);

  validEnemyPicks.forEach((enemy) => {
    const enemyKey = enemy.toLowerCase().replace(/[^a-z0-9]/g, "");
    const enemyProf = TACTICAL_CHAMPION_PROFILES[enemyKey];
    const countersList = enemyProf?.counteredBy || [];

    const ourCounters: { playerChamp: PlayerChampionEntry; reason: string }[] = [];

    playerChampions.forEach((pc) => {
      const pcKey = pc.campeon_id.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (countersList.includes(pcKey) || countersList.some((c) => c.toLowerCase() === pc.campeon_id.toLowerCase())) {
        ourCounters.push({
          playerChamp: pc,
          reason: `${pc.campeon_id} castiga severamente el kit de ${enemy}`,
        });
      }
    });

    if (ourCounters.length > 0) {
      results.push({
        enemyChamp: enemy,
        ourCounters,
      });
    }
  });

  return results;
}
