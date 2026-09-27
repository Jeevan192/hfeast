import admin from 'firebase-admin';
import { env } from './env.js';

if (!admin.apps.length) {
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
    const cleanKey = rawKey.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: cleanKey,
      }),
    });
    console.log(`[Firebase Admin] Initialized for project: ${env.FIREBASE_PROJECT_ID}`);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const { FieldValue, Timestamp } = admin.firestore;
export default admin;
