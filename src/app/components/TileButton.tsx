import { motion } from "motion/react";

type Props = {
  label?: string;
  isCompleted?: boolean;
  onClick?: () => void;
  tileBg: string; // <- ruta del svg
};

export function TileButton({
  label,
  isCompleted,
  onClick,
  tileBg,
}: Props) {
  const completed = Boolean(isCompleted);

  return (
    <motion.button
      type="button"
      onClick={completed ? undefined : onClick}
      whileHover={{ scale: completed ? 1 : 1.02 }}
      whileTap={{ scale: completed ? 1 : 0.98 }}
      className={[
        "relative w-full rounded-lg overflow-hidden",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-[#11A1AB]/50",
        "aspect-square",
        completed ? "opacity-45 cursor-default" : "cursor-pointer",
      ].join(" ")}
    >
      {/* SVG exacto como fondo */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('${tileBg}')`,
        }}
      />

      {/* overlay completado */}
      {completed && <div className="absolute inset-0 bg-black/35" />}

      {/* label opcional */}
      {label && (
        <div className="absolute bottom-2 left-0 right-0 text-center text-sm md:text-base tracking-widest text-[#FCFFBA]">
          {label}
        </div>
      )}
    </motion.button>
  );
}