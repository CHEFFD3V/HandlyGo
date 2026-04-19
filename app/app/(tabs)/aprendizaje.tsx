import { View, Text, ScrollView,
  StyleSheet, Image, TouchableOpacity, } from 'react-native';

export default function AprendizajeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Estás en la página de aprendizaje
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
});