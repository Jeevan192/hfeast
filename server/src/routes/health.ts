import { Router, Request, Response } from 'express';
import admin from 'firebase-admin';
import { env, envValidationErrors } from '../config/env.js';
import { firebaseInitError } from '../config/firebase.js';

const router = Router();

/**
 * Health check endpoint for Vercel, Cloud Run, and Render.
 * Returns HTTP 200 with status diagnostics.
 */
router.get(['/healthz', '/health', '/'], (_req: Request, res: Response) => {
  const isFirebaseReady = Boolean(admin.apps.length && !firebaseInitError);

  res.status(200).json({
    status: isFirebaseReady ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    firebase: {
      initialized: isFirebaseReady,
      projectId: env.FIREBASE_PROJECT_ID ? `${env.FIREBASE_PROJECT_ID.slice(0, 4)}***` : null,
      clientEmail: env.FIREBASE_CLIENT_EMAIL ? `${env.FIREBASE_CLIENT_EMAIL.slice(0, 6)}***` : null,
      hasPrivateKey: Boolean(env.FIREBASE_PRIVATE_KEY),
      error: firebaseInitError || null,
    },
    envValidation: envValidationErrors || 'passed',
  });
});

export default router;
