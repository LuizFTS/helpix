import React, { useMemo, useState } from 'react';
import { View, ScrollView, Text, Pressable, Alert, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Trash2, X } from 'lucide-react-native';
import { colors, spacing } from '../../src/core/theme';
import { Input, Loading } from '../../src/shared/components';
import { usePaymentMethods } from '../../src/shared/hooks/usePaymentMethods';
import { useTransactions, useDeleteTransactions } from '../../src/features/transactions/hooks/useTransactions';
import { TransactionsList } from '../../src/features/dashboard/components/TransactionsList';

export default function AtividadesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Busca é estado local — só essa tela usa, não precisa ser global
  // (o `useFilterStore` guarda só período/filtro de método, que são
  // compartilhados entre Dashboard e Atividades).
  const [searchText, setSearchText] = useState('');

  const {
    data: transactions = [],
    isLoading,
    refetch: refetchTransactions,
  } = useTransactions();
  const { data: paymentMethods = [], refetch: refetchPaymentMethods } = usePaymentMethods();
  const deleteMany = useDeleteTransactions();

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const paymentMethodsById = useMemo(() => {
    const map = new Map<string, string>();
    paymentMethods.forEach((pm) => map.set(pm.id, pm.name));
    return map;
  }, [paymentMethods]);

  const filtered = useMemo(() => {
    if (!searchText.trim()) return transactions;
    const query = searchText.trim().toLowerCase();
    return transactions.filter((t) => t.description.toLowerCase().includes(query));
  }, [transactions, searchText]);

  const handleLongPress = (id: string) => {
    setSelectionMode(true);
    setSelectedIds(new Set([id]));
  };

  const handlePress = (id: string) => {
    if (selectionMode) {
      setSelectedIds((current) => {
        const next = new Set(current);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        if (next.size === 0) setSelectionMode(false);
        return next;
      });
      return;
    }
    router.push(`/transaction/${id}`);
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    const count = selectedIds.size;
    Alert.alert(
      'Excluir movimentações',
      `Tem certeza que deseja excluir ${count} ${count === 1 ? 'movimentação' : 'movimentações'}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteMany.mutateAsync(Array.from(selectedIds));
            handleCancelSelection();
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchTransactions(), refetchPaymentMethods()]);
    setRefreshing(false);
  };

  if (isLoading) {
    return <Loading fullScreen label="Carregando movimentações..." />;
  }

  return (
    <View style={styles.container}>
      {selectionMode ? (
        <View style={[styles.selectionBar, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={handleCancelSelection} hitSlop={10} style={styles.selectionIconButton}>
            <X size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.selectionLabel}>
            {selectedIds.size} {selectedIds.size === 1 ? 'selecionada' : 'selecionadas'}
          </Text>
          <Pressable
            onPress={handleDeleteSelected}
            hitSlop={10}
            style={styles.selectionIconButton}
            disabled={selectedIds.size === 0 || deleteMany.isPending}
          >
            <Trash2 size={20} color={colors.danger} />
          </Pressable>
        </View>
      ) : (
        <View style={{ paddingHorizontal: 20, paddingTop: insets.top + 12 }}>
          <Input
            label="Pesquisar"
            placeholder="Buscar por descrição..."
            value={searchText}
            onChangeText={setSearchText}
            rightElement={<Search size={18} color={colors.textSecondary} />}
          />
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <TransactionsList
          transactions={filtered}
          paymentMethodsById={paymentMethodsById}
          onPressTransaction={handlePress}
          onLongPressTransaction={handleLongPress}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.backgroundElevated,
  },
  selectionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  selectionLabel: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
});
