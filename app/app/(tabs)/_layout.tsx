import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#2200CC';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const getColor = (route: string) => {
    return pathname === route ? '#fff' : '#ccc';
  };

  return (
    <View style={{ flex: 1 }}>
      
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="aprendizaje" />
        <Tabs.Screen name="vinculacion" />
        <Tabs.Screen name="configuracion" />
      </Tabs>

      <View style={s.navbar}>

        {/* Modo oscuro */}
        <TouchableOpacity style={s.navBtn}>
          <Ionicons name="moon-outline" size={22} color="#ccc" />
        </TouchableOpacity>

        {/* Aprendizaje */}
        <TouchableOpacity
          style={s.navBtn}
          onPress={() => router.push('/aprendizaje')}
        >
          <Ionicons
            name="book-outline"
            size={22}
            color={getColor('/aprendizaje')}
          />
        </TouchableOpacity>

        {/* Home */}
        <TouchableOpacity
          style={s.navBtn}
          onPress={() => router.push('/')}
        >
          <Ionicons
            name="home"
            size={26}
            color={getColor('/')}
          />
        </TouchableOpacity>

        {/* Vinculación */}
        <TouchableOpacity
          style={s.navBtn}
          onPress={() => router.push('/vinculacion')}
        >
          <Ionicons
            name="link-outline"
            size={22}
            color={getColor('/vinculacion')}
          />
        </TouchableOpacity>

        {/* Configuración */}
        <TouchableOpacity
          style={s.navBtn}
          onPress={() => router.push('/configuracion')}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={getColor('/configuracion')}
          />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const s = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: BLUE,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  navBtn: {
    padding: 8,
    borderRadius: 12,
  },
});