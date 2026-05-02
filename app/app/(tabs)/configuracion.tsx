import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks/useTheme';

// ─── Assets ──────────────────────────────────────────────────────────────────
const LIGHT_MOCKUP = require('../../assets/images/ui_modo_claro/images/21_configuracion_calibracion.svg');
const DARK_MOCKUP  = require('../../assets/images/ui_modo_oscuro/images/21_configuracion_calibracion.svg');

// ─── Constantes ───────────────────────────────────────────────────────────────
const DEDOS = ['Dedo 1', 'Dedo 2', 'Dedo 3', 'Dedo 4', 'Dedo 5'] as const;
type DedoKey = typeof DEDOS[number];

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface DedoConfig {
  rawMin: number;
  rawMax: number;
  umbral: number;
  sensibilidad: number;
}

type GloveConfig = Record<DedoKey, DedoConfig>;

const DEFAULT_CONFIG: GloveConfig = {
  'Dedo 1': { rawMin: 300, rawMax: 800, umbral: 50, sensibilidad: 100 },
  'Dedo 2': { rawMin: 300, rawMax: 800, umbral: 50, sensibilidad: 100 },
  'Dedo 3': { rawMin: 300, rawMax: 800, umbral: 50, sensibilidad: 100 },
  'Dedo 4': { rawMin: 300, rawMax: 800, umbral: 50, sensibilidad: 100 },
  'Dedo 5': { rawMin: 300, rawMax: 800, umbral: 50, sensibilidad: 100 },
};

type CalStep     = 'idle' | 'open' | 'close' | 'review' | 'done';
type ActiveModal = 'none' | 'calibration' | 'settings';

type GlobalColors = ReturnType<typeof useTheme>['colors'];

function withAlpha(hex: string, alpha: number): string {
  const safeAlpha = Math.max(0, Math.min(1, alpha));
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
}

// ─── Paleta derivada del tema global ─────────────────────────────────────────
function buildColors(colors: GlobalColors, dark: boolean) {
  return {
    bg:              colors.background,
    surface:         colors.card.background,
    card:            colors.card.background,
    modalSurface:    colors.card.background,
    modalBorder:     withAlpha(colors.card.border, dark ? 0.74 : 0.3),
    border:          withAlpha(colors.card.border, dark ? 0.76 : 0.24),
    track:           withAlpha(colors.text.secondary, dark ? 0.36 : 0.18),
    text:            colors.text.primary,
    textMuted:       colors.text.secondary,
    textInverse:     colors.text.inverse,
    accent:          colors.wave.primary,
    accentLight:     withAlpha(colors.wave.primary, dark ? 0.26 : 0.14),
    secondary:       colors.wave.secondary,
    secondaryLight:  withAlpha(colors.wave.secondary, dark ? 0.24 : 0.15),
    secondaryBorder: withAlpha(colors.wave.secondary, dark ? 0.68 : 0.36),
    error:           colors.accent,
    inputBg:         withAlpha(colors.card.background, dark ? 0.84 : 0.88),
    inputBorder:     withAlpha(colors.primary, dark ? 0.66 : 0.3),
  } as const;
}

type ColorMap = ReturnType<typeof buildColors>;

// ─── Utilidades ───────────────────────────────────────────────────────────────
function normalizar(raw: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, Math.round(((raw - min) / (max - min)) * 100)));
}

function aplicarSensibilidad(pct: number, sensibilidad: number): number {
  return Math.min(100, Math.max(0, Math.round(pct * (sensibilidad / 100))));
}

function validarRango(min: number, max: number): string | null {
  if (isNaN(min) || isNaN(max)) return 'Los valores deben ser numeros validos';
  if (max <= min)               return 'RAW max debe ser mayor que RAW min';
  if (max - min < 50)           return 'El rango minimo debe ser de 50 unidades';
  if (min < 0 || max > 4095)   return 'Valores fuera del rango ADC (0-4095)';
  return null;
}

function validarUmbral(v: number): string | null {
  if (isNaN(v) || v < 0 || v > 100) return 'El umbral debe estar entre 0 y 100';
  return null;
}

function validarSensibilidad(v: number): string | null {
  if (isNaN(v) || v < 50 || v > 200) return 'La sensibilidad debe estar entre 50 y 200';
  return null;
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ConfiguracionScreen() {
  const { theme, colors } = useTheme();
  const dark = theme === 'dark';

  // ── Animated value para controlar la opacidad del SVG en sync con el tema ───
  // Se inicializa con el valor correcto para evitar cualquier flash inicial.
  const darkOpacity = useRef(new Animated.Value(dark ? 1 : 0)).current;

  useEffect(() => {
    // duration: 0 → el cambio es instantáneo y ocurre en el mismo frame
    // que el cambio de backgroundColor del tema, eliminando el desface visual.
    // Si el sistema de temas usa una transición animada, ajusta duration para que coincida.
    Animated.timing(darkOpacity, {
      toValue: dark ? 1 : 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, [dark]);

  const C: ColorMap = useMemo(() => buildColors(colors, dark), [colors, dark]);

  const [selectedFinger, setSelectedFinger] = useState<DedoKey>('Dedo 1');
  const [activeModal, setActiveModal]       = useState<ActiveModal>('none');
  const [calStep, setCalStep]               = useState<CalStep>('idle');

  const [config, setConfig] = useState<GloveConfig>(DEFAULT_CONFIG);

  const [rawActual, setRawActual] = useState<Record<DedoKey, number>>({
    'Dedo 1': 550, 'Dedo 2': 550, 'Dedo 3': 550, 'Dedo 4': 550, 'Dedo 5': 550,
  });

  const [snapOpen,  setSnapOpen]  = useState<Record<DedoKey, number> | null>(null);
  const [snapClose, setSnapClose] = useState<Record<DedoKey, number> | null>(null);

  const [editConfig,   setEditConfig]   = useState<GloveConfig>(DEFAULT_CONFIG);
  const [editSettings, setEditSettings] = useState<GloveConfig>(DEFAULT_CONFIG);
  const [captureFlash, setCaptureFlash] = useState<'open' | 'close' | null>(null);

  // ── Simulación BLE (reemplazar con stream real del guante) ───────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setRawActual(prev => {
        const next = { ...prev };
        for (const dedo of DEDOS) {
          const delta = (Math.random() - 0.5) * 30;
          next[dedo] = Math.min(4095, Math.max(0, Math.round(prev[dedo] + delta)));
        }
        return next;
      });
    }, 600);
    return () => clearInterval(id);
  }, []);

  // ── Calibración ──────────────────────────────────────────────────────────────
  function iniciarCalibracion() {
    setSnapOpen(null);
    setSnapClose(null);
    setCalStep('open');
    setActiveModal('calibration');
  }

  function capturarManoAbierta() {
    setSnapOpen({ ...rawActual });
    setCaptureFlash('open');
    setTimeout(() => { setCaptureFlash(null); setCalStep('close'); }, 700);
  }

  function capturarManoCerrada() {
    const snap = { ...rawActual };
    setSnapClose(snap);
    const nueva = { ...config };
    for (const dedo of DEDOS) {
      const openRaw  = snapOpen?.[dedo] ?? snap[dedo];
      const closeRaw = snap[dedo];
      const rawMin   = Math.min(openRaw, closeRaw);
      const rawMax   = Math.max(openRaw, closeRaw);
      const safeDiff = rawMax - rawMin;
      nueva[dedo] = {
        ...nueva[dedo],
        rawMin: safeDiff >= 50 ? rawMin : Math.max(0,    openRaw - 100),
        rawMax: safeDiff >= 50 ? rawMax : Math.min(4095, openRaw + 100),
      };
    }
    setEditConfig(nueva);
    setCaptureFlash('close');
    setTimeout(() => { setCaptureFlash(null); setCalStep('review'); }, 700);
  }

  function guardarCalibracion() {
    for (const dedo of DEDOS) {
      const cfg = editConfig[dedo];
      const e1 = validarRango(cfg.rawMin, cfg.rawMax);
      if (e1) { Alert.alert('Error en ' + dedo, e1); return; }
      const e2 = validarUmbral(cfg.umbral);
      if (e2) { Alert.alert('Error en ' + dedo, e2); return; }
      const e3 = validarSensibilidad(cfg.sensibilidad);
      if (e3) { Alert.alert('Error en ' + dedo, e3); return; }
    }
    setConfig(editConfig);
    setCalStep('done');
  }

  function cerrarModal() {
    setActiveModal('none');
    setCalStep('idle');
  }

  // ── Ajustes avanzados ────────────────────────────────────────────────────────
  function abrirSettings() {
    setEditSettings({ ...config });
    setActiveModal('settings');
  }

  function guardarSettings() {
    for (const dedo of DEDOS) {
      const cfg = editSettings[dedo];
      const e1 = validarUmbral(cfg.umbral);
      if (e1) { Alert.alert('Error en ' + dedo, e1); return; }
      const e2 = validarSensibilidad(cfg.sensibilidad);
      if (e2) { Alert.alert('Error en ' + dedo, e2); return; }
    }
    setConfig(editSettings);
    cerrarModal();
  }

  function updateEditField(
    dedo: DedoKey,
    field: keyof DedoConfig,
    value: string,
    target: 'edit' | 'settings' = 'edit',
  ) {
    const num = Number(value);
    if (isNaN(num)) return;
    if (target === 'edit') {
      setEditConfig(prev => ({ ...prev, [dedo]: { ...prev[dedo], [field]: num } }));
    } else {
      setEditSettings(prev => ({ ...prev, [dedo]: { ...prev[dedo], [field]: num } }));
    }
  }

  // ── Verde = relajado · Rojo = flexionado (sobre umbral) ──────────────────────
  function getFingerUiState(dedo: DedoKey) {
    const pct = normalizar(rawActual[dedo], config[dedo].rawMin, config[dedo].rawMax);
    return {
      selected: selectedFinger === dedo,
      active:   pct >= config[dedo].umbral,
    };
  }

  // ─── LivePreview ──────────────────────────────────────────────────────────────
  function LivePreview() {
    return (
      <View style={[styles.livePreview, { backgroundColor: C.modalSurface, borderColor: C.modalBorder }]}>
        <Text style={[styles.livePrevTitle, { color: C.textMuted }]}>
          Valores en tiempo real
        </Text>
        <View style={styles.liveRow}>
          {DEDOS.map(d => {
            const pct     = normalizar(rawActual[d], config[d].rawMin, config[d].rawMax);
            const flexing = pct > 50;
            return (
              <View key={d} style={styles.liveCell}>
                <Text style={[styles.liveCellLabel, { color: C.textMuted }]}>
                  {d.replace('Dedo ', 'D')}
                </Text>
                <Text style={[styles.liveCellRaw, { color: C.text }]}>{rawActual[d]}</Text>
                <View style={[styles.liveCellBar, { backgroundColor: C.track }]}>
                  <View
                    style={[
                      styles.liveCellBarFill,
                      { height: `${pct}%` as any, backgroundColor: flexing ? C.secondary : C.accent },
                    ]}
                  />
                </View>
                <Text style={[styles.liveCellPct, { color: flexing ? C.secondary : C.accent }]}>
                  {pct}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  // ── Modal de calibración ─────────────────────────────────────────────────────
  function CalibrationModalContent() {
    const flashBg =
      captureFlash === 'open'  ? C.secondaryLight :
      captureFlash === 'close' ? C.accentLight    : 'transparent';

    if (calStep === 'open') {
      return (
        <View style={{ backgroundColor: flashBg, borderRadius: 16, padding: 4 }}>
          <StepHeader step={1} total={3} title="Mano abierta" color={C.secondary} C={C} />
          <View style={[styles.instructionBox, {
            backgroundColor: C.secondaryLight,
            borderColor: C.secondaryBorder,
          }]}>
            <Text style={[styles.instructionIcon, { color: C.secondary }]}>{'~'}</Text>
            <Text style={[styles.instructionText, { color: C.secondary }]}>
              Extiende todos los dedos completamente relajados.{'\n'}
              Esto establece el valor{' '}
              <Text style={{ fontWeight: '800' }}>minimo (0% flexion)</Text> de cada sensor.
            </Text>
          </View>
          <LivePreview />
          <ActionButton label="Capturar mano abierta" color={C.secondary} onPress={capturarManoAbierta} C={C} />
        </View>
      );
    }

    if (calStep === 'close') {
      return (
        <View style={{ backgroundColor: flashBg, borderRadius: 16, padding: 4 }}>
          <StepHeader step={2} total={3} title="Mano cerrada" color={C.secondary} C={C} />
          <View style={[styles.instructionBox, {
            backgroundColor: C.secondaryLight,
            borderColor: C.secondaryBorder,
          }]}>
            <Text style={[styles.instructionIcon, { color: C.secondary }]}>{'>'}</Text>
            <Text style={[styles.instructionText, { color: C.secondary }]}>
              Cierra la mano formando un puño apretado.{'\n'}
              Esto establece el valor{' '}
              <Text style={{ fontWeight: '800' }}>maximo (100% flexion)</Text> de cada sensor.
            </Text>
          </View>
          <LivePreview />
          {snapOpen && (
            <View style={[styles.snapRow, { backgroundColor: C.modalSurface, borderColor: C.modalBorder }]}>
              <Text style={[styles.snapRowTitle, { color: C.textMuted }]}>
                Valores capturados (mano abierta)
              </Text>
              <View style={styles.snapCells}>
                {DEDOS.map(d => (
                  <View key={d} style={styles.snapCell}>
                    <Text style={[styles.snapLabel, { color: C.textMuted }]}>
                      {d.replace('Dedo ', 'D')}
                    </Text>
                    <Text style={[styles.snapValue, { color: C.accent }]}>{snapOpen[d]}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <ActionButton label="Capturar mano cerrada" color={C.secondary} onPress={capturarManoCerrada} C={C} />
        </View>
      );
    }

    if (calStep === 'review') {
      return (
        <>
          <StepHeader step={3} total={3} title="Revisar rangos" color={C.accent} C={C} />
          <Text style={[styles.stepDesc, { color: C.textMuted }]}>
            Verifica los rangos capturados. Puedes ajustar manualmente si fuese necesario.
          </Text>

          {DEDOS.map(dedo => {
            const cfg          = editConfig[dedo];
            const pctRaw       = normalizar(rawActual[dedo], cfg.rawMin, cfg.rawMax);
            const pct          = aplicarSensibilidad(pctRaw, cfg.sensibilidad);
            const umbralActivo = pct >= cfg.umbral;
            const errRango     = validarRango(cfg.rawMin, cfg.rawMax);

            return (
              <View
                key={dedo}
                style={[
                  styles.dedoCard,
                  { backgroundColor: C.modalSurface, borderColor: errRango ? C.error : C.modalBorder },
                ]}
              >
                <View style={styles.dedoCardHeader}>
                  <Text style={[styles.dedoCardTitle, { color: C.text }]}>{dedo}</Text>
                  <View style={[
                    styles.dedoStatusBadge,
                    { backgroundColor: umbralActivo ? C.accentLight : C.modalBorder },
                  ]}>
                    <Text style={[
                      styles.dedoStatusText,
                      { color: umbralActivo ? C.accent : C.textMuted },
                    ]}>
                      {umbralActivo ? 'ACTIVO' : 'INACTIVO'}
                    </Text>
                  </View>
                </View>

                <View style={styles.dedoRow}>
                  <FieldInput
                    label="RAW min"
                    value={String(cfg.rawMin)}
                    onChangeText={v => updateEditField(dedo, 'rawMin', v, 'edit')}
                    hasError={!!errRango}
                    C={C}
                  />
                  <FieldInput
                    label="RAW max"
                    value={String(cfg.rawMax)}
                    onChangeText={v => updateEditField(dedo, 'rawMax', v, 'edit')}
                    hasError={!!errRango}
                    C={C}
                  />
                  <FieldInput
                    label="Umbral %"
                    value={String(cfg.umbral)}
                    onChangeText={v => updateEditField(dedo, 'umbral', v, 'edit')}
                    hasError={!!validarUmbral(cfg.umbral)}
                    C={C}
                  />
                  <FieldInput
                    label="Sens. %"
                    value={String(cfg.sensibilidad)}
                    onChangeText={v => updateEditField(dedo, 'sensibilidad', v, 'edit')}
                    hasError={!!validarSensibilidad(cfg.sensibilidad)}
                    C={C}
                  />
                </View>

                {errRango && (
                  <Text style={[styles.fieldError, { color: C.error }]}>{errRango}</Text>
                )}

                <View style={[styles.previewBar, { backgroundColor: C.track }]}>
                  <View
                    style={[styles.previewBarFill, {
                      width: `${pct}%` as any,
                      backgroundColor: C.accent,
                    }]}
                  />
                  <View
                    style={[styles.previewThreshold, {
                      left: `${cfg.umbral}%` as any,
                      backgroundColor: C.secondary,
                    }]}
                  />
                </View>
                <View style={styles.previewMeta}>
                  <Text style={[styles.previewMetaText, { color: C.textMuted }]}>
                    RAW actual: {rawActual[dedo]}  {'->'}  {pct}%
                  </Text>
                  <Text style={[styles.previewMetaText, { color: C.secondary }]}>
                    Umbral: {cfg.umbral}%
                  </Text>
                </View>
              </View>
            );
          })}

          <ActionButton label="Guardar calibracion" color={C.accent} onPress={guardarCalibracion} C={C} />
        </>
      );
    }

    if (calStep === 'done') {
      return (
        <View style={styles.doneContainer}>
          <View style={[styles.doneIconCircle, { backgroundColor: C.accentLight }]}>
            <Text style={[styles.doneIconText, { color: C.accent }]}>OK</Text>
          </View>
          <Text style={[styles.doneTitle, { color: C.text }]}>Calibracion guardada</Text>
          <Text style={[styles.doneSub, { color: C.textMuted }]}>
            El guante HandlyGo esta listo con los nuevos rangos de calibracion.
          </Text>
          <View style={[styles.doneSummary, { backgroundColor: C.modalSurface, borderColor: C.modalBorder }]}>
            {DEDOS.map(d => (
              <View key={d} style={[styles.doneSummaryRow, { borderBottomColor: C.modalBorder }]}>
                <Text style={[styles.doneSummaryLabel, { color: C.textMuted }]}>{d}</Text>
                <Text style={[styles.doneSummaryVal, { color: C.text }]}>
                  {config[d].rawMin} - {config[d].rawMax}
                </Text>
                <Text style={[styles.doneSummaryTag, { backgroundColor: C.accentLight, color: C.accent }]}>
                  U:{config[d].umbral}%
                </Text>
                <Text style={[styles.doneSummaryTag, { backgroundColor: C.secondaryLight, color: C.secondary }]}>
                  S:{config[d].sensibilidad}%
                </Text>
              </View>
            ))}
          </View>
          <ActionButton label="Cerrar" color={C.accent} onPress={cerrarModal} C={C} />
        </View>
      );
    }

    return null;
  }

  // ── Modal de ajustes avanzados ───────────────────────────────────────────────
  function SettingsModalContent() {
    return (
      <>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle,    { color: C.text }]}>Ajustes avanzados</Text>
          <Text style={[styles.modalSubtitle, { color: C.textMuted }]}>
            Umbral (0-100%) y sensibilidad (50-200%) por dedo
          </Text>
        </View>

        {DEDOS.map(dedo => {
          const cfg       = editSettings[dedo];
          const errUmbral = validarUmbral(cfg.umbral);
          const errSens   = validarSensibilidad(cfg.sensibilidad);
          const pctRaw    = normalizar(rawActual[dedo], config[dedo].rawMin, config[dedo].rawMax);
          const pct       = aplicarSensibilidad(pctRaw, cfg.sensibilidad);
          const activo    = pct >= cfg.umbral;

          return (
            <View key={dedo} style={[styles.settingsCard, { backgroundColor: C.modalSurface, borderColor: C.modalBorder }]}>
              <View style={styles.dedoCardHeader}>
                <Text style={[styles.dedoCardTitle, { color: C.text }]}>{dedo}</Text>
                <Text style={[styles.settingsPreview, { color: activo ? C.accent : C.textMuted }]}>
                  {pct}% {activo ? '(activo)' : '(inactivo)'}
                </Text>
              </View>

              <View style={styles.settingsRow}>
                <View style={styles.settingsField}>
                  <Text style={[styles.settingsLabel, { color: C.textMuted }]}>Umbral (%)</Text>
                  <TextInput
                    style={[styles.settingsInput, {
                      backgroundColor: C.inputBg,
                      borderColor: errUmbral ? C.error : C.inputBorder,
                      color: C.text,
                    }]}
                    keyboardType="numeric"
                    maxLength={3}
                    value={String(cfg.umbral)}
                    onChangeText={v => updateEditField(dedo, 'umbral', v, 'settings')}
                  />
                  <Text style={[styles.settingsHint, { color: C.textMuted }]}>0 - 100</Text>
                  {errUmbral && (
                    <Text style={[styles.fieldError, { color: C.error }]}>{errUmbral}</Text>
                  )}
                </View>

                <View style={[styles.settingsDivider, { backgroundColor: C.modalBorder }]} />

                <View style={styles.settingsField}>
                  <Text style={[styles.settingsLabel, { color: C.textMuted }]}>Sensibilidad (%)</Text>
                  <TextInput
                    style={[styles.settingsInput, {
                      backgroundColor: C.inputBg,
                      borderColor: errSens ? C.error : C.inputBorder,
                      color: C.text,
                    }]}
                    keyboardType="numeric"
                    maxLength={3}
                    value={String(cfg.sensibilidad)}
                    onChangeText={v => updateEditField(dedo, 'sensibilidad', v, 'settings')}
                  />
                  <Text style={[styles.settingsHint, { color: C.textMuted }]}>50 - 200</Text>
                  {errSens && (
                    <Text style={[styles.fieldError, { color: C.error }]}>{errSens}</Text>
                  )}
                </View>
              </View>

              <View style={[styles.settingsBar, { backgroundColor: C.track }]}>
                <View style={[styles.settingsBarFill, {
                  width: `${pct}%` as any,
                  backgroundColor: C.accent,
                }]} />
                <View style={[styles.settingsThreshold, {
                  left: `${cfg.umbral}%` as any,
                  backgroundColor: C.secondary,
                }]} />
              </View>
            </View>
          );
        })}

        <View style={styles.settingsActions}>
          <TouchableOpacity
            onPress={cerrarModal}
            style={[styles.cancelBtn, { borderColor: C.modalBorder }]}
          >
            <Text style={[styles.cancelBtnText, { color: C.textMuted }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={guardarSettings}
            style={[styles.saveBtn, { backgroundColor: C.accent }]}
          >
            <Text style={styles.saveBtnText}>Guardar ajustes</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // ─── Render principal ─────────────────────────────────────────────────────────
  return (
    <View style={[styles.screen, { backgroundColor: C.bg }]}>

      {/* Mockup SVG — dos capas superpuestas, opacidad controlada en sync con el tema */}
      <View style={styles.mockupFrame}>
        {/* Capa clara: visible cuando dark = 0 */}
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: Animated.subtract(1, darkOpacity) }]}
          pointerEvents="none"
        >
          <Image source={LIGHT_MOCKUP} style={styles.mockupImage} contentFit="fill" />
        </Animated.View>

        {/* Capa oscura: visible cuando dark = 1 */}
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: darkOpacity }]}
          pointerEvents="none"
        >
          <Image source={DARK_MOCKUP} style={styles.mockupImage} contentFit="fill" />
        </Animated.View>
      </View>

      {/* Botones de dedos + Calibrar */}
      <View style={styles.mockButtonsArea}>
        <View style={styles.mockButtonsCanvas}>
          {DEDOS.map((dedo, index) => {
            const state = getFingerUiState(dedo);
            return (
              <Pressable
                key={dedo}
                onPress={() => setSelectedFinger(dedo)}
                style={[
                  styles.fingerBtn,
                  index === 0 && styles.fingerBtn1,
                  index === 1 && styles.fingerBtn2,
                  index === 2 && styles.fingerBtn3,
                  index === 3 && styles.fingerBtn4,
                  index === 4 && styles.fingerBtn5,
                  {
                    // Verde = relajado · Rojo = flexionado (supera umbral)
                    backgroundColor: state.active ? '#E25D5D' : '#64C79D',
                    // Borde más grueso para indicar dedo seleccionado
                    borderColor: withAlpha(C.text, dark ? 0.12 : 0.08),
                    borderWidth: state.selected ? 2.5 : 1,
                  },
                ]}
              >
                <Text style={[styles.fingerBtnText, { color: C.textInverse }]}>{dedo}</Text>
              </Pressable>
            );
          })}

          <Pressable
            onPress={iniciarCalibracion}
            style={[
              styles.calibrateBtnRebuilt,
              {
                backgroundColor: withAlpha(C.surface, dark ? 0.9 : 0.98),
                borderColor: withAlpha(C.border, 0.6),
              },
            ]}
          >
            <Text style={[styles.calibrateBtnRebuiltText, { color: C.accent }]}>Calibrar</Text>
          </Pressable>
        </View>
      </View>

      {/* Modal principal */}
      <Modal
        visible={activeModal !== 'none'}
        transparent
        animationType="slide"
        onRequestClose={cerrarModal}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={[styles.overlay, { backgroundColor: withAlpha(colors.text.primary, dark ? 0.55 : 0.4) }]}
            onPress={cerrarModal}
          />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: C.modalSurface,
                borderTopColor: C.modalBorder,
                borderTopWidth: 1,
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: C.accent }]} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {activeModal === 'calibration' && <CalibrationModalContent />}
              {activeModal === 'settings'    && <SettingsModalContent />}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ─── Componentes auxiliares puros ─────────────────────────────────────────────

function StepHeader({
  step, total, title, color, C,
}: {
  step: number;
  total: number;
  title: string;
  color: string;
  C: ColorMap;
}) {
  return (
    <View style={styles.stepHeader}>
      <View style={[styles.stepBadge, { backgroundColor: color }]}>
        <Text style={[styles.stepBadgeText, { color: C.textInverse }]}>{step}/{total}</Text>
      </View>
      <Text style={[styles.stepTitle, { color }]}>{title}</Text>
      <View style={styles.stepProgress}>
        {[1, 2, 3].map(n => (
          <View
            key={n}
            style={[
              styles.stepDot,
              { backgroundColor: n <= step ? color : C.border },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function ActionButton({ label, color, onPress, C }: {
  label: string;
  color: string;
  onPress: () => void;
  C: ColorMap;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[styles.actionBtn, { backgroundColor: color }]}
    >
      <Text style={[styles.actionBtnText, { color: C.textInverse }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function FieldInput({ label, value, onChangeText, hasError, C }: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  hasError: boolean;
  C: ColorMap;
}) {
  return (
    <View style={styles.dedoField}>
      <Text style={[styles.dedoFieldLabel, { color: C.textMuted }]}>{label}</Text>
      <TextInput
        style={[styles.dedoInput, {
          backgroundColor: C.inputBg,
          borderColor: hasError ? C.error : C.inputBorder,
          color: C.text,
        }]}
        keyboardType="numeric"
        maxLength={4}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },

  mockupFrame: { width: '100%', aspectRatio: 310.5 / 408, overflow: 'hidden', position: 'relative' },
  mockupImage: { position: 'absolute', width: '100%', aspectRatio: 310.5 / 672, top: '-8%' },

  mockButtonsArea: { width: '100%', alignItems: 'center', marginTop: 20, paddingBottom: 18 },
  mockButtonsCanvas: { width: '92%', aspectRatio: 310.5 / 205, position: 'relative' },
  fingerBtn: {
    position: 'absolute',
    width: '30%',
    height: '16.5%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerBtn1: { left: '2%', top: '-2%' },
  fingerBtn2: { left: '2%', top: '18%' },
  fingerBtn3: { right: '2%', top: '-2%' },
  fingerBtn4: { right: '2%', top: '18%' },
  fingerBtn5: { left: '35%', top: '36%' },
  fingerBtnText: { fontSize: 15, fontWeight: '900', letterSpacing: 0.2 },
  calibrateBtnRebuilt: {
    position: 'absolute',
    left: '24%',
    width: '52%',
    height: '28%',
    bottom: '4%',
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calibrateBtnRebuiltText: { fontSize: 19, fontWeight: '900' },

  overlay: { flex: 1 },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, maxHeight: '88%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  modalHeader: { marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalSubtitle: { fontSize: 12, marginTop: 3 },

  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  stepBadge: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4 },
  stepBadgeText: { fontWeight: '800', fontSize: 12 },
  stepTitle: { fontSize: 17, fontWeight: '800', flex: 1 },
  stepProgress: { flexDirection: 'row', gap: 5 },
  stepDot: { width: 8, height: 8, borderRadius: 4 },
  stepDesc: { fontSize: 13, lineHeight: 19, marginBottom: 14 },

  instructionBox: { flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1.5, borderRadius: 12, padding: 12, marginBottom: 14, gap: 10 },
  instructionIcon: { fontSize: 20, marginTop: 1 },
  instructionText: { flex: 1, fontSize: 13, lineHeight: 19 },

  livePreview: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 14 },
  livePrevTitle: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  liveRow: { flexDirection: 'row', justifyContent: 'space-between' },
  liveCell: { flex: 1, alignItems: 'center', gap: 4 },
  liveCellLabel: { fontSize: 9, fontWeight: '700' },
  liveCellRaw: { fontSize: 10, fontWeight: '600' },
  liveCellBar: { width: 20, height: 40, borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  liveCellBarFill: { width: '100%', borderRadius: 4 },
  liveCellPct: { fontSize: 11, fontWeight: '800' },

  snapRow: { borderWidth: 1, borderRadius: 12, padding: 10, marginBottom: 14 },
  snapRowTitle: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  snapCells: { flexDirection: 'row', justifyContent: 'space-between' },
  snapCell: { flex: 1, alignItems: 'center' },
  snapLabel: { fontSize: 9, fontWeight: '700', marginBottom: 2 },
  snapValue: { fontSize: 14, fontWeight: '800' },

  dedoCard: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10 },
  dedoCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  dedoCardTitle: { fontSize: 13, fontWeight: '700' },
  dedoStatusBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  dedoStatusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  dedoRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  dedoField: { flex: 1, alignItems: 'center' },
  dedoFieldLabel: { fontSize: 9, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  dedoInput: { width: '100%', borderWidth: 1, borderRadius: 8, paddingVertical: 6, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  fieldError: { fontSize: 9, marginTop: 3, textAlign: 'center' },
  previewBar: { height: 6, borderRadius: 3, overflow: 'visible', marginBottom: 4, position: 'relative' },
  previewBarFill: { height: 6, borderRadius: 3 },
  previewThreshold: { position: 'absolute', top: -3, width: 2, height: 12, borderRadius: 1 },
  previewMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  previewMetaText: { fontSize: 10 },

  settingsCard: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10 },
  settingsPreview: { fontSize: 11, fontWeight: '700' },
  settingsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  settingsField: { flex: 1 },
  settingsLabel: { fontSize: 10, fontWeight: '600', marginBottom: 6 },
  settingsInput: { borderWidth: 1, borderRadius: 10, paddingVertical: 8, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  settingsHint: { fontSize: 9, textAlign: 'center', marginTop: 4 },
  settingsDivider: { width: 1, height: 60, marginTop: 22 },
  settingsBar: { height: 6, borderRadius: 3, overflow: 'visible', position: 'relative' },
  settingsBarFill: { height: 6, borderRadius: 3 },
  settingsThreshold: { position: 'absolute', top: -3, width: 2, height: 12, borderRadius: 1 },
  settingsActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600' },
  saveBtn: { flex: 2, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  actionBtn: { marginTop: 14, borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  actionBtnText: { fontSize: 15, fontWeight: '700' },

  doneContainer: { alignItems: 'center', paddingTop: 8 },
  doneIconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  doneIconText: { fontSize: 16, fontWeight: '900' },
  doneTitle: { fontSize: 19, fontWeight: '800', marginBottom: 6 },
  doneSub: { fontSize: 13, textAlign: 'center', marginBottom: 18, lineHeight: 19 },
  doneSummary: { width: '100%', borderWidth: 1, borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
  doneSummaryRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 1, gap: 6 },
  doneSummaryLabel: { fontSize: 12, fontWeight: '600', flex: 1 },
  doneSummaryVal: { fontSize: 12, fontWeight: '700' },
  doneSummaryTag: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, fontSize: 10, fontWeight: '700' },
});