import { useState, useMemo, useEffect } from "react";
import { CHAMPIONS_CATALOG, findChampion } from "@/data/champions";
import {
  CompositionData,
  INITIAL_COMPOSITIONS,
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
  fetchRemoteDrafts,
  deleteDraftApi,
  fetchRemoteCompositions,
  fetchRemotePlayerChampions,
  loadPlayers,
  savePlayersToStorage,
  fetchRemotePlayers,
  syncPlayersWithApi,
  SavedDraft,
} from "@/lib/staff-storage";
import { RoleType } from "@/components/RoleBadge";
import { ActiveTab, DraftSlot, DraftSequenceStep, LaneConfig } from "./types";
import { ROLE_LANE_METADATA } from "./constants";

export function useStaffState() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("drafter");
  const [compositions, setCompositions] = useState<CompositionData[]>(loadCompositions);
  const [playerChampions, setPlayerChampions] = useState<PlayerChampionEntry[]>(loadPlayerChampions);
  const [players, setPlayers] = useState<PlayerProfile[]>(loadPlayers);
  const [selectedCompId, setSelectedCompId] = useState<string>("siege-4");
  const [activeCompIds, setActiveCompIds] = useState<string[]>(() =>
    loadCompositions().map((c) => c.id)
  );
  const [selectedPlayerName, setSelectedPlayerName] = useState<string>("Kaserolo");
  const [editingPlayer, setEditingPlayer] = useState<PlayerProfile | null>(null);
  const [showPlayerModal, setShowPlayerModal] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<"synced" | "saving" | "unsaved">("saving");
  const [playerViewMode, setPlayerViewMode] = useState<"tierlist" | "grid">("tierlist");
  const [draftsHistory, setDraftsHistory] = useState<SavedDraft[]>(loadDraftHistory);

  // Jugador actual seleccionado
  const selectedPlayer: PlayerProfile =
    players.find((p) => p.name === selectedPlayerName) || players[0] || PLAYERS_LIST[0]!;

  // Quinteto titular oficial
  const starterPlayers: PlayerProfile[] = useMemo(() => {
    return players.filter((p) => p.isStarter);
  }, [players]);

  // Roles dinámicos de la pizarra vertical basados en los titulares actuales
  const verticalBoardRoles: LaneConfig[] = useMemo(() => {
    return (["TOP", "JGL", "MID", "ADC", "SUPP"] as RoleType[]).map((role) => {
      const starter = players.find((p) => p.role === role && p.isStarter) || players.find((p) => p.role === role);
      const meta = ROLE_LANE_METADATA[role];
      return {
        role,
        player: starter?.name || "Sin Jugador",
        laneTitle: meta.laneTitle,
        badgeBg: meta.badgeBg,
        textColor: meta.textColor,
        borderAccent: meta.borderAccent,
        headerGradient: meta.headerGradient,
        tagline: meta.tagline,
      };
    });
  }, [players]);

  // Composición actual seleccionada en el drafter
  const currentComp: CompositionData = compositions.find((c) => c.id === selectedCompId) || compositions[0] || INITIAL_COMPOSITIONS[0]!;

  // Helper para guardar cambios
  const handlePersist = (newComps: CompositionData[], newChamps: PlayerChampionEntry[]) => {
    setCompositions(newComps);
    setPlayerChampions(newChamps);
    saveCompositionsToStorage(newComps);
    savePlayerChampionsToStorage(newChamps);
    setSaveStatus("saving");
    Promise.all([syncCompositionsWithApi(newComps), syncPlayerChampionsWithApi(newChamps)])
      .then(([compsOk, champsOk]) => {
        if (compsOk && champsOk) {
          setSaveStatus("synced");
        } else {
          setSaveStatus("unsaved");
        }
      })
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
    Promise.all([
      fetchRemoteCompositions(),
      fetchRemotePlayerChampions(),
      fetchRemoteDrafts(),
      fetchRemotePlayers(),
    ])
      .then(([remoteComps, remoteChamps, remoteDrafts, remotePlayers]) => {
        if (remoteComps && remoteComps.length > 0) {
          setCompositions(remoteComps);
          setActiveCompIds((prev) => {
            const remoteIds = remoteComps.map((c) => c.id);
            if (prev.length === 0) return remoteIds;
            const valid = prev.filter((id) => remoteIds.includes(id));
            return valid.length > 0 ? valid : remoteIds;
          });
        }
        if (remoteChamps && remoteChamps.length > 0) {
          setPlayerChampions(remoteChamps);
        }
        if (remoteDrafts && remoteDrafts.length > 0) {
          setDraftsHistory(remoteDrafts);
        }
        if (remotePlayers && remotePlayers.length > 0) {
          setPlayers(remotePlayers);
        }
        if (remoteComps || remoteChamps || remoteDrafts || remotePlayers) {
          setSaveStatus("synced");
        } else {
          setSaveStatus("unsaved");
        }
      })
      .catch(() => {
        setSaveStatus("unsaved");
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

  // Modo de visualización en el Asistente de Draft Táctico
  const [drafterViewMode, setDrafterViewMode] = useState<"vertical" | "matrix" | "cards" | "counters">("vertical");
  const [matrixShowAll, setMatrixShowAll] = useState<boolean>(true);
  const [drafterPickHighlight, setDrafterPickHighlight] = useState<"ALL" | "FP" | "LP" | "RISKY">("ALL");
  const [counterRoleFilter, setCounterRoleFilter] = useState<RoleType>("ADC");

  // Handlers para activar / desactivar composiciones en el asistente
  const handleToggleCompActive = (id: string) => {
    setActiveCompIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((cId) => cId !== id);
        if (selectedCompId === id && next.length > 0) {
          setSelectedCompId(next[0]!);
        }
        return next;
      } else {
        return [...prev, id];
      }
    });
  };

  const handleActivateAllComps = () => {
    setActiveCompIds(compositions.map((c) => c.id));
  };

  const handleDeactivateAllComps = () => {
    setActiveCompIds([]);
  };

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
        setSelectedCompId(updated[0]?.id || "siege-4");
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
      ? players.find((p) => p.name === playerName)
      : players.find((p) => p.role === role && p.isStarter) || players.find((p) => p.role === role);

    if (!targetPlayer) return { player: players[0] || PLAYERS_LIST[0], S: [], A: [], B: [], C: [] };

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
    const player = players.find((p) => p.role === quickAddRole && p.isStarter) || players.find((p) => p.role === quickAddRole);
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

  const handleUpdateTier = (id: string, newTier: "S" | "A" | "B" | "C") => {
    const updated = playerChampions.map((item) =>
      item.id === id ? { ...item, tier: newTier } : item
    );
    handlePersist(compositions, updated);
  };

  const handleShiftTier = (id: string, direction: "up" | "down") => {
    const order: ("C" | "B" | "A" | "S")[] = ["C", "B", "A", "S"];
    const entry = playerChampions.find((p) => p.id === id);
    if (!entry) return;
    const currentIdx = order.indexOf(entry.tier as any);
    if (currentIdx === -1) return;
    const targetIdx = direction === "up" ? Math.min(order.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
    const nextTier = order[targetIdx];
    if (nextTier && targetIdx !== currentIdx) {
      handleUpdateTier(id, nextTier);
    }
  };

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

  const handleToggleFirstPick = (id: string) => {
    const updated = playerChampions.map((item) =>
      item.id === id ? { ...item, is_first_pickable: !item.is_first_pickable } : item
    );
    handlePersist(compositions, updated);
  };

  const handleDeleteChamp = (id: string) => {
    const updated = playerChampions.filter((item) => item.id !== id);
    handlePersist(compositions, updated);
  };

  // Handlers para gestión de jugadores (Añadir, Editar, Titular / Suplente, Borrar)
  const handleOpenAddPlayer = () => {
    setEditingPlayer(null);
    setShowPlayerModal(true);
  };

  const handleOpenEditPlayer = (player: PlayerProfile) => {
    setEditingPlayer(player);
    setShowPlayerModal(true);
  };

  const handleClosePlayerModal = () => {
    setEditingPlayer(null);
    setShowPlayerModal(false);
  };

  const handleAddPlayer = (newPlayer: PlayerProfile) => {
    setPlayers((prev) => {
      let updated = [...prev];
      if (newPlayer.isStarter) {
        updated = updated.map((p) => (p.role === newPlayer.role ? { ...p, isStarter: false } : p));
      }
      const next = [...updated, newPlayer];
      savePlayersToStorage(next);
      syncPlayersWithApi(next).catch(() => {});
      return next;
    });
    setSelectedPlayerName(newPlayer.name);
  };

  const handleUpdatePlayer = (originalName: string, updatedData: Partial<PlayerProfile>) => {
    setPlayers((prev) => {
      const updated = prev.map((p) => {
        if (p.name === originalName) {
          return { ...p, ...updatedData };
        }
        if (updatedData.isStarter && p.role === (updatedData.role || p.role)) {
          return { ...p, isStarter: false };
        }
        return p;
      });
      savePlayersToStorage(updated);
      syncPlayersWithApi(updated).catch(() => {});
      return updated;
    });

    if (updatedData.name && updatedData.name !== originalName) {
      setSelectedPlayerName(updatedData.name);
      setPlayerChampions((prevChamps) => {
        const nextChamps = prevChamps.map((pc) =>
          pc.jugador === originalName ? { ...pc, jugador: updatedData.name! } : pc
        );
        savePlayerChampionsToStorage(nextChamps);
        syncPlayerChampionsWithApi(nextChamps).catch(() => {});
        return nextChamps;
      });
    }
  };

  const handleToggleStarter = (playerName: string) => {
    setPlayers((prev) => {
      const target = prev.find((p) => p.name === playerName);
      if (!target) return prev;
      const willBeStarter = !target.isStarter;

      const updated = prev.map((p) => {
        if (p.name === playerName) {
          return { ...p, isStarter: willBeStarter };
        }
        if (willBeStarter && p.role === target.role) {
          return { ...p, isStarter: false };
        }
        return p;
      });
      savePlayersToStorage(updated);
      syncPlayersWithApi(updated).catch(() => {});
      return updated;
    });
  };

  const handleDeletePlayer = (playerName: string) => {
    setPlayers((prev) => {
      const next = prev.filter((p) => p.name !== playerName);
      savePlayersToStorage(next);
      syncPlayersWithApi(next).catch(() => {});
      if (selectedPlayerName === playerName && next.length > 0) {
        setSelectedPlayerName(next[0]!.name);
      }
      return next;
    });
  };

  // Análisis de draft para la composición seleccionada
  const compDraftAnalysis = useMemo(() => {
    if (!currentComp) return null;

    const relevantChamps = playerChampions.filter((pc) =>
      pc.tipos_comp.includes(currentComp.nombre)
    );

    const getStarterForRole = (r: RoleType) =>
      players.find((p) => p.role === r && p.isStarter) ||
      players.find((p) => p.role === r) ||
      PLAYERS_LIST.find((p) => p.role === r) ||
      players[0] ||
      PLAYERS_LIST[0]!;

    const byRole: Record<string, { player: PlayerProfile; champs: PlayerChampionEntry[] }> = {
      TOP: { player: getStarterForRole("TOP"), champs: [] },
      JGL: { player: getStarterForRole("JGL"), champs: [] },
      MID: { player: getStarterForRole("MID"), champs: [] },
      ADC: { player: getStarterForRole("ADC"), champs: [] },
      SUPP: { player: getStarterForRole("SUPP"), champs: [] },
    };

    relevantChamps.forEach((entry) => {
      const profile = players.find((p) => p.name === entry.jugador) || PLAYERS_LIST.find((p) => p.name === entry.jugador);
      if (profile && byRole[profile.role]) {
        byRole[profile.role]!.champs.push(entry);
      }
    });

    const tierWeight: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };
    Object.keys(byRole).forEach((role) => {
      byRole[role]?.champs.sort((a, b) => (tierWeight[b.tier] || 0) - (tierWeight[a.tier] || 0));
    });

    const safeFirstPicks = relevantChamps.filter((pc) => {
      const isHighTier = pc.tier === "S" || pc.tier === "A";
      const isMarked = pc.is_first_pickable !== false;
      const isKnownSafe = currentComp.first_pick_safe.some(
        (c) => c.toLowerCase() === pc.campeon_id.toLowerCase()
      );
      return isHighTier && (isMarked || isKnownSafe);
    });

    let coveredRolesCount = 0;
    Object.keys(byRole).forEach((role) => {
      const hasHighTier = byRole[role]?.champs.some((c) => c.tier === "S" || c.tier === "A");
      if (hasHighTier) coveredRolesCount++;
    });

    return {
      byRole,
      safeFirstPicks,
      coveredRolesCount,
    };
  }, [currentComp, playerChampions]);

  // ==========================================
  // SALA DE DRAFT & HISTORIAL
  // ==========================================
  const [ourSide, setOurSide] = useState<"BLUE" | "RED">("BLUE");
  const [rivalName, setRivalName] = useState<string>("Rival Scrim");
  const [matchResult, setMatchResult] = useState<"VICTORIA" | "DERROTA" | "PENDING">("PENDING");
  const [draftNotes, setDraftNotes] = useState<string>("");
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [draftSaveNotification, setDraftSaveNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 5 Picks y 5 Bans para cada bando
  const [bluePicks, setBluePicks] = useState<string[]>(["", "", "", "", ""]);
  const [blueBans, setBlueBans] = useState<string[]>(["", "", "", "", ""]);
  const [redPicks, setRedPicks] = useState<string[]>(["", "", "", "", ""]);
  const [redBans, setRedBans] = useState<string[]>(["", "", "", "", ""]);

  const [activeSlot, setActiveSlot] = useState<DraftSlot>({ side: "blue", type: "pick", index: 0 });
  const [draftSearchInput, setDraftSearchInput] = useState<string>("");



  // Secuencia oficial de draft competitivo
  const DRAFT_SEQUENCE: DraftSequenceStep[] = useMemo(() => [
    { phase: "BANS_1", side: "blue", type: "ban", index: 0, label: "B1 Ban", ourTurn: ourSide === "BLUE" },
    { phase: "BANS_1", side: "red", type: "ban", index: 0, label: "R1 Ban", ourTurn: ourSide === "RED" },
    { phase: "BANS_1", side: "blue", type: "ban", index: 1, label: "B2 Ban", ourTurn: ourSide === "BLUE" },
    { phase: "BANS_1", side: "red", type: "ban", index: 1, label: "R2 Ban", ourTurn: ourSide === "RED" },
    { phase: "BANS_1", side: "blue", type: "ban", index: 2, label: "B3 Ban", ourTurn: ourSide === "BLUE" },
    { phase: "BANS_1", side: "red", type: "ban", index: 2, label: "R3 Ban", ourTurn: ourSide === "RED" },
    { phase: "PICKS_1", side: "blue", type: "pick", index: 0, label: "B1 Pick", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_1", side: "red", type: "pick", index: 0, label: "R1 Pick", ourTurn: ourSide === "RED" },
    { phase: "PICKS_1", side: "red", type: "pick", index: 1, label: "R2 Pick", ourTurn: ourSide === "RED" },
    { phase: "PICKS_1", side: "blue", type: "pick", index: 1, label: "B2 Pick", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_1", side: "blue", type: "pick", index: 2, label: "B3 Pick", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_1", side: "red", type: "pick", index: 2, label: "R3 Pick", ourTurn: ourSide === "RED" },
    { phase: "BANS_2", side: "red", type: "ban", index: 3, label: "R4 Ban", ourTurn: ourSide === "RED" },
    { phase: "BANS_2", side: "blue", type: "ban", index: 3, label: "B4 Ban", ourTurn: ourSide === "BLUE" },
    { phase: "BANS_2", side: "red", type: "ban", index: 4, label: "R5 Ban", ourTurn: ourSide === "RED" },
    { phase: "BANS_2", side: "blue", type: "ban", index: 4, label: "B5 Ban", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_2", side: "red", type: "pick", index: 3, label: "R4 Pick", ourTurn: ourSide === "RED" },
    { phase: "PICKS_2", side: "blue", type: "pick", index: 3, label: "B4 Pick", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_2", side: "blue", type: "pick", index: 4, label: "B5 Pick", ourTurn: ourSide === "BLUE" },
    { phase: "PICKS_2", side: "red", type: "pick", index: 4, label: "R5 Pick", ourTurn: ourSide === "RED" },
  ], [ourSide]);

  const currentTurnStep = useMemo(() => {
    return DRAFT_SEQUENCE.find((step) => {
      const val = step.side === "blue"
        ? (step.type === "pick" ? bluePicks[step.index] : blueBans[step.index])
        : (step.type === "pick" ? redPicks[step.index] : redBans[step.index]);
      return !val;
    }) || null;
  }, [DRAFT_SEQUENCE, bluePicks, blueBans, redPicks, redBans]);

  const allUsedChampions = useMemo(() => {
    const used = new Set<string>();
    [...bluePicks, ...blueBans, ...redPicks, ...redBans].forEach((c) => {
      if (c && c.trim()) used.add(c.toLowerCase());
    });
    return used;
  }, [bluePicks, blueBans, redPicks, redBans]);

  const handleLockChampion = (
    champId: string,
    customSlot?: DraftSlot
  ) => {
    if (allUsedChampions.has(champId.toLowerCase())) {
      return;
    }

    let target = customSlot ? { ...customSlot } : { ...activeSlot };

    const currentVal = target.side === "blue"
      ? (target.type === "pick" ? bluePicks[target.index] : blueBans[target.index])
      : (target.type === "pick" ? redPicks[target.index] : redBans[target.index]);

    if (currentVal) {
      if (currentTurnStep) {
        target = {
          side: currentTurnStep.side,
          type: currentTurnStep.type,
          index: currentTurnStep.index,
        };
      } else {
        const preferredSide = target.side;
        const picksList = preferredSide === "blue" ? bluePicks : redPicks;
        const emptyIdx = picksList.findIndex((p) => !p);
        if (emptyIdx !== -1) {
          target = { side: preferredSide, type: "pick", index: emptyIdx };
        } else {
          return;
        }
      }
    }

    if (target.side === "blue") {
      if (target.type === "pick") {
        const next = [...bluePicks];
        next[target.index] = champId;
        setBluePicks(next);
      } else {
        const next = [...blueBans];
        next[target.index] = champId;
        setBlueBans(next);
      }
    } else {
      if (target.type === "pick") {
        const next = [...redPicks];
        next[target.index] = champId;
        setRedPicks(next);
      } else {
        const next = [...redBans];
        next[target.index] = champId;
        setRedBans(next);
      }
    }

    setDraftSearchInput("");

    const currentSeqIdx = DRAFT_SEQUENCE.findIndex(
      (s) => s.side === target.side && s.type === target.type && s.index === target.index
    );

    const isSlotEmptyAfter = (s: DraftSequenceStep) => {
      if (s.side === target.side && s.type === target.type && s.index === target.index) return false;
      const v = s.side === "blue"
        ? (s.type === "pick" ? bluePicks[s.index] : blueBans[s.index])
        : (s.type === "pick" ? redPicks[s.index] : redBans[s.index]);
      return !v;
    };

    let nextStep = DRAFT_SEQUENCE.slice(currentSeqIdx + 1).find(isSlotEmptyAfter);
    if (!nextStep) {
      nextStep = DRAFT_SEQUENCE.find(isSlotEmptyAfter);
    }

    if (nextStep) {
      setActiveSlot({
        side: nextStep.side,
        type: nextStep.type,
        index: nextStep.index,
      });
    }


  };

  const handleNextTurnStep = () => {
    const currentSeqIdx = DRAFT_SEQUENCE.findIndex(
      (s) => s.side === activeSlot.side && s.type === activeSlot.type && s.index === activeSlot.index
    );
    if (currentSeqIdx !== -1 && currentSeqIdx < DRAFT_SEQUENCE.length - 1) {
      const next = DRAFT_SEQUENCE[currentSeqIdx + 1];
      if (next) {
        setActiveSlot({ side: next.side, type: next.type, index: next.index });
      }
    }
  };

  const handlePrevTurnStep = () => {
    const currentSeqIdx = DRAFT_SEQUENCE.findIndex(
      (s) => s.side === activeSlot.side && s.type === activeSlot.type && s.index === activeSlot.index
    );
    if (currentSeqIdx > 0) {
      const prev = DRAFT_SEQUENCE[currentSeqIdx - 1];
      if (prev) {
        setActiveSlot({ side: prev.side, type: prev.type, index: prev.index });
      }
    }
  };



  const handleCopyDraftSummary = () => {
    const bTeam = ourSide === "BLUE" ? "Void Lynx" : rivalName;
    const rTeam = ourSide === "RED" ? "Void Lynx" : rivalName;
    const text = `🏆 DRAFT VOID LYNX vs ${rivalName} (${currentComp.nombre})
--------------------------------------
🔵 LADO AZUL (${bTeam}):
• Bans: ${blueBans.filter(Boolean).join(", ") || "Ninguno"}
• Picks: ${bluePicks.filter(Boolean).join(", ") || "Ninguno"}

🔴 LADO ROJO (${rTeam}):
• Bans: ${redBans.filter(Boolean).join(", ") || "Ninguno"}
• Picks: ${redPicks.filter(Boolean).join(", ") || "Ninguno"}
--------------------------------------`;
    navigator.clipboard.writeText(text);
    alert("✓ Resumen del Draft copiado al portapapeles (listo para Discord).");
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
    setActiveSlot({ side, type, index });
  };

  const handleResetDraftBoard = () => {
    setBluePicks(["", "", "", "", ""]);
    setBlueBans(["", "", "", "", ""]);
    setRedPicks(["", "", "", "", ""]);
    setRedBans(["", "", "", "", ""]);
    setActiveSlot({ side: "blue", type: "pick", index: 0 });
    setDraftSearchInput("");
    setActiveCompIds(compositions.map((c) => c.id));
    setDraftNotes("");
  };

  // Guardar draft en el historial & sincronizar con BBDD
  const handleSaveCurrentDraft = async () => {
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
    setDraftSaveNotification({ message: `Guardando draft contra ${newDraft.rival} en BBDD...`, type: "success" });

    const synced = await syncDraftWithApi(newDraft);
    if (synced) {
      setDraftSaveNotification({ message: `✓ Draft contra ${newDraft.rival} guardado y sincronizado en BBDD (D1).`, type: "success" });
    } else {
      setDraftSaveNotification({ message: `✓ Draft guardado localmente (sin conexión a D1).`, type: "success" });
    }
    setTimeout(() => setDraftSaveNotification(null), 4500);
  };

  const handleUpdateDraftResult = async (id: string, newResult: "VICTORIA" | "DERROTA" | "PENDING") => {
    const target = draftsHistory.find((d) => d.id === id);
    if (!target) return;
    const updatedDraft: SavedDraft = { ...target, resultado: newResult };
    const updatedList = saveDraftToStorage(updatedDraft);
    setDraftsHistory(updatedList);
    await syncDraftWithApi(updatedDraft);
  };

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
    setActiveTab("live");
  };

  const handleDeleteSavedDraft = async (id: string) => {
    if (window.confirm("¿Seguro que quieres eliminar este draft del registro histórico de la BBDD?")) {
      const updated = deleteDraftFromStorage(id);
      setDraftsHistory(updated);
      await deleteDraftApi(id);
    }
  };

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

  const draftSearchMatches = useMemo(() => {
    if (!draftSearchInput.trim()) return [];
    const q = draftSearchInput.toLowerCase().replace(/['\s]/g, "");
    return CHAMPIONS_CATALOG.filter((c) => {
      const matchId = c.id.toLowerCase().replace(/['\s]/g, "").includes(q);
      const matchName = c.name.toLowerCase().replace(/['\s]/g, "").includes(q);
      return matchId || matchName;
    }).slice(0, 24);
  }, [draftSearchInput]);

  // Filtros y KPIs de Scrims para Tab 5
  const [historySearch, setHistorySearch] = useState<string>("");
  const [historyFilterResult, setHistoryFilterResult] = useState<"ALL" | "VICTORIA" | "DERROTA" | "PENDING">("ALL");
  const [historyFilterSide, setHistoryFilterSide] = useState<"ALL" | "BLUE" | "RED">("ALL");
  const [historyFilterComp, setHistoryFilterComp] = useState<string>("ALL");

  const draftStats = useMemo(() => {
    const total = draftsHistory.length;
    const wins = draftsHistory.filter((d) => d.resultado === "VICTORIA").length;
    const losses = draftsHistory.filter((d) => d.resultado === "DERROTA").length;
    const pending = draftsHistory.filter((d) => d.resultado === "PENDING").length;
    const decided = wins + losses;
    const winrate = decided > 0 ? Math.round((wins / decided) * 100) : 0;

    const blueDrafts = draftsHistory.filter((d) => d.nuestro_lado === "BLUE");
    const blueWins = blueDrafts.filter((d) => d.resultado === "VICTORIA").length;
    const blueDecided = blueDrafts.filter((d) => d.resultado !== "PENDING").length;
    const blueWR = blueDecided > 0 ? Math.round((blueWins / blueDecided) * 100) : 0;

    const redDrafts = draftsHistory.filter((d) => d.nuestro_lado === "RED");
    const redWins = redDrafts.filter((d) => d.resultado === "VICTORIA").length;
    const redDecided = redDrafts.filter((d) => d.resultado !== "PENDING").length;
    const redWR = redDecided > 0 ? Math.round((redWins / redDecided) * 100) : 0;

    const compStatsMap: Record<string, { total: number; wins: number; losses: number; pending: number }> = {};
    draftsHistory.forEach((d) => {
      const comp = d.composicion_id || "Sin Composición";
      if (!compStatsMap[comp]) {
        compStatsMap[comp] = { total: 0, wins: 0, losses: 0, pending: 0 };
      }
      compStatsMap[comp].total++;
      if (d.resultado === "VICTORIA") compStatsMap[comp].wins++;
      else if (d.resultado === "DERROTA") compStatsMap[comp].losses++;
      else compStatsMap[comp].pending++;
    });

    const compStatsList = Object.entries(compStatsMap)
      .map(([compName, data]) => {
        const dec = data.wins + data.losses;
        const wr = dec > 0 ? Math.round((data.wins / dec) * 100) : 0;
        return { compName, ...data, winrate: wr };
      })
      .sort((a, b) => b.total - a.total);

    return {
      total,
      wins,
      losses,
      pending,
      winrate,
      blueWR,
      blueWins,
      blueDrafts: blueDrafts.length,
      redWR,
      redWins,
      redDrafts: redDrafts.length,
      compStatsList,
    };
  }, [draftsHistory]);

  const filteredHistory = useMemo(() => {
    return draftsHistory.filter((d) => {
      if (historyFilterResult !== "ALL" && d.resultado !== historyFilterResult) return false;
      if (historyFilterSide !== "ALL" && d.nuestro_lado !== historyFilterSide) return false;
      if (historyFilterComp !== "ALL" && d.composicion_id !== historyFilterComp) return false;
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase();
        const rivalMatch = d.rival.toLowerCase().includes(q);
        const compMatch = d.composicion_id.toLowerCase().includes(q);
        const notesMatch = (d.notas || "").toLowerCase().includes(q);
        const picksMatch = [...(d.blue_picks || []), ...(d.red_picks || [])].some((p) => p.toLowerCase().includes(q));
        if (!rivalMatch && !compMatch && !notesMatch && !picksMatch) return false;
      }
      return true;
    });
  }, [draftsHistory, historyFilterResult, historyFilterSide, historyFilterComp, historySearch]);

  return {
    activeTab,
    setActiveTab,
    compositions,
    setCompositions,
    playerChampions,
    setPlayerChampions,
    selectedCompId,
    setSelectedCompId,
    selectedPlayerName,
    setSelectedPlayerName,
    selectedPlayer,
    currentComp,
    saveStatus,
    handlePersist,
    handleReset,
    playerViewMode,
    setPlayerViewMode,
    // Roster & Jugadores
    players,
    setPlayers,
    starterPlayers,
    verticalBoardRoles,
    editingPlayer,
    setEditingPlayer,
    showPlayerModal,
    setShowPlayerModal,
    handleOpenAddPlayer,
    handleOpenEditPlayer,
    handleClosePlayerModal,
    handleAddPlayer,
    handleUpdatePlayer,
    handleToggleStarter,
    handleDeletePlayer,
    // Jugadores Champ Pools
    playerFilterTier,
    setPlayerFilterTier,
    playerFilterComp,
    setPlayerFilterComp,
    newChampSearch,
    setNewChampSearch,
    newChampTier,
    setNewChampTier,
    newChampComps,
    setNewChampComps,
    newChampFirstPick,
    setNewChampFirstPick,
    filteredPlayerChamps,
    champSearchResults,
    handleAddChampToPlayer,
    handleUpdateTier,
    handleShiftTier,
    handleToggleChampComp,
    handleToggleFirstPick,
    handleDeleteChamp,
    // Asistente Táctico
    activeCompIds,
    setActiveCompIds,
    handleToggleCompActive,
    handleActivateAllComps,
    handleDeactivateAllComps,
    counterRoleFilter,
    setCounterRoleFilter,
    drafterViewMode,
    setDrafterViewMode,
    matrixShowAll,
    setMatrixShowAll,
    drafterPickHighlight,
    setDrafterPickHighlight,
    quickAddRole,
    setQuickAddRole,
    quickAddSearch,
    setQuickAddSearch,
    quickAddTier,
    setQuickAddTier,
    quickAddTag,
    setQuickAddTag,
    quickAddMatches,
    handleQuickAddChampion,
    handleCycleRolePriority,
    handleCyclePickTag,
    getRoleChampsForComp,
    handleRemoveChampFromComp,
    compDraftAnalysis,
    // Composición Modal
    editingComp,
    setEditingComp,
    isNewComp,
    compCounterSearch,
    setCompCounterSearch,
    newNoFpChamp,
    setNewNoFpChamp,
    newNoFpReason,
    setNewNoFpReason,
    newBanInput,
    setNewBanInput,
    handleOpenCreateComp,
    handleOpenEditComp,
    handleSaveEditingComp,
    handleDeleteComp,
    // Draft en Vivo
    draftsHistory,
    setDraftsHistory,
    ourSide,
    setOurSide,
    rivalName,
    setRivalName,
    matchResult,
    setMatchResult,
    draftNotes,
    setDraftNotes,
    showHistoryModal,
    setShowHistoryModal,
    draftSaveNotification,
    bluePicks,
    setBluePicks,
    blueBans,
    setBlueBans,
    redPicks,
    setRedPicks,
    redBans,
    setRedBans,
    activeSlot,
    setActiveSlot,
    draftSearchInput,
    setDraftSearchInput,

    handleCopyDraftSummary,
    handleClearSlot,
    handleResetDraftBoard,
    handleSaveCurrentDraft,
    handleUpdateDraftResult,
    handleLoadSavedDraft,
    handleDeleteSavedDraft,
    enemyCountersDetected,
    voidLynxSuggestions,
    draftSearchMatches,
    // Historial y Stats
    historySearch,
    setHistorySearch,
    historyFilterResult,
    setHistoryFilterResult,
    historyFilterSide,
    setHistoryFilterSide,
    historyFilterComp,
    setHistoryFilterComp,
    draftStats,
    filteredHistory,
  };
}
