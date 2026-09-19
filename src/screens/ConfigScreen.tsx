import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme';
import { useAuth } from '../state/AuthContext';
import { logout } from '../services/auth';
import { ROLE_LABEL } from '../types';

const UPCOMING = ['Hotéis', 'Setores', 'Categorias', 'Usuários', 'SLA', 'Relatórios'];

export function ConfigScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Configurações</Text>

        <View style={styles.card}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.role}>
            {user?.username} · {user ? ROLE_LABEL[user.role] : ''}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Em construção</Text>
          <Text style={styles.note}>
            A administração completa da rede (hotéis, setores, categorias, usuários, SLA e relatórios) é a próxima
            entrega — veja o README do projeto para o escopo combinado.
          </Text>
          <View style={styles.pillRow}>
            {UPCOMING.map((item) => (
              <View key={item} style={styles.pill}>
                <Text style={styles.pillText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable onPress={() => logout()} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.victoryBone },
  scroll: { padding: 16, gap: 16 },
  title: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 24, color: colors.victoryInk },
  card: { backgroundColor: colors.white, borderRadius: radii.md, padding: 18, gap: 8 },
  name: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 15, color: colors.victoryInk },
  role: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.textMuted },
  sectionTitle: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 15, color: colors.victoryInk },
  note: { fontFamily: fonts.sans, fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  pill: { backgroundColor: colors.bgSunken, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  pillText: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 12.5, color: colors.text },
  logoutBtn: { alignItems: 'center', paddingVertical: 12 },
  logoutText: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 14, color: colors.danger },
});
