import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { ArrowLeft, ArrowRight, Dices } from 'lucide-react';

export default function PathDecision() {
  const navigate = useNavigate();
  const { setCurrentPath } = useGame();

  const handlePathSelection = (path: 'left' | 'right') => {
    setCurrentPath(path);
    localStorage.setItem("currentPath", path);
    navigate('/game');
  };

  return (
    <div
  className="min-h-screen flex flex-col items-center p-8 bg-cover bg-center relative"
  style={{
    backgroundImage: "url('/assets/Iniciar game.png')"
  }}
>
  <div className="w-full flex flex-col items-center mt-130 relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
  
        <div />
        <p className="text-4xl text-[#FFFFFF] max-w-2xl mx-auto">
          ¿Por cuál lado inicia tu aventura?
        </p>
      </motion.div>

     <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="
    w-full
    max-w-lg
    bg-[#292828]/60
    border border-[#B89726]/40
    rounded-xl
    px-8
    py-5
    mb-12
    backdrop-blur-md
  "
>
  <div className="flex flex-col md:flex-row items-center justify-between gap-6" >

    {/* Lado izquierdo - Título */}
    <div className="flex items-center gap-3">
      <Dices className="h-6 w-6 text-[#FCFFBA]" />
      <h2 className="text-lg font-bold text-[#FCFFBA] uppercase tracking-wider">
        Regla del D20
      </h2>
    </div>

    {/* Lado derecho - Reglas */}
    <div className="flex items-center gap-8 text-[#FCFFBA]">

      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-[#B89726]">1–10</span>
        <span className="text-sm opacity-80">→ Derecha</span>
      </div>

      <div className="h-6 w-px bg-[#B89726]/40" />

      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-[#B89726]">11–20</span>
        <span className="text-sm opacity-80">→ Izquierda</span>
      </div>

    </div>
  </div>
</motion.div>

      {/* Botones de selección */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-lg" >
        {/* Camino Izquierdo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
         
        >
          <Button
  onClick={() => handlePathSelection('left')}
  className="
     w-full h-16
    bg-[#E4E8A6]
    text-black
    text-3xl
    font-semibold
    rounded-lg
    border border-white
    transition-all duration-300
    hover:scale-105
    hover:shadow-[0_0_40px_rgba(255,255,200,0.9)]
    active:scale-95
  "
>
  Izquierda
</Button>
        </motion.div>

        {/* Camino Derecho */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
  onClick={() => handlePathSelection('right')}
  className="
    w-full h-16
    bg-black
    text-[#00D4FF]
    text-3xl
    font-semibold
    rounded-lg
    border-2 border-[#00D4FF]
    transition-all duration-300
    hover:scale-105
    hover:shadow-[0_0_40px_rgba(0,212,255,0.9)]
    hover:bg-[#001018]
    active:scale-95
  "
>
  Derecha
</Button>
        </motion.div>
      </div>

      {/* Nota informativa */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-lg text-[#FCFFBA]/50 text-center max-w-lg italic"
      >
        Esta decisión determinará los retos y acertijos que enfrentará el equipo durante la partida.
      </motion.p>
        </div>
        {/* Partículas decorativas */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#F5DC3F] rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
</div>
    
  );
}
