import React from 'react';
import { ScrollView } from 'react-native';
import { PaymentMethodCard } from './PaymentMethodCard';
import { PaymentMethodBreakdown } from '../types/dashboard.types';
import { EmptyState } from '../../../shared/components';

type PaymentMethodsCarouselProps = {
  breakdown: PaymentMethodBreakdown[];
  activePaymentMethodIds: string[];
  onToggle: (paymentMethodId: string) => void;
};

export function PaymentMethodsCarousel({
  breakdown,
  activePaymentMethodIds,
  onToggle,
}: PaymentMethodsCarouselProps) {
  if (breakdown.length === 0) {
    return <EmptyState title="Nenhuma movimentação neste período" />;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20 }}
    >
      {breakdown.map((item) => (
        <PaymentMethodCard
          key={item.paymentMethod.id}
          breakdown={item}
          active={activePaymentMethodIds.includes(item.paymentMethod.id)}
          onPress={() => onToggle(item.paymentMethod.id)}
        />
      ))}
    </ScrollView>
  );
}
