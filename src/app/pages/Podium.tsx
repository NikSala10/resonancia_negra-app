import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Trophy, Medal, Award, Home, RotateCcw } from 'lucide-react';
import { useMemo } from 'react';

const endings = {
  real: {
    title: 'FINAL REAL',
    color: '#B89726',
    description: 'El equipo descubrió la verdad oculta tras Las Sombras. Con valentía y sacrificio, desenmascararon la conspiración del Nuevo Gobierno. La humanidad tiene ahora una oportunidad real de supervivencia y redención.',
  },
  fantastico: {
    title: 'FINAL FANTÁSTICO',
    color: '#11A1AB',
    description: 'Contra todas las probabilidades, el equipo logró un resultado excepcional. Su cooperación y determinación salvaron incontables vidas. Son leyendas en un mundo devastado.',
  },
  feliz: {
    title: 'FINAL FELIZ',
    color: '#11A1AB',
    description: 'El equipo sobrevivió y completó su misión. Aunque hubo pérdidas, su trabajo cooperativo trajo esperanza a los sobrevivientes. El camino por delante es largo, pero prometedor.',
  },
  malo: {
    title: 'FINAL MALO',
    color: '#9F1B0B',
    description: 'El equipo fracasó en su misión. Las pérdidas fueron devastadoras y la verdad permanece oculta. El Nuevo Gobierno mantiene su control. La oscuridad prevalece.',
  },
};

export default function Podium() {
  const navigate = useNavigate();
  const { players, groupPoints, challengesCompleted, casualties, resetGame } = useGame();

  // Determinar el final basado en las condiciones
  const ending = useMemo(() => {
    const totalChallenges = 6;
    const allCompleted = challengesCompleted >= totalChallenges;
    const noCasualties = casualties === 0;
    const allAlive = players.every(p => p.hp > 0);
    const goodHP = players.filter(p => p.hp >= 15).length >= 4;
    
    if (allCompleted && noCasualties && allAlive && goodHP) {
      return endings.real;
    } else if (challengesCompleted >= 5 && groupPoints >= 80) {
      return endings.fantastico;
    } else if (groupPoints < 30 || casualties > 2) {
      return endings.malo;
    } else {
      return endings.feliz;
    }
  }, [players, groupPoints, challengesCompleted, casualties]);

  // Top 3 jugadores por puntos
  const topPlayers = useMemo(() => {
    return [...players]
      .sort((a, b) => b.points - a.points)
      .slice(0, 3);
  }, [players]);

  const getBadge = (points: number) => {
    if (points >= 80) return { label: 'Mención de Honor Suprema', color: '#B89726' };
    if (points >= 65) return { label: 'Mención de Honor', color: '#11A1AB' };
    if (points >= 50) return { label: 'Reconocimiento al Mérito', color: '#11A1AB' };
    return null;
  };

 const handleNewGame = () => {
  // 1) Reset del context
  resetGame();

  // 2) Reset de retos (confirmados y pendientes)
  localStorage.removeItem("completedChallenges");
  localStorage.removeItem("pendingChallenges");

  // 3) Nueva sesión (para separar partidas)
  localStorage.setItem("gameSessionId", String(Date.now()));

  // (opcional) si quieres obligar a elegir camino otra vez:
  // localStorage.removeItem("currentPath");

  // 4) Volver al inicio
  navigate("/path-decision");
};

  return (
    <div className="min-h-screen bg-[#100605] p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-[#FCFFBA] tracking-widest mb-2">
          RESULTADO FINAL
        </h1>
        <div className="h-1 bg-gradient-to-r from-transparent via-[#B89726] to-transparent" />
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#063850]/50 border-2 border-[#11A1AB]/30 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-[#FCFFBA] mb-6 text-center">
            ESTADÍSTICAS FINALES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#B89726] mb-2">
                {groupPoints}
              </div>
              <div className="text-sm text-[#FCFFBA]/70 uppercase tracking-wider">
                Puntos Grupales
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#11A1AB] mb-2">
                {challengesCompleted}/6
              </div>
              <div className="text-sm text-[#FCFFBA]/70 uppercase tracking-wider">
                Retos Completados
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#9F1B0B] mb-2">
                {casualties}
              </div>
              <div className="text-sm text-[#FCFFBA]/70 uppercase tracking-wider">
                Bajas
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#11A1AB] mb-2">
                {players.filter(p => p.hp > 0).length}/5
              </div>
              <div className="text-sm text-[#FCFFBA]/70 uppercase tracking-wider">
                Sobrevivientes
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final alcanzado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#063850]/70 border-2 rounded-2xl p-8"
          style={{ borderColor: ending.color }}
        >
          <h2 
            className="text-4xl font-bold mb-6 text-center tracking-widest"
            style={{ color: ending.color }}
          >
            {ending.title}
          </h2>
          <p className="text-lg text-[#FCFFBA] text-center leading-relaxed max-w-3xl mx-auto">
            {ending.description}
          </p>
        </motion.div>

        {/* Podio - Top 3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-[#063850]/50 border-2 border-[#B89726]/30 rounded-2xl p-8"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Trophy className="h-8 w-8 text-[#B89726]" />
            <h2 className="text-3xl font-bold text-[#FCFFBA] tracking-wider">
              PODIO
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topPlayers.map((player, index) => {
              const badge = getBadge(player.points);
              const positions = [
                { icon: Trophy, color: '#B89726', label: '1º LUGAR' },
                { icon: Medal, color: '#11A1AB', label: '2º LUGAR' },
                { icon: Award, color: '#FCFFBA', label: '3º LUGAR' },
              ];
              const position = positions[index];
              const Icon = position.icon;

              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`bg-[#100605]/60 border-2 rounded-xl p-6 ${
                    index === 0 
                      ? 'border-[#B89726] shadow-lg shadow-[#B89726]/20' 
                      : 'border-[#11A1AB]/30'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <Icon className="h-12 w-12 mb-3" style={{ color: position.color }} />
                    <div 
                      className="text-sm font-bold mb-2 uppercase tracking-wider"
                      style={{ color: position.color }}
                    >
                      {position.label}
                    </div>
                    <h3 className="text-2xl font-bold text-[#FCFFBA] mb-1">
                      {player.name}
                    </h3>
                    <p className="text-sm text-[#B89726] mb-4">{player.role}</p>
                    <div className="text-4xl font-bold text-[#11A1AB] mb-4">
                      {player.points}
                    </div>
                    <div className="text-xs text-[#FCFFBA]/60 uppercase">puntos</div>
                    
                    {badge && (
                      <div 
                        className="mt-4 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider"
                        style={{ 
                          backgroundColor: `${badge.color}20`,
                          color: badge.color,
                          border: `1px solid ${badge.color}40`
                        }}
                      >
                        {badge.label}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Acciones */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="h-14 px-8 border-[#11A1AB]/40 text-[#FCFFBA] hover:bg-[#11A1AB]/10 text-lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Volver al inicio
          </Button>
          <Button
            onClick={handleNewGame}
            className="h-14 px-8 bg-[#11A1AB] hover:bg-[#11A1AB]/80 text-[#100605] font-bold text-lg"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Nueva partida
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
