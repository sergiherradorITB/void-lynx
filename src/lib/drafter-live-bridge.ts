import { io, Socket } from "socket.io-client";
import { findChampion } from "@/data/champions";

export type DrafterConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export interface DrafterRoomState {
  roomId: string;
  step: string;
  currentTime: number;
  blueName: string;
  redName: string;
  blueReady: boolean;
  redReady: boolean;
  done: boolean;
  bluePicks: string[];
  blueBans: string[];
  redPicks: string[];
  redBans: string[];
  drafter?: {
    blue?: { id: string; team: string };
    red?: { id: string; team: string };
  };
}

export interface DrafterBridgeCallbacks {
  onStatusChange?: (status: DrafterConnectionStatus, message?: string) => void;
  onStateUpdate?: (state: DrafterRoomState) => void;
  onActionSent?: (action: string, detail?: string) => void;
}

class DrafterLiveBridge {
  private socket: Socket | null = null;
  private currentRoomId: string = "";
  private status: DrafterConnectionStatus = "disconnected";
  private callbacks: DrafterBridgeCallbacks = {};
  private ourSide: "BLUE" | "RED" = "BLUE";
  private ourTeamName: string = "Void Lynx";
  private rivalTeamName: string = "";

  public getStatus(): DrafterConnectionStatus {
    return this.status;
  }

  public getRoomId(): string {
    return this.currentRoomId;
  }

  public isConnected(): boolean {
    return this.status === "connected" && !!this.socket?.connected;
  }

  /**
   * Extrae el ID limpio de sala a partir de cualquier formato de URL o ID
   */
  public cleanRoomId(inputUrlOrId: string): string {
    if (!inputUrlOrId) return "";
    return inputUrlOrId
      .trim()
      .replace(/^https?:\/\/(www\.)?drafter\.lol\/(draft\/)?/, "")
      .split("?")[0]
      .split("/")[0]
      .trim();
  }

  /**
   * Conecta a una sala de Drafter.lol vía socket.io
   */
  public connect(
    roomIdOrUrl: string,
    options: {
      side?: "BLUE" | "RED";
      ourTeamName?: string;
      rivalTeamName?: string;
      callbacks?: DrafterBridgeCallbacks;
    } = {}
  ): void {
    const cleanId = this.cleanRoomId(roomIdOrUrl);
    if (!cleanId) {
      this.setStatus("error", "ID o URL de sala de Drafter no válido.");
      return;
    }

    if (options.callbacks) {
      this.callbacks = { ...this.callbacks, ...options.callbacks };
    }
    if (options.side) this.ourSide = options.side;
    if (options.ourTeamName) this.ourTeamName = options.ourTeamName;
    if (options.rivalTeamName) this.rivalTeamName = options.rivalTeamName;

    // Si ya estamos conectados a esta misma sala, no reconectar
    if (this.socket && this.currentRoomId === cleanId && this.socket.connected) {
      return;
    }

    this.disconnect();
    this.currentRoomId = cleanId;
    this.setStatus("connecting", `Conectando con Drafter.lol (${cleanId})...`);

    try {
      this.socket = io("https://socket.drafter.lol/guest", {
        transports: ["websocket", "polling"],
        extraHeaders: {
          Origin: "https://drafter.lol",
        },
        timeout: 8000,
      });

      this.socket.on("connect", () => {
        this.setStatus("connected", `Conectado a Drafter.lol (${cleanId})`);
        this.socket?.emit("join-room", cleanId);
      });

      this.socket.on("update-state", (data: any) => {
        if (!data || !data.draft) return;

        const bPicks = [
          data.draft.pick?.blue?.["1"] || "",
          data.draft.pick?.blue?.["2"] || "",
          data.draft.pick?.blue?.["3"] || "",
          data.draft.pick?.blue?.["4"] || "",
          data.draft.pick?.blue?.["5"] || "",
        ];
        const bBans = [
          data.draft.ban?.blue?.["1"] || "",
          data.draft.ban?.blue?.["2"] || "",
          data.draft.ban?.blue?.["3"] || "",
          data.draft.ban?.blue?.["4"] || "",
          data.draft.ban?.blue?.["5"] || "",
        ];
        const rPicks = [
          data.draft.pick?.red?.["1"] || "",
          data.draft.pick?.red?.["2"] || "",
          data.draft.pick?.red?.["3"] || "",
          data.draft.pick?.red?.["4"] || "",
          data.draft.pick?.red?.["5"] || "",
        ];
        const rBans = [
          data.draft.ban?.red?.["1"] || "",
          data.draft.ban?.red?.["2"] || "",
          data.draft.ban?.red?.["3"] || "",
          data.draft.ban?.red?.["4"] || "",
          data.draft.ban?.red?.["5"] || "",
        ];

        const roomState: DrafterRoomState = {
          roomId: cleanId,
          step: data.step || "",
          currentTime: typeof data.currentTime === "number" ? data.currentTime : 30,
          blueName: data.blueName || "",
          redName: data.redName || "",
          blueReady: !!data.blueReady,
          redReady: !!data.redReady,
          done: !!data.done,
          bluePicks: bPicks,
          blueBans: bBans,
          redPicks: rPicks,
          redBans: rBans,
          drafter: data.drafter,
        };

        // Si el asiento de nuestro equipo no está ocupado por nosotros, reclamarlo
        if (this.socket?.connected) {
          if (this.ourSide === "BLUE" && (!data.drafter?.blue?.id || data.drafter?.blue?.id === this.socket.id)) {
            const teamLabel = data.blueName || this.ourTeamName || "Blue";
            if (data.drafter?.blue?.team !== teamLabel) {
              this.socket.emit("change-team", teamLabel);
            }
          } else if (this.ourSide === "RED" && (!data.drafter?.red?.id || data.drafter?.red?.id === this.socket.id)) {
            const teamLabel = data.redName || this.ourTeamName || "Red";
            if (data.drafter?.red?.team !== teamLabel) {
              this.socket.emit("change-team", teamLabel);
            }
          }
        }

        this.callbacks.onStateUpdate?.(roomState);
      });

      this.socket.on("connect_error", (err) => {
        this.setStatus("error", `Error de conexión: ${err.message}`);
      });

      this.socket.on("disconnect", (reason) => {
        this.setStatus("disconnected", `Desconectado de Drafter.lol (${reason})`);
      });
    } catch (err: any) {
      this.setStatus("error", err?.message || "Fallo al inicializar cliente de Drafter");
    }
  }

  /**
   * Actualiza el bando de nuestro equipo en tiempo de ejecución
   */
  public setOurSide(side: "BLUE" | "RED", teamName?: string): void {
    this.ourSide = side;
    if (teamName) this.ourTeamName = teamName;
    if (this.socket && this.socket.connected) {
      const targetName = teamName || (side === "BLUE" ? "Blue" : "Red");
      this.socket.emit("change-team", targetName);
    }
  }

  /**
   * Envía un pick o ban a Drafter.lol y ejecuta el lockeo automático
   */
  public lockChampion(champIdOrName: string): boolean {
    if (!this.socket || !this.socket.connected) {
      return false;
    }

    const champObj = findChampion(champIdOrName);
    const resolvedName = champObj?.name || champIdOrName;

    try {
      // 1. Enviar la selección de campeón (hover)
      this.socket.emit("draft-choice", resolvedName);

      // 2. Lockear inmediatamente la selección
      setTimeout(() => {
        if (this.socket && this.socket.connected) {
          this.socket.emit("draft-choice-lock");
          this.callbacks.onActionSent?.("lock", resolvedName);
        }
      }, 60);

      return true;
    } catch (err) {
      console.error("Error al enviar pick a Drafter.lol:", err);
      return false;
    }
  }

  /**
   * Envía la confirmación de "Listo / Ready" a la sala de Drafter.lol
   */
  public sendReady(): boolean {
    if (!this.socket || !this.socket.connected) return false;
    this.socket.emit("drafter-ready");
    this.callbacks.onActionSent?.("ready");
    return true;
  }

  /**
   * Cambia el asiento de equipo en Drafter.lol
   */
  public sendChangeTeam(teamName: string): boolean {
    if (!this.socket || !this.socket.connected) return false;
    this.socket.emit("change-team", teamName);
    this.callbacks.onActionSent?.("change-team", teamName);
    return true;
  }

  /**
   * Desconecta el socket
   */
  public disconnect(): void {
    if (this.socket) {
      try {
        this.socket.disconnect();
      } catch {}
      this.socket = null;
    }
    this.currentRoomId = "";
    this.setStatus("disconnected");
  }

  /**
   * Actualiza el estado y notifica al callback
   */
  private setStatus(status: DrafterConnectionStatus, message?: string) {
    this.status = status;
    this.callbacks.onStatusChange?.(status, message);
  }

  /**
   * Crea una nueva sala en Drafter.lol a través de nuestra API local/edge
   */
  public static async createRoom(params: {
    team1Name?: string;
    team2Name?: string;
    fearless?: boolean;
    ironman?: boolean;
    firstSelection?: boolean;
    gameAmount?: number;
  }): Promise<{ id: string; url: string; spectatorUrl: string } | null> {
    try {
      const res = await fetch("/api/drafter-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team1Name: params.team1Name || "Void Lynx",
          team2Name: params.team2Name || "Rival",
          fearless: !!params.fearless,
          ironman: !!params.ironman,
          firstSelection: !!params.firstSelection,
          gameAmount: params.gameAmount || 1,
        }),
      });

      if (!res.ok) return null;
      const data = await res.json();
      if (!data.success) return null;

      return {
        id: data.id,
        url: data.url,
        spectatorUrl: data.spectatorUrl,
      };
    } catch (err) {
      console.error("Error al crear sala en Drafter:", err);
      return null;
    }
  }
}

// Singleton exportado
export const drafterLiveBridge = new DrafterLiveBridge();
export const createDrafterRoom = DrafterLiveBridge.createRoom;
