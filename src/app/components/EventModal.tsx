import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Swords, Sparkles, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useGame, GameEvent } from '../context/GameContext';
import { Progress } from './ui/progress';

interface EventModalProps {
  event: GameEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  const { updateGroupPoints, updatePlayerPoints, addToHistory, completeChallenge } = useGame();
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (!event) return null;

  const handleResolve = (success: boolean) => {
    setResult(success ? 'correct' : 'incorrect');

    if (success) {
      updateGroupPoints(10);
      addToHistory({
        type: 'event',
        description: event.type === 'puzzle' ? 'Acertijo resuelto' : 'Evento completado',
        details: event.title,
      });
      completeChallenge();
    } else {
      updateGroupPoints(-5);
      addToHistory({
        type: 'event',
        description: 'Evento fallido',
        details: event.title,
      });
    }

    setTimeout(() => {
      setResult(null);
      setSelectedOption(null);
      onClose();
    }, 2000);
  };

  const getIcon = () => {
    switch (event.type) {
      case 'puzzle':
        return <HelpCircle className="h-8 w-8 text-[#00ccff]" />;
      case 'combat':
        return <Swords className="h-8 w-8 text-[#ff0033]" />;
      default:
        return <Sparkles className="h-8 w-8 text-[#ffaa00]" />;
    }
  };

  const getBorderColor = () => {
    switch (event.type) {
      case 'puzzle':
        return 'border-[#00ccff]';
      case 'combat':
        return 'border-[#ff0033]';
      default:
        return 'border-[#ffaa00]';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`bg-[#0a0a0a] border-2 ${getBorderColor()} max-w-2xl`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {getIcon()}
              <span className="text-[#00ff88] tracking-wider">{event.title}</span>
            </DialogTitle>
          </DialogHeader>

          {/* Descripción */}
          <div className="bg-[#151515] border border-[#00ff88]/20 rounded-lg p-4">
            <p className="text-[#e0e0e0] leading-relaxed">{event.description}</p>
          </div>

          {/* Enemigo si es combate */}
          {event.enemy && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1a1a] border border-[#ff0033] rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-[#ff0033] tracking-wider">{event.enemy.name}</h3>
                <span className="text-sm text-[#888888]">{event.enemy.type}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#888888]">HP</span>
                  <span className="text-[#ff0033]">
                    {event.enemy.hp} / {event.enemy.maxHp}
                  </span>
                </div>
                <Progress
                  value={(event.enemy.hp / event.enemy.maxHp) * 100}
                  className="h-2 bg-[#0a0a0a]"
                />
              </div>
            </motion.div>
          )}

          {/* Opciones */}
          {event.options && !result && (
            <div className="space-y-3">
              {event.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  variant={selectedOption === index ? 'default' : 'outline'}
                  className={`w-full justify-start h-auto py-3 px-4 ${
                    selectedOption === index
                      ? 'bg-[#00ff88] text-black border-[#00ff88]'
                      : 'border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10'
                  }`}
                >
                  <span className="text-left">{option}</span>
                </Button>
              ))}
            </div>
          )}

          {/* Resultado */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`text-center py-6 rounded-lg border-2 ${
                  result === 'correct'
                    ? 'bg-[#00ff88]/20 border-[#00ff88]'
                    : 'bg-[#ff0033]/20 border-[#ff0033]'
                }`}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: result === 'correct' ? [0, 360] : [0, -10, 10, -10, 0],
                  }}
                  transition={{ duration: 0.5 }}
                  className={`text-4xl ${
                    result === 'correct' ? 'text-[#00ff88]' : 'text-[#ff0033]'
                  }`}
                >
                  {result === 'correct' ? '✓ ÉXITO' : '✗ FALLIDO'}
                </motion.div>
                <p className="text-sm text-[#888888] mt-2">
                  {result === 'correct' ? '+10 pts grupo' : '-5 pts grupo'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botones de acción */}
          {!result && (
            <div className="flex gap-3">
              {event.type === 'puzzle' && (
                <>
                  <Button
                    onClick={() => handleResolve(true)}
                    className="flex-1 bg-[#00ccff] hover:bg-[#00ccff]/80 text-black"
                  >
                    Resolver en Grupo
                  </Button>
                  <Button
                    onClick={() => handleResolve(Math.random() > 0.5)}
                    className="flex-1 bg-[#ffaa00] hover:bg-[#ffaa00]/80 text-black"
                  >
                    Resolver Individual
                  </Button>
                </>
              )}

              {event.type === 'combat' && (
                <Button
                  onClick={() => handleResolve(true)}
                  className="flex-1 bg-[#ff0033] hover:bg-[#ff0033]/80 text-white"
                >
                  Iniciar Combate
                </Button>
              )}

              {event.type !== 'puzzle' && event.type !== 'combat' && (
                <Button
                  onClick={() => handleResolve(true)}
                  disabled={selectedOption === null && event.options !== undefined}
                  className="flex-1 bg-[#00ff88] hover:bg-[#39ff14] text-black disabled:opacity-50"
                >
                  Confirmar
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
