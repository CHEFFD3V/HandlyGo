import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useThemeStore } from '../store/useThemeStore';



export default function RootLayout() {
  const { colors } = useTheme();

    const isHydrated = useThemeStore.persist.hasHydrated();

  if (!isHydrated) return null;


  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </SafeAreaProvider>
  );
}