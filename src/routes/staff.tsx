import React, { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CHAMPIONS_CATALOG,
  getChampionAvatar,
  getChampionSplash,
  findChampion,
  Champion,
} from "@/data/champions";
import {
  CompositionData,
  PlayerChampionEntry,
  PlayerProfile,
  PLAYERS_LIST,
  PriorityLevel,
} from "@/data/staff-initial-data";
import {
  loadCompositions,
  loadPlayerChampions,
  saveCompositionsToStorage,
  savePlayerChampionsToStorage,
  resetStaffDataToDefault,
  syncCompositionsWithApi,
  syncPlayerChampionsWithApi,
  loadDraftHistory,
  saveDraftToStorage,
  deleteDraftFromStorage,
  syncDraftWithApi,
  fetchRemoteCompositions,
  fetchRemotePlayerChampions,
  SavedDraft,
} from "@/lib/staff-storage";
import { RoleBadge, RoleIconOnly, RoleType } from "@/components/RoleBadge";
import newLogo from "@/assets/new-logo.png";
import {
  Shield,
  Users,
  Swords,
  Crosshair,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ArrowLeft,
  Search,
  Crown,
  Trophy,
  LayoutGrid,
  ChevronUp,
  ChevronDown,
  History,
  Save,
  BarChart3,
  Flame,
  Calendar,
  X,
  Edit3,
  Table,
  SlidersHorizontal,
  Check,
  ExternalLink,
  Globe,
  Tv,
} from "lucide-react";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff Tactical Hub & Drafter — Void Lynx" },
      {
        name: "description",
        content: "Panel técnico para preparación de composiciones, counters, pool de jugadores y first-picks.",
      },
    ],
  }),
  component: StaffPage,
});

type ActiveTab = "drafter" | "compositions" | "players" | "live";

function StaffPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("drafter");
  const [compositions, setCompositions] = useState<CompositionData[]>(loadCompositions);
  const [playerChampions, setPlayerChampions] = useState<PlayerChampionEntry[]>(loadPlayerChampions);
  const [selectedCompId, setSelectedCompId] = useState<string>("siege-4");
  const [selectedPlayerName, setSelectedPlayerName] = useState<string>("Kaserolo");
  const [saveStatus, setSaveStatus] = useState<"synced" | "saving" | "unsaved">("synced");
  const [playerViewMode, setPlayerViewMode] = useState<"tierlist" | "grid">("tierlist");

  // Jugador actual seleccionado
  const selectedPlayer = PLAYERS_LIST.find((p) => p.name === selectedPlayerName) || PLAYERS_LIST[0];

  // Composición actual seleccionada en el drafter
  const currentComp = compositions.find((c) => c.id === selectedCompId) || compositions[0];

  // Helper para guardar cambios
  const handlePersist = (newComps: CompositionData[], newChamps: PlayerChampionEntry[]) => {
    setCompositions(newComps);
    setPlayerChampions(newChamps);
    saveCompositionsToStorage(newComps);
    savePlayerChampionsToStorage(newChamps);
    setSaveStatus("saving");
    Promise.all([syncCompositionsWithApi(newComps), syncPlayerChampionsWithApi(newChamps)])
      .then(() => setSaveStatus("synced"))
      .catch(() => setSaveStatus("unsaved"));
  };

  // Restablecer valores
  const handleReset = () => {
    if (window.confirm("¿Seguro que quieres restablecer todas las composiciones y pools a los datos originales del Excel?")) {
      const defaults = resetStaffDataToDefault();
      setCompositions(defaults.compositions);
      setPlayerChampions(defaults.playerChampions);
      setSaveStatus("synced");
    }
  };

  // Sincronización inicial con Cloudflare D1 en segundo plano
  useEffect(() => {
    Promise.all([fetchRemoteCompositions(), fetchRemotePlayerChampions()])
      .then(([remoteComps, remoteChamps]) => {
        if (remoteComps && remoteComps.length > 0) {
          setCompositions(remoteComps);
        }
        if (remoteChamps && remoteChamps.length > 0) {
          setPlayerChampions(remoteChamps);
        }
        if (remoteComps || remoteChamps) {
          setSaveStatus("synced");
        }
      })
      .catch(() => {
        // En entorno local o sin binding de D1, seguimos en local
      });
  }, []);

  // Filtros y estados del gestor de jugadores
  const [playerFilterTier, setPlayerFilterTier] = useState<string>("ALL");
  const [playerFilterComp, setPlayerFilterComp] = useState<string>("ALL");
  const [newChampSearch, setNewChampSearch] = useState<string>("");
  const [newChampTier, setNewChampTier] = useState<"S" | "A" | "B" | "C">("A");
  const [newChampComps, setNewChampComps] = useState<string[]>([]);
  const [newChampFirstPick, setNewChampFirstPick] = useState<boolean>(true);

  // Modal de Crear / Editar Composición Táctica
  const [editingComp, setEditingComp] = useState<CompositionData | null>(null);
  const [isNewComp, setIsNewComp] = useState<boolean>(false);
  const [compCounterSearch, setCompCounterSearch] = useState<string>("");
  const [newNoFpChamp, setNewNoFpChamp] = useState<string>("");
  const [newNoFpReason, setNewNoFpReason] = useState<string>("");
  const [newBanInput, setNewBanInput] = useState<string>("");

  // Modo de visualización en el Asistente de Draft Táctico: "vertical" (Pizarra Vertical por Compo - por defecto), "matrix" (Matriz General 8 Compos), "cards" (Apertura & First Picks)
  const [drafterViewMode, setDrafterViewMode] = useState<"vertical" | "matrix" | "cards">("vertical");
  const [matrixShowAll, setMatrixShowAll] = useState<boolean>(true);

  // Filtro de ayuda visual para saber qué pickear en el drafter ("ALL", "FP" -> qué abrir 1º, "LP" -> qué guardar para R5, "RISKY" -> riesgos y advertencias)
  const [drafterPickHighlight, setDrafterPickHighlight] = useState<"ALL" | "FP" | "LP" | "RISKY">("ALL");

  // Modal para añadir campeón rápido a un rol en la pizarra vertical
  const [quickAddRole, setQuickAddRole] = useState<RoleType | null>(null);
  const [quickAddSearch, setQuickAddSearch] = useState<string>("");
  const [quickAddTier, setQuickAddTier] = useState<"S" | "A" | "B">("S");
  const [quickAddTag, setQuickAddTag] = useState<"FP" | "LP" | "Risky" | "Normal">("FP");

  // Handlers para composición (Crear, Editar, Guardar, Borrar)
  const handleOpenCreateComp = () => {
    setIsNewComp(true);
    setEditingComp({
      id: `comp-${Date.now()}`,
      nombre: "NUEVA COMPOSICIÓN",
      prioridad: "Media Prioridad",
      descripcion: "Describe aquí el concepto táctico y condición de victoria...",
      enfoque: "Mid Game",
      counters_descripcion: "Describe qué estilo o campeones la counterean...",
      counters_campeones: [],
      first_pick_safe: [],
      no_first_pick_reasons: [],
      bans_recomendados: [],
      notas_staff: "",
      role_priorities: {
        TOP: "Media",
        JGL: "Alta",
        MID: "Alta",
        ADC: "Alta",
        SUPP: "Media",
      },
    });
    setCompCounterSearch("");
    setNewNoFpChamp("");
    setNewNoFpReason("");
    setNewBanInput("");
  };

  const handleOpenEditComp = (comp: CompositionData) => {
    setIsNewComp(false);
    setEditingComp({
      ...comp,
      role_priorities: comp.role_priorities || {
        TOP: "Media",
        JGL: "Alta",
        MID: "Alta",
        ADC: "Alta",
        SUPP: "Media",
      },
    });
    setCompCounterSearch("");
    setNewNoFpChamp("");
    setNewNoFpReason("");
    setNewBanInput("");
  };

  const handleSaveEditingComp = () => {
    if (!editingComp || !editingComp.nombre.trim()) {
      alert("Por favor introduce un nombre para la composición.");
      return;
    }
    let updated: CompositionData[];
    if (isNewComp) {
      updated = [...compositions, editingComp];
    } else {
      updated = compositions.map((c) => (c.id === editingComp.id ? editingComp : c));
    }
    handlePersist(updated, playerChampions);
    setEditingComp(null);
  };

  const handleDeleteComp = (id: string) => {
    if (compositions.length <= 1) {
      alert("No puedes eliminar la única composición restante.");
      return;
    }
    if (window.confirm("¿Seguro que quieres eliminar esta composición del sistema?")) {
      const updated = compositions.filter((c) => c.id !== id);
      handlePersist(updated, playerChampions);
      if (selectedCompId === id) {
        setSelectedCompId(updated[0].id);
      }
      setEditingComp(null);
    }
  };

  // Alternar prioridad de pickeo de un rol directamente desde la tabla (Baja -> Media -> Alta -> Baja)
  const handleCycleRolePriority = (compId: string, role: RoleType) => {
    const cycle: Record<PriorityLevel, PriorityLevel> = {
      Baja: "Media",
      Media: "Alta",
      Alta: "Baja",
    };
    const updated = compositions.map((c) => {
      if (c.id !== compId) return c;
      const currentPrios = c.role_priorities || {
        TOP: "Media",
        JGL: "Media",
        MID: "Media",
        ADC: "Media",
        SUPP: "Media",
      };
      const currentVal = currentPrios[role] || "Media";
      const nextVal = cycle[currentVal];
      return {
        ...c,
        role_priorities: {
          ...currentPrios,
          [role]: nextVal,
        },
      };
    });
    handlePersist(updated, playerChampions);
  };

  // Alternar tag de pickeo de un campeón en la matriz (FP -> LP -> Risky -> Normal -> FP)
  const handleCyclePickTag = (entryId: string) => {
    const cycle: Record<string, "FP" | "LP" | "Risky" | "Normal"> = {
      FP: "LP",
      LP: "Risky",
      Risky: "Normal",
      Normal: "FP",
    };
    const updated = playerChampions.map((item) => {
      if (item.id !== entryId) return item;
      const currentTag = item.pick_tag || (item.is_first_pickable ? "FP" : "Normal");
      const nextTag = cycle[currentTag] || "FP";
      return {
        ...item,
        pick_tag: nextTag,
        is_first_pickable: nextTag === "FP",
      };
    });
    handlePersist(compositions, updated);
  };

  // Obtener campeones de un rol para una compo específica agrupados por Tiers
  const getRoleChampsForComp = (compName: string, role: RoleType, playerName?: string) => {
    const targetPlayer = playerName
      ? PLAYERS_LIST.find((p) => p.name === playerName)
      : PLAYERS_LIST.find((p) => p.role === role);

    if (!targetPlayer) return { player: PLAYERS_LIST[0], S: [], A: [], B: [], C: [] };

    const playerChamps = playerChampions.filter(
      (pc) =>
        pc.jugador === targetPlayer.name &&
        pc.tipos_comp.some((t) => t.trim().toLowerCase() === compName.trim().toLowerCase())
    );

    return {
      player: targetPlayer,
      S: playerChamps.filter((c) => c.tier === "S"),
      A: playerChamps.filter((c) => c.tier === "A"),
      B: playerChamps.filter((c) => c.tier === "B"),
      C: playerChamps.filter((c) => c.tier === "C"),
    };
  };

  // Configuración de las 5 líneas tácticas para la Pizarra Vertical del Coach
  const VERTICAL_BOARD_ROLES: {
    role: RoleType;
    player: string;
    laneTitle: string;
    badgeBg: string;
    textColor: string;
    borderAccent: string;
    headerGradient: string;
    tagline: string;
  }[] = [
    {
      role: "TOP",
      player: "Kaserolo",
      laneTitle: "Toplane (Línea Superior)",
      badgeBg: "bg-amber-950/90 text-amber-300 border-amber-500/50",
      textColor: "text-amber-400",
      borderAccent: "border-amber-500/40 hover:border-amber-500/70",
      headerGradient: "from-amber-950/40 via-zinc-950 to-zinc-950",
      tagline: "Splitpush, tanques de frontline o duelistas de aislamiento",
    },
    {
      role: "JGL",
      player: "Tamudor",
      laneTitle: "Jungle (Jungla & Control)",
      badgeBg: "bg-emerald-950/90 text-emerald-300 border-emerald-500/50",
      textColor: "text-emerald-400",
      borderAccent: "border-emerald-500/40 hover:border-emerald-500/70",
      headerGradient: "from-emerald-950/40 via-zinc-950 to-zinc-950",
      tagline: "Iniciadores, control de mapa, pathing de objetivos y ganks",
    },
    {
      role: "MID",
      player: "Upss",
      laneTitle: "Midlane (Línea Central)",
      badgeBg: "bg-cyan-950/90 text-cyan-300 border-cyan-500/50",
      textColor: "text-cyan-400",
      borderAccent: "border-cyan-500/40 hover:border-cyan-500/70",
      headerGradient: "from-cyan-950/40 via-zinc-950 to-zinc-950",
      tagline: "Magos de control, asesinos, roamers y daño mágico/burst",
    },
    {
      role: "ADC",
      player: "arnoop88",
      laneTitle: "AD Carry (Botlane DPS)",
      badgeBg: "bg-purple-950/90 text-purple-300 border-purple-500/50",
      textColor: "text-purple-400",
      borderAccent: "border-purple-500/40 hover:border-purple-500/70",
      headerGradient: "from-purple-950/40 via-zinc-950 to-zinc-950",
      tagline: "Daño sostenido, escalado a late game y asedio de torres",
    },
    {
      role: "SUPP",
      player: "Liber",
      laneTitle: "Support (Apoyo & Visión)",
      badgeBg: "bg-rose-950/90 text-rose-300 border-rose-500/50",
      textColor: "text-rose-400",
      borderAccent: "border-rose-500/40 hover:border-rose-500/70",
      headerGradient: "from-rose-950/40 via-zinc-950 to-zinc-950",
      tagline: "Hard engage, peel, control de visión y disengage táctico",
    },
  ];

  // Eliminar un campeón de la composición activa
  const handleRemoveChampFromComp = (entryId: string, compName: string) => {
    const updated = playerChampions.map((item) => {
      if (item.id !== entryId) return item;
      const remainingComps = item.tipos_comp.filter(
        (c) => c.trim().toLowerCase() !== compName.trim().toLowerCase()
      );
      return { ...item, tipos_comp: remainingComps };
    });
    handlePersist(compositions, updated);
  };

  // Campeones filtrados para el modal de añadir pick rápido en la pizarra vertical
  const quickAddMatches = useMemo(() => {
    if (!quickAddSearch.trim()) {
      return CHAMPIONS_CATALOG.slice(0, 16);
    }
    const q = quickAddSearch.toLowerCase().replace(/['\s]/g, "");
    return CHAMPIONS_CATALOG.filter((c) => {
      const matchId = c.id.toLowerCase().replace(/['\s]/g, "").includes(q);
      const matchName = c.name.toLowerCase().replace(/['\s]/g, "").includes(q);
      return matchId || matchName;
    }).slice(0, 20);
  }, [quickAddSearch]);

  // Añadir un campeón rápido al rol y a la compo actual
  const handleQuickAddChampion = (champId: string) => {
    if (!quickAddRole || !currentComp) return;
    const player = PLAYERS_LIST.find((p) => p.role === quickAddRole && p.isStarter) || PLAYERS_LIST.find((p) => p.role === quickAddRole);
    if (!player) return;

    const existing = playerChampions.find(
      (pc) => pc.jugador === player.name && pc.campeon_id.toLowerCase() === champId.toLowerCase()
    );

    let updated: PlayerChampionEntry[];
    if (existing) {
      const hasComp = existing.tipos_comp.some((t) => t.toLowerCase() === currentComp.nombre.toLowerCase());
      const newComps = hasComp ? existing.tipos_comp : [...existing.tipos_comp, currentComp.nombre];
      updated = playerChampions.map((pc) =>
        pc.id === existing.id
          ? {
              ...pc,
              tipos_comp: newComps,
              tier: quickAddTier,
              pick_tag: quickAddTag,
              is_first_pickable: quickAddTag === "FP",
            }
          : pc
      );
    } else {
      const newEntry: PlayerChampionEntry = {
        id: `${player.name.toLowerCase()}-${champId.toLowerCase()}-${Date.now()}`,
        jugador: player.name,
        campeon_id: champId,
        tier: quickAddTier,
        tipos_comp: [currentComp.nombre],
        is_first_pickable: quickAddTag === "FP",
        pick_tag: quickAddTag,
      };
      updated = [...playerChampions, newEntry];
    }

    handlePersist(compositions, updated);
    setQuickAddRole(null);
    setQuickAddSearch("");
  };

  // Lista de campeones filtrada para el jugador seleccionado
  const filteredPlayerChamps = useMemo(() => {
    return playerChampions.filter((entry) => {
      if (entry.jugador !== selectedPlayerName) return false;
      if (playerFilterTier !== "ALL" && entry.tier !== playerFilterTier) return false;
      if (playerFilterComp !== "ALL" && !entry.tipos_comp.includes(playerFilterComp)) return false;
      return true;
    });
  }, [playerChampions, selectedPlayerName, playerFilterTier, playerFilterComp]);

  // Campeones sugeridos para el input de autocompletado
  const champSearchResults = useMemo(() => {
    if (!newChampSearch.trim()) return [];
    const q = newChampSearch.toLowerCase().replace(/['\s]/g, "");
    return CHAMPIONS_CATALOG.filter((c) => {
      const matchId = c.id.toLowerCase().replace(/['\s]/g, "").includes(q);
      const matchName = c.name.toLowerCase().replace(/['\s]/g, "").includes(q);
      return matchId || matchName;
    }).slice(0, 8);
  }, [newChampSearch]);

  // Añadir campeón al pool del jugador
  const handleAddChampToPlayer = (champId: string) => {
    const existing = playerChampions.find(
      (pc) => pc.jugador === selectedPlayerName && pc.campeon_id.toLowerCase() === champId.toLowerCase()
    );
    if (existing) {
      alert(`El jugador ${selectedPlayerName} ya tiene a ${champId} en su pool.`);
      return;
    }

    const newEntry: PlayerChampionEntry = {
      id: `${selectedPlayerName.toLowerCase()}-${champId.toLowerCase()}-${Date.now()}`,
      jugador: selectedPlayerName,
      campeon_id: champId,
      tier: newChampTier,
      tipos_comp: newChampComps,
      is_first_pickable: newChampFirstPick,
    };

    const updated = [...playerChampions, newEntry];
    handlePersist(compositions, updated);
    setNewChampSearch("");
    setNewChampComps([]);
  };

  // Modificar Tier de un campeón de jugador
  const handleUpdateTier = (id: string, newTier: "S" | "A" | "B" | "C") => {
    const updated = playerChampions.map((item) =>
      item.id === id ? { ...item, tier: newTier } : item
    );
    handlePersist(compositions, updated);
  };

  // Subir o bajar de Tier rápidamente
  const handleShiftTier = (id: string, direction: "up" | "down") => {
    const order: ("C" | "B" | "A" | "S")[] = ["C", "B", "A", "S"];
    const entry = playerChampions.find((p) => p.id === id);
    if (!entry) return;
    const currentIdx = order.indexOf(entry.tier as any);
    if (currentIdx === -1) return;
    const targetIdx = direction === "up" ? Math.min(order.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
    if (targetIdx !== currentIdx) {
      handleUpdateTier(id, order[targetIdx]);
    }
  };

  // Toggle de composición asignada a un campeón
  const handleToggleChampComp = (id: string, compName: string) => {
    const updated = playerChampions.map((item) => {
      if (item.id !== id) return item;
      const hasComp = item.tipos_comp.includes(compName);
      const newComps = hasComp
        ? item.tipos_comp.filter((c) => c !== compName)
        : [...item.tipos_comp, compName];
      return { ...item, tipos_comp: newComps };
    });
    handlePersist(compositions, updated);
  };

  // Toggle First Pickable
  const handleToggleFirstPick = (id: string) => {
    const updated = playerChampions.map((item) =>
      item.id === id ? { ...item, is_first_pickable: !item.is_first_pickable } : item
    );
    handlePersist(compositions, updated);
  };

  // Eliminar campeón del pool
  const handleDeleteChamp = (id: string) => {
    const updated = playerChampions.filter((item) => item.id !== id);
    handlePersist(compositions, updated);
  };

  // Análisis de draft para la composición seleccionada
  const compDraftAnalysis = useMemo(() => {
    if (!currentComp) return null;

    // Campeones del roster que aplican a esta composición
    const relevantChamps = playerChampions.filter((pc) =>
      pc.tipos_comp.includes(currentComp.nombre)
    );

    // Agrupados por rol del jugador
    const byRole: Record<string, { player: PlayerProfile; champs: PlayerChampionEntry[] }> = {
      TOP: { player: PLAYERS_LIST.find((p) => p.role === "TOP")!, champs: [] },
      JGL: { player: PLAYERS_LIST.find((p) => p.role === "JGL")!, champs: [] },
      MID: { player: PLAYERS_LIST.find((p) => p.role === "MID" && p.isStarter)!, champs: [] },
      ADC: { player: PLAYERS_LIST.find((p) => p.role === "ADC")!, champs: [] },
      SUPP: { player: PLAYERS_LIST.find((p) => p.role === "SUPP" && p.isStarter)!, champs: [] },
    };

    relevantChamps.forEach((entry) => {
      const profile = PLAYERS_LIST.find((p) => p.name === entry.jugador);
      if (profile && byRole[profile.role]) {
        byRole[profile.role].champs.push(entry);
      }
    });

    // Ordenar los picks de cada rol por tier (S > A > B > C)
    const tierWeight: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };
    Object.keys(byRole).forEach((role) => {
      byRole[role].champs.sort((a, b) => (tierWeight[b.tier] || 0) - (tierWeight[a.tier] || 0));
    });

    // First picks seguros: campeones Tier S o A marcados como is_first_pickable o incluidos en first_pick_safe
    const safeFirstPicks = relevantChamps.filter((pc) => {
      const isHighTier = pc.tier === "S" || pc.tier === "A";
      const isMarked = pc.is_first_pickable !== false;
      const isKnownSafe = currentComp.first_pick_safe.some(
        (c) => c.toLowerCase() === pc.campeon_id.toLowerCase()
      );
      return isHighTier && (isMarked || isKnownSafe);
    });

    // Cobertura del equipo (% de posiciones con al menos 1 pick Tier S o A)
    let coveredRolesCount = 0;
    Object.keys(byRole).forEach((role) => {
      const hasHighTier = byRole[role].champs.some((c) => c.tier === "S" || c.tier === "A");
      if (hasHighTier) coveredRolesCount++;
    });

    return {
      byRole,
      safeFirstPicks,
      coveredRolesCount,
    };
  }, [currentComp, playerChampions]);

  // ==========================================
  // SALA DE DRAFT ESTILO DRAFTER.LOL & HISTORIAL
  // ==========================================
  const [draftsHistory, setDraftsHistory] = useState<SavedDraft[]>(loadDraftHistory);
  const [ourSide, setOurSide] = useState<"BLUE" | "RED">("BLUE");
  const [rivalName, setRivalName] = useState<string>("Rival Scrim");
  const [matchResult, setMatchResult] = useState<"VICTORIA" | "DERROTA" | "PENDING">("PENDING");
  const [draftNotes, setDraftNotes] = useState<string>("");
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // 5 Picks y 5 Bans para cada bando
  const [bluePicks, setBluePicks] = useState<string[]>(["", "", "", "", ""]);
  const [blueBans, setBlueBans] = useState<string[]>(["", "", "", "", ""]);
  const [redPicks, setRedPicks] = useState<string[]>(["", "", "", "", ""]);
  const [redBans, setRedBans] = useState<string[]>(["", "", "", "", ""]);

  // Slot actualmente seleccionado para pick/ban
  const [activeSlot, setActiveSlot] = useState<{
    side: "blue" | "red";
    type: "pick" | "ban";
    index: number;
  }>({ side: "blue", type: "pick", index: 0 });

  const [draftSearchInput, setDraftSearchInput] = useState<string>("");

  // Integración de Sala Drafter.lol & Modos de Visualización
  const [drafterRoomUrl, setDrafterRoomUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vl_drafter_room_url") || "";
    }
    return "";
  });
  const [drafterInputUrl, setDrafterInputUrl] = useState<string>("");
  const [drafterArenaMode, setDrafterArenaMode] = useState<"builtin" | "drafter_lol" | "split">("builtin");

  const handleSetDrafterRoomUrl = (url: string) => {
    setDrafterRoomUrl(url);
    if (typeof window !== "undefined") {
      localStorage.setItem("vl_drafter_room_url", url);
    }
  };

  const cleanDrafterIframeUrl = useMemo(() => {
    if (!drafterRoomUrl.trim()) return "";
    let url = drafterRoomUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://drafter.lol/room/${url}`;
    }
    return url;
  }, [drafterRoomUrl]);

  // Secuencia oficial de turnos de draft competitivo (Riot Games / Drafter.lol)
  const DRAFT_SEQUENCE = useMemo(() => [
    { phase: "BANS_1", side: "blue" as const, type: "ban" as const, index: 0, label: "B1 Ban", ourTurn: ourSide === "BLUE" },
    { phase: "BANS_1", side: "red" as const, type: "ban" as const, index: 0, label: "R1 Ban", ourTurn: ourSide === "RED" },
    { phase: "BANS_1", side: "blue" as const, type: "ban" as const, index: 1, label: "B2 Ban", ourTurn: ourSide === "BLUE" },
    { phase: "BANS_1", side: "red" as const, type: "ban" as const, index: 1, label: "R2 Ban", ourTurn: ourSide === "RED" },
    { phase: "BANS_1", side: "blue" as const, type: "ban" as const, index: 2, label: "B3 Ban", ourTurn: ourSide === "BLUE" },
    { phase: "BANS_1", side: "red" as const, type: "ban" as const, index: 2, label: "R3 Ban", ourTurn: ourSide === "RED" },
    { phase: "PICKS_1", side: "blue" as const, type: "pick" as const, index: 0, label: "B1 Pick", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_1", side: "red" as const, type: "pick" as const, index: 0, label: "R1 Pick", ourTurn: ourSide === "RED" },
    { phase: "PICKS_1", side: "red" as const, type: "pick" as const, index: 1, label: "R2 Pick", ourTurn: ourSide === "RED" },
    { phase: "PICKS_1", side: "blue" as const, type: "pick" as const, index: 1, label: "B2 Pick", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_1", side: "blue" as const, type: "pick" as const, index: 2, label: "B3 Pick", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_1", side: "red" as const, type: "pick" as const, index: 2, label: "R3 Pick", ourTurn: ourSide === "RED" },
    { phase: "BANS_2", side: "red" as const, type: "ban" as const, index: 3, label: "R4 Ban", ourTurn: ourSide === "RED" },
    { phase: "BANS_2", side: "blue" as const, type: "ban" as const, index: 3, label: "B4 Ban", ourTurn: ourSide === "BLUE" },
    { phase: "BANS_2", side: "red" as const, type: "ban" as const, index: 4, label: "R5 Ban", ourTurn: ourSide === "RED" },
    { phase: "BANS_2", side: "blue" as const, type: "ban" as const, index: 4, label: "B5 Ban", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_2", side: "red" as const, type: "pick" as const, index: 3, label: "R4 Pick", ourTurn: ourSide === "RED" },
    { phase: "PICKS_2", side: "blue" as const, type: "pick" as const, index: 3, label: "B4 Pick", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_2", side: "blue" as const, type: "pick" as const, index: 4, label: "B5 Pick", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_2", side: "red" as const, type: "pick" as const, index: 4, label: "R5 Pick", ourTurn: ourSide === "RED" },
  ], [ourSide]);

  // Turno actual según los slots llenos
  const currentTurnStep = useMemo(() => {
    return DRAFT_SEQUENCE.find((step) => {
      const val = step.side === "blue"
        ? (step.type === "pick" ? bluePicks[step.index] : blueBans[step.index])
        : (step.type === "pick" ? redPicks[step.index] : redBans[step.index]);
      return !val;
    }) || null;
  }, [DRAFT_SEQUENCE, bluePicks, blueBans, redPicks, redBans]);

  // Asignar rápidamente un campeón desde las 5 columnas del companion táctico a Void Lynx
  const handleQuickLockFromCompanion = (champId: string) => {
    if (allUsedChampions.has(champId.toLowerCase())) {
      alert(`${champId} ya está en la mesa de draft o baneado.`);
      return;
    }
    const targetSide = ourSide === "BLUE" ? "blue" : "red";
    const currentPicks = targetSide === "blue" ? bluePicks : redPicks;
    let targetIdx = -1;
    if (activeSlot.side === targetSide && activeSlot.type === "pick" && !currentPicks[activeSlot.index]) {
      targetIdx = activeSlot.index;
    } else {
      targetIdx = currentPicks.findIndex((p) => !p);
    }

    if (targetIdx === -1) {
      alert("Los 5 picks de Void Lynx ya están asignados.");
      return;
    }

    if (targetSide === "blue") {
      const next = [...bluePicks];
      next[targetIdx] = champId;
      setBluePicks(next);
    } else {
      const next = [...redPicks];
      next[targetIdx] = champId;
      setRedPicks(next);
    }

    const nextEmpty = (targetSide === "blue" ? bluePicks : redPicks).findIndex((p, i) => i > targetIdx && !p);
    if (nextEmpty !== -1) {
      setActiveSlot({ side: targetSide, type: "pick", index: nextEmpty });
    }
  };

  // Todos los campeones ya usados en la mesa de draft
  const allUsedChampions = useMemo(() => {
    const used = new Set<string>();
    [...bluePicks, ...blueBans, ...redPicks, ...redBans].forEach((c) => {
      if (c && c.trim()) used.add(c.toLowerCase());
    });
    return used;
  }, [bluePicks, blueBans, redPicks, redBans]);

  // Asignar campeón al slot activo
  const handleAssignChampion = (champId: string) => {
    const { side, type, index } = activeSlot;
    if (side === "blue") {
      if (type === "pick") {
        const next = [...bluePicks];
        next[index] = champId;
        setBluePicks(next);
      } else {
        const next = [...blueBans];
        next[index] = champId;
        setBlueBans(next);
      }
    } else {
      if (type === "pick") {
        const next = [...redPicks];
        next[index] = champId;
        setRedPicks(next);
      } else {
        const next = [...redBans];
        next[index] = champId;
        setRedBans(next);
      }
    }
    setDraftSearchInput("");

    // Avanzar automáticamente al siguiente slot si era un pick
    if (type === "pick" && index < 4) {
      setActiveSlot({ side, type, index: index + 1 });
    }
  };

  const handleClearSlot = (side: "blue" | "red", type: "pick" | "ban", index: number) => {
    if (side === "blue") {
      if (type === "pick") {
        const next = [...bluePicks];
        next[index] = "";
        setBluePicks(next);
      } else {
        const next = [...blueBans];
        next[index] = "";
        setBlueBans(next);
      }
    } else {
      if (type === "pick") {
        const next = [...redPicks];
        next[index] = "";
        setRedPicks(next);
      } else {
        const next = [...redBans];
        next[index] = "";
        setRedBans(next);
      }
    }
  };

  // Limpiar toda la mesa
  const handleResetDraftBoard = () => {
    setBluePicks(["", "", "", "", ""]);
    setBlueBans(["", "", "", "", ""]);
    setRedPicks(["", "", "", "", ""]);
    setRedBans(["", "", "", "", ""]);
    setActiveSlot({ side: "blue", type: "pick", index: 0 });
    setDraftSearchInput("");
  };

  // Guardar draft en el historial
  const handleSaveCurrentDraft = () => {
    const newDraft: SavedDraft = {
      id: `draft-${Date.now()}`,
      rival: rivalName.trim() || "Rival Desconocido",
      nuestro_lado: ourSide,
      composicion_id: currentComp.nombre,
      resultado: matchResult,
      blue_picks: bluePicks,
      blue_bans: blueBans,
      red_picks: redPicks,
      red_bans: redBans,
      notas: draftNotes,
      created_at: new Date().toISOString(),
    };

    const updated = saveDraftToStorage(newDraft);
    setDraftsHistory(updated);
    syncDraftWithApi(newDraft);
    alert(`Draft contra ${newDraft.rival} guardado correctamente en el historial.`);
  };

  // Cargar draft guardado en la mesa
  const handleLoadSavedDraft = (draft: SavedDraft) => {
    setRivalName(draft.rival);
    setOurSide(draft.nuestro_lado);
    setMatchResult(draft.resultado);
    setDraftNotes(draft.notas || "");
    setBluePicks(draft.blue_picks || ["", "", "", "", ""]);
    setBlueBans(draft.blue_bans || ["", "", "", "", ""]);
    setRedPicks(draft.red_picks || ["", "", "", "", ""]);
    setRedBans(draft.red_bans || ["", "", "", "", ""]);
    const compFound = compositions.find((c) => c.nombre === draft.composicion_id);
    if (compFound) setSelectedCompId(compFound.id);
    setShowHistoryModal(false);
  };

  // Eliminar draft del historial
  const handleDeleteSavedDraft = (id: string) => {
    if (window.confirm("¿Seguro que quieres eliminar este draft del registro histórico?")) {
      const updated = deleteDraftFromStorage(id);
      setDraftsHistory(updated);
    }
  };

  // Detección de counters en el bando enemigo
  const enemyPicks = ourSide === "BLUE" ? redPicks : bluePicks;
  const enemyCountersDetected = useMemo(() => {
    if (!currentComp) return [];
    return enemyPicks.filter((pick) => {
      if (!pick) return false;
      return currentComp.counters_campeones.some(
        (c) => c.toLowerCase() === pick.toLowerCase()
      );
    });
  }, [currentComp, enemyPicks]);

  // Sugerencias selectivas para Void Lynx: Solo Tier S prioritarios (máximo 4 sugerencias clave)
  const voidLynxSuggestions = useMemo(() => {
    if (!currentComp) return [];
    return playerChampions
      .filter((pc) => {
        if (!pc.tipos_comp.includes(currentComp.nombre)) return false;
        if (allUsedChampions.has(pc.campeon_id.toLowerCase())) return false;
        return pc.tier === "S";
      })
      .slice(0, 4);
  }, [currentComp, playerChampions, allUsedChampions]);

  // Campeones filtrados para el buscador rápido del draft
  const draftSearchMatches = useMemo(() => {
    if (!draftSearchInput.trim()) return [];
    const q = draftSearchInput.toLowerCase().replace(/['\s]/g, "");
    return CHAMPIONS_CATALOG.filter((c) => {
      if (allUsedChampions.has(c.id.toLowerCase())) return false;
      const matchId = c.id.toLowerCase().replace(/['\s]/g, "").includes(q);
      const matchName = c.name.toLowerCase().replace(/['\s]/g, "").includes(q);
      return matchId || matchName;
    }).slice(0, 10);
  }, [draftSearchInput, allUsedChampions]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-purple-600 selection:text-white pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-purple-900/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs uppercase tracking-wider group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Volver a la Web</span>
            </Link>
            <div className="h-4 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-3">
              <img
                src={newLogo}
                alt="Void Lynx"
                className="h-8 w-8 object-contain brightness-[2.5]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm tracking-widest text-white uppercase">
                    STAFF TACTICAL HUB
                  </span>
                  <span className="bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-mono uppercase">
                    Void Lynx Coaching
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Estado de guardado y controles */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              {saveStatus === "synced" && (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Sincronizado
                </span>
              )}
              {saveStatus === "saving" && (
                <span className="flex items-center gap-1.5 text-amber-400 animate-pulse">
                  <Sparkles className="h-3.5 w-3.5" /> Guardando...
                </span>
              )}
            </div>

            <button
              onClick={handleReset}
              title="Restablecer datos originales del Excel"
              className="text-zinc-500 hover:text-rose-400 p-1.5 rounded transition-colors text-xs flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Restablecer Excel</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-white/5 bg-zinc-950/60 px-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl gap-2 sm:gap-6 overflow-x-auto py-2 scrollbar-none">
            <button
              onClick={() => setActiveTab("drafter")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                activeTab === "drafter"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Crosshair className="h-4 w-4" />
              <span>1. Asistente de Draft Táctico</span>
            </button>

            <button
              onClick={() => setActiveTab("compositions")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                activeTab === "compositions"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>2. Tipos de Composiciones & Counters</span>
            </button>

            <button
              onClick={() => setActiveTab("players")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                activeTab === "players"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>3. Pools de Jugadores & Tiers</span>
            </button>

            <button
              onClick={() => setActiveTab("live")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                activeTab === "live"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Swords className="h-4 w-4" />
              <span>4. Sala de Draft en Vivo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        {/* ========================================================================= */}
        {/* TAB 1: ASISTENTE DE DRAFT TÁCTICO */}
        {/* ========================================================================= */}
        {activeTab === "drafter" && compDraftAnalysis && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Selector de Composición */}
            <div className="bg-zinc-950/80 border border-purple-900/40 rounded-xl p-5 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white flex items-center gap-3">
                    <Crosshair className="h-6 w-6 text-purple-400" />
                    <span>Planificación de Draft por Composición</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Selecciona qué composición táctica va a ejecutar Void Lynx para obtener los First Picks seguros, las advertencias de picks a ciegas y los counters a banear.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="text-xs text-zinc-400 uppercase font-mono">Cobertura del Equipo:</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono ${
                      compDraftAnalysis.coveredRolesCount === 5
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-600/40"
                        : "bg-amber-950 text-amber-300 border border-amber-600/40"
                    }`}
                  >
                    {compDraftAnalysis.coveredRolesCount}/5 Roles con S/A
                  </span>
                </div>
              </div>

              {/* Botones de Selección Rápida de Composición — Más Grandes, Fáciles y Sin Efecto de Bola */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                {compositions.map((comp) => {
                  const isSelected = comp.id === currentComp.id;
                  const isHigh = comp.prioridad.includes("Alta");
                  const isMed = comp.prioridad.includes("Media");

                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedCompId(comp.id)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[96px] cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-br from-purple-900/70 via-purple-950/90 to-zinc-950 border-purple-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.45)] ring-2 ring-purple-400/80 scale-[1.02]"
                          : "bg-zinc-950/80 border-zinc-800/90 text-zinc-300 hover:border-purple-500/60 hover:bg-zinc-900/90 hover:scale-[1.01]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-display font-black text-base sm:text-lg uppercase tracking-wide text-white leading-tight">
                          {comp.nombre}
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-purple-300 bg-purple-950/90 border border-purple-500/50 px-2 py-0.5 rounded-full shrink-0">
                            <Check className="h-3 w-3 text-purple-400" /> ACTIVA
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/5">
                        <span className="text-[11px] font-mono text-zinc-400 font-medium truncate">
                          {comp.enfoque}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isHigh
                              ? "bg-rose-950/90 text-rose-300 border border-rose-500/50"
                              : isMed
                              ? "bg-amber-950/90 text-amber-300 border border-amber-500/50"
                              : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                          }`}
                        >
                          {comp.prioridad.replace(" Prioridad", "")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Ficha Resumen de la Composición Seleccionada con Counters Destacados (Solo fuera de Pizarra Vertical) */}
              {drafterViewMode !== "vertical" && (
                <div className="mt-6 pt-5 border-t border-purple-900/40 space-y-4">
                  {/* Fila 1: Concepto, Enfoque y Prioridad */}
                  <div className="flex flex-col lg:flex-row gap-4 items-start justify-between bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
                    <div className="flex-1">
                      <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                        <Crosshair className="h-4 w-4 text-purple-400" />
                        CONCEPTO TÁCTICO & WIN CONDITION:
                      </span>
                      <p className="text-sm sm:text-base text-zinc-100 leading-relaxed font-sans font-medium">
                        {currentComp.descripcion}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs font-mono shrink-0">
                      <div className="bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-800 shadow">
                        <span className="text-zinc-500 block text-[10px] uppercase font-bold">ENFOQUE:</span>
                        <span className="text-white font-bold text-xs sm:text-sm">{currentComp.enfoque}</span>
                      </div>
                      <div className="bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-800 shadow">
                        <span className="text-zinc-500 block text-[10px] uppercase font-bold">PRIORIDAD DRAFT:</span>
                        <span className="text-amber-400 font-bold text-xs sm:text-sm">{currentComp.prioridad}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fila 2: MÓDULO DESTACADO DE COUNTERS (AMENAZAS Y CAMPEONES A EVITAR) */}
                  <div className="rounded-2xl border-2 border-rose-500/50 bg-gradient-to-br from-rose-950/40 via-zinc-950 to-zinc-950 p-5 sm:p-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-rose-900/40">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-sm sm:text-base font-display font-extrabold text-rose-200 uppercase tracking-wider block">
                            COUNTERS DIRECTOS & AMENAZAS PARA "{currentComp.nombre}"
                          </span>
                          <span className="text-xs text-rose-300/70 font-mono">
                            Peligros clave que desmontan la estrategia o castigan la composición
                          </span>
                        </div>
                      </div>

                      {/* Bans sugeridos rápidos */}
                      {currentComp.bans_recomendados?.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-400 uppercase font-bold">Bans recomendados:</span>
                          <div className="flex items-center gap-1.5">
                            {currentComp.bans_recomendados.map((b) => (
                              <span
                                key={b}
                                className="bg-rose-950 text-rose-200 border border-rose-500/60 font-mono font-bold text-xs px-2.5 py-1 rounded-lg shadow"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-black/50 border border-rose-900/40 rounded-xl p-3.5 mb-4">
                      <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
                        {currentComp.counters_descripcion || "No se han definido counters directos para esta composición."}
                      </p>
                    </div>

                    {/* Campeones Counter con retratos grandes y legibles */}
                    {currentComp.counters_campeones.length > 0 && (
                      <div>
                        <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-2.5">
                          Campeones rivales peligrosos a denegar o banear ({currentComp.counters_campeones.length}):
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {currentComp.counters_campeones.map((cId) => (
                            <div
                              key={cId}
                              className="group flex items-center gap-3 bg-zinc-900/90 hover:bg-rose-950/60 border border-rose-500/40 hover:border-rose-400 rounded-xl p-2 pr-4 transition-all shadow-lg hover:scale-105"
                            >
                              <img
                                src={getChampionAvatar(cId)}
                                alt={cId}
                                className="h-12 w-12 rounded-lg object-cover border-2 border-rose-500/50 group-hover:border-rose-400 shadow shrink-0"
                              />
                              <div>
                                <span className="font-bold text-sm text-white block leading-tight">{cId}</span>
                                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                  <AlertTriangle className="h-3 w-3 shrink-0" /> Counter
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* BARRA DE HERRAMIENTAS Y VISTAS: PIZARRA VERTICAL vs MATRIZ EXCEL 8 COMPOS vs CARDS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/90 border border-purple-900/40 p-4 rounded-xl shadow-xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setDrafterViewMode("vertical")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                      drafterViewMode === "vertical"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                    <span>Pizarra Vertical ({currentComp.nombre})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrafterViewMode("matrix")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                      drafterViewMode === "matrix"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Table className="h-4 w-4" />
                    <span>Matriz General (8 Compos)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrafterViewMode("cards")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                      drafterViewMode === "cards"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Apertura & First Picks</span>
                  </button>
                </div>

                {drafterViewMode === "matrix" && (
                  <button
                    type="button"
                    onClick={() => setMatrixShowAll(!matrixShowAll)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-mono font-semibold transition-colors ${
                      matrixShowAll
                        ? "bg-purple-950 text-purple-200 border-purple-500/50"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    {matrixShowAll ? "✓ Vista Panorámica (Todas las 8 Compos)" : `Solo ${currentComp.nombre}`}
                  </button>
                )}
              </div>

              {/* Botones de acción: Editar Compo & Crear Compo */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => handleOpenEditComp(currentComp)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-purple-500 text-zinc-200 text-xs font-semibold transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5 text-purple-400" />
                  <span>Editar {currentComp.nombre}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenCreateComp}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nueva Composición</span>
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* PIZARRA TÁCTICA VERTICAL (DEDICADA A LA COMPOSICIÓN ACTIVA) */}
            {/* ========================================================= */}
            {drafterViewMode === "vertical" && (
              <div className="space-y-6">
                {/* ========================================================= */}
                {/* 1. INFORMACIÓN GENERAL ARRIBA (5 BLOQUES DE LA MATRIZ)     */}
                {/* ========================================================= */}
                <div className="bg-zinc-950 border border-purple-900/40 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
                  {/* Fila de Título y Fases */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        <Crosshair className="h-4 w-4" /> GUÍA ESTRATÉGICA DE COMPOSICIÓN & DRAFT
                      </span>
                      <span className="bg-purple-900/60 border border-purple-400/40 text-purple-200 text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
                        {currentComp.nombre}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <div className="bg-black/60 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <span className="text-zinc-500 text-[10px] uppercase font-bold">FASE 1 (B1 / R1-R2):</span>
                        <span className="text-emerald-400 font-black">
                          {VERTICAL_BOARD_ROLES.filter(r => (currentComp.role_priorities?.[r.role] || "Media") === "Alta").map(r => r.role).join(", ") || "Según bans"}
                        </span>
                      </div>
                      <div className="bg-black/60 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <span className="text-zinc-500 text-[10px] uppercase font-bold">GUARDAR R4-R5:</span>
                        <span className="text-rose-400 font-black">
                          {VERTICAL_BOARD_ROLES.filter(r => (currentComp.role_priorities?.[r.role] || "Media") === "Baja").map(r => r.role).join(", ") || "Counterpick"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Los 5 Bloques Informativos de la Matriz (1 fila panorámica) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
                    {/* BLOQUE 1: COMPOSICIÓN TÁCTICA */}
                    <div className="flex flex-col justify-between p-4 rounded-xl bg-zinc-900/60 border border-purple-800/40 shadow-inner">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                            COMPOSICIÓN TÁCTICA
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenEditComp(currentComp)}
                            title="Editar detalles de esta composición"
                            className="p-1 rounded text-zinc-400 hover:text-purple-300 hover:bg-purple-950/60 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <h2 className="text-xl font-display font-black text-white tracking-wide uppercase">
                          {currentComp.nombre}
                        </h2>
                        <span className="inline-block mt-0.5 text-xs font-mono font-semibold text-zinc-400">
                          {currentComp.enfoque || "Mid / Late Game"}
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
                        Void Lynx Draft System
                      </div>
                    </div>

                    {/* BLOQUE 2: PRIORIDAD DRAFT */}
                    <div className="flex flex-col justify-between p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 shadow-inner">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                          PRIORIDAD DRAFT
                        </span>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rose-500/60 bg-rose-950/50 text-rose-300 font-bold text-xs shadow-md shadow-rose-950/40">
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                          <span>{currentComp.prioridad || "Alta Prioridad"}</span>
                        </div>
                      </div>

                      {currentComp.first_pick_safe && currentComp.first_pick_safe.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-zinc-800/80">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block mb-1">
                            FP Seguros:
                          </span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {currentComp.first_pick_safe.map((c) => (
                              <span key={c} className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BLOQUE 3: CONCEPTO / OBJETIVO CLAVE */}
                    <div className="flex flex-col p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 shadow-inner">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-purple-400" /> CONCEPTO / OBJETIVO CLAVE
                      </span>
                      <p className="text-xs text-zinc-300 font-normal leading-relaxed overflow-y-auto max-h-[140px] pr-1">
                        {currentComp.descripcion || "Sin descripción táctica registrada."}
                      </p>
                    </div>

                    {/* BLOQUE 4: COUNTERS DIRECTOS */}
                    <div className="flex flex-col p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 shadow-inner">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" /> COUNTERS DIRECTOS
                      </span>
                      <p className="text-xs text-zinc-300 font-normal leading-relaxed overflow-y-auto max-h-[90px] pr-1">
                        {currentComp.counters_descripcion || "Amenazas de iniciación frontal directa o asedio split."}
                      </p>
                      {currentComp.bans_recomendados && currentComp.bans_recomendados.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-rose-900/40">
                          <span className="text-[9px] font-mono font-bold text-rose-300 uppercase block mb-1">
                            Bans Sugeridos:
                          </span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {currentComp.bans_recomendados.map((b) => (
                              <span key={b} className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-950/90 border border-rose-600/50 text-rose-200">
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BLOQUE 5: COUNTERS (CAMPEONES) */}
                    <div className="flex flex-col p-4 rounded-xl bg-zinc-900/60 border border-rose-900/40 shadow-inner">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                          <Shield className="h-3.5 w-3.5 text-rose-400" /> COUNTERS (CAMPEONES)
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-950 border border-rose-500/40 text-rose-300">
                          {(currentComp.counters_campeones || []).length}
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto max-h-[140px] pr-1">
                        {(currentComp.counters_campeones || []).length === 0 ? (
                          <div className="text-xs text-zinc-500 italic py-3 text-center">
                            Sin campeones counter
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-1.5">
                            {currentComp.counters_campeones.map((cId) => (
                              <div
                                key={cId}
                                className="group relative flex flex-col items-center bg-black/60 border border-rose-500/50 rounded-lg p-1 shadow hover:border-rose-400 transition-all"
                                title={`Counter: ${cId}`}
                              >
                                <img
                                  src={getChampionAvatar(cId)}
                                  alt={cId}
                                  className="h-9 w-9 rounded object-cover border border-rose-500/40 group-hover:scale-105 transition-transform"
                                />
                                <span className="text-[9px] font-bold text-rose-200 mt-0.5 truncate max-w-[50px] text-center leading-tight">
                                  {cId}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenEditComp(currentComp)}
                        className="mt-2 w-full py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 hover:border-rose-400 text-rose-300 text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="h-3 w-3" /> Modificar Counters
                      </button>
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* 2. PICKS ABAJO: 5 COLUMNAS VERTICALES GRANDES             */}
                {/* TOP - JNGL - MID - ADC - SUPP                             */}
                {/* ========================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 xl:gap-4 items-stretch">
                  {VERTICAL_BOARD_ROLES.map((laneConfig) => {
                    const roleData = getRoleChampsForComp(currentComp.nombre, laneConfig.role, laneConfig.player);
                    const prio = currentComp.role_priorities?.[laneConfig.role] || "Media";

                    // Warnings for this role
                    const roleWarnings = (currentComp.no_first_pick_reasons || []).filter((w) => {
                      const champ = findChampion(w.champ);
                      if (champ && champ.roles.includes(laneConfig.role)) return true;
                      return [...roleData.S, ...roleData.A, ...roleData.B].some(
                        (e) => e.campeon_id.toLowerCase() === w.champ.toLowerCase()
                      );
                    });

                    // Direct counters from comp that match this role
                    const roleCounters = (currentComp.counters_campeones || []).filter((cId) => {
                      const champ = findChampion(cId);
                      return champ && champ.roles.includes(laneConfig.role);
                    });

                    // Role display name: JNGL for JGL
                    const displayRoleName = laneConfig.role === "JGL" ? "JNGL" : laneConfig.role;

                    const isAlta = prio === "Alta";
                    const isMedia = prio === "Media";
                    const isBaja = prio === "Baja";

                    return (
                      <div
                        key={laneConfig.role}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950/90 flex flex-col justify-between overflow-hidden shadow-xl transition-all hover:border-zinc-700"
                      >
                        {/* CONTENIDO SUPERIOR Y TIERS */}
                        <div className="flex-1 flex flex-col">
                          {/* CABECERA DE LA COLUMNA DE ROL */}
                          <div className="p-3.5 bg-zinc-900/60 border-b border-zinc-800">
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-black/70 border border-zinc-700/60 shadow-sm">
                                  <RoleIconOnly role={laneConfig.role} size="sm" />
                                </div>
                                <span className={`px-2 py-0.5 rounded text-xs font-mono font-black uppercase tracking-wider ${laneConfig.badgeBg}`}>
                                  {displayRoleName}
                                </span>
                              </div>
                              <span className="font-display font-black text-sm text-white tracking-wide truncate">
                                {laneConfig.player}
                              </span>
                            </div>

                            {/* BOTÓN PRIO LIMPIO ESTILO MATRIZ OFICIAL */}
                            <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-zinc-800/60">
                              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                                PRIO:
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCycleRolePriority(currentComp.id, laneConfig.role)}
                                title="Haz clic para alternar: Baja (Verde) → Media (Amarillo) → Alta (Rojo)"
                                className={`px-3 py-1 rounded-md text-xs font-mono font-black uppercase tracking-wider border transition-all cursor-pointer shadow-sm ${
                                  isAlta
                                    ? "bg-rose-950/40 border-rose-500/80 text-rose-300 hover:bg-rose-900/60"
                                    : isMedia
                                    ? "bg-amber-950/40 border-amber-500/80 text-amber-300 hover:bg-amber-900/60"
                                    : "bg-emerald-950/40 border-emerald-500/80 text-emerald-300 hover:bg-emerald-900/60"
                                }`}
                              >
                                {prio.toUpperCase()}
                              </button>
                            </div>
                          </div>

                          {/* TIERS DE PICKS (S, A, B) */}
                          <div className="p-3 space-y-3.5 flex-1">
                            {[
                              { tierName: "TIER S", list: roleData.S, badgeStyle: "bg-amber-500/20 text-amber-400 border-amber-500/40" },
                              { tierName: "TIER A", list: roleData.A, badgeStyle: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
                              { tierName: "TIER B", list: roleData.B, badgeStyle: "bg-sky-500/20 text-sky-300 border-sky-500/40" },
                            ].map(({ tierName, list, badgeStyle }, tIdx) => (
                              <div key={tierName} className={`space-y-1.5 ${tIdx > 0 ? "pt-2.5 border-t border-zinc-800/60" : ""}`}>
                                <div className="flex items-center justify-between">
                                  <span className={`text-[11px] font-black px-2 py-0.5 rounded border shadow-sm ${badgeStyle}`}>
                                    {tierName}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono">
                                    ({list.length})
                                  </span>
                                </div>

                                {list.length === 0 ? (
                                  <div className="text-[10px] text-zinc-600 italic py-2 text-center bg-zinc-900/20 rounded-lg border border-dashed border-zinc-800">
                                    -
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-2">
                                    {list.map((entry) => {
                                      const tag = entry.pick_tag || (entry.is_first_pickable ? "FP" : undefined);
                                      const isFP = tag === "FP";
                                      const isLP = tag === "LP";
                                      const isRisky = tag === "Risky";

                                      return (
                                        <div
                                          key={entry.id}
                                          className="group relative flex flex-col items-center p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/90 hover:border-purple-500/50 transition-all cursor-pointer shadow-sm"
                                        >
                                          {/* Avatar con Tag en la esquina superior derecha */}
                                          <div className="relative">
                                            <img
                                              src={getChampionAvatar(entry.campeon_id)}
                                              alt={entry.campeon_id}
                                              className="h-11 w-11 sm:h-12 sm:w-12 rounded-lg object-cover border border-zinc-700/80 group-hover:border-purple-400 transition-colors shadow"
                                            />

                                            {/* Badge FP / LP / Risky en la esquina superior derecha */}
                                            {isFP && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleCyclePickTag(entry.id); }}
                                                title="First Pick Seguro (Clic para cambiar)"
                                                className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-emerald-500 text-black text-[9px] font-mono font-black shadow border border-emerald-300 leading-none cursor-pointer hover:scale-110 transition-transform"
                                              >
                                                FP
                                              </button>
                                            )}
                                            {isLP && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleCyclePickTag(entry.id); }}
                                                title="Last Pick R4/R5 (Clic para cambiar)"
                                                className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-purple-600 text-white text-[9px] font-mono font-black shadow border border-purple-400 leading-none cursor-pointer hover:scale-110 transition-transform"
                                              >
                                                LP
                                              </button>
                                            )}
                                            {isRisky && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleCyclePickTag(entry.id); }}
                                                title="Pick de Riesgo (Clic para cambiar)"
                                                className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-amber-500 text-black text-[9px] font-mono font-black shadow border border-amber-300 leading-none cursor-pointer hover:scale-110 transition-transform"
                                              >
                                                Risky
                                              </button>
                                            )}
                                            {!tag && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleCyclePickTag(entry.id); }}
                                                title="Asignar tag (FP / LP / Risky)"
                                                className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-zinc-800 text-zinc-500 text-[8px] font-mono opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                                              >
                                                +tag
                                              </button>
                                            )}
                                          </div>

                                          {/* Nombre del Campeón */}
                                          <span className="text-xs font-bold text-zinc-200 mt-1.5 truncate max-w-full text-center leading-tight group-hover:text-white">
                                            {entry.campeon_id}
                                          </span>

                                          {/* Micro-acciones en Hover */}
                                          <div className="absolute inset-0 bg-black/85 backdrop-blur-[1px] rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                                            {tierName !== "TIER S" && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleShiftTier(entry.id, "up"); }}
                                                title="Subir de Tier"
                                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                                              >
                                                <ChevronUp className="h-3.5 w-3.5" />
                                              </button>
                                            )}
                                            {tierName !== "TIER B" && (
                                              <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleShiftTier(entry.id, "down"); }}
                                                title="Bajar de Tier"
                                                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                                              >
                                                <ChevronDown className="h-3.5 w-3.5" />
                                              </button>
                                            )}
                                            <button
                                              type="button"
                                              onClick={(e) => { e.stopPropagation(); handleRemoveChampFromComp(entry.id, currentComp.nombre); }}
                                              title="Quitar de esta compo"
                                              className="p-1 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 transition-colors"
                                            >
                                              <X className="h-3.5 w-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* PIE DE COLUMNA: BOTÓN DE AÑADIR PICK & INTEL DE LÍNEA */}
                        <div className="p-3 pt-0 space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              setQuickAddRole(laneConfig.role);
                              setQuickAddSearch("");
                              setQuickAddTier("S");
                              setQuickAddTag("FP");
                            }}
                            className="w-full py-1.5 px-2 rounded-xl border border-dashed border-zinc-700 hover:border-purple-400 bg-zinc-900/50 hover:bg-purple-950/30 text-zinc-400 hover:text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                          >
                            <Plus className="h-3.5 w-3.5 text-purple-400" />
                            <span>+ Añadir Pick ({displayRoleName})</span>
                          </button>

                          {(roleWarnings.length > 0 || roleCounters.length > 0) && (
                            <div className="p-2 rounded-xl bg-rose-950/20 border border-rose-500/30 text-[10px] space-y-1">
                              <span className="font-bold text-rose-400 flex items-center gap-1 uppercase font-mono text-[9px]">
                                <AlertTriangle className="h-3 w-3" /> Intel de Línea
                              </span>
                              {roleWarnings.slice(0, 1).map((w, idx) => (
                                <p key={idx} className="text-zinc-300 leading-tight">
                                  <strong className="text-rose-300">{w.champ}:</strong> {w.reason}
                                </p>
                              ))}
                              {roleCounters.length > 0 && (
                                <div className="flex items-center gap-1 pt-1 border-t border-rose-900/30 flex-wrap">
                                  <span className="text-zinc-500 text-[9px] font-mono">Counters:</span>
                                  {roleCounters.slice(0, 3).map((cId) => (
                                    <span key={cId} className="text-[9px] font-bold text-rose-300 bg-black/60 px-1 rounded border border-rose-500/40">
                                      {cId}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MATRIZ EXCEL TÁCTICA DE 5 COLUMNAS (ESTILO HOJA DE CÁLCULO) */}
            {/* ========================================================= */}
            {drafterViewMode === "matrix" && (
              <div className="space-y-4">
                {/* Tabla Horizontal Estilo Excel con Counters Grandes y Legibles */}
                <div className="overflow-x-auto rounded-2xl border border-purple-900/30 bg-zinc-950 shadow-2xl">
                  <table className="w-full border-collapse text-left text-xs min-w-[1550px]">
                    <thead>
                      <tr className="bg-zinc-900/90 border-b border-zinc-800 text-[11px] font-mono uppercase tracking-wider text-zinc-300">
                        <th className="p-3.5 w-48 border-r border-zinc-800">COMPOSICIÓN TÁCTICA</th>
                        <th className="p-3.5 w-28 border-r border-zinc-800 text-center">PRIORIDAD DRAFT</th>
                        <th className="p-3.5 w-56 border-r border-zinc-800">CONCEPTO / OBJETIVO CLAVE</th>
                        <th className="p-3.5 w-72 border-r border-zinc-800 text-rose-400">COUNTERS DIRECTOS</th>
                        <th className="p-3.5 w-80 border-r border-zinc-800 text-rose-400">COUNTERS (CAMPEONES)</th>
                        <th className="p-2 w-16 border-r border-zinc-800 text-center font-bold text-zinc-400">
                          TIER (★ FP)
                        </th>
                        <th className="p-3 w-48 border-r border-zinc-800 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold">
                            <RoleIconOnly role="TOP" size="sm" />
                            <span>TOP - Kaserolo</span>
                          </div>
                        </th>
                        <th className="p-3 w-48 border-r border-zinc-800 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                            <RoleIconOnly role="JGL" size="sm" />
                            <span>JGL - Tamudor</span>
                          </div>
                        </th>
                        <th className="p-3 w-48 border-r border-zinc-800 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-cyan-400 font-bold">
                            <RoleIconOnly role="MID" size="sm" />
                            <span>MID - Upss</span>
                          </div>
                        </th>
                        <th className="p-3 w-48 border-r border-zinc-800 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-purple-400 font-bold">
                            <RoleIconOnly role="ADC" size="sm" />
                            <span>ADC - arnoop88</span>
                          </div>
                        </th>
                        <th className="p-3 w-48 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold">
                            <RoleIconOnly role="SUPP" size="sm" />
                            <span>SUPP - Liber</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(matrixShowAll ? compositions : [currentComp]).map((comp, compIdx) => {
                        const topData = getRoleChampsForComp(comp.nombre, "TOP", "Kaserolo");
                        const jglData = getRoleChampsForComp(comp.nombre, "JGL", "Tamudor");
                        const midData = getRoleChampsForComp(comp.nombre, "MID", "Upss");
                        const adcData = getRoleChampsForComp(comp.nombre, "ADC", "arnoop88");
                        const suppData = getRoleChampsForComp(comp.nombre, "SUPP", "Liber");

                        const roleCols = [
                          { role: "TOP" as RoleType, data: topData },
                          { role: "JGL" as RoleType, data: jglData },
                          { role: "MID" as RoleType, data: midData },
                          { role: "ADC" as RoleType, data: adcData },
                          { role: "SUPP" as RoleType, data: suppData },
                        ];

                        return (
                          <React.Fragment key={comp.id}>
                            {/* FILA 1: PRIO */}
                            <tr className={`border-t-2 border-purple-900/50 ${compIdx % 2 === 0 ? "bg-black/40" : "bg-zinc-950"}`}>
                              {/* COL 1: Composición */}
                              <td rowSpan={4} className="p-4 align-top border-r border-zinc-800 bg-zinc-950/70">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-display font-extrabold text-sm text-white tracking-wide uppercase">
                                      {comp.nombre}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditComp(comp)}
                                      title="Editar composición"
                                      className="text-zinc-500 hover:text-purple-400 p-1 rounded hover:bg-zinc-800 transition-colors"
                                    >
                                      <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <span className="text-[10px] font-mono text-zinc-500 block">
                                    {comp.enfoque}
                                  </span>
                                  {comp.id !== currentComp.id && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedCompId(comp.id)}
                                      className="text-[10px] text-purple-400 hover:text-purple-300 font-mono font-semibold"
                                    >
                                      Seleccionar →
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* COL 2: Prioridad */}
                              <td rowSpan={4} className="p-3 align-top border-r border-zinc-800 bg-zinc-950/50 text-center">
                                <span
                                  className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                    comp.prioridad.includes("Alta")
                                      ? "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                                      : comp.prioridad.includes("Media")
                                      ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                  }`}
                                >
                                  {comp.prioridad}
                                </span>
                              </td>

                              {/* COL 3: Concepto */}
                              <td rowSpan={4} className="p-3.5 align-top border-r border-zinc-800 text-xs text-zinc-300 leading-relaxed bg-zinc-950/40">
                                {comp.descripcion}
                              </td>

                              {/* COL 4: Counters Directos (Texto Destacado en Rojo) */}
                              <td rowSpan={4} className="p-4 align-top border-r border-zinc-800 bg-rose-950/25 text-rose-200">
                                <div className="flex items-start gap-2.5">
                                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                                  <p className="text-xs text-rose-100 font-medium leading-relaxed">
                                    {comp.counters_descripcion}
                                  </p>
                                </div>
                              </td>

                              {/* COL 5: Counters (Campeones) — Retratos Grandes y Legibles */}
                              <td rowSpan={4} className="p-4 align-top border-r border-zinc-800 bg-rose-950/15">
                                <div className="flex flex-wrap gap-2.5">
                                  {comp.counters_campeones.map((cId) => (
                                    <div
                                      key={cId}
                                      title={`Counter: ${cId}`}
                                      className="group flex flex-col items-center bg-zinc-900 border-2 border-rose-500/50 hover:border-rose-400 rounded-xl p-2 transition-all shadow-md hover:scale-105"
                                    >
                                      <img
                                        src={getChampionAvatar(cId)}
                                        alt={cId}
                                        className="h-12 w-12 rounded-lg object-cover shadow border border-rose-500/40"
                                      />
                                      <span className="text-[11px] font-mono font-bold text-rose-200 mt-1 max-w-[56px] truncate text-center">
                                        {cId}
                                      </span>
                                    </div>
                                  ))}
                                  {comp.counters_campeones.length === 0 && (
                                    <span className="text-xs text-zinc-500 italic">Sin campeones asignados</span>
                                  )}
                                </div>
                              </td>

                              {/* COL 6: TIER LABEL (PRIO) */}
                              <td className="p-2 border-r border-zinc-800 text-center font-mono font-bold text-[10px] text-zinc-400 bg-zinc-900/60">
                                PRIO
                              </td>

                              {/* 5 COLUMNAS DE ROLES: FILA PRIO */}
                              {roleCols.map(({ role }) => {
                                const prio = comp.role_priorities?.[role] || "Media";
                                return (
                                  <td
                                    key={role}
                                    className="p-2 border-r border-zinc-800 last:border-r-0 text-center bg-zinc-900/30"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleCycleRolePriority(comp.id, role)}
                                      title="Clic para cambiar prioridad de pickeo (Baja -> Media -> Alta)"
                                      className={`w-full py-1 px-2 rounded font-mono text-[10px] font-bold uppercase transition-all shadow ${
                                        prio === "Alta"
                                          ? "bg-rose-950/90 text-rose-300 border border-rose-500/60 hover:bg-rose-900/80"
                                          : prio === "Media"
                                          ? "bg-amber-950/90 text-amber-300 border border-amber-500/60 hover:bg-amber-900/80"
                                          : "bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 hover:bg-emerald-900/80"
                                      }`}
                                    >
                                      {prio}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>

                            {/* FILA 2: TIER S */}
                            <tr className="border-t border-zinc-800/60">
                              <td className="p-2 border-r border-zinc-800 text-center font-mono font-extrabold text-xs text-amber-400 bg-amber-950/20">
                                S
                              </td>
                              {roleCols.map(({ role, data }) => (
                                <td key={role} className="p-2 border-r border-zinc-800 last:border-r-0 align-top bg-black/20">
                                  <div className="flex flex-wrap gap-1.5 min-h-[38px] items-center">
                                    {data.S.length > 0 ? (
                                      data.S.map((entry) => {
                                        const champ = findChampion(entry.campeon_id);
                                        const isFp = entry.pick_tag === "FP" || (!entry.pick_tag && entry.is_first_pickable !== false);
                                        const isLp = entry.pick_tag === "LP";
                                        const isRisky = entry.pick_tag === "Risky";
                                        return (
                                          <div
                                            key={entry.id}
                                            onClick={() => handleCyclePickTag(entry.id)}
                                            title={`${champ?.name || entry.campeon_id} (${entry.tier}) — Clic para alternar tag (FP/LP/Risky)`}
                                            className="relative group cursor-pointer"
                                          >
                                            <img
                                              src={getChampionAvatar(entry.campeon_id)}
                                              alt={entry.campeon_id}
                                              className="h-9 w-9 rounded-md object-cover border border-amber-500/40 group-hover:border-amber-400 shadow group-hover:scale-105 transition-all"
                                            />
                                            {isFp && (
                                              <span className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                FP
                                              </span>
                                            )}
                                            {isLp && (
                                              <span className="absolute -top-1 -right-1 bg-rose-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                LP
                                              </span>
                                            )}
                                            {isRisky && (
                                              <span className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-mono font-bold text-black px-1 rounded shadow">
                                                Risky
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <span className="text-[10px] text-zinc-650 font-mono italic">-</span>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>

                            {/* FILA 3: TIER A */}
                            <tr className="border-t border-zinc-800/60">
                              <td className="p-2 border-r border-zinc-800 text-center font-mono font-extrabold text-xs text-purple-300 bg-purple-950/20">
                                A
                              </td>
                              {roleCols.map(({ role, data }) => (
                                <td key={role} className="p-2 border-r border-zinc-800 last:border-r-0 align-top bg-black/20">
                                  <div className="flex flex-wrap gap-1.5 min-h-[38px] items-center">
                                    {data.A.length > 0 ? (
                                      data.A.map((entry) => {
                                        const champ = findChampion(entry.campeon_id);
                                        const isFp = entry.pick_tag === "FP" || (!entry.pick_tag && entry.is_first_pickable !== false);
                                        const isLp = entry.pick_tag === "LP";
                                        const isRisky = entry.pick_tag === "Risky";
                                        return (
                                          <div
                                            key={entry.id}
                                            onClick={() => handleCyclePickTag(entry.id)}
                                            title={`${champ?.name || entry.campeon_id} (${entry.tier}) — Clic para alternar tag (FP/LP/Risky)`}
                                            className="relative group cursor-pointer"
                                          >
                                            <img
                                              src={getChampionAvatar(entry.campeon_id)}
                                              alt={entry.campeon_id}
                                              className="h-9 w-9 rounded-md object-cover border border-purple-500/40 group-hover:border-purple-400 shadow group-hover:scale-105 transition-all"
                                            />
                                            {isFp && (
                                              <span className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                FP
                                              </span>
                                            )}
                                            {isLp && (
                                              <span className="absolute -top-1 -right-1 bg-rose-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                LP
                                              </span>
                                            )}
                                            {isRisky && (
                                              <span className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-mono font-bold text-black px-1 rounded shadow">
                                                Risky
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <span className="text-[10px] text-zinc-650 font-mono italic">-</span>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>

                            {/* FILA 4: TIER B */}
                            <tr className="border-t border-zinc-800/60">
                              <td className="p-2 border-r border-zinc-800 text-center font-mono font-extrabold text-xs text-blue-300 bg-blue-950/20">
                                B
                              </td>
                              {roleCols.map(({ role, data }) => (
                                <td key={role} className="p-2 border-r border-zinc-800 last:border-r-0 align-top bg-black/20">
                                  <div className="flex flex-wrap gap-1.5 min-h-[38px] items-center">
                                    {data.B.length > 0 ? (
                                      data.B.map((entry) => {
                                        const champ = findChampion(entry.campeon_id);
                                        const isFp = entry.pick_tag === "FP";
                                        const isLp = entry.pick_tag === "LP" || (!entry.pick_tag && comp.no_first_pick_reasons?.some((r) => r.champ.toLowerCase() === entry.campeon_id.toLowerCase()));
                                        const isRisky = entry.pick_tag === "Risky";
                                        return (
                                          <div
                                            key={entry.id}
                                            onClick={() => handleCyclePickTag(entry.id)}
                                            title={`${champ?.name || entry.campeon_id} (${entry.tier}) — Clic para alternar tag (FP/LP/Risky)`}
                                            className="relative group cursor-pointer"
                                          >
                                            <img
                                              src={getChampionAvatar(entry.campeon_id)}
                                              alt={entry.campeon_id}
                                              className="h-9 w-9 rounded-md object-cover border border-blue-500/40 group-hover:border-blue-400 shadow group-hover:scale-105 transition-all"
                                            />
                                            {isFp && (
                                              <span className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                FP
                                              </span>
                                            )}
                                            {isLp && (
                                              <span className="absolute -top-1 -right-1 bg-rose-600 text-[8px] font-mono font-bold text-white px-1 rounded shadow">
                                                LP
                                              </span>
                                            )}
                                            {isRisky && (
                                              <span className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-mono font-bold text-black px-1 rounded shadow">
                                                Risky
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <span className="text-[10px] text-zinc-650 font-mono italic">-</span>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VISTA 3: FICHAS TÁCTICAS DE APERTURA (QUÉ FP vs QUÉ NO FP) */}
            {/* ========================================================= */}
            {drafterViewMode === "cards" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* QUÉ SE PUEDE FIRST-PICKEAR */}
                <div className="bg-gradient-to-br from-emerald-950/20 to-zinc-950 border border-emerald-900/40 rounded-xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base uppercase tracking-wider text-emerald-300">
                        ¿Qué SE PUEDE First-Pickear?
                      </h3>
                      <p className="text-[11px] text-zinc-400">
                        Picks de apertura seguros (B1 / R1-R2) que no delatan la composición ni son vulnerables a hard-counters.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {compDraftAnalysis.safeFirstPicks.length > 0 ? (
                      compDraftAnalysis.safeFirstPicks.map((entry) => {
                        const champ = findChampion(entry.campeon_id);
                        const player = PLAYERS_LIST.find((p) => p.name === entry.jugador);
                        return (
                          <div
                            key={entry.id}
                            className="flex items-center gap-3 bg-zinc-900/80 border border-emerald-800/30 rounded-lg p-2.5 hover:border-emerald-500/50 transition-colors"
                          >
                            <div className="relative shrink-0">
                              <img
                                src={getChampionAvatar(entry.campeon_id)}
                                alt={entry.campeon_id}
                                className="h-12 w-12 rounded-lg border border-emerald-500/40 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                              {player && (
                                <span className="absolute -bottom-1 -right-1 bg-black/90 rounded border border-zinc-700 p-0.5 shadow">
                                  <RoleIconOnly role={player.role} size="sm" />
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {player && <RoleBadge role={player.role} size="sm" showLabel={true} />}
                                <span className="font-bold text-sm text-white truncate">
                                  {champ ? champ.name : entry.campeon_id}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                    entry.tier === "S"
                                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                      : "bg-purple-400/20 text-purple-300 border border-purple-400/30"
                                  }`}
                                >
                                  Tier {entry.tier}
                                </span>
                              </div>
                              <div className="text-[11px] text-zinc-400 truncate mt-1">
                                {player ? `${player.displayName} (${player.laneTitle})` : entry.jugador}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-2 text-center py-6 text-zinc-500 text-xs">
                        No hay picks marcados como seguros para first-pickear en esta composición.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-emerald-950/40 rounded border border-emerald-900/50 text-[11px] text-emerald-200/90 leading-relaxed flex items-start gap-2">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>
                      <strong>Estrategia de First Pick:</strong> Abre siempre con campeones polivalentes (flex picks entre top/mid/supp o adc seguro) para no revelar a qué juegas y forzar que el rival gaste bans o picks a ciegas.
                    </span>
                  </div>
                </div>

                {/* QUÉ NO SE PUEDE FIRST-PICKEAR */}
                <div className="bg-gradient-to-br from-rose-950/20 to-zinc-950 border border-rose-900/40 rounded-xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base uppercase tracking-wider text-rose-300">
                        ¿Qué NO SE DEBE First-Pickear?
                      </h3>
                      <p className="text-[11px] text-zinc-400">
                        Picks reservados para segunda rotación o last pick (R4-R5). Abrirlos antes te expone a counters fatales.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {currentComp.no_first_pick_reasons && currentComp.no_first_pick_reasons.length > 0 ? (
                      currentComp.no_first_pick_reasons.map((item, idx) => {
                        const champ = findChampion(item.champ);
                        const inferredRole: RoleType = champ?.roles[0] || "MID";
                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-3 bg-zinc-900/80 border border-rose-900/30 rounded-lg p-2.5"
                          >
                            <div className="relative shrink-0 mt-0.5">
                              <img
                                src={getChampionAvatar(item.champ)}
                                alt={item.champ}
                                className="h-11 w-11 rounded-lg border border-rose-500/40 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                              <span className="absolute -bottom-1 -right-1 bg-black/90 rounded border border-zinc-700 p-0.5 shadow">
                                <RoleIconOnly role={inferredRole} size="sm" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-1">
                                <RoleBadge role={inferredRole} size="sm" showLabel={true} />
                                <span className="font-bold text-xs text-rose-200">
                                  {champ ? champ.name : item.champ}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400 leading-snug">
                                {item.reason}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-zinc-500 text-xs py-4 text-center">
                        No hay advertencias especiales configuradas para esta composición.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-rose-950/40 rounded border border-rose-900/50 text-[11px] text-rose-200/90 leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>
                      <strong>Regla de oro Void Lynx:</strong> Los carries con condición de victoria muy marcada (splitpusher frágil o poke puro) deben reservarse para R4-R5 para evitar que el rival responda con hard engage directo.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* POOL DEL EQUIPO PARA ESTA COMPOSICIÓN (POR POSICIÓN) */}
            {drafterViewMode !== "vertical" && (
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-xl">
                <div className="mb-4">
                  <h3 className="font-display font-bold text-base uppercase tracking-wider text-purple-300 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-purple-400" />
                    <span>Pool de Void Lynx para "{currentComp.nombre}"</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Opciones que tienen entrenadas nuestros jugadores específicamente para esta composición, ordenadas por su Tier individual.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {(["TOP", "JGL", "MID", "ADC", "SUPP"] as const).map((role) => {
                    const roleData = compDraftAnalysis.byRole[role];
                    return (
                      <div
                        key={role}
                        className="bg-zinc-900/70 border border-zinc-800/80 rounded-lg p-3.5 flex flex-col"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-purple-950 text-purple-300 font-mono text-xs px-2 py-0.5 rounded font-bold">
                              {role}
                            </span>
                            <span className="text-xs font-semibold text-white">
                              {roleData.player.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {roleData.champs.length} picks
                          </span>
                        </div>

                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[360px] pr-1">
                          {roleData.champs.length > 0 ? (
                            roleData.champs.map((entry) => {
                              const champ = findChampion(entry.campeon_id);
                              return (
                                <div
                                  key={entry.id}
                                  className="flex items-center justify-between bg-zinc-950/80 border border-zinc-800/80 rounded p-1.5"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img
                                      src={getChampionAvatar(entry.campeon_id)}
                                      alt={entry.campeon_id}
                                      className="h-8 w-8 rounded object-cover border border-zinc-700 shrink-0"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = "none";
                                      }}
                                    />
                                    <div className="min-w-0 truncate">
                                      <span className="text-xs font-medium text-white truncate block">
                                        {champ ? champ.name : entry.campeon_id}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                        entry.tier === "S"
                                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                          : entry.tier === "A"
                                          ? "bg-purple-400/20 text-purple-300 border border-purple-400/30"
                                          : entry.tier === "B"
                                          ? "bg-blue-400/20 text-blue-300 border border-blue-400/30"
                                          : "bg-zinc-800 text-zinc-400"
                                      }`}
                                    >
                                      {entry.tier}
                                    </span>
                                    {entry.is_first_pickable && (
                                      <span
                                        title="First pick seguro"
                                        className="text-[9px] text-emerald-400 font-mono font-bold"
                                      >
                                        FP
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-8 text-zinc-500 text-xs">
                              Sin picks asignados
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: GESTOR DE TIPOS DE COMPOSICIÓN & COUNTERS */}
        {/* ========================================================================= */}
        {activeTab === "compositions" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
              <div>
                <h2 className="font-display font-bold text-lg uppercase tracking-wider text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  <span>Matriz de Composiciones Tácticas</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Gestiona las 8 composiciones del equipo, sus counters directos, bans clave y advertencias para el draft.
                </p>
              </div>

              <button
                onClick={handleOpenCreateComp}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3.5 py-2 rounded-lg font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-lg shadow-purple-900/30"
              >
                <Plus className="h-4 w-4" />
                <span>Nueva Composición</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {compositions.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-5 hover:border-purple-600/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-display font-bold text-base text-white tracking-wide">
                          {comp.nombre}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            comp.prioridad.includes("Alta")
                              ? "bg-purple-900/40 text-purple-300 border border-purple-500/30"
                              : comp.prioridad.includes("Media")
                              ? "bg-blue-900/40 text-blue-300 border border-blue-500/30"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {comp.prioridad}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-zinc-500">{comp.enfoque}</span>
                        <button
                          type="button"
                          onClick={() => handleOpenEditComp(comp)}
                          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="Editar composición"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-purple-400" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                      {comp.descripcion}
                    </p>

                    <div className="space-y-3 border-t border-zinc-800/80 pt-3">
                      <div>
                        <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1">
                          Counters Directos (Amenazas):
                        </span>
                        <p className="text-xs text-zinc-400 mb-2">{comp.counters_descripcion}</p>
                        <div className="flex flex-wrap gap-2">
                          {comp.counters_campeones.map((cId) => (
                            <span
                              key={cId}
                              className="inline-flex items-center gap-2 bg-zinc-900 border border-rose-500/40 text-rose-200 text-xs px-2.5 py-1 rounded-lg shadow"
                            >
                              <img
                                src={getChampionAvatar(cId)}
                                alt={cId}
                                className="h-7 w-7 rounded-md object-cover border border-rose-500/40"
                              />
                              <span className="font-bold">{cId}</span>
                              <button
                                onClick={() => {
                                  const updated = compositions.map((c) =>
                                    c.id === comp.id
                                      ? {
                                          ...c,
                                          counters_campeones: c.counters_campeones.filter(
                                            (x) => x !== cId
                                          ),
                                        }
                                      : c
                                  );
                                  handlePersist(updated, playerChampions);
                                }}
                                className="text-zinc-500 hover:text-rose-400 font-bold ml-1 text-sm leading-none"
                              >
                                ×
                              </button>
                            </span>
                          ))}

                          <button
                            onClick={() => handleOpenEditComp(comp)}
                            className="text-xs text-purple-300 hover:text-white bg-purple-950/60 border border-purple-500/40 hover:border-purple-400 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors font-semibold"
                          >
                            + Gestionar Counters
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                          First Picks Seguros:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {comp.first_pick_safe.map((sId) => (
                            <span
                              key={sId}
                              className="inline-flex items-center gap-2 bg-zinc-900 border border-emerald-500/40 text-emerald-200 text-xs px-2.5 py-1 rounded-lg shadow"
                            >
                              <img
                                src={getChampionAvatar(sId)}
                                alt={sId}
                                className="h-7 w-7 rounded-md object-cover border border-emerald-500/40"
                              />
                              <span className="font-bold">{sId}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Prioridades de Pick por Rol (5 Columnas) */}
                      <div className="pt-2">
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                          Prioridad de Pick por Rol:
                        </span>
                        <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                          {(["TOP", "JGL", "MID", "ADC", "SUPP"] as RoleType[]).map((r) => {
                            const prio = comp.role_priorities?.[r] || "Media";
                            return (
                              <button
                                key={r}
                                type="button"
                                onClick={() => handleCycleRolePriority(comp.id, r)}
                                title={`${r}: ${prio} — Clic para alternar prioridad`}
                                className={`p-1.5 rounded border text-[10px] font-bold transition-all ${
                                  prio === "Alta"
                                    ? "bg-rose-950/70 border-rose-500/40 text-rose-300 hover:bg-rose-900/60"
                                    : prio === "Media"
                                    ? "bg-amber-950/70 border-amber-500/40 text-amber-300 hover:bg-amber-900/60"
                                    : "bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60"
                                }`}
                              >
                                <div className="text-[9px] text-zinc-500">{r}</div>
                                <div>{prio}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditComp(comp)}
                        className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-purple-400" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteComp(comp.id)}
                        className="p-1.5 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Eliminar composición"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCompId(comp.id);
                        setActiveTab("drafter");
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                    >
                      <span>Ver en Asistente de Draft</span> →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: VESTUARIO & POOLS INDIVIDUALES POR JUGADOR (TIER LIST MATRIX) */}
        {/* ========================================================================= */}
        {activeTab === "players" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* VESTUARIO: SELECCIÓN DE JUGADOR CON SPLASH ARTS */}
            <div className="bg-zinc-950/90 border border-purple-900/40 p-5 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-purple-950 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-purple-500/30">
                      Roster Locker Room
                    </span>
                    <span className="text-zinc-500 text-xs font-mono">
                      Selecciona tu perfil de jugador
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-white flex items-center gap-2.5">
                    <Users className="h-6 w-6 text-purple-400" />
                    <span>Vestuario // Pools & Tiers por Jugador</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs text-zinc-400 font-mono">Editando:</span>
                  <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-purple-900/50 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    {selectedPlayer.displayName} ({selectedPlayer.role})
                  </span>
                </div>
              </div>

              {/* Grid de Tarjetas de Jugadores (Locker Room) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {PLAYERS_LIST.map((player) => {
                  const isSelected = player.name === selectedPlayerName;
                  const playerChamps = playerChampions.filter((p) => p.jugador === player.name);
                  const countS = playerChamps.filter((p) => p.tier === "S").length;
                  const countA = playerChamps.filter((p) => p.tier === "A").length;
                  const splashUrl = getChampionSplash(player.signatureChamp);

                  return (
                    <button
                      key={player.name}
                      onClick={() => setSelectedPlayerName(player.name)}
                      className={`group relative rounded-xl overflow-hidden border p-3.5 text-left transition-all duration-300 flex flex-col justify-between min-h-[140px] ${
                        isSelected
                          ? "border-purple-400 bg-purple-950/60 shadow-[0_0_30px_rgba(168,85,247,0.35)] ring-2 ring-purple-400 -translate-y-1"
                          : "border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/50 hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Splash Art de fondo con fade */}
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 transition-opacity duration-500 scale-105"
                        style={{
                          backgroundImage: `url(${splashUrl})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />

                      {/* Header de la tarjeta */}
                      <div className="relative z-10 flex items-center justify-between w-full mb-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            player.role === "TOP"
                              ? "bg-amber-950/90 text-amber-300 border border-amber-600/40"
                              : player.role === "JGL"
                              ? "bg-emerald-950/90 text-emerald-300 border border-emerald-600/40"
                              : player.role === "MID"
                              ? "bg-cyan-950/90 text-cyan-300 border border-cyan-600/40"
                              : player.role === "ADC"
                              ? "bg-purple-950/90 text-purple-300 border border-purple-600/40"
                              : "bg-rose-950/90 text-rose-300 border border-rose-600/40"
                          }`}
                        >
                          {player.role}
                        </span>

                        <span className="text-[9px] font-mono text-zinc-400">
                          {player.isStarter ? "Titular" : "Sub"}
                        </span>
                      </div>

                      {/* Nombre del jugador */}
                      <div className="relative z-10 my-auto">
                        <span className="font-display font-bold text-sm sm:text-base text-white tracking-wide block truncate">
                          {player.displayName}
                        </span>
                        <span className="text-[10px] text-zinc-400 block truncate font-mono">
                          {player.laneTitle}
                        </span>
                      </div>

                      {/* Desglose de Tiers rápido */}
                      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono w-full">
                        <div className="flex gap-1.5">
                          <span className="text-amber-400 font-bold" title="Tier S">S:{countS}</span>
                          <span className="text-purple-300 font-bold" title="Tier A">A:{countA}</span>
                        </div>
                        <span className="text-zinc-400 font-semibold">{playerChamps.length} picks</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONTROLES Y HERRAMIENTAS DEL JUGADOR SELECCIONADO */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <img
                  src={getChampionAvatar(selectedPlayer.signatureChamp)}
                  alt={selectedPlayer.displayName}
                  className="h-10 w-10 rounded-lg border border-purple-500/50 object-cover shrink-0"
                />
                <div>
                  <h3 className="font-display font-bold text-base uppercase tracking-wider text-white">
                    Pool de {selectedPlayer.displayName} ({selectedPlayer.laneTitle})
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {filteredPlayerChamps.length} campeones mostrados • Gestiona tus tiers y a qué composiciones aplicas
                  </p>
                </div>
              </div>

              {/* Selector de Modo de Vista y Filtro */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Switcher de Vista (Tierlist vs Grid) */}
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  <button
                    onClick={() => setPlayerViewMode("tierlist")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      playerViewMode === "tierlist"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Trophy className="h-3.5 w-3.5 text-amber-400" />
                    <span>Matriz Tier List</span>
                  </button>

                  <button
                    onClick={() => setPlayerViewMode("grid")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      playerViewMode === "grid"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Vista Detallada</span>
                  </button>
                </div>

                {/* Filtro por Composición */}
                <select
                  value={playerFilterComp}
                  onChange={(e) => setPlayerFilterComp(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="ALL">Todas las Composiciones</option>
                  {compositions.map((comp) => (
                    <option key={comp.id} value={comp.nombre}>
                      {comp.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ========================================================= */}
            {/* MODO 1: MATRIZ VISUAL TIER LIST (ESTILO TIERMAKER PROFESIONAL) */}
            {/* ========================================================= */}
            {playerViewMode === "tierlist" && (
              <div className="space-y-4">
                {(["S", "A", "B", "C"] as const).map((tierKey) => {
                  const tierChamps = filteredPlayerChamps.filter((c) => c.tier === tierKey);
                  const tierStyle = {
                    S: {
                      badgeBg: "bg-gradient-to-br from-amber-500/25 to-amber-950/60",
                      borderColor: "border-amber-500/40",
                      textColor: "text-amber-300",
                      label: "TIER S",
                      subtitle: "GOD TIER // FIRST PICK",
                      icon: <Crown className="h-5 w-5 text-amber-400" />,
                    },
                    A: {
                      badgeBg: "bg-gradient-to-br from-purple-500/25 to-purple-950/60",
                      borderColor: "border-purple-500/40",
                      textColor: "text-purple-300",
                      label: "TIER A",
                      subtitle: "CORE PICK // ÓPTIMO",
                      icon: <Sparkles className="h-5 w-5 text-purple-400" />,
                    },
                    B: {
                      badgeBg: "bg-gradient-to-br from-blue-500/25 to-blue-950/60",
                      borderColor: "border-blue-500/40",
                      textColor: "text-blue-300",
                      label: "TIER B",
                      subtitle: "SITUACIONAL // SEGUNDA OPCIÓN",
                      icon: <Layers className="h-5 w-5 text-blue-400" />,
                    },
                    C: {
                      badgeBg: "bg-gradient-to-br from-zinc-700/25 to-zinc-900/60",
                      borderColor: "border-zinc-700/40",
                      textColor: "text-zinc-400",
                      label: "TIER C",
                      subtitle: "POCKET // EXPERIMENTAL",
                      icon: <Shield className="h-5 w-5 text-zinc-400" />,
                    },
                  }[tierKey];

                  return (
                    <div
                      key={tierKey}
                      className={`flex flex-col md:flex-row rounded-xl border ${tierStyle.borderColor} bg-zinc-950/80 overflow-hidden shadow-xl`}
                    >
                      {/* Cabecera del Tier (Columna Izquierda) */}
                      <div
                        className={`md:w-48 p-4 shrink-0 flex md:flex-col items-center justify-between md:justify-center text-center gap-2 ${tierStyle.badgeBg} border-b md:border-b-0 md:border-r ${tierStyle.borderColor}`}
                      >
                        <div className="flex items-center md:flex-col gap-2">
                          {tierStyle.icon}
                          <span className={`font-display font-extrabold text-2xl tracking-wider ${tierStyle.textColor}`}>
                            {tierStyle.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                          {tierStyle.subtitle}
                        </span>
                        <span className="text-xs font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                          {tierChamps.length} campeones
                        </span>
                      </div>

                      {/* Campeones de este Tier */}
                      <div className="flex-1 p-3.5 flex flex-wrap gap-3 items-center min-h-[100px] bg-black/30">
                        {tierChamps.length > 0 ? (
                          tierChamps.map((entry) => {
                            const champ = findChampion(entry.campeon_id);
                            return (
                              <div
                                key={entry.id}
                                className="group relative bg-zinc-900/90 border border-zinc-800 hover:border-purple-500/60 rounded-xl p-2 transition-all duration-200 flex flex-col items-center w-28 sm:w-32 shadow-md hover:-translate-y-0.5"
                              >
                                {/* Imagen con badges */}
                                <div className="relative mb-1.5 w-16 h-16">
                                  <img
                                    src={getChampionAvatar(entry.campeon_id)}
                                    alt={entry.campeon_id}
                                    className="w-full h-full rounded-lg object-cover border border-zinc-700 group-hover:border-purple-400 shadow"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = "none";
                                    }}
                                  />
                                  {entry.is_first_pickable && (
                                    <span
                                      title="First Pick Seguro"
                                      className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] font-bold text-white px-1 py-0.2 rounded shadow"
                                    >
                                      FP
                                    </span>
                                  )}
                                </div>

                                {/* Nombre */}
                                <span className="font-bold text-xs text-white truncate w-full text-center">
                                  {champ ? champ.name : entry.campeon_id}
                                </span>

                                {/* Mini tags de composiciones */}
                                <div className="flex flex-wrap gap-0.5 justify-center mt-1 w-full max-h-8 overflow-hidden">
                                  {entry.tipos_comp.slice(0, 2).map((compName) => (
                                    <span
                                      key={compName}
                                      className="bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[8px] px-1 rounded font-mono truncate"
                                    >
                                      {compName}
                                    </span>
                                  ))}
                                  {entry.tipos_comp.length > 2 && (
                                    <span className="text-[8px] text-zinc-500 font-mono">
                                      +{entry.tipos_comp.length - 2}
                                    </span>
                                  )}
                                </div>

                                {/* Controles de cambio rápido de Tier (Flechas y Borrar) */}
                                <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between w-full text-zinc-400 text-[10px]">
                                  <button
                                    onClick={() => handleShiftTier(entry.id, "up")}
                                    disabled={tierKey === "S"}
                                    title="Subir de Tier"
                                    className="hover:text-amber-400 disabled:opacity-20 p-0.5 rounded transition-colors"
                                  >
                                    <ChevronUp className="h-3.5 w-3.5" />
                                  </button>

                                  {/* Selector rápido directo */}
                                  <div className="flex gap-0.5">
                                    {(["S", "A", "B", "C"] as const).map((t) => (
                                      <button
                                        key={t}
                                        onClick={() => handleUpdateTier(entry.id, t)}
                                        className={`font-mono text-[9px] font-bold px-1 rounded ${
                                          entry.tier === t
                                            ? "bg-purple-600 text-white"
                                            : "text-zinc-600 hover:text-white"
                                        }`}
                                      >
                                        {t}
                                      </button>
                                    ))}
                                  </div>

                                  <button
                                    onClick={() => handleShiftTier(entry.id, "down")}
                                    disabled={tierKey === "C"}
                                    title="Bajar de Tier"
                                    className="hover:text-blue-400 disabled:opacity-20 p-0.5 rounded transition-colors"
                                  >
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-zinc-600 text-xs italic py-6 px-4">
                            Ningún campeón en {tierStyle.label}. Asigna campeones aquí usando el formulario de abajo.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ========================================================= */}
            {/* MODO 2: VISTA DETALLADA EN CUADRÍCULA (CON EDICIÓN DE COMPOS) */}
            {/* ========================================================= */}
            {playerViewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPlayerChamps.map((entry) => {
                  const champ = findChampion(entry.campeon_id);
                  return (
                    <div
                      key={entry.id}
                      className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3.5 flex flex-col justify-between transition-colors shadow-lg"
                    >
                      <div>
                        {/* Cabecera del campeón */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={getChampionAvatar(entry.campeon_id)}
                              alt={entry.campeon_id}
                              className="h-11 w-11 rounded-lg border border-zinc-700 object-cover shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                            <div className="min-w-0 truncate">
                              <span className="font-bold text-sm text-white truncate block">
                                {champ ? champ.name : entry.campeon_id}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                {champ?.category || "Champion"}
                              </span>
                            </div>
                          </div>

                          {/* Botón rápido de Tier */}
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex gap-0.5 bg-zinc-900 p-0.5 rounded border border-zinc-800">
                              {(["S", "A", "B", "C"] as const).map((t) => (
                                <button
                                  key={t}
                                  onClick={() => handleUpdateTier(entry.id, t)}
                                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded transition-colors ${
                                    entry.tier === t
                                      ? t === "S"
                                        ? "bg-amber-400 text-black font-extrabold"
                                        : t === "A"
                                        ? "bg-purple-600 text-white"
                                        : t === "B"
                                        ? "bg-blue-600 text-white"
                                        : "bg-zinc-700 text-zinc-200"
                                      : "text-zinc-500 hover:text-white"
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Composiciones asignadas */}
                        <div className="mb-3">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                            Aplica a composiciones:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {entry.tipos_comp && entry.tipos_comp.length > 0 ? (
                              entry.tipos_comp.map((compName) => (
                                <span
                                  key={compName}
                                  className="bg-zinc-900 border border-zinc-800 text-purple-300 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-mono"
                                >
                                  {compName}
                                  <button
                                    onClick={() => handleToggleChampComp(entry.id, compName)}
                                    className="text-zinc-500 hover:text-rose-400 text-[9px]"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-zinc-600 italic">
                                Ninguna composición asignada
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Toggle de composiciones */}
                        <div className="pt-2 border-t border-zinc-900 flex flex-wrap gap-1">
                          {compositions.map((comp) => {
                            const hasIt = entry.tipos_comp.includes(comp.nombre);
                            return (
                              <button
                                key={comp.id}
                                onClick={() => handleToggleChampComp(entry.id, comp.nombre)}
                                className={`text-[9px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                                  hasIt
                                    ? "bg-purple-900/40 text-purple-200 border border-purple-500/40"
                                    : "text-zinc-500 hover:text-zinc-300"
                                }`}
                              >
                                {hasIt ? `✓ ${comp.nombre}` : `+ ${comp.nombre}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Acciones inferiores */}
                      <div className="mt-4 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleToggleFirstPick(entry.id)}
                          className={`text-[10px] font-mono flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                            entry.is_first_pickable
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{entry.is_first_pickable ? "First Pick Seguro" : "Poco Seguro a Ciegas"}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteChamp(entry.id)}
                          title="Eliminar del pool"
                          className="text-zinc-600 hover:text-rose-400 p-1 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* FORMULARIO: AÑADIR CAMPEÓN AL POOL DEL JUGADOR */}
            <div className="bg-zinc-950 border border-purple-900/40 p-5 rounded-2xl shadow-xl">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-purple-300 mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-purple-400" />
                <span>Añadir Campeón al Pool de {selectedPlayer.displayName}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Input Buscador con sugerencias */}
                <div className="relative">
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                    Campeón (Catálogo de 172 LoL):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ej: K'Sante, Viego, Jinx..."
                      value={newChampSearch}
                      onChange={(e) => setNewChampSearch(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                    />
                    <Search className="h-4 w-4 absolute right-2.5 top-2.5 text-zinc-500" />
                  </div>

                  {/* Dropdown de resultados */}
                  {champSearchResults.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-md shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                      {champSearchResults.map((champ) => (
                        <button
                          key={champ.id}
                          type="button"
                          onClick={() => {
                            handleAddChampToPlayer(champ.id);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-purple-900/40 text-xs text-white border-b border-zinc-800 last:border-b-0"
                        >
                          <img
                            src={getChampionAvatar(champ.id)}
                            alt={champ.name}
                            className="h-7 w-7 rounded object-cover"
                          />
                          <div>
                            <span className="font-semibold block">{champ.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {champ.category}
                            </span>
                          </div>
                          <span className="text-[10px] text-purple-400 ml-auto font-mono font-bold">
                            + Añadir
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selector de Tier */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                    Tier a Asignar:
                  </label>
                  <div className="flex gap-1.5">
                    {(["S", "A", "B", "C"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewChampTier(t)}
                        className={`flex-1 py-2 rounded font-mono text-xs font-bold transition-colors ${
                          newChampTier === t
                            ? t === "S"
                              ? "bg-amber-400 text-black font-extrabold shadow-md shadow-amber-900/40"
                              : t === "A"
                              ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                              : t === "B"
                              ? "bg-blue-600 text-white"
                              : "bg-zinc-700 text-zinc-200"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Composiciones a las que aplica (Selector de Tags) */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                    Composiciones en las que encaja:
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {compositions.map((comp) => {
                      const isChecked = newChampComps.includes(comp.nombre);
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => {
                            setNewChampComps((prev) =>
                              prev.includes(comp.nombre)
                                ? prev.filter((c) => c !== comp.nombre)
                                : [...prev, comp.nombre]
                            );
                          }}
                          className={`text-[10px] px-2.5 py-1 rounded font-semibold transition-colors ${
                            isChecked
                              ? "bg-purple-600 text-white shadow"
                              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {isChecked ? `✓ ${comp.nombre}` : comp.nombre}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SALA DE DRAFT EN VIVO (DRAFTER.LOL SYNC & ASISTENTE TÁCTICO) */}
        {/* ========================================================================= */}
        {activeTab === "live" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. BARRA SUPERIOR DE CONEXIÓN CON DRAFTER.LOL & CONTROLES DE PARTIDA */}
            <div className="bg-zinc-950 border border-purple-900/40 p-5 rounded-2xl shadow-2xl relative overflow-hidden space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-purple-950 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-purple-500/30">
                      Live Draft Engine 2.0
                    </span>
                    <span className="text-zinc-500 text-xs font-mono">
                      Mesa de Draft • Sincronización Drafter.lol • Companion del Coach
                    </span>
                  </div>
                  <h2 className="font-display font-black text-xl uppercase tracking-wider text-white flex items-center gap-2.5">
                    <Swords className="h-6 w-6 text-purple-400" />
                    <span>Sala de Draft en Vivo & Asistente Táctico</span>
                  </h2>
                </div>

                {/* Acciones principales: Historial, Guardar, Limpiar */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowHistoryModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-purple-500 text-zinc-200 text-xs font-semibold transition-colors"
                  >
                    <History className="h-4 w-4 text-purple-400" />
                    <span>Historial ({draftsHistory.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCurrentDraft}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all hover:scale-105"
                  >
                    <Save className="h-4 w-4" />
                    <span>Guardar Partida</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDraftBoard}
                    title="Limpiar todos los picks y bans de la mesa"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 text-xs transition-colors border border-zinc-800"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reiniciar Mesa</span>
                  </button>
                </div>
              </div>

              {/* BARRA DE CONEXIÓN CON DRAFTER.LOL & SELECTOR DE VISTA */}
              <div className="bg-gradient-to-r from-purple-950/40 via-zinc-900/80 to-zinc-950 p-4 rounded-xl border border-purple-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Globe className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                      Conexión en Vivo con Sala de Drafter.lol:
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Pega la URL de drafter.lol (ej: https://drafter.lol/room/xyz123) o el ID de sala..."
                      value={drafterInputUrl || drafterRoomUrl}
                      onChange={(e) => setDrafterInputUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && drafterInputUrl.trim()) {
                          handleSetDrafterRoomUrl(drafterInputUrl);
                          setDrafterArenaMode("split");
                        }
                      }}
                      className="flex-1 bg-black/70 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (drafterInputUrl.trim()) {
                          handleSetDrafterRoomUrl(drafterInputUrl);
                          setDrafterArenaMode("split");
                        }
                      }}
                      className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono transition-colors shadow shrink-0"
                    >
                      Conectar
                    </button>
                    {cleanDrafterIframeUrl && (
                      <a
                        href={cleanDrafterIframeUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir sala drafter.lol en nueva pestaña"
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Switcher de Modos de Pantalla */}
                <div className="flex items-center gap-1.5 bg-black/60 border border-zinc-800 p-1.5 rounded-xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setDrafterArenaMode("builtin")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                      drafterArenaMode === "builtin"
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Tv className="h-3.5 w-3.5" />
                    <span>Mesa Nativa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrafterArenaMode("split")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                      drafterArenaMode === "split"
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Híbrido (Drafter + Companion)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrafterArenaMode("drafter_lol")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                      drafterArenaMode === "drafter_lol"
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Solo Drafter.lol</span>
                  </button>
                </div>
              </div>

              {/* Barra de Configuración de la Scrim / Partido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {/* Rival */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                    Equipo Rival:
                  </label>
                  <input
                    type="text"
                    value={rivalName}
                    onChange={(e) => setRivalName(e.target.value)}
                    placeholder="Ej: Movistar KOI, GIANTX..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-semibold"
                  />
                </div>

                {/* Lado de Void Lynx */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                    Lado de Void Lynx:
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setOurSide("BLUE")}
                      className={`flex-1 py-1.5 rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        ourSide === "BLUE"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      <span>AZUL (B1 First Pick)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOurSide("RED")}
                      className={`flex-1 py-1.5 rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        ourSide === "RED"
                          ? "bg-rose-600 text-white shadow-md shadow-rose-900/40 border border-rose-400"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      <span>ROJO (R5 Last Pick)</span>
                    </button>
                  </div>
                </div>

                {/* Composición Objetivo que queremos ejecutar */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                    Composición Objetivo:
                  </label>
                  <select
                    value={selectedCompId}
                    onChange={(e) => setSelectedCompId(e.target.value)}
                    className="w-full bg-zinc-900 border border-purple-500/50 rounded px-3 py-1.5 text-xs text-white focus:outline-none font-semibold"
                  >
                    {compositions.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.nombre} ({comp.prioridad.replace(" Prioridad", "")})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Resultado Scrim */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                    Resultado Match:
                  </label>
                  <select
                    value={matchResult}
                    onChange={(e) => setMatchResult(e.target.value as any)}
                    className={`w-full bg-zinc-900 border rounded px-3 py-1.5 text-xs font-bold font-mono focus:outline-none ${
                      matchResult === "VICTORIA"
                        ? "text-emerald-400 border-emerald-500/50"
                        : matchResult === "DERROTA"
                        ? "text-rose-400 border-rose-500/50"
                        : "text-zinc-300 border-zinc-800"
                    }`}
                  >
                    <option value="PENDING">PENDIENTE (En Curso)</option>
                    <option value="VICTORIA">VICTORIA (Void Lynx)</option>
                    <option value="DERROTA">DERROTA</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. SI ESTÁ ACTIVO MODO DRAFTER.LOL: IFRAME EN VIVO */}
            {(drafterArenaMode === "drafter_lol" || drafterArenaMode === "split") && cleanDrafterIframeUrl && (
              <div className="rounded-2xl border-2 border-purple-500/50 bg-black shadow-2xl overflow-hidden">
                <div className="bg-zinc-900/90 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-300 flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-purple-400" />
                    <strong>SALA DRAFTER.LOL EN DIRECTO:</strong> {cleanDrafterIframeUrl}
                  </span>
                  <a
                    href={cleanDrafterIframeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Abrir Pantalla Completa</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <iframe
                  src={cleanDrafterIframeUrl}
                  title="Drafter.lol Live Room"
                  className="w-full h-[620px] bg-black border-none"
                  allow="clipboard-write"
                />
              </div>
            )}

            {/* 3. MESA DE DRAFT INTEGRADA (CUANDO ESTÁ EN MODO BUILT-IN O SPLIT) */}
            {(drafterArenaMode === "builtin" || (drafterArenaMode === "split" && !cleanDrafterIframeUrl)) && (
              <div className="space-y-4">
                {/* ALERTA EN VIVO: Counters detectados en el equipo rival */}
                {enemyCountersDetected.length > 0 && (
                  <div className="bg-gradient-to-r from-rose-950/90 via-red-950/80 to-zinc-950 border-2 border-rose-500 rounded-xl p-4 shadow-2xl animate-pulse">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2 bg-rose-600/20 border border-rose-500 rounded-lg shrink-0">
                        <AlertTriangle className="h-6 w-6 text-rose-400 animate-bounce" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-sm uppercase tracking-wide text-rose-200">
                            ¡ALERTA TÁCTICA! El rival ha drafteado counters de "{currentComp.nombre}"
                          </h4>
                          <span className="bg-rose-600 text-[10px] text-white font-mono font-bold px-2 py-0.2 rounded-full">
                            {enemyCountersDetected.length} DETECTADOS
                          </span>
                        </div>
                        <p className="text-xs text-rose-200/80 mt-0.5 leading-relaxed">
                          Peligro para tu composición: {currentComp.counters_descripcion}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {enemyCountersDetected.map((cId) => (
                            <span
                              key={cId}
                              className="bg-black/80 border border-rose-400 text-rose-200 text-xs px-2.5 py-1 rounded-md flex items-center gap-2 font-bold shadow"
                            >
                              <img
                                src={getChampionAvatar(cId)}
                                alt={cId}
                                className="h-5 w-5 rounded object-cover"
                              />
                              <span>{cId}</span>
                              <span className="text-[10px] text-rose-400 font-mono">COUNTER DIRECTO</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MESA DE DRAFT: LADO AZUL vs LADO ROJO (ESTILO DRAFTER.LOL / RIOT ESPORTS) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* ===================== LADO AZUL (lg:col-span-5) ===================== */}
                  <div
                    className={`lg:col-span-5 bg-zinc-950 rounded-2xl p-4 sm:p-5 border-2 shadow-2xl transition-all ${
                      ourSide === "BLUE"
                        ? "border-blue-500/70 shadow-blue-950/40 ring-1 ring-blue-500/30"
                        : "border-zinc-800"
                    }`}
                  >
                    {/* Cabecera Lado Azul */}
                    <div className="flex items-center justify-between border-b border-blue-900/40 pb-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6] animate-pulse" />
                        <span className="font-display font-extrabold text-base tracking-wider uppercase text-blue-400">
                          LADO AZUL // {ourSide === "BLUE" ? "VOID LYNX" : rivalName}
                        </span>
                        {ourSide === "BLUE" && (
                          <span className="bg-blue-950 border border-blue-400/50 text-blue-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                            NOSOTROS
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-zinc-400 font-bold">
                        {bluePicks.filter(Boolean).length}/5 Picks
                      </span>
                    </div>

                    {/* BANS LADO AZUL (5 Slots) */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5 font-bold">
                        Bans Lado Azul (1-5):
                      </span>
                      <div className="grid grid-cols-5 gap-2">
                        {blueBans.map((ban, idx) => {
                          const isActive =
                            activeSlot.side === "blue" &&
                            activeSlot.type === "ban" &&
                            activeSlot.index === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveSlot({ side: "blue", type: "ban", index: idx })}
                              className={`relative aspect-square rounded-lg border flex flex-col items-center justify-center overflow-hidden transition-all group ${
                                isActive
                                  ? "border-blue-400 ring-2 ring-blue-400 bg-blue-950/60 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                  : ban
                                  ? "border-rose-900/60 bg-zinc-900"
                                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/40"
                              }`}
                            >
                              {ban ? (
                                <>
                                  <img
                                    src={getChampionAvatar(ban)}
                                    alt={ban}
                                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all"
                                  />
                                  <div className="absolute inset-0 bg-rose-950/40 flex items-center justify-center">
                                    <span className="text-rose-400 font-bold text-xs">✕</span>
                                  </div>
                                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-zinc-300 font-mono truncate text-center px-0.5">
                                    {ban}
                                  </span>
                                </>
                              ) : (
                                <span className="text-[10px] font-mono text-zinc-600 font-bold">
                                  B{idx + 1}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* PICKS LADO AZUL (5 Slots B1 - B5) */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                        Picks Lado Azul (B1 - B5):
                      </span>
                      {bluePicks.map((pick, idx) => {
                        const isActive =
                          activeSlot.side === "blue" &&
                          activeSlot.type === "pick" &&
                          activeSlot.index === idx;
                        const champ = findChampion(pick);
                        const isCounter =
                          ourSide === "RED" &&
                          pick &&
                          currentComp.counters_campeones.some(
                            (c) => c.toLowerCase() === pick.toLowerCase()
                          );

                        return (
                          <div
                            key={idx}
                            onClick={() => setActiveSlot({ side: "blue", type: "pick", index: idx })}
                            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                              isActive
                                ? "border-blue-400 bg-blue-950/50 ring-2 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)] -translate-y-0.5"
                                : isCounter
                                ? "border-rose-500 bg-rose-950/20"
                                : pick
                                ? "border-zinc-800 bg-zinc-900/80 hover:border-zinc-700"
                                : "border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-xs font-mono font-black text-blue-400 w-7 shrink-0">
                                B{idx + 1}
                              </span>
                              {pick ? (
                                <>
                                  <img
                                    src={getChampionAvatar(pick)}
                                    alt={pick}
                                    className="h-10 w-10 rounded-lg border border-blue-500/50 object-cover shrink-0 shadow"
                                  />
                                  <div className="min-w-0 truncate">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-sm text-white truncate">
                                        {champ ? champ.name : pick}
                                      </span>
                                      {isCounter && (
                                        <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 rounded">
                                          COUNTER
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-zinc-400 font-mono block">
                                      {champ?.category || "Champion"}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <span className="text-xs text-zinc-500 font-mono italic">
                                  {isActive ? "👉 Seleccionando campeón..." : "Click para asignar pick B" + (idx + 1)}
                                </span>
                              )}
                            </div>

                            {pick && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClearSlot("blue", "pick", idx);
                                }}
                                className="text-zinc-500 hover:text-rose-400 p-1.5 rounded hover:bg-rose-950/30 transition-colors text-xs"
                                title="Quitar campeón"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ===================== CENTRO: TRACKER DE TURNOS (lg:col-span-2) ===================== */}
                  <div className="lg:col-span-2 flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3 self-center">
                    <span className="text-[10px] font-mono uppercase font-black tracking-wider text-purple-400">
                      ESTADO DEL TURNO
                    </span>
                    {currentTurnStep ? (
                      <div className="w-full text-center space-y-2">
                        <div className={`p-3 rounded-xl border-2 shadow-lg ${
                          currentTurnStep.side === "blue"
                            ? "bg-blue-950/70 border-blue-500 text-blue-200"
                            : "bg-rose-950/70 border-rose-500 text-rose-200"
                        }`}>
                          <span className="text-[9px] font-mono block uppercase font-bold text-zinc-400">
                            {currentTurnStep.ourTurn ? "★ TU TURNO (VOID LYNX)" : "TURNO RIVAL"}
                          </span>
                          <span className="font-display font-black text-sm block">
                            {currentTurnStep.label}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSlot({
                              side: currentTurnStep.side,
                              type: currentTurnStep.type,
                              index: currentTurnStep.index,
                            });
                          }}
                          className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-[11px] font-bold transition-all shadow"
                        >
                          👉 Ir a este slot
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 text-center text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 rounded-xl">
                        ✓ Draft Completo
                      </div>
                    )}

                    <div className="w-full pt-2 border-t border-zinc-800 text-center">
                      <span className="text-[9px] font-mono text-zinc-500 block">
                        Slot Activo: {activeSlot.side.toUpperCase()} {activeSlot.type.toUpperCase()} #{activeSlot.index + 1}
                      </span>
                    </div>
                  </div>

                  {/* ===================== LADO ROJO (lg:col-span-5) ===================== */}
                  <div
                    className={`lg:col-span-5 bg-zinc-950 rounded-2xl p-4 sm:p-5 border-2 shadow-2xl transition-all ${
                      ourSide === "RED"
                        ? "border-rose-500/70 shadow-rose-950/40 ring-1 ring-rose-500/30"
                        : "border-zinc-800"
                    }`}
                  >
                    {/* Cabecera Lado Rojo */}
                    <div className="flex items-center justify-between border-b border-rose-900/40 pb-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse" />
                        <span className="font-display font-extrabold text-base tracking-wider uppercase text-rose-400">
                          LADO ROJO // {ourSide === "RED" ? "VOID LYNX" : rivalName}
                        </span>
                        {ourSide === "RED" && (
                          <span className="bg-rose-950 border border-rose-400/50 text-rose-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                            NOSOTROS
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-zinc-400 font-bold">
                        {redPicks.filter(Boolean).length}/5 Picks
                      </span>
                    </div>

                    {/* BANS LADO ROJO (5 Slots) */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5 font-bold">
                        Bans Lado Rojo (1-5):
                      </span>
                      <div className="grid grid-cols-5 gap-2">
                        {redBans.map((ban, idx) => {
                          const isActive =
                            activeSlot.side === "red" &&
                            activeSlot.type === "ban" &&
                            activeSlot.index === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveSlot({ side: "red", type: "ban", index: idx })}
                              className={`relative aspect-square rounded-lg border flex flex-col items-center justify-center overflow-hidden transition-all group ${
                                isActive
                                  ? "border-rose-400 ring-2 ring-rose-400 bg-rose-950/60 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                                  : ban
                                  ? "border-rose-900/60 bg-zinc-900"
                                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/40"
                              }`}
                            >
                              {ban ? (
                                <>
                                  <img
                                    src={getChampionAvatar(ban)}
                                    alt={ban}
                                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all"
                                  />
                                  <div className="absolute inset-0 bg-rose-950/40 flex items-center justify-center">
                                    <span className="text-rose-400 font-bold text-xs">✕</span>
                                  </div>
                                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-zinc-300 font-mono truncate text-center px-0.5">
                                    {ban}
                                  </span>
                                </>
                              ) : (
                                <span className="text-[10px] font-mono text-zinc-600 font-bold">
                                  R{idx + 1}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* PICKS LADO ROJO (5 Slots R1 - R5) */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
                        Picks Lado Rojo (R1 - R5):
                      </span>
                      {redPicks.map((pick, idx) => {
                        const isActive =
                          activeSlot.side === "red" &&
                          activeSlot.type === "pick" &&
                          activeSlot.index === idx;
                        const champ = findChampion(pick);
                        const isCounter =
                          ourSide === "BLUE" &&
                          pick &&
                          currentComp.counters_campeones.some(
                            (c) => c.toLowerCase() === pick.toLowerCase()
                          );

                        return (
                          <div
                            key={idx}
                            onClick={() => setActiveSlot({ side: "red", type: "pick", index: idx })}
                            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                              isActive
                                ? "border-rose-400 bg-rose-950/50 ring-2 ring-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.35)] -translate-y-0.5"
                                : isCounter
                                ? "border-rose-500 bg-rose-950/20"
                                : pick
                                ? "border-zinc-800 bg-zinc-900/80 hover:border-zinc-700"
                                : "border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-xs font-mono font-black text-rose-400 w-7 shrink-0">
                                R{idx + 1}
                              </span>
                              {pick ? (
                                <>
                                  <img
                                    src={getChampionAvatar(pick)}
                                    alt={pick}
                                    className="h-10 w-10 rounded-lg border border-rose-500/50 object-cover shrink-0 shadow"
                                  />
                                  <div className="min-w-0 truncate">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-sm text-white truncate">
                                        {champ ? champ.name : pick}
                                      </span>
                                      {isCounter && (
                                        <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 rounded">
                                          COUNTER
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-zinc-400 font-mono block">
                                      {champ?.category || "Champion"}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <span className="text-xs text-zinc-500 font-mono italic">
                                  {isActive ? "👉 Seleccionando campeón..." : "Click para asignar pick R" + (idx + 1)}
                                </span>
                              )}
                            </div>

                            {pick && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClearSlot("red", "pick", idx);
                                }}
                                className="text-zinc-500 hover:text-rose-400 p-1.5 rounded hover:bg-rose-950/30 transition-colors text-xs"
                                title="Quitar campeón"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. HERRAMIENTAS DEL COACH JUSTO DEBAJO: PRIORIDADES, CHAMPS POR ROL,       */}
            {/* FIRST PICKS Y SUGERENCIAS EN DIRECTO PARA LA COMPO OBJETIVO               */}
            {/* ========================================================================= */}
            <div className="space-y-4 pt-2">
              {/* Barra de Selección de Composición Objetivo & Inteligencia en Vivo */}
              <div className="bg-zinc-950 border-2 border-purple-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        <Crosshair className="h-4 w-4" /> COMPANION TÁCTICO EN VIVO // COMPOSICIÓN ACTIVA
                      </span>
                      <span className="bg-purple-900/60 border border-purple-400/50 text-purple-200 text-xs font-mono font-black px-2.5 py-0.5 rounded-full">
                        {currentComp.nombre}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300">
                      Haz clic en cualquier campeón abajo para <strong>lockearlo inmediatamente</strong> en el slot de Void Lynx.
                    </p>
                  </div>

                  {/* Selector Rápido de Composiciones */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                    {compositions.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCompId(c.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                          selectedCompId === c.id
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50 ring-1 ring-purple-400 scale-105"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        {c.nombre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DIRECTRICES Y CONSEJO EN DIRECTO SEGÚN EL TURNO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="p-3 rounded-xl border border-emerald-500/50 bg-emerald-950/30">
                    <span className="text-[10px] font-mono font-black text-emerald-400 uppercase block mb-1">
                      🟢 QUÉ ABRIR EN FASE 1 (B1 / R1-R2):
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Roles prioritarios:{" "}
                      <strong className="text-emerald-300">
                        {VERTICAL_BOARD_ROLES.filter(r => (currentComp.role_priorities?.[r.role] || "Media") === "Alta").map(r => r.role).join(", ") || "Según bans"}
                      </strong>
                      . Lockea sus picks Tier S marcados en verde sin miedo a counterpicks directos.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-amber-500/50 bg-amber-950/30">
                    <span className="text-[10px] font-mono font-black text-amber-400 uppercase block mb-1">
                      🟡 QUÉ CONSOLIDAR EN FASE 2:
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Roles flexibles:{" "}
                      <strong className="text-amber-300">
                        {VERTICAL_BOARD_ROLES.filter(r => (currentComp.role_priorities?.[r.role] || "Media") === "Media").map(r => r.role).join(", ") || "Flex"}
                      </strong>
                      . Completar frontline o peel adaptándote a los bans de la 2ª fase.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-purple-500/50 bg-purple-950/30">
                    <span className="text-[10px] font-mono font-black text-purple-300 uppercase block mb-1">
                      🟣 QUÉ GUARDAR A LAST PICK (R4-R5):
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Línea a proteger:{" "}
                      <strong className="text-purple-300">
                        {VERTICAL_BOARD_ROLES.filter(r => (currentComp.role_priorities?.[r.role] || "Media") === "Baja").map(r => r.role).join(", ") || "Línea clave"}
                      </strong>
                      . ¡NO abras esta posición a ciegas! Espera al rival para destrozarlo en matchup.
                    </p>
                  </div>
                </div>
              </div>

              {/* LAS 5 COLUMNAS VERTICALES EN VIVO (TOP - JNGL - MID - ADC - SUPP) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-stretch">
                {VERTICAL_BOARD_ROLES.map((laneConfig) => {
                  const roleData = getRoleChampsForComp(currentComp.nombre, laneConfig.role, laneConfig.player);
                  const prio = currentComp.role_priorities?.[laneConfig.role] || "Media";
                  const isAlta = prio === "Alta";
                  const isMedia = prio === "Media";

                  const roleWarnings = (currentComp.no_first_pick_reasons || []).filter((w) => {
                    const champ = findChampion(w.champ);
                    if (champ && champ.roles.includes(laneConfig.role)) return true;
                    return [...roleData.S, ...roleData.A, ...roleData.B].some(
                      (e) => e.campeon_id.toLowerCase() === w.champ.toLowerCase()
                    );
                  });

                  const roleCounters = (currentComp.counters_campeones || []).filter((cId) => {
                    const champ = findChampion(cId);
                    return champ && champ.roles.includes(laneConfig.role);
                  });

                  const displayRoleName = laneConfig.role === "JGL" ? "JNGL" : laneConfig.role;

                  return (
                    <div
                      key={laneConfig.role}
                      className={`rounded-2xl border-2 bg-zinc-950/95 flex flex-col justify-between overflow-hidden shadow-2xl transition-all ${
                        isAlta
                          ? "border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                          : isMedia
                          ? "border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                          : "border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                      }`}
                    >
                      {/* Cabecera del Rol con Jugador Titular */}
                      <div>
                        <div className={`p-3 bg-gradient-to-b ${laneConfig.headerGradient} border-b border-zinc-800`}>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5">
                              <RoleIconOnly role={laneConfig.role} size="sm" />
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${laneConfig.badgeBg}`}>
                                {displayRoleName}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-400 font-bold">
                              {laneConfig.player}
                            </span>
                          </div>

                          {/* Directiva de Selección */}
                          <div className={`mt-2 p-1.5 rounded-lg border text-[10px] font-mono font-bold text-center ${
                            isAlta
                              ? "bg-emerald-950/70 border-emerald-500 text-emerald-300"
                              : isMedia
                              ? "bg-amber-950/70 border-amber-500 text-amber-300"
                              : "bg-purple-950/70 border-purple-500 text-purple-300"
                          }`}>
                            {isAlta
                              ? "🟢 FASE 1: ABRIR 1º"
                              : isMedia
                              ? "🟡 FASE 2: FLEXIBLE"
                              : "🟣 FASE 3: LAST PICK"}
                          </div>
                        </div>

                        {/* Listado de Picks por Tiers (S, A, B) */}
                        <div className="p-2.5 space-y-3">
                          {[
                            { name: "TIER S", list: roleData.S, badgeStyle: "text-amber-400 border-amber-500/40 bg-amber-500/20" },
                            { name: "TIER A", list: roleData.A, badgeStyle: "text-purple-300 border-purple-500/40 bg-purple-500/20" },
                            { name: "TIER B", list: roleData.B, badgeStyle: "text-sky-300 border-sky-500/40 bg-sky-500/20" },
                          ].map(({ name, list, badgeStyle }) => (
                            <div key={name} className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className={`font-black px-1.5 py-0.2 rounded border ${badgeStyle}`}>
                                  {name}
                                </span>
                                <span className="text-zinc-500">({list.length})</span>
                              </div>

                              {list.length === 0 ? (
                                <div className="text-[10px] text-zinc-600 italic py-1 text-center">-</div>
                              ) : (
                                <div className="grid grid-cols-2 gap-1.5">
                                  {list.map((entry) => {
                                    const tag = entry.pick_tag || (entry.is_first_pickable ? "FP" : "Normal");
                                    const isUsed = allUsedChampions.has(entry.campeon_id.toLowerCase());
                                    const isFP = tag === "FP";
                                    const isLP = tag === "LP";
                                    const isRisky = tag === "Risky";

                                    return (
                                      <button
                                        key={entry.id}
                                        type="button"
                                        disabled={isUsed}
                                        onClick={() => handleQuickLockFromCompanion(entry.campeon_id)}
                                        title={
                                          isUsed
                                            ? `${entry.campeon_id} ya está en la mesa de draft`
                                            : `Lockear ${entry.campeon_id} para Void Lynx`
                                        }
                                        className={`group relative flex flex-col items-center p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                                          isUsed
                                            ? "bg-zinc-900/40 border-zinc-800 opacity-40 cursor-not-allowed"
                                            : isFP
                                            ? "border-emerald-500/70 bg-emerald-950/40 hover:border-emerald-400 hover:scale-105 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                                            : isLP
                                            ? "border-purple-500/70 bg-purple-950/40 hover:border-purple-400 hover:scale-105 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                                            : isRisky
                                            ? "border-rose-500/70 bg-rose-950/40 hover:border-rose-400 hover:scale-105"
                                            : "border-zinc-700 bg-zinc-900/80 hover:border-zinc-500 hover:scale-105"
                                        }`}
                                      >
                                        {/* Badge de First Pick / Draft Status */}
                                        <span className={`w-full text-[8px] font-mono font-black uppercase py-0.2 px-1 rounded mb-1 truncate ${
                                          isUsed
                                            ? "bg-zinc-800 text-zinc-500"
                                            : isFP
                                            ? "bg-emerald-500 text-black"
                                            : isLP
                                            ? "bg-purple-600 text-white"
                                            : isRisky
                                            ? "bg-rose-600 text-white"
                                            : "bg-zinc-800 text-zinc-300"
                                        }`}>
                                          {isUsed ? "✓ EN MESA" : isFP ? "🟢 ABRIR (FP)" : isLP ? "🟣 LAST PICK" : isRisky ? "🔴 RIESGO" : "🟡 FLEX"}
                                        </span>

                                        <img
                                          src={getChampionAvatar(entry.campeon_id)}
                                          alt={entry.campeon_id}
                                          className={`h-10 w-10 rounded-lg object-cover shadow ${
                                            isFP
                                              ? "border border-emerald-400"
                                              : isLP
                                              ? "border border-purple-400"
                                              : isRisky
                                              ? "border border-rose-500"
                                              : "border border-zinc-700"
                                          }`}
                                        />

                                        <span className="text-[11px] font-bold text-white mt-1 truncate max-w-full leading-tight">
                                          {entry.campeon_id}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Warnings / Counters en el pie de columna */}
                      {(roleWarnings.length > 0 || roleCounters.length > 0) && (
                        <div className="p-2 m-2 rounded-xl bg-rose-950/30 border border-rose-500/30 text-[9px] font-mono space-y-1">
                          <span className="text-rose-400 font-bold block uppercase flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Intel de Línea
                          </span>
                          {roleWarnings.slice(0, 1).map((w, idx) => (
                            <p key={idx} className="text-zinc-300 truncate">
                              <strong className="text-rose-300">{w.champ}:</strong> {w.reason}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. BUSCADOR GENERAL & SELECTOR DE CAMPEÓN PARA EL SLOT ACTIVO */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    activeSlot.side === "blue"
                      ? "bg-blue-950 text-blue-300 border-blue-500/50"
                      : "bg-rose-950 text-rose-300 border-rose-500/50"
                  }`}>
                    Asignando a: {activeSlot.side.toUpperCase()} — {activeSlot.type.toUpperCase()} #{activeSlot.index + 1}
                  </span>
                  <span className="text-xs text-zinc-400">
                    O busca cualquier campeón del catálogo completo:
                  </span>
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="h-4 w-4 absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar campeón en catálogo..."
                    value={draftSearchInput}
                    onChange={(e) => setDraftSearchInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400 font-semibold"
                  />
                  {draftSearchInput && (
                    <button
                      type="button"
                      onClick={() => setDraftSearchInput("")}
                      className="absolute right-2.5 top-2 text-zinc-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Grid de campeones filtrados */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1.5 max-h-48 overflow-y-auto p-1">
                {(draftSearchInput.trim()
                  ? draftSearchMatches
                  : CHAMPIONS_CATALOG.filter((c) => !allUsedChampions.has(c.id.toLowerCase())).slice(0, 24)
                ).map((champ) => (
                  <button
                    key={champ.id}
                    type="button"
                    onClick={() => handleAssignChampion(champ.id)}
                    className="flex flex-col items-center p-1.5 rounded-lg bg-zinc-900 hover:bg-purple-950/60 border border-zinc-800 hover:border-purple-400 transition-all text-center group"
                  >
                    <img
                      src={getChampionAvatar(champ.id)}
                      alt={champ.name}
                      className="h-8 w-8 rounded object-cover border border-zinc-700 group-hover:border-purple-400"
                    />
                    <span className="text-[10px] font-bold text-white truncate max-w-full mt-0.5">
                      {champ.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. NOTAS TÁCTICAS DEL DRAFT // OBSERVACIONES DE LA PARTIDA */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Notas Tácticas del Draft // Adaptaciones de partida:
              </label>
              <textarea
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                placeholder="Apunta aquí la condición de victoria, hechizos de invocador a rastrear, pathing del jungla rival o instrucciones clave para el equipo..."
                rows={2}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
              />
            </div>

            {/* MODAL: HISTORIAL DE DRAFTS GUARDADOS */}
            {showHistoryModal && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-zinc-950 border border-purple-900/50 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/80">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5 text-purple-400" />
                      <h3 className="font-display font-bold text-base uppercase tracking-wider text-white">
                        Historial de Drafts & Scrims Guardadas
                      </h3>
                      <span className="bg-purple-950 text-purple-300 text-xs font-mono px-2 py-0.5 rounded font-bold">
                        {draftsHistory.length} partidas
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowHistoryModal(false)}
                      className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto space-y-3 flex-1">
                    {draftsHistory.length > 0 ? (
                      draftsHistory.map((draft) => (
                        <div
                          key={draft.id}
                          className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 hover:border-purple-500/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-display font-bold text-sm text-white">
                                vs {draft.rival}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                  draft.resultado === "VICTORIA"
                                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                                    : draft.resultado === "DERROTA"
                                    ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                                    : "bg-zinc-800 text-zinc-400"
                                }`}
                              >
                                {draft.resultado}
                              </span>
                              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40">
                                {draft.composicion_id}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500">
                                Lado {draft.nuestro_lado} •{" "}
                                {new Date(draft.created_at).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-mono pt-1">
                              <div className="flex items-center gap-1">
                                <span className="text-blue-400 text-[10px] font-bold">AZUL:</span>
                                {draft.blue_picks?.filter(Boolean).map((p, i) => (
                                  <img
                                    key={i}
                                    src={getChampionAvatar(p)}
                                    alt={p}
                                    title={p}
                                    className="h-5 w-5 rounded object-cover border border-blue-500/40"
                                  />
                                ))}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-rose-400 text-[10px] font-bold">ROJO:</span>
                                {draft.red_picks?.filter(Boolean).map((p, i) => (
                                  <img
                                    key={i}
                                    src={getChampionAvatar(p)}
                                    alt={p}
                                    title={p}
                                    className="h-5 w-5 rounded object-cover border border-rose-500/40"
                                  />
                                ))}
                              </div>
                            </div>

                            {draft.notas && (
                              <p className="text-[11px] text-zinc-400 italic line-clamp-1 pt-0.5">
                                "{draft.notas}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleLoadSavedDraft(draft)}
                              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                            >
                              Cargar en Mesa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSavedDraft(draft.id)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                              title="Eliminar registro"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-zinc-500 text-xs">
                        No hay drafts guardados todavía. Realiza un draft en la mesa y pulsa "Guardar Partida".
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL GLOBAL: CREAR / EDITAR COMPOSICIÓN TÁCTICA & PRIORIDADES DE PICK */}
        {/* ========================================================================= */}
        {editingComp && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-zinc-950 border border-purple-900/60 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg uppercase tracking-wider text-white">
                      {isNewComp ? "Crear Nueva Composición Táctica" : `Editar Composición: ${editingComp.nombre}`}
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Configura el concepto táctico, prioridades de pickeo por rol, first picks seguros y counters directos.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingComp(null)}
                  className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body Scrollable */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* 1. INFORMACIÓN PRINCIPAL */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Nombre de la Composición:
                    </label>
                    <input
                      type="text"
                      value={editingComp.nombre}
                      onChange={(e) => setEditingComp({ ...editingComp, nombre: e.target.value.toUpperCase() })}
                      placeholder="Ej: SIEGE 4, DIVER, TEAMFIGHT..."
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white font-display font-bold text-sm tracking-wide focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Prioridad Global en Draft:
                    </label>
                    <select
                      value={editingComp.prioridad}
                      onChange={(e) => setEditingComp({ ...editingComp, prioridad: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="Alta Prioridad">Alta Prioridad</option>
                      <option value="Media Prioridad">Media Prioridad</option>
                      <option value="Baja Prioridad">Baja Prioridad</option>
                      <option value="Situacional">Situacional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Enfoque Temporal:
                    </label>
                    <select
                      value={editingComp.enfoque}
                      onChange={(e) => setEditingComp({ ...editingComp, enfoque: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="Early Game">Early Game</option>
                      <option value="Early / Mid Game">Early / Mid Game</option>
                      <option value="Mid Game">Mid Game</option>
                      <option value="Mid / Late Game">Mid / Late Game</option>
                      <option value="Late Game">Late Game</option>
                      <option value="Early / Neutrales">Early / Neutrales</option>
                      <option value="Pre y Post 15 min">Pre y Post 15 min</option>
                    </select>
                  </div>
                </div>

                {/* Concepto / Win Condition */}
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Concepto Táctico / Objetivo Clave (Win Condition):
                  </label>
                  <textarea
                    value={editingComp.descripcion}
                    onChange={(e) => setEditingComp({ ...editingComp, descripcion: e.target.value })}
                    placeholder="Describe la condición de victoria: qué líneas se priorizan, cómo se ejecutan las peleas o asedios y cuál es la rotación..."
                    rows={2}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                  />
                </div>

                {/* 2. PRIORIDADES DE PICKEO DE LOS 5 ROLES (EXCEL 5 COLUMNAS) */}
                <div className="bg-zinc-900/60 border border-purple-900/40 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                      ★ Prioridad de Pickeo por Rol (Fila PRIO en Excel):
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Determina qué roles tienen prioridad de pick (Baja, Media o Alta) en esta composición
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(["TOP", "JGL", "MID", "ADC", "SUPP"] as RoleType[]).map((r) => {
                      const curVal = editingComp.role_priorities?.[r] || "Media";
                      return (
                        <div key={r} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-center">
                          <div className="flex items-center justify-center gap-1.5 mb-2 font-mono font-bold text-xs text-zinc-200">
                            <RoleIconOnly role={r} size="sm" />
                            <span>{r}</span>
                          </div>
                          <div className="flex gap-1 justify-center">
                            {(["Baja", "Media", "Alta"] as PriorityLevel[]).map((level) => {
                              const active = curVal === level;
                              return (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => {
                                    setEditingComp({
                                      ...editingComp,
                                      role_priorities: {
                                        ...(editingComp.role_priorities || {
                                          TOP: "Media",
                                          JGL: "Alta",
                                          MID: "Alta",
                                          ADC: "Alta",
                                          SUPP: "Media",
                                        }),
                                        [r]: level,
                                      },
                                    });
                                  }}
                                  className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                                    active
                                      ? level === "Alta"
                                        ? "bg-rose-950 text-rose-300 border border-rose-500 shadow"
                                        : level === "Media"
                                        ? "bg-amber-950 text-amber-300 border border-amber-500 shadow"
                                        : "bg-emerald-950 text-emerald-300 border border-emerald-500 shadow"
                                      : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300"
                                  }`}
                                >
                                  {level}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. COUNTERS DIRECTOS (DESCRIPCIÓN + CAMPEONES) */}
                <div className="bg-zinc-900/40 border border-rose-900/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    <span className="text-[11px] font-mono font-bold text-rose-300 uppercase tracking-wider">
                      Counters Directos (Estilo & Campeones Amenaza):
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">
                      Descripción del estilo rival que anula esta composición:
                    </label>
                    <input
                      type="text"
                      value={editingComp.counters_descripcion}
                      onChange={(e) => setEditingComp({ ...editingComp, counters_descripcion: e.target.value })}
                      placeholder="Ej: Hard engage frontal, flanqueos rápidos y asesinos móviles..."
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1.5">
                      Campeones counters específicos:
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[32px] p-2 bg-zinc-950/70 rounded-lg border border-zinc-800">
                      {editingComp.counters_campeones.length > 0 ? (
                        editingComp.counters_campeones.map((cId) => (
                          <span
                            key={cId}
                            className="inline-flex items-center gap-2 bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs px-2.5 py-1.5 rounded-lg shadow-sm"
                          >
                            <img
                              src={getChampionAvatar(cId)}
                              alt={cId}
                              className="h-7 w-7 rounded-md object-cover border border-rose-500/40"
                            />
                            <span className="font-bold">{cId}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingComp({
                                  ...editingComp,
                                  counters_campeones: editingComp.counters_campeones.filter((c) => c !== cId),
                                });
                              }}
                              className="text-rose-400 hover:text-white font-bold ml-1 text-sm leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-600 italic text-[11px]">No hay campeones counters añadidos.</span>
                      )}
                    </div>

                    {/* Buscador Rápido de Campeones para Añadir */}
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                        <input
                          type="text"
                          value={compCounterSearch}
                          onChange={(e) => setCompCounterSearch(e.target.value)}
                          placeholder="Buscar campeón en catálogo oficial para añadir como counter..."
                          className="w-full bg-zinc-900 border border-zinc-700 pl-8 pr-3 py-1.5 rounded-lg text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      {compCounterSearch.trim().length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-20 mt-1 max-h-40 overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-1 p-1">
                          {CHAMPIONS_CATALOG.filter(
                            (c) =>
                              c.name.toLowerCase().includes(compCounterSearch.toLowerCase()) ||
                              c.id.toLowerCase().includes(compCounterSearch.toLowerCase())
                          )
                            .slice(0, 12)
                            .map((champ) => (
                              <button
                                key={champ.id}
                                type="button"
                                onClick={() => {
                                  if (!editingComp.counters_campeones.includes(champ.id)) {
                                    setEditingComp({
                                      ...editingComp,
                                      counters_campeones: [...editingComp.counters_campeones, champ.id],
                                    });
                                  }
                                  setCompCounterSearch("");
                                }}
                                className="flex items-center gap-1.5 p-1.5 rounded hover:bg-zinc-800 text-left text-zinc-200 transition-colors"
                              >
                                <img
                                  src={getChampionAvatar(champ.id)}
                                  alt={champ.name}
                                  className="h-5 w-5 rounded object-cover"
                                />
                                <span className="text-[11px] truncate">{champ.name}</span>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. FIRST PICKS SEGUROS & BANS RECOMENDADOS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Picks Seguros */}
                  <div className="bg-zinc-900/40 border border-emerald-900/30 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider">
                        First Picks Seguros (B1 / R1-R2):
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-zinc-950/70 rounded-lg border border-zinc-800">
                      {editingComp.first_pick_safe.map((sId) => (
                        <span
                          key={sId}
                          className="inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs px-2.5 py-1.5 rounded-lg shadow-sm"
                        >
                          <img
                            src={getChampionAvatar(sId)}
                            alt={sId}
                            className="h-7 w-7 rounded-md object-cover border border-emerald-500/40"
                          />
                          <span className="font-bold">{sId}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingComp({
                                ...editingComp,
                                first_pick_safe: editingComp.first_pick_safe.filter((c) => c !== sId),
                              });
                            }}
                            className="text-emerald-400 hover:text-white font-bold ml-1 text-sm leading-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Escribe campeón y pulsa Enter para FP..."
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val && !editingComp.first_pick_safe.includes(val)) {
                              const found = findChampion(val);
                              const idToAdd = found ? found.id : val;
                              setEditingComp({
                                ...editingComp,
                                first_pick_safe: [...editingComp.first_pick_safe, idToAdd],
                              });
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Bans Recomendados */}
                  <div className="bg-zinc-900/40 border border-purple-900/30 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-purple-400" />
                      <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                        Bans Recomendados:
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-zinc-950/70 rounded-lg border border-zinc-800">
                      {editingComp.bans_recomendados.map((b) => (
                        <span
                          key={b}
                          className="inline-flex items-center gap-1 bg-purple-950/60 border border-purple-800/60 text-purple-200 text-xs px-2 py-0.5 rounded-md"
                        >
                          <span className="font-semibold">{b}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingComp({
                                ...editingComp,
                                bans_recomendados: editingComp.bans_recomendados.filter((x) => x !== b),
                              });
                            }}
                            className="text-purple-400 hover:text-white font-bold ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newBanInput}
                        onChange={(e) => setNewBanInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newBanInput.trim() && !editingComp.bans_recomendados.includes(newBanInput.trim())) {
                              setEditingComp({
                                ...editingComp,
                                bans_recomendados: [...editingComp.bans_recomendados, newBanInput.trim()],
                              });
                              setNewBanInput("");
                            }
                          }
                        }}
                        placeholder="Nombre de campeón a banear..."
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newBanInput.trim() && !editingComp.bans_recomendados.includes(newBanInput.trim())) {
                            setEditingComp({
                              ...editingComp,
                              bans_recomendados: [...editingComp.bans_recomendados, newBanInput.trim()],
                            });
                            setNewBanInput("");
                          }
                        }}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-semibold text-xs"
                      >
                        + Añadir
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. ADVERTENCIAS: QUÉ NO FIRST-PICKEAR */}
                <div className="bg-zinc-900/40 border border-rose-900/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                      ¿Qué NO Se Debe First-Pickear? (Reservas R4-R5):
                    </span>
                  </div>

                  <div className="space-y-2">
                    {editingComp.no_first_pick_reasons && editingComp.no_first_pick_reasons.length > 0 ? (
                      editingComp.no_first_pick_reasons.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={getChampionAvatar(item.champ)}
                              alt={item.champ}
                              className="h-6 w-6 rounded object-cover border border-rose-500/40 shrink-0"
                            />
                            <span className="font-bold text-xs text-white">{item.champ}:</span>
                            <span className="text-zinc-400 text-xs truncate">{item.reason}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingComp({
                                ...editingComp,
                                no_first_pick_reasons: editingComp.no_first_pick_reasons.filter((_, i) => i !== idx),
                              });
                            }}
                            className="text-zinc-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-zinc-500 text-xs italic block">No hay advertencias configuradas.</span>
                    )}
                  </div>

                  {/* Formulario para añadir advertencia */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-zinc-800">
                    <input
                      type="text"
                      value={newNoFpChamp}
                      onChange={(e) => setNewNoFpChamp(e.target.value)}
                      placeholder="Campeón (ej: Jayce, Lux)..."
                      className="sm:w-1/3 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      value={newNoFpReason}
                      onChange={(e) => setNewNoFpReason(e.target.value)}
                      placeholder="Motivo / Exposición al counter (ej: Inmóvil, diveable)..."
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newNoFpChamp.trim() && newNoFpReason.trim()) {
                          setEditingComp({
                            ...editingComp,
                            no_first_pick_reasons: [
                              ...(editingComp.no_first_pick_reasons || []),
                              { champ: newNoFpChamp.trim(), reason: newNoFpReason.trim() },
                            ],
                          });
                          setNewNoFpChamp("");
                          setNewNoFpReason("");
                        }
                      }}
                      className="px-3 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-200 rounded-lg font-semibold text-xs transition-colors shrink-0"
                    >
                      + Añadir Advertencia
                    </button>
                  </div>
                </div>

                {/* 6. NOTAS DEL STAFF */}
                <div>
                  <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Notas Tácticas del Staff:
                  </label>
                  <textarea
                    value={editingComp.notas_staff}
                    onChange={(e) => setEditingComp({ ...editingComp, notas_staff: e.target.value })}
                    placeholder="Instrucciones internas del coach, directrices de warding o sinergias..."
                    rows={2}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/90">
                <div>
                  {!isNewComp && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComp(editingComp.id)}
                      className="px-3 py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar Composición</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingComp(null)}
                    className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEditingComp}
                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/40 flex items-center gap-1.5 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isNewComp ? "Crear Composición" : "Guardar Cambios"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: AÑADIR CAMPEÓN RÁPIDO A UN ROL EN LA PIZARRA VERTICAL */}
        {quickAddRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-950 border-2 border-purple-500/60 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-950/80 border border-purple-500/40 rounded-xl text-purple-300">
                    <RoleIconOnly role={quickAddRole} size="md" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-white uppercase tracking-wide">
                      Añadir Pick a {quickAddRole} ({PLAYERS_LIST.find((p) => p.role === quickAddRole)?.displayName})
                    </h3>
                    <p className="text-xs text-purple-300/80 font-mono">
                      Para composición: "{currentComp.nombre}"
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickAddRole(null)}
                  className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Selectores de Tier y Tag */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                    Tier Inicial:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["S", "A", "B"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setQuickAddTier(t)}
                        className={`py-1.5 rounded-lg font-mono font-black text-xs border transition-all ${
                          quickAddTier === t
                            ? t === "S"
                              ? "bg-amber-400 text-black border-amber-300"
                              : t === "A"
                              ? "bg-purple-600 text-white border-purple-400"
                              : "bg-blue-600 text-white border-blue-400"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                        }`}
                      >
                        Tier {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                    Etiqueta Táctica de Apertura:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "FP" as const, label: "★ FP", color: "bg-emerald-600 text-white border-emerald-400" },
                      { id: "LP" as const, label: "Last Pick", color: "bg-rose-600 text-white border-rose-400" },
                      { id: "Risky" as const, label: "Risky", color: "bg-amber-500 text-black border-amber-300" },
                    ].map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setQuickAddTag(tag.id)}
                        className={`py-1.5 rounded-lg font-mono font-black text-xs border transition-all ${
                          quickAddTag === tag.id
                            ? tag.color
                            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buscador de Campeón con Autocompletado */}
              <div>
                <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                  Buscar Campeón en el Catálogo:
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    autoFocus
                    value={quickAddSearch}
                    onChange={(e) => setQuickAddSearch(e.target.value)}
                    placeholder="Escribe el nombre del campeón (ej: Aatrox, Mel, Cho'Gath...)"
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Resultados con avatares */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[220px] overflow-y-auto p-1">
                {quickAddMatches.map((champ) => (
                  <button
                    key={champ.id}
                    type="button"
                    onClick={() => handleQuickAddChampion(champ.id)}
                    className="flex items-center gap-2 bg-zinc-900/90 hover:bg-purple-950/80 border border-zinc-800 hover:border-purple-400 rounded-xl p-2 transition-all text-left group"
                  >
                    <img
                      src={getChampionAvatar(champ.id)}
                      alt={champ.name}
                      className="h-10 w-10 rounded-lg object-cover border border-zinc-700 group-hover:border-purple-400 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-white block truncate leading-tight group-hover:text-purple-200">
                        {champ.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 block truncate">
                        {champ.roles.join(", ")}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setQuickAddRole(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
