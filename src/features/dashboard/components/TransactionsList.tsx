import React from 'react';
import { View } from 'react-native';
import { TransactionItem, EmptyState } from '../../../shared/components';
import { Transaction } from '../../transactions/types/transaction.types';

type TransactionsListProps = {
  transactions: Transaction[];
  paymentMethodsById: Map<string, string>;
  onPressTransaction: (id: string) => void;
  onLongPressTransaction?: (id: string) => void;
  selectionMode?: boolean;
  selectedIds?: Set<string>;
};

export function TransactionsList({
  transactions,
  paymentMethodsById,
  onPressTransaction,
  onLongPressTransaction,
  selectionMode = false,
  selectedIds,
}: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState title="Nenhuma movimentação" description="Toque no + para cadastrar a primeira." />
    );
  }

  return (
    <View>
      {transactions.map((transaction, index) => (
        <TransactionItem
          key={transaction.id}
          index={index}
          onPress={onPressTransaction}
          onLongPress={onLongPressTransaction}
          selectionMode={selectionMode}
          selected={selectedIds?.has(transaction.id)}
          transaction={{
            id: transaction.id,
            description: transaction.description,
            amount: transaction.type === 'expense' ? -transaction.amount : transaction.amount,
            date: transaction.date,
            icon: transaction.installmentGroupId ? 'CreditCard' : 'Circle',
            paymentMethodName: paymentMethodsById.get(transaction.paymentMethodId) ?? '—',
          }}
        />
      ))}
    </View>
  );
}
