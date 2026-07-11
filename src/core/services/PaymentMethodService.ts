import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { PaymentMethod } from '../../shared/types/paymentMethod.types';

const COLLECTION = 'paymentMethods';

/**
 * Mesma interface pública de antes (getAll/getById) — só a implementação
 * interna mudou de "array mockado" pra Firestore. Nenhuma tela, hook ou
 * componente que consome este Service precisou mudar.
 */
class PaymentMethodServiceImpl {
  private collectionRef = collection(db, COLLECTION);

  async getAll(): Promise<PaymentMethod[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<PaymentMethod, 'id'>),
    }));
  }

  async getById(id: string): Promise<PaymentMethod | undefined> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return undefined;
    return { id: snap.id, ...(snap.data() as Omit<PaymentMethod, 'id'>) };
  }
}

export const PaymentMethodService = new PaymentMethodServiceImpl();
