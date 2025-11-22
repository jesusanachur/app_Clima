import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta básica
app.get('/', (req, res) => {
  res.json({ 
    message: '¡Servidor de Clima funcionando! 🎉',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Ruta de ejemplo para clima
app.get('/clima', (req, res) => {
  res.json({
    ciudad: 'Ejemplo',
    temperatura: '25°C',
    descripcion: 'Soleado',
    humedad: '65%'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en: http://localhost:${PORT}`);
});