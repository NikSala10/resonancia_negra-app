import { useState } from 'react';
import { motion } from 'motion/react';
import { Dices } from 'lucide-react';
import { Button } from './ui/button';
import { useGame } from '../context/GameContext';

export function DiceRoller() {
  const { rollDice, diceHistory } = useGame();
  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<{ type: 'D4' | 'D20'; value: number } | null>(null);

  const handleRoll = (type: 'D4' | 'D20') => {
    setIsRolling(true);
    setCurrentResult(null);

    // Simular animación de dado rodando
    const interval = setInterval(() => {
      const max = type === 'D4' ? 4 : 20;
      setCurrentResult({ type, value: Math.floor(Math.random() * max) + 1 });
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      const result = rollDice(type);
      setCurrentResult({ type, value: result });
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="bg-[#151515] border border-[#00ff88]/30 rounded-lg p-6 space-y-4">
      <h3 className="text-[#00ccff] tracking-wider flex items-center gap-2">
        <Dices className="h-5 w-5" />
        DADOS
      </h3>

      {/* Botones de dados */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => handleRoll('D4')}
          disabled={isRolling}
          className="h-16 bg-[#00ccff] hover:bg-[#00ccff]/80 text-black disabled:opacity-50"
        >
          <span className="text-2xl">D4</span>
        </Button>
        <Button
          onClick={() => handleRoll('D20')}
          disabled={isRolling}
          className="h-16 bg-[#ffaa00] hover:bg-[#ffaa00]/80 text-black disabled:opacity-50"
        >
          <span className="text-2xl">D20</span>
        </Button>
      </div>

      {/* Resultado actual */}
      {currentResult && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-center py-6 bg-[#1a1a1a] rounded-lg border border-[#00ff88]/20"
        >
          <motion.div
            animate={
              isRolling
                ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                  }
                : {
                    scale: [1.2, 1],
                  }
            }
            transition={{
              duration: isRolling ? 0.3 : 0.5,
              repeat: isRolling ? Infinity : 0,
            }}
            className={`text-6xl ${
              currentResult.type === 'D4' ? 'text-[#00ccff]' : 'text-[#ffaa00]'
            }`}
          >
            {currentResult.value}
          </motion.div>
          <p className="text-sm text-[#888888] mt-2">{currentResult.type}</p>
        </motion.div>
      )}

      {/* Historial */}
      {diceHistory.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-[#888888] tracking-wider">HISTORIAL</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {diceHistory.slice(-5).reverse().map((roll, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center text-xs bg-[#1a1a1a] rounded px-3 py-2"
              >
                <span className={roll.type === 'D4' ? 'text-[#00ccff]' : 'text-[#ffaa00]'}>
                  {roll.type}
                </span>
                <span className="text-[#00ff88]">{roll.result}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
