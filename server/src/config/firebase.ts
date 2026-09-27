import admin from 'firebase-admin';
import { env, envValidationErrors } from './env.js';

export let firebaseInitError: string | null = null;

if (!admin.apps.length) {
  try {
    const isEmulator = Boolean(env.FIRESTORE_EMULATOR_HOST);

    if (isEmulator) {
      // Running against local Firebase Emulator Suite
      const projectId = env.FIREBASE_PROJECT_ID || 'demo-cbit-hacktoberfest';
      admin.initializeApp({
        projectId,
      });
      console.log(`[Firebase Admin] Initialized in emulator mode for project: ${projectId}`);
    } else {
      // Running against live Firebase project
      const rawKey = env.FIREBASE_PRIVATE_KEY || '';
      const cleanKey = rawKey
        .trim()
        .replace(/^["']|["']$/g, '')
        .trim()
        .replace(/\\n/g, '\n');

      if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !cleanKey) {
        throw new Error(
          `Missing or incomplete Firebase credentials in environment variables: ` +
          `FIREBASE_PROJECT_ID=${Boolean(env.FIREBASE_PROJECT_ID)}, ` +
          `FIREBASE_CLIENT_EMAIL=${Boolean(env.FIREBASE_CLIENT_EMAIL)}, ` +
          `FIREBASE_PRIVATE_KEY=${Boolean(cleanKey)}`
        );
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: cleanKey,
        }),
      });
      console.log(`[Firebase Admin] Initialized for project: ${env.FIREBASE_PROJECT_ID}`);
    }
  } catch (err: any) {
    firebaseInitError = err?.message || String(err);
    console.error('❌ [Firebase Admin Init Failed]:', firebaseInitError);
  }
}

// Helper to safely get db or throw a descriptive error when used
export const getDb = (): FirebaseFirestore.Firestore => {
  if (firebaseInitError || !admin.apps.length) {
    throw new Error(
      `Firestore is unavailable: ${firebaseInitError || 'Firebase app not initialized'}. ` +
      `Check your Vercel Environment Variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.`
    );
  }
  return admin.firestore();
};

export const db = (admin.apps.length && !firebaseInitError)
  ? admin.firestore()
  : (new Proxy({}, {
      get: (_target, prop) => {
        const firestore = getDb();
        const value = (firestore as any)[prop];
        return typeof value === 'function' ? value.bind(firestore) : value;
      },
    }) as FirebaseFirestore.Firestore);

export const auth = (admin.apps.length && !firebaseInitError)
  ? admin.auth()
  : (new Proxy({}, {
      get: (_target, prop) => {
        if (firebaseInitError || !admin.apps.length) {
          throw new Error(`Firebase Auth is unavailable: ${firebaseInitError}`);
        }
        const authInstance = admin.auth();
        const value = (authInstance as any)[prop];
        return typeof value === 'function' ? value.bind(authInstance) : value;
      },
    }) as admin.auth.Auth);

export const { FieldValue, Timestamp } = admin.firestore;
export default admin;
