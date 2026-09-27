import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const fieldErrors = err.flatten().fieldErrors;
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed for request parameters or body.',
        details: fieldErrors,
      },
    });
    return;
  }

  // Handle custom AppErrors (BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  // Handle Firebase Auth errors
  if ('code' in err && typeof (err as { code: unknown }).code === 'string') {
    const fbCode = (err as { code: string }).code;
    if (fbCode.startsWith('auth/')) {
      res.status(401).json({
        error: {
          code: 'UNAUTHENTICATED',
          message: err.message || 'Firebase authentication failed.',
        },
      });
      return;
    }
  }

  // Handle body-parser JSON parse error
  if ('type' in err && (err as { type: string }).type === 'entity.parse.failed') {
    res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload in request body.',
      },
    });
    return;
  }

  // Handle Firestore API not enabled / database not created / permission error
  const errMsg = err.message || '';
  const errDetails = (err as { details?: string }).details || '';
  const errCode = (err as { code?: number | string }).code;

  if (
    errCode === 5 ||
    errMsg.includes('5 NOT_FOUND') ||
    errMsg.includes('NOT_FOUND') && errMsg.includes('database')
  ) {
    console.error('[Firestore Database Not Found]', err);
    res.status(503).json({
      error: {
        code: 'FIRESTORE_DATABASE_NOT_CREATED',
        message: 'The Firestore database does not exist yet in project hfest-da19c. Please visit Firebase Console (https://console.firebase.google.com/project/hfest-da19c/firestore) and click "Create Database" to provision the database.',
      },
    });
    return;
  }

  if (
    errMsg.includes('Cloud Firestore API') ||
    errDetails.includes('Cloud Firestore API') ||
    errMsg.includes('PERMISSION_DENIED') ||
    errCode === 7
  ) {
    console.error('[Firestore Service Disabled]', err);
    res.status(503).json({
      error: {
        code: 'FIRESTORE_NOT_INITIALIZED',
        message: 'Cloud Firestore is not yet activated for this project. Please open Firebase Console (Build -> Firestore Database) and click "Create Database" (in test or production mode), or enable it via https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=hfest-da19c',
      },
    });
    return;
  }

  // Fallback 500 Internal Server Error
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected internal server error occurred.',
      details: (err as any).details || (err as any).code || undefined,
    },
  });
}
