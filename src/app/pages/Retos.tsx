import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { TileButton } from "../components/TileButton";
import { ChallengeModal } from "../components/ChallengeModal";
import { PuzzleModal } from "../components/PuzzleModal";
import { useGame } from "../context/GameContext";
import { getChallengesBySide } from "../data/challengesData";

const COMPLETED_KEY = "completedChallenges";
const PENDING_KEY = "pendingChallenges";

export default function Retos() {
  const navigate = useNavigate();
  const { currentPath } = useGame();

  const storedPath = (localStorage.getItem("currentPath") as "left" | "right" | null);
  const effectivePath = currentPath ?? storedPath;

  // ✅ solo para PINTAR cuáles ya están completados (confirmados)
  const [completedChallenges] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  });

  // ✅ solo para PINTAR cuáles están "pendientes" (hechos pero no guardados)
  const [pendingChallenges, setPendingChallenges] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(PENDING_KEY);
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

  const isDone = (id: number) =>
    completedChallenges.includes(id) || pendingChallenges.includes(id);

  const handleChallengeClick = (challengeId: number) => {
    // si ya está completado o pendiente, no abrir modal
    if (isDone(challengeId)) return;
    setSelectedChallenge(challengeId);
  };

  const handlePuzzleClick = () => {
    if (!puzzleChallenge) return;
    if (isDone(puzzleChallenge.id)) return;
    setShowPuzzle(true);
  };

  // ✅ AQUÍ es donde va lo que preguntaste:
  // marcar como PENDIENTE y volver a /game
  const handleChallengeComplete = (challengeId: number) => {
    setPendingChallenges((prev) => {
      const next = prev.includes(challengeId) ? prev : [...prev, challengeId];
      localStorage.setItem(PENDING_KEY, JSON.stringify(next)); // ✅ PENDING
      return next;
    });
    setSelectedChallenge(null);
    navigate("/game");
  };

  const handlePuzzleComplete = () => {
    if (!puzzleChallenge) return;

    setPendingChallenges((prev) => {
      const next = prev.includes(puzzleChallenge.id) ? prev : [...prev, puzzleChallenge.id];
      localStorage.setItem(PENDING_KEY, JSON.stringify(next)); // ✅ PENDING
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[900px] mx-auto mt-10 flex items-center justify-between"
      >
        <div>
          <p className="text-[#B89726] text-lg font-['Mansalva']">
            CAMINO {effectivePath === "right" ? "DERECHO" : "IZQUIERDO"}
          </p>
          <h2 className="text-2xl font-bold text-[#11A1AB] mt-2">RETOS</h2>
        </div>

        <Button
          onClick={() => navigate("/game")}
          variant="outline"
          className="h-12 px-6 text-white border-white/20 hover:bg-white/10"
        >
          Volver
        </Button>
      </motion.div>

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
          {/* Panel casillas */}
          <div className="max-w-[900px] mx-auto mt-8">
            <div className="rounded-2xl bg-black/45 border border-white/10 backdrop-blur-md p-5">
              <div className="grid grid-cols-2 gap-4">
                {mainChallenges.map((challenge) => (
                  <TileButton
                    key={challenge.id}
                    icon={challenge.icon}
                    tileBg={challenge.tileBg}
                    isCompleted={isDone(challenge.id)} // ✅ completado o pendiente
                    onClick={() => handleChallengeClick(challenge.id)}
                  />
                ))}
              </div>

              {/* Casilla Azul */}
              {puzzleChallenge && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-[#B89726] mb-3">CASILLA AZUL</h3>
                  <TileButton
                    icon="help"
                    label="ACERTIJO"
                    tileBg={puzzleChallenge.tileBg}
                    isCompleted={isDone(puzzleChallenge.id)} // ✅ completado o pendiente
                    onClick={handlePuzzleClick}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Modales */}
          {selectedChallengeData && selectedChallengeData.type !== "puzzle" && (
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
        </>
      )}
    </div>
  );
}