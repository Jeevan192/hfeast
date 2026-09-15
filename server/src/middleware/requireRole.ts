import { Request, Response, NextFunction } from 'express';
import { AdminRole } from '../models/admin.js';

/**
 * Role guard middleware to enforce role-based access control.
 * Must be placed after verifyAdminToken middleware.
 */
export function requireRole(...allowedRoles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication required before role check.',
        },
      });
      return;
    }

    if (!allowedRoles.includes(req.admin.role)) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Insufficient permissions. This operation requires one of the following roles: ${allowedRoles.join(', ')}.`,
        },
      });
      return;
    }

    next();
  };
}
