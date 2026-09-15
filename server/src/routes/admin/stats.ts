import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../../config/firebase.js';
import { verifyAdminToken } from '../../middleware/verifyAdminToken.js';
import { ProblemStatementDoc } from '../../models/problemStatement.js';
import { RegistrationDoc } from '../../models/registration.js';

const router = Router();

// Protect stats with admin verification
router.use(verifyAdminToken);

/**
 * GET /api/admin/stats
 * Dashboard summary statistics:
 * - Total registrations count
 * - Breakdown by status (pending, confirmed, waitlisted, rejected)
 * - Breakdown by problem statement with fill percentage
 * - Breakdown by college (top 10)
 * - Checked-in count vs total confirmed count
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [registrationsSnap, tracksSnap] = await Promise.all([
      db.collection('registrations').get(),
      db.collection('problemStatements').get(),
    ]);

    const totalRegistrations = registrationsSnap.size;

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      waitlisted: 0,
      rejected: 0,
    };

    const collegeCounts: Record<string, number> = {};
    let checkedInCount = 0;
    let totalConfirmedCount = 0;

    registrationsSnap.forEach((doc) => {
      const reg = doc.data() as RegistrationDoc;

      // Status breakdown
      if (reg.status && statusCounts[reg.status] !== undefined) {
        statusCounts[reg.status]++;
      }

      if (reg.status === 'confirmed') {
        totalConfirmedCount++;
      }

      // Checked-in count
      if (reg.checkedIn) {
        checkedInCount++;
      }

      // College breakdown (from leader's college)
      const college = reg.leader?.college?.trim() || 'Unknown';
      collegeCounts[college] = (collegeCounts[college] || 0) + 1;
    });

    // Sort colleges to get top 10
    const topColleges = Object.entries(collegeCounts)
      .map(([college, count]) => ({ college, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Problem statements breakdown with fill percentage
    const problemStatementStats = tracksSnap.docs.map((doc) => {
      const ps = doc.data() as ProblemStatementDoc;
      const count = ps.currentTeamCount || 0;
      const max = ps.maxTeams || 1;
      const fillPercentage = ((count / max) * 100).toFixed(1);

      return {
        id: doc.id,
        title: ps.title,
        domain: ps.domain,
        currentTeamCount: count,
        maxTeams: max,
        fillPercentage: `${fillPercentage}%`,
        isFull: count >= max,
        isActive: ps.isActive,
      };
    });

    res.status(200).json({
      success: true,
      stats: {
        totalRegistrations,
        byStatus: statusCounts,
        checkInOverview: {
          checkedInCount,
          totalConfirmedCount,
          checkInPercentage:
            totalConfirmedCount > 0
              ? `${((checkedInCount / totalConfirmedCount) * 100).toFixed(1)}%`
              : '0.0%',
        },
        topColleges,
        byProblemStatement: problemStatementStats,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
