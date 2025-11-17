import 'dotenv/config';
import app from './app.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('server');
const port = process.env.PORT || 4000;

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // En producción, podrías querer reiniciar el proceso
  // process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = app.listen(port, () => {
  logger.info(`Servidor corriendo en http://localhost:${port}`);
  logger.info(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de señales de terminación
const shutdown = () => {
  logger.info('Recibida señal de apagado. Cerrando servidor...');
  server.close(() => {
    logger.info('Servidor cerrado correctamente');
    process.exit(0);
  });

  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    logger.error('Forzando cierre del servidor...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
