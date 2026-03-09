import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type BoardTileOption = {
  id: number;
  label: string;
  effect: string;
};

type ResourceKey =
  | "plasmaShield"
  | "sporeDetector"
  | "medicalKit"
  | "ammunition";

type AvailableResource = {
  key: ResourceKey;
  label: string;
  amount: number;
};

interface BoardTileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (effect: string, resourceKey?: ResourceKey) => void;
  options: BoardTileOption[];
  availableResources: AvailableResource[];
}

export function BoardTileModal({
  isOpen,
  onClose,
  onSelect,
  options,
  availableResources,
}: BoardTileModalProps) {
  const [pendingEffect, setPendingEffect] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPendingEffect(null);
    }
  }, [isOpen]);

  const handleOptionClick = (effect: string) => {
    if (effect === "loseResourceAnd5Group") {
      setPendingEffect(effect);
      return;
    }

    onSelect(effect);
  };

  const handleBackToOptions = () => {
    setPendingEffect(null);
  };

  const isChoosingResource = pendingEffect === "loseResourceAnd5Group";

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
              {!isChoosingResource ? (
                <>
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
                        onClick={() => handleOptionClick(option.effect)}
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
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-[#FF8EA2] mb-2">
                    Elegir recurso a perder
                  </h2>

                  <p className="text-white/60 mb-6 text-2xl">
                    Selecciona cuál recurso desean perder. También se descontarán
                    5 puntos grupales.
                  </p>

                  {availableResources.length > 0 ? (
                    <div className="space-y-3">
                      {availableResources.map((resource) => (
                        <button
                          key={resource.key}
                          onClick={() => onSelect("loseResourceAnd5Group", resource.key)}
                          className="w-full rounded-xl border border-white/10 bg-[#08131B] px-5 py-4 text-left hover:border-[#FF8EA2] hover:bg-[#0B1822] transition"
                        >
                          <div className="text-xl uppercase tracking-[0.2em] text-white/35 mb-1">
                            Recurso disponible
                          </div>
                          <div className="text-3xl font-semibold text-[#D9E4F2]">
                            {resource.label}
                          </div>
                          <div className="mt-2 text-lg text-[#FF8EA2]">
                            Cantidad actual: {resource.amount}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#9F1B0B]/30 bg-[#120A10]/90 px-5 py-4 text-[#FFB4C1] text-2xl">
                      No hay recursos disponibles para perder.
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={handleBackToOptions}
                      className="h-15 rounded-lg text-3xl border border-white/10 text-white/70 hover:bg-white/5 transition"
                    >
                      Volver
                    </button>

                    <button
                      onClick={onClose}
                      className="h-15 rounded-lg text-3xl border border-white/10 text-white/60 hover:bg-white/5 transition"
                    >
                      Cerrar
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}