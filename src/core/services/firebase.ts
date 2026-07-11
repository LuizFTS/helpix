import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

/**
 * Config lida de variáveis de ambiente com prefixo EXPO_PUBLIC_ (o Expo
 * expõe automaticamente essas variáveis no bundle do cliente — não
 * precisa de nenhum plugin extra). Elas ficam no arquivo `.env` na raiz
 * do projeto (veja `.env.example`).
 *
 * Isso NÃO é um dado secreto: a config web do Firebase é pública por
 * natureza (ela só identifica o projeto). A segurança de verdade vem
 * das Regras do Firestore, não de esconder essa config.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Evita reinicializar o app em hot-reload (o Metro pode re-executar este
// módulo várias vezes durante o desenvolvimento).
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// `ignoreUndefinedProperties: true` faz o SDK simplesmente omitir do
// documento qualquer campo cujo valor seja `undefined`, em vez de
// lançar "Unsupported field value: undefined". Isso é essencial aqui
// porque temos vários campos opcionais (installmentGroupId,
// installmentNumber, installmentTotal, notes) que legitimamente vêm
// `undefined` quando não se aplicam (ex: transação não parcelada).
// Sem isso, batch.set()/addDoc() quebram sempre que um desses campos
// não é preenchido.
// Em hot-reload, o Metro pode re-executar este módulo com o mesmo
// `firebaseApp` já tendo uma instância de Firestore associada —
// nesse caso `initializeFirestore` lança erro. Voltamos pra
// `getFirestore` (a config já terá sido aplicada na 1ª execução).
let dbInstance;
try {
  dbInstance = initializeFirestore(firebaseApp, { ignoreUndefinedProperties: true });
} catch {
  dbInstance = getFirestore(firebaseApp);
}
export const db = dbInstance;