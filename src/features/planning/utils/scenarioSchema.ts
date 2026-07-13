import { z } from 'zod';
import {
  DEFAULT_PROJECTION_MONTHS,
  MIN_PROJECTION_MONTHS,
  MAX_PROJECTION_MONTHS,
} from '../constants/planning.constants';

/**
 * Schema único usado tanto para criação quanto para edição de
 * cenário — mesmo padrão de `transactionFormSchema`/`authFormSchema`.
 */
export const scenarioFormSchema = z.object({
  name: z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres').max(60),
  description: z.string().max(280).optional(),
  initialBalance: z.number({ invalid_type_error: 'Informe um valor' }),
  projectionMonths: z
    .number({ invalid_type_error: 'Informe a quantidade de meses' })
    .int()
    .min(MIN_PROJECTION_MONTHS, `Mínimo de ${MIN_PROJECTION_MONTHS} mês`)
    .max(MAX_PROJECTION_MONTHS, `Máximo de ${MAX_PROJECTION_MONTHS} meses`),
});

export type ScenarioFormValues = z.infer<typeof scenarioFormSchema>;

export const scenarioFormDefaultValues: ScenarioFormValues = {
  name: '',
  description: '',
  initialBalance: 0,
  projectionMonths: DEFAULT_PROJECTION_MONTHS,
};
