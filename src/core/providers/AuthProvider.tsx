import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, reload, User } from 'firebase/auth';
import { auth } from '../services/firebase';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  emailVerified: boolean;
  displayName: string | null;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  emailVerified: false,
  displayName: null,
  refreshUser: async () => {},
});

/**
 * Escuta o estado de autenticação do Firebase e disponibiliza
 * `user`/`isLoading`/`emailVerified`/`displayName` pro resto do app
 * via `useAuth()`.
 *
 * `emailVerified` e `displayName` são mantidos como estados próprios
 * (em vez de só ler direto de `user.emailVerified`/`user.displayName`)
 * porque o Firebase `reload()` (e `updateProfile()`, no caso do nome)
 * MUTAM o objeto `user` existente em vez de criar um novo — se
 * dependêssemos só da referência de `user` pra re-renderizar, o React
 * poderia não perceber a mudança (mesma referência = sem re-render).
 * Estados dedicados sempre disparam a atualização corretamente.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setEmailVerified(firebaseUser?.emailVerified ?? false);
      setDisplayName(firebaseUser?.displayName ?? null);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  /**
   * "Recarrega" o usuário atual do Firebase — usado pelo botão "Já
   * confirmei" no banner de verificação de e-mail (Firebase não
   * atualiza `emailVerified` sozinho em tempo real), e também logo
   * após o cadastro, pra puxar o `displayName` recém-salvo via
   * `updateProfile` (ver AuthService.signUp).
   */
  const refreshUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
    }
    setEmailVerified(auth.currentUser?.emailVerified ?? false);
    setDisplayName(auth.currentUser?.displayName ?? null);
    setUser(auth.currentUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, emailVerified, displayName, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
