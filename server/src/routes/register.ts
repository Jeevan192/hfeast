import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { publicApiRateLimiter } from '../middleware/rateLimiter.js';
import { registerRequestSchema } from '../models/registration.js';
import { RegistrationService } from '../services/registrationService.js';
import { BadRequestError } from '../utils/errors.js';

const router = Router();

const statusQuerySchema = z.object({
  email: z
    .string({ required_error: "Query parameter 'email' is required." })
    .email('Invalid email address format')
    .transform((v) => v.trim().toLowerCase()),
});

/**
 * POST /api/register
 * Public team registration endpoint with rate limiting (5 req/min).
 * Executes atomic Firestore transaction guaranteeing uniqueness and maxTeams cap.
 */
router.post(
  '/register',
  publicApiRateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Step 1: Shape validation via Zod
      const validatedInput = registerRequestSchema.parse(req.body);

      // Steps 2-5 handled by RegistrationService
      const result = await RegistrationService.registerTeam(validatedInput);

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/registration-status?email=<leaderEmail>
 * Public status lookup with rate limiting (5 req/min).
 * Returns strictly non-PII fields: teamName, status, checkedIn, psTitle, psDomain.
 */
router.get(
  '/registration-status',
  publicApiRateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const emailQuery = req.query.email;
      if (!emailQuery || typeof emailQuery !== 'string') {
        throw new BadRequestError("Missing required query parameter: 'email'.");
      }

      const parsed = statusQuerySchema.safeParse({ email: emailQuery });
      if (!parsed.success) {
        throw new BadRequestError(
          parsed.error.errors[0]?.message || 'Invalid email query parameter.'
        );
      }

      const statusInfo = await RegistrationService.getRegistrationStatus(parsed.data.email);
      res.status(200).json(statusInfo);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
