import { View, Text } from "react-native";
import { useEffect } from 'react';
import { getDictionaryByCategory } from '../../services/dictionaryService';

export default function Home() {

  /* Lógica de prueba
  useEffect(() => {
    const testFetch = async () => {
      const items = await getDictionaryByCategory("Abecedario");
      console.log("REVISIÓN BACKEND - Elementos encontrados:", items);
    };

    testFetch();
  }, []); */

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Pantalla Principal (Tabs)</Text>
    </View>
  );
}