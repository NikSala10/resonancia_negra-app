export type ChallengeIcon = 'hand' | 'trophy' | 'biohazard' | 'pill' | 'zap' | 'gun' | 'help';

export interface ChallengeOption {
  label: string;
  effects: string;
  subDecision?: {
    description: string;
    options: ChallengeOption[];
  };
}

export interface Challenge {
  id: number;
  type: 'challenge' | 'puzzle';
  icon: ChallengeIcon;
  title: string;
  zone?: string;
  event: string;
  rule?: string;
  options?: ChallengeOption[];
  puzzle?: {
    riddle: string;
    answer: string;
    correctEffect: string;
    incorrectEffect: string;
    ignoreEffect: string;
  };
}

// CAMINO DERECHO
const rightPathChallenges: Challenge[] = [
  {
    id: 1,
    type: 'challenge',
    icon: 'hand',
    title: 'LABORATORIO ABANDONADO',
    event: 'El grupo encuentra una zona de investigación abandonada. Cada jugador obtiene 1 carta de recurso al azar.',
    options: [
      {
        label: 'Compartir su recurso con el grupo',
        effects: '+5 pts individuales | +5 pts grupales'
      },
      {
        label: 'No compartir su recurso',
        effects: '+3 pts individuales | +1 pt grupal'
      }
    ]
  },
  {
    id: 2,
    type: 'challenge',
    icon: 'trophy',
    title: 'DETECTOR DE ESPORAS',
    event: 'El equipo sospecha que uno de los integrantes podría estar infectado. El grupo debe decidir si enviar a un jugador (usará un Kit Médico) para recuperar una pista prometida.',
    options: [
      {
        label: 'Saltarse el reto',
        effects: '-7 pts grupales | -3 pts individuales a cada jugador'
      },
      {
        label: 'No sacrificar un Kit Médico',
        effects: 'Sin cambios | No obtienen pista'
      },
      {
        label: 'Enviar a un jugador',
        effects: 'El jugador enviado pierde -10 HP | Gana +3 pts individuales | Clara recibe una pista',
        subDecision: {
          description: 'Clara debe decidir qué hacer con la pista:',
          options: [
            {
              label: 'Compartir la pista',
              effects: '+5 pts grupales | +2 pts individuales para todos | Clara +3 pts extra'
            },
            {
              label: 'Ocultar la pista',
              effects: 'Clara -5 pts individuales | 0 pts grupales'
            }
          ]
        }
      }
    ]
  },
  {
    id: 3,
    type: 'challenge',
    icon: 'biohazard',
    title: 'CAMPO DE ESPORAS',
    zone: 'Área abierta contaminada',
    event: 'El detector marca nivel crítico. Adrian identifica que cruzar sin protección es peligroso. Ivan podría modificar el detector para crear un escudo temporal.',
    rule: 'Si el grupo NO tiene detector de esporas: Todos pierden -5 HP.',
    options: [
      {
        label: 'Sacrificar detector de esporas (Iván)',
        effects: 'Pierden detector + 1 recurso a elección | Cruzan sin daño | +12 pts grupales | Iván +3 pts'
      },
      {
        label: 'Cruzar sin protección',
        effects: 'Cada jugador pierde -5 HP | +5 pts grupales'
      },
      {
        label: 'Rodear zona',
        effects: 'Pierden 1 turno | -3 pts grupales'
      }
    ]
  },
  {
    id: 4,
    type: 'challenge',
    icon: 'pill',
    title: 'CÁMARA SELLADA',
    zone: 'Laboratorio subterráneo',
    event: 'Ivan encuentra una cámara con tecnología que podría crear un arma definitiva. Para activarla, alguien debe quedarse dentro mientras se estabiliza.',
    options: [
      {
        label: 'Un jugador se ofrece voluntario',
        effects: 'Voluntario pierde -5 HP. Luego el grupo lanza D20 físicamente: si >10 ganan Escudo de Plasma | +20 pts grupales | +5 pts al voluntario'
      },
      {
        label: 'Nadie se ofrece',
        effects: 'Cámara explota | Todos pierden -5 HP | -8 pts grupales'
      }
    ]
  },
  {
    id: 5,
    type: 'challenge',
    icon: 'zap',
    title: 'TORMENTA DE ESPORAS',
    zone: 'Zona abierta sin refugio',
    event: 'Una tormenta de esporas se aproxima. Leni encuentra refugio para 3 personas. El grupo tiene 2 turnos para encontrar refugio.',
    options: [
      {
        label: 'Usar refugio de Leni',
        effects: '3 protegidos | Los demás pierden -10 HP | +8 pts grupales | Los que quedan afuera +4 pts. Adrián puede usar Kit Médico para salvar a alguien (decisión estratégica)'
      },
      {
        label: 'Correr sin refugio',
        effects: 'Todos aumentan +0.2 infección | +3 pts grupales | +2 pts individuales cada jugador'
      }
    ]
  },
  {
    id: 6,
    type: 'puzzle',
    icon: 'help',
    title: 'EL ACERTIJO DEL VIGÍA',
    event: 'Encuentran una estructura metálica corroída. Una consola antigua aún activa habla con voz distorsionada: "Solo quien comprenda la verdad invisible podrá obtener protección."',
    puzzle: {
      riddle: 'Este ser todo lo devora:\nAves, bestias, árboles y flores.\nDestruye el hierro, rompe el acero\nY reduce montañas a polvo.',
      answer: 'EL TIEMPO',
      correctEffect: 'Obtiene Escudo de Plasma | +7 pts individuales | +5 pts grupales',
      incorrectEffect: '-5 HP al jugador | -3 pts individuales | 0 pts grupales',
      ignoreEffect: 'No pierde vida | +1 pt individual por prudencia | No obtiene recompensa'
    }
  }
];

// CAMINO IZQUIERDO
const leftPathChallenges: Challenge[] = [
  {
    id: 7,
    type: 'challenge',
    icon: 'hand',
    title: 'BOSQUE ABANDONADO',
    event: 'Un mutado daña el traje de protección de Clara.',
    options: [
      {
        label: 'Compartir Kit Médico',
        effects: '+14 pts grupales | +5 pts individuales cada jugador'
      },
      {
        label: 'No compartir',
        effects: '-7 pts grupales | -1 pt individual cada jugador | Clara pierde -3 HP'
      }
    ]
  },
  {
    id: 8,
    type: 'challenge',
    icon: 'trophy',
    title: 'FÁBRICA EN RUINAS',
    zone: 'Interior industrial',
    event: 'Sala sellada con señales de actividad reciente. Iván puede forzar entrada, pero el ruido atraerá mutados. Leni puede buscar ruta alternativa silenciosa pero tardará más.',
    options: [
      {
        label: 'Iván fuerza la entrada',
        effects: '-3 municiones | +2 municiones recuperadas | Todos pierden -7 HP | +10 pts grupales'
      },
      {
        label: 'Ruta alternativa de Leni',
        effects: 'Sin daño | Obtienen 1 Kit Médico | +6 pts grupales | Leni +2 pts'
      },
      {
        label: 'Abandonar',
        effects: '-7 pts grupales'
      }
    ]
  },
  {
    id: 9,
    type: 'challenge',
    icon: 'biohazard',
    title: 'EMBOSCADA NOCTURNA',
    zone: 'Campamento',
    event: 'Durante el descanso, 2 mutados atacan. Leni avisa al grupo. Keira puede enfrentarlos sola o el grupo entero.',
    options: [
      {
        label: 'Keira sola',
        effects: 'Gasta 2 municiones propias | Keira -5 HP | Keira +8 pts | +4 pts grupales'
      },
      {
        label: 'Todos combaten',
        effects: 'Cada jugador -2 HP | +10 pts grupales'
      },
      {
        label: 'Huir',
        effects: 'Pierden escudo grupal | -5 pts grupales'
      }
    ]
  },
  {
    id: 10,
    type: 'challenge',
    icon: 'pill',
    title: 'SEÑAL DE RADIO',
    zone: 'Torre de comunicaciones',
    event: 'Leni capta una señal con coordenadas. Descifrar toma tiempo y deja expuesto al grupo.',
    options: [
      {
        label: 'Descifrar señal (Adrián + Leni)',
        effects: 'Adrián gasta 1 Kit Médico | Leni gasta 1 munición si hay combate | Obtienen pista clave | +15 pts grupales'
      },
      {
        label: 'Descifrar sin Adrián',
        effects: 'Todos pierden -8 HP | +10 pts grupales'
      },
      {
        label: 'Ignorar señal',
        effects: 'No obtienen pista'
      }
    ]
  },
  {
    id: 11,
    type: 'challenge',
    icon: 'gun',
    title: 'PUENTE INESTABLE',
    zone: 'Río contaminado',
    event: 'Puente a punto de colapsar. Cruzar de uno en uno expone al grupo. Keira puede cubrir el cruce pero será la última.',
    options: [
      {
        label: 'Cruce ordenado con cobertura',
        effects: 'Keira gasta TODA la munición | Iván lanza D20 físico: número par: cruza seguro | número impar: Keira pierde -5 HP | +15 pts grupales si sobrevive | +8 pts si cae pero vive'
      },
      {
        label: 'Cruce rápido',
        effects: '2 jugadores al azar pierden -8 HP | +5 pts grupales'
      },
      {
        label: 'Buscar otra ruta',
        effects: '-2 municiones | -4 pts grupales | -2 pts individuales | Pierden 1 recurso al azar | Pierden 1 turno'
      }
    ]
  },
  {
    id: 12,
    type: 'puzzle',
    icon: 'help',
    title: 'EL SUSURRO DE LA SOMBRA',
    event: 'Encuentran un cilindro de cristal intacto. Dentro, una sustancia oscura se mueve como viva. Una inscripción aparece:',
    puzzle: {
      riddle: 'No tengo cuerpo, pero puedo envolver el mundo.\nNo tengo boca, pero puedo devorarte.\nNací del miedo y crezco en silencio.\nCuando me ignoras, me hago más fuerte.\n¿Qué soy?',
      answer: 'LA INFECCIÓN',
      correctEffect: '+8 pts individuales | +6 pts grupales | Reduce -0.1 infección global | Obtiene carta: Antídoto Parcial',
      incorrectEffect: '-6 HP | +0.1 infección global | -4 pts individuales',
      ignoreEffect: '+2 pts individuales por cautela | Sin recompensa'
    }
  }
];

export function getChallengesBySide(side: 'right' | 'left'): Challenge[] {
  return side === 'right' ? rightPathChallenges : leftPathChallenges;
}
