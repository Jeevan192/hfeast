import type { Request, Response } from 'express';

let appInstance: any = null;
let initError: any = null;

try {
  const { createApp } = await import('../server/src/app.js');
  appInstance = createApp();
} catch (err: any) {
  console.error('❌ [Vercel API Boot Error]', err);
  initError = err;
}

export default function handler(req: Request, res: Response) {
  if (initError || !appInstance) {
    return res.status(500).json({
      error: {
        code: 'BACKEND_BOOT_ERROR',
        message: initError?.message || 'Server failed to initialize',
        details: initError?.stack,
        hint: 'Check your Vercel Environment Variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.',
      },
    });
  }
  return appInstance(req, res);
}
