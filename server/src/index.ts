import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 CBIT Hacktoberfest '26 Backend running on port ${env.PORT}`);
  console.log(`📡 Environment: ${env.NODE_ENV}`);
  console.log(`🔒 Allowed Origins: ${env.ALLOWED_ORIGINS.join(', ')}`);
});

// Graceful shutdown handling for container platforms (Cloud Run / Render)
const handleShutdown = (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Initiating graceful shutdown...`);

  // Stop accepting new connections
  server.close((err) => {
    if (err) {
      console.error('Error during HTTP server shutdown:', err);
      process.exit(1);
    }
    console.log('✅ HTTP server closed. Process exiting cleanly.');
    process.exit(0);
  });

  // Force shutdown if cleanup takes longer than 10 seconds
  setTimeout(() => {
    console.error('⚠️ Forcefully terminating after 10s shutdown timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
