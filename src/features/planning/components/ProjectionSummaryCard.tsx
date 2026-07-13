import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../core/theme';
import { Scenario } from '../types';

type ProjectionSummaryCardProps = {
  scenario: Scenario;
};

/**
 * Resumo do cenário no topo da tela de detalhe — saldo inicial e
 * meses projetados, direto dos dados de cadastro (não da projeção
 * calculada). Deliberadamente simples nesta etapa: nenhum indicador
 * (saldo final projetado, variação, etc.) ainda — isso depende de
 * eventos financeiros reais, que não existem até esta etapa.
 *
 * Preparado pra crescer: quando indicadores existirem, é este
 * componente que deve ganhar novas linhas (ex: "Saldo final
 * projetado"), sem precisar mudar a tela que o usa.
 */
export function ProjectionSummaryCard({ scenario }: ProjectionSummaryCardProps) {
  return (
    <Card className="mb-4">
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>SALDO INICIAL</Text>
          <Text style={styles.value}>R$ {scenario.initialBalance}</Text>
        </View>
        <View>
          <Text style={styles.label}>MESES PROJETADOS</Text>
          <Text style={styles.value}>{scenario.projectionMonths}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: colors.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  value: { color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginTop: spacing.xs },
});
