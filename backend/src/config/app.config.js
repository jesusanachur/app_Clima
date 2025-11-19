import express from 'express';
import cors from 'cors';
import climaRoutes from '../routes/clima.routes.js';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Rutas
  app.use('/api/clima', climaRoutes);

  // Endpoint de prueba
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
};

export default createApp;
