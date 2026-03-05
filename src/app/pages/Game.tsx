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
        backgroundImage: "url('../../../public/assets/Hoja grupal.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-32 mb-6 relative"
      >
        <p className="text-[#B89726] text-lg font-['Mansalva']">
          CAMINO {currentPath === 'right' ? 'DERECHO' : 'IZQUIERDO'}
        </p>

        {/* Botón RETOS */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <Button
            onClick={() => navigate('/retos')}
            className="
              h-12 px-6
              bg-[#11A1AB]
              hover:bg-[#11A1AB]/85
              text-[#100605]
              font-bold text-lg
              tracking-wider
              shadow-[0_0_22px_rgba(17,161,171,0.25)]
            "
          >
            RETOS
          </Button>
        </div>
      </motion.div>

      {/* Main */}
      <div className="grid grid-cols-1 gap-15 max-w-[700px] mx-auto">
        {/* ESTADO DE JUGADORES */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <h2 className="text-2xl font-bold text-[#11A1AB] mb-4 flex items-center gap-2">
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
          <div className="rounded-2xl bg-black/45 backdrop-blur-md border border-white/10 overflow-hidden">
            {/* header puntos */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-[#11A1AB]/10 via-transparent to-transparent">
              <div>
                <div className="text-[#11A1AB] uppercase tracking-[0.22em] text-base font-semibold">
                  Puntos grupales
                </div>
                <div className="text-white/45 text-sm mt-1">Reserva colectiva</div>
              </div>

              <div className="w-[240px]">
                <Stepper value={groupPoints} onChange={setGroupPointsAbsolute} size="md" label="" />
              </div>
            </div>

            {/* recursos */}
            <div className="px-5 pt-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-black/35 border border-[#11A1AB]/20 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-[#11A1AB]" />
                      <div className="leading-tight">
                        <div className="text-white/55 text-xs uppercase tracking-[0.2em]">Escudo</div>
                        <div className="text-[#FCFFBA]/90 text-base font-semibold">Plasma</div>
                      </div>
                    </div>
                    <div className="w-[150px]">
                      <Stepper
                        value={resources.plasmaShield}
                        onChange={(val) => setResourceAbsolute("plasmaShield", val)}
                        size="sm"
                        label=""
                      />
                    </div>
                  </div>
                  <div className="h-[3px] bg-[#11A1AB]/70" />
                </div>

                <div className="rounded-xl bg-black/35 border border-[#B89726]/25 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-[#B89726]" />
                      <div className="leading-tight">
                        <div className="text-white/55 text-xs uppercase tracking-[0.2em]">Det. Esporas</div>
                        <div className="text-[#FCFFBA]/90 text-base font-semibold">Sensor</div>
                      </div>
                    </div>
                    <div className="w-[150px]">
                      <Stepper
                        value={resources.sporeDetector}
                        onChange={(val) => setResourceAbsolute("sporeDetector", val)}
                        size="sm"
                        label=""
                      />
                    </div>
                  </div>
                  <div className="h-[3px] bg-[#B89726]/80" />
                </div>

                <div className="rounded-xl bg-black/35 border border-[#11A1AB]/20 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-[#11A1AB]" />
                      <div className="leading-tight">
                        <div className="text-white/55 text-xs uppercase tracking-[0.2em]">Kit</div>
                        <div className="text-[#FCFFBA]/90 text-base font-semibold">Médico</div>
                      </div>
                    </div>
                    <div className="w-[150px]">
                      <Stepper
                        value={resources.medicalKit}
                        onChange={(val) => setResourceAbsolute("medicalKit", val)}
                        size="sm"
                        label=""
                      />
                    </div>
                  </div>
                  <div className="h-[3px] bg-[#11A1AB]/70" />
                </div>

                <div className="rounded-xl bg-black/35 border border-[#9F1B0B]/25 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Crosshair className="h-5 w-5 text-[#9F1B0B]" />
                      <div className="leading-tight">
                        <div className="text-white/55 text-xs uppercase tracking-[0.2em]">Munición</div>
                        <div className="text-[#FCFFBA]/90 text-base font-semibold">Total</div>
                      </div>
                    </div>
                    <div className="w-[150px]">
                      <Stepper
                        value={resources.ammunition}
                        onChange={(val) => setResourceAbsolute("ammunition", val)}
                        size="sm"
                        label=""
                      />
                    </div>
                  </div>
                  <div className="h-[3px] bg-[#9F1B0B]/80" />
                </div>
              </div>
            </div>

            {/* estado global */}
            <div className="px-5 pt-5 pb-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-black/35 border border-white/10 px-4 py-3">
                  <div className="text-white/55 text-xs uppercase tracking-[0.22em] mb-2">Retos</div>
                  <div className="text-[#B89726] text-3xl font-bold tabular-nums">
                    {completedChallenges.length}
                  </div>
                </div>

                <div className="rounded-xl bg-black/35 border border-[#9F1B0B]/20 px-4 py-3">
                  <div className="text-white/55 text-xs uppercase tracking-[0.22em] mb-2">Bajas</div>
                  <div className="mb-2 text-[#9F1B0B] text-3xl font-bold tabular-nums">{casualties}</div>
                  <Stepper value={casualties} onChange={setCasualtiesAbsolute} size="sm" label="" />
                </div>

                <div className="rounded-xl bg-black/35 border border-[#B89726]/20 px-4 py-3">
                  <div className="text-white/55 text-xs uppercase tracking-[0.22em] mb-2">Infección</div>
                  <div className="mb-2 text-[#B89726] text-3xl font-bold tabular-nums">{infectionLevel.toFixed(1)}</div>
                  <Stepper
                    value={infectionLevel * 10}
                    onChange={(val) => setInfectionLevel(val / 10)}
                    min={0}
                    max={10}
                    step={1}
                    size="sm"
                    label=""
                  />
                </div>
              </div>
            </div>

            {/* botones */}
            <div className="px-5 pb-5 pt-2 grid grid-cols-2 gap-3">
              <Button
                onClick={handleSave}
                className="
                  h-14
                  bg-[#11A1AB]
                  hover:bg-[#11A1AB]/85
                  text-[#100605]
                  font-bold
                  text-lg
                  tracking-wider
                  shadow-[0_0_22px_rgba(17,161,171,0.25)]
                "
              >
                <Save className="mr-2 h-5 w-5" />
                {savedPing ? "GUARDADO ✓" : "GUARDAR"}
              </Button>

              <Button
                onClick={handleEndGame}
                className="
                  h-14
                  bg-[#9F1B0B]
                  hover:bg-[#9F1B0B]/85
                  text-[#FCFFBA]
                  font-bold
                  text-lg
                  tracking-wider
                  shadow-[0_0_22px_rgba(159,27,11,0.22)]
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