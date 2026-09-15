import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase.js';
import { AdminRole } from '../models/admin.js';

export interface AuthenticatedAdmin {
  uid: string;
  email?: string;
  role: AdminRole;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdmin;
    }
  }
}

export async function verifyAdminToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: "Authorization header missing or invalid format. Expected 'Bearer <token>'.",
      },
    });
    return;
  }

  const token = authHeader.split('Bearer ')[1]?.trim();

  if (!token) {
    res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Bearer token not provided.',
      },
    });
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);

    // Look up administrator document in admins collection
    const adminDocSnap = await db.collection('admins').doc(decodedToken.uid).get();

    if (!adminDocSnap.exists) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Not authorized as an admin.',
        },
      });
      return;
    }

    const adminData = adminDocSnap.data();
    req.admin = {
      uid: decodedToken.uid,
      email: adminData?.email || decodedToken.email,
      role: (adminData?.role as AdminRole) || 'organizer',
    };

    next();
  } catch (err: unknown) {
    res.status(401).json({
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Invalid or expired authentication token.',
      },
    });
  }
}
