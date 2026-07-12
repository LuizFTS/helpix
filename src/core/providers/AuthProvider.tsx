import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, reload, User } from 'firebase/auth';
import { auth } from '../services/firebase';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  emailVerified: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  emailVerified: false,
  refreshUser: async () => {},
});

/**
 * Escuta o estado de autenticação do Firebase e disponibiliza
 * `user`/`isLoading`/`emailVerified` pro resto do app via `useAuth()`.
 *
 * `emailVerified` é mantido como um booleano próprio (em vez de só
 * ler `user.emailVerified` direto) porque o Firebase `reload()` MUTA
 * o objeto `user` existente em vez de criar um novo — se
 * dependêssemos só da referência de `user` pra re-renderizar, o React
 * poderia não perceber a mudança (mesma referência = sem re-render).
 * Um booleano dedicado sempre dispara a atualização corretamente.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setEmailVerified(firebaseUser?.emailVerified ?? false);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  /**
   * "Recarrega" o usuário atual do Firebase — usado pelo botão "Já
   * confirmei" no banner de verificação de e-mail, já que o Firebase
   * não atualiza `emailVerified` sozinho em tempo real.
   */
  const refreshUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
    }
    setEmailVerified(auth.currentUser?.emailVerified ?? false);
    setUser(auth.currentUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, emailVerified, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
