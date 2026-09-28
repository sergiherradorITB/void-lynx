import ornnImage from "@/assets/champions/ornn_hd.jpg";
import viegoImage from "@/assets/champions/viego_hd.jpg";
import seraphineImage from "@/assets/champions/seraphine_hd.jpg";
import apheliosImage from "@/assets/champions/aphelios_hd.jpg";
import rellImage from "@/assets/champions/rell_hd.jpg";

export const socials = [
  { name: "Twitch", handle: "/voidlynxlol", href: "https://www.twitch.tv/voidlynxlol" },
  { name: "X", handle: "@VoidLynxLOL", href: "https://x.com/VoidLynxLOL" },
  { name: "Instagram", handle: "@voidlynxlol", href: "https://www.instagram.com/voidlynxlol/" },
  { name: "YouTube", handle: "@VoidLynxLOL", href: "https://www.youtube.com/@VoidLynxLOL" },
  { name: "Discord", handle: "Void Lynx", href: "https://discord.gg/aSRxMSGskg" },
  { name: "TikTok", handle: "@voidlynxlol", href: "https://www.tiktok.com/@voidlynxlol" },
];

export interface PlayerHighlight {
  title: string;
  tournament: string;
  duration?: string;
  youtubeUrl: string;
}

export interface Player {
  role: string;
  nick: string;
  social: string;
  href?: string;
  opgg?: string;
  flag: string;
  desc: string;
  champ: string;
  champName?: string;
  champTitle?: string;
  champObjectPosition?: string;
  imageClass?: string;
  signatureChampions?: string[];
  highlights?: PlayerHighlight[];
}

export function getYouTubeEmbedUrl(input?: string): string {
  if (!input) return "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
  const match = input.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  }
  if (/^[\w-]{11}$/.test(input.trim())) {
    return `https://www.youtube-nocookie.com/embed/${input.trim()}`;
  }
  return "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
}

export function getYouTubeThumbnail(input?: string, fallback?: string): string {
  if (!input) return fallback || "";
  const match = input.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  if (/^[\w-]{11}$/.test(input.trim())) {
    return `https://img.youtube.com/vi/${input.trim()}/hqdefault.jpg`;
  }
  return fallback || "";
}

export const roster: Player[] = [
  {
    role: "Top",
    nick: "Kaserolo",
    social: "@TheAngeliu",
    href: "https://x.com/TheAngeliu",
    opgg: "https://op.gg/es/lol/summoners/euw/Kaserolo-EUW",
    flag: "ES",
    desc: "El rey del aura y de la top.",
    champ: ornnImage,
    champName: "Ornn",
    champTitle: "El Fuego de la Forja",
    champObjectPosition: "object-[center_25%]",
    imageClass: "contrast-100 brightness-110",
    signatureChampions: ["Ornn", "K'Sante", "Udyr"],
    highlights: [
      {
        title: "Nasus Farmeando Stacks Bien Vergas en Top",
        tournament: "Toplane Simulator • 1000 Stacks al Min 40",
        duration: "4:31",
        youtubeUrl: "https://www.youtube.com/watch?v=GtUVQei3nX4",
      },
      {
        title: "El Rey del Aura de la Top — Gigachad Theme",
        tournament: "Aura Legendaria • Solo Muere Si Se Cae el Router",
        duration: "3:48",
        youtubeUrl: "https://www.youtube.com/watch?v=QJJYpsA5tv8",
      },
    ],
  },
  {
    role: "Jungla",
    nick: "Tamudor",
    social: "@sergiwrx",
    href: "https://x.com/sergiwrx",
    opgg: "https://op.gg/es/lol/summoners/euw/Tamudor-RCDE",
    flag: "ES",
    desc: "Es del espanyol, está forjado a hierro",
    champ: viegoImage,
    champName: "Viego",
    champTitle: "El Rey Arruinado",
    champObjectPosition: "object-[center_15%]",
    signatureChampions: ["Rek'Sai", "Viego", "Xin Zhao"],
    highlights: [
      {
        title: "Smash Mouth — All Star (El Shrek de la Jungla)",
        tournament: "Robo de Barón • Smite a 45 de Daño y Pa' Casa",
        duration: "3:57",
        youtubeUrl: "https://www.youtube.com/watch?v=L_jWHffIx5E",
      },
      {
        title: "Viego: Modo Posesión Infinito Forjado a Hierro",
        tournament: "Espíritu RCDE • Carrileando la Partida sin Botas",
        duration: "3:58",
        youtubeUrl: "https://www.youtube.com/watch?v=m-IGWllnTMw",
      },
    ],
  },
  {
    role: "Mid",
    nick: "Upss",
    social: "@upssloll",
    href: "https://x.com/upssloll",
    opgg: "https://op.gg/es/lol/summoners/euw/Up%C5%A1s-ttpd",
    flag: "ES",
    desc: "Te controla hasta que no quieras jugar",
    champ: seraphineImage,
    champName: "Seraphine",
    champTitle: "La Cantante Soñadora",
    champObjectPosition: "object-[center_20%]",
    signatureChampions: ["Mel", "Seraphine", "Lux"],
    highlights: [
      {
        title: "Taylor Swift — Trouble (Versión Grito de Cabra)",
        tournament: "Meme Histórico • Cuando el Jungla Enemigo Gankea Mid",
        duration: "0:30",
        youtubeUrl: "https://www.youtube.com/watch?v=-aLYvZ5sX28",
      },
      {
        title: "Taylor Swift ft. Post Malone — Fortnight",
        tournament: "Álbum TTPD • Tryhardeando Seraphine a las 4 AM",
        duration: "4:09",
        youtubeUrl: "https://www.youtube.com/watch?v=q3zqJs7JUCQ",
      },
    ],
  },
  {
    role: "ADC",
    nick: "Arnoop88",
    social: "@arnoop88",
    href: "https://x.com/arnoop88",
    opgg: "https://op.gg/es/lol/summoners/euw/arnoop88-ggez",
    flag: "ES",
    desc: "pega tan duro como tu ex",
    champ: apheliosImage,
    champName: "Aphelios",
    champTitle: "El Arma de los Fieles",
    champObjectPosition: "object-[center_20%]",
    signatureChampions: ["Aphelios", "Smolder", "Senna"],
    highlights: [
      {
        title: "Aphelios: 200 Años de Experiencia en Diseño Colectivo",
        tournament: "Meme Riot • Pegando tan Duro como tu Ex",
        duration: "6:14",
        youtubeUrl: "https://www.youtube.com/watch?v=sSgyzHDuDkU",
      },
      {
        title: "Darude — Sandstorm (Himno Oficial de la Botlane)",
        tournament: "DUDUDUDU • Spameando Flechas y Habilidades al Azar",
        duration: "3:52",
        youtubeUrl: "https://www.youtube.com/watch?v=y6120QOlsfU",
      },
    ],
  },
  {
    role: "Support",
    nick: "Azoth",
    social: "@Eltrollex_",
    href: "https://x.com/Eltrollex_",
    opgg: "https://op.gg/es/lol/summoners/euw/Rell-OTPS",
    flag: "ES",
    desc: "Engagea como un toro sin pastillas",
    champ: rellImage,
    champName: "Rell",
    champTitle: "La Dama de Hierro",
    champObjectPosition: "object-[center_20%]",
    signatureChampions: ["Rell", "Rakan", "Leona"],
    highlights: [
      {
        title: "Initial D — Deja Vu (Drifteando el Caballo de Rell)",
        tournament: "Toro Sin Pastillas • Engage 1v5 a 200 km/h por el Río",
        duration: "4:24",
        youtubeUrl: "https://www.youtube.com/watch?v=dv13gl0a-FA",
      },
      {
        title: "Bag Raiders — Shooting Stars (Volando por el Espacio)",
        tournament: "Meme Rell • Cuando Fallas la W y Sales de la Grieta",
        duration: "3:55",
        youtubeUrl: "https://www.youtube.com/watch?v=feA64wXhbjo",
      },
    ],
  },
];

export interface StaffSocial {
  name: string;
  handle: string;
  href: string;
}

export interface StaffMember {
  role: string;
  nick: string;
  socials?: StaffSocial[];
}

export const staff: StaffMember[] = [
  {
    role: "Manager",
    nick: "ORESITO",
  },
  {
    role: "Coach",
    nick: "egv999",
    socials: [
      { name: "X", handle: "@EGV1999", href: "https://x.com/EGV1999" },
      { name: "TikTok", handle: "@egv999", href: "https://www.tiktok.com/@egv999" },
    ],
  },
  {
    role: "Content Manager",
    nick: "al333x23_",
  },
  {
    role: "Todoterreno",
    nick: "Tamudor",
    socials: [{ name: "X", handle: "@sergiwrx", href: "https://x.com/sergiwrx" }],
  },
];

export const nav = [
  { label: "Roster", href: "#roster" },
  { label: "Staff", href: "#staff" },
];

export const socialIcons: Record<string, React.ReactNode> = {
  Twitch: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.265 3 3 6.235v14.53h5V23h2.824L13.47 20.765h4.53L22 16.764V3H4.265Zm15.323 12.765-2.588 2.588h-4.53l-2.588 2.588v-2.588H6.117V4.882h13.47v10.883ZM12 7.647h1.765v5.294H12V7.647Zm4.706 0h1.765v5.294h-1.765V7.647Z" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.91 4.91 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.91 4.91 0 0 1-1.153 1.772 4.91 4.91 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.91 4.91 0 0 1-1.772-1.153 4.91 4.91 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.01 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.065.217-1.79.465-2.428a4.91 4.91 0 0 1 1.153-1.772A4.91 4.91 0 0 1 5.45 2.525c.637-.248 1.363-.415 2.428-.465C8.944 2.01 9.283 2 12 2Zm0 1.802c-2.67 0-2.986.01-4.04.059-.975.045-1.504.207-1.857.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.054-.059 1.37-.059 4.04 0 2.67.01 2.986.059 4.04.045.975.207 1.504.344 1.857.182.466.398.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.059 4.04.059 2.67 0 2.986-.01 4.04-.059.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.054.059-1.37.059-4.04 0-2.67-.01-2.986-.059-4.04-.045-.975-.207-1.504-.344-1.857a3.1 3.1 0 0 0-.748-1.15 3.1 3.1 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.059-4.04-.059Zm0 3.063A5.135 5.135 0 1 1 12 17.135 5.135 5.135 0 0 1 12 6.865Zm0 8.468A3.333 3.333 0 1 0 8.667 12 3.333 3.333 0 0 0 12 15.333Zm6.538-8.671a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2Z" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.016 3.016 0 0 0 .502 6.186C0 8.057 0 12 0 12s0 3.943.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.943 24 12 24 12s0-3.943-.502-5.814ZM9.546 15.568V8.432L15.818 12l-6.272 3.568Z" />
    </svg>
  ),
  Discord: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <g transform="scale(0.85) translate(2, 2)">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.39-2.2 1.85-5.21 2.5-7.97 1.83-2.78-.67-5.07-2.81-5.91-5.55-.83-2.73-.24-5.83 1.54-8.08 1.77-2.23 4.59-3.37 7.39-3.23v4.06c-1.42-.04-2.9.36-3.95 1.35-1.05.99-1.46 2.48-1.22 3.88.24 1.37 1.22 2.56 2.5 3.09 1.28.53 2.82.49 3.97-.24 1.16-.73 1.81-2 1.83-3.35.03-7.23.01-14.47.01-21.7z" />
      </g>
    </svg>
  ),
};

export const newsItems = [
  {
    id: 1,
    date: '29 Sep 2026',
    tag: 'Roster',
    title: 'Nuevos main champs confirmados para la temporada',
    excerpt: 'Arnau, Kaserolo, Tamudor, Azoth y Upss han actualizado su pool de campeones para dominar en el próximo split.',
  },
  {
    id: 2,
    date: '25 Sep 2026',
    tag: 'Anuncio',
    title: 'Presentamos la nueva identidad visual de Void Lynx',
    excerpt: 'Silencio antes del salto. Hemos renovado nuestro logo y la estética completa del equipo. Bienvenidos a la nueva era.',
  },
  {
    id: 3,
    date: '15 Sep 2026',
    tag: 'Competición',
    title: 'Clasificación asegurada para los playoffs',
    excerpt: 'Tras una racha impecable, el equipo se asegura el primer puesto en la fase regular y nos preparamos para la fase final.',
  }
];
