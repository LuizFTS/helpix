import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../../../core/services/firebase';
import { requireUserId } from '../../../core/services/currentUser';
import { stripUndefined } from '../../../core/services/firestoreUtils';
import {
  Scenario,
  ScenarioSummary,
  CreateScenarioInput,
  UpdateScenarioInput,
} from '../types';
import { toScenarioSummary } from '../mappers/planning.mapper';

/**
 * Nome da coleção no Firestore. Seguindo o mesmo padrão já usado por
 * `transactions`/`paymentMethods`/`savingGoals`: coleção "flat" no
 * nível raiz (não subcoleção por usuário), com um campo `userId` +
 * `where('userId', '==', uid)` em toda leitura. A etapa sugeria
 * `users/{userId}/planningScenarios/{scenarioId}` como alternativa,
 * mas o padrão real e consistente já usado por TODO o resto do
 * projeto é o flat + where — seguido aqui pra manter uma única
 * convenção em todo o app (registrado como decisão no `.md` desta
 * etapa).
 */
const COLLECTION = 'planningScenarios';

function docToScenario(snap: QueryDocumentSnapshot<DocumentData>): Scenario {
  return { id: snap.id, ...(snap.data() as Omit<Scenario, 'id'>) };
}

class PlanningServiceImpl {
  private collectionRef = collection(db, COLLECTION);

  async getScenarios(): Promise<ScenarioSummary[]> {
    const uid = requireUserId();
    const q = query(this.collectionRef, where('userId', '==', uid));
    const snapshot = await getDocs(q);
    // Sem `orderBy` no servidor de propósito — mesmo motivo já
    // documentado em `TransactionService.getAll`: evita precisar de
    // índice composto no Firestore só pra ordenar uma lista pessoal
    // que nunca é grande. Mais recente primeiro.
    return snapshot.docs
      .map(docToScenario)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .map(toScenarioSummary);
  }

  async getScenario(id: string): Promise<Scenario | undefined> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return undefined;
    return { id: snap.id, ...(snap.data() as Omit<Scenario, 'id'>) };
  }

  async createScenario(input: CreateScenarioInput): Promise<Scenario> {
    const uid = requireUserId();
    const now = new Date().toISOString();
    const data: Omit<Scenario, 'id'> = {
      userId: uid,
      name: input.name,
      description: input.description,
      status: 'draft',
      projectionMonths: input.projectionMonths,
      initialBalance: input.initialBalance,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await addDoc(this.collectionRef, stripUndefined(data));
    const created = await getDoc(ref);
    return { id: created.id, ...(created.data() as Omit<Scenario, 'id'>) };
  }

  async updateScenario(id: string, input: UpdateScenarioInput): Promise<Scenario> {
    const ref = doc(db, COLLECTION, id);
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      throw new Error('Cenário não encontrado.');
    }

    const updates: Partial<Scenario> = { updatedAt: new Date().toISOString() };
    if (input.name !== undefined) updates.name = input.name;
    if (input.description !== undefined) updates.description = input.description;
    if (input.projectionMonths !== undefined) updates.projectionMonths = input.projectionMonths;
    if (input.initialBalance !== undefined) updates.initialBalance = input.initialBalance;
    if (input.status !== undefined) updates.status = input.status;

    await updateDoc(ref, stripUndefined(updates));
    const updated = await getDoc(ref);
    return { id: updated.id, ...(updated.data() as Omit<Scenario, 'id'>) };
  }

  async deleteScenario(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }

  /**
   * Duplica um cenário existente — copia nome (com sufixo),
   * descrição, saldo inicial e meses de projeção. `status` sempre
   * volta pra `'draft'` na cópia (mesmo que o original estivesse
   * `active`/`archived`), já que uma duplicata é sempre um novo
   * rascunho. Não copia eventos — ainda não existem nesta etapa.
   */
  async duplicateScenario(id: string): Promise<Scenario> {
    const original = await this.getScenario(id);
    if (!original) {
      throw new Error('Cenário não encontrado.');
    }

    const now = new Date().toISOString();
    const data: Omit<Scenario, 'id'> = {
      userId: original.userId,
      name: `${original.name} (Cópia)`,
      description: original.description,
      status: 'draft',
      projectionMonths: original.projectionMonths,
      initialBalance: original.initialBalance,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await addDoc(this.collectionRef, stripUndefined(data));
    const created = await getDoc(ref);
    return { id: created.id, ...(created.data() as Omit<Scenario, 'id'>) };
  }
}

export const PlanningService = new PlanningServiceImpl();
