import * as SecureStore from 'expo-secure-store';

const EMAIL_KEY = 'helpix.auth.rememberedEmail';
const PASSWORD_KEY = 'helpix.auth.rememberedPassword';

type StoredCredentials = { email: string; password: string };

/**
 * Guarda e-mail/senha no Keychain (iOS) / Keystore (Android) via
 * `expo-secure-store` — só quando o usuário marca "Lembrar de mim" no
 * login. É isso que permite o botão de biometria: a digital/Face ID
 * não autentica no Firebase diretamente (ele não suporta isso), ela
 * só "libera" essas credenciais guardadas localmente pra gente chamar
 * `signInWithEmailAndPassword` por baixo dos panos.
 *
 * Como o Firebase agora usa `inMemoryPersistence` (ver
 * core/services/firebase.ts), sem isso o usuário teria que digitar a
 * senha toda vez que abrisse o app — o SecureStore é o que sobrevive
 * ao fechar/reabrir.
 */
class CredentialsStoreImpl {
  async save(email: string, password: string): Promise<void> {
    await SecureStore.setItemAsync(EMAIL_KEY, email);
    await SecureStore.setItemAsync(PASSWORD_KEY, password);
  }

  async get(): Promise<StoredCredentials | null> {
    const [email, password] = await Promise.all([
      SecureStore.getItemAsync(EMAIL_KEY),
      SecureStore.getItemAsync(PASSWORD_KEY),
    ]);
    if (!email || !password) return null;
    return { email, password };
  }

  async hasStoredCredentials(): Promise<boolean> {
    const email = await SecureStore.getItemAsync(EMAIL_KEY);
    return !!email;
  }

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(EMAIL_KEY);
    await SecureStore.deleteItemAsync(PASSWORD_KEY);
  }
}

export const CredentialsStore = new CredentialsStoreImpl();
