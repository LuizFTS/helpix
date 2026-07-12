import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/core/theme';
import { MoneyCard, SectionTitle, FloatingButton, Loading } from '../../src/shared/components';
import { useDashboard } from '../../src/features/dashboard/hooks/useDashboard';
import { PaymentMethodsCarousel } from '../../src/features/dashboard/components/PaymentMethodsCarousel';
import { TransactionsList } from '../../src/features/dashboard/components/TransactionsList';
import { EmailVerificationBanner } from '../../src/features/auth/components/EmailVerificationBanner';

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
    refetch,
  } = useDashboard();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading || !summary) {
    return <Loading fullScreen label="Carregando dashboard..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 140 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <EmailVerificationBanner />

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

        <SectionTitle
          title="Métodos de Pagamento"
          actionLabel="Ver análises"
          onActionPress={() => router.push('/analytics')}
        />
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
