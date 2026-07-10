import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/core/theme';
import { MoneyCard, SectionTitle, FloatingButton, Loading } from '../../src/shared/components';
import { useDashboard } from '../../src/features/dashboard/hooks/useDashboard';
import { PaymentMethodsCarousel } from '../../src/features/dashboard/components/PaymentMethodsCarousel';
import { TransactionsList } from '../../src/features/dashboard/components/TransactionsList';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    period,
    goToPreviousPeriod,
    goToNextPeriod,
    summary,
    breakdown,
    activePaymentMethodIds,
    togglePaymentMethodFilter,
    filteredTransactions,
    paymentMethodsById,
    isLoading,
  } = useDashboard();

  if (isLoading || !summary) {
    return <Loading fullScreen label="Carregando dashboard..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 140 }}>
        <MoneyCard
          greeting="Olá, Alex"
          period={period}
          balance={summary.balance}
          income={summary.income}
          expenses={summary.expenses}
          previousBalance={summary.previousBalance}
          onPreviousPeriod={goToPreviousPeriod}
          onNextPeriod={goToNextPeriod}
        />

        <View style={{ height: 32 }} />

        <SectionTitle title="Métodos de Pagamento" actionLabel="Ver análises" />
        <PaymentMethodsCarousel
          breakdown={breakdown}
          activePaymentMethodIds={activePaymentMethodIds}
          onToggle={togglePaymentMethodFilter}
        />

        <View style={{ height: 32 }} />

        <SectionTitle title="Atividades Recentes" />
        <TransactionsList
          transactions={filteredTransactions}
          paymentMethodsById={paymentMethodsById}
          onPressTransaction={(id) => router.push(`/transaction/${id}`)}
        />
      </ScrollView>

      <FloatingButton onPress={() => router.push('/transaction/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
