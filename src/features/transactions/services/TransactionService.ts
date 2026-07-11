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
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../../../core/services/firebase';
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

/**
 * TransactionService — mesma interface pública de antes. Os documentos
 * no Firestore têm exatamente o formato de `Transaction` (sem mais
 * precisar de um mapper "mock -> domínio", já que agora o dado já
 * nasce no formato certo).
 */
class TransactionServiceImpl {
  private collectionRef = collection(db, COLLECTION);

  async getAll(): Promise<Transaction[]> {
    const q = query(this.collectionRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToTransaction);
  }

  async getById(id: string): Promise<Transaction | undefined> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return undefined;
    return { id: snap.id, ...(snap.data() as Omit<Transaction, 'id'>) };
  }

  /**
   * Se a despesa for parcelada, expande em N documentos independentes
   * (um por mês), todos com o mesmo `installmentGroupId` — escritos
   * atomicamente com `writeBatch`.
   */
  async create(input: CreateTransactionInput): Promise<Transaction[]> {
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
      };
      batch.set(ref, data);
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

    await updateDoc(ref, updates);
    const updated = await getDoc(ref);
    return { id: updated.id, ...(updated.data() as Omit<Transaction, 'id'>) };
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
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

    const ref = await addDoc(this.collectionRef, data);
    const created = await getDoc(ref);
    return { id: created.id, ...(created.data() as Omit<Transaction, 'id'>) };
  }
}

export const TransactionService = new TransactionServiceImpl();
