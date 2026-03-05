export interface Challenge {
  id: number;
  side: 'right' | 'left';
  title: string;
  zone: string;
  description: string;
  type: 'puzzle' | 'decision' | 'combat' | 'special';
  icon: string;
  options?: {
    text: string;
    type: 'positive' | 'negative' | 'neutral';
    consequence?: string;
  }[];
  answer?: string; // Para acertijos
  requiresD20?: boolean;
  subDecision?: {
    character: string;
    question: string;
    options: {
      text: string;
      consequence: string;
    }[];
  };
}

export const RIGHT_PATH_CHALLENGES: Challenge[] = [
  {
    id: 1,
    side: 'right',
    title: 'LABORATORIO ABANDONADO',
    zone: 'Zona Industrial',
    description:
      'El equipo encuentra un laboratorio abandonado con equipo médico intacto. Sin embargo, el edificio está parcialmente colapsado y podría ser peligroso.',
    type: 'decision',
    icon: '🏭',
    options: [
      {
        text: 'Entrar con precaución y recoger suministros',
        type: 'positive',
        consequence: 'Ganáis 1 Kit Médico. Adrian gana +5 puntos.',
      },
      {
        text: 'Enviar solo a Ivan para evaluación estructural',
        type: 'neutral',
        consequence: 'Ivan realiza chequeo. Si tiene éxito, +10 puntos grupales.',
      },
      {
        text: 'Ignorar el edificio y continuar',
        type: 'negative',
        consequence: 'No hay cambios, pero perdéis tiempo valioso.',
      },
    ],
  },
  {
    id: 2,
    side: 'right',
    title: 'DETECTOR DE ESPORAS',
    zone: 'Área Contaminada',
    description:
      'Encuentran un Detector de Esporas avanzado en una estación abandonada, pero está bloqueado por un sistema de seguridad.',
    type: 'decision',
    icon: '📡',
    options: [
      {
        text: 'Clara hackea el sistema',
        type: 'positive',
        consequence: 'Ganáis 1 Detector de Esporas. Clara gana +10 puntos.',
      },
      {
        text: 'Ivan intenta forzar la entrada',
        type: 'negative',
        consequence: 'Falla. Todo el equipo pierde -2 HP por alarma de seguridad.',
      },
      {
        text: 'Buscar otra entrada',
        type: 'neutral',
        consequence: 'Encuentran entrada alternativa. +5 puntos grupales.',
      },
    ],
    subDecision: {
      character: 'Clara',
      question: 'Clara encuentra información clasificada sobre el origen de las esporas. ¿Comparte con el equipo?',
      options: [
        {
          text: 'Compartir toda la información',
          consequence: 'El equipo gana +15 puntos grupales pero Keira pierde -3 HP por estrés.',
        },
        {
          text: 'Ocultar parcialmente la verdad',
          consequence: 'Clara gana +10 puntos pero el equipo pierde -5 puntos grupales.',
        },
      ],
    },
  },
  {
    id: 3,
    side: 'right',
    title: 'CAMPO DE ESPORAS',
    zone: 'Bosque Infectado',
    description:
      'El camino está bloqueado por un denso campo de esporas. Cruzarlo sin protección sería letal.',
    type: 'decision',
    icon: '☁️',
    options: [
      {
        text: 'Usar Escudo de Plasma para abrir paso',
        type: 'positive',
        consequence: 'Pierden 1 Escudo de Plasma. Todo el equipo cruza sin daño.',
      },
      {
        text: 'Leni explora ruta alternativa',
        type: 'neutral',
        consequence: 'Leni gana +10 puntos. Encuentran ruta segura pero más larga.',
      },
      {
        text: 'Cruzar corriendo sin protección',
        type: 'negative',
        consequence: 'Todo el equipo pierde -5 HP. Keira pierde -3 HP adicionales.',
      },
    ],
  },
  {
    id: 4,
    side: 'right',
    title: 'CÁMARA SELLADA',
    zone: 'Bunker Subterráneo',
    description:
      'Una cámara blindada contiene armas y munición del Viejo Mundo, pero requiere código de acceso.',
    type: 'decision',
    icon: '🔐',
    options: [
      {
        text: 'Clara descifra el código',
        type: 'positive',
        consequence: 'Ganáis 10 municiones. Clara y Keira ganan +5 puntos cada una.',
      },
      {
        text: 'Volar la puerta (usar munición)',
        type: 'negative',
        consequence: 'Pierden 5 municiones. Contenido dañado parcialmente. +2 municiones netas.',
      },
      {
        text: 'Continuar sin abrir',
        type: 'neutral',
        consequence: 'No hay cambios.',
      },
    ],
  },
  {
    id: 5,
    side: 'right',
    title: 'TORMENTA DE ESPORAS',
    zone: 'Llanura Abierta',
    description:
      'Una tormenta de esporas masiva se aproxima rápidamente. Deben buscar refugio inmediatamente.',
    type: 'decision',
    icon: '🌪️',
    options: [
      {
        text: 'Refugiarse en cueva cercana',
        type: 'positive',
        consequence: 'El equipo sobrevive sin daño. +10 puntos grupales.',
      },
      {
        text: 'Correr hacia edificio distante',
        type: 'neutral',
        consequence: 'Llegan pero exhaustos. Todo el equipo pierde -2 HP.',
      },
      {
        text: 'Continuar avanzando',
        type: 'negative',
        consequence: 'Quedan atrapados. Todo el equipo pierde -8 HP.',
      },
    ],
  },
  {
    id: 6,
    side: 'right',
    title: 'ACERTIJO DEL VIGÍA',
    zone: 'Torre de Observación',
    description:
      'En la torre encuentran un mensaje del último vigía: "Devoro todo sin descanso. A los jóvenes los hago viejos. A los altos, pequeños. ¿Qué soy?"',
    type: 'puzzle',
    icon: '🧩',
    answer: 'el tiempo',
  },
];

export const LEFT_PATH_CHALLENGES: Challenge[] = [
  {
    id: 1,
    side: 'left',
    title: 'BOSQUE ABANDONADO',
    zone: 'Bosque Oscuro',
    description:
      'El equipo atraviesa un bosque denso y silencioso. Encuentran señales de actividad reciente pero no humana.',
    type: 'decision',
    icon: '🌲',
    options: [
      {
        text: 'Investigar las señales',
        type: 'neutral',
        consequence: 'Leni gana +10 puntos. Descubren nido de mutados vacío.',
      },
      {
        text: 'Avanzar silenciosamente',
        type: 'positive',
        consequence: 'Evitan confrontación. +5 puntos grupales.',
      },
      {
        text: 'Marchar rápidamente',
        type: 'negative',
        consequence: 'Hacen ruido. Alertan criaturas cercanas. Todos pierden -3 HP.',
      },
    ],
  },
  {
    id: 2,
    side: 'left',
    title: 'FÁBRICA EN RUINAS',
    zone: 'Complejo Industrial',
    description:
      'Una antigua fábrica podría contener recursos valiosos, pero está infestada de esporas.',
    type: 'decision',
    icon: '🏗️',
    options: [
      {
        text: 'Usar Detector de Esporas para mapear',
        type: 'positive',
        consequence: 'Pierden 1 Detector. Encuentran ruta segura. Ganan 1 Kit Médico y 5 municiones.',
      },
      {
        text: 'Adrian lidera con precaución médica',
        type: 'neutral',
        consequence: 'Adrian gana +10 puntos. Evitan infección pero no encuentran mucho.',
      },
      {
        text: 'Ignorar la fábrica',
        type: 'negative',
        consequence: 'Pierden oportunidad de recursos.',
      },
    ],
  },
  {
    id: 3,
    side: 'left',
    title: 'EMBOSCADA NOCTURNA',
    zone: 'Carretera Abandonada',
    description:
      'Mutados atacan durante la noche. El equipo debe defenderse.',
    type: 'combat',
    icon: '⚔️',
    options: [
      {
        text: 'Keira lidera contraataque (usar 5 municiones)',
        type: 'positive',
        consequence: 'Victoria. Keira gana +15 puntos. Pierden 5 municiones.',
      },
      {
        text: 'Replegarse tácticamente',
        type: 'neutral',
        consequence: 'Evitan combate pero pierden posición. Todo el equipo -2 HP por persecución.',
      },
      {
        text: 'Combate cuerpo a cuerpo',
        type: 'negative',
        consequence: 'Victoria costosa. Keira -10 HP, Ivan -8 HP, otros -5 HP.',
      },
    ],
  },
  {
    id: 4,
    side: 'left',
    title: 'SEÑAL DE RADIO',
    zone: 'Estación de Comunicaciones',
    description:
      'Captan una señal de socorro. Alguien solicita ayuda urgente pero está fuera de ruta.',
    type: 'decision',
    icon: '📻',
    options: [
      {
        text: 'Desviar ruta para ayudar',
        type: 'positive',
        consequence: 'Rescatan sobreviviente. +20 puntos grupales pero pierden tiempo.',
      },
      {
        text: 'Transmitir ubicación al Nuevo Gobierno',
        type: 'neutral',
        consequence: 'Clara gana +5 puntos. Continúan misión.',
      },
      {
        text: 'Ignorar la señal',
        type: 'negative',
        consequence: 'No hay cambios pero equipo pierde -10 puntos grupales por moral.',
      },
    ],
  },
  {
    id: 5,
    side: 'left',
    title: 'PUENTE INESTABLE',
    zone: 'Río Contaminado',
    description:
      'El único puente está severamente dañado. Cruzarlo es arriesgado pero la alternativa es un rodeo de días.',
    type: 'special',
    icon: '🌉',
    requiresD20: true,
    options: [
      {
        text: 'Ivan evalúa estructura (D20)',
        type: 'neutral',
        consequence: '10+: Cruzan seguros. +15 puntos. 5-9: Cruzan pero puente colapsa. -5 HP todos. 1-4: Colapso inmediato. -10 HP todos.',
      },
      {
        text: 'Buscar vado alternativo',
        type: 'positive',
        consequence: 'Seguro pero lento. Pierden 1 día. No hay daño.',
      },
      {
        text: 'Cruzar corriendo sin evaluar',
        type: 'negative',
        consequence: 'Puente colapsa. Todo el equipo -8 HP.',
      },
    ],
  },
  {
    id: 6,
    side: 'left',
    title: 'ACERTIJO: EL SUSURRO DE LA SOMBRA',
    zone: 'Templo Olvidado',
    description:
      'En las ruinas de un templo antiguo encuentran una inscripción: "No tengo voz pero grito. No tengo dientes pero muerdo. No tengo vida pero crezco. ¿Qué soy?"',
    type: 'puzzle',
    icon: '🧩',
    answer: 'la infección',
  },
];

export function getChallengesBySide(side: 'right' | 'left'): Challenge[] {
  return side === 'right' ? RIGHT_PATH_CHALLENGES : LEFT_PATH_CHALLENGES;
}
