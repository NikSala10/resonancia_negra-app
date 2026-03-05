import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Home, Trophy, RotateCcw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';

export default function Ending() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { players, groupPoints, resources, resetGame } = useGame();

  const getEndingContent = () => {
    switch (type) {
      case 'feliz':
        return {
          title: 'FINAL FELIZ',
          subtitle: 'LA HUMANIDAD PERSISTE',
          description:
            'Contra todo pronóstico, el equipo logró contener la amenaza de las esporas. La humanidad ha sufrido pérdidas irreparables, pero sobrevive. El Nuevo Gobierno establece protocolos de contención y las zonas seguras comienzan a expandirse. La oscuridad persiste, pero hay esperanza.',
          color: 'text-[#00ff88]',
          borderColor: 'border-[#00ff88]',
          bgGradient: 'from-[#00ff88]/20 via-transparent to-transparent',
        };
      case 'malo':
        return {
          title: 'FINAL MALO',
          subtitle: 'EXTINCIÓN HUMANA',
          description:
            'Las esporas se propagaron más allá de todo control. El equipo cayó, uno por uno, ante la oscuridad imparable. El último registro gubernamental muestra señales vitales descendiendo a cero. La Tierra ya no pertenece a la humanidad. Solo quedan ecos de una civilización que alguna vez dominó el planeta.',
          color: 'text-[#ff0033]',
          borderColor: 'border-[#ff0033]',
          bgGradient: 'from-[#ff0033]/20 via-transparent to-transparent',
        };
      case 'fantastico':
        return {
          title: 'FINAL FANTÁSTICO',
          subtitle: 'ENTIDADES SELLADAS',
          description:
            'Descubrieron la verdad: las esporas eran solo el comienzo. Entidades cósmicas dormidas bajo la superficie se habían despertado. Con tecnología antigua y un sacrificio coordinado, el equipo logró sellarlas nuevamente. La humanidad está a salvo... por ahora. Nadie excepto ustedes conoce cuán cerca estuvo el fin.',
          color: 'text-[#00ccff]',
          borderColor: 'border-[#00ccff]',
          bgGradient: 'from-[#00ccff]/20 via-transparent to-transparent',
        };
      case 'real':
        return {
          title: 'FINAL REAL',
          subtitle: 'REINA DE LOS MUTADOS',
          description:
            'En el epicentro de la infección, encontraron a la Reina. Una entidad colosal de carne retorcida y consciencia distribuida. El combate fue devastador. La victoria requirió el sacrificio de uno del equipo, quien se inmola para destruir el núcleo de la Reina. La amenaza ha sido eliminada, pero el costo es permanente. El héroe caído será recordado.',
          color: 'text-[#ffaa00]',
          borderColor: 'border-[#ffaa00]',
          bgGradient: 'from-[#ffaa00]/20 via-transparent to-transparent',
          requiresSacrifice: true,
        };
      default:
        return {
          title: 'FIN DE LA PARTIDA',
          subtitle: '',
          description: 'La historia ha llegado a su conclusión.',
          color: 'text-[#00ff88]',
          borderColor: 'border-[#00ff88]',
          bgGradient: 'from-[#00ff88]/20 via-transparent to-transparent',
        };
    }
  };

  const ending = getEndingContent();

  const handleRestart = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Fondo con gradiente dinámico */}
      <div className={`absolute inset-0 bg-gradient-to-br ${ending.bgGradient}`} />

      {/* Partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${ending.color.replace('text', 'bg')}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)',
              opacity: 0.3,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className={`relative z-10 max-w-4xl w-full bg-[#0a0a0a] border-2 ${ending.borderColor} rounded-lg p-8 md:p-12 space-y-8`}
      >
        {/* Título */}
        <div className="text-center space-y-4 border-b border-[#00ff88]/20 pb-8">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-4xl md:text-6xl ${ending.color} tracking-widest`}
            style={{
              textShadow: `0 0 30px ${ending.color.includes('00ff88') ? 'rgba(0, 255, 136, 0.5)' : ending.color.includes('ff0033') ? 'rgba(255, 0, 51, 0.5)' : ending.color.includes('00ccff') ? 'rgba(0, 204, 255, 0.5)' : 'rgba(255, 170, 0, 0.5)'}`,
            }}
          >
            {ending.title}
          </motion.h1>
          {ending.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm tracking-widest text-[#888888] uppercase"
            >
              {ending.subtitle}
            </motion.p>
          )}
        </div>

        {/* Descripción narrativa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-[#151515] border border-[#00ff88]/20 rounded-lg p-6"
        >
          <p className="text-[#e0e0e0] leading-relaxed text-lg">{ending.description}</p>
        </motion.div>

        {/* Estadísticas finales */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-4 text-center">
            <p className="text-xs text-[#888888] mb-1">Puntos Grupales</p>
            <p className="text-2xl text-[#00ff88]">{groupPoints}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-4 text-center">
            <p className="text-xs text-[#888888] mb-1">Supervivientes</p>
            <p className="text-2xl text-[#00ccff]">
              {players.filter((p) => p.hp > 0).length}/5
            </p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-4 text-center">
            <p className="text-xs text-[#888888] mb-1">Recursos Restantes</p>
            <p className="text-2xl text-[#ffaa00]">
              {Object.values(resources).reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-4 text-center">
            <p className="text-xs text-[#888888] mb-1">HP Promedio</p>
            <p className="text-2xl text-[#ff0033]">
              {Math.round(players.reduce((acc, p) => acc + p.hp, 0) / players.length)}
            </p>
          </div>
        </motion.div>

        {/* Sacrificio especial para final real */}
        {ending.requiresSacrifice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
            className="bg-[#ff0033]/10 border-2 border-[#ff0033] rounded-lg p-6 text-center"
          >
            <p className="text-[#ff0033] text-xl mb-2">🕯️ EN MEMORIA</p>
            <p className="text-sm text-[#888888]">
              Un miembro del equipo dio su vida para asegurar la victoria.
              <br />
              Su sacrificio nunca será olvidado.
            </p>
          </motion.div>
        )}

        {/* Botones */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col md:flex-row gap-4 pt-6"
        >
          <Button
            onClick={() => navigate('/podium')}
            className="flex-1 h-14 bg-[#ffaa00] hover:bg-[#ffaa00]/80 text-black"
          >
            <Trophy className="mr-2 h-5 w-5" />
            VER PODIO
          </Button>
          <Button
            onClick={handleRestart}
            className="flex-1 h-14 bg-[#00ff88] hover:bg-[#39ff14] text-black"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            NUEVA PARTIDA
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex-1 h-14 border-[#00ccff] text-[#00ccff]"
          >
            <Home className="mr-2 h-5 w-5" />
            MENÚ PRINCIPAL
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center text-xs text-[#888888] pt-6 border-t border-[#00ff88]/20"
        >
          <p className="tracking-widest">REGISTRO COMPLETO - ARCHIVO CERRADO</p>
          <p className="text-[#ff0033] mt-1">SISTEMA GUBERNAMENTAL DE NUEVA ERA</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
