import { collection, getDocs, addDoc, writeBatch, doc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { requireUserId } from './currentUser';
import { stripUndefined } from './firestoreUtils';
import { MOCK_PAYMENT_METHODS, MOCK_TRANSACTIONS } from '../../shared/constants/mockData';

/**
 * Popula o Firestore com dados de exemplo pra CONTA LOGADA (userId).
 * Verifica se já existem métodos de pagamento pra esse usuário antes
 * de escrever, pra não duplicar.
 *
 * Diferente da primeira versão (pré-isolamento por usuário): os
 * métodos de pagamento agora ganham um ID novo, gerado pelo Firestore
 * (não mais o ID fixo do mock, tipo "pm-nubank") — por isso mantemos
 * um mapa local (mockId -> id real) pra apontar `paymentMethodId` das
 * transações pro documento certo.
 */
export async function seedFirestoreIfEmpty(): Promise<{ seeded: boolean; message: string }> {
  const uid = requireUserId();

  const existingQuery = query(collection(db, 'paymentMethods'), where('userId', '==', uid));
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    return { seeded: false, message: 'Já existem dados pra essa conta — nada foi alterado.' };
  }

  const mockIdToRealId = new Map<string, string>();

  for (const pm of MOCK_PAYMENT_METHODS) {
    const { id: mockId, ...rest } = pm;
    const ref = await addDoc(collection(db, 'paymentMethods'), stripUndefined({ ...rest, userId: uid }));
    mockIdToRealId.set(mockId, ref.id);
  }

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  MOCK_TRANSACTIONS.forEach((tx) => {
    const ref = doc(collection(db, 'transactions'));
    batch.set(
      ref,
      stripUndefined({
        description: tx.description,
        amount: Math.abs(tx.amount),
        date: tx.date,
        type: tx.type,
        paymentMethodId: mockIdToRealId.get(tx.paymentMethodId) ?? tx.paymentMethodId,
        installmentGroupId: tx.installmentGroupId,
        installmentNumber: tx.installmentNumber,
        installmentTotal: tx.installmentTotal,
        notes: tx.notes,
        createdAt: now,
        updatedAt: now,
        userId: uid,
      })
    );
  });

  await batch.commit();

  return {
    seeded: true,
    message: `${MOCK_PAYMENT_METHODS.length} métodos de pagamento e ${MOCK_TRANSACTIONS.length} transações criados pra sua conta.`,
  };
}
