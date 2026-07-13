import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../core/providers/AuthProvider';
import { AuthService } from '../services/AuthService';
import { CredentialsStore } from '../services/CredentialsStore';
import { translateAuthError } from '../utils/authErrors';
import { authFormDefaultValues, authFormSchema, AuthFormValues } from '../utils/authSchema';

export type AuthMode = 'signin' | 'signup';

export function useAuthForm() {
  const { refreshUser } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [firebaseError, setFirebaseError] = useState<string | undefined>();
  // "Lembrar de mim" só faz sentido no login (não no cadastro) — por
  // isso não faz parte do authFormSchema, fica separado como um
  // estado próprio da tela.
  const [remember, setRemember] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: authFormDefaultValues,
  });

  const toggleMode = () => {
    setMode((current) => (current === 'signin' ? 'signup' : 'signin'));
    setFirebaseError(undefined);
    form.reset(authFormDefaultValues);
  };

  const submit = form.handleSubmit(async (values) => {
    setFirebaseError(undefined);

    if (mode === 'signup' && values.password !== values.confirmPassword) {
      form.setError('confirmPassword', { message: 'As senhas não coincidem' });
      return;
    }

    const name = values.name?.trim() ?? '';
    if (mode === 'signup' && !name) {
      form.setError('name', { message: 'Informe seu nome' });
      return;
    }

    const email = values.email.trim();

    try {
      if (mode === 'signup') {
        await AuthService.signUp(email, values.password, name);
        // `updateProfile` (dentro do signUp) muta o objeto `user` do
        // Firebase sem trocar sua referência — o AuthProvider não
        // percebe a mudança sozinho. `refreshUser()` força a releitura
        // e é o que faz o nome aparecer na saudação do Dashboard logo
        // após o cadastro, sem precisar deslogar/logar de novo.
        await refreshUser();
        // Cadastro não mexe nas credenciais salvas — biometria só é
        // oferecida a partir de um login explícito com "lembrar" ativo.
      } else {
        await AuthService.signIn(email, values.password);
        if (remember) {
          await CredentialsStore.save(email, values.password);
        } else {
          // Se o usuário loga sem marcar "lembrar", qualquer atalho de
          // biometria de um login anterior deixa de valer.
          await CredentialsStore.clear();
        }
      }
    } catch (error) {
      setFirebaseError(translateAuthError(error));
    }
  });

  return {
    form,
    submit,
    mode,
    toggleMode,
    firebaseError,
    isSubmitting: form.formState.isSubmitting,
    remember,
    setRemember,
  };
}
