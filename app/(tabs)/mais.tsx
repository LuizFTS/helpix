import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Database, User, LogOut, CreditCard, Plus, CalendarRange, ChevronRight } from 'lucide-react-native';
import { colors, spacing } from '../../src/core/theme';
import { Button, EmptyState } from '../../src/shared/components';
import { seedFirestoreIfEmpty } from '../../src/core/services/seedFirestore';
import { useAuth } from '../../src/core/providers/AuthProvider';
import { AuthService } from '../../src/features/auth/services/AuthService';
import { usePaymentMethods, useDeletePaymentMethod } from '../../src/shared/hooks/usePaymentMethods';
import { PaymentMethodListItem } from '../../src/features/paymentMethods/components/PaymentMethodListItem';
import { CreatePaymentMethodSheet } from '../../src/features/paymentMethods/components/CreatePaymentMethodSheet';

export default function MaisScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, displayName } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [createSheetVisible, setCreateSheetVisible] = useState(false);

  const { data: paymentMethods = [] } = usePaymentMethods();
  const deletePaymentMethod = useDeletePaymentMethod();

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
          } finally {
            setIsSigningOut(false);
          }
        },
      },
    ]);
  };

  const handleDeletePaymentMethod = (id: string, name: string) => {
    Alert.alert('Excluir método', `Excluir "${name}"? Movimentações já feitas com ele não são afetadas.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deletePaymentMethod.mutate(id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Settings color={colors.textSecondary} size={40} />
        <Text style={styles.title}>Mais opções</Text>

        <View style={{ height: spacing.lg }} />

        <View style={styles.accountBox}>
          <View style={styles.accountIconWrapper}>
            <User color={colors.primary} size={20} />
          </View>
          {displayName ? <Text style={styles.accountName}>{displayName}</Text> : null}
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

        <View style={styles.paymentMethodsBox}>
          <View style={styles.sectionHeader}>
            <CreditCard color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>Métodos de Pagamento</Text>
          </View>

          {paymentMethods.length === 0 ? (
            <EmptyState
              title="Nenhum método cadastrado"
              description="Crie seus métodos de pagamento (bancos, PIX, recebimentos...)."
            />
          ) : (
            <View style={{ marginTop: spacing.md }}>
              {paymentMethods.map((pm) => (
                <PaymentMethodListItem
                  key={pm.id}
                  paymentMethod={pm}
                  onDelete={() => handleDeletePaymentMethod(pm.id, pm.name)}
                />
              ))}
            </View>
          )}

          <View style={{ height: spacing.sm }} />
          <Button
            label="Adicionar método"
            onPress={() => setCreateSheetVisible(true)}
            variant="secondary"
            icon={<Plus size={18} color={colors.textPrimary} />}
          />
        </View>

        <View style={{ height: spacing.lg }} />

        <Pressable style={styles.navBox} onPress={() => router.push('/planning')}>
          <View style={styles.sectionHeader}>
            <CalendarRange color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>Planejamento Financeiro</Text>
          </View>
          <ChevronRight color={colors.textSecondary} size={20} />
        </Pressable>

        <View style={{ height: spacing.lg }} />

        <View style={styles.seedBox}>
          <Database color={colors.primary} size={20} />
          <Text style={styles.seedTitle}>Popular dados iniciais (Firestore)</Text>
          <Text style={styles.seedDescription}>
            Cria métodos de pagamento e transações de exemplo, uma única vez (não duplica se já
            existirem dados pra sua conta).
          </Text>
          <View style={{ height: spacing.md }} />
          <Button label="Popular dados de exemplo" onPress={handleSeed} isLoading={isSeeding} variant="secondary" />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <CreatePaymentMethodSheet visible={createSheetVisible} onClose={() => setCreateSheetVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { alignItems: 'center', paddingHorizontal: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '600', marginTop: spacing.md },
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
  accountName: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  accountEmail: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  paymentMethodsBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700', marginLeft: spacing.sm },
  navBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
  },
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
