import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store/useAppStore';

export default function TranslationFullscreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const translationText = useAppStore((s) => s.translationText);
  const displayText = translationText || '';
  

  // Build the full translated sentence from history (last 10 words)


  return (
    <SafeAreaView
      style={[s.safeArea, { backgroundColor: colors.translation.background }]}
    >
      <StatusBar barStyle="default" />

      {/* Header */}
      <View style={[s.header, { borderBottomColor: colors.card.border }]}>
        <TouchableOpacity
          style={s.closeBtn}
          onPress={() => router.back()}
          accessibilityLabel="Cerrar vista ampliada"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={28} color={colors.primary} />
        </TouchableOpacity>

        <Text style={[s.headerTitle, { color: '#000000' }]}>
          Traducción
        </Text>

        {/* Spacer to center title */}
        <View style={s.closeBtn} />
      </View>

      {/* Main content */}
      <View style={s.content}>
        <View style={[s.iconRow]}>
          <Ionicons name="volume-medium-outline" size={24} color={colors.primary} />
          <Text style={[s.label, { color: colors.text.secondary }]}>
            Texto detectado
          </Text>
        </View>

        <Text style={[s.mainText, { color: colors.translation.text }]}>
          {displayText}
        </Text>
      </View>

      {/* Footer hint */}
      <View style={s.footer}>
        <Text style={[s.footerHint, { color: colors.text.secondary }]}>
          El texto se actualiza en tiempo real
        </Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  // ── Content
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mainText: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 44,
  },

  // ── Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  footerHint: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});
