/**
 * Modelagem dos eventos que compõem um cenário — cada evento é uma
 * "coisa que acontece" na linha do tempo da simulação (uma compra
 * parcelada, uma mudança de renda, uma contribuição pra meta de
 * economia, etc.).
 *
 * Etapa 02 (modelagem): só a forma dos dados. Nenhuma regra de
 * negócio, nenhum cálculo de projeção — isso é escopo do Projection
 * Engine, numa etapa futura ainda não especificada em detalhe.
 */

/**
 * Todos os tipos de evento previstos pro domínio, mesmo que algumas
 * variantes ainda não sejam usadas nas próximas etapas imediatas —
 * a ideia é deixar o domínio preparado, conforme pedido nesta etapa,
 * em vez de ter que estender o union type (e quebrar exhaustiveness
 * checks) toda vez que um novo tipo de evento for suportado.
 */
export type EventType =
  | 'purchase'
  | 'income'
  | 'expense'
  | 'incomeChange'
  | 'recurringExpense'
  | 'recurringIncome'
  | 'savingContribution';

/**
 * Frequência de recorrência — reutilizada por qualquer evento
 * recorrente (`RecurringExpenseEvent`, `RecurringIncomeEvent`).
 * `oneTime` existe pra cobrir o caso de um evento "recorrente" que na
 * prática só acontece uma vez (ex: recorrência cancelada logo após
 * criada) sem precisar de um tipo de evento totalmente separado.
 */
export type Frequency = 'monthly' | 'quarterly' | 'semiannual' | 'yearly' | 'oneTime';

/**
 * Campos comuns a todo evento de cenário. Os tipos específicos (ver
 * abaixo) estendem esta base e adicionam `type` como discriminante +
 * seus próprios campos — mesmo padrão de discriminated union já
 * conhecido do TypeScript, pensado pra permitir `switch (event.type)`
 * com narrowing automático quando o Projection Engine for
 * implementado.
 */
export type ScenarioEvent = {
  id: string;
  scenarioId: string;
  type: EventType;
  title: string;
  description?: string;
  createdAt: string;
};

/** Compra (geralmente parcelada) — ex: "Notebook novo em 12x". */
export type PurchaseEvent = ScenarioEvent & {
  type: 'purchase';
  amount: number;
  installments: number;
  /** Taxa de juros do parcelamento, se houver (0 pra "sem juros"). */
  interestRate: number;
  firstInstallmentDate: string;
};

/** Entrada pontual de dinheiro — ex: "13º salário", "venda de um bem". */
export type IncomeEvent = ScenarioEvent & {
  type: 'income';
  amount: number;
  date: string;
};

/** Saída pontual de dinheiro — ex: "viagem", "reforma". */
export type ExpenseEvent = ScenarioEvent & {
  type: 'expense';
  amount: number;
  date: string;
};

/** Mudança de renda a partir de uma data — ex: "aumento de salário". */
export type IncomeChangeEvent = ScenarioEvent & {
  type: 'incomeChange';
  previousIncome: number;
  newIncome: number;
  effectiveDate: string;
};

/** Despesa que se repete — ex: "aluguel", "assinatura de streaming". */
export type RecurringExpenseEvent = ScenarioEvent & {
  type: 'recurringExpense';
  amount: number;
  frequency: Frequency;
  startDate: string;
  /** Sem data de fim = recorrência indefinida dentro do horizonte da projeção. */
  endDate?: string;
};

/**
 * Renda que se repete — ex: "freela recorrente", "aluguel recebido".
 * Espelha `RecurringExpenseEvent` de propósito: mesma forma, semântica
 * inversa (entrada em vez de saída) — decisão de modelagem registrada
 * no `.md` desta etapa.
 */
export type RecurringIncomeEvent = ScenarioEvent & {
  type: 'recurringIncome';
  amount: number;
  frequency: Frequency;
  startDate: string;
  endDate?: string;
};

/** Contribuição pra uma meta de economia já existente no app (ver feature `savings`). */
export type SavingContributionEvent = ScenarioEvent & {
  type: 'savingContribution';
  savingGoalId: string;
  amount: number;
  date: string;
};

/**
 * União discriminada de todos os eventos concretos — útil pra código
 * futuro que precise de `switch (event.type)` com narrowing correto
 * (o Projection Engine, por exemplo). Coleções genéricas (como
 * `MonthlyProjection.events`) continuam tipadas como `ScenarioEvent[]`
 * pra não forçar quem só lê campos comuns a lidar com a união inteira.
 */
export type AnyScenarioEvent =
  | PurchaseEvent
  | IncomeEvent
  | ExpenseEvent
  | IncomeChangeEvent
  | RecurringExpenseEvent
  | RecurringIncomeEvent
  | SavingContributionEvent;
