import { SavingGoal, SavingGoalWithProgress } from '../types/saving.types';

export function withProgress(goal: SavingGoal): SavingGoalWithProgress {
  const percentage =
    goal.targetAmount > 0 ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100) : 0;

  return {
    ...goal,
    percentage,
    remaining: Math.max(goal.targetAmount - goal.currentAmount, 0),
  };
}
