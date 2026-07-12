/**
 * Traduz os códigos de erro do Firebase Auth pra mensagens em
 * português, amigáveis pro usuário final (o Firebase retorna algo
 * como "Firebase: Error (auth/invalid-credential)." por padrão).
 */
export function translateAuthError(error: unknown): string {
  const code = extractErrorCode(error);

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Esse e-mail já está sendo usado por outra conta.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/weak-password':
      return 'Senha muito fraca — use pelo menos 6 caracteres.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      // Mensagem genérica de propósito (não revela se o e-mail existe
      // ou não, por segurança).
      return 'E-mail ou senha incorretos.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas seguidas. Aguarde um pouco e tente de novo.';
    case 'auth/network-request-failed':
      return 'Falha de conexão. Verifique sua internet e tente de novo.';
    default:
      return 'Não foi possível completar essa ação. Tente novamente.';
  }
}

function extractErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as { code: unknown }).code);
  }
  return undefined;
}
