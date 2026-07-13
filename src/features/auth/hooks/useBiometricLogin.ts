import { useEffect, useState } from 'react';
import { BiometricService } from '../services/BiometricService';
import { CredentialsStore } from '../services/CredentialsStore';
import { AuthService } from '../services/AuthService';
import { translateAuthError } from '../utils/authErrors';

/**
 * Decide se o botão "Entrar com biometria" deve aparecer na tela de
 * login (`canUseBiometrics`) e executa o fluxo quando o usuário toca
 * nele: prompt nativo → se aprovado, recupera e-mail/senha do
 * SecureStore → chama o AuthService normalmente.
 *
 * `canUseBiometrics` exige DUAS condições ao mesmo tempo: o aparelho
 * suportar biometria (`BiometricService.isAvailable`) E existir uma
 * credencial salva de um login anterior com "lembrar" ativo
 * (`CredentialsStore.hasStoredCredentials`). Sem qualquer uma delas
 * não há o que autenticar, então o botão fica escondido.
 */
export function useBiometricLogin() {
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const [hardwareOk, hasCredentials] = await Promise.all([
        BiometricService.isAvailable(),
        CredentialsStore.hasStoredCredentials(),
      ]);
      if (isMounted) {
        setCanUseBiometrics(hardwareOk && hasCredentials);
        setIsChecking(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Retorna `true` em caso de login bem-sucedido. Em qualquer outra
   * situação (biometria cancelada/recusada, credenciais expiradas no
   * servidor, sem internet etc.) retorna `false` — a tela de login
   * continua disponível normalmente, o usuário só tenta de novo com
   * e-mail/senha.
   */
  const loginWithBiometrics = async (): Promise<boolean> => {
    setError(undefined);
    setIsAuthenticating(true);

    try {
      const approved = await BiometricService.authenticate();
      if (!approved) return false;

      const credentials = await CredentialsStore.get();
      if (!credentials) {
        // Credencial pode ter sido limpa (ex: outro login sem
        // "lembrar") entre a checagem inicial e o toque no botão.
        setCanUseBiometrics(false);
        return false;
      }

      await AuthService.signIn(credentials.email, credentials.password);
      return true;
    } catch (err) {
      // Se a senha salva não é mais válida (ex: usuário trocou a
      // senha em outro aparelho), limpa o atalho pra não ficar
      // tentando de novo com credencial morta.
      await CredentialsStore.clear();
      setCanUseBiometrics(false);
      setError(translateAuthError(err));
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  return { canUseBiometrics, isChecking, isAuthenticating, error, loginWithBiometrics };
}
