// app/services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Para la base de datos
import { getAuth } from "firebase/auth";           // Para el login de usuarios

// Configuración oficial de HandlyGo
const firebaseConfig = {
  apiKey: "AIzaSyDAqFamm-04e7R-mJQMUMkX1h6PcdmEYxw",
  authDomain: "handlygo.firebaseapp.com",
  projectId: "handlygo",
  storageBucket: "handlygo.firebasestorage.app",
  messagingSenderId: "121730419946",
  appId: "1:121730419946:web:9dc9dfad0c6fdf9cc39b93",
  measurementId: "G-KVKL0D1KD6"
};

// Inicializar la App de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar y exportar los servicios para que el equipo los use
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;