import { create } from 'zustand';
import { Period, getCurrentPeriod, getNextPeriod, getPreviousPeriod } from '../../shared/utils/date';

type FilterState = {
  period: Period;
  activePaymentMethodIds: string[];
  goToPreviousPeriod: () => void;
  goToNextPeriod: () => void;
  togglePaymentMethodFilter: (paymentMethodId: string) => void;
  clearPaymentMethodFilter: () => void;
};

/**
 * Estado global de filtros do Dashboard. Usar Zustand aqui (em vez de
 * Context/prop-drilling) porque o período e o filtro de método de
 * pagamento afetam múltiplos componentes sem relação direta de
 * parent/child (carrossel, resumo, lista de movimentações).
 */
export const useFilterStore = create<FilterState>((set, get) => ({
  period: getCurrentPeriod(),
  activePaymentMethodIds: [],

  goToPreviousPeriod: () => set({ period: getPreviousPeriod(get().period) }),
  goToNextPeriod: () => set({ period: getNextPeriod(get().period) }),

  togglePaymentMethodFilter: (paymentMethodId) => {
    const current = get().activePaymentMethodIds;
    const isActive = current.includes(paymentMethodId);
    set({
      // Hoje suporta apenas 1 filtro ativo por vez; o array já prepara
      // o terreno para multi-seleção futura (conforme a spec original).
      activePaymentMethodIds: isActive ? [] : [paymentMethodId],
    });
  },

  clearPaymentMethodFilter: () => set({ activePaymentMethodIds: [] }),
}));
