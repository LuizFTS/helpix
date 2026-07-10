import { z } from 'zod';

/**
 * Schema único usado tanto para criação quanto para edição.
 * `installmentTotal` só é obrigatório quando type === 'expense' e
 * isInstallment === true, validado via `.refine` para manter uma
 * única fonte de verdade.
 */
export const transactionFormSchema = z
  .object({
    type: z.enum(['income', 'expense']),
    description: z.string().min(2, 'Informe uma descrição').max(80),
    amount: z
      .number({ invalid_type_error: 'Informe um valor' })
      .positive('O valor deve ser maior que zero'),
    date: z.string().min(1, 'Selecione uma data'),
    paymentMethodId: z.string().min(1, 'Selecione um método de pagamento'),
    notes: z.string().max(280).optional(),
    isInstallment: z.boolean(),
    installmentTotal: z.number().int().min(2).max(48).optional(),
  })
  .refine(
    (data) => (data.type === 'expense' && data.isInstallment ? !!data.installmentTotal : true),
    { message: 'Informe a quantidade de parcelas', path: ['installmentTotal'] }
  );

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const transactionFormDefaultValues: TransactionFormValues = {
  type: 'expense',
  description: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  paymentMethodId: '',
  notes: '',
  isInstallment: false,
  installmentTotal: undefined,
};
