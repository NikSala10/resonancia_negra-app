import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const slides = [
  {
    title: '',
    content: [
      '“Las Sombras llegaron sin advertencia, criaturas humanoides negras y viscosas que arrasaron con todo a su paso, dejando tras de sí esporas tóxicas capaces de convertir cualquier bestia herida o muerta en un Mutado a su servicio.”',
    ],
  },
  {
    title: '',
    content: [
      '“Ante el caos, los gobiernos del mundo se unificaron creando El Nuevo Gobierno, que clasificó a cada ciudadano en grupos del 1 al 8 según su utilidad. Los más capaces, al frente. Los inútiles, al último y más miserable de los grupos, el 8.”',
    ],
  },
  {
    title: '',
    content: [
      'En medio de este mundo roto, Keira, Clara, Ivan, Leni y Adrian deciden ir más allá del sistema. Clara ha descifrado pistas en el laboratorio que apuntan al origen de todo. Juntos emprenden una expedición hacia la verdad, una que no se sabe si causará la salvación o destrucción del mundo que conocemos.',
    ],
  },
];

export default function Context() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/path-decision');
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
 <div
  className="min-h-screen bg-cover bg-center flex items-center justify-center px-6 sm:px-8 md:px-12 relative"
  style={{ backgroundImage: "url('../../../public/assets/Continuidad.png')" }}
>
    {/* fila superior (solo para respirar, no mueve el centro) */}
    <div className="h-10 md:h-14" />

    {/* CENTRO REAL de pantalla */}
    <div className="flex items-center justify-center">
      <div className="w-full max-w-xl text-center">

        <AnimatePresence mode="wait">
          <motion.p
            key={currentSlide}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            className="w-full text-center text-white text-xl md:text-3xl leading-snug"
          >
            {slides[currentSlide].content[0]}
          </motion.p>
        </AnimatePresence>

        {/* Línea decorativa BLANCA */}
        <div className="w-72 md:w-96 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent mt-10 mx-auto" />

        {/* Indicadores */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-yellow-400' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>

    {/* NAVEGACIÓN abajo pero NO pegada */}
    <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2">
  <div className="flex items-center justify-center gap-6 sm:gap-10">

    <Button
      onClick={handlePrev}
      disabled={currentSlide === 0}
      variant="outline"
      className="h-14 md:h-16 px-8 md:px-10 text-lg md:text-2xl text-white border-white/40 hover:bg-white/10 disabled:opacity-30"
    >
      Anterior
    </Button>

    <div className="text-white text-lg md:text-2xl font-semibold min-w-[72px] text-center">
      {currentSlide + 1} / {slides.length}
    </div>

    <Button
      onClick={handleNext}
      className="h-14 md:h-16 px-8 md:px-10 text-lg md:text-2xl font-bold bg-[#00CCFF] hover:bg-[#00D4FF]/85 text-black shadow-[0_0_25px_rgba(0,212,255,0.45)] transition-all active:scale-95"
    >
      {currentSlide === slides.length - 1 ? 'Comenzar' : 'Siguiente'}
    </Button>

  </div>
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

