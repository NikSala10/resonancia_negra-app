import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Shield, Activity, Package, Crosshair, Skull, Save } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { PlayerCard } from '../components/PlayerCard';
import { Stepper } from '../components/Stepper';
import { Button } from '../components/ui/button';
import { ChallengeModal } from '../components/ChallengeModal';
import { PuzzleModal } from '../components/PuzzleModal';
import { getChallengesBySide } from '../data/challengesData';

const COMPLETED_KEY = "completedChallenges";
const PENDING_KEY = "pendingChallenges";


export default function Game() {
  const navigate = useNavigate();
  const {
    players,
    groupPoints,
    resources,
    currentPath,
    casualties,
    infectionLevel,
    updatePlayerHP,
    updatePlayerPoints,
    setGroupPointsAbsolute,
    setResourceAbsolute,
    updatePlayerAmmunition,
    setCasualtiesAbsolute,
    setInfectionLevel,
    saveGame,
  } = useGame();

  // ✅ 1) Retos completados sincronizados con localStorage
  const [completedChallenges, setCompletedChallenges] = useState<number[]>(() => {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
});

// refrescar al montar (por si vienes de /retos)
useEffect(() => {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    setCompletedChallenges(raw ? (JSON.parse(raw) as number[]) : []);
  } catch {
    setCompletedChallenges([]);
  }
}, []);

  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [showPuzzle, setShowPuzzle] = useState(false);

  // ✅ 2) Feedback visual de guardado
  const [savedPing, setSavedPing] = useState(false);

  const challenges = currentPath ? getChallengesBySide(currentPath) : [];
  const puzzleChallenge = challenges.find((c) => c.type === 'puzzle');

  const handleChallengeComplete = (challengeId: number) => {
    setSelectedChallenge(null);
  };

  const handlePuzzleComplete = () => {
    setShowPuzzle(false);
  };

  const handleEndGame = () => {
    saveGame();
    navigate('/podium');
  };

 const handleSave = () => {
  // 1) pasar pending a completed
  let pending: number[] = [];
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    pending = raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    pending = [];
  }

  if (pending.length > 0) {
    setCompletedChallenges((prev) => {
      const merged = Array.from(new Set([...prev, ...pending]));
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(merged));
      return merged;
    });

    localStorage.setItem(PENDING_KEY, JSON.stringify([])); // limpiar pending
  }

  // 2) guardado normal del juego
  saveGame();

  // 3) feedback visual
  setSavedPing(true);
  window.setTimeout(() => setSavedPing(false), 1500);
};
  const selectedChallengeData = challenges.find((c) => c.id === selectedChallenge);

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundImage: "url('/assets/Hoja grupal.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <img src="/assets/logo.svg" alt="Logo" className="mx-auto mb-8 w-48" />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 relative max-w-[700px] mx-auto"
      
      >
        <p className="text-[#B89726] text-xl font-['Mansalva']">
          CAMINO {currentPath === 'right' ? 'DERECHO' : 'IZQUIERDO'}
        </p>

        {/* Botón RETOS */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <Button
            onClick={() => navigate('/retos')}
            className="
              h-15 px-12
              bg-[#B89726]
              hover:bg-[#11A1AB]/85
              text-[#100605]
              font-bold text-2xl
              tracking-wider
              shadow-[0_0_22px_rgba(17,161,171,0.25)]
            "
          >
            RETOS
          </Button>
        </div>
      </motion.div>

      {/* Main */}
      <div className="grid grid-cols-1  gap-15 max-w-[700px] mx-auto">
        {/* ESTADO DE JUGADORES */}
        <div className="col-span-12 lg:col-span-4 space-y-4 mt-8 ">
          <h2 className="text-4xl font-bold text-[#11A1AB] mb-4 flex items-center gap-2">
            <Activity className="h-6 w-6 text-[#11A1AB]" />
            ESTADO DE JUGADORES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onUpdateHP={(hp) => updatePlayerHP(player.id, hp)}
                onUpdatePoints={(delta) => updatePlayerPoints(player.id, delta)}
                onUpdateAmmunition={
                  player.ammunition !== undefined
                    ? (ammo) => updatePlayerAmmunition(player.id, ammo)
                    : undefined
                }
              />
            ))}
          </div>
        </div>

      {/* ESTADO DEL GRUPO */}
<div className="col-span-12 lg:col-span-4">
  <h2 className="text-[32px] font-bold text-[#11A1AB] mb-4 flex items-center gap-2">
    <Activity className="h-6 w-6 text-[#11A1AB]" />
    ESTADO GRUPAL
  </h2>

  <div className="rounded-xl border border-white/10 bg-[#050B12]/90 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
    {/* PUNTOS GRUPALES */}
    <div className="mx-4 mt-4 rounded-lg border border-[#11A1AB]/35 bg-[#08131B]/95 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <div className="text-[20px] uppercase tracking-[0.22em] text-[#11A1AB] font-semibold">
            Puntos Grupales
          </div>
          <div className="text-[16px] text-white/35 mt-1">
            Reserva colectiva
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[42px] font-bold leading-none text-[#D9F9FF] tabular-nums">
            {groupPoints}
          </div>

          
        </div>
      </div>
    </div>

    {/* RECURSOS */}
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-[#11A1AB] text-[22px] leading-none">⚡</span>
          <div className="text-[20px] uppercase tracking-[0.22em] text-[#11A1AB] font-semibold whitespace-nowrap">
            Recursos
          </div>
          <div className="h-px bg-[#11A1AB]/35 flex-1 ml-2" />
        </div>

        <div className="text-[12px] uppercase tracking-[0.18em] text-white/35 border border-white/10 rounded-md px-2 py-1 ml-3">
          Comunes • Raros
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Escudo Plasma */}
        <div className="rounded-lg border border-[#11A1AB]/35 bg-[#08131B]/95 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Shield className="h-5 w-5 text-[#D9F9FF] shrink-0" />
              <div className="text-[20px] uppercase tracking-[0.08em] text-[#8FA6B5] font-medium truncate">
                Escudo Plasma
              </div>
            </div>

            <div className="text-[36px] font-bold leading-none text-[#D9F9FF] tabular-nums">
              {resources.plasmaShield}
            </div>
          </div>
        </div>

        {/* Detector de Esporas */}
        <div className="rounded-lg border border-[#B89726]/35 bg-[#111108]/95 relative px-4 py-3">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#B89726]" />
          <div className="flex items-center justify-between pl-1">
            <div className="flex items-center gap-3 min-w-0">
              <Activity className="h-5 w-5 text-[#B89726] shrink-0" />
              <div className="text-[20px] uppercase tracking-[0.08em] text-[#8FA6B5] font-medium truncate">
                Det. Esporas
              </div>
            </div>

            <div className="text-[36px] font-bold leading-none text-[#D9F9FF] tabular-nums">
              {resources.sporeDetector}
            </div>
          </div>
        </div>

        {/* Kit Médico */}
        <div className="rounded-lg border border-[#22C55E]/35 bg-[#08131B]/95 relative px-4 py-3">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#22C55E]" />
          <div className="flex items-center justify-between pl-1">
            <div className="flex items-center gap-3 min-w-0">
              <Package className="h-5 w-5 text-[#8B5CF6] shrink-0" />
              <div className="text-[20px] uppercase tracking-[0.08em] text-[#8FA6B5] font-medium truncate">
                Kit Médico
              </div>
            </div>

            <div className="text-[36px] font-bold leading-none text-[#D9F9FF] tabular-nums">
              {resources.medicalKit}
            </div>
          </div>
        </div>

        {/* Munición */}
        <div className="rounded-lg border border-[#9F1B0B]/35 bg-[#160A0A]/95 relative px-4 py-3">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FF4D6D]" />
          <div className="flex items-center justify-between pl-1">
            <div className="flex items-center gap-3 min-w-0">
              <Crosshair className="h-5 w-5 text-[#FF4D6D] shrink-0" />
              <div className="text-[20px] uppercase tracking-[0.08em] text-[#8FA6B5] font-medium truncate">
                Munición
              </div>
            </div>

            <div className="text-[36px] font-bold leading-none text-[#D9F9FF] tabular-nums">
              {resources.ammunition}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ESTADO GLOBAL */}
    <div className="px-4 pt-4 pb-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[#11A1AB] text-[18px] leading-none">🖥</span>
        <div className="text-[20px] uppercase tracking-[0.22em] text-[#11A1AB] font-semibold whitespace-nowrap">
          Estado Global
        </div>
        <div className="h-px bg-[#11A1AB]/35 flex-1" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Retos */}
        <div className="rounded-lg border border-white/10 bg-[#08131B]/95 px-4 py-3 min-h-[104px]">
          <div className="text-[16px] uppercase tracking-[0.18em] text-white/35 mb-3">
            Retos
          </div>
          <div className="text-[36px] font-bold leading-none text-[#D9F9FF] tabular-nums">
            {completedChallenges.length}
          </div>
        </div>

        {/* Bajas */}
        <div className="rounded-lg border border-white/10 bg-[#08131B]/95 px-4 py-3 min-h-[104px]">
          <div className="text-[16px] uppercase tracking-[0.18em] text-white/35 mb-3">
            Bajas
          </div>
          <div className="text-[36px] font-bold leading-none text-[#D9F9FF] tabular-nums">
            {casualties}
          </div>
        </div>

        {/* Infección */}
        <div className="rounded-lg border border-[#9F1B0B]/25 bg-[#120A10]/95 px-4 py-3 min-h-[104px]">
          <div className="text-[16px] uppercase tracking-[0.18em] text-[#FF8EA2] mb-3">
            Infección
          </div>
          <div className="text-[36px] font-bold leading-none text-[#FF4D6D] tabular-nums">
            {infectionLevel.toFixed(1)}
          </div>

          <div className="mt-3 h-[6px] rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#FF4D6D] transition-all duration-500"
              style={{ width: `${Math.min(100, infectionLevel * 10)}%` }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* BOTONES */}
    <div className="px-4 pb-4 pt-1 grid grid-cols-1 mt-4 gap-3">
      <Button
        onClick={handleEndGame}
        className="
          h-14
          bg-[#2A0912]
          hover:bg-[#3A0C18]
          border border-[#9F1B0B]/45
          text-[#FF4D6D]
          font-bold
          text-[24px]
          tracking-[0.08em]
          shadow-[0_0_18px_rgba(159,27,11,0.18)]
        "
      >
        <Skull className="mr-2 h-5 w-5" />
        FINALIZAR
      </Button>
    </div>
  </div>
</div>
      </div>

      {/* Modales (por si los vuelves a usar en game) */}
      {selectedChallengeData && selectedChallengeData.type !== 'puzzle' && (
        <ChallengeModal
          challenge={selectedChallengeData}
          isOpen={selectedChallenge !== null}
          onClose={() => setSelectedChallenge(null)}
          onComplete={() => handleChallengeComplete(selectedChallengeData.id)}
        />
      )}

      {puzzleChallenge && (
        <PuzzleModal
          challenge={puzzleChallenge}
          isOpen={showPuzzle}
          onClose={() => setShowPuzzle(false)}
          onComplete={handlePuzzleComplete}
        />
      )}
    </div>
  );
}