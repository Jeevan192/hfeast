import { z } from 'zod';
import type { Timestamp } from 'firebase-admin/firestore';

export type AdminRole = 'superadmin' | 'organizer';

export interface AdminDoc {
  uid: string;
  email: string;
  role: AdminRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const createAdminSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address'),
  role: z.enum(['superadmin', 'organizer'], {
    errorMap: () => ({ message: "Role must be either 'superadmin' or 'organizer'" }),
  }),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
