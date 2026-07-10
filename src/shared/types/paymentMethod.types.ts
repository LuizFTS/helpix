export type PaymentMethodType = 'credit' | 'pix' | 'cash' | 'income';

export type PaymentMethod = {
  id: string;
  name: string;
  type: PaymentMethodType;
  icon: string; // nome do ícone (lucide-react-native)
  color: string;
};
