import { ScenarioEvent } from './events.types';

/**
 * Representa um único mês dentro de uma projeção calculada.
 *
 * Etapa 02 (modelagem): todos os campos numéricos existem só como
 * estrutura — nenhum valor é calculado nesta etapa. Isso é
 * responsabilidade do Projection Engine, numa etapa futura.
 */
export type MonthlyProjection = {
  /** Mês calendário (1-12), não confundir com o índice do mês dentro da projeção. */
  month: number;
  year: number;
  initialBalance: number;
  totalIncome: number;
  totalExpense: number;
  finalBalance: number;
  /** Eventos que "acontecem" (ou têm efeito) dentro deste mês específico. */
  events: ScenarioEvent[];
};

/**
 * Intervalo de datas — usado tanto pra descrever o horizonte de uma
 * projeção quanto, futuramente, pra qualquer filtro por período
 * dentro do módulo.
 */
export type ProjectionPeriod = {
  startDate: string;
  endDate: string;
};

/**
 * Resultado completo de uma projeção calculada pra um cenário — o
 * que o Projection Engine deve produzir, quando existir.
 */
export type ScenarioProjection = {
  scenarioId: string;
  generatedAt: string;
  months: MonthlyProjection[];
};
