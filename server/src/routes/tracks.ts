import { Router, Request, Response, NextFunction } from 'express';
import { ProblemStatementService } from '../services/problemStatementService.js';

const router = Router();

/**
 * GET /api/tracks
 * Public endpoint: returns all active problem statements sorted by domain.
 * Includes currentTeamCount, maxTeams, and isFull.
 */
router.get('/tracks', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tracks = await ProblemStatementService.getActiveTracks();
    res.status(200).json({
      success: true,
      count: tracks.length,
      tracks,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
