import { z } from 'zod';

/**
 * Schema único pra Entrar/Criar conta. `confirmPassword` e `name` só
 * são validados manualmente no submit (no modo "Criar conta") — não
 * dá pra usar `.refine` aqui porque o schema não sabe em qual modo o
 * formulário está (isso vive no hook, não no schema).
 */
export const authFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
  confirmPassword: z.string().optional(),
});

export type AuthFormValues = z.infer<typeof authFormSchema>;

export const authFormDefaultValues: AuthFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};
