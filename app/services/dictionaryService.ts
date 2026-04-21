// app/services/dictionaryService.ts
import { db } from './firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

export const getDictionaryByCategory = async (categoryName: string) => {
  try {
    const dictionaryRef = collection(db, "msd_dictionary");
    
    const q = query(dictionaryRef, where("category", "==", categoryName));
    
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`[Firebase] Datos de ${categoryName} cargados:`, data.length);
    return data;
  } catch (error) {
    console.error("Error al obtener el diccionario: ", error);
    return [];
  }
};