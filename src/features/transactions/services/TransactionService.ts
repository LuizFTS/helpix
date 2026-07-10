import { MOCK_TRANSACTIONS, MockTransaction } from '../../../shared/constants/mockData';
import { mapMockTransactionToTransaction } from '../mappers/transaction.mapper';
import { CreateTransactionInput, Transaction, UpdateTransactionInput } from '../types/transaction.types';

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId() {
  return `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function roundTo2(value: number) {
  return Math.round(value * 100) / 100;
}

function addMonths(dateISO: string, months: number): string {
  const date = new Date(dateISO);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
}

/**
 * TransactionService
 * Toda a comunicação de dados de transações passa por aqui.
 * Mantém um array em memória (cópia do mock) para que criar/editar/
 * excluir funcione de forma consistente durante a sessão do app,
 * simulando o comportamento futuro de uma API real.
 */
class TransactionServiceImpl {
  private transactions: MockTransaction[] = [...MOCK_TRANSACTIONS];

  async getAll(): Promise<Transaction[]> {
    await delay();
    return this.transactions
      .map(mapMockTransactionToTransaction)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  async getById(id: string): Promise<Transaction | undefined> {
    await delay(150);
    const found = this.transactions.find((t) => t.id === id);
    return found ? mapMockTransactionToTransaction(found) : undefined;
  }

  /**
   * Se a despesa for parcelada, expande em N transações independentes,
   * todas compartilhando o mesmo `installmentGroupId` — exatamente como
   * descrito na spec (cada parcela é uma transação própria).
   */
  async create(input: CreateTransactionInput): Promise<Transaction[]> {
    await delay();

    const isInstallment = input.type === 'expense' && input.installments?.isInstallment;
    const total = isInstallment ? Math.max(input.installments?.total ?? 1, 1) : 1;
    const installmentGroupId = isInstallment ? `group-${generateId()}` : undefined;
    const installmentAmount = isInstallment ? roundTo2(input.amount / total) : input.amount;

    const created: MockTransaction[] = Array.from({ length: total }).map((_, index) => ({
      id: generateId(),
      description: total > 1 ? `${input.description} (${index + 1}/${total})` : input.description,
      amount: input.type === 'expense' ? -installmentAmount : installmentAmount,
      date: addMonths(input.date, index),
      type: input.type,
      paymentMethodId: input.paymentMethodId,
      icon: input.type === 'income' ? 'ArrowDownToLine' : 'ShoppingCart',
      installmentGroupId,
      installmentNumber: total > 1 ? index + 1 : undefined,
      installmentTotal: total > 1 ? total : undefined,
      notes: input.notes,
    }));

    this.transactions = [...created, ...this.transactions];
    return created.map(mapMockTransactionToTransaction);
  }

  async update(input: UpdateTransactionInput): Promise<Transaction | undefined> {
    await delay();
    const index = this.transactions.findIndex((t) => t.id === input.id);
    if (index === -1) return undefined;

    const current = this.transactions[index];
    const updated: MockTransaction = {
      ...current,
      description: input.description ?? current.description,
      date: input.date ?? current.date,
      paymentMethodId: input.paymentMethodId ?? current.paymentMethodId,
      notes: input.notes ?? current.notes,
      amount:
        input.amount !== undefined
          ? current.type === 'expense'
            ? -Math.abs(input.amount)
            : Math.abs(input.amount)
          : current.amount,
    };

    this.transactions[index] = updated;
    return mapMockTransactionToTransaction(updated);
  }

  async remove(id: string): Promise<void> {
    await delay(200);
    this.transactions = this.transactions.filter((t) => t.id !== id);
  }

  async duplicate(id: string): Promise<Transaction | undefined> {
    await delay(200);
    const original = this.transactions.find((t) => t.id === id);
    if (!original) return undefined;

    const copy: MockTransaction = {
      ...original,
      id: generateId(),
      description: `${original.description} (cópia)`,
      installmentGroupId: undefined,
      installmentNumber: undefined,
      installmentTotal: undefined,
    };
    this.transactions = [copy, ...this.transactions];
    return mapMockTransactionToTransaction(copy);
  }
}

export const TransactionService = new TransactionServiceImpl();
