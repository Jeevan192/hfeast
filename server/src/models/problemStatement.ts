import { z } from 'zod';
import type { Timestamp } from 'firebase-admin/firestore';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ProblemStatementDoc {
  id: string;
  title: string;
  domain: string;
  description: string;
  difficulty: DifficultyLevel;
  maxTeams: number;
  currentTeamCount: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProblemStatementResponse extends Omit<ProblemStatementDoc, 'createdAt' | 'updatedAt'> {
  isFull: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export const createProblemStatementSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title cannot exceed 150 characters')
    .transform((v) => v.trim()),
  domain: z
    .string({ required_error: 'Domain is required' })
    .min(3, 'Domain must be at least 3 characters')
    .max(100, 'Domain cannot exceed 100 characters')
    .transform((v) => v.trim()),
  description: z
    .string({ required_error: 'Description is required' })
    .min(20, 'Description must be at least 20 characters')
    .transform((v) => v.trim()),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: "Difficulty must be 'beginner', 'intermediate', or 'advanced'" }),
  }),
  maxTeams: z
    .number({ required_error: 'maxTeams cap is required' })
    .int('maxTeams must be an integer')
    .min(1, 'maxTeams must be at least 1'),
  isActive: z.boolean().default(true),
});

export const updateProblemStatementSchema = z
  .object({
    title: z.string().min(3).max(150).transform((v) => v.trim()).optional(),
    domain: z.string().min(3).max(100).transform((v) => v.trim()).optional(),
    description: z.string().min(20).transform((v) => v.trim()).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    maxTeams: z.number().int().min(1).optional(),
    isActive: z.boolean().optional(),
    currentTeamCount: z.never({
      invalid_type_error: 'currentTeamCount cannot be updated manually; it is system-managed.',
    }).optional(),
  })
  .strict();

export type CreateProblemStatementInput = z.infer<typeof createProblemStatementSchema>;
export type UpdateProblemStatementInput = z.infer<typeof updateProblemStatementSchema>;
