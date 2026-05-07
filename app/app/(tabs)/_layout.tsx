import { View, StyleSheet } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { AppPressable } from '../../components/ui/app-pressable';


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
          animation: 'shift',
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="aprendizaje" />
        <Tabs.Screen name="vinculacion" />
        <Tabs.Screen name="configuracion" />
        <Tabs.Screen name="learn"options={{href: null,}}/>

      </Tabs>


      <View style={[s.navbar, { backgroundColor: colors.tabBar.background }]}>
        

        <AppPressable style={s.navBtn} onPress={toggleTheme}>
          <Ionicons
            name="moon-outline"
            size={22}
            color={colors.tabBar.inactive}
          />
        </AppPressable>


        <AppPressable
          style={s.navBtn}
          onPress={() => router.replace('/aprendizaje')}
        >
          <Ionicons
            name="book-outline"
            size={22}
            color={getColor('/aprendizaje')}
          />
        </AppPressable>


        <AppPressable
          style={s.navBtn}
          onPress={() => router.replace('/')}
        >
          <Ionicons
            name="home"
            size={26}
            color={getColor('/')}
          />
        </AppPressable>


        <AppPressable
          style={s.navBtn}
          onPress={() => router.replace('/vinculacion')}
        >
          <Ionicons
            name="link-outline"
            size={22}
            color={getColor('/vinculacion')}
          />
        </AppPressable>


        <AppPressable
          style={s.navBtn}
          onPress={() => router.replace('/configuracion')}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={getColor('/configuracion')}
          />
        </AppPressable>

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
