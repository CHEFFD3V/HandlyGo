// Una seña individual (una letra, una palabra, una frase)
export type Sign = {
  id: string;
  label: string;
  description: string;
  mediaUri?: string;
};

// Lección individual dentro de un nivel
export type Lesson = {
  id: number;
  lessonKey: string;    // ← agregado: identificador único global ej: "1-1", "2-3"
  title: string;
  completed: boolean;
  current?: boolean;
  xpReward: number;
  signs: Sign[];
};

export type LevelData = {
  title: string;
  lessons: Lesson[];
};

export const LEVEL_DATA: Record<string, LevelData> = {
  '1': {
    title: 'Letras y abecedario',
    lessons: [
      {
        id: 1,
        lessonKey: '1-1',
        title: 'Las vocales',
        completed: false,
        current: true,
        xpReward: 10,
        signs: [
          { id: 'A', label: 'Letra "A"', description: 'Cierra el puño con el pulgar al costado', mediaUri: undefined },
          { id: 'E', label: 'Letra "E"', description: 'Dobla los dedos tocando el pulgar', mediaUri: undefined },
          { id: 'I', label: 'Letra "I"', description: 'Extiende solo el meñique', mediaUri: undefined },
          { id: 'O', label: 'Letra "O"', description: 'Une el pulgar con los demás dedos en forma de "O"', mediaUri: undefined },
          { id: 'U', label: 'Letra "U"', description: 'Extiende el índice y el medio juntos', mediaUri: undefined },
        ],
      },
      {
        id: 2,
        lessonKey: '1-2',
        title: 'Práctica del abecedario',
        completed: false,
        current: false,
        xpReward: 10,
        signs: [
          { id: 'A', label: 'Letra "A"', description: 'Cierra el puño con el pulgar al costado', mediaUri: undefined },
          { id: 'B', label: 'Letra "B"', description: 'Extiende los cuatro dedos juntos con el pulgar doblado', mediaUri: undefined },
          { id: 'C', label: 'Letra "C"', description: 'Dobla los dedos formando una "C"', mediaUri: undefined },
          // TODO: agregar el resto cuando estén los videos
        ],
      },
      {
        id: 3,
        lessonKey: '1-3',
        title: 'Formación de palabras con el abecedario',
        completed: false,
        current: false,
        xpReward: 10,
        signs: [
          { id: 'placeholder', label: 'Próximamente', description: 'Contenido en desarrollo', mediaUri: undefined },
        ],
      },
    ],
  },
  '2': {
    title: 'Palabras básicas',
    lessons: [
      {
        id: 1,
        lessonKey: '2-1',
        title: 'Palabras básicas en señas',
        completed: false,
        current: true,
        xpReward: 10,
        signs: [
          { id: 'placeholder', label: 'Próximamente', description: 'Contenido en desarrollo', mediaUri: undefined },
        ],
      },
      {
        id: 2,
        lessonKey: '2-2',
        title: 'Práctica de palabras básicas',
        completed: false,
        current: false,
        xpReward: 10,
        signs: [
          { id: 'placeholder', label: 'Próximamente', description: 'Contenido en desarrollo', mediaUri: undefined },
        ],
      },
      {
        id: 3,
        lessonKey: '2-3',
        title: 'Construcción de palabras y uso práctico',
        completed: false,
        current: false,
        xpReward: 10,
        signs: [
          { id: 'placeholder', label: 'Próximamente', description: 'Contenido en desarrollo', mediaUri: undefined },
        ],
      },
    ],
  },
  '3': {
    title: 'Frases básicas',
    lessons: [
      {
        id: 1,
        lessonKey: '3-1',
        title: 'Frases básicas en señas',
        completed: false,
        current: true,
        xpReward: 10,
        signs: [
          { id: 'placeholder', label: 'Próximamente', description: 'Contenido en desarrollo', mediaUri: undefined },
        ],
      },
      {
        id: 2,
        lessonKey: '3-2',
        title: 'Comprensión de frases',
        completed: false,
        current: false,
        xpReward: 10,
        signs: [
          { id: 'placeholder', label: 'Próximamente', description: 'Contenido en desarrollo', mediaUri: undefined },
        ],
      },
      {
        id: 3,
        lessonKey: '3-3',
        title: 'Construcción de frases',
        completed: false,
        current: false,
        xpReward: 10,
        signs: [
          { id: 'placeholder', label: 'Próximamente', description: 'Contenido en desarrollo', mediaUri: undefined },
        ],
      },
    ],
  },
};