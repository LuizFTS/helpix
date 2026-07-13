export type SavingGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  userId?: string;
};

export type SavingContribution = {
  id: string;
  savingGoalId: string;
  amount: number;
  date: string;
  userId?: string;
};

export type SavingGoalWithProgress = SavingGoal & {
  percentage: number;
  remaining: number;
};

export type CreateSavingGoalInput = {
  name: string;
  targetAmount: number;
  deadline: string;
};

export type AddContributionInput = {
  savingGoalId: string;
  amount: number;
  date: string;
};
