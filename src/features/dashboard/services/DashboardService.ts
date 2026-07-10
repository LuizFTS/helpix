import { PaymentMethodService } from '../../../core/services/PaymentMethodService';
import { MOCK_PREVIOUS_BALANCE } from '../../../shared/constants/mockData';
import { Period } from '../../../shared/utils/date';
import { TransactionService } from '../../transactions/services/TransactionService';
import { buildDashboardSummary, buildPaymentMethodBreakdown } from '../mappers/dashboard.mapper';
import { DashboardSummary, PaymentMethodBreakdown } from '../types/dashboard.types';

/**
 * DashboardService não guarda estado nem lógica de agregação — só
 * orquestra outros Services e delega o cálculo ao mapper. Se
 * `TransactionService` mudar de fonte de dados, este service não precisa mudar.
 */
class DashboardServiceImpl {
  async getSummary(period: Period): Promise<DashboardSummary> {
    const transactions = await TransactionService.getAll();
    // `previousBalance` viria de uma API futura; hoje é um valor mockado fixo.
    return buildDashboardSummary(transactions, period, MOCK_PREVIOUS_BALANCE);
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
