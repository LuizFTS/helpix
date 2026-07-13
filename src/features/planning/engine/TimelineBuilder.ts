/**
 * Um mês na linha do tempo da projeção — só a identificação
 * calendário (mês/ano), sem nenhum dado financeiro. Quem preenche os
 * valores é o `CashFlowCalculator`/`BalanceCalculator`, mais adiante
 * no fluxo do `ProjectionEngine`.
 */
export type TimelineMonth = {
  /** Mês calendário, 1-12 (não índice 0-based do JS Date). */
  month: number;
  year: number;
};

/**
 * Gera a sequência cronológica de meses de uma projeção.
 *
 * Responsabilidade única: transformar "data de início + quantidade de
 * meses" numa lista ordenada de `{ month, year }`, cuidando
 * corretamente da virada de ano (dezembro → janeiro). Não sabe nada
 * sobre saldo, receita, despesa ou eventos — isso é responsabilidade
 * de outras peças do engine.
 *
 * Classe puramente TypeScript: sem React, sem Firebase, sem nenhuma
 * dependência externa — só `Date` nativo do JS.
 */
export class TimelineBuilder {
  /**
   * @param startDate Data de referência do primeiro mês da projeção
   *   (normalmente "agora", quando a projeção é gerada). Só o
   *   mês/ano são considerados — dia/hora são ignorados de propósito,
   *   já que a projeção sempre trabalha em granularidade mensal.
   * @param totalMonths Quantidade de meses a gerar (>= 1).
   */
  static build(startDate: Date, totalMonths: number): TimelineMonth[] {
    const months: TimelineMonth[] = [];

    for (let i = 0; i < totalMonths; i += 1) {
      // Usar o construtor de `Date` com `month` fora do intervalo 0-11
      // (ex: 13) é proposital — o JS normaliza sozinho pro ano
      // seguinte, poupando a gente de fazer a aritmética de virada de
      // ano (mês % 12, incrementar ano) manualmente.
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      months.push({ month: date.getMonth() + 1, year: date.getFullYear() });
    }

    return months;
  }
}
