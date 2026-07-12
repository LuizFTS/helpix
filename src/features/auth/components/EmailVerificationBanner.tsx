import React, { useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { Mail } from 'lucide-react-native';
import { colors, radius, spacing } from '../../../core/theme';
import { useAuth } from '../../../core/providers/AuthProvider';
import { AuthService } from '../services/AuthService';

/**
 * Banner não-bloqueante: o app funciona normalmente mesmo com o e-mail
 * não confirmado (decisão de produto). Aparece só enquanto
 * `emailVerified` for `false`; some sozinho assim que o usuário
 * confirma e toca em "Já confirmei" (ou reabre o app depois de
 * confirmar, já que o `AuthProvider` também checa isso no login).
 */
export function EmailVerificationBanner() {
  const { user, emailVerified, refreshUser } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  if (!user || emailVerified) return null;

  const handleResend = async () => {
    setIsResending(true);
    try {
      await AuthService.resendVerificationEmail();
      Alert.alert('E-mail reenviado', `Verifique a caixa de entrada de ${user.email}.`);
    } catch {
      Alert.alert('Erro', 'Não foi possível reenviar agora. Tente novamente em instantes.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheck = async () => {
    setIsChecking(true);
    await refreshUser();
    setIsChecking(false);
  };

  return (
    <View style={styles.banner}>
      <View style={styles.headerRow}>
        <Mail size={18} color={colors.warning} />
        <Text style={styles.title}>Confirme seu e-mail</Text>
      </View>
      <Text style={styles.description}>
        Enviamos um link de confirmação para {user.email}. Isso ajuda a proteger sua conta.
      </Text>
      <View style={styles.actionsRow}>
        <Pressable onPress={handleResend} disabled={isResending} style={styles.actionButton}>
          <Text style={styles.actionText}>{isResending ? 'Enviando...' : 'Reenviar e-mail'}</Text>
        </Pressable>
        <Pressable onPress={handleCheck} disabled={isChecking} style={styles.actionButton}>
          <Text style={[styles.actionText, styles.actionTextPrimary]}>
            {isChecking ? 'Verificando...' : 'Já confirmei'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(255, 194, 75, 0.12)',
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  title: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginLeft: 8 },
  description: { color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
  actionsRow: { flexDirection: 'row', marginTop: spacing.sm },
  actionButton: { marginRight: spacing.lg },
  actionText: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
  actionTextPrimary: { color: colors.primary },
});
