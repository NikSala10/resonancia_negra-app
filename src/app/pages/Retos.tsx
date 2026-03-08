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

  const firstUnlockedChallengeId =
    mainChallenges.find((challenge) => !completedChallenges.includes(challenge.id))
      ?.id ?? null;

  const isUnlocked = (id: number) => {
    return completedChallenges.includes(id) || id === firstUnlockedChallengeId;
  };

  const clamp = (val: number, min: number, max: number) =>
    Math.min(max, Math.max(min, val));

  const applyEffectsFromText = (
  effectsText: string,
  challengeTitle?: string,
  d20?: number | null
) => {
  const text = effectsText.toLowerCase();

  let nextGroupPoints = groupPoints;
  let nextInfection = infectionLevel;
  let nextCasualties = casualties;

  const nextResources = {
    plasmaShield: resources.plasmaShield,
    sporeDetector: resources.sporeDetector,
    medicalKit: resources.medicalKit,
    ammunition: resources.ammunition,
  };

  const signedAmountFromMatch = (
    rawValue: string,
    verb?: string | null
  ) => {
    const numeric = Math.abs(Number(rawValue));

    if (rawValue.startsWith("-")) return -numeric;
    if (rawValue.startsWith("+")) return numeric;

    const normalizedVerb = (verb ?? "").toLowerCase();

    if (
      normalizedVerb.includes("pierde") ||
      normalizedVerb.includes("pierden") ||
      normalizedVerb.includes("gasta") ||
      normalizedVerb.includes("gastan")
    ) {
      return -numeric;
    }

    return numeric;
  };

  // ===== PUNTOS GRUPALES =====
  const groupPointsMatches = [
    ...effectsText.matchAll(/([+-]?\d+)\s*pts?\s*grupales?/gi),
  ];
  groupPointsMatches.forEach((m) => {
    nextGroupPoints += Number(m[1]);
  });

  // ===== INFECCIÓN =====
  const infectionMatches = [
    ...effectsText.matchAll(/([+-]?\d+(?:\.\d+)?)\s*infecci[oó]n/gi),
  ];
  infectionMatches.forEach((m) => {
    nextInfection += Number(m[1]);
  });

  // ===== BAJAS =====
  const casualtiesMatches = [...effectsText.matchAll(/([+-]?\d+)\s*bajas?/gi)];
  casualtiesMatches.forEach((m) => {
    nextCasualties += Number(m[1]);
  });

 // ===== TODOS PIERDEN / GANAN HP POR TEXTO =====
// ===== TODOS PIERDEN / GANAN HP =====
const allHpMatches = [
  ...effectsText.matchAll(/todos?\s+(pierden|ganan)\s*([+-]?\d+)\s*hp/gi),
];

allHpMatches.forEach((m) => {
  const action = m[1].toLowerCase();
  const amount = Math.abs(Number(m[2])) * (action === "pierden" ? -1 : 1);

  players.forEach((p) => {
    updatePlayerHP(p.id, clamp(p.hp + amount, 0, p.maxHp));
  });
});

// ===== HP INDIVIDUALES PARA TODOS =====
const everyoneHpMatches = [
  ...effectsText.matchAll(
    /(^|\|)\s*([+-]?\d+)\s*hp(?:\s*individual(?:es)?)?(?:\s*(?:cada jugador|para todos))?\s*(?=\||$)/gi
  ),
];

everyoneHpMatches.forEach((m) => {
  const delta = Number(m[2]);

  players.forEach((p) => {
    updatePlayerHP(p.id, clamp(p.hp + delta, 0, p.maxHp));
  });
});

// ===== PUNTOS INDIVIDUALES PARA TODOS =====
const everyonePointsMatches = [
  ...effectsText.matchAll(
    /([+-]?\d+)\s*(?:pts?|puntos?)\s*individuales?(?:\s*(?:cada jugador|para todos))?/gi
  ),
];

everyonePointsMatches.forEach((m) => {
  const delta = Number(m[1]);
  players.forEach((p) => updatePlayerPoints(p.id, delta));
});

  // ===== JUGADOR ESPECÍFICO =====
 players.forEach((p) => {
  const safeName = p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const hpMatch =
    effectsText.match(
      new RegExp(`${safeName}.*?(pierde|gana)?\\s*([+-]?\\d+)\\s*hp`, "i")
    ) ||
    effectsText.match(
      new RegExp(`([+-]?\\d+)\\s*hp.*?${safeName}`, "i")
    );

  if (hpMatch) {
    let delta = 0;

    if (hpMatch[2]) {
      const verb = (hpMatch[1] || "").toLowerCase();
      const raw = hpMatch[2];
      const amount = Math.abs(Number(raw));

      if (verb === "pierde") {
        delta = -amount;
      } else if (verb === "gana") {
        delta = amount;
      } else {
        delta = Number(raw);
      }
    } else if (hpMatch[1]) {
      delta = Number(hpMatch[1]);
    }

    updatePlayerHP(p.id, clamp(p.hp + delta, 0, p.maxHp));
  }
});
  // ===== RECURSOS =====
  if (text.includes("pierden detector") || text.includes("pierde detector")) {
    nextResources.sporeDetector = Math.max(0, nextResources.sporeDetector - 1);
  }

  if (text.includes("obtienen 1 kit médico") || text.includes("gana 1 kit médico")) {
    nextResources.medicalKit += 1;
  }

  if (text.includes("gasta 1 kit médico") || text.includes("pierden 1 kit médico")) {
    nextResources.medicalKit = Math.max(0, nextResources.medicalKit - 1);
  }

  if (
    text.includes("obtiene escudo de plasma") ||
    text.includes("ganan escudo de plasma")
  ) {
    nextResources.plasmaShield += 1;
  }

  const ammoMatches = [...effectsText.matchAll(/([+-]?\d+)\s*municiones?/gi)];
  ammoMatches.forEach((m) => {
    nextResources.ammunition = Math.max(
      0,
      nextResources.ammunition + Number(m[1])
    );
  });

  // ===== D20 especial =====
  if (d20 !== null && d20 !== undefined) {
    if (challengeTitle?.toLowerCase().includes("puente inestable")) {
      const keira = players.find((p) => p.name.toLowerCase().includes("keira"));
      if (keira && d20 % 2 !== 0) {
        updatePlayerHP(keira.id, clamp(keira.hp - 5, 0, keira.maxHp));
      }
    }
  }

  // ===== APLICAR TODO AL FINAL =====
  setGroupPointsAbsolute(nextGroupPoints);
  setInfectionLevel(Math.max(0, nextInfection));
  setCasualtiesAbsolute(Math.max(0, nextCasualties));

  setResourceAbsolute("plasmaShield", nextResources.plasmaShield);
  setResourceAbsolute("sporeDetector", nextResources.sporeDetector);
  setResourceAbsolute("medicalKit", nextResources.medicalKit);
  setResourceAbsolute("ammunition", nextResources.ammunition);
};

  const handleChallengeClick = (challengeId: number) => {
    if (!isUnlocked(challengeId)) return;
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
  }: {
    challengeId: number;
    optionIndex?: number;
    subOptionIndex?: number | null;
    d20?: number | null;
    timedOut?: boolean;
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

    applyEffectsFromText(option.effects, challenge.title, d20);

    if (
      option.subDecision &&
      subOptionIndex !== null &&
      subOptionIndex !== undefined &&
      option.subDecision.options[subOptionIndex]
    ) {
      applyEffectsFromText(
        option.subDecision.options[subOptionIndex].effects,
        challenge.title,
        d20
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
    </div>
  );
}