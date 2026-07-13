import { Scenario, ScenarioProjection, MonthlyProjection } from '../types';
import { TimelineBuilder } from './TimelineBuilder';
import { CashFlowCalculator } from './CashFlowCalculator';
import { BalanceCalculator } from './BalanceCalculator';

/**
 * Ponto de entrada do motor de projeção financeira.
 *
 * Orquestra o fluxo fixo (e, por design, sempre nessa ordem):
 *
 * ```
 * TimelineBuilder → CashFlowCalculator → BalanceCalculator → MonthlyProjection[]
 * ```
 *
 * Recebe um `Scenario` (nunca parâmetros soltos — sempre os modelos
 * definidos na Etapa 02) e devolve uma `ScenarioProjection` completa.
 *
 * **Sem nenhuma dependência de React/React Native/Expo/Firebase/React
 * Query.** É uma classe puramente TypeScript, testável isoladamente
 * com qualquer `Scenario` de entrada — mesmo objeto de entrada sempre
 * produz o mesmo resultado (determinístico), já que a única "variável
 * externa" é `referenceDate` (o mês em que a projeção começa a
 * contar), que é um parâmetro explícito, não lido de `Date.now()`
 * escondido dentro do cálculo.
 */
export class ProjectionEngine {
  /**
   * @param scenario Cenário a projetar (já persistido, vindo do
   *   `PlanningService` — mas o engine não sabe disso, só recebe o
   *   objeto).
   * @param referenceDate Mês/ano em que a projeção começa a contar.
   *   Default: agora. Exposto como parâmetro (em vez de `new Date()`
   *   direto no corpo do método) justamente pra manter o motor
   *   determinístico e testável — testes podem fixar uma data
   *   qualquer sem depender do relógio da máquina.
   */
  static generate(scenario: Scenario, referenceDate: Date = new Date()): ScenarioProjection {
    const timeline = TimelineBuilder.build(referenceDate, scenario.projectionMonths);

    // Encadeamento entre meses: o saldo final de um mês vira o saldo
    // inicial do próximo. Essa é a única responsabilidade que cabe ao
    // ProjectionEngine (não ao BalanceCalculator, que só sabe somar
    // um mês isolado, nem ao TimelineBuilder, que só sabe gerar
    // datas) — é o que justifica o engine existir como orquestrador
    // separado das outras três peças.
    let runningBalance = scenario.initialBalance;

    const months: MonthlyProjection[] = timeline.map((period) => {
      // Nesta etapa não existem eventos — lista sempre vazia. Quando
      // a Etapa de Eventos existir, aqui é o lugar que vai filtrar os
      // eventos do cenário que caem neste mês específico e passá-los
      // pro CashFlowCalculator.
      const cashFlow = CashFlowCalculator.calculate(period, []);
      const balance = BalanceCalculator.calculate(runningBalance, cashFlow);
      runningBalance = balance.finalBalance;

      return {
        month: period.month,
        year: period.year,
        initialBalance: balance.initialBalance,
        totalIncome: balance.totalIncome,
        totalExpense: balance.totalExpense,
        finalBalance: balance.finalBalance,
        // Coleção preparada pra receber eventos reais numa etapa
        // futura — sempre vazia por enquanto, conforme pedido.
        events: [],
      };
    });

    return {
      scenarioId: scenario.id,
      generatedAt: new Date().toISOString(),
      months,
    };
  }
}
