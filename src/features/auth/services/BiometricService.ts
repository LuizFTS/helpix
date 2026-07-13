import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Wrapper fino sobre `expo-local-authentication`, seguindo a mesma
 * convenção dos outros Services (interface própria, sem espalhar a
 * lib externa pelo resto do app).
 */
class BiometricServiceImpl {
  /**
   * Verifica se o aparelho tem sensor de biometria E se o usuário
   * cadastrou pelo menos uma digital/rosto no sistema operacional.
   * Sem as duas coisas, não faz sentido nem mostrar o botão.
   */
  async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return isEnrolled;
  }

  /**
   * Dispara o prompt nativo de biometria. Retorna `true` só em caso
   * de sucesso — cancelamento, falha ou "muitas tentativas" retornam
   * `false` (o chamador decide como reagir, geralmente caindo pro
   * login normal).
   */
  async authenticate(promptMessage = 'Entrar no Helpix'): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
    });
    return result.success;
  }
}

export const BiometricService = new BiometricServiceImpl();
