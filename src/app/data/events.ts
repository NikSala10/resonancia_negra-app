import { GameEvent } from '../context/GameContext';

export const puzzleEvents: GameEvent[] = [
  {
    type: 'puzzle',
    title: 'CÓDIGO ANTIGUO',
    description:
      'Encuentran una terminal antigua del Viejo Mundo con datos encriptados. Descifrarla podría revelar información crucial sobre el origen de las esporas.',
    options: [
      'Descifrar el código en equipo (requiere 30 min)',
      'Ivan intenta hackearlo rápido (arriesgado)',
      'Ignorar y continuar la misión',
    ],
  },
  {
    type: 'puzzle',
    title: 'LABORATORIO SELLADO',
    description:
      'Una puerta de seguridad biométrica bloquea el acceso a un laboratorio. Los escáneres aún funcionan. ¿Qué hacer?',
    options: [
      'Buscar credenciales en archivos cercanos',
      'Forzar la entrada (dañará recursos)',
      'Rodear el área (perder tiempo)',
    ],
  },
  {
    type: 'puzzle',
    title: 'SECUENCIA DE DESCONTAMINACIÓN',
    description:
      'Para avanzar deben activar cámaras de descontaminación en el orden correcto. Un error podría liberar esporas.',
    options: [
      'Clara analiza los patrones',
      'Activar aleatoriamente',
      'Usar el detector de esporas',
    ],
  },
];

export const combatEvents: GameEvent[] = [
  {
    type: 'combat',
    title: 'GRUPO DE MUTADOS',
    description:
      'Tres mutados detectan al equipo. Sus cuerpos retorcidos se mueven con velocidad antinatural.',
    enemy: {
      name: 'Grupo de Mutados',
      hp: 45,
      maxHp: 45,
      type: 'mutado',
    },
    requiresD20: true,
  },
  {
    type: 'combat',
    title: 'INFECTADO ERRANTE',
    description:
      'Un humano infectado, apenas consciente, se acerca lentamente. Sus ojos brillan con el verde de las esporas.',
    enemy: {
      name: 'Infectado Errante',
      hp: 25,
      maxHp: 25,
      type: 'mutado',
    },
    requiresD20: false,
  },
  {
    type: 'combat',
    title: 'REINA DE LOS MUTADOS',
    description:
      'En el epicentro encuentran a la Reina. Una masa colosal de carne y consciencia distribuida. El aire vibra con su presencia.',
    enemy: {
      name: 'Reina de los Mutados',
      hp: 100,
      maxHp: 100,
      type: 'reina',
    },
    requiresD20: true,
  },
  {
    type: 'combat',
    title: 'NÉMESIS',
    description:
      'Una criatura que no debería existir emerge de las sombras. Es como si el universo mismo rechazara su presencia.',
    enemy: {
      name: 'Némesis',
      hp: 80,
      maxHp: 80,
      type: 'nemesis',
    },
    requiresD20: true,
  },
];

export const decisionEvents = [
  {
    title: 'SEÑAL DE SOCORRO',
    description:
      'Reciben una señal de radio distorsionada. Alguien pide ayuda desesperadamente. Desviar la ruta podría retrasar la misión principal.',
    options: [
      'Responder a la señal y desviar ruta',
      'Ignorar y continuar con la misión',
      'Enviar solo a Leni a investigar',
    ],
  },
  {
    title: 'SUMINISTROS LIMITADOS',
    description:
      'Encuentran un almacén con recursos, pero solo pueden llevar algunos. ¿Qué priorizan?',
    options: [
      'Munición y armas',
      'Suministros médicos',
      'Equipo de detección',
      'Dividir equitativamente',
    ],
  },
  {
    title: 'SOBREVIVIENTE SOSPECHOSO',
    description:
      'Un sobreviviente solitario ofrece guiarlos por una ruta segura. Parece nervioso. Algo no encaja.',
    options: [
      'Confiar y seguirlo',
      'Interrogarlo primero',
      'Rechazar su ayuda',
    ],
  },
  {
    title: 'ZONA DE CUARENTENA',
    description:
      'El camino directo pasa por una zona de cuarentena activa. Hay una ruta alterna más larga pero segura.',
    options: [
      'Atravesar la zona de cuarentena',
      'Tomar la ruta segura (perder tiempo)',
      'Clara consulta los registros del gobierno',
    ],
  },
];

export const specialEvents: GameEvent[] = [
  {
    type: 'special',
    title: 'VISIÓN CÓSMICA',
    description:
      'Clara experimenta una visión. Ve entidades dormidas bajo la superficie terrestre. Entiende que las esporas son solo el comienzo.',
    options: ['Compartir la visión con el equipo', 'Mantenerlo en secreto'],
  },
  {
    type: 'special',
    title: 'OFRENDA ANTIGUA',
    description:
      'Encuentran un altar con símbolos no humanos. Hay una sensación de que algo observa. Algo muy antiguo.',
    options: [
      'Investigar el altar',
      'Alejarse inmediatamente',
      'Usar el detector de esporas',
    ],
  },
];
