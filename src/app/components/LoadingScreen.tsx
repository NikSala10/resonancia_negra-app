import { motion } from 'motion/react';

interface LoadingScreenProps {
  text?: string;
}

export function LoadingScreen({ text = 'CARGANDO...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Logo animado */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="text-4xl text-[#00ff88] tracking-widest"
          style={{
            fontFamily: 'var(--font-display)',
            textShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
          }}
        >
          RESONANCIA NEGRA
        </motion.div>

        {/* Barra de progreso */}
        <div className="w-64 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#00ff88]"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Texto */}
        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="text-sm text-[#888888] tracking-widest"
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}
