import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Types
export type PlayerStatus = "normal" | "danger";

export interface Player {
  id: string;
  name: string;
  role: string;
  hp: number;
  maxHp: number;
  points: number;
  ammunition?: number;
  status: PlayerStatus;
}

export interface GameResources {
  plasmaShield: number;
  sporeDetector: number;
  medicalKit: number;
  ammunition: number;
}

export interface GameState {
  players: Player[];
  groupPoints: number;
  resources: GameResources;
  currentPath: "right" | "left" | null;
  challengesCompleted: number;
  casualties: number;
  infectionLevel: number;
}

interface GameContextType extends GameState {
  updatePlayerHP: (playerId: string, hp: number) => void;
  updatePlayerPoints: (playerId: string, delta: number) => void;
  setGroupPointsAbsolute: (points: number) => void;
  setResourceAbsolute: (resource: keyof GameResources, amount: number) => void;
  updatePlayerAmmunition: (playerId: string, ammo: number) => void;
  setCurrentPath: (path: "right" | "left") => void;
  completeChallenge: () => void;
  setCasualtiesAbsolute: (casualties: number) => void;
  setInfectionLevel: (level: number) => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_PLAYERS: Player[] = [
  {
    id: "keira",
    name: "Keira",
    role: "Luchadora",
    hp: 30,
    maxHp: 30,
    points: 0,
    ammunition: 5,
    status: "normal",
  },
  {
    id: "adrian",
    name: "Adrian",
    role: "Médico",
    hp: 30,
    maxHp: 30,
    points: 0,
    status: "normal",
  },
  {
    id: "ivan",
    name: "Ivan",
    role: "Ingeniero",
    hp: 30,
    maxHp: 30,
    points: 0,
    status: "normal",
  },
  {
    id: "clara",
    name: "Clara",
    role: "Investigadora",
    hp: 30,
    maxHp: 30,
    points: 0,
    status: "normal",
  },
  {
    id: "leni",
    name: "Leni",
    role: "Exploradora",
    hp: 30,
    maxHp: 30,
    points: 0,
    status: "normal",
  },
];

const INITIAL_RESOURCES: GameResources = {
  plasmaShield: 1,
  sporeDetector: 1,
  medicalKit: 1,
  ammunition: 0,
};

const SAVE_KEY = "resonancia-negra-save";

const cloneInitialPlayers = (): Player[] =>
  INITIAL_PLAYERS.map((player) => ({ ...player }));

const cloneInitialResources = (): GameResources => ({ ...INITIAL_RESOURCES });

const getStatusFromHp = (hp: number): PlayerStatus => {
  return hp <= 10 ? "danger" : "normal";
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(cloneInitialPlayers);
  const [groupPoints, setGroupPoints] = useState(0);
  const [resources, setResources] = useState<GameResources>(cloneInitialResources);
  const [currentPath, setCurrentPathState] = useState<"right" | "left" | null>(null);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [casualties, setCasualties] = useState(0);
  const [infectionLevel, setInfectionLevelState] = useState(0);

  useEffect(() => {
    loadGame();
  }, []);

  const updatePlayerHP = (playerId: string, hp: number) => {
    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id !== playerId) return player;

        const safeHp = Math.max(0, Math.min(hp, player.maxHp));

        return {
          ...player,
          hp: safeHp,
          status: getStatusFromHp(safeHp),
        };
      })
    );
  };

  const updatePlayerPoints = (playerId: string, delta: number) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? {
              ...player,
              points: Math.max(0, player.points + delta),
            }
          : player
      )
    );
  };

  const setGroupPointsAbsolute = (points: number) => {
    setGroupPoints(Math.max(0, points));
  };

  const setResourceAbsolute = (
    resource: keyof GameResources,
    amount: number
  ) => {
    setResources((prev) => ({
      ...prev,
      [resource]: Math.max(0, amount),
    }));
  };

  const updatePlayerAmmunition = (playerId: string, ammo: number) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId && player.ammunition !== undefined
          ? {
              ...player,
              ammunition: Math.max(0, ammo),
            }
          : player
      )
    );
  };

  const setCurrentPath = (path: "right" | "left") => {
    setCurrentPathState(path);
    localStorage.setItem("currentPath", path);
  };

  const completeChallenge = () => {
    setChallengesCompleted((prev) => prev + 1);
  };

  const setCasualtiesAbsolute = (nextCasualties: number) => {
    setCasualties(Math.max(0, nextCasualties));
  };

  // OJO: aquí NO limitamos a 1 porque tu UI trabaja como si fuera 0..10
  const setInfectionLevel = (level: number) => {
    setInfectionLevelState(Math.max(0, level));
  };

  const resetGame = () => {
    setPlayers(cloneInitialPlayers());
    setGroupPoints(0);
    setResources(cloneInitialResources());
    setCurrentPathState(null);
    setChallengesCompleted(0);
    setCasualties(0);
    setInfectionLevelState(0);

    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem("currentPath");
    localStorage.removeItem("completedChallenges");
    localStorage.removeItem("pendingChallenges");
    localStorage.removeItem("autoChallengeShown_left");
    localStorage.removeItem("autoChallengeShown_right");
  };

  const saveGame = () => {
    const saveData: GameState & { timestamp: number } = {
      players,
      groupPoints,
      resources,
      currentPath,
      challengesCompleted,
      casualties,
      infectionLevel,
      timestamp: Date.now(),
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  };

  const loadGame = (): boolean => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (!saved) return false;

      const data = JSON.parse(saved) as Partial<GameState>;

      const safePlayers: Player[] = Array.isArray(data.players)
        ? data.players.map((player) => {
            const maxHp =
              typeof player.maxHp === "number" && player.maxHp > 0
                ? player.maxHp
                : 30;

            const hp =
              typeof player.hp === "number"
                ? Math.max(0, Math.min(player.hp, maxHp))
                : maxHp;

            const ammunition =
              typeof player.ammunition === "number"
                ? Math.max(0, player.ammunition)
                : undefined;

            return {
              id: String(player.id ?? ""),
              name: String(player.name ?? ""),
              role: String(player.role ?? ""),
              hp,
              maxHp,
              points:
                typeof player.points === "number" ? Math.max(0, player.points) : 0,
              ammunition,
              status: getStatusFromHp(hp),
            };
          })
        : cloneInitialPlayers();

      const safeResources: GameResources = {
        plasmaShield:
          typeof data.resources?.plasmaShield === "number"
            ? Math.max(0, data.resources.plasmaShield)
            : INITIAL_RESOURCES.plasmaShield,
        sporeDetector:
          typeof data.resources?.sporeDetector === "number"
            ? Math.max(0, data.resources.sporeDetector)
            : INITIAL_RESOURCES.sporeDetector,
        medicalKit:
          typeof data.resources?.medicalKit === "number"
            ? Math.max(0, data.resources.medicalKit)
            : INITIAL_RESOURCES.medicalKit,
        ammunition:
          typeof data.resources?.ammunition === "number"
            ? Math.max(0, data.resources.ammunition)
            : INITIAL_RESOURCES.ammunition,
      };

      const safeCurrentPath =
        data.currentPath === "left" || data.currentPath === "right"
          ? data.currentPath
          : null;

      setPlayers(safePlayers);
      setGroupPoints(
        typeof data.groupPoints === "number" ? Math.max(0, data.groupPoints) : 0
      );
      setResources(safeResources);
      setCurrentPathState(safeCurrentPath);
      setChallengesCompleted(
        typeof data.challengesCompleted === "number"
          ? Math.max(0, data.challengesCompleted)
          : 0
      );
      setCasualties(
        typeof data.casualties === "number" ? Math.max(0, data.casualties) : 0
      );
      setInfectionLevelState(
        typeof data.infectionLevel === "number"
          ? Math.max(0, data.infectionLevel)
          : 0
      );

      if (safeCurrentPath) {
        localStorage.setItem("currentPath", safeCurrentPath);
      }

      return true;
    } catch {
      return false;
    }
  };

  return (
    <GameContext.Provider
      value={{
        players,
        groupPoints,
        resources,
        currentPath,
        challengesCompleted,
        casualties,
        infectionLevel,
        updatePlayerHP,
        updatePlayerPoints,
        setGroupPointsAbsolute,
        setResourceAbsolute,
        updatePlayerAmmunition,
        setCurrentPath,
        completeChallenge,
        setCasualtiesAbsolute,
        setInfectionLevel,
        resetGame,
        saveGame,
        loadGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}