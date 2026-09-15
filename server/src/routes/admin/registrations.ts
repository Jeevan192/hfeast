import { Router, Request, Response, NextFunction } from 'express';
import { requireRole } from '../../middleware/requireRole.js';
import { verifyAdminToken } from '../../middleware/verifyAdminToken.js';
import { updateRegistrationSchema } from '../../models/registration.js';
import { RegistrationService } from '../../services/registrationService.js';
import { streamRegistrationsToCsv } from '../../utils/csvExporter.js';

const router = Router();

// Protect all routes in this router with Firebase Auth Admin verification
router.use(verifyAdminToken);

/**
 * GET /api/admin/registrations
 * List registrations with cursor-based pagination, filters, and search.
 * Accessible to organizer & superadmin.
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await RegistrationService.getRegistrationsForAdmin({
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      cursor: req.query.cursor as string | undefined,
      status: req.query.status as string | undefined,
      trackId: req.query.trackId as string | undefined,
      college: req.query.college as string | undefined,
      checkedIn: req.query.checkedIn as string | undefined,
      search: req.query.search as string | undefined,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/registrations/export
 * Streams CSV export with formula injection escaping.
 * Accessible to superadmin ONLY.
 */
router.get(
  '/export',
  requireRole('superadmin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registrations = await RegistrationService.getAllRegistrationsForExport({
        status: req.query.status as string | undefined,
        trackId: req.query.trackId as string | undefined,
        college: req.query.college as string | undefined,
        checkedIn: req.query.checkedIn as string | undefined,
      });

      streamRegistrationsToCsv(registrations, res);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/admin/registrations/:id
 * Updates registration status, check-in, or internal note.
 * Status transitions run through transactions verifying capacity on reinstatement or freeing slot on rejection.
 * Accessible to organizer & superadmin.
 */
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedInput = updateRegistrationSchema.parse(req.body);
    const updated = await RegistrationService.updateRegistration(String(req.params.id), validatedInput);

    res.status(200).json({
      success: true,
      registration: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/registrations/:id
 * Permanently deletes a registration and decrements the linked PS team count.
 * Accessible to superadmin ONLY.
 */
router.delete(
  '/:id',
  requireRole('superadmin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await RegistrationService.deleteRegistration(String(req.params.id));
      res.status(200).json({
        success: true,
        message: `Registration with ID '${req.params.id}' deleted successfully.`,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
