import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { TileButton } from "../components/TileButton";
import { ChallengeModal } from "../components/ChallengeModal";
import { PuzzleModal } from "../components/PuzzleModal";
import { useGame } from "../context/GameContext";
import { getChallengesBySide } from "../data/challengesData";
import { applyChallengeEffects } from "../../lib/challengeEffects";

const COMPLETED_KEY = "completedChallenges";

export default function Retos() {
  const navigate = useNavigate();

  const {
    currentPath,
    players,
    groupPoints,
    resources,
    casualties,
    infectionLevel,
    updatePlayerHP,
    updatePlayerPoints,
    setGroupPointsAbsolute,
    setResourceAbsolute,
    setCasualtiesAbsolute,
    setInfectionLevel,
    updatePlayerAmmunition,
  } = useGame();

  const storedPath = localStorage.getItem("currentPath") as "left" | "right" | null;
  const effectivePath = currentPath ?? storedPath;

  const [completedChallenges, setCompletedChallenges] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  });

  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [showPuzzle, setShowPuzzle] = useState(false);

  const challenges = useMemo(
    () => (effectivePath ? getChallengesBySide(effectivePath) : []),
    [effectivePath]
  );

  const mainChallenges = challenges.filter((c) => c.type !== "puzzle");
  const puzzleChallenge = challenges.find((c) => c.type === "puzzle");

  const isDone = (id: number) => completedChallenges.includes(id);

  const clamp = (val: number, min: number, max: number) =>
    Math.min(max, Math.max(min, val));

  const applyEffectsFromText = (
  effectsText: string,
  optionLabel?: string,
  challengeTitle?: string,
  d20?: number | null,
  selectedPlayerId?: string | null,
  protectedPlayerIds?: string[]
) => {
  applyChallengeEffects({
    effectsText,
    optionLabel,
    challengeTitle,
    selectedPlayerId,
    protectedPlayerIds,
    d20,

    players,
    groupPoints,
    infectionLevel,
    casualties,
    resources,

    updatePlayerHP,
    updatePlayerPoints,
    updatePlayerAmmunition,
    setGroupPointsAbsolute,
    setResourceAbsolute,
    setCasualtiesAbsolute,
    setInfectionLevel,
  });
};

  const handleChallengeClick = (challengeId: number) => {
    if (isDone(challengeId)) return;
    setSelectedChallenge(challengeId);
  };

  const handlePuzzleClick = () => {
  if (!puzzleChallenge) return;
  if (isDone(puzzleChallenge.id)) return;

  setShowPuzzle(true);
};

  const handleChallengeComplete = ({
    challengeId,
    optionIndex,
    subOptionIndex,
    d20,
    timedOut,
    selectedPlayerId,
    protectedPlayerIds,
  }: {
    challengeId: number;
    optionIndex?: number;
    subOptionIndex?: number | null;
    d20?: number | null;
    timedOut?: boolean;
    selectedPlayerId?: string | null;
    protectedPlayerIds?: string[];
  }) => {
    if (timedOut) {
      players.forEach((p) => {
        updatePlayerPoints(p.id, -8);
      });

      setGroupPointsAbsolute(groupPoints - 10);

      setCompletedChallenges((prev) => {
        const next = prev.includes(challengeId) ? prev : [...prev, challengeId];
        localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
        return next;
      });

      setSelectedChallenge(null);
      navigate("/game");
      return;
    }

    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge || !challenge.options || optionIndex === undefined) return;

    const option = challenge.options[optionIndex];
    if (!option) return;

    applyEffectsFromText(
      option.effects,
      option.label,
      challenge.title,
      d20,
      selectedPlayerId,
      protectedPlayerIds
    );

    if (
      option.subDecision &&
      subOptionIndex !== null &&
      subOptionIndex !== undefined &&
      option.subDecision.options[subOptionIndex]
    ) {
      applyEffectsFromText(
        option.subDecision.options[subOptionIndex].effects,
        option.subDecision.options[subOptionIndex].label,
        challenge.title,
        d20,
        selectedPlayerId,
        protectedPlayerIds
      );
    }

    setCompletedChallenges((prev) => {
      const next = prev.includes(challengeId) ? prev : [...prev, challengeId];
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
      return next;
    });

    setSelectedChallenge(null);
    navigate("/game");
  };

  const handlePuzzleComplete = ({
    challengeId,
    effectsText,
  }: {
    challengeId: number;
    result: "correct" | "incorrect" | "ignore";
    effectsText: string;
  }) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge?.puzzle) return;

    applyEffectsFromText(effectsText, challenge.title);

    setCompletedChallenges((prev) => {
      const next = prev.includes(challengeId) ? prev : [...prev, challengeId];
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
      return next;
    });

    setShowPuzzle(false);
    navigate("/game");
  };

  const selectedChallengeData = challenges.find((c) => c.id === selectedChallenge);

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundImage: "url('/assets/Hoja grupal.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[700px] mx-auto mt-10 flex items-center justify-between"
      >
        <div>
          <p className="text-[#B89726] text-lg font-['Mansalva']">
            CAMINO {effectivePath === "right" ? "DERECHO" : "IZQUIERDO"}
          </p>
          <h2 className="text-5xl font-bold text-[#11A1AB] mt-2">RETOS</h2>
        </div>

        <Button
          onClick={() => navigate("/game")}
          variant="outline"
          className="h-15 px-12 text-white border-white/20 hover:bg-white/10 font-bold text-2xl"
        >
          Volver
        </Button>
      </motion.div>

      <div className="max-w-[700px] mx-auto mt-6 text-center">
        <div className="inline-block px-6 py-2 rounded-md border border-[#B89726]/40 bg-[#B89726]/10 text-[#FCFFBA] text-xl font-semibold">
          Escoge el reto que te tocó durante la partida
        </div>
      </div>

      {!effectivePath ? (
        <div className="max-w-[900px] mx-auto mt-10">
          <div className="rounded-2xl bg-black/45 border border-white/10 backdrop-blur-md p-6 text-center">
            <p className="text-white/80 text-lg">No hay un camino seleccionado aún.</p>
            <p className="text-white/50 mt-2">
              Vuelve al juego y elige el camino para cargar los retos.
            </p>
            <Button
              onClick={() => navigate("/game")}
              className="mt-6 h-12 px-8 bg-[#11A1AB] hover:bg-[#11A1AB]/85 text-[#100605] font-bold"
            >
              Ir al juego
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-[700px] mx-auto mt-8">
            <div className="grid grid-cols-3 gap-2">
              {mainChallenges.map((challenge) => (
                <TileButton
                  key={challenge.id}
                  tileBg={challenge.tileBg}
                  isCompleted={isDone(challenge.id)}
                  onClick={() => handleChallengeClick(challenge.id)}
                />
              ))}
            </div>

            {puzzleChallenge && (
              <div className="mt-8">
                <h3 className="text-5xl font-bold text-[#B89726] mb-3">ACERTIJO</h3>
                <div className="max-w-[250px]">
                  <TileButton
                    tileBg={puzzleChallenge.tileBg}
                    isCompleted={isDone(puzzleChallenge.id)}
                    onClick={handlePuzzleClick}
                  />
                </div>
              </div>
            )}
          </div>

          {selectedChallengeData && selectedChallengeData.type !== "puzzle" && (
            <ChallengeModal
              challenge={selectedChallengeData}
              isOpen={selectedChallenge !== null}
              onClose={() => setSelectedChallenge(null)}
              onComplete={handleChallengeComplete}
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
        </>
      )}
      {/* Partículas decorativas */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#F5DC3F] rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
    </div>
  );
}