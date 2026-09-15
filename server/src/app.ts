import cors from 'cors';
import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import adminAdminsRoute from './routes/admin/admins.js';
import adminProblemStatementsRoute from './routes/admin/problemStatements.js';
import adminRegistrationsRoute from './routes/admin/registrations.js';
import adminStatsRoute from './routes/admin/stats.js';
import healthRoute from './routes/health.js';
import registerRoute from './routes/register.js';
import tracksRoute from './routes/tracks.js';
import { NotFoundError } from './utils/errors.js';

export function createApp(): Express {
  const app = express();

  // Trust first proxy hop (essential for Cloud Run, Render, and rate limiting behind reverse proxies)
  app.set('trust proxy', 1);

  // Security HTTP headers
  app.use(helmet());

  // Strict CORS configuration: Whitelist only, never '*'
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server or same-origin)
        if (!origin) {
          return callback(null, true);
        }

        if (env.ALLOWED_ORIGINS.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`Origin '${origin}' not allowed by CORS policy.`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Parse JSON bodies capped at 100kb
  app.use(express.json({ limit: '100kb' }));

  // Liveness check route
  app.use('/', healthRoute);

  // Public API routes
  app.use('/api', tracksRoute);
  app.use('/api', registerRoute);

  // Protected Admin API routes
  app.use('/api/admin/registrations', adminRegistrationsRoute);
  app.use('/api/admin/problem-statements', adminProblemStatementsRoute);
  app.use('/api/admin/stats', adminStatsRoute);
  app.use('/api/admin/admins', adminAdminsRoute);

  // Catch-all 404 handler
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError(`Route '${req.method} ${req.originalUrl}' does not exist.`));
  });

  // Centralized error handling middleware
  app.use(errorHandler);

  return app;
}
