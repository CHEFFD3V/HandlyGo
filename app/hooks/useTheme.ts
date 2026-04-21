import { useThemeStore } from "../app/store/useThemeStore";
import { lightTheme, darkTheme } from "../app/theme/colors";

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();

  const colors = theme === "light" ? lightTheme : darkTheme;

  return {
    theme,
    colors,
    toggleTheme,
  };
};