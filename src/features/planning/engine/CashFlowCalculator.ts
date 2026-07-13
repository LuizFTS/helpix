import { CashFlow, ScenarioEvent } from '../types';
import { TimelineMonth } from './TimelineBuilder';

/**
 * Calcula o fluxo de caixa (receitas/despesas) de um mês específico
 * da projeção.
 *
 * Etapa 04: sempre retorna zero — eventos financeiros ainda não
 * existem no domínio funcional (só foram modelados na Etapa 02,
 * nenhuma tela cria eventos ainda). A assinatura já recebe o mês e a
 * lista de eventos que afetam aquele mês (vazia por enquanto) de
 * propósito: quando eventos passarem a existir, a implementação
 * interna deste método muda (somar `PurchaseEvent`/`IncomeEvent`/etc.
 * que caem naquele mês), mas **o contrato não muda** — nenhum
 * chamador (`ProjectionEngine`) precisa ser alterado.
 */
export class CashFlowCalculator {
  static calculate(_month: TimelineMonth, _events: ScenarioEvent[] = []): CashFlow {
    return { income: 0, expense: 0, balance: 0 };
  }
}
