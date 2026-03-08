import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock3,
  CircleCheckBig,
  CircleX,
  Minus,
  Sparkles,
} from "lucide-react";
import { Challenge } from "../data/challengesData";
import { Button } from "./ui/button";

type PuzzleResult = "correct" | "incorrect" | "ignore";

interface PuzzleCompletePayload {
  challengeId: number;
  result: PuzzleResult;
  effectsText: string;
}

interface PuzzleModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (payload: PuzzleCompletePayload) => void;
}

const DEFAULT_SECONDS = 90;
const PUZZLE_TIMEOUT_EFFECT = "-8 pts individuales cada jugador | -10 pts grupales";

export function PuzzleModal({
  challenge,
  isOpen,
  onClose,
  onComplete,
}: PuzzleModalProps) {
  const [answer, setAnswer] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);
  const [showTimeoutNotice, setShowTimeoutNotice] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setAnswer("");
    setSecondsLeft(DEFAULT_SECONDS);
    setShowTimeoutNotice(false);
  }, [isOpen, challenge.id]);

  useEffect(() => {
    if (!isOpen) return;
    if (secondsLeft <= 0) return;
    if (showTimeoutNotice) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, secondsLeft, showTimeoutNotice]);

  useEffect(() => {
    if (!isOpen) return;
    if (secondsLeft !== 0) return;
    if (!challenge.puzzle) return;

    setShowTimeoutNotice(true);
  }, [secondsLeft, isOpen, challenge]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const normalizedAnswer = answer.trim().toUpperCase();
  const realAnswer = challenge.puzzle?.answer?.trim().toUpperCase() ?? "";
  const canResolve = normalizedAnswer.length > 0;

  const resultPreview = useMemo(() => {
    if (!canResolve) return null;
    return normalizedAnswer === realAnswer ? "correct" : "incorrect";
  }, [canResolve, normalizedAnswer, realAnswer]);

  const handleResolve = () => {
    if (!challenge.puzzle) return;

    const isCorrect = normalizedAnswer === realAnswer;

    onComplete({
      challengeId: challenge.id,
      result: isCorrect ? "correct" : "incorrect",
      effectsText: isCorrect
        ? challenge.puzzle.correctEffect
        : challenge.puzzle.incorrectEffect,
    });
  };

  const handleIgnore = () => {
    if (!challenge.puzzle) return;

    onComplete({
      challengeId: challenge.id,
      result: "ignore",
      effectsText: challenge.puzzle.ignoreEffect,
    });
  };

  const handleTimeoutAcknowledge = () => {
    setShowTimeoutNotice(false);

    onComplete({
      challengeId: challenge.id,
      result: "incorrect",
      effectsText: PUZZLE_TIMEOUT_EFFECT,
    });
  };

  if (!challenge.puzzle) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/85 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          >
            <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#050B12]/95 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="sticky top-0 z-20 bg-[#050B12]/95 backdrop-blur-md px-5 md:px-6 pt-5 pb-4 border-b border-white/8">
                <div className="rounded-lg border border-white/10 bg-[#08131B]/95 px-4 py-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 shrink-0">
                      <Clock3 className="h-4 w-4 text-white/45" />
                      <span className="text-[13px] uppercase tracking-[0.22em] text-white/35">
                        Tiempo para decidir
                      </span>
                    </div>

                    <div className="flex-1 h-[8px] rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, (secondsLeft / DEFAULT_SECONDS) * 100)
                          )}%`,
                          background:
                            secondsLeft > 12
                              ? "linear-gradient(90deg, #B89726, #FF4D6D)"
                              : "#FF4D6D",
                        }}
                      />
                    </div>

                    <div className="text-[28px] font-bold leading-none tabular-nums text-[#FF4D6D]">
                      {mm}:{ss}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 md:px-6 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-[34px] md:text-[38px] font-bold text-[#D9E4F2] leading-none">
                      {challenge.title}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="px-5 md:px-6 pt-5">
                <div className="rounded-xl border border-[#8B5CF6]/25 bg-[#0A1020]/95 px-5 py-4">
                  <div className="text-[16px] uppercase tracking-[0.22em] text-[#A78BFA] mb-3">
                    Evento
                  </div>
                  <p className="text-[21px] leading-[1.55] text-[#D9E4F2] whitespace-pre-line">
                    {challenge.event}
                  </p>
                </div>
              </div>

              <div className="px-5 md:px-6 pt-4">
                <div className="rounded-xl border border-[#3B4A70]/25 bg-[#08131B]/95 px-5 py-5">
                  <div className="text-[16px] uppercase tracking-[0.22em] text-[#8B5CF6] mb-4">
                    Acertijo proyectado
                  </div>

                  <div className="text-center text-[24px] leading-[1.75] text-[#D9E4F2] whitespace-pre-line">
                    {challenge.puzzle.riddle}
                  </div>
                </div>
              </div>

              <div className="px-5 md:px-6 pt-5">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-[#22C55E]/30 bg-[#08131B]/95 px-4 py-4">
                    <div className="flex items-center gap-2 text-[#22C55E] mb-3">
                      <CircleCheckBig className="h-5 w-5" />
                      <span className="text-[15px] uppercase tracking-[0.22em] font-semibold">
                        Correcto
                      </span>
                    </div>
                    <p className="text-[19px] leading-[1.5] text-[#D9F2E3] whitespace-pre-line">
                      {challenge.puzzle.correctEffect}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#9F1B0B]/30 bg-[#120A10]/95 px-4 py-4">
                    <div className="flex items-center gap-2 text-[#FF4D6D] mb-3">
                      <CircleX className="h-5 w-5" />
                      <span className="text-[15px] uppercase tracking-[0.22em] font-semibold">
                        Incorrecto
                      </span>
                    </div>
                    <p className="text-[19px] leading-[1.5] text-[#F3D8DF] whitespace-pre-line">
                      {challenge.puzzle.incorrectEffect}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-[#081018]/95 px-4 py-4">
                    <div className="flex items-center gap-2 text-white/45 mb-3">
                      <Minus className="h-5 w-5" />
                      <span className="text-[15px] uppercase tracking-[0.22em] font-semibold">
                        Ignorar
                      </span>
                    </div>
                    <p className="text-[19px] leading-[1.5] text-white/55 whitespace-pre-line">
                      {challenge.puzzle.ignoreEffect}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 md:px-6 pt-5 pb-6">
                <div className="rounded-xl border border-[#8B5CF6]/18 bg-[#08131B]/95 px-4 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-[#FF6BCB]" />
                    <div className="text-[15px] uppercase tracking-[0.22em] text-[#8FA6B5]">
                      Tu respuesta
                    </div>
                  </div>

                  <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full h-14 rounded-lg border border-white/10 bg-[#050B12] px-4 text-[20px] text-[#D9E4F2] outline-none focus:border-[#8B5CF6]/45"
                  />
                </div>

                {resultPreview && (
                  <div className="mt-3 text-[18px] font-semibold">
                    {resultPreview === "correct" ? (
                      <span className="text-[#22C55E]">
                        La respuesta coincide con el acertijo.
                      </span>
                    ) : (
                      <span className="text-[#FF4D6D]">
                        La respuesta no coincide con el acertijo.
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 z-20 bg-[#050B12]/95 backdrop-blur-md border-t border-white/8 px-5 md:px-6 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleResolve}
                    disabled={!canResolve || showTimeoutNotice}
                    className="h-14 bg-[#251241] hover:bg-[#311857] disabled:opacity-40 disabled:pointer-events-none border border-[#8B5CF6]/35 text-[#A78BFA] font-bold text-[20px]"
                  >
                    Intentar resolver
                  </Button>

                  <Button
                    onClick={handleIgnore}
                    disabled={showTimeoutNotice}
                    className="h-14 bg-[#081018] hover:bg-white/5 border border-white/10 text-white/45 font-bold text-[20px] disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Ignorar y continuar
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {showTimeoutNotice && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative w-full max-w-md rounded-2xl border border-[#9F1B0B]/30 bg-[#120A10] p-6">
                <h3 className="text-2xl font-bold text-[#FF8EA2] mb-3">
                  Tiempo agotado
                </h3>
                <p className="text-[#F3D8DF] text-lg leading-relaxed">
                  Como no se eligió ninguna opción a tiempo, se aplica la penalización
                  automática: <strong>-8 puntos individuales</strong> a cada jugador y{" "}
                  <strong>-10 puntos grupales</strong>.
                </p>

                <button
                  onClick={handleTimeoutAcknowledge}
                  className="mt-5 w-full h-12 rounded-lg border border-[#9F1B0B]/40 bg-[#2A0912] text-[#FF4D6D] font-bold"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}