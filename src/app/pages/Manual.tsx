import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Dices, Target, Shield, AlertTriangle, Trophy } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Manual() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-[#151515] border-2 border-[#00ff88] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl text-[#00ff88] tracking-wider">
              MANUAL DIGITAL
            </h1>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
              className="border-[#00ff88] text-[#00ff88]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <p className="text-xs text-[#888888] tracking-widest">
            SISTEMA DE INFORMACIÓN - RESONANCIA NEGRA
          </p>
        </div>

        {/* Introducción */}
        <div className="bg-[#151515] border border-[#00ff88]/30 rounded-lg p-6 space-y-4">
          <h2 className="text-xl text-[#00ccff] tracking-wider">CONTEXTO</h2>
          <p className="text-[#e0e0e0] leading-relaxed">
            Resonancia Negra es un juego cooperativo narrativo post-apocalíptico. La humanidad
            está al borde de la extinción debido a una plaga de esporas alienígenas. Un Nuevo
            Gobierno unificado envía escuadrones de élite para investigar y contener la amenaza.
            Cada decisión cuenta. Cada sacrificio importa.
          </p>
        </div>

        {/* Personajes */}
        <div className="bg-[#151515] border border-[#00ff88]/30 rounded-lg p-6 space-y-4">
          <h2 className="text-xl text-[#00ccff] tracking-wider flex items-center gap-2">
            <Users className="h-5 w-5" />
            PERSONAJES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Keira',
                role: 'Luchadora',
                description: 'Especialista en combate. Inicia con 5 municiones.',
                color: 'text-[#ff0033]',
              },
              {
                name: 'Adrian',
                role: 'Médico',
                description: 'Experto en primeros auxilios. Puede restaurar HP.',
                color: 'text-[#00ff88]',
              },
              {
                name: 'Ivan',
                role: 'Ingeniero',
                description: 'Maestro en tecnología. Puede reparar y optimizar recursos.',
                color: 'text-[#ffaa00]',
              },
              {
                name: 'Clara',
                role: 'Investigadora',
                description: 'Encargada del registro oficial. Gestiona toda la información.',
                color: 'text-[#00ccff]',
              },
              {
                name: 'Leni',
                role: 'Exploradora',
                description: 'Scout ágil. Detecta peligros antes que el resto.',
                color: 'text-[#39ff14]',
              },
            ].map((character) => (
              <div
                key={character.name}
                className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-4 space-y-2"
              >
                <h3 className={`${character.color}`}>{character.name}</h3>
                <p className="text-sm text-[#888888]">{character.role}</p>
                <p className="text-xs text-[#e0e0e0]">{character.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mecánicas */}
        <div className="bg-[#151515] border border-[#00ff88]/30 rounded-lg p-6 space-y-4">
          <h2 className="text-xl text-[#00ccff] tracking-wider flex items-center gap-2">
            <Dices className="h-5 w-5" />
            MECÁNICAS
          </h2>
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border border-[#00ccff]/20 rounded-lg p-4">
              <h3 className="text-[#00ccff] mb-2">Dados</h3>
              <ul className="text-sm text-[#e0e0e0] space-y-1 list-disc list-inside">
                <li>D4: Para decisiones menores y movimiento rápido</li>
                <li>D20: Para eventos importantes, combates y selección de camino inicial</li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] border border-[#00ccff]/20 rounded-lg p-4">
              <h3 className="text-[#00ccff] mb-2">Casillas</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#ffaa00] rounded" />
                  <span className="text-[#e0e0e0]">Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#00ccff] rounded" />
                  <span className="text-[#e0e0e0]">Acertijo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#ff0033] rounded" />
                  <span className="text-[#e0e0e0]">Combate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#d4a017] rounded" />
                  <span className="text-[#e0e0e0]">Combate Intenso</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#00ccff]/20 rounded-lg p-4">
              <h3 className="text-[#00ccff] mb-2">HP y Puntos</h3>
              <ul className="text-sm text-[#e0e0e0] space-y-1 list-disc list-inside">
                <li>HP inicial: 30 (configurable)</li>
                <li>Puntos individuales: Reconocimiento personal</li>
                <li>Puntos grupales: Afectan el resultado narrativo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recursos */}
        <div className="bg-[#151515] border border-[#00ff88]/30 rounded-lg p-6 space-y-4">
          <h2 className="text-xl text-[#00ccff] tracking-wider flex items-center gap-2">
            <Shield className="h-5 w-5" />
            RECURSOS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-3">
              <p className="text-[#00ff88] mb-1">Escudo de Plasma</p>
              <p className="text-xs text-[#888888]">Protección contra ataques devastadores</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-3">
              <p className="text-[#00ff88] mb-1">Detector de Esporas</p>
              <p className="text-xs text-[#888888]">Detecta zonas de alta contaminación</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-3">
              <p className="text-[#00ff88] mb-1">Kit Médico</p>
              <p className="text-xs text-[#888888]">Restaura HP del equipo</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-3">
              <p className="text-[#00ff88] mb-1">Munición</p>
              <p className="text-xs text-[#888888]">Necesaria para combates intensos</p>
            </div>
          </div>
        </div>

        {/* Decisiones */}
        <div className="bg-[#151515] border border-[#00ff88]/30 rounded-lg p-6 space-y-4">
          <h2 className="text-xl text-[#00ccff] tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            DECISIONES GRUPALES
          </h2>
          <div className="bg-[#ff0033]/10 border border-[#ff0033]/30 rounded-lg p-4">
            <p className="text-[#e0e0e0] mb-3">
              Algunas situaciones requieren decisiones grupales bajo presión de tiempo (90 segundos).
            </p>
            <p className="text-sm text-[#ff0033]">
              ⚠️ Si el tiempo se agota: -8 HP por jugador, -10 puntos de grupo
            </p>
          </div>
        </div>

        {/* Finales */}
        <div className="bg-[#151515] border border-[#00ff88]/30 rounded-lg p-6 space-y-4">
          <h2 className="text-xl text-[#00ccff] tracking-wider flex items-center gap-2">
            <Target className="h-5 w-5" />
            FINALES POSIBLES
          </h2>
          <div className="space-y-3">
            <div className="bg-[#1a1a1a] border-l-4 border-[#00ff88] p-4">
              <p className="text-[#00ff88] font-semibold">Final Feliz</p>
              <p className="text-xs text-[#888888] mt-1">
                La humanidad persiste. Esperanza en la oscuridad.
              </p>
            </div>
            <div className="bg-[#1a1a1a] border-l-4 border-[#ff0033] p-4">
              <p className="text-[#ff0033] font-semibold">Final Malo</p>
              <p className="text-xs text-[#888888] mt-1">Extinción humana completa.</p>
            </div>
            <div className="bg-[#1a1a1a] border-l-4 border-[#00ccff] p-4">
              <p className="text-[#00ccff] font-semibold">Final Fantástico</p>
              <p className="text-xs text-[#888888] mt-1">
                Entidades cósmicas selladas. Verdad revelada.
              </p>
            </div>
            <div className="bg-[#1a1a1a] border-l-4 border-[#ffaa00] p-4">
              <p className="text-[#ffaa00] font-semibold">Final Real - Reina de los Mutados</p>
              <p className="text-xs text-[#888888] mt-1">
                Requiere sacrificio de un jugador. Victoria costosa.
              </p>
            </div>
          </div>
        </div>

        {/* Podio */}
        <div className="bg-[#151515] border border-[#00ff88]/30 rounded-lg p-6 space-y-4">
          <h2 className="text-xl text-[#00ccff] tracking-wider flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            SISTEMA DE PODIO
          </h2>
          <p className="text-[#e0e0e0] text-sm">
            El podio reconoce el desempeño individual pero NO afecta el resultado narrativo.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#1a1a1a] border border-[#ffaa00]/20 rounded-lg p-3 text-center">
              <p className="text-[#ffaa00] font-semibold">Mención Suprema</p>
              <p className="text-xs text-[#888888] mt-1">80+ puntos</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#00ccff]/20 rounded-lg p-3 text-center">
              <p className="text-[#00ccff] font-semibold">Mención de Honor</p>
              <p className="text-xs text-[#888888] mt-1">65-75 puntos</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-3 text-center">
              <p className="text-[#00ff88] font-semibold">Mérito</p>
              <p className="text-xs text-[#888888] mt-1">50-55 puntos</p>
            </div>
          </div>
        </div>

        {/* Hoja de Clara */}
        <div className="bg-[#151515] border border-[#00ff88]/30 rounded-lg p-6 space-y-4">
          <h2 className="text-xl text-[#00ccff] tracking-wider">HOJA DE CLARA</h2>
          <div className="bg-[#ff0033]/10 border border-[#ff0033]/30 rounded-lg p-4 space-y-2">
            <p className="text-[#e0e0e0]">
              Clara es la investigadora encargada del registro oficial del gobierno. Desde su hoja
              digital puede:
            </p>
            <ul className="text-sm text-[#e0e0e0] space-y-1 list-disc list-inside ml-4">
              <li>Modificar HP de jugadores</li>
              <li>Gestionar puntos individuales y grupales</li>
              <li>Administrar recursos</li>
              <li>Registrar eventos y decisiones</li>
              <li>Mantener un historial cronológico</li>
            </ul>
            <p className="text-sm text-[#ff0033] mt-3">
              ⚠️ ADVERTENCIA: Errores de registro generan consecuencias reales
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-4 text-center text-xs text-[#888888]">
          <p className="tracking-widest">SISTEMA GUBERNAMENTAL DE NUEVA ERA</p>
          <p className="text-[#ff0033] mt-1">TODA DECISIÓN TIENE CONSECUENCIAS</p>
        </div>
      </motion.div>
    </div>
  );
}
