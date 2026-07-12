import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
 * `getReactNativePersistence(AsyncStorage)` é o que faz o usuário
 * continuar logado depois de fechar e abrir o app de novo — sem isso,
 * o login se perde a cada reload/reinício.
 */
let authInstance: Auth;
try {
  authInstance = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  authInstance = getAuth(firebaseApp);
}

export const auth = authInstance;
