import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { CreatePaymentMethodInput, PaymentMethod } from '../../shared/types/paymentMethod.types';
import { defaultIconForType } from '../../shared/constants/paymentMethodIcons';
import { requireUserId } from './currentUser';
import { db } from './firebase';
import { stripUndefined } from './firestoreUtils';

const COLLECTION = 'paymentMethods';

class PaymentMethodServiceImpl {
  private collectionRef = collection(db, COLLECTION);

  async getAll(): Promise<PaymentMethod[]> {
    const uid = requireUserId();
    const q = query(this.collectionRef, where('userId', '==', uid));
    const snapshot = await getDocs(q);
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

  /**
   * Cria um método de pagamento customizado pelo usuário. O ícone é o
   * que o usuário escolheu na tela (`input.icon`); se por algum
   * motivo não vier nenhum (ex: chamada antiga do Service), cai no
   * padrão automático por tipo — mesmo comportamento de antes da
   * etapa do seletor de ícones.
   */
  async create(input: CreatePaymentMethodInput): Promise<PaymentMethod> {
    const uid = requireUserId();
    const data = stripUndefined({
      name: input.name,
      type: input.type,
      icon: input.icon ?? defaultIconForType(input.type),
      color: input.color,
      userId: uid,
    });
    const ref = await addDoc(this.collectionRef, data);
    const created = await getDoc(ref);
    return { id: created.id, ...(created.data() as Omit<PaymentMethod, 'id'>) };
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }
}

export const PaymentMethodService = new PaymentMethodServiceImpl();
