import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';
import { Challenge } from '../data/challengesData';
import { Button } from './ui/button';
import { useState } from 'react';

interface ChallengeModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function ChallengeModal({ challenge, isOpen, onClose, onComplete }: ChallengeModalProps) {
  const [selectedSubOption, setSelectedSubOption] = useState<number | null>(null);

  const handleComplete = () => {
    onComplete();
    setSelectedSubOption(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-[#063850] border-2 border-[#B89726] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-[#063850] border-b-2 border-[#B89726]/30 p-6 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-[#FCFFBA] tracking-wider mb-2">
                    {challenge.title}
                  </h2>
                  {challenge.zone && (
                    <p className="text-sm text-[#B89726] uppercase tracking-wide">
                      Zona: {challenge.zone}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#100605]/50 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-[#FCFFBA]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Event */}
                <div className="bg-[#100605]/40 rounded-xl p-5 border border-[#11A1AB]/20">
                  <h3 className="text-sm font-bold text-[#11A1AB] uppercase tracking-wider mb-3">
                    Evento
                  </h3>
                  <p className="text-base text-[#FCFFBA] leading-relaxed whitespace-pre-line">
                    {challenge.event}
                  </p>
                </div>

                {/* Rule (if exists) */}
                {challenge.rule && (
                  <div className="bg-[#9F1B0B]/10 rounded-xl p-5 border border-[#9F1B0B]/30">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-[#9F1B0B] mt-0.5 shrink-0" />
                      <div>
                        <h3 className="text-sm font-bold text-[#9F1B0B] uppercase tracking-wider mb-2">
                          Regla
                        </h3>
                        <p className="text-sm text-[#FCFFBA]">{challenge.rule}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Options */}
                {challenge.options && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#FCFFBA] uppercase tracking-wider">
                      Decisiones
                    </h3>
                    {challenge.options.map((option, index) => (
                      <div key={index} className="space-y-3">
                        <div className="bg-[#100605]/60 rounded-xl p-5 border border-[#B89726]/20">
                          <h4 className="text-base font-bold text-[#B89726] mb-2">
                            {option.label}
                          </h4>
                          <p className="text-sm text-[#FCFFBA]/80 whitespace-pre-line">
                            {option.effects}
                          </p>

                          {/* Sub-decision button */}
                          {option.subDecision && (
                            <Button
                              onClick={() => setSelectedSubOption(selectedSubOption === index ? null : index)}
                              className="mt-3 bg-[#11A1AB]/20 hover:bg-[#11A1AB]/30 text-[#11A1AB] border border-[#11A1AB]/40"
                            >
                              {selectedSubOption === index ? 'Ocultar subdecisión' : 'Ver subdecisión'}
                            </Button>
                          )}
                        </div>

                        {/* Sub-decision */}
                        {option.subDecision && selectedSubOption === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-6 space-y-3 pl-4 border-l-2 border-[#B89726]/30"
                          >
                            <p className="text-sm text-[#FCFFBA] font-semibold">
                              {option.subDecision.description}
                            </p>
                            {option.subDecision.options.map((subOpt, subIdx) => (
                              <div
                                key={subIdx}
                                className="bg-[#100605]/40 rounded-lg p-4 border border-[#11A1AB]/20"
                              >
                                <h5 className="text-sm font-bold text-[#11A1AB] mb-1">
                                  {subOpt.label}
                                </h5>
                                <p className="text-xs text-[#FCFFBA]/70 whitespace-pre-line">
                                  {subOpt.effects}
                                </p>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-[#063850] border-t-2 border-[#B89726]/30 p-6 flex gap-4">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 h-12 border-[#11A1AB]/40 text-[#FCFFBA] hover:bg-[#11A1AB]/10"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 h-12 bg-[#11A1AB] hover:bg-[#11A1AB]/80 text-[#100605] font-bold"
                >
                  Registrar en hoja de Clara
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
