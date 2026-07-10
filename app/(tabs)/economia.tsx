import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../src/core/theme';
import { SavingGoalCard } from '../../src/features/savings/components/SavingGoalCard';
import { useSavingGoals } from '../../src/features/savings/hooks/useSavings';
import { EmptyState, Loading } from '../../src/shared/components';

export default function EconomiaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: goals = [], isLoading } = useSavingGoals();

  if (isLoading) {
    return <Loading fullScreen label="Carregando metas..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 140 }}>
        <Text style={styles.title}>Economias</Text>
        <Text style={styles.subtitle}>Suas metas financeiras</Text>

        <View style={{ height: spacing.lg }} />

        {goals.length === 0 ? (
          <EmptyState title="Nenhuma meta ainda" description="Suas metas financeiras vão aparecer aqui." />
        ) : (
          goals.map((goal) => (
            <SavingGoalCard key={goal.id} goal={goal} onPress={() => router.push(`/saving/${goal.id}`)} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '700', paddingHorizontal: spacing.lg },
  subtitle: { color: colors.textSecondary, fontSize: 14, paddingHorizontal: spacing.lg, marginTop: 4 },
});
