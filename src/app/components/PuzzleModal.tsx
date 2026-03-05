import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Challenge } from '../data/challengesData';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

interface PuzzleModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function PuzzleModal({ challenge, isOpen, onClose, onComplete }: PuzzleModalProps) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const handleSubmit = () => {
    if (!challenge.puzzle) return;
    
    const normalizedAnswer = answer.trim().toUpperCase();
    const normalizedCorrect = challenge.puzzle.answer.toUpperCase();
    
    // Para el acertijo izquierdo, aceptar con o sin tilde
    const isCorrect = normalizedAnswer === normalizedCorrect || 
                      (normalizedCorrect === 'LA INFECCIÓN' && normalizedAnswer === 'LA INFECCION');
    
    setResult(isCorrect ? 'correct' : 'incorrect');
  };

  const handleIgnore = () => {
    onComplete();
    resetAndClose();
  };

  const handleRegister = () => {
    onComplete();
    resetAndClose();
  };

  const resetAndClose = () => {
    setAnswer('');
    setResult(null);
    setShowSolution(false);
    onClose();
  };

  if (!challenge.puzzle) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-[#063850] border-2 border-[#11A1AB] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-[#063850] border-b-2 border-[#11A1AB]/30 p-6 flex items-start justify-between">
                <div className="flex-1 flex items-center gap-3">
                  <HelpCircle className="h-8 w-8 text-[#11A1AB]" />
                  <div>
                    <h2 className="text-3xl font-bold text-[#FCFFBA] tracking-wider">
                      {challenge.title}
                    </h2>
                    <p className="text-sm text-[#11A1AB] uppercase tracking-wide mt-1">
                      Casilla Azul • Acertijo
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetAndClose}
                  className="p-2 hover:bg-[#100605]/50 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-[#FCFFBA]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Event */}
                <div className="bg-[#100605]/40 rounded-xl p-5 border border-[#11A1AB]/20">
                  <p className="text-base text-[#FCFFBA] leading-relaxed whitespace-pre-line">
                    {challenge.event}
                  </p>
                </div>

                {/* Riddle */}
                <div className="bg-gradient-to-br from-[#11A1AB]/10 to-[#063850]/50 rounded-xl p-6 border-2 border-[#11A1AB]/30">
                  <h3 className="text-sm font-bold text-[#11A1AB] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Acertijo
                  </h3>
                  <p className="text-lg text-[#FCFFBA] leading-relaxed whitespace-pre-line italic">
                    {challenge.puzzle.riddle}
                  </p>
                </div>

                {/* Answer Input */}
                {result === null && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-[#FCFFBA] uppercase tracking-wider">
                      Tu respuesta
                    </label>
                    <Input
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      className="h-12 bg-[#100605]/60 border-[#11A1AB]/30 text-[#FCFFBA] placeholder:text-[#FCFFBA]/40"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && answer.trim()) {
                          handleSubmit();
                        }
                      }}
                    />
                  </div>
                )}

                {/* Result */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-5 border-2 ${
                      result === 'correct'
                        ? 'bg-[#11A1AB]/10 border-[#11A1AB]'
                        : 'bg-[#9F1B0B]/10 border-[#9F1B0B]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result === 'correct' ? (
                        <CheckCircle className="h-6 w-6 text-[#11A1AB] shrink-0" />
                      ) : (
                        <XCircle className="h-6 w-6 text-[#9F1B0B] shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className={`text-lg font-bold mb-2 ${
                          result === 'correct' ? 'text-[#11A1AB]' : 'text-[#9F1B0B]'
                        }`}>
                          {result === 'correct' ? '¡CORRECTO!' : 'INCORRECTO'}
                        </h4>
                        <p className="text-sm text-[#FCFFBA] whitespace-pre-line">
                          {result === 'correct' 
                            ? challenge.puzzle.correctEffect 
                            : challenge.puzzle.incorrectEffect}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Show Solution Toggle */}
                <div className="pt-4 border-t border-[#11A1AB]/20">
                  <Button
                    onClick={() => setShowSolution(!showSolution)}
                    variant="ghost"
                    className="text-[#B89726] hover:text-[#FCFFBA] text-sm"
                  >
                    {showSolution ? 'Ocultar' : 'Ver'} solución (solo para Clara)
                  </Button>
                  
                  {showSolution && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 bg-[#B89726]/10 rounded-lg p-4 border border-[#B89726]/30"
                    >
                      <p className="text-sm text-[#B89726] font-semibold">
                        Respuesta: {challenge.puzzle.answer}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-[#063850] border-t-2 border-[#11A1AB]/30 p-6 flex gap-4">
                {result === null ? (
                  <>
                    <Button
                      onClick={handleIgnore}
                      variant="outline"
                      className="flex-1 h-12 border-[#11A1AB]/40 text-[#FCFFBA] hover:bg-[#11A1AB]/10"
                    >
                      Ignorar y continuar
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!answer.trim()}
                      className="flex-1 h-12 bg-[#11A1AB] hover:bg-[#11A1AB]/80 text-[#100605] font-bold disabled:opacity-50"
                    >
                      Confirmar respuesta
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleRegister}
                    className="w-full h-12 bg-[#11A1AB] hover:bg-[#11A1AB]/80 text-[#100605] font-bold"
                  >
                    Registrar en hoja de Clara
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
