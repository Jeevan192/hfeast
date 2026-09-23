import { db, FieldValue } from '../config/firebase.js';
import { ProblemStatementDoc } from '../models/problemStatement.js';
import {
  RegisterRequestInput,
  RegistrationDoc,
  RegistrationWithTrackDoc,
  UpdateRegistrationInput,
  hasDuplicateParticipants,
} from '../models/registration.js';
import { normalizeEmail, normalizePhone } from '../utils/validators.js';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/errors.js';

const REGISTRATIONS_COLLECTION = 'registrations';
const TRACKS_COLLECTION = 'problemStatements';
const LOCKS_COLLECTION = 'registration_locks';

export class RegistrationService {
  /**
   * Registers a team atomically using a Firestore transaction.
   * Enforces:
   * 1. members.length === teamSize - 1
   * 2. Intra-request uniqueness: no duplicate emails or phones across members
   * 3. Pre-checks and In-transaction ACID locks for teamName, all participant emails, and all phones
   * 4. Optional problem statement capacity check if trackId is provided
   * 5. Atomic registration creation with payment verification details
   */
  static async registerTeam(
    input: RegisterRequestInput
  ): Promise<{ success: boolean; registrationId: string }> {
    const { teamSize, members, leader, trackId = 'general' } = input;

    // Step 1: Validate members count against teamSize
    if (members.length !== teamSize - 1) {
      throw new BadRequestError(
        `Invalid members count: for teamSize ${teamSize}, exactly ${teamSize - 1} additional member(s) must be provided. Received ${members.length}.`
      );
    }

    const normalizedTeamName = input.teamName.trim();
    const teamLockKey = `team_${normalizedTeamName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const normalizedLeaderEmail = normalizeEmail(leader.email);
    const normalizedMemberEmails = members.map((m) => normalizeEmail(m.email));
    const allEmails = [normalizedLeaderEmail, ...normalizedMemberEmails];

    const normalizedLeaderPhone = normalizePhone(leader.phone);
    const normalizedMemberPhones = members.map((m) => normalizePhone(m.phone));
    const allPhones = [normalizedLeaderPhone, ...normalizedMemberPhones];

    const uniqueEmails = new Set(allEmails);
    if (uniqueEmails.size !== allEmails.length) {
      throw new BadRequestError('Each team member and leader must have a distinct, unique email address.');
    }

    if (hasDuplicateParticipants(leader, members)) {
      throw new BadRequestError('Each team member and leader must have a distinct, unique phone number.');
    }

    // Step 2: Query active registrations for existing team name
    const teamQuerySnap = await db
      .collection(REGISTRATIONS_COLLECTION)
      .where('status', 'in', ['pending', 'confirmed', 'waitlisted'])
      .get();

    for (const doc of teamQuerySnap.docs) {
      const data = doc.data() as RegistrationDoc;
      if (data.teamName.trim().toLowerCase() === normalizedTeamName.toLowerCase()) {
        throw new ConflictError(`Team name '${normalizedTeamName}' is already taken. Please select a unique team name.`);
      }
      // Check leader or member email collision
      const existingEmails = [data.leader.email.toLowerCase(), ...(data.members || []).map((m) => m.email.toLowerCase())];
      for (const email of allEmails) {
        if (existingEmails.includes(email)) {
          throw new ConflictError(
            `Participant email '${email}' is already registered with team '${data.teamName}'. Each participant can only register with one team.`
          );
        }
      }
      // Check phone collision
      const existingPhones = [normalizePhone(data.leader.phone), ...(data.members || []).map((m) => normalizePhone(m.phone))];
      for (const phone of allPhones) {
        if (phone && existingPhones.includes(phone)) {
          throw new ConflictError(
            `Participant phone number is already registered with team '${data.teamName}'. Each participant can only register once.`
          );
        }
      }
    }

    // Step 3: Verify optional trackId if valid problem statement
    let psRef: FirebaseFirestore.DocumentReference | null = null;
    if (trackId && trackId !== 'general') {
      psRef = db.collection(TRACKS_COLLECTION).doc(trackId);
      const psInitialSnap = await psRef.get();
      if (psInitialSnap.exists && !psInitialSnap.data()?.isActive) {
        throw new NotFoundError(`Selected problem statement is currently inactive.`);
      }
    }

    // Step 4: Run Atomic Firestore Transaction with Locks
    const newRegRef = db.collection(REGISTRATIONS_COLLECTION).doc();
    const teamLockRef = db.collection(LOCKS_COLLECTION).doc(teamLockKey);
    const emailLockRefs = allEmails.map((em) => db.collection(LOCKS_COLLECTION).doc(`email_${em}`));
    const phoneLockRefs = allPhones.map((ph) => db.collection(LOCKS_COLLECTION).doc(`phone_${ph}`));

    await db.runTransaction(async (transaction) => {
      // 4.1 Read all locks
      const [teamLockSnap, ...otherLockSnaps] = await Promise.all([
        transaction.get(teamLockRef),
        ...emailLockRefs.map((ref) => transaction.get(ref)),
        ...phoneLockRefs.map((ref) => transaction.get(ref)),
      ]);

      if (teamLockSnap.exists) {
        throw new ConflictError(`Team name '${normalizedTeamName}' was just registered by another user.`);
      }

      const emailSnaps = otherLockSnaps.slice(0, emailLockRefs.length);
      for (let i = 0; i < emailSnaps.length; i++) {
        if (emailSnaps[i].exists) {
          throw new ConflictError(`Email '${allEmails[i]}' is already registered with an active team.`);
        }
      }

      const phoneSnaps = otherLockSnaps.slice(emailLockRefs.length);
      for (let i = 0; i < phoneSnaps.length; i++) {
        if (phoneSnaps[i].exists) {
          throw new ConflictError(`Phone number '${allPhones[i]}' is already registered with an active team.`);
        }
      }

      // 4.2 Track capacity check if track selected
      if (psRef) {
        const psDoc = await transaction.get(psRef);
        if (psDoc.exists) {
          const psData = psDoc.data() as ProblemStatementDoc;
          if (psData.isActive && (psData.currentTeamCount || 0) >= psData.maxTeams) {
            throw new ConflictError(
              `Problem statement '${psData.title}' has reached maximum capacity (${psData.maxTeams} teams).`
            );
          }
          transaction.update(psRef, {
            currentTeamCount: (psData.currentTeamCount || 0) + 1,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
      }

      const now = FieldValue.serverTimestamp();

      // 4.3 Write registration document
      transaction.set(newRegRef, {
        teamName: normalizedTeamName,
        teamSize: input.teamSize,
        leader: {
          name: input.leader.name,
          email: normalizedLeaderEmail,
          phone: input.leader.phone,
          college: input.leader.college,
        },
        members: input.members.map((m) => ({
          name: m.name,
          email: normalizeEmail(m.email),
          phone: m.phone,
          college: m.college,
        })),
        trackId: trackId || 'general',
        githubUrl: input.githubUrl || null,
        payment: {
          utrNumber: input.payment?.utrNumber || '',
          amount: input.teamSize * 200,
          paymentStatus: 'pending_verification',
          paidAt: now,
        },
        status: 'pending',
        checkedIn: false,
        adminNote: null,
        createdAt: now,
        updatedAt: now,
      });

      // 4.4 Set atomic lock documents
      transaction.set(teamLockRef, {
        type: 'team',
        teamName: normalizedTeamName,
        registrationId: newRegRef.id,
        createdAt: now,
      });

      for (let i = 0; i < emailLockRefs.length; i++) {
        transaction.set(emailLockRefs[i], {
          type: 'email',
          email: allEmails[i],
          teamName: normalizedTeamName,
          registrationId: newRegRef.id,
          createdAt: now,
        });
      }

      for (let i = 0; i < phoneLockRefs.length; i++) {
        transaction.set(phoneLockRefs[i], {
          type: 'phone',
          phone: allPhones[i],
          teamName: normalizedTeamName,
          registrationId: newRegRef.id,
          createdAt: now,
        });
      }
    });

    return {
      success: true,
      registrationId: newRegRef.id,
    };
  }

  /**
   * Public registration status lookup (PII-free).
   * Returns strictly: teamName, status, checkedIn, psTitle, psDomain.
   */
  static async getRegistrationStatus(email: string): Promise<{
    teamName: string;
    status: string;
    checkedIn: boolean;
    psTitle: string;
    psDomain: string;
  }> {
    const normalizedEmail = email.trim().toLowerCase();

    // Find registrations for this leader email (no composite index required)
    const snapshot = await db
      .collection(REGISTRATIONS_COLLECTION)
      .where('leader.email', '==', normalizedEmail)
      .get();

    if (snapshot.empty) {
      throw new NotFoundError(`No registration found for leader email '${normalizedEmail}'.`);
    }

    const docs = snapshot.docs.map((d) => d.data() as RegistrationDoc);
    // Sort descending by createdAt in memory
    docs.sort((a, b) => {
      const getMillis = (d: unknown) => {
        if (!d) return 0;
        if (typeof (d as { toMillis?: () => number }).toMillis === 'function') {
          return (d as { toMillis: () => number }).toMillis();
        }
        if (typeof (d as { seconds?: number }).seconds === 'number') {
          return (d as { seconds: number }).seconds * 1000;
        }
        return 0;
      };
      return getMillis(b.createdAt) - getMillis(a.createdAt);
    });

    const regDoc = docs[0];

    let psTitle = 'Assigned Track';
    let psDomain = 'General';

    try {
      const trackSnap = await db.collection(TRACKS_COLLECTION).doc(regDoc.trackId).get();
      if (trackSnap.exists) {
        const trackData = trackSnap.data() as ProblemStatementDoc;
        psTitle = trackData.title;
        psDomain = trackData.domain;
      }
    } catch {
      // Fallback
    }

    return {
      teamName: regDoc.teamName,
      status: regDoc.status,
      checkedIn: Boolean(regDoc.checkedIn),
      psTitle,
      psDomain,
    };
  }

  /**
   * Admin listing with cursor pagination, filtering, and search.
   */
  static async getRegistrationsForAdmin(query: {
    limit?: number;
    cursor?: string;
    status?: string;
    trackId?: string;
    college?: string;
    checkedIn?: string;
    search?: string;
  }): Promise<{
    registrations: RegistrationWithTrackDoc[];
    pagination: {
      nextCursor: string | null;
      hasMore: boolean;
      count: number;
    };
  }> {
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);

    let queryRef: FirebaseFirestore.Query = db.collection(REGISTRATIONS_COLLECTION);

    if (query.status) {
      queryRef = queryRef.where('status', '==', query.status);
    }
    if (query.trackId) {
      queryRef = queryRef.where('trackId', '==', query.trackId);
    }
    if (query.college) {
      queryRef = queryRef.where('leader.college', '==', query.college);
    }
    if (query.checkedIn !== undefined) {
      const isCheckedIn = query.checkedIn === 'true';
      queryRef = queryRef.where('checkedIn', '==', isCheckedIn);
    }

    // Order by createdAt descending for deterministic pagination
    queryRef = queryRef.orderBy('createdAt', 'desc');

    if (query.cursor) {
      const cursorDoc = await db.collection(REGISTRATIONS_COLLECTION).doc(query.cursor).get();
      if (cursorDoc.exists) {
        queryRef = queryRef.startAfter(cursorDoc);
      }
    }

    // Fetch tracks map for enriching trackTitle and trackDomain
    const allTracks = await db.collection(TRACKS_COLLECTION).get();
    const tracksMap = new Map<string, { title: string; domain: string }>();
    allTracks.forEach((t) => {
      const data = t.data() as ProblemStatementDoc;
      tracksMap.set(t.id, { title: data.title, domain: data.domain });
    });

    const snapshot = await queryRef.limit(limit + 1).get();

    let docs = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<RegistrationDoc, 'id'>;
      const track = tracksMap.get(data.trackId);
      return {
        ...data,
        id: doc.id,
        trackTitle: track?.title || 'Unknown Track',
        trackDomain: track?.domain || 'Unknown Domain',
      } as RegistrationWithTrackDoc;
    });

    // In-memory search fallback for teamName and leader.email
    if (query.search) {
      const searchLower = query.search.trim().toLowerCase();
      docs = docs.filter(
        (reg) =>
          reg.teamName.toLowerCase().includes(searchLower) ||
          reg.leader.email.toLowerCase().includes(searchLower)
      );
    }

    const hasMore = docs.length > limit;
    const resultDocs = hasMore ? docs.slice(0, limit) : docs;
    const nextCursor = hasMore && resultDocs.length > 0 ? resultDocs[resultDocs.length - 1].id : null;

    return {
      registrations: resultDocs,
      pagination: {
        nextCursor,
        hasMore,
        count: resultDocs.length,
      },
    };
  }

  /**
   * Updates registration fields (status, checkedIn, adminNote).
   * Inside a transaction:
   * - If status transitions from 'rejected' -> anything else (reinstatement):
   *   re-checks capacity on linked PS; increments PS counter if capacity allows (409 if full).
   * - If status transitions from non-rejected -> 'rejected':
   *   decrements PS counter.
   */
  static async updateRegistration(
    id: string,
    input: UpdateRegistrationInput
  ): Promise<RegistrationDoc> {
    const regRef = db.collection(REGISTRATIONS_COLLECTION).doc(id);

    return await db.runTransaction(async (transaction) => {
      const regDoc = await transaction.get(regRef);
      if (!regDoc.exists) {
        throw new NotFoundError(`Registration with ID '${id}' not found.`);
      }

      const currentReg = regDoc.data() as RegistrationDoc;
      const psRef = db.collection(TRACKS_COLLECTION).doc(currentReg.trackId);
      const psDoc = await transaction.get(psRef);

      const now = FieldValue.serverTimestamp();
      const updates: Record<string, unknown> = {
        updatedAt: now,
      };

      if (input.checkedIn !== undefined) updates.checkedIn = input.checkedIn;
      if (input.adminNote !== undefined) updates.adminNote = input.adminNote;

      if (input.status !== undefined && input.status !== currentReg.status) {
        updates.status = input.status;

        if (psDoc.exists) {
          const psData = psDoc.data() as ProblemStatementDoc;
          const currentCount = psData.currentTeamCount || 0;

          // Case A: Reinstating a rejected team -> Must verify capacity
          if (currentReg.status === 'rejected' && input.status !== 'rejected') {
            if (currentCount >= psData.maxTeams) {
              throw new ConflictError(
                `Cannot reinstate registration: problem statement '${psData.title}' is currently at full capacity (${psData.maxTeams}/${psData.maxTeams} teams).`
              );
            }
            transaction.update(psRef, {
              currentTeamCount: currentCount + 1,
              updatedAt: now,
            });
          }

          // Case B: Rejecting an active team -> Frees up the slot
          if (currentReg.status !== 'rejected' && input.status === 'rejected') {
            transaction.update(psRef, {
              currentTeamCount: Math.max(0, currentCount - 1),
              updatedAt: now,
            });
          }
        }
      }

      transaction.update(regRef, updates);

      return {
        ...currentReg,
        ...(updates as Partial<RegistrationDoc>),
        id,
      };
    });
  }

  /**
   * Superadmin only: Deletes a registration doc and decrements the linked PS team count.
   */
  static async deleteRegistration(id: string): Promise<void> {
    const regRef = db.collection(REGISTRATIONS_COLLECTION).doc(id);

    await db.runTransaction(async (transaction) => {
      const regDoc = await transaction.get(regRef);
      if (!regDoc.exists) {
        throw new NotFoundError(`Registration with ID '${id}' not found.`);
      }

      const regData = regDoc.data() as RegistrationDoc;

      // If registration was not rejected, decrement PS count
      if (regData.status !== 'rejected') {
        const psRef = db.collection(TRACKS_COLLECTION).doc(regData.trackId);
        const psDoc = await transaction.get(psRef);
        if (psDoc.exists) {
          const psData = psDoc.data() as ProblemStatementDoc;
          const currentCount = psData.currentTeamCount || 0;
          transaction.update(psRef, {
            currentTeamCount: Math.max(0, currentCount - 1),
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
      }

      transaction.delete(regRef);
    });
  }

  /**
   * Fetches all registrations matching filters for CSV export.
   */
  static async getAllRegistrationsForExport(query: {
    status?: string;
    trackId?: string;
    college?: string;
    checkedIn?: string;
  }): Promise<RegistrationWithTrackDoc[]> {
    let queryRef: FirebaseFirestore.Query = db.collection(REGISTRATIONS_COLLECTION);

    if (query.status) {
      queryRef = queryRef.where('status', '==', query.status);
    }
    if (query.trackId) {
      queryRef = queryRef.where('trackId', '==', query.trackId);
    }
    if (query.college) {
      queryRef = queryRef.where('leader.college', '==', query.college);
    }
    if (query.checkedIn !== undefined) {
      queryRef = queryRef.where('checkedIn', '==', query.checkedIn === 'true');
    }

    queryRef = queryRef.orderBy('createdAt', 'desc');

    const [regsSnap, tracksSnap] = await Promise.all([
      queryRef.get(),
      db.collection(TRACKS_COLLECTION).get(),
    ]);

    const tracksMap = new Map<string, { title: string; domain: string }>();
    tracksSnap.forEach((t) => {
      const data = t.data() as ProblemStatementDoc;
      tracksMap.set(t.id, { title: data.title, domain: data.domain });
    });

    return regsSnap.docs.map((doc) => {
      const data = doc.data() as Omit<RegistrationDoc, 'id'>;
      const track = tracksMap.get(data.trackId);
      return {
        ...data,
        id: doc.id,
        trackTitle: track?.title || 'Unknown Track',
        trackDomain: track?.domain || 'Unknown Domain',
      };
    });
  }
}
