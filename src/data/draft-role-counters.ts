import { RoleType } from "@/components/RoleBadge";

export interface CounterPickDetail {
  champion: string; // Canonical / Display name of champion
  role: RoleType; // Role of the counterpick
  category: "Hard Counter" | "Tactical Answer" | "Synergy Lockdown" | "Punish Pick";
  keyAbility?: string; // e.g. "R (Cataclismo)", "R (Fuerza Imparable)"
  reason: string; // Strategic explanation of why it shuts down the enemy
}

export interface EnemyRoleArchetype {
  id: string;
  role: RoleType;
  title: string;
  tagline: string;
  description: string;
  vulnerability: string;
  enemyChampions: string[]; // Key champions that fit this profile
  counterPicks: CounterPickDetail[];
  draftTip: string;
  banRecommendation?: string[];
}

export const ROLE_COUNTER_ARCHETYPES: EnemyRoleArchetype[] = [
  // =========================================================================
  // ADC (TIRADORES / BOT LANE)
  // =========================================================================
  {
    id: "adc-inmovil",
    role: "ADC",
    title: "Tirador Inmóvil / Sin Escape",
    tagline: "Vulnerables a iniciación de largo alcance y confinamiento en terreno",
    description:
      "Tiradores que carecen de dashes, saltos o herramientas de auto-peel fiables. Dependen 100% de la protección de su soporte y de un posicionamiento perfecto en la retaguardia.",
    vulnerability:
      "Cualquier habilidad de confinamiento de terreno (Cataclismo, Ultimátum), iniciación imparable o dive de largo alcance los aísla y borra antes de que puedan aplicar DPS.",
    enemyChampions: ["Jinx", "Aphelios", "Ashe", "Varus", "KogMaw", "MissFortune", "Jhin"],
    counterPicks: [
      {
        champion: "JarvanIV",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "R (Cataclismo) + E-Q",
        reason:
          "Crea una arena de terreno infranqueable. Sin destello, el tirador inmóvil no puede salir de la R de Jarvan IV y muere sin opción a golpear. El combo E-Q salta sobre cualquier tanque intermedio.",
      },
      {
        champion: "Malphite",
        role: "TOP",
        category: "Hard Counter",
        keyAbility: "R (Fuerza Imparable) + E",
        reason:
          "Iniciación instantánea imparable a gran velocidad. Su E reduce un 50% la velocidad de ataque del tirador, neutralizando su DPS aunque sobreviva al impacto inicial.",
      },
      {
        champion: "Nocturne",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "R (Paranoia)",
        reason:
          "Apaga toda la visión del equipo rival, impidiendo que los soportes protectores puedan tirarle escudos o curaciones mientras Nocturne lo embiste y destruye en 1v1.",
      },
      {
        champion: "Vi",
        role: "JGL",
        category: "Synergy Lockdown",
        keyAbility: "R (Cease and Desist)",
        reason:
          "Supresión point-and-click imparable. Aunque el ADC tire Destello o intente retroceder, la R de Vi lo sigue hasta levantarlo por los aires sin margen de error.",
      },
      {
        champion: "Nautilus",
        role: "SUPP",
        category: "Tactical Answer",
        keyAbility: "R (Carga de Profundidad) + Q",
        reason:
          "Definitiva teledirigida que no se puede esquivar sin habilidades elusivas. Garantiza una cadena de CC prolongada que abre la ventana de asesinato para nuestro equipo.",
      },
      {
        champion: "Leona",
        role: "SUPP",
        category: "Tactical Answer",
        keyAbility: "R (Llamarada Solar) + E-Q",
        reason:
          "Castiga brutalmente la falta de movilidad con aturdimiento masivo a distancia y all-in implacable en fase de líneas.",
      },
      {
        champion: "Camille",
        role: "TOP",
        category: "Hard Counter",
        keyAbility: "R (Ultimátum Hextech)",
        reason:
          "Encierra al tirador dentro de un área hexagonal de la que es matemáticamente imposible escapar, apartando al resto de su equipo.",
      },
    ],
    draftTip:
      "Si el rival comete el error de draftear un tirador inmóvil en Fase 1 (B1 o R1-R2), asegura inmediatamente Jarvan IV o Vi para desarmar su composición desde el minuto cero.",
    banRecommendation: ["Braum", "Milio", "TahmKench"],
  },
  {
    id: "adc-hypercarry",
    role: "ADC",
    title: "Hypercarries de Escalado Tardío",
    tagline: "Débiles en fase temprana; requieren 3 objetos para tener impacto",
    description:
      "Tiradores que sacrifican la fase de líneas para convertirse en monstruos de daño incontrolable a partir del minuto 25-30.",
    vulnerability:
      "Fase de líneas pasiva, poca capacidad de tradear golpes en niveles 1-3 y nula prioridad para ayudar a su jungla en los primeros dragones.",
    enemyChampions: ["Smolder", "Zeri", "Vayne", "KaiSa", "Tristana"],
    counterPicks: [
      {
        champion: "Kalista",
        role: "ADC",
        category: "Punish Pick",
        keyAbility: "E (Desgarrar) + R",
        reason:
          "Asfixia total en fase de líneas. Oprime cada súbdito que intenten farmear y asegura un control total de dragones y torres tempranas.",
      },
      {
        champion: "Draven",
        role: "ADC",
        category: "Hard Counter",
        keyAbility: "Q (Hacha Giratoria) + Pasiva",
        reason:
          "Daño devastador en los niveles 1 a 4. Si logran una sola baja, la pasiva de oro acelera la partida y no les permite alcanzar su pico de poder.",
      },
      {
        champion: "Caitlyn",
        role: "ADC",
        category: "Tactical Answer",
        keyAbility: "Rango básico (650) + Trampas",
        reason:
          "Mantiene al hypercarry bajo su propia torre perdiendo vida y placas de torreta antes del minuto 14.",
      },
      {
        champion: "XinZhao",
        role: "JGL",
        category: "Tactical Answer",
        keyAbility: "E + Q (Derribo nivel 3)",
        reason:
          "Ritmo ultra agresivo de jungla con dives coordinados de nivel 3 bajo torre para denegar oleadas acumuladas en bot.",
      },
      {
        champion: "Blitzcrank",
        role: "SUPP",
        category: "Synergy Lockdown",
        keyAbility: "Q (Agarre Misil)",
        reason:
          "Un solo gancho acertado antes de minuto 10 destruye su curva de farmeo y les niega la estabilidad que necesitan para escalar.",
      },
    ],
    draftTip:
      "Combina un tirador agresivo de rango o snowball (Draven/Caitlyn/Kalista) con un soporte de iniciación dura para cerrar la partida antes del minuto 25.",
    banRecommendation: ["Lulu", "Yuumi", "Milio"],
  },
  {
    id: "adc-poke",
    role: "ADC",
    title: "Lane Bullies de Rango / Asedio & Poke",
    tagline: "Opresión a distancia pero extrema fragilidad al flanqueo",
    description:
      "Tiradores diseñados para castigar desde fuera del rango de intercambio con proyectiles de letalidad o asedio de torretas.",
    vulnerability:
      "Extremadamente blandos si el combate se traslada a corta distancia o si se inicia desde la niebla de guerra por un flanco.",
    enemyChampions: ["Caitlyn", "Varus", "Ashe", "Senna", "Ziggs"],
    counterPicks: [
      {
        champion: "Sivir",
        role: "ADC",
        category: "Tactical Answer",
        keyAbility: "E (Escudo de Hechizos) + R",
        reason:
          "Absorbe sus habilidades clave de poke (flecha de Varus, trampa de Caitlyn) convirtiéndolas en maná gratis, y su R acelera a todo el equipo para alcanzarlos.",
      },
      {
        champion: "Braum",
        role: "SUPP",
        category: "Hard Counter",
        keyAbility: "E (Inquebrantable)",
        reason:
          "Su escudo intercepta y anula completamente todo el daño y proyectiles de poke, protegiendo al carry bajo torre.",
      },
      {
        champion: "Zac",
        role: "JGL",
        category: "Tactical Answer",
        keyAbility: "E (Salto de Hortera)",
        reason:
          "Inicia desde puntos ciegos a distancia kilométrica, saltando por encima de sus trampas y flechas de poke.",
      },
      {
        champion: "Rakan",
        role: "SUPP",
        category: "Synergy Lockdown",
        keyAbility: "R + W (Entrada Triunfal)",
        reason:
          "Cierra distancias de forma vertiginosa con Shurelya y R para cazar al bully de rango antes de que desgaste a nuestro equipo.",
      },
    ],
    draftTip:
      "Evita draftear botlanes cortas y sin sustain; busca sustain de escudos y junglas con saltos de largo alcance para cazarlos fuera de posición.",
  },
  {
    id: "adc-movil",
    role: "ADC",
    title: "Tiradores Elusivos / Hipermóviles",
    tagline: "Dependientes de sus dashes y ventanas de reposicionamiento",
    description:
      "Tiradores con movilidad intrínseca capaz de esquivar skillshots y desenganchar iniciaciones directas convencionales.",
    vulnerability:
      "Se vuelven inútiles frente a habilidades anti-movilidad (terreno enredado, zonas de no-dash) o control de masas point-and-click.",
    enemyChampions: ["Ezreal", "Lucian", "Kalista", "Zeri"],
    counterPicks: [
      {
        champion: "Poppy",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "W (Presencia Inalterable)",
        reason:
          "Interrumpe y aturde en seco cualquier intento de dash de Lucian, salto de Kalista o desplazamiento de Zeri.",
      },
      {
        champion: "Vi",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "R (Cease and Desist)",
        reason:
          "Persigue el desplazamiento de Ezreal o Lucian sin importar qué tan lejos salten, garantizando el CC.",
      },
      {
        champion: "Lissandra",
        role: "MID",
        category: "Synergy Lockdown",
        keyAbility: "W (Anillo de Escarcha) + R",
        reason:
          "CC instantáneo sin tiempo de casteo que congela al tirador en cuanto entra en rango de intercambio.",
      },
      {
        champion: "Maokai",
        role: "SUPP",
        category: "Tactical Answer",
        keyAbility: "W (Avance Retorcido)",
        reason:
          "Se vuelve invulnerable y sigue el dash del tirador con un enraizado ineludible.",
      },
    ],
    draftTip:
      "No gastes skillshots lentos contra ellos; prioriza iniciadores con habilidades teledirigidas o canceladores de saltos como Poppy.",
  },

  // =========================================================================
  // TOP (LÍNEA SUPERIOR)
  // =========================================================================
  {
    id: "top-tanque",
    role: "TOP",
    title: "Blind Pick Tanques / Frontline Pura",
    tagline: "Alta resistencia y CC en teamfight pero vulnerables al daño porcentual",
    description:
      "Picks resistentes elegidos a ciegas para absorber daño, escalar en resistencias y asegurar iniciaciones en peleas 5v5.",
    vulnerability:
      "Sufren enormemente contra duelistas con daño verdadero basado en vida máxima o robo de resistencias.",
    enemyChampions: ["Ornn", "Sion", "KSante", "Chogath", "Malphite", "DrMundo"],
    counterPicks: [
      {
        champion: "Fiora",
        role: "TOP",
        category: "Hard Counter",
        keyAbility: "Pasiva (Baile de Duelista) + R",
        reason:
          "Aplica daño verdadero porcentual según la vida máxima del rival. Cuanta más vida y armadura compre el tanque, más daño le hace Fiora.",
      },
      {
        champion: "Gwen",
        role: "TOP",
        category: "Hard Counter",
        keyAbility: "Pasiva (Mil Cortes) + W",
        reason:
          "Tritura tanques con daño mágico porcentual y se vuelve inmune a su CC a distancia gracias a su niebla consagrada.",
      },
      {
        champion: "Trundle",
        role: "TOP",
        category: "Hard Counter",
        keyAbility: "R (Subyugar)",
        reason:
          "Roba un 40% de la armadura y resistencia mágica del tanque, convirtiéndolo en un objetivo de papel y volviendo a Trundle inmortal.",
      },
      {
        champion: "Vayne",
        role: "TOP",
        category: "Punish Pick",
        keyAbility: "W (Proyectiles de Plata)",
        reason:
          "Daño verdadero por impacto que destruye cualquier acumulación de resistencias mientras mantiene al tanque kiteado a distancia.",
      },
    ],
    draftTip:
      "Si el enemigo busca la comodidad de un tanque ciego, castígalo con Fiora o Gwen y juega a la presión lateral (1-3-1 o 4-1).",
  },
  {
    id: "top-splitpush",
    role: "TOP",
    title: "Duelistas Splitpushers 1v1",
    tagline: "Presión lateral asfixiante pero nula presencia en teamfights tempranas",
    description:
      "Campeones de duelo que buscan empujar líneas laterales en solitario y atraer a múltiples miembros del equipo rival.",
    vulnerability:
      "Vulnerables a campeones con reducción de velocidad de ataque, habilidades anti-dash y desenganche masivo que niega el 1v1.",
    enemyChampions: ["Fiora", "Jax", "Camille", "Tryndamere", "Irelia"],
    counterPicks: [
      {
        champion: "Malphite",
        role: "TOP",
        category: "Hard Counter",
        keyAbility: "E (Golpe en el Suelo) + Pasiva",
        reason:
          "Reduce a la mitad la velocidad de ataque del duelista y acumula cantidades desorbitadas de armadura que absorben su daño físico.",
      },
      {
        champion: "Poppy",
        role: "TOP",
        category: "Hard Counter",
        keyAbility: "W (Presencia Inalterable) + R",
        reason:
          "Cancela el salto de Jax, la Q de Fiora y la E de Camille. Con su R puede expulsar al duelista a su base para forzar peleas 5v4.",
      },
      {
        champion: "Shen",
        role: "TOP",
        category: "Tactical Answer",
        keyAbility: "R (Unidos) + W",
        reason:
          "Bloquea sus ataques básicos con la W y usa su R global para ganar peleas en la otra punta del mapa mientras ellos empujan.",
      },
      {
        champion: "Gragas",
        role: "TOP",
        category: "Tactical Answer",
        keyAbility: "E (Barrigazo) + R",
        reason:
          "Línea neutral impenetrable; desengancha cualquier intento de all-in con su barril explosivo y regenera vida pasivamente.",
      },
    ],
    draftTip:
      "No intentes competir en un 1v1 puro si draftearon a su carry; draftea herramientas para forzar el 5v4 en objetivos centrales mientras empujan.",
  },
  {
    id: "top-ranged",
    role: "TOP",
    title: "Ranged Bullies Opresores",
    tagline: "Hostigamiento temprano pero extrema fragilidad al all-in con gap-close",
    description:
      "Campeones de rango en la línea superior que abusan del espaciado para expulsar a los campeones cuerpo a cuerpo de la oleada.",
    vulnerability:
      "Bajas estadísticas de vida y armadura. Si un campeón con gap-close los alcanza o reciben una emboscada, mueren sin responder.",
    enemyChampions: ["Jayce", "Gnar", "Kennen", "Teemo", "Quinn"],
    counterPicks: [
      {
        champion: "Irelia",
        role: "TOP",
        category: "Hard Counter",
        keyAbility: "Q (Danza de Hojas) + E",
        reason:
          "Usa los súbditos de la oleada para cerrar la distancia de forma instantánea y borrar al tirador de rango en all-in directo.",
      },
      {
        champion: "Malphite",
        role: "TOP",
        category: "Tactical Answer",
        keyAbility: "Q (Cometa) + R a nivel 6",
        reason:
          "Aguanta los primeros niveles con el escudo pasivo y cometa; al alcanzar nivel 6, la R de Malphite significa muerte segura para el pick de rango.",
      },
      {
        champion: "Aatrox",
        role: "TOP",
        category: "Tactical Answer",
        keyAbility: "Q (Filo de los Oscuros) + E",
        reason:
          "Su rango con la espada supera su distancia de seguridad y su curación masiva mitiga el hostigamiento constante.",
      },
    ],
    draftTip:
      "Coordina con tu jungla una visita en nivel 3. Un pick de rango en top que muere en los primeros 5 minutos queda fuera de la partida.",
  },

  // =========================================================================
  // JGL (JUNGLA / RITMO DE MAPA)
  // =========================================================================
  {
    id: "jgl-invaders",
    role: "JGL",
    title: "Early Invaders & Duelistas Agresivos",
    tagline: "Buscan duelos tempranos en el río e invadir en niveles 2-3",
    description:
      "Junglas de impacto temprano que buscan invadir los campamentos rivales, robar bufos y conseguir la primera sangre.",
    vulnerability:
      "Si no consiguen ventajas en los primeros 12 minutos, su impacto en las peleas de equipo cae en picado.",
    enemyChampions: ["XinZhao", "LeeSin", "RekSai", "Elise", "Nidalee"],
    counterPicks: [
      {
        champion: "Sejuani",
        role: "JGL",
        category: "Tactical Answer",
        keyAbility: "Pasiva (Armadura de Escarcha) + CC",
        reason:
          "Su pasiva le otorga resistencias colosales que impiden que los duelistas la ejecuten en early, escalando infinitamente mejor en 5v5.",
      },
      {
        champion: "Poppy",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "W (Presencia Inalterable)",
        reason:
          "Anula la Q2 de Lee Sin, la E de Xin Zhao y los saltos de Nidalee, dejándolos expuestos en plena invasión.",
      },
      {
        champion: "Trundle",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "Q (Mordisco) + Pilar",
        reason:
          "Roba daño de ataque con su Q y gana cualquier pelea cuerpo a cuerpo por el escurridizo en los niveles 2 y 3.",
      },
    ],
    draftTip:
      "Coloca centinelas en las entradas del río al minuto 1:15 y draftea líneas con prioridad de empuje para proteger las zonas de jungla.",
  },
  {
    id: "jgl-farmers",
    role: "JGL",
    title: "Power Farmers de Escalado",
    tagline: "Limpieza rápida de campamentos pero nula presencia en los primeros ganks",
    description:
      "Junglas que necesitan completar rutas completas de farmeo y alcanzar nivel 6 antes de poder influir decisivamente en la partida.",
    vulnerability:
      "Totalmente vulnerables a invasiones agresivas en su segundo bufo y a junglas que generan ventaja en las líneas aliadas mientras ellos limpian.",
    enemyChampions: ["Karthus", "Shyvana", "Lillia", "MasterYi", "Belveth"],
    counterPicks: [
      {
        champion: "JarvanIV",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "E-Q + Presión de Líneas",
        reason:
          "Gankea tres veces antes de que el power-farmer termine su primera vuelta, rompiendo las líneas enemigas antes del primer dragón.",
      },
      {
        champion: "XinZhao",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "Invasión nivel 3",
        reason:
          "Invade directamente el segundo bufo del rival para cazarlo con media vida y robarle toda la experiencia.",
      },
      {
        champion: "Pantheon",
        role: "JGL",
        category: "Tactical Answer",
        keyAbility: "W (Stun point-and-click) + R",
        reason:
          "Ritmo asfixiante que fuerza objetivos y batallas tempranas antes de que los power-farmers puedan completar sus objetos clave.",
      },
    ],
    draftTip:
      "Si el rival elige un jungla de farmeo pasivo, bloquea sus campamentos y juega a stompear las líneas antes del minuto 15.",
  },
  {
    id: "jgl-engage",
    role: "JGL",
    title: "Iniciadores Frontline & CC Masivo",
    tagline: "Garantizan engage en teamfight pero sufren contra robo de stats y desenganche",
    description:
      "Junglas tanques cuyo rol es iniciar peleas 5v5 con cadenas de control de masas masivas.",
    vulnerability:
      "Sus kits se basan en una sola habilidad de entrada; si son drenados o ignorados, aportan poco daño.",
    enemyChampions: ["Sejuani", "Zac", "Amumu", "Rammus", "Maokai"],
    counterPicks: [
      {
        champion: "Trundle",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "R (Subyugar)",
        reason:
          "Usa la R en el tanque iniciador cuando entra, dejándolo sin defensas frente al focus de nuestro equipo.",
      },
      {
        champion: "Olaf",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "R (Ragnarok)",
        reason:
          "Inmune a cualquier CC de iniciación; ignora por completo a Sejuani o Amumu y se lanza directo a sus líneas traseras.",
      },
      {
        champion: "Sylas",
        role: "MID",
        category: "Tactical Answer",
        keyAbility: "R (Secuestro de Definitiva)",
        reason:
          "Roba las definitivas masivas de Amumu, Zac o Sejuani y las ejecuta con un ratio de daño AP devastador.",
      },
    ],
    draftTip:
      "Asegura una opción con inmunidad a CC o robo de tanque para que su iniciación se convierta en una trampa para ellos mismos.",
  },

  // =========================================================================
  // MID (LÍNEA CENTRAL)
  // =========================================================================
  {
    id: "mid-control",
    role: "MID",
    title: "Magos de Control Inmóviles & Asedio",
    tagline: "Gran daño de zona y control de oleadas pero vulnerables a emboscadas directas",
    description:
      "Magos tradicionales que dictan el ritmo de las peleas con habilidades de área y daño a distancia constante.",
    vulnerability:
      "Cero herramientas de movilidad; un gank certero o un asesino con múltiples dashes los condena si se adelantan en la línea.",
    enemyChampions: ["Viktor", "Mel", "Syndra", "Lux", "Velkoz", "Xerath", "Orianna"],
    counterPicks: [
      {
        champion: "JarvanIV",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "E-Q + R (Cataclismo)",
        reason:
          "En el carril central, la R de Jarvan IV atrapa al mago inmóvil sin escapatoria, obligándole a gastar Flash o morir en cada gank.",
      },
      {
        champion: "Vi",
        role: "JGL",
        category: "Hard Counter",
        keyAbility: "R (Cease and Desist)",
        reason:
          "Supera su rango de poke e inicia de forma imparable, levantándolos para que el mid laner aliado los remate.",
      },
      {
        champion: "Akali",
        role: "MID",
        category: "Tactical Answer",
        keyAbility: "W (Velo del Crepúsculo) + R",
        reason:
          "Se oculta en su velo evitando sus habilidades de área y utiliza sus múltiples desplazamientos para cazarlos bajo torre.",
      },
      {
        champion: "Galio",
        role: "MID",
        category: "Tactical Answer",
        keyAbility: "Escudo mágico de W + Flash-W",
        reason:
          "Resistencia innata contra daño mágico y provocación en área con Flash-W que facilita los ganks de nuestro jungla.",
      },
    ],
    draftTip:
      "Contra magos inmóviles de control, asegúrate de que tu jungla tenga herramientas de iniciación dura e implacable (Jarvan IV / Vi / Nocturne).",
  },
  {
    id: "mid-assassins",
    role: "MID",
    title: "Asesinos Móviles AD / AP",
    tagline: "Daño explosivo y movilidad pero sufren ante supresión y CC instantáneo",
    description:
      "Campeones móviles diseñados para eliminar de un combo a los carries en las líneas traseras.",
    vulnerability:
      "Muy dependientes de lanzarse al combate cuerpo a cuerpo; si reciben CC instantáneo, su barra de vida desaparece.",
    enemyChampions: ["Zed", "Leblanc", "Akali", "Katarina", "Fizz", "Talon"],
    counterPicks: [
      {
        champion: "Lissandra",
        role: "MID",
        category: "Hard Counter",
        keyAbility: "R (Tumba Helada) + W",
        reason:
          "Si el asesino se lanza sobre ella, se congela a sí misma volviéndose inmune; o congela al asesino en seco bajo el fuego del equipo.",
      },
      {
        champion: "Malzahar",
        role: "MID",
        category: "Hard Counter",
        keyAbility: "R (Agarre Infernal)",
        reason:
          "Supresión point-and-click ineludible que detiene en seco cualquier intento de dive o maniobra rápida.",
      },
      {
        champion: "Vex",
        role: "MID",
        category: "Hard Counter",
        keyAbility: "Pasiva (Calamidad) + W",
        reason:
          "Interrumpe y aterroriza automáticamente a cualquier campeón que ejecute un dash a su alrededor.",
      },
      {
        champion: "Galio",
        role: "MID",
        category: "Tactical Answer",
        keyAbility: "W (Escudo de Durand) + E",
        reason:
          "Aguanta el burst del asesino con sus resistencias y lo castiga con un combo de control continuo.",
      },
    ],
    draftTip:
      "No draftees magos blandos a ciegas; si el rival tiene asesinos móviles, reserva una respuesta con control de masas instantáneo.",
  },

  // =========================================================================
  // SUPP (SOPORTE / CONTROL DE LÍNEA INFERIOR)
  // =========================================================================
  {
    id: "supp-enchanter",
    role: "SUPP",
    title: "Enchanters Frágiles de Escudos & Curación",
    tagline: "Protección sostenida pero extrema fragilidad al all-in directo",
    description:
      "Soportes de utilidad que potencian al tirador con escudos, velocidad y curaciones constantes.",
    vulnerability:
      "Bajísimos puntos de vida base. Si son atrapados por una iniciación pesada, mueren antes de poder lanzar sus habilidades defensivas.",
    enemyChampions: ["Lulu", "Nami", "Milio", "Yuumi", "Soraka", "Sona", "Janna"],
    counterPicks: [
      {
        champion: "Nautilus",
        role: "SUPP",
        category: "Hard Counter",
        keyAbility: "Q (Línea de Dragado) + Pasiva",
        reason:
          "Un solo gancho acertado en el enchanter durante los primeros niveles significa su eliminación garantizada.",
      },
      {
        champion: "Blitzcrank",
        role: "SUPP",
        category: "Hard Counter",
        keyAbility: "Q (Agarre Misil) + R",
        reason:
          "Su gancho los saca de su posición de seguridad y su R destruye de forma instantánea todos los escudos que hayan acumulado.",
      },
      {
        champion: "Leona",
        role: "SUPP",
        category: "Hard Counter",
        keyAbility: "E-Q + R",
        reason:
          "All-in implacable que no les permite respirar en los niveles 2, 3 y 6, forzando la ventaja de oro en bot.",
      },
      {
        champion: "Pyke",
        role: "SUPP",
        category: "Punish Pick",
        keyAbility: "Q + R (Muerte de las Profundidades)",
        reason:
          "Presión letal en línea y una definitiva que ignora las curaciones si el enchanter cae por debajo del umbral de vida.",
      },
    ],
    draftTip:
      "Contra botlanes con enchanter, juega soportes de iniciación agresiva para castigarlos antes de que su escalado proteja al carry.",
  },
  {
    id: "supp-engage",
    role: "SUPP",
    title: "Hard Engage All-In & Iniciación",
    tagline: "Iniciaciones violentas pero vulnerables al desenganche y contra-iniciación",
    description:
      "Soportes tanques diseñados para saltar sobre el carry rival y forzar batallas all-in en cualquier instante.",
    vulnerability:
      "Si su iniciación es repelida o bloqueada, quedan vendidos sin recursos en medio del equipo enemigo.",
    enemyChampions: ["Nautilus", "Leona", "Rell", "Alistar", "Taric"],
    counterPicks: [
      {
        champion: "Janna",
        role: "SUPP",
        category: "Hard Counter",
        keyAbility: "Q (Tornado) + R (Monzón)",
        reason:
          "El tornado corta la E de Leona o el salto de Rell en pleno aire, y su R expulsa a los iniciadores curando al equipo.",
      },
      {
        champion: "Braum",
        role: "SUPP",
        category: "Hard Counter",
        keyAbility: "E (Inquebrantable) + Pasiva",
        reason:
          "Bloquea el daño que sigue a la iniciación y aplica marcas de aturdimiento en el tanque enemigo con sus básicos.",
      },
      {
        champion: "Renata",
        role: "SUPP",
        category: "Tactical Answer",
        keyAbility: "R (Adquisición Hostil)",
        reason:
          "Vuelve la agresión del equipo enemigo en su propia contra, forzando a sus campeones a atacarse entre ellos.",
      },
      {
        champion: "Poppy",
        role: "SUPP",
        category: "Hard Counter",
        keyAbility: "W (Presencia Inalterable)",
        reason:
          "Detiene cualquier engage con dash (Rell, Leona, Alistar) dejándolos aturdidos e indefensos.",
      },
    ],
    draftTip:
      "Draftea disengage puro (Janna/Braum/Renata); cuando el enemigo gaste su iniciación sin éxito, contraataca con superioridad.",
  },
  {
    id: "supp-catcher",
    role: "SUPP",
    title: "Catchers / Ganchos de Aislamiento",
    tagline: "Peligro constante de cazada pero predecibles frente a escudos mágicos y tanques",
    description:
      "Soportes especializados en enganchar a un objetivo aislado para iniciar escaramuzas con ventaja numérica.",
    vulnerability:
      "Si el gancho golpea a un tanque iniciador aliado, le están regalando una posición de ataque ideal sin gastar recursos.",
    enemyChampions: ["Blitzcrank", "Thresh", "Pyke"],
    counterPicks: [
      {
        champion: "Morgana",
        role: "SUPP",
        category: "Hard Counter",
        keyAbility: "E (Escudo Negro)",
        reason:
          "Su escudo otorga inmunidad absoluta a cualquier gancho o efecto de CC, invalidando la principal amenaza del rival.",
      },
      {
        champion: "Alistar",
        role: "SUPP",
        category: "Tactical Answer",
        keyAbility: "W-Q (Pulverización)",
        reason:
          "Si el rival lo engancha a él, Alistar agradece el acercamiento para conectar un combo W-Q gratuito en el tirador enemigo.",
      },
      {
        champion: "Sivir",
        role: "ADC",
        category: "Tactical Answer",
        keyAbility: "E (Escudo de Hechizos)",
        reason:
          "Bloquea el gancho directamente y recupera maná para seguir empujando la oleada.",
      },
    ],
    draftTip:
      "No tengas miedo de los ganchos: draftea soportes tanques que deseen ser atrapados (Alistar / Leona) o el escudo negro de Morgana.",
  },
];

/**
 * Busca el arquetipo al que pertenece un campeón rival
 */
export function findArchetypesForChampion(champName: string): EnemyRoleArchetype[] {
  if (!champName) return [];
  const clean = champName.toLowerCase().replace(/[^a-z0-9]/g, "");

  return ROLE_COUNTER_ARCHETYPES.filter((arch) =>
    arch.enemyChampions.some((c) => {
      const match = c.toLowerCase().replace(/[^a-z0-9]/g, "");
      return match === clean || clean.includes(match) || match.includes(clean);
    })
  );
}

/**
 * Busca en qué arquetipos un campeón específico actúa como counterpick
 */
export function findCounterRolesForChampion(champName: string): {
  archetype: EnemyRoleArchetype;
  counterDetail: CounterPickDetail;
}[] {
  if (!champName) return [];
  const clean = champName.toLowerCase().replace(/[^a-z0-9]/g, "");

  const results: { archetype: EnemyRoleArchetype; counterDetail: CounterPickDetail }[] = [];

  ROLE_COUNTER_ARCHETYPES.forEach((arch) => {
    arch.counterPicks.forEach((cp) => {
      const match = cp.champion.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (match === clean || clean.includes(match) || match.includes(clean)) {
        results.push({ archetype: arch, counterDetail: cp });
      }
    });
  });

  return results;
}
