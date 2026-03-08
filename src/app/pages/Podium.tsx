import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useGame } from "../context/GameContext";
import { Button } from "../components/ui/button";
import {
  Trophy,
  Home,
  RotateCcw,
  Crown,
  Skull,
  Sparkles,
  Swords,
  Dna,
  Compass,
} from "lucide-react";
import { getChallengesBySide } from "../data/challengesData";

const COMPLETED_KEY = "completedChallenges";

type FinalKey = "real" | "fantastico" | "feliz" | "malo";

const endings: Record<
  FinalKey,
  {
    title: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
    backgroundImage: string;
    description: string;
  }
> = {
  real: {
    title: "FINAL REAL — La Guerra que el Cielo no vio venir",
    color: "#B89726",
    icon: Crown,
    backgroundImage: "/assets/Resolución final bueno.png",
    description: `En el interior de una cabaña olvidada, entre los vestigios de una secta que adoraba a la oscuridad, encontraron la verdad que nadie quería saber: las Sombras no actuaban solas. Detrás de cada mutado, de cada espora, de cada vida arrebatada, había una voluntad. La llamaban La Reina de las Sombras, una entidad cósmica de poder incalculable que tomaba forma de mujer y que llevaba siglos buscando un receptor humano para apoderarse de la Tierra desde adentro.

Pero en esos mismos textos prohibidos encontraron algo más: un nombre. Una entidad opuesta a la Reina, su contraparte cósmica, su única debilidad real. La Némesis. Y la única forma de invocarla era mediante un sacrificio voluntario, alguien del grupo que entregara su vida para abrir el portal entre lo que existe y lo que no debería. Uno de los suyos dio un paso al frente.

Lo que vino después no tiene palabras en ningún idioma humano. Dos fuerzas cósmicas colisionaron sobre el cielo de la Tierra en una guerra que sacudió la realidad hasta sus cimientos. Cuando el polvo se asentó, la Reina había sido derrotada, las Sombras se desvanecieron, y la humanidad por primera vez comprendió no solo cómo había comenzado todo sino cómo asegurarse de que jamás volviera a ocurrir.

La Tierra fue salvada por alguien que eligió no verlo.`,
  },
  fantastico: {
    title: "FINAL FANTÁSTICO — Lo que no tiene nombre",
    color: "#11A1AB",
    icon: Sparkles,
    backgroundImage: "/assets/Resolución final bueno.png",
    description: `Nadie sabe exactamente qué pasó. En un instante las entidades estaban ahí, amenazantes e imparables, y al siguiente fueron selladas como si una mano invisible las hubiera arrastrado fuera de este mundo. Los científicos no tienen explicación. Los sobrevivientes hablan entre susurros de una presencia que nadie vio del todo, una fuerza que actuó desde los márgenes de la realidad como si llevara mucho tiempo esperando el momento indicado. Algunos juran haber sentido algo, una vibración distinta, casi cálida, justo antes de que todo terminara.

Algo intervino. Algo que no pertenece a este mundo, pero que por alguna razón lo protegió.`,
  },
  feliz: {
    title: "FINAL FELIZ — El Amanecer Silencioso",
    color: "#FCFFBA",
    icon: Compass,
    backgroundImage: "/assets/Resolución final bueno.png",
    description: `Un día, sin explicación ni señal previa, las Sombras simplemente... desaparecieron. No hubo batalla final, no hubo cuenta regresiva. Solo el silencio donde antes había horror. La humanidad, herida pero viva, comenzó a reconstruirse en los rincones del mundo que las criaturas dejaron intactos. Nadie sabe con certeza qué las hizo retroceder. Algunos lo atribuyen al azar, otros a algo más grande que nadie logra nombrar. Lo que sí es cierto es que, por primera vez en mucho tiempo, el sol volvió a sentirse como una promesa y no como una despedida.

La humanidad sobrevivió. Por ahora, eso es suficiente.`,
  },
  malo: {
    title: "FINAL MALO — La Última Penumbra",
    color: "#9F1B0B",
    icon: Skull,
    backgroundImage: "/assets/Resolución final bueno.png",
    description: `No fue rápido. Eso es lo más cruel de todo. La humanidad no se apagó de golpe sino que se fue consumiendo lentamente, como una llama bajo la lluvia. La hambruna llegó primero, luego el caos, luego el silencio. Las Sombras no necesitaron apresurarse: simplemente esperaron a que los humanos se rindieran solos. Al final, no quedó nada que valiera la pena conquistar. Solo un mundo vacío, cubierto de oscuridad, donde alguna vez hubo ciudades, risas y vida.

Las Sombras no ganaron una guerra. Ganaron un cementerio.`,
  },
};

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.7,
        duration: 2.2 + Math.random() * 1.3,
        rotate: -180 + Math.random() * 360,
        drift: -120 + Math.random() * 240,
        size: 5 + Math.random() * 8,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ opacity: 0, x: 0, y: -30, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: piece.drift,
            y: 520,
            rotate: piece.rotate,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut",
          }}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.3,
            background:
              piece.id % 4 === 0
                ? "#B89726"
                : piece.id % 4 === 1
                ? "#11A1AB"
                : piece.id % 4 === 2
                ? "#FCFFBA"
                : "#9F1B0B",
          }}
        />
      ))}
    </div>
  );
}

export default function Podium() {
  const navigate = useNavigate();
  const { players, groupPoints, resources, currentPath, resetGame } = useGame();
  const [phase, setPhase] = useState<"ending" | "podium">("ending");

  const completedChallengeIds = useMemo(() => {
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  }, []);

  const currentPathChallenges = useMemo(() => {
    return currentPath ? getChallengesBySide(currentPath) : [];
  }, [currentPath]);

  const ending = useMemo(() => {
    const completedOnCurrentPath = currentPathChallenges.filter((challenge) =>
      completedChallengeIds.includes(challenge.id)
    ).length;

    const completedAllCurrentPathChallenges =
      currentPathChallenges.length > 0 &&
      completedOnCurrentPath >= currentPathChallenges.length;

    const activeResourcesCount = Object.values(resources).filter(
      (value) => value > 0
    ).length;

    const noEliminatedPlayers = players.every((player) => player.hp > 0);
    const allPlayersHealthyEnough = players.every((player) => player.hp >= 15);

    if (
      groupPoints >= 100 &&
      completedAllCurrentPathChallenges &&
      activeResourcesCount >= 3 &&
      noEliminatedPlayers &&
      allPlayersHealthyEnough
    ) {
      return endings.real;
    }

    if (groupPoints >= 80 && completedOnCurrentPath >= 3) {
      return endings.fantastico;
    }

    if (groupPoints >= 30 && groupPoints <= 79) {
      return endings.feliz;
    }

    return endings.malo;
  }, [
    groupPoints,
    players,
    resources,
    currentPathChallenges,
    completedChallengeIds,
  ]);

  const topPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.points - a.points).slice(0, 3);
  }, [players]);

  const getBadge = (points: number) => {
    if (points >= 80) {
      return { label: "MENCIÓN DE HONOR SUPREMA", color: "#B89726" };
    }
    if (points >= 65) {
      return { label: "MENCIÓN DE HONOR", color: "#11A1AB" };
    }
    if (points >= 50) {
      return { label: "RECONOCIMIENTO AL MÉRITO", color: "#9F1B0B" };
    }
    return null;
  };

  const getPodiumAccent = (index: number) => {
    if (index === 0) {
      return {
        border: "#B89726",
        text: "#FCFFBA",
        glow: "rgba(184,151,38,0.35)",
        panel: "rgba(184,151,38,0.10)",
        soft: "#B89726",
        line: "#B89726",
      };
    }

    if (index === 1) {
      return {
        border: "#11A1AB",
        text: "#FCFFBA",
        glow: "rgba(17,161,171,0.28)",
        panel: "rgba(17,161,171,0.08)",
        soft: "#11A1AB",
        line: "#11A1AB",
      };
    }

    return {
      border: "#9F1B0B",
      text: "#FCFFBA",
      glow: "rgba(159,27,11,0.28)",
      panel: "rgba(159,27,11,0.10)",
      soft: "#9F1B0B",
      line: "#9F1B0B",
    };
  };

  const getTopIcon = (playerId?: string) => {
    const id = (playerId ?? "").toLowerCase();

    if (id.includes("keira")) return Swords;
    if (id.includes("adrian")) return Dna;
    if (id.includes("leni")) return Compass;

    return Trophy;
  };

  const handleNewGame = () => {
    resetGame();
    localStorage.removeItem("completedChallenges");
    localStorage.removeItem("autoChallengeShown_right");
    localStorage.removeItem("autoChallengeShown_left");
    localStorage.setItem("gameSessionId", String(Date.now()));
    navigate("/path-decision");
  };
  const handleNewSesion = () => {
    resetGame();
    localStorage.removeItem("completedChallenges");
    localStorage.removeItem("autoChallengeShown_right");
    localStorage.removeItem("autoChallengeShown_left");
    localStorage.setItem("gameSessionId", String(Date.now()));
    navigate("/");
  };

  const EndingIcon = ending.icon;

  return (
    <div
      className="min-h-screen p-6 md:p-8 relative overflow-hidden"
      style={{
        backgroundColor: "#050B12",
        backgroundImage:
          phase === "ending"
            ? `url('${ending.backgroundImage}')`
            : "url('/assets/Resolución final bueno.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            phase === "ending"
              ? "rgba(208, 208, 208, 0.05)"
              : "linear-gradient(180deg, rgba(5,11,18,0.84) 0%, rgba(5,11,18,0.92) 20%) 20%",
        }}
      />

      <div className="relative z-10 flex justify-center">
        <img
          src="/assets/conejo log.svg"
          alt="Logo"
          className="w-40 md:w-48 opacity-95"
        />
      </div>

      <div className="relative z-10 max-w-[760px] mx-auto">
        <AnimatePresence mode="wait">
          {phase === "ending" ? (
            <motion.div
              key="ending-phase"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35 }}
              className="min-h-[78vh] flex items-start justify-center pt-10 md:pt-16"
            >
              <div className="w-full max-w-3xl">
                <div
                  className="rounded-[28px] border px-8 py-8 md:px-12 md:py-10 text-center flex flex-col justify-start"
                  style={{
                    borderColor: `${ending.color}55`,
                    background:
                      "linear-gradient(180deg, rgba(5,11,18,0.68) 0%, rgba(5,11,18,0.88) 100%)",
                    boxShadow: `0 0 45px rgba(0,0,0,0.34), 0 0 0 1px ${ending.color}12 inset`,
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <EndingIcon
                      className="h-14 w-14 md:h-16 md:w-16"
                      style={{ color: ending.color }}
                    />
                  </div>

                  <h1
                    className="text-2xl md:text-4xl font-bold tracking-wide mb-4"
                    style={{ color: ending.color }}
                  >
                    {ending.title}
                  </h1>

                  <p className="text-[#E6E6E6] text-xl md:text-2xl leading-[1.45] whitespace-pre-line max-w-2xl mx-auto text-left self-stretch">
                    {ending.description}
                  </p>

                  <div className="mt-7 flex justify-center">
                    <div className="h-px w-40 bg-white/30" />
                  </div>

                  <div className="mt-7 flex justify-center">
                    <Button
                      onClick={() => setPhase("podium")}
                      className="
                        h-15 px-10
                        bg-[#B89726]
                        hover:bg-[#11A1AB]/85
                        text-[#100605]
                        font-bold text-3xl
                        tracking-wider
                        shadow-[0_0_22px_rgba(17,161,171,0.25)]
                      "
                    >
                      CONTINUAR
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="podium-phase"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="relative"
            >
              <ConfettiBurst />

              <div className="text-center mb-8">
                <h1
                  className="text-4xl md:text-5xl font-bold tracking-[0.28em]"
                  style={{
                    color: "#FCFFBA",
                    textShadow: "0 0 16px rgba(184,151,38,0.35)",
                  }}
                >
                  PODIO
                </h1>
                <div className="mt-3 h-px bg-gradient-to-r from-transparent via-[#B89726] to-transparent" />
              </div>

              <div className="relative mb-10">
                <div className="grid grid-cols-3 gap-3 md:gap-6 items-end max-w-5xl mx-auto">
                  {/* Segundo */}
                  <div className="flex flex-col items-center">
                    {topPlayers[1] &&
                      (() => {
                        const player = topPlayers[1];
                        const accent = getPodiumAccent(1);
                        const Icon = getTopIcon(player.id);

                        return (
                          <>
                            <div className="mb-3 text-center">
                              <div className="mb-2 text-xl">🥈</div>

                              <div
                                className="mx-auto mb-3 h-16 w-16 md:h-20 md:w-20 rounded-full border-2 flex items-center justify-center"
                                style={{
                                  borderColor: `${accent.border}CC`,
                                  background: "rgba(6,56,80,0.35)",
                                  boxShadow: `0 0 18px ${accent.glow}`,
                                }}
                              >
                                <Icon
                                  className="h-8 w-8 md:h-10 md:w-10"
                                  style={{ color: accent.soft }}
                                />
                              </div>

                              <div className="text-xl md:text-3xl font-bold text-[#FCFFBA] leading-none">
                                {player.name}
                              </div>

                              <div
                                className="text-[11px] md:text-sm uppercase tracking-[0.22em] mt-2"
                                style={{ color: accent.border }}
                              >
                                {player.points} pts
                              </div>
                            </div>

                            <div
                              className="w-full max-w-[180px] md:max-w-[200px] h-32 md:h-40 rounded-t-[14px] border flex items-center justify-center relative overflow-hidden"
                              style={{
                                borderColor: `${accent.border}88`,
                                background:
                                  "linear-gradient(180deg, rgba(17,161,171,0.12) 0%, rgba(6,56,80,0.22) 35%, rgba(5,11,18,0.96) 100%)",
                                boxShadow: `inset 0 0 0 1px ${accent.border}20`,
                              }}
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(252,255,186,0.05)_0%,transparent_45%)]" />
                              <span
                                className="text-6xl md:text-7xl font-bold leading-none"
                                style={{ color: "rgba(252,255,186,0.70)" }}
                              >
                                2
                              </span>
                            </div>
                          </>
                        );
                      })()}
                  </div>

                  {/* Primero */}
                  <div className="flex flex-col items-center">
                    {topPlayers[0] &&
                      (() => {
                        const player = topPlayers[0];
                        const accent = getPodiumAccent(0);
                        const Icon = getTopIcon(player.id);

                        return (
                          <>
                            <div className="mb-3 text-center relative">
                              <div className="absolute -top-9 left-1/2 -translate-x-1/2 text-3xl md:text-4xl">
                                👑
                              </div>

                              <div
                                className="mx-auto mb-3 h-20 w-20 md:h-24 md:w-24 rounded-full border-2 flex items-center justify-center"
                                style={{
                                  borderColor: accent.border,
                                  background: "rgba(184,151,38,0.10)",
                                  boxShadow: `0 0 26px ${accent.glow}`,
                                }}
                              >
                                <Icon
                                  className="h-10 w-10 md:h-12 md:w-12"
                                  style={{ color: "#FCFFBA" }}
                                />
                              </div>

                              <div className="text-2xl md:text-4xl font-bold text-[#FCFFBA] leading-none">
                                {player.name}
                              </div>

                              <div
                                className="text-[11px] md:text-sm uppercase tracking-[0.22em] mt-2"
                                style={{ color: accent.border }}
                              >
                                {player.points} pts
                              </div>
                            </div>

                            <div
                              className="w-full max-w-[200px] md:max-w-[220px] h-44 md:h-52 rounded-t-[14px] border flex items-center justify-center relative overflow-hidden"
                              style={{
                                borderColor: `${accent.border}CC`,
                                background:
                                  "linear-gradient(180deg, rgba(184,151,38,0.22) 0%, rgba(184,151,38,0.10) 25%, rgba(6,56,80,0.18) 50%, rgba(5,11,18,0.96) 100%)",
                                boxShadow: `0 0 28px ${accent.glow}, inset 0 0 0 1px rgba(252,255,186,0.06)`,
                              }}
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(252,255,186,0.08)_0%,transparent_40%)]" />
                              <span
                                className="text-7xl md:text-8xl font-bold leading-none"
                                style={{
                                  color: "#FCFFBA",
                                  textShadow: "0 0 18px rgba(184,151,38,0.55)",
                                }}
                              >
                                1
                              </span>
                            </div>
                          </>
                        );
                      })()}
                  </div>

                  {/* Tercero */}
                  <div className="flex flex-col items-center">
                    {topPlayers[2] &&
                      (() => {
                        const player = topPlayers[2];
                        const accent = getPodiumAccent(2);
                        const Icon = getTopIcon(player.id);

                        return (
                          <>
                            <div className="mb-3 text-center">
                              <div className="mb-2 text-xl">🥉</div>

                              <div
                                className="mx-auto mb-3 h-16 w-16 md:h-20 md:w-20 rounded-full border-2 flex items-center justify-center"
                                style={{
                                  borderColor: `${accent.border}CC`,
                                  background: "rgba(6,56,80,0.35)",
                                  boxShadow: `0 0 18px ${accent.glow}`,
                                }}
                              >
                                <Icon
                                  className="h-8 w-8 md:h-10 md:w-10"
                                  style={{ color: accent.soft }}
                                />
                              </div>

                              <div className="text-xl md:text-3xl font-bold text-[#FCFFBA] leading-none">
                                {player.name}
                              </div>

                              <div
                                className="text-[11px] md:text-sm uppercase tracking-[0.22em] mt-2"
                                style={{ color: accent.border }}
                              >
                                {player.points} pts
                              </div>
                            </div>

                            <div
                              className="w-full max-w-[180px] md:max-w-[200px] h-28 md:h-36 rounded-t-[14px] border flex items-center justify-center relative overflow-hidden"
                              style={{
                                borderColor: `${accent.border}88`,
                                background:
                                  "linear-gradient(180deg, rgba(159,27,11,0.16) 0%, rgba(6,56,80,0.18) 35%, rgba(5,11,18,0.96) 100%)",
                                boxShadow: `inset 0 0 0 1px ${accent.border}20`,
                              }}
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(252,255,186,0.04)_0%,transparent_45%)]" />
                              <span
                                className="text-6xl md:text-7xl font-bold leading-none"
                                style={{ color: "rgba(252,255,186,0.70)" }}
                              >
                                3
                              </span>
                            </div>
                          </>
                        );
                      })()}
                  </div>
                </div>

                <div
                  className="mt-0 h-[5px] w-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(17,161,171,0.25) 0%, #B89726 50%, rgba(159,27,11,0.35) 100%)",
                    boxShadow: "0 0 12px rgba(184,151,38,0.35)",
                  }}
                />
              </div>

              <div className="space-y-3 max-w-5xl mx-auto">
                {topPlayers.map((player, index) => {
                  const badge = getBadge(player.points);
                  const accent = getPodiumAccent(index);

                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="rounded-[14px] border px-4 py-4 md:px-5 md:py-4 relative overflow-hidden"
                      style={{
                        borderColor: `${accent.border}AA`,
                        background:
                          "linear-gradient(90deg, rgba(6,56,80,0.28) 0%, rgba(7,15,24,0.96) 18%, rgba(5,11,18,0.98) 100%)",
                        boxShadow:
                          index === 0
                            ? `0 0 18px ${accent.glow}`
                            : `0 0 12px ${accent.glow}`,
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 h-full w-[4px]"
                        style={{ backgroundColor: accent.border }}
                      />

                      <div className="grid grid-cols-[52px_1fr_auto] md:grid-cols-[60px_1fr_auto] gap-4 items-center">
                        <div
                          className="flex items-center justify-center text-3xl md:text-4xl font-bold leading-none"
                          style={{ color: accent.text }}
                        >
                          {index + 1}
                        </div>

                        <div>
                          <div className="text-2xl md:text-4xl font-bold text-[#FCFFBA] leading-none">
                            {player.name}
                          </div>

                          {badge && (
                            <div
                              className="mt-1 text-[11px] md:text-[13px] font-semibold uppercase tracking-[0.22em]"
                              style={{ color: badge.color }}
                            >
                              {badge.label}
                            </div>
                          )}

                          <div className="mt-1 text-sm md:text-lg uppercase tracking-[0.14em] text-[#7AB6BE]">
                            {player.role}
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className="text-3xl md:text-5xl font-bold leading-none"
                            style={{
                              color: accent.text,
                              textShadow:
                                index === 0
                                  ? "0 0 14px rgba(184,151,38,0.35)"
                                  : "0 0 10px rgba(252,255,186,0.10)",
                            }}
                          >
                            {player.points}
                          </div>
                          <div className="text-xs md:text-sm tracking-[0.22em] uppercase text-[#6FA7B3] mt-1">
                            pts
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="mt-8 flex gap-4 justify-center flex-wrap"
              >
                <Button
                  onClick={handleNewSesion}
                  className="
                    h-14 px-8
                    bg-[#081018]
                    hover:bg-[#063850]
                    border border-[#11A1AB]/20
                    text-[#FCFFBA]
                    font-bold
                    text-2xl
                    tracking-[0.08em]
                  "
                >
                  <Home className="mr-2 h-8 w-8" />
                  VOLVER AL INICIO
                </Button>

                <Button
                  onClick={handleNewGame}
                  className="
                    h-14 px-8
                    bg-[#B89726]
                    hover:bg-[#11A1AB]/85
                    text-[#100605]
                    font-bold
                    text-2xl
                    tracking-[0.08em]
                    shadow-[0_0_22px_rgba(17,161,171,0.25)]
                  "
                >
                  <RotateCcw className="mr-2 h-8 w-8" />
                  NUEVA PARTIDA
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}