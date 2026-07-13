import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { ProjectionMonthCard } from './ProjectionMonthCard';
import { MonthlyProjection } from '../types';

type ProjectionListProps = {
  months: MonthlyProjection[];
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
};

function keyExtractor(month: MonthlyProjection): string {
  return `${month.year}-${month.month}`;
}

/**
 * Renderiza todos os meses de uma projeção com `FlatList` — projeções
 * podem chegar a 120 meses (10 anos, o teto de
 * `MAX_PROJECTION_MONTHS`), então uma `ScrollView` com `.map()`
 * montaria todos os cards de uma vez; `FlatList` só renderiza o que
 * está na tela (virtualização), essencial pra manter a rolagem fluida
 * nesses casos maiores.
 *
 * `renderItem` é memoizado com `useCallback` — sem isso, `FlatList`
 * recriaria a função a cada render do componente pai e perderia parte
 * da otimização de re-render que a virtualização oferece.
 */
export function ProjectionList({ months, ListHeaderComponent }: ProjectionListProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MonthlyProjection>) => <ProjectionMonthCard month={item} />,
    []
  );

  return (
    <FlatList
      data={months}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
