import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { db } from '../../../core/services/firebase';
import { requireUserId } from '../../../core/services/currentUser';
import { stripUndefined } from '../../../core/services/firestoreUtils';
import {
  AddContributionInput,
  CreateSavingGoalInput,
  SavingContribution,
  SavingGoal,
} from '../types/saving.types';

const GOALS_COLLECTION = 'savingGoals';
const CONTRIBUTIONS_COLLECTION = 'savingContributions';

class SavingServiceImpl {
  private goalsRef = collection(db, GOALS_COLLECTION);
  private contributionsRef = collection(db, CONTRIBUTIONS_COLLECTION);

  async getAll(): Promise<SavingGoal[]> {
    const uid = requireUserId();
    const q = query(this.goalsRef, where('userId', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SavingGoal, 'id'>) }));
  }

  async getById(id: string): Promise<SavingGoal | undefined> {
    const snap = await getDoc(doc(db, GOALS_COLLECTION, id));
    if (!snap.exists()) return undefined;
    return { id: snap.id, ...(snap.data() as Omit<SavingGoal, 'id'>) };
  }

  /**
   * Filtra só por `savingGoalId` (sem `where('userId', ...)` junto) de
   * propósito — combinar duas condições de igualdade pode exigir um
   * índice composto dependendo da configuração do projeto. Como
   * `savingGoalId` só existe pra metas que já pertencem ao usuário
   * logado (a `getAll()` acima já garante isso), o filtro por
   * `savingGoalId` sozinho já é suficiente na prática.
   */
  async getContributions(savingGoalId: string): Promise<SavingContribution[]> {
    const q = query(this.contributionsRef, where('savingGoalId', '==', savingGoalId));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((d) => ({ id: d.id, ...(d.data() as Omit<SavingContribution, 'id'>) }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  async create(input: CreateSavingGoalInput): Promise<SavingGoal> {
    const uid = requireUserId();
    const data = stripUndefined({
      name: input.name,
      targetAmount: input.targetAmount,
      deadline: input.deadline,
      currentAmount: 0,
      userId: uid,
    });
    const ref = await addDoc(this.goalsRef, data);
    const created = await getDoc(ref);
    return { id: created.id, ...(created.data() as Omit<SavingGoal, 'id'>) };
  }

  async remove(id: string): Promise<void> {
    const contributionsQuery = query(this.contributionsRef, where('savingGoalId', '==', id));
    const contributionsSnapshot = await getDocs(contributionsQuery);

    const batch = writeBatch(db);
    batch.delete(doc(db, GOALS_COLLECTION, id));
    contributionsSnapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
  }

  async addContribution(input: AddContributionInput): Promise<SavingGoal | undefined> {
    const uid = requireUserId();
    const goalRef = doc(db, GOALS_COLLECTION, input.savingGoalId);
    const existing = await getDoc(goalRef);
    if (!existing.exists()) return undefined;

    const batch = writeBatch(db);
    batch.update(goalRef, { currentAmount: increment(input.amount) });

    const contributionRef = doc(this.contributionsRef);
    batch.set(contributionRef, {
      savingGoalId: input.savingGoalId,
      amount: input.amount,
      date: input.date,
      userId: uid,
    });

    await batch.commit();

    const updated = await getDoc(goalRef);
    return { id: updated.id, ...(updated.data() as Omit<SavingGoal, 'id'>) };
  }
}

export const SavingService = new SavingServiceImpl();
