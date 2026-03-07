import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Clock3,
  Shield,
  TriangleAlert,
  Dice5,
  Check,
  ChevronRight,
} from "lucide-react";
import { Challenge } from "../data/challengesData";
import { Button } from "./ui/button";

interface ChallengeModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const DEFAULT_SECONDS = 100;

export function ChallengeModal({
  challenge,
  isOpen,
  onClose,
  onComplete,
}: ChallengeModalProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedSubOption, setSelectedSubOption] = useState<number | null>(null);
  const [selectedD20, setSelectedD20] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);

  useEffect(() => {
    if (!isOpen) return;

    setSelectedOption(null);
    setSelectedSubOption(null);
    setSelectedD20(null);
    setSecondsLeft(DEFAULT_SECONDS);
  }, [isOpen, challenge.id]);

  useEffect(() => {
    if (!isOpen) return;
    if (secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, secondsLeft]);

  const progressPct = useMemo(() => {
    return Math.max(0, Math.min(100, (secondsLeft / DEFAULT_SECONDS) * 100));
  }, [secondsLeft]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const requiresD20 = useMemo(() => {
    const text = `${challenge.rule ?? ""} ${challenge.event ?? ""} ${challenge.options
      ?.map((o) => `${o.label} ${o.effects}`)
      .join(" ") ?? ""}`.toLowerCase();

    return text.includes("d20") || text.includes("dado");
  }, [challenge]);

  const selectedOptionData =
    selectedOption !== null ? challenge.options?.[selectedOption] : null;

  const needsSubDecision = !!selectedOptionData?.subDecision;
  const canSubmit =
    selectedOption !== null &&
    (!needsSubDecision || selectedSubOption !== null) &&
    (!requiresD20 || selectedD20 !== null);

  const handleComplete = () => {
    if (!canSubmit) return;
    onComplete();
  };

  const getOptionAccent = (index: number) => {
    const palette = [
      {
        border: "border-[#11A1AB]/35",
        bar: "bg-[#11A1AB]",
        title: "text-[#11E7F7]",
        chip: "text-[#11E7F7] border-[#11A1AB]/35 bg-[#11A1AB]/10",
        button:
          "border-[#11A1AB]/50 text-[#11E7F7] hover:bg-[#11A1AB]/10",
      },
      {
        border: "border-[#B89726]/35",
        bar: "bg-[#B89726]",
        title: "text-[#F5DC3F]",
        chip: "text-[#F5DC3F] border-[#B89726]/35 bg-[#B89726]/10",
        button:
          "border-[#B89726]/50 text-[#F5DC3F] hover:bg-[#B89726]/10",
      },
      {
        border: "border-[#8B5CF6]/35",
        bar: "bg-[#8B5CF6]",
        title: "text-[#A78BFA]",
        chip: "text-[#A78BFA] border-[#8B5CF6]/35 bg-[#8B5CF6]/10",
        button:
          "border-[#8B5CF6]/50 text-[#A78BFA] hover:bg-[#8B5CF6]/10",
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
              {/* TIMER */}
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

              {/* HEADER */}
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

              {/* EVENTO */}
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

              {/* REGLA */}
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

              {/* D20 */}
              {requiresD20 && (
                <div className="px-5 md:px-6 pt-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Dice5 className="h-5 w-5 text-[#F5DC3F]" />
                    <div className="text-[18px] uppercase tracking-[0.22em] text-[#F5DC3F] font-semibold">
                      Resultado del D20
                    </div>
                    <div className="h-px flex-1 bg-[#F5DC3F]/25" />
                  </div>

                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((value) => {
                      const active = selectedD20 === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setSelectedD20(value)}
                          className={[
                            "h-12 rounded-lg border text-[20px] font-bold tabular-nums transition",
                            active
                              ? "border-[#F5DC3F] bg-[#B89726]/15 text-[#F5DC3F] shadow-[0_0_16px_rgba(184,151,38,0.22)]"
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

              {/* DECISIÓN */}
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

                            <div className={`rounded-md border px-3 py-1 text-[13px] uppercase tracking-[0.18em] ${accent.chip}`}>
                              {index === 0 ? "Calculado" : index === 1 ? "Riesgo alto" : "Pérdida segura"}
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

                          {/* subdecisión */}
                          {option.subDecision && (
                            <div className="mt-5 rounded-lg border border-white/10 bg-black/20 px-4 py-4">
                              <div className="text-[16px] text-[#FCFFBA] mb-3">
                                {option.subDecision.description}
                              </div>

                              <div className="space-y-2">
                                {option.subDecision.options.map((subOpt, subIdx) => {
                                  const subActive = selectedSubOption === subIdx;
                                  return (
                                    <button
                                      key={subIdx}
                                      onClick={() => {
                                        setSelectedOption(index);
                                        setSelectedSubOption(subIdx);
                                      }}
                                      className={[
                                        "w-full rounded-lg border px-4 py-3 text-left transition",
                                        subActive
                                          ? "border-[#11A1AB]/45 bg-[#11A1AB]/10"
                                          : "border-white/10 bg-[#081018] hover:bg-white/5",
                                      ].join(" ")}
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <div>
                                          <div className="text-[20px] font-bold text-[#D9E4F2]">
                                            {subOpt.label}
                                          </div>
                                          <div className="mt-1 text-[17px] text-white/65 whitespace-pre-line">
                                            {subOpt.effects}
                                          </div>
                                        </div>

                                        {subActive && (
                                          <Check className="h-5 w-5 text-[#11E7F7] shrink-0" />
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => {
                              setSelectedOption(index);
                              if (!option.subDecision) setSelectedSubOption(null);
                            }}
                            className={[
                              "mt-5 w-full h-14 rounded-lg border font-bold text-[20px] tracking-[0.08em] transition",
                              active
                                ? accent.button + " bg-white/5"
                                : "border-white/10 text-white/75 hover:bg-white/5",
                            ].join(" ")}
                          >
                            {active ? "✓ OPCIÓN SELECCIONADA" : "✓ ELEGIR ESTA OPCIÓN"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* FOOTER */}
              
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}