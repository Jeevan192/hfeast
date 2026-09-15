import { z } from 'zod';
import type { Timestamp } from 'firebase-admin/firestore';
import { isValidIndianPhone } from '../utils/validators.js';

export type RegistrationStatus = 'pending' | 'confirmed' | 'waitlisted' | 'rejected';

export interface TeamMember {
  name: string;
  email: string;
  phone: string;
  college: string;
}

export interface TeamLeader extends TeamMember {}

export interface RegistrationDoc {
  id: string;
  teamName: string;
  teamSize: number;
  leader: TeamLeader;
  members: TeamMember[];
  trackId: string;
  githubUrl: string | null;
  status: RegistrationStatus;
  checkedIn: boolean;
  adminNote: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RegistrationWithTrackDoc extends RegistrationDoc {
  trackTitle?: string;
  trackDomain?: string;
}

const teamMemberSchema = z.object({
  name: z
    .string({ required_error: 'Member name is required' })
    .min(2, 'Member name must be at least 2 characters')
    .max(80, 'Member name cannot exceed 80 characters')
    .transform((v) => v.trim()),
  email: z
    .string({ required_error: 'Member email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address'),
  phone: z
    .string({ required_error: 'Member phone number is required' })
    .refine((v) => isValidIndianPhone(v), {
      message: 'Invalid Indian phone number format (e.g. +91 9876543210 or 10 digits starting with 6-9)',
    })
    .transform((v) => v.trim()),
  college: z
    .string({ required_error: 'Member college is required' })
    .min(2, 'College name must be at least 2 characters')
    .max(120, 'College name cannot exceed 120 characters')
    .transform((v) => v.trim()),
});

export const registerRequestSchema = z.object({
  teamName: z
    .string({ required_error: 'Team name is required' })
    .min(2, 'Team name must be at least 2 characters')
    .max(50, 'Team name cannot exceed 50 characters')
    .transform((v) => v.trim()),
  teamSize: z
    .union([z.number(), z.string()])
    .transform((v) => (typeof v === 'string' ? parseInt(v, 10) : v))
    .pipe(
      z
        .number({ required_error: 'Team size is required' })
        .int('Team size must be an integer')
        .min(1, 'Team size must be between 1 and 4')
        .max(4, 'Team size must be between 1 and 4')
    ),
  leader: teamMemberSchema,
  members: z.array(teamMemberSchema).default([]),
  trackId: z
    .string({ required_error: 'Track ID (problem statement ID) is required' })
    .min(1, 'Track ID is required')
    .transform((v) => v.trim()),
  githubUrl: z
    .string()
    .transform((v) => v.trim())
    .refine((v) => !v || /^https?:\/\/.+/.test(v), {
      message: 'Invalid GitHub URL format',
    })
    .nullable()
    .optional()
    .transform((v) => (!v ? null : v)),
});

export const updateRegistrationSchema = z
  .object({
    status: z.enum(['pending', 'confirmed', 'waitlisted', 'rejected']).optional(),
    checkedIn: z.boolean().optional(),
    adminNote: z.string().nullable().optional(),
  })
  .strict();

export type RegisterRequestInput = z.infer<typeof registerRequestSchema>;
export type UpdateRegistrationInput = z.infer<typeof updateRegistrationSchema>;
