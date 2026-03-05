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

type Props = {
  player: Player;
  onUpdateHP: (hp: number) => void;
  onUpdatePoints: (delta: number) => void;
  onUpdateAmmunition?: (ammo: number) => void;
};

export function PlayerCard({
  player,
  onUpdateHP,
  onUpdatePoints,
  onUpdateAmmunition,
}: Props) {
  const hpPct = useMemo(() => {
    const max = Math.max(1, player.maxHp ?? 1);
    return Math.min(100, Math.max(0, (player.hp / max) * 100));
  }, [player.hp, player.maxHp]);

  const clamp = (val: number, min: number, max: number) =>
    Math.min(max, Math.max(min, val));

  const hasAmmo = typeof player.ammunition === "number" && !!onUpdateAmmunition;

  const hpStatus =
    player.hp <= player.maxHp * 0.25
      ? "Crítico"
      : player.hp <= player.maxHp * 0.6
      ? "Herido"
      : "Normal";

  const hpStatusColor =
    hpStatus === "Crítico"
      ? "bg-[#9F1B0B]/30 text-[#FFB4A8] border-[#9F1B0B]/30"
      : hpStatus === "Herido"
      ? "bg-[#B89726]/18 text-[#E4E8A6] border-[#B89726]/25"
      : "bg-[#11A1AB]/14 text-[#B7F7FF] border-[#11A1AB]/22";

  const IconBtn =
    "h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white text-xl hover:bg-white/10 active:scale-95 transition";

  const hpTrackStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, rgba(184,151,38,0.95) ${hpPct}%, rgba(255,255,255,0.12) ${hpPct}%)`,
  };

  return (
    <div
      className="
        rounded-xl border border-white/10 bg-black/35 backdrop-blur-sm
        px-4 py-3
        shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]
      "
    >
      {/* Header compacto */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[#B89726] font-semibold text-xl leading-none truncate">
            {player.name}
          </div>
          <div className="text-white/65 text-sm mt-1 truncate">
            {player.role ?? ""}
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full border text-xs font-semibold shrink-0 ${hpStatusColor}`}>
          <span className="inline-flex items-center gap-2">
            <Heart className="h-3.5 w-3.5" />
            {hpStatus}
          </span>
        </div>
      </div>

      {/* HP */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-sm text-white/80">
          <span className="text-[#11A1AB] font-semibold">HP</span>
          <span className="text-[#E4E8A6] font-semibold">
            {player.hp}/{player.maxHp}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={player.maxHp}
          step={1}
          value={player.hp}
          onChange={(e) =>
            onUpdateHP(clamp(Number(e.target.value), 0, player.maxHp))
          }
          style={hpTrackStyle}
          className="mt-2 w-full h-3 rounded-full appearance-none cursor-pointer outline-none"
        />

        <style>{`
          input[type="range"]::-webkit-slider-thumb{
            -webkit-appearance:none;
            appearance:none;
            width:18px;height:18px;
            border-radius:999px;
            background:#E4E8A6;
            border:2px solid rgba(255,255,255,0.55);
            box-shadow:0 0 18px rgba(184,151,38,0.45);
          }
          input[type="range"]::-moz-range-thumb{
            width:18px;height:18px;
            border-radius:999px;
            background:#E4E8A6;
            border:2px solid rgba(255,255,255,0.55);
            box-shadow:0 0 18px rgba(184,151,38,0.45);
          }
        `}</style>
      </div>

      {/* Puntos/Munición — MÁS compacto como tu referencia */}
      <div className={`mt-3 ${hasAmmo ? "grid grid-cols-2 gap-3" : ""}`}>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Puntos</span>
            <span className="text-white text-lg font-semibold">{player.points}</span>
          </div>

          {/* menos padding aquí */}
          <div className="mt-2 flex items-center justify-between">
            <button onClick={() => onUpdatePoints(-1)} className={IconBtn}>
              −
            </button>
            <button onClick={() => onUpdatePoints(1)} className={IconBtn}>
              +
            </button>
          </div>
        </div>

        {hasAmmo && (
          <div className="rounded-xl border border-[#11A1AB]/25 bg-black/20 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Munición</span>
              <span className="text-[#11A1AB] text-lg font-semibold">
                {player.ammunition}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <button
                onClick={() =>
                  onUpdateAmmunition?.(Math.max(0, (player.ammunition ?? 0) - 1))
                }
                className={IconBtn}
              >
                −
              </button>

              <button
                onClick={() => onUpdateAmmunition?.((player.ammunition ?? 0) + 1)}
                className={IconBtn}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}