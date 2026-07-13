import { auth } from './firebase';

/**
 * Todos os Services usam isso pra saber de qual usuário são os dados
 * que estão lendo/escrevendo. Lança um erro claro se for chamado sem
 * ninguém logado — não deveria acontecer na prática, já que todas as
 * telas que usam os Services estão atrás do `Stack.Protected`
 * (ver app/_layout.tsx), mas é uma proteção contra uso indevido.
 */
export function requireUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('Nenhum usuário autenticado — não é possível acessar os dados.');
  }
  return uid;
}
