import { View, Text, ScrollView,
  StyleSheet, Image, TouchableOpacity, } from 'react-native';

export default function VinculacionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Estás en la página de vinculacion
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