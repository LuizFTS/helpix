/**
 * Ícones disponíveis pro usuário escolher ao criar um método de
 * pagamento. Cada `name` precisa bater com um export válido de
 * `lucide-react-native` — é isso que `PaymentMethodListItem` (e
 * qualquer outro lugar que resolva `paymentMethod.icon` dinamicamente)
 * usa pra encontrar o componente do ícone.
 *
 * Lista curta de propósito — cobre os casos mais comuns (cartão, PIX/
 * QR code, dinheiro, banco, carteira, recebimento) sem virar um
 * seletor genérico de milhares de ícones.
 */
export const PAYMENT_METHOD_ICONS = [
  'CreditCard',
  'QrCode',
  'Wallet',
  'Banknote',
  'Landmark',
  'PiggyBank',
  'Smartphone',
  'ArrowDownToLine',
] as const;

export type PaymentMethodIconName = (typeof PAYMENT_METHOD_ICONS)[number];

/** Ícone padrão sugerido pelo tipo, mesma regra que já existia no Service. */
export function defaultIconForType(type: 'income' | 'expense'): PaymentMethodIconName {
  return type === 'income' ? 'ArrowDownToLine' : 'CreditCard';
}
