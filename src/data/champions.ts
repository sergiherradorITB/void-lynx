// Catálogo estático de campeones de League of Legends con IDs de Riot Data Dragon
// Permite carga ultrarrápida sin depender de peticiones externas para la lista base.

export interface Champion {
  id: string; // ID oficial Data Dragon (ej: KSante, AurelionSol, ChoGath)
  name: string; // Nombre legible (ej: K'Sante, Aurelion Sol, Cho'Gath)
  roles: Array<"TOP" | "JGL" | "MID" | "ADC" | "SUPP">;
  category: "Primary Carry" | "Secondary Carry" | "Enabler" | "Utility" | "Tank" | "Assassin";
}

export const DDRAGON_VERSION = "15.1.1";

export function getChampionAvatar(id: string): string {
  if (!id) return "";
  const cleanId = id.trim();
  const idMap: Record<string, string> = {
    Chogath: "ChoGath",
    Kaisa: "KaiSa",
    Khazix: "KhaZix",
    Leblanc: "LeBlanc",
    Nunu: "Nunu",
    Velkoz: "Velkoz",
    Wukong: "MonkeyKing",
    Renata: "Renata",
    Belveth: "Belveth",
    KSante: "KSante",
  };
  const finalId = idMap[cleanId] || cleanId;
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${finalId}.png`;
}

export function getChampionSplash(id: string): string {
  if (!id) return "";
  const cleanId = id.trim();
  const idMap: Record<string, string> = {
    Chogath: "ChoGath",
    Kaisa: "KaiSa",
    Khazix: "KhaZix",
    Leblanc: "LeBlanc",
    Nunu: "Nunu",
    Wukong: "MonkeyKing",
  };
  const finalId = idMap[cleanId] || cleanId;
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${finalId}_0.jpg`;
}

export const CHAMPIONS_CATALOG: Champion[] = [
  { id: "Aatrox", name: "Aatrox", roles: ["TOP"], category: "Primary Carry" },
  { id: "Ahri", name: "Ahri", roles: ["MID"], category: "Enabler" },
  { id: "Akali", name: "Akali", roles: ["MID", "TOP"], category: "Primary Carry" },
  { id: "Akshan", name: "Akshan", roles: ["MID", "TOP"], category: "Primary Carry" },
  { id: "Alistar", name: "Alistar", roles: ["SUPP"], category: "Enabler" },
  { id: "Ambessa", name: "Ambessa", roles: ["TOP", "JGL"], category: "Primary Carry" },
  { id: "Amumu", name: "Amumu", roles: ["JGL", "SUPP"], category: "Enabler" },
  { id: "Anivia", name: "Anivia", roles: ["MID"], category: "Utility" },
  { id: "Annie", name: "Annie", roles: ["MID", "SUPP"], category: "Enabler" },
  { id: "Aphelios", name: "Aphelios", roles: ["ADC"], category: "Primary Carry" },
  { id: "Ashe", name: "Ashe", roles: ["ADC", "SUPP"], category: "Utility" },
  { id: "AurelionSol", name: "Aurelion Sol", roles: ["MID"], category: "Primary Carry" },
  { id: "Aurora", name: "Aurora", roles: ["MID", "TOP"], category: "Secondary Carry" },
  { id: "Azir", name: "Azir", roles: ["MID"], category: "Primary Carry" },
  { id: "Bard", name: "Bard", roles: ["SUPP"], category: "Utility" },
  { id: "Belveth", name: "Bel'Veth", roles: ["JGL"], category: "Primary Carry" },
  { id: "Blitzcrank", name: "Blitzcrank", roles: ["SUPP"], category: "Enabler" },
  { id: "Brand", name: "Brand", roles: ["SUPP", "MID", "JGL"], category: "Secondary Carry" },
  { id: "Braum", name: "Braum", roles: ["SUPP"], category: "Utility" },
  { id: "Briar", name: "Briar", roles: ["JGL"], category: "Primary Carry" },
  { id: "Caitlyn", name: "Caitlyn", roles: ["ADC"], category: "Primary Carry" },
  { id: "Camille", name: "Camille", roles: ["TOP", "SUPP"], category: "Primary Carry" },
  { id: "Cassiopeia", name: "Cassiopeia", roles: ["MID", "TOP"], category: "Primary Carry" },
  { id: "ChoGath", name: "Cho'Gath", roles: ["TOP", "MID"], category: "Tank" },
  { id: "Corki", name: "Corki", roles: ["MID", "ADC"], category: "Primary Carry" },
  { id: "Darius", name: "Darius", roles: ["TOP"], category: "Primary Carry" },
  { id: "Diana", name: "Diana", roles: ["JGL", "MID"], category: "Secondary Carry" },
  { id: "DrMundo", name: "Dr. Mundo", roles: ["TOP", "JGL"], category: "Tank" },
  { id: "Draven", name: "Draven", roles: ["ADC"], category: "Primary Carry" },
  { id: "Ekko", name: "Ekko", roles: ["JGL", "MID"], category: "Secondary Carry" },
  { id: "Elise", name: "Elise", roles: ["JGL"], category: "Enabler" },
  { id: "Evelynn", name: "Evelynn", roles: ["JGL"], category: "Assassin" },
  { id: "Ezreal", name: "Ezreal", roles: ["ADC", "MID"], category: "Primary Carry" },
  { id: "Fiddlesticks", name: "Fiddlesticks", roles: ["JGL"], category: "Enabler" },
  { id: "Fiora", name: "Fiora", roles: ["TOP"], category: "Primary Carry" },
  { id: "Fizz", name: "Fizz", roles: ["MID"], category: "Assassin" },
  { id: "Galio", name: "Galio", roles: ["MID", "SUPP"], category: "Enabler" },
  { id: "Gangplank", name: "Gangplank", roles: ["TOP", "MID"], category: "Primary Carry" },
  { id: "Garen", name: "Garen", roles: ["TOP"], category: "Primary Carry" },
  { id: "Gnar", name: "Gnar", roles: ["TOP"], category: "Secondary Carry" },
  { id: "Gragas", name: "Gragas", roles: ["TOP", "JGL", "MID"], category: "Enabler" },
  { id: "Graves", name: "Graves", roles: ["JGL"], category: "Primary Carry" },
  { id: "Gwen", name: "Gwen", roles: ["TOP", "JGL"], category: "Primary Carry" },
  { id: "Hecarim", name: "Hecarim", roles: ["JGL"], category: "Secondary Carry" },
  { id: "Heimerdinger", name: "Heimerdinger", roles: ["TOP", "MID", "SUPP"], category: "Utility" },
  { id: "Hwei", name: "Hwei", roles: ["MID", "SUPP"], category: "Utility" },
  { id: "Illaoi", name: "Illaoi", roles: ["TOP"], category: "Primary Carry" },
  { id: "Irelia", name: "Irelia", roles: ["TOP", "MID"], category: "Primary Carry" },
  { id: "Ivern", name: "Ivern", roles: ["JGL", "SUPP"], category: "Utility" },
  { id: "Janna", name: "Janna", roles: ["SUPP"], category: "Utility" },
  { id: "JarvanIV", name: "Jarvan IV", roles: ["JGL"], category: "Enabler" },
  { id: "Jax", name: "Jax", roles: ["TOP", "JGL"], category: "Primary Carry" },
  { id: "Jayce", name: "Jayce", roles: ["TOP", "MID"], category: "Primary Carry" },
  { id: "Jhin", name: "Jhin", roles: ["ADC"], category: "Secondary Carry" },
  { id: "Jinx", name: "Jinx", roles: ["ADC"], category: "Primary Carry" },
  { id: "KSante", name: "K'Sante", roles: ["TOP"], category: "Tank" },
  { id: "KaiSa", name: "Kai'Sa", roles: ["ADC"], category: "Primary Carry" },
  { id: "Kalista", name: "Kalista", roles: ["ADC"], category: "Primary Carry" },
  { id: "Karma", name: "Karma", roles: ["SUPP", "MID"], category: "Utility" },
  { id: "Karthus", name: "Karthus", roles: ["JGL", "ADC"], category: "Primary Carry" },
  { id: "Kassadin", name: "Kassadin", roles: ["MID"], category: "Primary Carry" },
  { id: "Katarina", name: "Katarina", roles: ["MID"], category: "Primary Carry" },
  { id: "Kayle", name: "Kayle", roles: ["TOP", "MID"], category: "Primary Carry" },
  { id: "Kayn", name: "Kayn", roles: ["JGL"], category: "Primary Carry" },
  { id: "Kennen", name: "Kennen", roles: ["TOP"], category: "Secondary Carry" },
  { id: "KhaZix", name: "Kha'Zix", roles: ["JGL"], category: "Assassin" },
  { id: "Kindred", name: "Kindred", roles: ["JGL"], category: "Primary Carry" },
  { id: "Kled", name: "Kled", roles: ["TOP", "MID"], category: "Primary Carry" },
  { id: "KogMaw", name: "Kog'Maw", roles: ["ADC"], category: "Primary Carry" },
  { id: "LeBlanc", name: "LeBlanc", roles: ["MID"], category: "Assassin" },
  { id: "LeeSin", name: "Lee Sin", roles: ["JGL"], category: "Enabler" },
  { id: "Leona", name: "Leona", roles: ["SUPP"], category: "Enabler" },
  { id: "Lillia", name: "Lillia", roles: ["JGL"], category: "Primary Carry" },
  { id: "Lissandra", name: "Lissandra", roles: ["MID"], category: "Enabler" },
  { id: "Lucian", name: "Lucian", roles: ["ADC", "MID"], category: "Primary Carry" },
  { id: "Lulu", name: "Lulu", roles: ["SUPP"], category: "Utility" },
  { id: "Lux", name: "Lux", roles: ["SUPP", "MID"], category: "Secondary Carry" },
  { id: "Malphite", name: "Malphite", roles: ["TOP", "MID"], category: "Tank" },
  { id: "Malzahar", name: "Malzahar", roles: ["MID"], category: "Enabler" },
  { id: "Maokai", name: "Maokai", roles: ["TOP", "JGL", "SUPP"], category: "Tank" },
  { id: "MasterYi", name: "Master Yi", roles: ["JGL"], category: "Primary Carry" },
  { id: "Mel", name: "Mel", roles: ["MID", "SUPP"], category: "Utility" },
  { id: "Milio", name: "Milio", roles: ["SUPP"], category: "Utility" },
  { id: "MissFortune", name: "Miss Fortune", roles: ["ADC"], category: "Primary Carry" },
  { id: "Mordekaiser", name: "Mordekaiser", roles: ["TOP"], category: "Primary Carry" },
  { id: "Morgana", name: "Morgana", roles: ["SUPP", "MID"], category: "Utility" },
  { id: "Naafiri", name: "Naafiri", roles: ["MID"], category: "Assassin" },
  { id: "Nami", name: "Nami", roles: ["SUPP"], category: "Utility" },
  { id: "Nasus", name: "Nasus", roles: ["TOP"], category: "Primary Carry" },
  { id: "Nautilus", name: "Nautilus", roles: ["SUPP"], category: "Enabler" },
  { id: "Neeko", name: "Neeko", roles: ["MID", "SUPP"], category: "Enabler" },
  { id: "Nidalee", name: "Nidalee", roles: ["JGL"], category: "Primary Carry" },
  { id: "Nilah", name: "Nilah", roles: ["ADC"], category: "Primary Carry" },
  { id: "Nocturne", name: "Nocturne", roles: ["JGL"], category: "Enabler" },
  { id: "Nunu", name: "Nunu & Willump", roles: ["JGL"], category: "Tank" },
  { id: "Olaf", name: "Olaf", roles: ["TOP", "JGL"], category: "Primary Carry" },
  { id: "Orianna", name: "Orianna", roles: ["MID"], category: "Utility" },
  { id: "Ornn", name: "Ornn", roles: ["TOP"], category: "Tank" },
  { id: "Pantheon", name: "Pantheon", roles: ["SUPP", "MID", "TOP", "JGL"], category: "Enabler" },
  { id: "Poppy", name: "Poppy", roles: ["JGL", "TOP", "SUPP"], category: "Tank" },
  { id: "Pyke", name: "Pyke", roles: ["SUPP"], category: "Assassin" },
  { id: "Qiyana", name: "Qiyana", roles: ["MID"], category: "Assassin" },
  { id: "Quinn", name: "Quinn", roles: ["TOP"], category: "Primary Carry" },
  { id: "Rakan", name: "Rakan", roles: ["SUPP"], category: "Enabler" },
  { id: "Rammus", name: "Rammus", roles: ["JGL"], category: "Tank" },
  { id: "RekSai", name: "Rek'Sai", roles: ["JGL", "TOP"], category: "Enabler" },
  { id: "Rell", name: "Rell", roles: ["SUPP", "JGL"], category: "Enabler" },
  { id: "Renata", name: "Renata Glasc", roles: ["SUPP"], category: "Utility" },
  { id: "Renekton", name: "Renekton", roles: ["TOP"], category: "Primary Carry" },
  { id: "Rengar", name: "Rengar", roles: ["JGL", "TOP"], category: "Assassin" },
  { id: "Riven", name: "Riven", roles: ["TOP"], category: "Primary Carry" },
  { id: "Rumble", name: "Rumble", roles: ["TOP", "MID"], category: "Secondary Carry" },
  { id: "Ryze", name: "Ryze", roles: ["MID", "TOP"], category: "Primary Carry" },
  { id: "Samira", name: "Samira", roles: ["ADC"], category: "Primary Carry" },
  { id: "Sejuani", name: "Sejuani", roles: ["JGL", "TOP"], category: "Tank" },
  { id: "Senna", name: "Senna", roles: ["SUPP", "ADC"], category: "Utility" },
  { id: "Seraphine", name: "Seraphine", roles: ["SUPP", "MID", "ADC"], category: "Utility" },
  { id: "Sett", name: "Sett", roles: ["TOP", "SUPP"], category: "Primary Carry" },
  { id: "Shaco", name: "Shaco", roles: ["JGL", "SUPP"], category: "Assassin" },
  { id: "Shen", name: "Shen", roles: ["TOP", "SUPP"], category: "Utility" },
  { id: "Shyvana", name: "Shyvana", roles: ["JGL", "TOP"], category: "Primary Carry" },
  { id: "Singed", name: "Singed", roles: ["TOP"], category: "Utility" },
  { id: "Sion", name: "Sion", roles: ["TOP"], category: "Tank" },
  { id: "Sivir", name: "Sivir", roles: ["ADC"], category: "Primary Carry" },
  { id: "Skarner", name: "Skarner", roles: ["TOP", "JGL"], category: "Tank" },
  { id: "Smolder", name: "Smolder", roles: ["ADC", "MID"], category: "Primary Carry" },
  { id: "Sona", name: "Sona", roles: ["SUPP"], category: "Utility" },
  { id: "Soraka", name: "Soraka", roles: ["SUPP"], category: "Utility" },
  { id: "Swain", name: "Swain", roles: ["MID", "SUPP", "ADC"], category: "Secondary Carry" },
  { id: "Sylas", name: "Sylas", roles: ["MID", "JGL"], category: "Primary Carry" },
  { id: "Syndra", name: "Syndra", roles: ["MID"], category: "Primary Carry" },
  { id: "TahmKench", name: "Tahm Kench", roles: ["SUPP", "TOP"], category: "Tank" },
  { id: "Taliyah", name: "Taliyah", roles: ["JGL", "MID"], category: "Secondary Carry" },
  { id: "Talon", name: "Talon", roles: ["MID", "JGL"], category: "Assassin" },
  { id: "Taric", name: "Taric", roles: ["SUPP"], category: "Utility" },
  { id: "Teemo", name: "Teemo", roles: ["TOP"], category: "Secondary Carry" },
  { id: "Thresh", name: "Thresh", roles: ["SUPP"], category: "Enabler" },
  { id: "Tristana", name: "Tristana", roles: ["ADC", "MID"], category: "Primary Carry" },
  { id: "Trundle", name: "Trundle", roles: ["TOP", "JGL"], category: "Primary Carry" },
  { id: "Tryndamere", name: "Tryndamere", roles: ["TOP", "MID"], category: "Primary Carry" },
  { id: "TwistedFate", name: "Twisted Fate", roles: ["MID", "ADC"], category: "Utility" },
  { id: "Twitch", name: "Twitch", roles: ["ADC"], category: "Primary Carry" },
  { id: "Udyr", name: "Udyr", roles: ["JGL", "TOP"], category: "Tank" },
  { id: "Urgot", name: "Urgot", roles: ["TOP"], category: "Primary Carry" },
  { id: "Varus", name: "Varus", roles: ["ADC", "MID"], category: "Primary Carry" },
  { id: "Vayne", name: "Vayne", roles: ["ADC", "TOP"], category: "Primary Carry" },
  { id: "Veigar", name: "Veigar", roles: ["MID", "ADC"], category: "Secondary Carry" },
  { id: "Velkoz", name: "Vel'Koz", roles: ["SUPP", "MID"], category: "Secondary Carry" },
  { id: "Vex", name: "Vex", roles: ["MID"], category: "Secondary Carry" },
  { id: "Vi", name: "Vi", roles: ["JGL"], category: "Enabler" },
  { id: "Viego", name: "Viego", roles: ["JGL"], category: "Primary Carry" },
  { id: "Viktor", name: "Viktor", roles: ["MID"], category: "Primary Carry" },
  { id: "Vladimir", name: "Vladimir", roles: ["MID", "TOP"], category: "Primary Carry" },
  { id: "Volibear", name: "Volibear", roles: ["TOP", "JGL"], category: "Tank" },
  { id: "Warwick", name: "Warwick", roles: ["JGL", "TOP"], category: "Tank" },
  { id: "MonkeyKing", name: "Wukong", roles: ["TOP", "JGL"], category: "Secondary Carry" },
  { id: "Xayah", name: "Xayah", roles: ["ADC"], category: "Primary Carry" },
  { id: "Xerath", name: "Xerath", roles: ["SUPP", "MID"], category: "Secondary Carry" },
  { id: "XinZhao", name: "Xin Zhao", roles: ["JGL"], category: "Enabler" },
  { id: "Yasuo", name: "Yasuo", roles: ["MID", "TOP", "ADC"], category: "Primary Carry" },
  { id: "Yone", name: "Yone", roles: ["MID", "TOP"], category: "Primary Carry" },
  { id: "Yorick", name: "Yorick", roles: ["TOP"], category: "Primary Carry" },
  { id: "Yuumi", name: "Yuumi", roles: ["SUPP"], category: "Utility" },
  { id: "Zac", name: "Zac", roles: ["JGL", "TOP"], category: "Tank" },
  { id: "Zed", name: "Zed", roles: ["MID"], category: "Assassin" },
  { id: "Zeri", name: "Zeri", roles: ["ADC"], category: "Primary Carry" },
  { id: "Ziggs", name: "Ziggs", roles: ["ADC", "MID"], category: "Secondary Carry" },
  { id: "Zilean", name: "Zilean", roles: ["SUPP", "MID"], category: "Utility" },
  { id: "Zoe", name: "Zoe", roles: ["MID"], category: "Secondary Carry" },
  { id: "Zyra", name: "Zyra", roles: ["SUPP"], category: "Secondary Carry" },
];

export const CHAMPION_MAP = new Map<string, Champion>(
  CHAMPIONS_CATALOG.map((c) => [c.id.toLowerCase(), c])
);

export function findChampion(query: string): Champion | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase().replace(/['\s]/g, "");
  for (const c of CHAMPIONS_CATALOG) {
    const cleanId = c.id.toLowerCase().replace(/['\s]/g, "");
    const cleanName = c.name.toLowerCase().replace(/['\s]/g, "");
    if (cleanId === q || cleanName === q) return c;
  }
  return undefined;
}
