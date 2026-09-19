import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radii, shadows } from '../theme';
import { Button, TextField } from '../components';
import { loginWithUsername, LoginError } from '../services/auth';

export function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password) {
      setError('Informe usuário e senha.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await loginWithUsername(username, password);
      // AuthContext's onAuthStateChanged listener picks up the session
      // and RootNavigator swaps screens automatically.
    } catch (e) {
      setError(e instanceof LoginError ? e.message : 'Não foi possível entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Image
              source={require('../../assets/branding/victory-logo-white.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Manutenção</Text>
            <Text style={styles.demoNote}>Ambiente de demonstração · dados fictícios</Text>
          </View>

          <View style={styles.card}>
            <TextField
              label="Usuário"
              value={username}
              onChangeText={(v) => {
                setUsername(v);
                setError('');
              }}
              placeholder="nome.sobrenome"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            <TextField
              label="Senha"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setError('');
              }}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label="Entrar" onPress={handleLogin} loading={loading} fullWidth style={{ marginTop: 4 }} />
            <Text style={styles.footerNote}>Esqueceu a senha? Fale com o administrador da rede.</Text>
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
  demoNote: { fontSize: 12.5, color: colors.victoryWarmGray, marginTop: 8, textAlign: 'center' },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    gap: 14,
    ...(Platform.OS === 'ios' ? shadows.pop : { elevation: shadows.pop.elevation }),
  },
  error: { fontFamily: fonts.sans, fontWeight: '600', fontSize: 12.5, color: colors.danger },
  footerNote: { fontSize: 11.5, color: colors.victoryWarmGray, textAlign: 'center', marginTop: 2 },
});
