import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';


export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, toggleTheme } = useTheme();

  const getColor = (route: string) => {
    return pathname === route
      ? colors.tabBar.active
      : colors.tabBar.inactive;
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="aprendizaje" />
        <Tabs.Screen name="vinculacion" />
        <Tabs.Screen name="configuracion" />
        <Tabs.Screen name="learn"options={{href: null,}}/>

      </Tabs>


      <View style={[s.navbar, { backgroundColor: colors.tabBar.background }]}>
        

        <TouchableOpacity style={s.navBtn} onPress={toggleTheme}>
          <Ionicons
            name="moon-outline"
            size={22}
            color={colors.tabBar.inactive}
          />
        </TouchableOpacity>


        <TouchableOpacity
          style={s.navBtn}
          onPress={() => router.push('../aprendizaje')}
        >
          <Ionicons
            name="book-outline"
            size={22}
            color={getColor('/aprendizaje')}
          />
        </TouchableOpacity>


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


        <TouchableOpacity
          style={s.navBtn}
          onPress={() => router.push('../vinculacion')}
        >
          <Ionicons
            name="link-outline"
            size={22}
            color={getColor('/vinculacion')}
          />
        </TouchableOpacity>


        <TouchableOpacity
          style={s.navBtn}
          onPress={() => router.push('../configuracion')}
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
  container: {
    flex: 1,
  },

  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
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