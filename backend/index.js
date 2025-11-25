import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Leer datos de ciudades
const ciudadesPath = path.join(process.cwd(), 'data', 'ciudades.json');
let ciudadesData = [];

try {
  ciudadesData = JSON.parse(fs.readFileSync(ciudadesPath, 'utf8'));
  console.log('✅ Datos de ciudades cargados correctamente');
} catch (error) {
  console.log('❌ Error cargando ciudades:', error.message);
  // Datos de respaldo
  ciudadesData = [
    {
      id: 1,
      ciudad: "Madrid",
      temperatura: 18,
      descripcion: "Soleado"
    },
    {
      id: 2,
      ciudad: "Barcelona",
      temperatura: 20,
      descripcion: "Nublado"
    },
    {
      id: 3,
      ciudad: "Sevilla",
      temperatura: 25,
      descripcion: "Caluroso"
    }
  ];
}

// 🔥 RUTAS - Agrega estas rutas a tu archivo:

// 1. Ruta de salud (health check)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '✅ API del Clima funcionando correctamente',
    timestamp: new Date().toISOString(),
    totalCiudades: ciudadesData.length
  });
});

// 2. Obtener todas las ciudades
app.get('/ciudades', (req, res) => {
  res.json({
    success: true,
    data: ciudadesData,
    total: ciudadesData.length
  });
});

// 3. Obtener ciudad por ID
app.get('/ciudades/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ciudad = ciudadesData.find(c => c.id === id);
  
  if (!ciudad) {
    return res.status(404).json({
      success: false,
      message: '❌ Ciudad no encontrada'
    });
  }
  
  res.json({
    success: true,
    data: ciudad
  });
});

// 4. Obtener clima por nombre de ciudad
app.get('/clima/:ciudad', (req, res) => {
  const ciudadNombre = req.params.ciudad.toLowerCase();
  const ciudad = ciudadesData.find(c => c.ciudad.toLowerCase() === ciudadNombre);
  
  if (!ciudad) {
    return res.status(404).json({
      success: false,
      message: '❌ Ciudad no encontrada'
    });
  }
  
  res.json({
    success: true,
    data: {
      ciudad: ciudad.ciudad,
      temperatura: ciudad.temperatura,
      descripcion: ciudad.descripcion,
      mensaje: `El clima en ${ciudad.ciudad} es ${ciudad.descripcion.toLowerCase()} con ${ciudad.temperatura}°C`
    }
  });
});

// Ruta de prueba básica
app.get('/', (req, res) => {
  res.json({
    message: '🌤️ Bienvenido a la API del Clima',
    endpoints: {
      health: '/health',
      todasCiudades: '/ciudades',
      ciudadPorId: '/ciudades/:id',
      climaPorCiudad: '/clima/:ciudad'
    }
  });
});

// 🚀 INICIAR SERVIDOR - Esta parte va AL FINAL
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en: http://localhost:${PORT}`);
  console.log('📊 Endpoints disponibles:');
  console.log('   GET /health - Estado del servidor');
  console.log('   GET /ciudades - Todas las ciudades');
  console.log('   GET /ciudades/:id - Ciudad por ID');
  console.log('   GET /clima/:ciudad - Clima por nombre');
});
