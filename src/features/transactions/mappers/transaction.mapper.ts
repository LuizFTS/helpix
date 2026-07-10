import { MockTransaction } from '../../../shared/constants/mockData';
import { Transaction } from '../types/transaction.types';

/**
 * Isola o formato "cru" dos dados mockados (ou, futuramente, da API)
 * do modelo de domínio `Transaction` usado pelo restante do app.
 * Quando o backend chegar, só este mapper muda.
 */
export function mapMockTransactionToTransaction(raw: MockTransaction): Transaction {
  return {
    id: raw.id,
    description: raw.description,
    amount: Math.abs(raw.amount),
    date: raw.date,
    type: raw.type,
    paymentMethodId: raw.paymentMethodId,
    installmentGroupId: raw.installmentGroupId,
    installmentNumber: raw.installmentNumber,
    installmentTotal: raw.installmentTotal,
    notes: raw.notes,
    createdAt: raw.date,
    updatedAt: raw.date,
  };
}
