import { Router, Request, Response, NextFunction } from 'express';
import { requireRole } from '../../middleware/requireRole.js';
import { verifyAdminToken } from '../../middleware/verifyAdminToken.js';
import {
  createProblemStatementSchema,
  updateProblemStatementSchema,
} from '../../models/problemStatement.js';
import { ProblemStatementService } from '../../services/problemStatementService.js';

const router = Router();

// Protect all routes with admin token verification
router.use(verifyAdminToken);

/**
 * GET /api/admin/problem-statements
 * Returns ALL problem statements (active and inactive) with isFull flag.
 * Accessible to organizer & superadmin.
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tracks = await ProblemStatementService.getAllTracksForAdmin();
    res.status(200).json({
      success: true,
      count: tracks.length,
      problemStatements: tracks,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/problem-statements
 * Creates a new problem statement. maxTeams is required.
 * Accessible to organizer & superadmin.
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedInput = createProblemStatementSchema.parse(req.body);
    const created = await ProblemStatementService.createTrack(validatedInput);

    res.status(201).json({
      success: true,
      problemStatement: created,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/problem-statements/:id
 * Updates problem statement fields (except currentTeamCount).
 * Accessible to organizer & superadmin.
 */
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedInput = updateProblemStatementSchema.parse(req.body);
    const updated = await ProblemStatementService.updateTrack(String(req.params.id), validatedInput);

    res.status(200).json({
      success: true,
      problemStatement: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/problem-statements/:id
 * Deletes a problem statement. Refuses (409) if currentTeamCount > 0.
 * Accessible to superadmin ONLY.
 */
router.delete(
  '/:id',
  requireRole('superadmin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ProblemStatementService.deleteTrack(String(req.params.id));
      res.status(200).json({
        success: true,
        message: `Problem statement with ID '${req.params.id}' deleted successfully.`,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
