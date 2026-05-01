export type Lesson = {
  id: number;
  title: string;
  completed: boolean;
  current?: boolean;
};

export type LevelData = {
  title: string;
  lessons: Lesson[];
};

export const LEVEL_DATA: Record<string, LevelData> = {
  '1': {
    title: 'Letras y abecedario',
    lessons: [
      { id: 1, title: 'Las vocales', completed: true },
      { id: 2, title: 'Práctica del abecedario', completed: true },
      { id: 3, title: 'Formación de palabras con el abecedario', completed: false, current: true },
    ],
  },
  '2': {
    title: 'Palabras básicas',
    lessons: [
      { id: 1, title: 'Saludos básicos', completed: false, current: true },
      { id: 2, title: 'Números del 1 al 10', completed: false },
      { id: 3, title: 'Colores principales', completed: false },
    ],
  },
  '3': {
    title: 'Frases básicas',
    lessons: [
      { id: 1, title: 'Presentaciones personales', completed: false, current: true },
      { id: 2, title: 'Frases de cortesía', completed: false },
      { id: 3, title: 'Preguntas simples', completed: false },
    ],
  },
};