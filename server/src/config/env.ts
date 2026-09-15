import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Locate .env in current directory or parent directory (workspace root)
const cwdEnv = path.resolve(process.cwd(), '.env');
const parentEnv = path.resolve(process.cwd(), '../.env');

if (fs.existsSync(cwdEnv)) {
  dotenv.config({ path: cwdEnv });
} else if (fs.existsSync(parentEnv)) {
  dotenv.config({ path: parentEnv });
} else {
  dotenv.config();
}

const envSchema = z.object({
  PORT: z.string().default('8080').transform((val) => parseInt(val, 10)),
  ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:3000')
    .transform((val) =>
      val
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    ),
  FIRESTORE_EMULATOR_HOST: z.string().optional(),
  FIREBASE_AUTH_EMULATOR_HOST: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
}).superRefine((data, ctx) => {
  // If not running against an emulator, Firebase service account credentials must be provided
  const isEmulator = Boolean(data.FIRESTORE_EMULATOR_HOST);
  if (!isEmulator) {
    if (!data.FIREBASE_PROJECT_ID) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['FIREBASE_PROJECT_ID'],
        message: 'FIREBASE_PROJECT_ID is required when not using Firestore emulator.',
      });
    }
    if (!data.FIREBASE_CLIENT_EMAIL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['FIREBASE_CLIENT_EMAIL'],
        message: 'FIREBASE_CLIENT_EMAIL is required when not using Firestore emulator.',
      });
    }
    if (!data.FIREBASE_PRIVATE_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['FIREBASE_PRIVATE_KEY'],
        message: 'FIREBASE_PRIVATE_KEY is required when not using Firestore emulator.',
      });
    }
  }
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment validation failed:');
    const fieldErrors = result.error.flatten().fieldErrors;
    for (const [field, errors] of Object.entries(fieldErrors)) {
      console.error(`  - ${field}: ${errors?.join(', ')}`);
    }
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();
export type Env = typeof env;
