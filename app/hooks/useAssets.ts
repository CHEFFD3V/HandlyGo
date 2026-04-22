// hooks/useAssets.ts

import { useTheme } from './useTheme';
import { themeAssets } from '../theme/assets';

export const useAssets = () => {
  const { theme } = useTheme();

  return themeAssets[theme];
};