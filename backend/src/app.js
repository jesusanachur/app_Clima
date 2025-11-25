import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a SQLite (super simple)
let db;
async function conectarDB() {
  db = await open({
    filename: './clima.db',
    driver: sqlite3.Database
  });
  
  // Crear tabla simple
  await db.exec(`
    CREATE TABLE IF NOT EXISTS clima (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ciudad TEXT,
      temperatura REAL,
      descripcion TEXT
    )
  `);
  
  console.log('✅ BD SQLite lista');
}
conectarDB();

// 1. Página principal
app.get('/', (req, res) => {
  res.json({ mensaje: ' API Clima Simple', estado: 'funcionando' });
});

// 2. Ver todas las ciudades
app.get('/ciudades', async (req, res) => {
  try {
    const ciudades = await db.all('SELECT * FROM clima');
    res.json(ciudades);
  } catch (error) {
    res.json({ error: error.message });
  }
});

// 3. Buscar clima de una ciudad
app.get('/clima/:ciudad', async (req, res) => {
  try {
    const ciudad = await db.get(
      'SELECT * FROM clima WHERE ciudad = ?', 
      [req.params.ciudad]
    );
    
    if (ciudad) {
      res.json(ciudad);
    } else {
      res.json({ error: 'Ciudad no encontrada' });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

// 4. Agregar nueva ciudad
app.post('/clima', async (req, res) => {
  try {
    const { ciudad, temperatura, descripcion } = req.body;
    
    await db.run(
      'INSERT INTO clima (ciudad, temperatura, descripcion) VALUES (?, ?, ?)',
      [ciudad, temperatura, descripcion]
    );
    
    res.json({ mensaje: 'Ciudad agregada', ciudad });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// 5. Datos de ejemplo
app.get('/ejemplo', async (req, res) => {
  try {
    // Insertar datos de ejemplo
    await db.run(`INSERT OR IGNORE INTO clima (ciudad, temperatura, descripcion) VALUES 
      ('Madrid', 18, 'Soleado'),
      ('Barcelona', 20, 'Nublado'),
      ('Sevilla', 25, 'Caluroso')
    `);
    
    res.json({ mensaje: 'Datos de ejemplo agregados' });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// 🚀 INICIAR SERVIDOR - AGREGA ESTO AL FINAL
const PORT = 4000;

app.listen(PORT, () => {
  console.log('🌤️ Servidor de Clima iniciado');
  console.log(`📍 http://localhost:${PORT}`);
});

export default app;