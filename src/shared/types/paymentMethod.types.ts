export type PaymentMethodType = 'credit' | 'pix' | 'cash' | 'income' | 'expense';

export type PaymentMethod = {
  id: string;
  name: string;
  type: PaymentMethodType;
  icon: string;
  color: string;
  userId?: string;
};

export type CreatePaymentMethodInput = {
  name: string;
  type: 'income' | 'expense';
  color: string;
  /** Opcional — se não vier, o Service escolhe um padrão pelo `type` (comportamento antigo). */
  icon?: string;
};
