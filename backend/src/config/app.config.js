import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createLogger } from '../utils/logger.js';
import climaRoutes from '../routes/clima.routes.js';
import { errorHandler, notFoundHandler } from '../middlewares/error.middleware.js';

const logger = createLogger('app:config');

export const createApp = () => {
  const app = express();

  // Configuración básica de seguridad con Helmet
  app.use(helmet());

  // Configuración de CORS
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));

  // Parseo del cuerpo de las peticiones
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutos
    max: process.env.RATE_LIMIT_MAX || 100, // límite de peticiones por ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas peticiones, por favor intente más tarde.' },
  });

  // Aplicar rate limiting a todas las rutas
  app.use(limiter);

  // Logging de peticiones
  app.use((req, res, next) => {
    const start = Date.now();
    const { method, originalUrl, ip } = req;
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${method} ${originalUrl} - ${res.statusCode} - ${duration}ms - ${ip}`);
    });
    
    next();
  });

  // Rutas de la API
  app.use('/api/clima', climaRoutes);

  // Ruta de verificación de estado
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Manejador para rutas no encontradas
  app.use(notFoundHandler);

  // Manejador global de errores
  app.use(errorHandler);

  return app;
};

export default createApp;
