import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface Translation {
  id: number;
  word: string;
  audio: string;
}

export const getTranslationById = async (id: number): Promise<{ word: string; audio: string }> => {
  try {
    // Validacion de ID
    if (!id || typeof id !== 'number') {
      throw new Error(`ID invalido: ${id}`);
    }

    // Referencia a la coleccion translations
    const translationsRef = collection(db, 'translations');
    
    // Buscar documento donde el campo "id" sea igual al parametro
    const q = query(translationsRef, where('id', '==', id));
    
    // Ejecutar la consulta
    const querySnapshot = await getDocs(q);
    
    // Verificar si encontro el documento
    if (querySnapshot.empty) {
      throw new Error(`No se encontro traduccion para el ID: ${id}`);
    }
    
    // Obtener el primer documento (el id deberia ser unico)
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    // Validar que los campos requeridos existan
    if (!data.word || !data.audio) {
      throw new Error(`La traduccion para ID ${id} tiene datos incompletos`);
    }
    
    console.log(`[Firebase] Traduccion obtenida - ID: ${id}, Palabra: ${data.word}`);
    
    return {
      word: data.word,
      audio: data.audio
    };
    
  } catch (error) {
    console.error('[Firebase] Error en getTranslationById:', error);
    
    // Re-lanzar el error para que el componente que llama pueda manejarlo
    throw new Error(`No se pudo obtener la traduccion para el gesto ${id}`);
  }
};