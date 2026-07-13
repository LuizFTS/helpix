import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../core/theme';
import { formatPeriodShort } from '../../../shared/utils/date';
import { MonthlyProjection } from '../types';

type ProjectionMonthCardProps = {
  month: MonthlyProjection;
};

/**
 * Representa um único mês da projeção — todos os valores exibidos
 * vêm diretamente do `MonthlyProjection` calculado pelo
 * `ProjectionEngine` (`useScenarioProjection`), nenhum cálculo próprio
 * acontece aqui.
 *
 * Preparado pra crescer: `month.events` já existe no tipo (sempre
 * `[]` até a etapa de Eventos) — quando eventos passarem a existir de
 * verdade, este é o componente que deve ganhar uma lista deles
 * (ex: "Compra: Notebook — R$ 3.000" abaixo do resumo do mês), sem
 * precisar mudar `ProjectionList` nem a tela de detalhe.
 */
export const ProjectionMonthCard = React.memo(function ProjectionMonthCard({
  month,
}: ProjectionMonthCardProps) {
  return (
    <Card className="mb-3">
      <Text style={styles.monthLabel}>
        {formatPeriodShort({ month: month.month - 1, year: month.year })}
      </Text>

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>SALDO INICIAL</Text>
          <Text style={styles.fieldValue}>R$ {month.initialBalance}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>RECEITAS</Text>
          <Text style={[styles.fieldValue, { color: colors.success }]}>R$ {month.totalIncome}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>DESPESAS</Text>
          <Text style={[styles.fieldValue, { color: colors.danger }]}>R$ {month.totalExpense}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>SALDO FINAL</Text>
          <Text style={styles.fieldValue}>R$ {month.finalBalance}</Text>
        </View>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  monthLabel: { color: colors.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  field: { flex: 1 },
  fieldLabel: { color: colors.textSecondary, fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  fieldValue: { color: colors.textPrimary, fontSize: 15, fontWeight: '600', marginTop: 2 },
});
