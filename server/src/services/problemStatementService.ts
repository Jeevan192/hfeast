import { db, FieldValue } from '../config/firebase.js';
import {
  CreateProblemStatementInput,
  ProblemStatementDoc,
  ProblemStatementResponse,
  UpdateProblemStatementInput,
} from '../models/problemStatement.js';
import { ConflictError, NotFoundError } from '../utils/errors.js';

const COLLECTION = 'problemStatements';

export class ProblemStatementService {
  /**
   * Fetches all active problem statements sorted by domain, including computed isFull flag.
   */
  static async getActiveTracks(): Promise<ProblemStatementResponse[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('isActive', '==', true)
      .get();

    const tracks: ProblemStatementResponse[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as ProblemStatementDoc;
      tracks.push({
        id: doc.id,
        title: data.title,
        domain: data.domain,
        description: data.description,
        difficulty: data.difficulty,
        maxTeams: data.maxTeams,
        currentTeamCount: data.currentTeamCount || 0,
        isActive: data.isActive,
        isFull: (data.currentTeamCount || 0) >= data.maxTeams,
      });
    });

    // Sort by domain ascending, then title
    tracks.sort((a, b) => {
      const domainCmp = a.domain.localeCompare(b.domain);
      if (domainCmp !== 0) return domainCmp;
      return a.title.localeCompare(b.title);
    });

    return tracks;
  }

  /**
   * Fetches all problem statements (including inactive) for admin management.
   */
  static async getAllTracksForAdmin(): Promise<ProblemStatementResponse[]> {
    const snapshot = await db.collection(COLLECTION).get();
    const tracks: ProblemStatementResponse[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data() as ProblemStatementDoc;
      tracks.push({
        id: doc.id,
        title: data.title,
        domain: data.domain,
        description: data.description,
        difficulty: data.difficulty,
        maxTeams: data.maxTeams,
        currentTeamCount: data.currentTeamCount || 0,
        isActive: data.isActive,
        isFull: (data.currentTeamCount || 0) >= data.maxTeams,
      });
    });

    tracks.sort((a, b) => {
      const domainCmp = a.domain.localeCompare(b.domain);
      if (domainCmp !== 0) return domainCmp;
      return a.title.localeCompare(b.title);
    });

    return tracks;
  }

  /**
   * Creates a new problem statement document.
   */
  static async createTrack(input: CreateProblemStatementInput): Promise<ProblemStatementResponse> {
    const docRef = db.collection(COLLECTION).doc();
    const now = FieldValue.serverTimestamp();

    const newTrack = {
      title: input.title,
      domain: input.domain,
      description: input.description,
      difficulty: input.difficulty,
      maxTeams: input.maxTeams,
      currentTeamCount: 0,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await docRef.set(newTrack);

    return {
      id: docRef.id,
      title: newTrack.title,
      domain: newTrack.domain,
      description: newTrack.description,
      difficulty: newTrack.difficulty,
      maxTeams: newTrack.maxTeams,
      currentTeamCount: 0,
      isActive: newTrack.isActive,
      isFull: false,
    };
  }

  /**
   * Updates an existing problem statement. Strips currentTeamCount if provided.
   */
  static async updateTrack(
    id: string,
    input: UpdateProblemStatementInput
  ): Promise<ProblemStatementResponse> {
    const docRef = db.collection(COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new NotFoundError(`Problem statement with ID '${id}' not found.`);
    }

    const existing = docSnap.data() as ProblemStatementDoc;

    // Filter out undefined values and prevent updating currentTeamCount
    const updateData: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.domain !== undefined) updateData.domain = input.domain;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.difficulty !== undefined) updateData.difficulty = input.difficulty;
    if (input.maxTeams !== undefined) updateData.maxTeams = input.maxTeams;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    await docRef.update(updateData);

    const updatedMaxTeams = input.maxTeams !== undefined ? input.maxTeams : existing.maxTeams;
    const currentTeamCount = existing.currentTeamCount || 0;

    return {
      id,
      title: input.title || existing.title,
      domain: input.domain || existing.domain,
      description: input.description || existing.description,
      difficulty: input.difficulty || existing.difficulty,
      maxTeams: updatedMaxTeams,
      currentTeamCount,
      isActive: input.isActive !== undefined ? input.isActive : existing.isActive,
      isFull: currentTeamCount >= updatedMaxTeams,
    };
  }

  /**
   * Deletes a problem statement. Refuses (409 Conflict) if currentTeamCount > 0.
   */
  static async deleteTrack(id: string): Promise<void> {
    const docRef = db.collection(COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new NotFoundError(`Problem statement with ID '${id}' not found.`);
    }

    const data = docSnap.data() as ProblemStatementDoc;
    if ((data.currentTeamCount || 0) > 0) {
      throw new ConflictError(
        `Cannot delete problem statement '${data.title}' because ${data.currentTeamCount} team(s) are currently assigned to it. Deactivate it instead by setting isActive: false.`
      );
    }

    await docRef.delete();
  }
}
