import { Platform, Pressable, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

type AppPressableProps = PressableProps & {
  pressedOpacity?: number;
  pressedScale?: number;
  disableFeedback?: boolean;
  enableHaptics?: boolean;
  style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
};

export function AppPressable({
  pressedOpacity = 0.6,
  pressedScale = 0.97,
  disableFeedback = false,
  enableHaptics = true,
  disabled,
  onPressIn,
  onPressOut,
  style,
  ...props
}: AppPressableProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPressIn={(event) => {
        if (enableHaptics && !disabled && Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
        }
        onPressIn?.(event);
      }}
      onPressOut={onPressOut}
      style={({ pressed }) => {
        const baseStyle = typeof style === 'function' ? style({ pressed }) : style;

        if (disableFeedback || disabled || !pressed) {
          return baseStyle;
        }

        return [
          baseStyle,
          {
            opacity: pressedOpacity,
            transform: [{ scale: pressedScale }],
          },
        ];
      }}
    />
  );
}
