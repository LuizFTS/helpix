import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import { MOCK_PAYMENT_METHODS, MOCK_TRANSACTIONS } from '../../shared/constants/mockData';

/**
 * Popula o Firestore com os mesmos dados que usávamos no mock, uma
 * única vez. Verifica se a coleção já tem dados antes de escrever, pra
 * não duplicar se for chamado mais de uma vez sem querer.
 *
 * Uso: chamado por um botão temporário na tela "Mais" (ver
 * app/(tabs)/mais.tsx). Pode ser removido depois que os dados reais
 * do usuário substituírem o mock.
 */
export async function seedFirestoreIfEmpty(): Promise<{ seeded: boolean; message: string }> {
  const paymentMethodsSnapshot = await getDocs(collection(db, 'paymentMethods'));

  if (!paymentMethodsSnapshot.empty) {
    return { seeded: false, message: 'Já existem dados no Firestore — nada foi alterado.' };
  }

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  MOCK_PAYMENT_METHODS.forEach((pm) => {
    const { id, ...rest } = pm;
    batch.set(doc(db, 'paymentMethods', id), rest);
  });

  MOCK_TRANSACTIONS.forEach((tx) => {
    const { id, ...rest } = tx;
    batch.set(doc(db, 'transactions', id), {
      description: rest.description,
      amount: Math.abs(rest.amount),
      date: rest.date,
      type: rest.type,
      paymentMethodId: rest.paymentMethodId,
      installmentGroupId: rest.installmentGroupId,
      installmentNumber: rest.installmentNumber,
      installmentTotal: rest.installmentTotal,
      notes: rest.notes,
      createdAt: now,
      updatedAt: now,
    });
  });

  await batch.commit();

  return {
    seeded: true,
    message: `${MOCK_PAYMENT_METHODS.length} métodos de pagamento e ${MOCK_TRANSACTIONS.length} transações criados.`,
  };
}
