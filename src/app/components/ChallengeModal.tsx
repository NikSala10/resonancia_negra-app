import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock3,
  Shield,
  TriangleAlert,
  Dice5,
  Check,
} from "lucide-react";
import { Challenge } from "../data/challengesData";
import { useGame } from "../context/GameContext";

interface ChallengeCompletePayload {
  challengeId: number;
  optionIndex?: number;
  subOptionIndex?: number | null;
  d20?: number | null;
  timedOut?: boolean;
  selectedPlayerId?: string | null;
  protectedPlayerIds?: string[];
}

interface ChallengeModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (payload: ChallengeCompletePayload) => void;
}

const DEFAULT_SECONDS = 60;

export function ChallengeModal({
  challenge,
  isOpen,
  onClose,
  onComplete,
}: ChallengeModalProps) {
  const { players } = useGame();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedSubOption, setSelectedSubOption] = useState<number | null>(null);
  const [selectedD20, setSelectedD20] = useState<number | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);
  const [showTimeoutNotice, setShowTimeoutNotice] = useState(false);
  const [protectedPlayerIds, setProtectedPlayerIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    setSelectedOption(null);
    setSelectedSubOption(null);
    setSelectedD20(null);
    setSelectedPlayerId(null);
    setProtectedPlayerIds([]);
    setSecondsLeft(DEFAULT_SECONDS);
    setShowTimeoutNotice(false);
  }, [isOpen, challenge.id]);

  const optionNeedsProtectedPlayers = (optionIndex: number) => {
    const option = challenge.options?.[optionIndex];
    if (!option) return false;

    const text = `${option.label} ${option.effects}`.toLowerCase();
    return text.includes("3 protegidos");
  };

  useEffect(() => {
    if (!isOpen) return;
    if (secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, secondsLeft]);

  useEffect(() => {
    if (!isOpen) return;
    if (secondsLeft !== 0) return;

    setShowTimeoutNotice(true);
  }, [secondsLeft, isOpen]);

  const progressPct = useMemo(() => {
    return Math.max(0, Math.min(100, (secondsLeft / DEFAULT_SECONDS) * 100));
  }, [secondsLeft]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const optionRequiresD20 = (optionIndex: number) => {
    const option = challenge.options?.[optionIndex];
    if (!option) return false;

    const text = `${option.label} ${option.effects}`.toLowerCase();
    return text.includes("d20") || text.includes("dado");
  };

  const optionNeedsPlayerSelection = (optionIndex: number) => {
    const option = challenge.options?.[optionIndex];
    if (!option) return false;

    const text = `${option.label} ${option.effects}`.toLowerCase();

    return (
      text.includes("voluntario") ||
      text.includes("jugador enviado") ||
      text.includes("enviar a un jugador") ||
      text.includes("un jugador se ofrece")
    );
  };

  const getOptionAccent = (index: number) => {
    const palette = [
      {
        border: "border-[#11A1AB]/35",
        bar: "bg-[#11A1AB]",
        title: "text-[#11E7F7]",
        chip: "text-[#11E7F7] border-[#11A1AB]/35 bg-[#11A1AB]/10",
        button: "border-[#11A1AB]/50 text-[#11E7F7] hover:bg-[#11A1AB]/10",
      },
      {
        border: "border-[#B89726]/35",
        bar: "bg-[#B89726]",
        title: "text-[#F5DC3F]",
        chip: "text-[#F5DC3F] border-[#B89726]/35 bg-[#B89726]/10",
        button: "border-[#B89726]/50 text-[#F5DC3F] hover:bg-[#B89726]/10",
      },
      {
        border: "border-[#8B5CF6]/35",
        bar: "bg-[#8B5CF6]",
        title: "text-[#A78BFA]",
        chip: "text-[#A78BFA] border-[#8B5CF6]/35 bg-[#8B5CF6]/10",
        button: "border-[#8B5CF6]/50 text-[#A78BFA] hover:bg-[#8B5CF6]/10",
      },
    ];

    return palette[index % palette.length];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          >
            <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#050B12]/95 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
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
                          width: `${progressPct}%`,
                          background:
                            progressPct > 50
                              ? "linear-gradient(90deg, #11A1AB, #B89726)"
                              : "linear-gradient(90deg, #B89726, #FF4D6D)",
                        }}
                      />
                    </div>

                    <div className="text-[28px] font-bold leading-none tabular-nums text-[#F5DC3F]">
                      {mm}:{ss}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 md:px-6 pt-5 md:pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-4">
                      <h2 className="text-[34px] md:text-[38px] font-bold text-[#D9E4F2] leading-none">
                        {challenge.title}
                      </h2>

                      {challenge.zone && (
                        <div className="flex items-center gap-3 min-w-[180px]">
                          <div className="h-px bg-[#11A1AB]/35 w-10" />
                          <span className="text-[18px] uppercase tracking-[0.20em] text-[#11A1AB]">
                            {challenge.zone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 md:px-6 pt-5">
                <div className="rounded-xl border border-[#B89726]/25 bg-[#08131B]/95 overflow-hidden">
                  <div className="h-full flex">
                    <div className="w-[4px] bg-[#B89726]" />
                    <div className="px-5 py-4 flex-1">
                      <div className="text-[16px] uppercase tracking-[0.22em] text-[#8FA6B5] mb-3">
                        Evento
                      </div>
                      <p className="text-[22px] leading-[1.55] text-[#D9E4F2] whitespace-pre-line">
                        {challenge.event}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {challenge.rule && (
                <div className="px-5 md:px-6 pt-4">
                  <div className="rounded-xl border border-[#9F1B0B]/25 bg-[#120A10]/95 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <TriangleAlert className="h-5 w-5 text-[#FF4D6D] mt-1 shrink-0" />
                      <div>
                        <div className="text-[16px] uppercase tracking-[0.22em] text-[#FF8EA2] mb-2">
                          Regla
                        </div>
                        <p className="text-[20px] leading-[1.5] text-[#F3D8DF]">
                          {challenge.rule}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {challenge.options && (
                <div className="px-5 md:px-6 pt-5 pb-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-[#11A1AB]" />
                    <div className="text-[18px] uppercase tracking-[0.22em] text-[#11A1AB] font-semibold">
                      Decisión grupal
                    </div>
                    <div className="h-px flex-1 bg-[#11A1AB]/25" />
                  </div>

                  {challenge.options.map((option, index) => {
                    const accent = getOptionAccent(index);
                    const active = selectedOption === index;
                    const needsD20 = optionRequiresD20(index);
                    const needsPlayer = optionNeedsPlayerSelection(index);
                    const needsProtectedPlayers = optionNeedsProtectedPlayers(index);

                    return (
                      <div
                        key={index}
                        className={[
                          "rounded-xl border bg-[#08131B]/95 overflow-hidden transition",
                          active
                            ? `${accent.border} shadow-[0_0_18px_rgba(17,161,171,0.12)]`
                            : "border-white/10",
                        ].join(" ")}
                      >
                        <div className={`h-[3px] ${accent.bar}`} />

                        <div className="px-5 py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="text-[14px] uppercase tracking-[0.22em] text-white/40 mb-1">
                                Opción {String.fromCharCode(65 + index)}
                              </div>

                              <h3 className={`text-[26px] font-bold leading-none ${accent.title}`}>
                                {option.label}
                              </h3>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            {option.effects.split("|").map((line, idx) => (
                              <div
                                key={idx}
                                className="text-[19px] leading-[1.45] text-[#D9E4F2]"
                              >
                                {line.trim()}
                              </div>
                            ))}
                          </div>

                          {needsPlayer && (
                            <div className="mt-5">
                              <div className="text-[16px] text-[#FCFFBA] mb-3">
                                Elige el jugador
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {players.map((player) => {
                                  const activePlayer = selectedPlayerId === player.id;
                                  return (
                                    <button
                                      key={player.id}
                                      onClick={() => {
                                        setSelectedOption(index);
                                        setSelectedPlayerId(player.id);
                                      }}
                                      className={[
                                        "rounded-lg border px-4 py-3 text-left transition",
                                        activePlayer
                                          ? "border-[#11A1AB] bg-[#11A1AB]/10"
                                          : "border-white/10 bg-black/20 hover:border-[#11A1AB]",
                                      ].join(" ")}
                                    >
                                      <div className="text-[#D9E4F2] font-semibold">
                                        {player.name}
                                      </div>
                                      <div className="text-white/50 text-sm">{player.role}</div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {needsProtectedPlayers && (
                            <div className="mt-5">
                              <div className="text-[16px] text-[#FCFFBA] mb-3">
                                Elige los 3 jugadores protegidos
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {players.map((player) => {
                                  const isProtected = protectedPlayerIds.includes(player.id);

                                  return (
                                    <button
                                      key={player.id}
                                      onClick={() => {
                                        setSelectedOption(index);

                                        setProtectedPlayerIds((prev) => {
                                          if (prev.includes(player.id)) {
                                            return prev.filter((id) => id !== player.id);
                                          }

                                          if (prev.length >= 3) return prev;

                                          return [...prev, player.id];
                                        });
                                      }}
                                      className={[
                                        "rounded-lg border px-4 py-3 text-left transition",
                                        isProtected
                                          ? "border-[#B89726] bg-[#B89726]/10"
                                          : "border-white/10 bg-black/20 hover:border-[#B89726]",
                                      ].join(" ")}
                                    >
                                      <div className="text-[#D9E4F2] font-semibold">{player.name}</div>
                                      <div className="text-white/50 text-sm">{player.role}</div>
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="mt-2 text-sm text-white/50">
                                Seleccionados: {protectedPlayerIds.length}/3
                              </div>
                            </div>
                          )}

                          {needsD20 && (
                            <div className="mt-5">
                              <div className="flex items-center gap-3 mb-3">
                                <Dice5 className="h-5 w-5 text-[#F5DC3F]" />
                                <div className="text-[18px] uppercase tracking-[0.22em] text-[#F5DC3F] font-semibold">
                                  Resultado del D20
                                </div>
                                <div className="h-px flex-1 bg-[#F5DC3F]/25" />
                              </div>

                              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                                {Array.from({ length: 20 }, (_, i) => i + 1).map((value) => {
                                  const activeD20 = selectedD20 === value;
                                  return (
                                    <button
                                      key={value}
                                      onClick={() => {
                                        setSelectedOption(index);
                                        setSelectedD20(value);
                                      }}
                                      className={[
                                        "h-12 rounded-lg border text-[20px] font-bold tabular-nums transition",
                                        activeD20
                                          ? "border-[#F5DC3F] bg-[#B89726]/15 text-[#F5DC3F]"
                                          : "border-white/10 bg-[#081018] text-[#D9E4F2] hover:bg-white/5",
                                      ].join(" ")}
                                    >
                                      {value}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => {
                              if (needsD20 && selectedD20 === null) return;
                              if (needsPlayer && !selectedPlayerId) return;
                              if (needsProtectedPlayers && protectedPlayerIds.length !== 3) return;

                              onComplete({
                                challengeId: challenge.id,
                                optionIndex: index,
                                subOptionIndex: null,
                                d20: needsD20 ? selectedD20 : null,
                                selectedPlayerId: needsPlayer ? selectedPlayerId : null,
                                protectedPlayerIds: needsProtectedPlayers ? protectedPlayerIds : [],
                              });
                            }}
                            className={[
                              "mt-5 w-full h-14 rounded-lg border font-bold text-[20px] tracking-[0.08em] transition",
                              accent.button + " bg-white/5",
                            ].join(" ")}
                          >
                            <span className="inline-flex items-center gap-2">
                              <Check className="h-5 w-5" />
                              ELEGIR ESTA OPCIÓN
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                  onClick={() => {
                    setShowTimeoutNotice(false);
                    onComplete({
                      challengeId: challenge.id,
                      timedOut: true,
                    });
                  }}
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