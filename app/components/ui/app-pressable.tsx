import {
  Animated,
  Easing,
  Platform,
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useEffect, useMemo, useRef } from 'react';
import * as Haptics from 'expo-haptics';

type AppPressableProps = PressableProps & {
  pressedOpacity?: number;
  pressedScale?: number;
  pressTranslateY?: number;
  disableFeedback?: boolean;
  enableHaptics?: boolean;
  style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppPressable({
  pressedOpacity = 0.88,
  pressedScale = 0.955,
  pressTranslateY = 1.5,
  disableFeedback = false,
  enableHaptics = true,
  disabled,
  onPressIn,
  onPressOut,
  style,
  ...props
}: AppPressableProps) {
  const pressProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (disabled || disableFeedback) {
      pressProgress.stopAnimation();
      pressProgress.setValue(0);
    }
  }, [disableFeedback, disabled, pressProgress]);

  const animatedStyle = useMemo(
    () => ({
      opacity: pressProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, pressedOpacity],
      }),
      transform: [
        {
          scale: pressProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, pressedScale],
          }),
        },
        {
          translateY: pressProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, pressTranslateY],
          }),
        },
      ],
    }),
    [pressProgress, pressedOpacity, pressedScale, pressTranslateY]
  );

  const animateTo = (toValue: 0 | 1) => {
    pressProgress.stopAnimation();

    if (toValue === 1) {
      Animated.timing(pressProgress, {
        toValue,
        duration: 85,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.spring(pressProgress, {
      toValue,
      speed: 20,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn: NonNullable<PressableProps['onPressIn']> = (event) => {
    if (!disableFeedback && !disabled) {
      animateTo(1);
    }

    if (enableHaptics && !disabled && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    }

    onPressIn?.(event);
  };

  const handlePressOut: NonNullable<PressableProps['onPressOut']> = (event) => {
    if (!disableFeedback && !disabled) {
      animateTo(0);
    }

    onPressOut?.(event);
  };

  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={(state) => {
        const baseStyle = typeof style === 'function' ? style(state) : style;
        return [baseStyle, !disableFeedback && !disabled ? animatedStyle : null];
      }}
    />
  );
}
