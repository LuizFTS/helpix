import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, inMemoryPersistence, getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

/**
 * `initializeAuth` só pode ser chamado UMA VEZ por app — por isso o
 * try/catch: em hot-reload durante o desenvolvimento, este módulo pode
 * ser re-executado, e nesse caso usamos `getAuth` (retorna a instância
 * já existente) em vez de tentar inicializar de novo.
 *
 * `inMemoryPersistence` é proposital: a sessão NÃO deve sobreviver a
 * um fechar/reabrir do app — o usuário sempre cai na tela de login.
 * O atalho de biometria (ver src/features/auth/services/CredentialsStore.ts)
 * é o que dá uma entrada rápida sem digitar a senha de novo, sem
 * depender de o Firebase manter a sessão viva sozinho.
 */
let authInstance: Auth;
try {
  authInstance = initializeAuth(firebaseApp, {
    persistence: inMemoryPersistence,
  });
} catch {
  authInstance = getAuth(firebaseApp);
}

export const auth = authInstance;
