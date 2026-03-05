import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Play } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
   
  <div
    className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
    style={{
      backgroundImage: "url('../../../public/assets/Inicio.png')", // pon tu imagen en public
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >

    {/* Contenido principal */}
    <div className="relative z-10 max-w-2xl w-full text-center">


      {/* Botón sin icono */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="
            mt-32
            sm:mt-36
            md:mt-40
            flex
            justify-center
          "
      >
        <Button
  onClick={() => navigate('/context')}
  className="
    h-18
    w-96
    max-w-md
    bg-[#E4E8A6]
    text-black
    text-3xl
    font-semibold
    rounded-2.75
    border
    border-white
   transition-all
      duration-300
      hover:scale-105
      hover:shadow-[0_0_30px_rgba(255,255,150,0.9)]
      hover:bg-[#F0F5B8]
      active:scale-95
  "
>
  Iniciar juego
</Button>
      </motion.div>
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
