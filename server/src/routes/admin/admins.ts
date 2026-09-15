import { Router, Request, Response, NextFunction } from 'express';
import { auth, db, FieldValue } from '../../config/firebase.js';
import { requireRole } from '../../middleware/requireRole.js';
import { verifyAdminToken } from '../../middleware/verifyAdminToken.js';
import { createAdminSchema } from '../../models/admin.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

const router = Router();

// Protect all admin management routes: superadmin only
router.use(verifyAdminToken);
router.use(requireRole('superadmin'));

/**
 * GET /api/admin/admins
 * Lists all administrator accounts and their roles.
 * Superadmin ONLY.
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const snapshot = await db.collection('admins').get();
    const admins = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/admins
 * Creates or authorizes an administrator by email.
 * Superadmin ONLY.
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, role } = createAdminSchema.parse(req.body);

    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (err: unknown) {
      // If user does not exist, create a new Firebase Auth user
      if ('code' in (err as { code: unknown }) && (err as { code: string }).code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email,
          emailVerified: true,
        });
      } else {
        throw err;
      }
    }

    const adminRef = db.collection('admins').doc(userRecord.uid);
    const now = FieldValue.serverTimestamp();

    await adminRef.set(
      {
        email,
        role,
        updatedAt: now,
        createdAt: now,
      },
      { merge: true }
    );

    res.status(201).json({
      success: true,
      admin: {
        uid: userRecord.uid,
        email,
        role,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/admins/:uid
 * Revokes backend admin access by deleting the admin's doc from `admins` collection.
 * Rejects (400) if caller attempts to delete their own admin doc (self-lockout prevention).
 * Superadmin ONLY.
 */
router.delete('/:uid', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUid = String(req.params.uid);
    const callerUid = req.admin?.uid;

    if (targetUid === callerUid) {
      throw new BadRequestError(
        'Self-lockout prevented: You cannot revoke or delete your own administrator account.'
      );
    }

    const adminRef = db.collection('admins').doc(targetUid);
    const docSnap = await adminRef.get();

    if (!docSnap.exists) {
      throw new NotFoundError(`Admin document with UID '${targetUid}' not found.`);
    }

    await adminRef.delete();

    res.status(200).json({
      success: true,
      message: `Administrator access for UID '${targetUid}' revoked successfully.`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
