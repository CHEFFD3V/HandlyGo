import { View, Text, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { Sign } from '../../constants/learnData';

type Props = {
  sign: Sign;
};

export function SignCard({ sign }: Props) {
  const { colors } = useTheme();
  const videoRef = useRef(null);

  return (
    <View style={[s.card, { backgroundColor: colors.card.background }]}>

      {/* ── Media: video si hay URI, placeholder si no ── */}
      <View style={s.mediaWrapper}>
        {sign.mediaUri ? (
          <Video
            ref={videoRef}
            source={{ uri: sign.mediaUri }}
            style={s.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping={false}
            useNativeControls={false}
          />
        ) : (
          // Placeholder hasta que llegue el video de Firebase
          <View style={[s.placeholder, { backgroundColor: colors.background }]}>
            <Text style={s.placeholderEmoji}>🤚</Text>
            <Text style={[s.placeholderTxt, { color: colors.text.secondary }]}>
              Video próximamente
            </Text>
          </View>
        )}
      </View>

      {/* ── Texto de la seña ── */}
      <Text style={[s.label, { color: colors.text.primary }]}>
        {sign.label}
      </Text>
      <Text style={[s.description, { color: colors.text.secondary }]}>
        {sign.description}
      </Text>

    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  mediaWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    gap: 8,
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  placeholderTxt: {
    fontSize: 14,
    fontWeight: '500',
  },
  label: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
});