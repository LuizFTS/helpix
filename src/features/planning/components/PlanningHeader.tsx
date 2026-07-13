import React from 'react';
import { View, Text } from 'react-native';

type PlanningHeaderProps = {
  title: string;
  description?: string;
};

/**
 * Cabeçalho da tela de Planejamento Financeiro.
 *
 * Etapa 01 (fundação): componente puramente visual, sem nenhuma
 * lógica — recebe título/descrição prontos. Próximas etapas podem
 * estender as props (ex: ação de voltar, contagem de cenários) sem
 * quebrar quem já usa o componente.
 */
export function PlanningHeader({ title, description }: PlanningHeaderProps) {
  return (
    <View className="px-5 pt-2 pb-4">
      <Text className="text-textPrimary text-2xl font-bold">{title}</Text>
      {description ? (
        <Text className="text-textSecondary text-sm mt-2 leading-5">{description}</Text>
      ) : null}
    </View>
  );
}
