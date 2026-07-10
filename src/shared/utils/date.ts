export type Period = { month: number; year: number };

const MONTHS_PT_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MONTHS_PT_FULL = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function getCurrentPeriod(): Period {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

export function formatPeriodShort(period: Period): string {
  return `${MONTHS_PT_SHORT[period.month]} ${period.year}`;
}

export function formatPeriodUppercase(period: Period): string {
  return MONTHS_PT_FULL[period.month].toUpperCase();
}

export function getPreviousPeriod(period: Period): Period {
  return period.month === 0
    ? { month: 11, year: period.year - 1 }
    : { month: period.month - 1, year: period.year };
}

export function getNextPeriod(period: Period): Period {
  return period.month === 11
    ? { month: 0, year: period.year + 1 }
    : { month: period.month + 1, year: period.year };
}

export function isSamePeriod(dateISO: string, period: Period): boolean {
  const date = new Date(dateISO);
  return date.getMonth() === period.month && date.getFullYear() === period.year;
}

export function formatDateShort(dateISO: string): string {
  const date = new Date(dateISO);
  return `${date.getDate()} ${MONTHS_PT_SHORT[date.getMonth()]}, ${date.getFullYear()}`;
}
