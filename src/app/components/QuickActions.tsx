import { motion } from 'motion/react';
import { Save, FileText, Trophy, Skull, Target } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';

export function QuickActions() {
  const navigate = useNavigate();
  const { saveGame, endGame } = useGame();

  const actions = [
    {
      icon: Save,
      label: 'Guardar',
      color: 'bg-[#00ff88]',
      hoverColor: 'hover:bg-[#39ff14]',
      onClick: () => {
        saveGame();
        alert('Partida guardada');
      },
    },
    {
      icon: FileText,
      label: 'Clara',
      color: 'bg-[#00ccff]',
      hoverColor: 'hover:bg-[#00ccff]/80',
      onClick: () => navigate('/clara-sheet'),
    },
    {
      icon: Trophy,
      label: 'Podio',
      color: 'bg-[#ffaa00]',
      hoverColor: 'hover:bg-[#ffaa00]/80',
      onClick: () => navigate('/podium'),
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={action.onClick}
              className={`${action.color} ${action.hoverColor} text-black h-12 w-12 p-0 rounded-full shadow-lg`}
              title={action.label}
            >
              <Icon className="h-5 w-5" />
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
