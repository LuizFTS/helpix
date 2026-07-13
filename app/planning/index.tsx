import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/core/theme';
import { FloatingButton, Loading } from '../../src/shared/components';
import { PlanningHeader } from '../../src/features/planning/components/PlanningHeader';
import { EmptyScenarioState } from '../../src/features/planning/components/EmptyScenarioState';
import { ScenarioCard } from '../../src/features/planning/components/ScenarioCard';
import { usePlanning } from '../../src/features/planning/hooks/usePlanning';
import { ScenarioSummary } from '../../src/features/planning/types';

/**
 * Tela principal do módulo de Planejamento Financeiro — lista de
 * cenários. Tocar num card abre o dashboard da simulação
 * (`/planning/[id]`); o ícone de lápis abre o formulário de edição
 * (`/planning/[id]/edit`).
 */
export default function PlanningScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scenarios, loading, deleteScenario, duplicateScenario } = usePlanning();

  const handleCreate = () => router.push('/planning/new');
  const handleOpen = (scenario: ScenarioSummary) => router.push(`/planning/${scenario.id}`);
  const handleEdit = (scenario: ScenarioSummary) => router.push(`/planning/${scenario.id}/edit`);

  const handleDelete = (scenario: ScenarioSummary) => {
    Alert.alert(
      'Excluir cenário',
      'Deseja realmente excluir este cenário? Esta ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteScenario(scenario.id),
        },
      ]
    );
  };

  const handleDuplicate = (scenario: ScenarioSummary) => duplicateScenario(scenario.id);

  if (loading) {
    return <Loading fullScreen label="Carregando cenários..." />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <PlanningHeader
          title="Planejamento Financeiro"
          description="Simule cenários financeiros futuros e acompanhe suas projeções."
        />

        <View className="px-5">
          {scenarios.length === 0 ? (
            <EmptyScenarioState onCreate={handleCreate} />
          ) : (
            scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onPress={handleOpen}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))
          )}
        </View>
      </ScrollView>

      {scenarios.length > 0 ? (
        <FloatingButton onPress={handleCreate} accessibilityLabel="Novo cenário" />
      ) : null}
    </View>
  );
}
