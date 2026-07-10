export type SavingGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date
};

export type SavingContribution = {
  id: string;
  savingGoalId: string;
  amount: number;
  date: string; // ISO
};

export type SavingGoalWithProgress = SavingGoal & {
  percentage: number; // 0-100, arredondado
  remaining: number; // valor que falta pra bater a meta
};

export type AddContributionInput = {
  savingGoalId: string;
  amount: number;
  date: string;
};
