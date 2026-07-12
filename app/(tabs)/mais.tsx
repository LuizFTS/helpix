import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Settings, Database, User, LogOut } from 'lucide-react-native';
import { colors, spacing } from '../../src/core/theme';
import { Button } from '../../src/shared/components';
import { seedFirestoreIfEmpty } from '../../src/core/services/seedFirestore';
import { useAuth } from '../../src/core/providers/AuthProvider';
import { AuthService } from '../../src/features/auth/services/AuthService';

export default function MaisScreen() {
  const { user } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedFirestoreIfEmpty();
      Alert.alert(result.seeded ? 'Dados criados' : 'Nada a fazer', result.message);
    } catch (error) {
      Alert.alert('Erro ao popular dados', String(error));
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          setIsSigningOut(true);
          try {
            await AuthService.signOut();
            // Não precisa navegar manualmente — o `Stack.Protected` no
            // app/_layout.tsx já troca pra tela de Login sozinho assim
            // que `user` vira null.
          } finally {
            setIsSigningOut(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Settings color={colors.textSecondary} size={40} />
      <Text style={styles.title}>Mais opções em breve</Text>
      <Text style={styles.subtitle}>Preferências, métodos de pagamento, exportação.</Text>

      <View style={{ height: spacing.xl }} />

      <View style={styles.accountBox}>
        <View style={styles.accountIconWrapper}>
          <User color={colors.primary} size={20} />
        </View>
        <Text style={styles.accountEmail}>{user?.email}</Text>
        <View style={{ height: spacing.md }} />
        <Button
          label="Sair da conta"
          onPress={handleSignOut}
          isLoading={isSigningOut}
          variant="danger"
          icon={<LogOut size={18} color={colors.white} />}
        />
      </View>

      <View style={{ height: spacing.lg }} />

      <View style={styles.seedBox}>
        <Database color={colors.primary} size={20} />
        <Text style={styles.seedTitle}>Popular dados iniciais (Firestore)</Text>
        <Text style={styles.seedDescription}>
          Cria os métodos de pagamento e transações de exemplo no seu banco, uma única vez
          (não duplica se já existirem dados).
        </Text>
        <View style={{ height: spacing.md }} />
        <Button label="Popular dados de exemplo" onPress={handleSeed} isLoading={isSeeding} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '600', marginTop: spacing.md },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
  accountBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  accountIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  accountEmail: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  seedBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  seedTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700', marginTop: spacing.sm, textAlign: 'center' },
  seedDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
});
