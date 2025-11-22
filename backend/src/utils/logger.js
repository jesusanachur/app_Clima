export const createLogger = (context) => {
  return {
    info: (message, meta = {}) => {
      console.log(`[${context}] ${message}`, meta);
    },
    error: (message, meta = {}) => {
      console.error(`[${context}] ERROR: ${message}`, meta);
    },
    warn: (message, meta = {}) => {
      console.warn(`[${context}] WARN: ${message}`, meta);
    }
  };
};