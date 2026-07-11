import { TransactionService } from '../../transactions/services/TransactionService';
import { PaymentMethodService } from '../../../core/services/PaymentMethodService';
import { Period } from '../../../shared/utils/date';
import { buildDashboardSummary, buildPaymentMethodBreakdown } from '../mappers/dashboard.mapper';
import { DashboardSummary, PaymentMethodBreakdown } from '../types/dashboard.types';

/**
 * DashboardService não guarda estado nem lógica de agregação — só
 * orquestra outros Services e delega o cálculo ao mapper. Desde a
 * migração pro Firestore, `TransactionService.getAll()` já retorna o
 * histórico completo real, então o saldo anterior também é calculado
 * a partir dele (não existe mais nenhum valor mockado aqui).
 */
class DashboardServiceImpl {
  async getSummary(period: Period): Promise<DashboardSummary> {
    const transactions = await TransactionService.getAll();
    return buildDashboardSummary(transactions, period);
  }

  async getPaymentMethodBreakdown(period: Period): Promise<PaymentMethodBreakdown[]> {
    const [transactions, paymentMethods] = await Promise.all([
      TransactionService.getAll(),
      PaymentMethodService.getAll(),
    ]);
    return buildPaymentMethodBreakdown(transactions, paymentMethods, period);
  }
}

export const DashboardService = new DashboardServiceImpl();
