import {
  MOCK_SAVING_GOALS,
  MOCK_SAVING_CONTRIBUTIONS,
  MockSavingContribution,
} from '../../../shared/constants/mockData';
import { AddContributionInput, SavingContribution, SavingGoal } from '../types/saving.types';

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId() {
  return `contrib-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * SavingService — mesma convenção dos outros Services: nenhuma tela
 * acessa os arrays mockados diretamente. Mantém estado em memória pra
 * que "adicionar aporte" atualize o saldo da meta e o histórico
 * durante a sessão do app.
 */
class SavingServiceImpl {
  private goals: SavingGoal[] = [...MOCK_SAVING_GOALS];
  private contributions: MockSavingContribution[] = [...MOCK_SAVING_CONTRIBUTIONS];

  async getAll(): Promise<SavingGoal[]> {
    await delay();
    return this.goals;
  }

  async getById(id: string): Promise<SavingGoal | undefined> {
    await delay(150);
    return this.goals.find((g) => g.id === id);
  }

  async getContributions(savingGoalId: string): Promise<SavingContribution[]> {
    await delay(150);
    return this.contributions
      .filter((c) => c.savingGoalId === savingGoalId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  async addContribution(input: AddContributionInput): Promise<SavingGoal | undefined> {
    await delay();

    const goalIndex = this.goals.findIndex((g) => g.id === input.savingGoalId);
    if (goalIndex === -1) return undefined;

    this.contributions = [
      { id: generateId(), savingGoalId: input.savingGoalId, amount: input.amount, date: input.date },
      ...this.contributions,
    ];

    const updatedGoal: SavingGoal = {
      ...this.goals[goalIndex],
      currentAmount: this.goals[goalIndex].currentAmount + input.amount,
    };
    this.goals[goalIndex] = updatedGoal;

    return updatedGoal;
  }
}

export const SavingService = new SavingServiceImpl();
