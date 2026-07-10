import { MOCK_PAYMENT_METHODS } from '../../shared/constants/mockData';
import { PaymentMethod } from '../../shared/types/paymentMethod.types';

/**
 * Fica em `src/core/services` (e não dentro de uma feature) porque é
 * consumido tanto pelo Dashboard quanto por Transactions.
 * Hoje retorna dados mockados; trocar por uma API real no futuro não
 * deve exigir mudanças nas telas ou hooks que o consomem.
 */
class PaymentMethodServiceImpl {
  async getAll(): Promise<PaymentMethod[]> {
    await delay();
    return MOCK_PAYMENT_METHODS;
  }

  async getById(id: string): Promise<PaymentMethod | undefined> {
    await delay(150);
    return MOCK_PAYMENT_METHODS.find((pm) => pm.id === id);
  }
}

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const PaymentMethodService = new PaymentMethodServiceImpl();
