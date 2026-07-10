import { PaymentMethod } from '../../../shared/types/paymentMethod.types';

export type DashboardSummary = {
  balance: number;
  income: number;
  expenses: number;
  previousBalance: number;
};

export type PaymentMethodBreakdown = {
  paymentMethod: PaymentMethod;
  total: number; // soma das despesas nesse método, no período
  percentage: number; // 0-100, relativo ao total movimentado no período
};
