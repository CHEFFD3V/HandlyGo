import { db } from '../../services/firebaseConfig';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

interface Translation {
  id: number;
  texto: string;
  audio: string;
  category: string;
}

export const getTranslationById = async (id: number): Promise<Translation | null> => {
  try {
    const translationsRef = collection(db, 'translations');
    
    const q = query(translationsRef, where('id', '==', id), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`No se encontró traducción para el ID: ${id}`);
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: data.id,
      texto: data.texto,
      audio: data.audio,
      category: data.category
    };

  } catch (error) {
    console.error("Error en getTranslationById:", error);
    throw new Error("No se pudo conectar con el servicio de traducciones.");
  }
};