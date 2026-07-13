import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Pencil, Copy, Trash2 } from 'lucide-react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../core/theme';
import { formatDateShort } from '../../../shared/utils/date';
import { ScenarioSummary } from '../types';

type ScenarioCardProps = {
  scenario: ScenarioSummary;
  onPress?: (scenario: ScenarioSummary) => void;
  onEdit?: (scenario: ScenarioSummary) => void;
  onDuplicate?: (scenario: ScenarioSummary) => void;
  onDelete?: (scenario: ScenarioSummary) => void;
};

/**
 * Card de um cenário na lista da tela `/planning`.
 *
 * Mostra só informações básicas de cadastro (nome, meses projetados,
 * última atualização) — nenhum indicador financeiro calculado, já que
 * o Projection Engine ainda não existe (etapas futuras).
 *
 * As três ações (editar/duplicar/excluir) ficam numa barrinha
 * inferior do card, mesmo padrão de ações secundárias já usado em
 * `PaymentMethodListItem` (ícone + `onPress`, sem menu suspenso).
 */
export function ScenarioCard({ scenario, onPress, onEdit, onDuplicate, onDelete }: ScenarioCardProps) {
  return (
    <Pressable onPress={() => onPress?.(scenario)}>
      <Card className="mb-3">
        <Text style={styles.name}>{scenario.name}</Text>
        {scenario.description ? <Text style={styles.description}>{scenario.description}</Text> : null}
        <Text style={styles.meta}>
          {scenario.projectionMonths} {scenario.projectionMonths === 1 ? 'mês' : 'meses'} de projeção
          {'  ·  '}
          Atualizado em {formatDateShort(scenario.updatedAt)}
        </Text>

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.actionButton}
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation();
              onEdit?.(scenario);
            }}
          >
            <Pencil size={16} color={colors.textSecondary} />
            <Text style={styles.actionLabel}>Editar</Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation();
              onDuplicate?.(scenario);
            }}
          >
            <Copy size={16} color={colors.textSecondary} />
            <Text style={styles.actionLabel}>Duplicar</Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            hitSlop={8}
            onPress={(e) => {
              e.stopPropagation();
              onDelete?.(scenario);
            }}
          >
            <Trash2 size={16} color={colors.danger} />
            <Text style={[styles.actionLabel, { color: colors.danger }]}>Excluir</Text>
          </Pressable>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  description: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  meta: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', marginLeft: 6 },
});
