import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Save,
  AlertTriangle,
  Plus,
  Minus,
  FileText,
  Package,
  Users,
  Trophy,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

export default function ClaraSheet() {
  const navigate = useNavigate();
  const {
    players,
    groupPoints,
    resources,
    history,
    updatePlayerHP,
    updatePlayerPoints,
    updateGroupPoints,
    updateResource,
    addToHistory,
    saveGame,
  } = useGame();

  const [newEntry, setNewEntry] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]?.id || '');

  const handleAddHistory = () => {
    if (newEntry.trim()) {
      addToHistory({
        type: 'event',
        description: 'Registro manual de Clara',
        details: newEntry,
      });
      setNewEntry('');
    }
  };

  const handleSave = () => {
    saveGame();
    alert('Registro guardado correctamente');
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#151515] border-2 border-[#00ccff] rounded-lg p-4 md:p-6 mb-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl text-[#00ccff] tracking-wider">
              HOJA DIGITAL DE CLARA
            </h1>
            <p className="text-xs text-[#888888] tracking-widest mt-1">
              SISTEMA DE REGISTRO GUBERNAMENTAL CLASIFICADO
            </p>
          </div>
          <Button
            onClick={() => navigate('/game')}
            variant="outline"
            size="sm"
            className="border-[#00ff88] text-[#00ff88]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Advertencia */}
        <motion.div
          animate={{
            borderColor: ['rgba(255, 0, 51, 0.3)', 'rgba(255, 0, 51, 0.8)', 'rgba(255, 0, 51, 0.3)'],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-[#ff0033]/10 border-2 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-[#ff0033] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[#ff0033] font-semibold">ADVERTENCIA CRÍTICA</p>
            <p className="text-xs text-[#ff0033]/80 mt-1">
              Errores de registro generan consecuencias reales. Toda modificación debe ser
              validada y guardada.
            </p>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Gestión de jugadores y recursos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gestión de Jugadores */}
          <div className="bg-[#151515] border border-[#00ccff]/30 rounded-lg p-6 space-y-4">
            <h2 className="text-[#00ccff] tracking-wider flex items-center gap-2">
              <Users className="h-5 w-5" />
              GESTIÓN DE JUGADORES
            </h2>

            <div className="space-y-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-[#00ff88]">{player.name}</h3>
                      <p className="text-xs text-[#888888]">{player.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#888888]">Estado</p>
                      <p className="text-sm text-[#00ccff]">{player.status}</p>
                    </div>
                  </div>

                  {/* Control de HP */}
                  <div className="space-y-2">
                    <Label className="text-xs text-[#888888]">HP: {player.hp} / {player.maxHp}</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updatePlayerHP(player.id, player.hp - 5)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033]/10"
                      >
                        <Minus className="h-4 w-4 mr-1" />
                        -5
                      </Button>
                      <Button
                        onClick={() => updatePlayerHP(player.id, player.hp - 1)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-[#ff0033] text-[#ff0033] hover:bg-[#ff0033]/10"
                      >
                        -1
                      </Button>
                      <Button
                        onClick={() => updatePlayerHP(player.id, player.hp + 1)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88]/10"
                      >
                        +1
                      </Button>
                      <Button
                        onClick={() => updatePlayerHP(player.id, player.hp + 5)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88]/10"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        +5
                      </Button>
                    </div>
                  </div>

                  {/* Control de Puntos */}
                  <div className="space-y-2">
                    <Label className="text-xs text-[#888888]">Puntos: {player.points}</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updatePlayerPoints(player.id, -5)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-[#ffaa00] text-[#ffaa00] hover:bg-[#ffaa00]/10"
                      >
                        -5
                      </Button>
                      <Button
                        onClick={() => updatePlayerPoints(player.id, 5)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-[#ffaa00] text-[#ffaa00] hover:bg-[#ffaa00]/10"
                      >
                        +5
                      </Button>
                      <Button
                        onClick={() => updatePlayerPoints(player.id, 10)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-[#ffaa00] text-[#ffaa00] hover:bg-[#ffaa00]/10"
                      >
                        +10
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gestión de Recursos y Puntos */}
          <div className="bg-[#151515] border border-[#00ccff]/30 rounded-lg p-6 space-y-4">
            <h2 className="text-[#00ccff] tracking-wider flex items-center gap-2">
              <Package className="h-5 w-5" />
              RECURSOS Y PUNTOS GRUPALES
            </h2>

            {/* Puntos grupales */}
            <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-[#00ff88]">Puntos Grupales</Label>
                <span className="text-2xl text-[#00ff88]">{groupPoints}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => updateGroupPoints(-10)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-[#ff0033] text-[#ff0033]"
                >
                  -10
                </Button>
                <Button
                  onClick={() => updateGroupPoints(-5)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-[#ff0033] text-[#ff0033]"
                >
                  -5
                </Button>
                <Button
                  onClick={() => updateGroupPoints(5)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-[#00ff88] text-[#00ff88]"
                >
                  +5
                </Button>
                <Button
                  onClick={() => updateGroupPoints(10)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-[#00ff88] text-[#00ff88]"
                >
                  +10
                </Button>
              </div>
            </div>

            {/* Recursos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(resources).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-[#1a1a1a] border border-[#00ccff]/20 rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-[#888888]">
                      {key === 'plasmaShield' && 'Escudo de Plasma'}
                      {key === 'sporeDetector' && 'Detector de Esporas'}
                      {key === 'medicalKit' && 'Kit Médico'}
                      {key === 'ammunition' && 'Munición'}
                    </Label>
                    <span className="text-lg text-[#00ccff]">{value}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateResource(key as keyof typeof resources, -1)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-[#ff0033] text-[#ff0033]"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => updateResource(key as keyof typeof resources, 1)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-[#00ff88] text-[#00ff88]"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha - Historial */}
        <div className="space-y-6">
          {/* Añadir entrada */}
          <div className="bg-[#151515] border border-[#00ccff]/30 rounded-lg p-6 space-y-4">
            <h2 className="text-[#00ccff] tracking-wider flex items-center gap-2">
              <FileText className="h-5 w-5" />
              NUEVO REGISTRO
            </h2>

            <Textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Descripción del evento, decisión o cambio..."
              className="bg-[#1a1a1a] border-[#00ff88]/30 text-[#e0e0e0] min-h-[120px]"
            />

            <Button
              onClick={handleAddHistory}
              disabled={!newEntry.trim()}
              className="w-full bg-[#00ff88] hover:bg-[#39ff14] text-black disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir al Historial
            </Button>
          </div>

          {/* Historial */}
          <div className="bg-[#151515] border border-[#00ccff]/30 rounded-lg p-6 space-y-4">
            <h2 className="text-[#00ccff] tracking-wider">HISTORIAL CRONOLÓGICO</h2>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-sm text-[#888888] text-center py-8">
                  No hay registros aún
                </p>
              ) : (
                history
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-[#1a1a1a] border border-[#00ff88]/10 rounded-lg p-3 space-y-1"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm text-[#00ff88]">{entry.description}</p>
                          {entry.details && (
                            <p className="text-xs text-[#888888] mt-1">{entry.details}</p>
                          )}
                        </div>
                        <span className="text-[10px] text-[#888888] whitespace-nowrap">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#00ccff]">
                        <Trophy className="h-3 w-3" />
                        {entry.type}
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          </div>

          {/* Guardar */}
          <Button
            onClick={handleSave}
            className="w-full h-14 bg-[#00ccff] hover:bg-[#00ccff]/80 text-black"
          >
            <Save className="h-5 w-5 mr-2" />
            GUARDAR REGISTRO
          </Button>
        </div>
      </div>
    </div>
  );
}
