import { useMemo } from "react";
import { Heart } from "lucide-react";

type Player = {
  id: string | number;
  name: string;
  role?: string;
  hp: number;
  maxHp: number;
  points: number;
  ammunition?: number;
};

type SharedResources = {
  plasmaShield: number;
  sporeDetector: number;
  medicalKit: number;
  ammunition: number;
};

type Props = {
  player: Player;
  resources: SharedResources;
};

export function PlayerCard({ player, resources }: Props) {
  const hpPct = useMemo(() => {
    const max = Math.max(1, player.maxHp ?? 1);
    return Math.min(100, Math.max(0, (player.hp / max) * 100));
  }, [player.hp, player.maxHp]);

  const status =
    player.hp <= player.maxHp * 0.25
      ? "Crítico"
      : player.hp <= player.maxHp * 0.6
      ? "Herido"
      : "Normal";

  const roleColors: Record<string, string> = {
    luchadora: "#FF4D6D",
    médico: "#22C55E",
    medico: "#22C55E",
    ingeniero: "#F4B52C",
    investigadora: "#8B5CF6",
    exploradora: "#11A1AB",
  };

  const roleKey = (player.role || "").toLowerCase();
  const accent = roleColors[roleKey] || "#11A1AB";

  const statusClass =
    status === "Crítico"
      ? "bg-[#9F1B0B]/20 text-[#FFB4A8] border-[#9F1B0B]/35"
      : status === "Herido"
      ? "bg-[#B89726]/15 text-[#FCFFBA] border-[#B89726]/30"
      : "bg-[#0D3B2A]/30 text-[#7CFFB2] border-[#1F8A5B]/40";

  const resourceCards = [
    { label: "Escudo Plasma", value: resources.plasmaShield, color: "#11A1AB" },
    { label: "Det. Esporas", value: resources.sporeDetector, color: "#F4B52C" },
    { label: "Kit Médico", value: resources.medicalKit, color: "#22C55E" },
  ];

  return (
    <div
      className="rounded-xl border bg-[#050B12]/90 px-6 py-5"
      style={{
        borderColor: `${accent}55`,
        boxShadow: `0 0 0 1px ${accent}22 inset`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-5">
            <h3 className="text-[32px] font-bold text-[#D9E4F2] leading-none">
              {player.name}
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-[13px] uppercase tracking-[0.22em] text-white/50">
                Puntos
              </span>

              <span className="text-[26px] font-bold text-[#FCFFBA] tabular-nums">
                {player.points}
              </span>
            </div>
          </div>

          <p
            className="mt-1 text-[16px] uppercase tracking-[0.2em] font-semibold"
            style={{ color: accent }}
          >
            {player.role}
          </p>
        </div>

        <div
          className={`rounded-md border px-3 py-1 text-[14px] font-semibold ${statusClass}`}
        >
          <span className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            {status}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-[14px] uppercase tracking-[0.18em] text-white/40">
            HP
          </span>

          <span
            className="text-[26px] font-bold tabular-nums"
            style={{ color: accent }}
          >
            {player.hp}/{player.maxHp}
          </span>
        </div>

        <div className="mt-2 h-[9px] w-full rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${hpPct}%`,
              backgroundColor: accent,
              boxShadow: `0 0 18px ${accent}88`,
            }}
          />
        </div>
      </div>

      <div className="my-5 h-px bg-white/10" />

      <div>
        <div className="text-[13px] uppercase tracking-[0.22em] text-white/40 mb-2">
          Recursos del grupo
        </div>

        <div className="space-y-2">
          {resourceCards.map((resource) => (
            <div
              key={resource.label}
              className="flex items-center justify-between rounded-md border px-3 py-2"
              style={{
                borderColor: `${resource.color}55`,
                backgroundColor: `${resource.color}10`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: resource.color }}
                />

                <span
                  className="text-[16px] font-medium tracking-wide"
                  style={{ color: resource.color }}
                >
                  {resource.label}
                </span>
              </div>

              <span
                className="text-[24px] font-bold tabular-nums"
                style={{ color: resource.color }}
              >
                {resource.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {typeof player.ammunition === "number" && (
        <div className="mt-4">
          <div className="text-[13px] uppercase tracking-[0.22em] text-white/40 mb-2">
            Munición personal
          </div>

          <div
            className="flex items-center justify-between rounded-md border px-3 py-2"
            style={{
              borderColor: "#11A1AB55",
              backgroundColor: "#11A1AB10",
            }}
          >
            <span className="text-[16px] font-medium tracking-wide text-[#11A1AB]">
              Reserva
            </span>

            <span className="text-[24px] font-bold tabular-nums text-[#11A1AB]">
              {player.ammunition}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}