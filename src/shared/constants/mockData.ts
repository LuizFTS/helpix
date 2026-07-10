import { SavingGoal } from '../../features/savings/types/saving.types';
import { PaymentMethod } from '../types/paymentMethod.types';

/**
 * Dados mockados centralizados. Nenhuma tela ou componente deve importar
 * isso diretamente — sempre passe pelos Services (PaymentMethodService,
 * TransactionService). Quando o backend existir, só os Services mudam.
 */

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm-nubank', name: 'Nubank', type: 'credit', icon: 'CreditCard', color: '#8B2FD1' },
  { id: 'pm-santander', name: 'Santander', type: 'credit', icon: 'CreditCard', color: '#E4291A' },
  { id: 'pm-itau', name: 'Itaú', type: 'credit', icon: 'CreditCard', color: '#FF7A00' },
  { id: 'pm-pix', name: 'PIX', type: 'pix', icon: 'QrCode', color: '#4F7CFF' },
  { id: 'pm-entradas', name: 'Entradas', type: 'income', icon: 'ArrowDownToLine', color: '#3DDC84' },
];

export type MockTransaction = {
  id: string;
  description: string;
  amount: number; // positivo = receita, negativo = despesa
  date: string; // ISO
  type: 'income' | 'expense';
  paymentMethodId: string;
  icon: string;
  installmentGroupId?: string;
  installmentNumber?: number;
  installmentTotal?: number;
  notes?: string;
};

export const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: 'tx-1',
    description: 'Supermercado',
    amount: -420.5,
    date: '2026-07-24',
    type: 'expense',
    paymentMethodId: 'pm-nubank',
    icon: 'ShoppingCart',
  },
  {
    id: 'tx-2',
    description: 'Jantar Outback',
    amount: -180,
    date: '2026-07-23',
    type: 'expense',
    paymentMethodId: 'pm-santander',
    icon: 'UtensilsCrossed',
  },
  {
    id: 'tx-3',
    description: 'Conta de Luz',
    amount: -155.2,
    date: '2026-07-22',
    type: 'expense',
    paymentMethodId: 'pm-pix',
    icon: 'FileText',
  },
  {
    id: 'tx-4',
    description: 'Transferência Recebida',
    amount: 200,
    date: '2026-07-21',
    type: 'income',
    paymentMethodId: 'pm-nubank',
    icon: 'ArrowDownToLine',
  },
  {
    id: 'tx-5',
    description: 'Salário',
    amount: 4800,
    date: '2026-07-05',
    type: 'income',
    paymentMethodId: 'pm-entradas',
    icon: 'Wallet',
  },
  {
    id: 'tx-6',
    description: 'Notebook (1/10)',
    amount: -400,
    date: '2026-07-10',
    type: 'expense',
    paymentMethodId: 'pm-itau',
    icon: 'Laptop',
    installmentGroupId: 'group-notebook',
    installmentNumber: 1,
    installmentTotal: 10,
  },
  {
    id: 'tx-7',
    description: 'Farmácia',
    amount: -89.9,
    date: '2026-07-18',
    type: 'expense',
    paymentMethodId: 'pm-pix',
    icon: 'Pill',
  },
];

export const MOCK_PREVIOUS_BALANCE = 1500;

export type MockSavingContribution = {
  id: string;
  savingGoalId: string;
  amount: number;
  date: string;
};

export const MOCK_SAVING_GOALS: SavingGoal[] = [
  {
    id: 'goal-japao',
    name: 'Viagem Japão',
    targetAmount: 15000,
    currentAmount: 7800,
    deadline: '2027-03-01',
  },
  {
    id: 'goal-emergencia',
    name: 'Reserva de Emergência',
    targetAmount: 10000,
    currentAmount: 6200,
    deadline: '2026-12-01',
  },
  {
    id: 'goal-notebook',
    name: 'Notebook Novo',
    targetAmount: 6000,
    currentAmount: 6000,
    deadline: '2026-08-01',
  },
];

export const MOCK_SAVING_CONTRIBUTIONS: MockSavingContribution[] = [
  { id: 'contrib-1', savingGoalId: 'goal-japao', amount: 2000, date: '2026-05-10' },
  { id: 'contrib-2', savingGoalId: 'goal-japao', amount: 3000, date: '2026-06-10' },
  { id: 'contrib-3', savingGoalId: 'goal-japao', amount: 2800, date: '2026-07-10' },
  { id: 'contrib-4', savingGoalId: 'goal-emergencia', amount: 3200, date: '2026-06-01' },
  { id: 'contrib-5', savingGoalId: 'goal-emergencia', amount: 3000, date: '2026-07-01' },
  { id: 'contrib-6', savingGoalId: 'goal-notebook', amount: 6000, date: '2026-04-01' },
];
