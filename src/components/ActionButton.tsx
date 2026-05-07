import React from 'react';
import { Pressable, View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

type Props = {
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | ((args: { pressed: boolean }) => StyleProp<ViewStyle>);
  disabled?: boolean;
  accessibilityLabel?: string;
};

// A minimal, consistent Pressable-based button with a subtle press feedback.
// Feedback: slight opacity change and scale, no heavy animations.
export const ActionButton: React.FC<Props> = ({ onPress, children, style, disabled, accessibilityLabel }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        // Base visual; do not hard-code colors to keep this generic
        styles.base,
        // Allow consumer to override via style prop
        typeof style === 'function' ? (style as any)({ pressed }) : (style as any),
        // Pressed feedback
        pressed && { opacity: 0.6, transform: [{ scale: 0.97 }] },
      ]}
    >
      <View style={styles.content}>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // Leave colors to the theme or parent to decide
    backgroundColor: '#0000', // transparent by default; parent should style or wrap in a pill container
  },
  content: {
    // Text/icon alignment inside the button can be customized by consumers
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
});

export default ActionButton;
