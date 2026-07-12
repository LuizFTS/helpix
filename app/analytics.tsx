import React, { useState } from 'react';
import { View, ScrollView, Text, RefreshControl, StyleSheet } from 'react-native';
import { colors, spacing } from '../src/core/theme';
import { Loading, SectionTitle, CurrencyText, EmptyState } from '../src/shared/components';
import { useAnalytics } from '../src/features/analytics/hooks/useAnalytics';
import { MonthlyTrendChart } from '../src/features/analytics/components/MonthlyTrendChart';
import { OverallBreakdownRow } from '../src/features/analytics/components/OverallBreakdownRow';

export default function AnalyticsScreen() {
  const { monthlyTrend, overallBreakdown, totalIncome, totalExpenses, totalBalance, isLoading, refetch } =
    useAnalytics();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return <Loading fullScreen label="Carregando análises..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: 60 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>SALDO GERAL (TODO O HISTÓRICO)</Text>
          <CurrencyText value={totalBalance} size="xl" colorMode="neutral" />

          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summarySubLabel}>Total de receitas</Text>
              <CurrencyText value={totalIncome} size="sm" />
            </View>
            <View>
              <Text style={styles.summarySubLabel}>Total de despesas</Text>
              <CurrencyText value={-totalExpenses} size="sm" />
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />

        <SectionTitle title="Últimos 6 meses" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          <MonthlyTrendChart points={monthlyTrend} />
        </View>

        <View style={{ height: 32 }} />

        <SectionTitle title="Por método de pagamento (geral)" />
        {overallBreakdown.length === 0 ? (
          <EmptyState title="Sem dados suficientes" description="Cadastre movimentações para ver a análise." />
        ) : (
          overallBreakdown.map((item) => (
            <OverallBreakdownRow key={item.paymentMethod.id} breakdown={item} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  summaryCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    padding: spacing.lg,
  },
  summaryLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summarySubLabel: { color: colors.textSecondary, fontSize: 12, marginBottom: 4 },
});
