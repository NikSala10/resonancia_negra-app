import { motion } from "motion/react";
import {
  Hand,
  Trophy,
  Biohazard,
  Pill,
  AlertTriangle,
  Crosshair,
  Skull,
  HelpCircle,
} from "lucide-react";

export type TileVariant = "red" | "gold" | "cyan";

type Props = {
  icon: string;
  label?: string;
  isCompleted?: boolean;
  onClick?: () => void;
  variant?: TileVariant; // <- viene del data (NO se adivina)
};

function getIcon(icon: string) {
  const common = "h-9 w-9 md:h-10 md:w-10";
  switch (icon) {
    case "hand":
      return <Hand className={common} />;
    case "trophy":
      return <Trophy className={common} />;
    case "biohazard":
      return <Biohazard className={common} />;
    case "pill":
      return <Pill className={common} />;
    case "warning":
      return <AlertTriangle className={common} />;
    case "crosshair":
      return <Crosshair className={common} />;
    case "skull":
      return <Skull className={common} />;
    case "help":
      return <HelpCircle className={common} />;
    default:
      return <AlertTriangle className={common} />;
  }
}

function variantClasses(v: TileVariant) {
  // Más parecido a tu mock: color plano + glow + borde sutil
  if (v === "gold") {
    return {
      bg: "bg-[#6B5516]",
      innerGlow:
        "bg-[radial-gradient(circle_at_50%_45%,rgba(255,220,140,0.45),transparent_62%)]",
      border: "border-[#B89726]/55",
      icon: "text-[#FFF2B8] drop-shadow-[0_0_16px_rgba(255,220,140,0.6)]",
    };
  }
  if (v === "cyan") {
    return {
      bg: "bg-[#0B7C88]",
      innerGlow:
        "bg-[radial-gradient(circle_at_50%_45%,rgba(0,212,255,0.45),transparent_62%)]",
      border: "border-[#11A1AB]/60",
      icon: "text-[#E6FDFF] drop-shadow-[0_0_16px_rgba(0,212,255,0.65)]",
    };
  }
  return {
    bg: "bg-[#6B0F0F]",
    innerGlow:
      "bg-[radial-gradient(circle_at_50%_45%,rgba(255,205,120,0.35),transparent_62%)]",
    border: "border-[#2A0A0A]/55",
    icon: "text-[#FFF2B8] drop-shadow-[0_0_16px_rgba(255,205,120,0.55)]",
  };
}

export function TileButton({
  icon,
  label,
  isCompleted,
  onClick,
  variant = "red",
}: Props) {
  const completed = Boolean(isCompleted);
  const s = variantClasses(variant);

  return (
    <motion.button
      type="button"
      onClick={completed ? undefined : onClick}
      whileHover={{ scale: completed ? 1 : 1.02 }}
      whileTap={{ scale: completed ? 1 : 0.98 }}
      className={[
        "relative w-full rounded-lg overflow-hidden",
        "border shadow-[0_18px_45px_rgba(0,0,0,0.55)]",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-[#11A1AB]/50",
        "h-20 md:h-24", // <- rect uniforme (NO formas raras)
        s.border,
        completed ? "opacity-45 cursor-default" : "cursor-pointer",
      ].join(" ")}
    >
      {/* Base color */}
      <div className={["absolute inset-0", s.bg].join(" ")} />

      {/* Inner glow */}
      <div className={["absolute inset-0", s.innerGlow].join(" ")} />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.10),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(0,0,0,0.35),transparent_60%)]" />

      {/* Icon */}
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <div className={`${s.icon} ${completed ? "opacity-60" : ""}`}>
          {getIcon(icon)}
        </div>
      </div>

      {label && (
        <div className="absolute bottom-2 left-0 right-0 text-center text-xs md:text-sm tracking-widest text-[#FCFFBA]/85">
          {label}
        </div>
      )}

      {completed && <div className="absolute inset-0 bg-black/35" />}
    </motion.button>
  );
}