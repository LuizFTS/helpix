import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authFormSchema, authFormDefaultValues, AuthFormValues } from '../utils/authSchema';
import { translateAuthError } from '../utils/authErrors';
import { AuthService } from '../services/AuthService';

export type AuthMode = 'signin' | 'signup';

export function useAuthForm() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [firebaseError, setFirebaseError] = useState<string | undefined>();

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

    try {
      if (mode === 'signup') {
        await AuthService.signUp(values.email.trim(), values.password);
      } else {
        await AuthService.signIn(values.email.trim(), values.password);
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
  };
}
