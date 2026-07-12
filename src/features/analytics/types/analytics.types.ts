import { Period } from '../../../shared/utils/date';
import { PaymentMethod } from '../../../shared/types/paymentMethod.types';

export type MonthlyTrendPoint = {
  period: Period;
  income: number;
  expenses: number;
};

export type OverallPaymentMethodBreakdown = {
  paymentMethod: PaymentMethod;
  total: number;
  percentage: number;
};
