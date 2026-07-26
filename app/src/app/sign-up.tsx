import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

export default function SignUpScreen() {
  const theme = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSignUp() {
    setError(null);
    setIsSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim(), role: 'parent' } },
    });
    setIsSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Si el proyecto exige confirmación de correo, no habrá sesión todavía.
    if (!data.session) setCheckEmail(true);
  }

  if (checkEmail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Revisa tu correo
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.centerText}>
            Te enviamos un enlace de confirmación a {email}. Confírmalo y luego inicia sesión.
          </ThemedText>
          <Link href="/sign-in" style={styles.link}>
            <ThemedText type="link" themeColor="textSecondary">
              Ir a iniciar sesión
            </ThemedText>
          </Link>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Crear cuenta
        </ThemedText>

        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nombre completo"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Correo electrónico"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña (mínimo 6 caracteres)"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <Pressable
          onPress={handleSignUp}
          disabled={isSubmitting || !fullName || !email || password.length < 6}
          style={[
            styles.button,
            { opacity: isSubmitting || !fullName || !email || password.length < 6 ? 0.5 : 1 },
          ]}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Crear cuenta</ThemedText>
          )}
        </Pressable>

        <Link href="/sign-in" style={styles.link}>
          <ThemedText type="link" themeColor="textSecondary">
            ¿Ya tienes cuenta? Inicia sesión
          </ThemedText>
        </Link>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    marginBottom: Spacing.three,
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3c87f7',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#d64545',
  },
  link: {
    marginTop: Spacing.three,
    alignSelf: 'center',
  },
});
