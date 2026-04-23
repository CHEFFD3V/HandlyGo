import { useThemeStore } from '../store/useThemeStore';
import { lightTheme, darkTheme } from '../theme/colors';

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return {
    theme,
    colors,
    toggleTheme,
  };
};