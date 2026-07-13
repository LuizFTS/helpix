import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wallet, Eye, EyeOff, Fingerprint, Check } from 'lucide-react-native';
import { colors, spacing } from '../src/core/theme';
import { Input, Button } from '../src/shared/components';
import { useAuthForm } from '../src/features/auth/hooks/useAuthForm';
import { useBiometricLogin } from '../src/features/auth/hooks/useBiometricLogin';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { form, submit, mode, toggleMode, firebaseError, isSubmitting, remember, setRemember } =
    useAuthForm();
  const { control, formState } = form;
  const { canUseBiometrics, isAuthenticating, error: biometricError, loginWithBiometrics } =
    useBiometricLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSignUp = mode === 'signup';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 40, paddingBottom: 40, paddingHorizontal: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <Wallet color={colors.primary} size={28} />
        </View>
        <Text style={styles.title}>{isSignUp ? 'Criar conta' : 'Bem-vindo de volta'}</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Leva menos de um minuto.' : 'Entre pra continuar controlando suas finanças.'}
        </Text>
      </View>

      <View style={{ height: spacing.xl }} />

      {firebaseError || biometricError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{firebaseError ?? biometricError}</Text>
        </View>
      ) : null}

      {!isSignUp && canUseBiometrics ? (
        <>
          <Pressable
            onPress={loginWithBiometrics}
            disabled={isAuthenticating}
            style={[styles.biometricButton, isAuthenticating && { opacity: 0.6 }]}
          >
            <Fingerprint color={colors.primary} size={22} />
            <Text style={styles.biometricButtonText}>
              {isAuthenticating ? 'Verificando...' : 'Entrar com biometria'}
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou entre com e-mail</Text>
            <View style={styles.dividerLine} />
          </View>
        </>
      ) : null}

      {isSignUp ? (
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Input
              label="Nome"
              placeholder="Como podemos te chamar?"
              autoCapitalize="words"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      ) : null}

      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <Input
            label="E-mail"
            placeholder="voce@email.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <Input
            label="Senha"
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
            rightElement={
              <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </Pressable>
            }
          />
        )}
      />

      {isSignUp ? (
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Input
              label="Confirmar senha"
              placeholder="••••••••"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              rightElement={
                <Pressable onPress={() => setShowConfirmPassword((v) => !v)} hitSlop={10}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </Pressable>
              }
            />
          )}
        />
      ) : null}

      {!isSignUp ? (
        <Pressable
          onPress={() => setRemember((v) => !v)}
          style={styles.rememberRow}
          hitSlop={8}
        >
          <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
            {remember ? <Check size={14} color={colors.white} /> : null}
          </View>
          <Text style={styles.rememberText}>Lembrar de mim</Text>
        </Pressable>
      ) : null}

      <View style={{ height: spacing.sm }} />

      <Button
        label={isSignUp ? 'Criar conta' : 'Entrar'}
        onPress={submit}
        isLoading={isSubmitting || formState.isSubmitting}
      />

      <View style={{ height: spacing.lg }} />

      <Pressable onPress={toggleMode} style={styles.toggleLink}>
        <Text style={styles.toggleText}>
          {isSignUp ? 'Já tem uma conta? ' : 'Ainda não tem conta? '}
          <Text style={styles.toggleTextStrong}>{isSignUp ? 'Entrar' : 'Criar conta'}</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center' },
  logoWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 6, textAlign: 'center' },
  errorBanner: {
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorBannerText: { color: colors.danger, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  toggleLink: { alignItems: 'center' },
  toggleText: { color: colors.textSecondary, fontSize: 14 },
  toggleTextStrong: { color: colors.primary, fontWeight: '700' },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
    marginBottom: spacing.md,
  },
  biometricButtonText: { color: colors.primary, fontSize: 15, fontWeight: '700', marginLeft: 8 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textTertiary, fontSize: 12, marginHorizontal: spacing.sm },
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  rememberText: { color: colors.textSecondary, fontSize: 14 },
});
