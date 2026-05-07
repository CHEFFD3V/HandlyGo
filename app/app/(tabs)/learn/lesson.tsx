import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProgressStore } from '../../../store/useProgressStore';
import { useTheme } from '../../../hooks/useTheme';

// ── Configuración de XP por lección ──
const XP_PER_LESSON = 10; // ← cambia este valor para ajustar cuánto XP da cada lección

export default function LessonScreen() {
  const { lessonId, levelId } = useLocalSearchParams<{
    lessonId: string;
    levelId: string;
  }>();
  const router   = useRouter();
  const { colors } = useTheme();

  const addXP       = useProgressStore((s) => s.addXP);
  const completeItem = useProgressStore((s) => s.completeItem);
  const unlockLevel  = useProgressStore((s) => s.unlockLevel);

  const handleComplete = () => {
    const id = Number(lessonId);
    const lvl = Number(levelId);

    // 1. Marca la lección como completada (no suma XP si ya estaba completada)
    completeItem(id);

    // 2. Suma XP
    addXP(XP_PER_LESSON);

    // 3. Desbloquea el siguiente nivel (opcional — ajusta la lógica según tus datos)
    unlockLevel(lvl + 1);

    // 4. Vuelve a la pantalla del nivel
    router.back();
  };

  return (
    <View style={[s.screen, { backgroundColor: colors.background }]}>

      {/* Info de la lección — aquí irá el contenido real en sprints futuros */}
      <View style={s.content}>
        <Text style={[s.label, { color: colors.text.secondary }]}>NIVEL</Text>
        <Text style={[s.value, { color: colors.text.primary }]}>{levelId}</Text>

        <Text style={[s.label, { color: colors.text.secondary }]}>LECCIÓN</Text>
        <Text style={[s.value, { color: colors.text.primary }]}>{lessonId}</Text>
      </View>

      {/* Botón completar */}
      <TouchableOpacity
        style={[s.btn, { backgroundColor: colors.primary }]}
        activeOpacity={0.8}
        onPress={handleComplete}
      >
        <Text style={[s.btnText, { color: colors.text.inverse }]}>
          ✓  Completar lección (+{XP_PER_LESSON} XP)
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  value: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 24,
  },
  btn: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});