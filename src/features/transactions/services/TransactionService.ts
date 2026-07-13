import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../../../core/services/firebase';
import { requireUserId } from '../../../core/services/currentUser';
import { stripUndefined } from '../../../core/services/firestoreUtils';
import { CreateTransactionInput, Transaction, UpdateTransactionInput } from '../types/transaction.types';

const COLLECTION = 'transactions';

function generateGroupId() {
  return `group-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function roundTo2(value: number) {
  return Math.round(value * 100) / 100;
}

function addMonths(dateISO: string, months: number): string {
  const date = new Date(dateISO);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
}

function docToTransaction(snap: QueryDocumentSnapshot<DocumentData>): Transaction {
  return { id: snap.id, ...(snap.data() as Omit<Transaction, 'id'>) };
}

class TransactionServiceImpl {
  private collectionRef = collection(db, COLLECTION);

  async getAll(): Promise<Transaction[]> {
    const uid = requireUserId();
    // Sem `orderBy` no servidor de propósito: combinar `where` +
    // `orderBy` em campos diferentes exige um índice composto no
    // Firestore. Como a lista de transações nunca é gigante (é uso
    // pessoal), ordenar no cliente evita essa dor de configuração.
    const q = query(this.collectionRef, where('userId', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToTransaction).sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  async getById(id: string): Promise<Transaction | undefined> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return undefined;
    return { id: snap.id, ...(snap.data() as Omit<Transaction, 'id'>) };
  }

  async create(input: CreateTransactionInput): Promise<Transaction[]> {
    const uid = requireUserId();
    const isInstallment = input.type === 'expense' && input.installments?.isInstallment;
    const total = isInstallment ? Math.max(input.installments?.total ?? 1, 1) : 1;
    const installmentGroupId = isInstallment ? generateGroupId() : undefined;
    const installmentAmount = isInstallment ? roundTo2(input.amount / total) : input.amount;

    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const refs = Array.from({ length: total }).map(() => doc(this.collectionRef));

    refs.forEach((ref, index) => {
      const data: Omit<Transaction, 'id'> = {
        description: total > 1 ? `${input.description} (${index + 1}/${total})` : input.description,
        amount: installmentAmount,
        date: addMonths(input.date, index),
        type: input.type,
        paymentMethodId: input.paymentMethodId,
        installmentGroupId,
        installmentNumber: total > 1 ? index + 1 : undefined,
        installmentTotal: total > 1 ? total : undefined,
        notes: input.notes,
        createdAt: now,
        updatedAt: now,
        userId: uid,
      };
      batch.set(ref, stripUndefined(data));
    });

    await batch.commit();

    const created = await Promise.all(refs.map((ref) => getDoc(ref)));
    return created.map((snap) => ({ id: snap.id, ...(snap.data() as Omit<Transaction, 'id'>) }));
  }

  async update(input: UpdateTransactionInput): Promise<Transaction | undefined> {
    const ref = doc(db, COLLECTION, input.id);
    const existing = await getDoc(ref);
    if (!existing.exists()) return undefined;

    const updates: Partial<Transaction> = { updatedAt: new Date().toISOString() };
    if (input.description !== undefined) updates.description = input.description;
    if (input.date !== undefined) updates.date = input.date;
    if (input.paymentMethodId !== undefined) updates.paymentMethodId = input.paymentMethodId;
    if (input.notes !== undefined) updates.notes = input.notes;
    if (input.amount !== undefined) updates.amount = Math.abs(input.amount);

    await updateDoc(ref, stripUndefined(updates));
    const updated = await getDoc(ref);
    return { id: updated.id, ...(updated.data() as Omit<Transaction, 'id'>) };
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }

  async removeMany(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const batch = writeBatch(db);
    ids.forEach((id) => batch.delete(doc(db, COLLECTION, id)));
    await batch.commit();
  }

  async duplicate(id: string): Promise<Transaction | undefined> {
    const original = await getDoc(doc(db, COLLECTION, id));
    if (!original.exists()) return undefined;

    const originalData = original.data() as Omit<Transaction, 'id'>;
    const now = new Date().toISOString();
    const data: Omit<Transaction, 'id'> = {
      ...originalData,
      description: `${originalData.description} (cópia)`,
      installmentGroupId: undefined,
      installmentNumber: undefined,
      installmentTotal: undefined,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await addDoc(this.collectionRef, stripUndefined(data));
    const created = await getDoc(ref);
    return { id: created.id, ...(created.data() as Omit<Transaction, 'id'>) };
  }
}

export const TransactionService = new TransactionServiceImpl();
