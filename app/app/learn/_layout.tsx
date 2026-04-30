import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';

export default function LearnLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}