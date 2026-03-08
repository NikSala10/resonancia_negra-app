import { motion, AnimatePresence } from "motion/react";

type BoardTileOption = {
  id: number;
  label: string;
  effect: string;
};

interface BoardTileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (effect: string) => void;
  options: BoardTileOption[];
}

export function BoardTileModal({
  isOpen,
  onClose,
  onSelect,
  options,
}: BoardTileModalProps) {
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#050B12]/95 p-6">
              <h2 className="text-4xl font-bold text-[#11A1AB] mb-2">
                Casilla del tablero
              </h2>

              <p className="text-white/60 mb-6 text-2xl">
                Selecciona el efecto que salió en el tablero físico.
              </p>

              <div className="space-y-3">
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => onSelect(option.effect)}
                    className="w-full rounded-xl border border-white/10 bg-[#08131B] px-5 py-4 text-left hover:border-[#11A1AB] hover:bg-[#0B1822] transition"
                  >
                    <div className="text-xl uppercase tracking-[0.2em] text-white/35 mb-1">
                      Opción {option.id}
                    </div>
                    <div className="text-3xl font-semibold text-[#D9E4F2]">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={onClose}
                className="mt-5 w-full h-15 rounded-lg text-4xl border border-white/10 text-white/60 hover:bg-white/5 transition"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}