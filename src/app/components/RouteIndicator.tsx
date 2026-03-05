import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';

const TILES = [
  { id: 1, color: 'yellow' as const, label: 'Inicio' },
  { id: 2, color: 'blue' as const, label: 'Acertijo' },
  { id: 3, color: 'yellow' as const, label: 'Normal' },
  { id: 4, color: 'red' as const, label: 'Combate' },
  { id: 5, color: 'mustard' as const, label: 'Combate' },
  { id: 6, color: 'blue' as const, label: 'Acertijo' },
  { id: 7, color: 'special' as const, label: 'Especial' },
  { id: 8, color: 'yellow' as const, label: 'Normal' },
];

export function RouteIndicator() {
  const { currentPath, currentPosition } = useGame();

  const getTileColor = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-[#ffaa00]';
      case 'blue':
        return 'bg-[#00ccff]';
      case 'red':
        return 'bg-[#ff0033]';
      case 'mustard':
        return 'bg-[#d4a017]';
      case 'special':
        return 'bg-gradient-to-br from-[#ff0033] to-[#00ff88]';
      default:
        return 'bg-[#888888]';
    }
  };

  return (
    <div className="bg-[#151515] border border-[#00ff88]/30 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[#00ccff] tracking-wider">RUTA</h3>
        {currentPath && (
          <span className="text-sm text-[#00ff88]">
            Camino {currentPath === 'right' ? 'Derecho' : 'Izquierdo'}
          </span>
        )}
      </div>

      {/* Tablero pentagonal simplificado */}
      <div className="relative">
        {/* Visualización lineal de casillas */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {TILES.map((tile, index) => (
            <motion.div
              key={tile.id}
              className="relative aspect-square"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={`w-full h-full ${getTileColor(tile.color)} rounded relative overflow-hidden`}
              >
                {/* Iluminación si es la casilla actual */}
                {currentPosition === index && (
                  <motion.div
                    className="absolute inset-0 border-2 border-white"
                    animate={{
                      boxShadow: [
                        '0 0 5px rgba(255, 255, 255, 0.5)',
                        '0 0 20px rgba(255, 255, 255, 0.8)',
                        '0 0 5px rgba(255, 255, 255, 0.5)',
                      ],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}

                {/* Número de casilla */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs md:text-sm text-black/80 font-bold">
                    {tile.id}
                  </span>
                </div>

                {/* Ícono especial */}
                {tile.color === 'special' && (
                  <motion.div
                    className="absolute top-0.5 right-0.5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </div>

              {/* Label */}
              <p className="text-[8px] md:text-xs text-center text-[#888888] mt-1 truncate">
                {tile.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ffaa00] rounded" />
            <span className="text-[#888888]">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00ccff] rounded" />
            <span className="text-[#888888]">Acertijo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff0033] rounded" />
            <span className="text-[#888888]">Combate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#d4a017] rounded" />
            <span className="text-[#888888]">Combate+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-br from-[#ff0033] to-[#00ff88] rounded" />
            <span className="text-[#888888]">Especial</span>
          </div>
        </div>
      </div>
    </div>
  );
}
