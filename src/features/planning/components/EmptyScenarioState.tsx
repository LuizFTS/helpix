import React from 'react';
import { View } from 'react-native';
import { CalendarRange } from 'lucide-react-native';
import { EmptyState, Button } from '../../../shared/components';
import { spacing } from '../../../core/theme';

type EmptyScenarioStateProps = {
  title?: string;
  description?: string;
  /** Ação do botão "Novo cenário". Sem `onPress`, o botão não é exibido. */
  onCreate?: () => void;
};

/**
 * Estado vazio da tela `/planning`, exibido quando ainda não existe
 * nenhum cenário. Reaproveita o `EmptyState` compartilhado, com botão
 * "Novo cenário" funcional (navega pra `/planning/new`, ver
 * `app/planning/index.tsx`).
 */
export function EmptyScenarioState({
  title = 'Nenhum cenário criado',
  description = 'Crie um cenário pra simular seu planejamento financeiro.',
  onCreate,
}: EmptyScenarioStateProps) {
  return (
    <View>
      <EmptyState title={title} description={description} icon={CalendarRange} />
      {onCreate ? (
        <View style={{ marginTop: spacing.sm }}>
          <Button label="Novo cenário" onPress={onCreate} />
        </View>
      ) : null}
    </View>
  );
}
