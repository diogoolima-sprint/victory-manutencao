import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radii, shadows } from '../theme';
import { Button, TextField } from '../components';
import { completeForcePasswordChange } from '../services/auth';
import { useAuth } from '../state/AuthContext';

export function ForcePasswordScreen() {
  const { user, refreshUser } = useAuth();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!/^\d{6}$/.test(p1)) {
      setError('A senha deve ter exatamente 6 dígitos numéricos.');
      return;
    }
    if (p1 !== p2) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!user) return;
    setError('');
    setLoading(true);
    try {
      await completeForcePasswordChange(user.id, p1);
      await refreshUser();
    } catch {
      setError('Não foi possível salvar a nova senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Image
              source={require('../../assets/branding/victory-logo-white.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Manutenção</Text>
          </View>

          <View style={styles.card}>
            <View>
              <Text style={styles.title}>Defina sua senha</Text>
              <Text style={styles.subtitle}>
                Este é seu primeiro acesso. Crie uma senha numérica de 6 dígitos para continuar.
              </Text>
            </View>
            <TextField
              label="Nova senha (6 dígitos)"
              value={p1}
              onChangeText={(v) => {
                setP1(v.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              placeholder="••••••"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
              style={styles.pinInput}
            />
            <TextField
              label="Confirmar senha"
              value={p2}
              onChangeText={(v) => {
                setP2(v.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              placeholder="••••••"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
              style={styles.pinInput}
              onSubmitEditing={handleSubmit}
              returnKeyType="go"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label="Confirmar" onPress={handleSubmit} loading={loading} fullWidth style={{ marginTop: 4 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.victoryInk },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 26 },
  header: { alignItems: 'center', gap: 10 },
  logo: { height: 56, width: 220 },
  tagline: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 13, color: colors.victoryStone, letterSpacing: 3, textTransform: 'uppercase' },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    gap: 14,
    ...(Platform.OS === 'ios' ? shadows.pop : { elevation: shadows.pop.elevation }),
  },
  title: { fontFamily: fonts.sans, fontWeight: '700', fontSize: 18, color: colors.victoryInk },
  subtitle: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.textMuted, marginTop: 4 },
  pinInput: { letterSpacing: 6 },
  error: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 12.5, color: colors.danger },
});
