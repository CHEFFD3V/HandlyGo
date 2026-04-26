import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks/useTheme';

const LIGHT_MOCKUP = require('../../assets/images/ui_modo_claro/images/21_configuracion_calibracion.svg');
const DARK_MOCKUP = require('../../assets/images/ui_modo_oscuro/images/21_configuracion_calibracion.svg');

const MOCKUP_RATIO = 310.5 / 672;

function FingerHotspot({
  onPress,
  style,
}: {
  onPress: () => void;
  style: object;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.fingerHotspot, style]}
    />
  );
}

export default function ConfiguracionScreen() {
  const { theme } = useTheme();
  const [selectedFinger, setSelectedFinger] = useState(3);

  const dark = theme === 'dark';
  const mockupSource = useMemo(
    () => (dark ? DARK_MOCKUP : LIGHT_MOCKUP),
    [dark]
  );

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: dark ? '#132745' : '#FFFFFF' },
      ]}>
      <View style={styles.mockupFrame}>
        <Image
          source={mockupSource}
          style={StyleSheet.absoluteFill}
          contentFit="fill"
        />

        <View style={styles.controlsOverlay}>
          <FingerHotspot
            style={styles.finger1}
            onPress={() => setSelectedFinger(1)}
          />
          <FingerHotspot
            style={styles.finger2}
            onPress={() => setSelectedFinger(2)}
          />
          <FingerHotspot
            style={styles.finger3}
            onPress={() => setSelectedFinger(3)}
          />
          <FingerHotspot
            style={styles.finger4}
            onPress={() => setSelectedFinger(4)}
          />
          <FingerHotspot
            style={styles.finger5}
            onPress={() => setSelectedFinger(5)}
          />

          <Pressable
            onPress={() => console.log('Calibrando dedo', selectedFinger)}
            style={styles.calibrateHotspot}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
  mockupFrame: {
    width: '100%',
    aspectRatio: MOCKUP_RATIO,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  fingerHotspot: {
    position: 'absolute',
    width: 116,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'transparent',
  },
  finger1: {
    left: 22,
    bottom: 247,
  },
  finger2: {
    left: 22,
    bottom: 193,
  },
  finger3: {
    right: 22,
    bottom: 247,
  },
  finger4: {
    right: 22,
    bottom: 193,
  },
  finger5: {
    left: '50%',
    bottom: 139,
    marginLeft: -58,
  },
  calibrateHotspot: {
    position: 'absolute',
    left: '50%',
    bottom: 56,
    width: 196,
    height: 72,
    marginLeft: -98,
    borderRadius: 36,
    backgroundColor: 'transparent',
  },
});