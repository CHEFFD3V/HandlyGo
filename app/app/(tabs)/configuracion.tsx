import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import SettingItem from '../../components/settingItem';

export default function ConfiguracionScreen() {
  const { colors, theme, toggleTheme } = useTheme();

  return (
    <View style={[s.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Text style={[s.title, { color: colors.text.primary }]}>
            Configuración
          </Text>
          <Text style={[s.subtitle, { color: colors.text.secondary }]}>
            Personaliza tu experiencia
          </Text>
        </View>

        <Text style={[s.sectionLabel, { color: colors.text.secondary }]}>
          Apariencia
        </Text>

        <SettingItem
          type="toggle"
          icon={theme === 'dark' ? 'moon' : 'sunny-outline'}
          label="Modo oscuro"
          description={theme === 'dark' ? 'Tema oscuro activado' : 'Tema claro activado'}
          value={theme === 'dark'}
          onToggle={toggleTheme}
        />

        <Text style={[s.sectionLabel, { color: colors.text.secondary }]}>
          Dispositivo
        </Text>

        <SettingItem
          type="action"
          icon="bluetooth-outline"
          label="DigiGlove"
          description="Gestionar conexión Bluetooth"
          onPress={() => {}}
        />

        <SettingItem
          type="info"
          icon="battery-half-outline"
          label="Batería del guante"
          description="Nivel actual de carga"
          value="78 %"
        />

        <Text style={[s.sectionLabel, { color: colors.text.secondary }]}>
          Aplicación
        </Text>

        <SettingItem
          type="action"
          icon="notifications-outline"
          label="Notificaciones"
          description="Recordatorios de práctica diaria"
          onPress={() => {}}
        />

        <SettingItem
          type="action"
          icon="language-outline"
          label="Idioma"
          description="Español"
          onPress={() => {}}
        />

        <SettingItem
          type="action"
          icon="help-circle-outline"
          label="Ayuda y soporte"
          onPress={() => {}}
        />

        <Text style={[s.sectionLabel, { color: colors.text.secondary }]}>
          Acerca de
        </Text>

        <SettingItem
          type="info"
          icon="information-circle-outline"
          label="Versión"
          value="1.0.0"
        />

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 6,
    marginLeft: 4,
  },
});
