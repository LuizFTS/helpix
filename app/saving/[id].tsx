import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Target, Calendar } from 'lucide-react-native';
import { colors, radius, spacing } from '../../src/core/theme';
import { Loading, SectionTitle, Button, EmptyState, CurrencyText } from '../../src/shared/components';
import { useSavingGoal, useSavingContributions } from '../../src/features/savings/hooks/useSavings';
import { ContributionItem } from '../../src/features/savings/components/ContributionItem';
import { AddContributionSheet } from '../../src/features/savings/components/AddContributionSheet';

export default function SavingGoalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: goal, isLoading } = useSavingGoal(id);
  const { data: contributions = [] } = useSavingContributions(id);
  const [sheetVisible, setSheetVisible] = useState(false);

  if (isLoading || !goal) {
    return <Loading fullScreen label="Carregando meta..." />;
  }

  const isComplete = goal.percentage >= 100;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: goal.name }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.goalName}>{goal.name}</Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${goal.percentage}%`, backgroundColor: isComplete ? colors.success : colors.primary },
              ]}
            />
          </View>
          <Text style={styles.percentage}>{goal.percentage}% concluído</Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>Atual</Text>
              <CurrencyText value={goal.currentAmount} size="md" colorMode="neutral" />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.rowLabel}>Meta</Text>
              <CurrencyText value={goal.targetAmount} size="md" colorMode="neutral" />
            </View>
          </View>

          <View style={styles.metaRow}>
            <Target size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              Faltam R$ {goal.remaining.toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
            </Text>
          </View>

          <View style={{ height: spacing.md }} />
          <Button label="Adicionar aporte" onPress={() => setSheetVisible(true)} disabled={isComplete} />
        </View>

        <View style={{ height: 32 }} />

        <SectionTitle title="Histórico de aportes" />
        {contributions.length === 0 ? (
          <EmptyState title="Nenhum aporte ainda" description="Adicione o primeiro aporte dessa meta." />
        ) : (
          contributions.map((contribution) => (
            <ContributionItem key={contribution.id} contribution={contribution} />
          ))
        )}
      </ScrollView>

      <AddContributionSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        savingGoalId={goal.id}
        goalName={goal.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  goalName: { color: colors.textPrimary, fontSize: 22, fontWeight: '700', marginBottom: spacing.md },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: { height: '100%', borderRadius: 5 },
  percentage: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  rowItem: {},
  rowLabel: { color: colors.textSecondary, fontSize: 13, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaText: { color: colors.textSecondary, fontSize: 13, marginLeft: 8 },
});
