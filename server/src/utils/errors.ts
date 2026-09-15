export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: unknown) {
    super(400, 'BAD_REQUEST', message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Missing or malformed authorization token') {
    super(401, 'UNAUTHENTICATED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Not authorized as an admin') {
    super(403, 'FORBIDDEN', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, 'NOT_FOUND', message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict occurred', details?: unknown) {
    super(409, 'CONFLICT', message, details);
  }
}
