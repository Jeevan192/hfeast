import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Health check endpoint for Cloud Run / Render liveness probes.
 * Unauthenticated, returns 200 OK.
 */
router.get(['/healthz', '/health', '/'], (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
