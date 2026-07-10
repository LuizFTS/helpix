import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/core/theme';
import { TransactionsList } from '../../src/features/dashboard/components/TransactionsList';
import { useTransactions } from '../../src/features/transactions/hooks/useTransactions';
import { Input, Loading } from '../../src/shared/components';
import { usePaymentMethods } from '../../src/shared/hooks/usePaymentMethods';

/**
 * Lista cronológica completa (sem o recorte de período do Dashboard),
 * com pesquisa por descrição. Reaproveita `TransactionsList` da feature
 * dashboard — é o mesmo componente, só sem o filtro de período/método.
 */
export default function AtividadesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');

  const { data: transactions = [], isLoading } = useTransactions();
  const { data: paymentMethods = [] } = usePaymentMethods();

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

  if (isLoading) {
    return <Loading fullScreen label="Carregando movimentações..." />;
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 20, paddingTop: insets.top + 12 }}>
        <Input
          label="Pesquisar"
          placeholder="Buscar por descrição..."
          value={searchText}
          onChangeText={setSearchText}
          rightElement={<Search size={18} color={colors.textSecondary} />}
        />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <TransactionsList
          transactions={filtered}
          paymentMethodsById={paymentMethodsById}
          onPressTransaction={(id) => router.push(`/transaction/${id}`)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});