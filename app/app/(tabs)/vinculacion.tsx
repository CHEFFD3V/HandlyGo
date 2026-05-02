import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAssets } from '../../hooks/useAssets';

// ── Estado simulado — reemplazar con BLE real en sprint futuro ──
const SIMULATED_BATTERY  = 20;
const IS_CONNECTED_MOCK  = true; // ← cambia a false para ver estado desconectado

export default function VinculacionScreen() {
  const { colors } = useTheme();
  const assets     = useAssets();

  const [isConnected] = useState(IS_CONNECTED_MOCK);
  const [battery]     = useState(SIMULATED_BATTERY);

  const batteryColor = battery > 30 ? STATIC.green : STATIC.red;

  return (
    <View style={[s.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={s.container}
        showsVerticalScrollIndicator={false}
      >

        {/* LOGO — viene del sistema de assets por tema */}
        <View style={s.logoArea}>
          <Image
            source={assets.logoPrincipal}
            style={s.logo}
            contentFit="contain"
          />
        </View>

        {/* ARO CON IMAGEN DEL GUANTE */}
        <View style={s.ringWrapper}>
          {/* Glow exterior */}
          <View style={[
            s.glow,
            isConnected ? s.glowGreen : s.glowRed,
          ]} />

          {/* Aro interior */}
          <View style={[
            s.ring,
            { backgroundColor: colors.card.background },
            isConnected ? s.ringGreen : s.ringRed,
          ]}>

            <Image
              source={assets.manoConexion}
              style={s.gloveImage}
              contentFit="contain"
            />
          </View>
        </View>

        {/* LABEL */}
        <Text style={[s.connLabel, { color: colors.text.secondary }]}>
          Conexión Bluetooth con el Guante
        </Text>

        {/* BOTÓN ESTADO */}
        <View style={[
          s.statusBtn,
          isConnected ? s.statusBtnGreen : s.statusBtnRed,
        ]}>
          <Text style={s.statusBtnText}>
            {isConnected ? 'Guante\nConectado' : 'Guante\nDesconectado'}
          </Text>
        </View>

        {/* BOTÓN BUSCAR GUANTE */}
        <TouchableOpacity
          style={[s.searchBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.75}
          // onPress={() => { /* lógica BLE futura aquí */ }}
        >
          <Text style={[s.searchBtnText, { color: colors.text.inverse }]}>
            Buscar Guante
          </Text>
        </TouchableOpacity>

        {/* BATERÍA */}
        <View style={s.batteryWrapper}>
          <View style={[s.batteryIcon, { borderColor: colors.text.primary }]}>
            <View style={[s.batteryNub, { backgroundColor: colors.text.primary }]} />
            <View style={[
              s.batteryFill,
              {
                height: `${battery}%`,
                backgroundColor: batteryColor,
              },
            ]} />
          </View>
          <Text style={[s.batteryLabel, { color: colors.text.secondary }]}>
            BATERIA 1{'\n'}({battery}%)
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────
// COLORES ESTÁTICOS — solo los que no dependen del tema
// (verde/rojo del estado de conexión son siempre iguales)
// ─────────────────────────────────────────
const STATIC = {
  green:       '#22C55E',
  greenLight:  'rgba(34, 197, 94, 0.25)',
  greenBorder: 'rgba(34, 197, 94, 0.5)',
  red:         '#EF4444',
  redLight:    'rgba(239, 68, 68, 0.25)',
  redBorder:   'rgba(239, 68, 68, 0.5)',
  white:       '#FFFFFF',
};

const s = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 24,
  },

  // Logo
  logoArea: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: -50,
  },

  // Aro
  ringWrapper: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  glow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  glowGreen: {
    backgroundColor: STATIC.greenLight,
    shadowColor: STATIC.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 32,
  },
  glowRed: {
    backgroundColor: STATIC.redLight,
    shadowColor: STATIC.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 12,
  },
  ring: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringGreen: { borderColor: STATIC.greenBorder },
  ringRed:   { borderColor: STATIC.redBorder   },

  gloveImage: {
    width: 150,
    height: 180,
  },

  // Label
  connLabel: {
    fontSize: 19,
    marginBottom: 12,
    textAlign: 'center',
  },

  // Botón estado — color siempre fijo (verde/rojo semántico)
  statusBtn: {
    width: 200,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBtnGreen: { backgroundColor: STATIC.green   },
  statusBtnRed:   { backgroundColor: '#B91C1C'      },
  statusBtnText: {
    color: STATIC.white,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Botón buscar — usa colors.primary del tema
  searchBtn: {
    width: 200,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  searchBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Batería
  batteryWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  batteryIcon: {
    width: 50,
    height: 90,
    borderWidth: 2.8,
    borderRadius: 5,
    padding: 3,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  batteryNub: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    width: 16,
    height: 6,
    borderRadius: 2,
  },
  batteryFill: {
    width: '100%',
    borderRadius: 3,
  },
  batteryLabel: {
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 14,
  },
});