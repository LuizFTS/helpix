import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  reload,
  User,
} from 'firebase/auth';
import { auth } from '../../../core/services/firebase';

/**
 * AuthService — mesma convenção dos outros Services (interface
 * pública própria, sem expor os detalhes do Firebase Auth pro resto
 * do app). Só e-mail/senha por enquanto — login com Google fica pra
 * uma etapa futura, se você decidir voltar a ele.
 */
class AuthServiceImpl {
  async signIn(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  async signUp(email: string, password: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // Dispara o e-mail de verificação automaticamente ao criar a conta.
    await sendEmailVerification(credential.user);
    return credential.user;
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  async resendVerificationEmail(): Promise<void> {
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser);
  }

  /**
   * O Firebase não atualiza `user.emailVerified` sozinho em tempo real
   * — é preciso "recarregar" o usuário pra saber se ele confirmou o
   * e-mail nesse meio tempo (usado pelo botão "já confirmei" na Etapa C).
   */
  async refreshCurrentUser(): Promise<User | null> {
    if (!auth.currentUser) return null;
    await reload(auth.currentUser);
    return auth.currentUser;
  }

  get currentUser(): User | null {
    return auth.currentUser;
  }
}

export const AuthService = new AuthServiceImpl();
