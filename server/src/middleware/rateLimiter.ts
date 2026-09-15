import rateLimit from 'express-rate-limit';

/**
 * Public rate limiter: 5 requests per 1 minute window per IP address.
 * Keyed by client IP (requires app.set('trust proxy', 1) when behind reverse proxy).
 */
export const publicApiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true, // Return standard rate limit headers (RateLimit-*)
  legacyHeaders: false, // Disable X-RateLimit-* headers
  handler: (_req, res) => {
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please wait 1 minute before trying again.',
      },
    });
  },
});
