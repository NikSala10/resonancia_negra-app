import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types
export type PlayerStatus = 'normal' | 'danger';

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
  currentPath: 'right' | 'left' | null;
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
  setCurrentPath: (path: 'right' | 'left') => void;
  completeChallenge: () => void;
  setCasualtiesAbsolute: (casualties: number) => void;
  setInfectionLevel: (level: number) => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_PLAYERS: Player[] = [
  { id: 'keira', name: 'Keira', role: 'Luchadora', hp: 30, maxHp: 30, points: 0, ammunition: 5, status: 'normal' },
  { id: 'adrian', name: 'Adrian', role: 'Médico', hp: 30, maxHp: 30, points: 0, status: 'normal' },
  { id: 'ivan', name: 'Ivan', role: 'Ingeniero', hp: 30, maxHp: 30, points: 0, status: 'normal' },
  { id: 'clara', name: 'Clara', role: 'Investigadora', hp: 30, maxHp: 30, points: 0, status: 'normal' },
  { id: 'leni', name: 'Leni', role: 'Exploradora', hp: 30, maxHp: 30, points: 0, status: 'normal' },
];

const INITIAL_RESOURCES: GameResources = {
  plasmaShield: 1,
  sporeDetector: 1,
  medicalKit: 1,
  ammunition: 0,
};

const INITIAL_STATE: GameState = {
  players: INITIAL_PLAYERS,
  groupPoints: 0,
  resources: INITIAL_RESOURCES,
  currentPath: null,
  challengesCompleted: 0,
  casualties: 0,
  infectionLevel: 0,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [groupPoints, setGroupPoints] = useState(0);
  const [resources, setResources] = useState<GameResources>(INITIAL_RESOURCES);
  const [currentPath, setCurrentPathState] = useState<'right' | 'left' | null>(null);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [casualties, setCasualties] = useState(0);
  const [infectionLevel, setInfectionLevelState] = useState(0);

  // Load game on mount
  useEffect(() => {
    loadGame();
  }, []);

  const updatePlayerHP = (playerId: string, hp: number) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId 
        ? { ...p, hp: Math.max(0, Math.min(hp, p.maxHp)), status: hp <= 10 ? 'danger' : 'normal' } 
        : p
    ));
  };

  const updatePlayerPoints = (playerId: string, delta: number) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId 
        ? { ...p, points: Math.max(0, p.points + delta) } 
        : p
    ));
  };

  const setGroupPointsAbsolute = (points: number) => {
    setGroupPoints(Math.max(0, points));
  };

  const setResourceAbsolute = (resource: keyof GameResources, amount: number) => {
    setResources(prev => ({ ...prev, [resource]: Math.max(0, amount) }));
  };

  const updatePlayerAmmunition = (playerId: string, ammo: number) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId && p.ammunition !== undefined
        ? { ...p, ammunition: Math.max(0, ammo) } 
        : p
    ));
  };

  const setCurrentPath = (path: 'right' | 'left') => {
    setCurrentPathState(path);
  };

  const completeChallenge = () => {
    setChallengesCompleted(prev => prev + 1);
  };

  const setCasualtiesAbsolute = (casualties: number) => {
    setCasualties(Math.max(0, casualties));
  };

  const setInfectionLevel = (level: number) => {
    setInfectionLevelState(Math.max(0, Math.min(1, level)));
  };

  const resetGame = () => {
    setPlayers(INITIAL_PLAYERS);
    setGroupPoints(0);
    setResources(INITIAL_RESOURCES);
    setCurrentPathState(null);
    setChallengesCompleted(0);
    setCasualties(0);
    setInfectionLevelState(0);
    localStorage.removeItem('resonancia-negra-save');
  };

  const saveGame = () => {
    const saveData = {
      players,
      groupPoints,
      resources,
      currentPath,
      challengesCompleted,
      casualties,
      infectionLevel,
      timestamp: Date.now(),
    };
    localStorage.setItem('resonancia-negra-save', JSON.stringify(saveData));
  };

  const loadGame = () => {
    try {
      const saved = localStorage.getItem('resonancia-negra-save');
      if (saved) {
        const data = JSON.parse(saved);
        setPlayers(data.players || INITIAL_PLAYERS);
        setGroupPoints(data.groupPoints || 0);
        setResources(data.resources || INITIAL_RESOURCES);
        setCurrentPathState(data.currentPath || null);
        setChallengesCompleted(data.challengesCompleted || 0);
        setCasualties(data.casualties || 0);
        setInfectionLevelState(data.infectionLevel || 0);
        return true;
      }
      return false;
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
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
