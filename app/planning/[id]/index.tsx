import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { colors, spacing } from '../../../src/core/theme';
import { Loading, EmptyState } from '../../../src/shared/components';
import { useScenarioProjection } from '../../../src/features/planning/hooks/useScenarioProjection';
import { ProjectionSummaryCard } from '../../../src/features/planning/components/ProjectionSummaryCard';
import { ProjectionList } from '../../../src/features/planning/components/ProjectionList';

/**
 * Dashboard da Simulação — tela de detalhe do cenário.
 *
 * Busca o cenário e executa o `ProjectionEngine` **em memória**
 * (`useScenarioProjection`); a projeção nunca é salva no Firestore e
 * é recalculada toda vez que a tela é aberta. Nenhum cálculo
 * adicional acontece aqui — a tela só exibe o que o `ProjectionEngine`
 * devolve.
 *
 * A edição do cenário (nome, saldo, meses, excluir, duplicar) vive em
 * `/planning/[id]/edit`, acessível pelo ícone de lápis no cabeçalho —
 * ver decisão de reorganização de rotas no `.md` desta etapa.
 */
export default function ScenarioDashboardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { scenario, projection, isLoading, error } = useScenarioProjection(id);

  if (isLoading || !scenario) {
    return <Loading fullScreen label="Carregando cenário..." />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <EmptyState title="Algo deu errado" description={error} />
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{scenario.name}</Text>
          {scenario.description ? <Text style={styles.description}>{scenario.description}</Text> : null}
        </View>
        <Pressable
          onPress={() => router.push(`/planning/${scenario.id}/edit`)}
          hitSlop={12}
          style={styles.editButton}
        >
          <Pencil size={18} color={colors.primary} />
        </Pressable>
      </View>

      <ProjectionSummaryCard scenario={scenario} />
    </View>
  );

  if (!projection || projection.months.length === 0) {
    return (
      <View style={styles.container}>
        {header}
        <View style={styles.centered}>
          <EmptyState
            title="Sem projeção"
            description="Não foi possível gerar a projeção."
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProjectionList months={projection.months} ListHeaderComponent={header} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  header: { paddingHorizontal: 20, paddingTop: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  name: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  description: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
