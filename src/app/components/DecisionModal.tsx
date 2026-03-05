import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useGame } from '../context/GameContext';

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  options: string[];
}

export function DecisionModal({ isOpen, onClose, title, description, options }: DecisionModalProps) {
  const { updateGroupPoints, players, updatePlayerHP, addToHistory } = useGame();
  const [timeLeft, setTimeLeft] = useState(90);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasDecided, setHasDecided] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(90);
      setSelectedOption(null);
      setHasDecided(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !hasDecided) {
          // Tiempo agotado - penalización
          players.forEach((player) => updatePlayerHP(player.id, player.hp - 8));
          updateGroupPoints(-10);
          addToHistory({
            type: 'decision',
            description: 'Decisión no tomada a tiempo',
            details: 'Penalización: -8 HP por jugador, -10 pts grupo',
          });
          setTimeout(() => onClose(), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, hasDecided]);

  const handleDecision = () => {
    if (selectedOption !== null) {
      setHasDecided(true);
      addToHistory({
        type: 'decision',
        description: title,
        details: `Opción seleccionada: ${options[selectedOption]}`,
      });

      // Simular consecuencias aleatorias
      const isGoodChoice = Math.random() > 0.4;
      if (isGoodChoice) {
        updateGroupPoints(15);
      } else {
        updateGroupPoints(-5);
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        updatePlayerHP(randomPlayer.id, randomPlayer.hp - 5);
      }

      setTimeout(() => onClose(), 2000);
    }
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-[#ff0033]';
    if (timeLeft <= 30) return 'text-[#ffaa00]';
    return 'text-[#00ff88]';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-2 border-[#ffaa00] max-w-2xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-[#ffaa00] tracking-wider">{title}</span>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#00ccff]" />
                <motion.span
                  className={`text-2xl ${getTimerColor()}`}
                  animate={timeLeft <= 10 ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {timeLeft}s
                </motion.span>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Advertencia de tiempo */}
          {timeLeft <= 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#ff0033]/20 border border-[#ff0033] rounded-lg p-3 flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <AlertTriangle className="h-5 w-5 text-[#ff0033]" />
              </motion.div>
              <p className="text-sm text-[#ff0033]">
                ¡TIEMPO CRÍTICO! Penalización inminente: -8 HP por jugador, -10 pts grupo
              </p>
            </motion.div>
          )}

          {/* Descripción */}
          <div className="bg-[#151515] border border-[#00ff88]/20 rounded-lg p-4">
            <p className="text-[#e0e0e0] leading-relaxed">{description}</p>
          </div>

          {/* Opciones */}
          {!hasDecided && (
            <div className="space-y-3">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  variant={selectedOption === index ? 'default' : 'outline'}
                  className={`w-full justify-start h-auto py-4 px-4 ${
                    selectedOption === index
                      ? 'bg-[#ffaa00] text-black border-[#ffaa00]'
                      : 'border-[#ffaa00]/30 text-[#ffaa00] hover:bg-[#ffaa00]/10'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === index
                          ? 'border-black bg-black'
                          : 'border-[#ffaa00]'
                      }`}
                    >
                      {selectedOption === index && (
                        <div className="w-2 h-2 rounded-full bg-[#ffaa00]" />
                      )}
                    </div>
                    <span className="text-left flex-1">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {/* Resultado */}
          {hasDecided && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 bg-[#00ff88]/20 border-2 border-[#00ff88] rounded-lg"
            >
              <p className="text-2xl text-[#00ff88]">✓ DECISIÓN REGISTRADA</p>
              <p className="text-sm text-[#888888] mt-2">Procesando consecuencias...</p>
            </motion.div>
          )}

          {/* Botón confirmar */}
          {!hasDecided && (
            <Button
              onClick={handleDecision}
              disabled={selectedOption === null}
              className="w-full h-14 bg-[#00ff88] hover:bg-[#39ff14] text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CONFIRMAR DECISIÓN
            </Button>
          )}

          {/* Barra de progreso de tiempo */}
          <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                timeLeft <= 10 ? 'bg-[#ff0033]' : timeLeft <= 30 ? 'bg-[#ffaa00]' : 'bg-[#00ff88]'
              }`}
              animate={{ width: `${(timeLeft / 90) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
