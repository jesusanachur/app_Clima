import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const { combine, timestamp, printf, colorize, json } = winston.format;

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Formato personalizado para la consola
const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
  }`;
});

// Configuración de niveles de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Colores para la consola
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Filtro para incluir solo logs de error
const errorFilter = winston.format((info) => {
  return info.level === 'error' ? info : false;
});

// Filtro para excluir logs de error
const infoFilter = winston.format((info) => {
  return info.level !== 'error' ? info : false;
});

// Crear el logger
const logger = winston.createLogger({
  levels,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    json()
  ),
  transports: [
    // Todos los logs
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '../../logs/combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'debug',
    }),
    // Solo logs de error
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '../../logs/error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: combine(errorFilter(), timestamp(), json()),
    }),
  ],
});

// Si no estamos en producción, también mostramos los logs en la consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat
      ),
      level: 'debug',
    })
  );
}

/**
 * Crea un logger con un prefijo personalizado
 * @param {string} prefix - Prefijo para los mensajes de log
 * @returns {Object} Logger personalizado
 */
export const createLogger = (prefix) => ({
  error: (message, meta) => logger.error(`[${prefix}] ${message}`, meta),
  warn: (message, meta) => logger.warn(`[${prefix}] ${message}`, meta),
  info: (message, meta) => logger.info(`[${prefix}] ${message}`, meta),
  http: (message, meta) => logger.http(`[${prefix}] ${message}`, meta),
  debug: (message, meta) => logger.debug(`[${prefix}] ${message}`, meta),
});

export default logger;
