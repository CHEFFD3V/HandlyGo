import { db } from './firebaseConfig';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export interface Lesson {
  id: number;
  title: string;
  video: string;
  level: number;
}

export const getLessonById = async (id: number): Promise<Lesson | null> => {
  try {
    const lessonsRef = collection(db, 'lessons');
    const q = query(lessonsRef, where('id', '==', id), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const data = querySnapshot.docs[0].data();
    return {
      id: data.id,
      title: data.title,
      video: data.video,
      level: data.level
    };
  } catch (error) {
    console.error("Error cargando lección:", error);
    return null;
  }
};