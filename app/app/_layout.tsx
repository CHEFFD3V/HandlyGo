import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useThemeStore } from '../store/useThemeStore';
import { useFonts } from 'expo-font';        
import * as SplashScreen from 'expo-splash-screen'; 
import { useEffect } from 'react';           
import { registerSimulateGlobal } from '@/utils/simulateConsole';

registerSimulateGlobal();

SplashScreen.preventAutoHideAsync();         

export default function RootLayout() {
  const { colors } = useTheme();
  const isHydrated = useThemeStore.persist.hasHydrated();

  const [fontsLoaded] = useFonts({
    'Poppins-Regular':       require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium':        require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold':      require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold':          require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold':     require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Black':         require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Light':         require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Italic':        require('../assets/fonts/Poppins-Italic.ttf'),
    'Poppins-BoldItalic':    require('../assets/fonts/Poppins-BoldItalic.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!isHydrated || !fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <Stack
  screenOptions={{
    headerShown: false,
    animation: 'slide_from_right',
    animationDuration: 200,

    contentStyle: {
      backgroundColor: colors.background,
    },
  }}
/>
    </SafeAreaProvider>
  );
}