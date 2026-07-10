export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  description: string;
  amount: number; // sempre positivo; o sinal é derivado de `type`
  date: string; // ISO 8601
  type: TransactionType;
  paymentMethodId: string;
  installmentGroupId?: string;
  installmentNumber?: number;
  installmentTotal?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTransactionInput = {
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  paymentMethodId: string;
  notes?: string;
  installments?: {
    isInstallment: boolean;
    total?: number;
  };
};

export type UpdateTransactionInput = Partial<
  Omit<CreateTransactionInput, 'installments'>
> & {
  id: string;
};
