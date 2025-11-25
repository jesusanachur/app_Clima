import fs from 'fs';
import path from 'path';

// Leer el archivo JSON
const ciudadesPath = path.join(process.cwd(), 'data', 'ciudades.json');
const ciudadesData = JSON.parse(fs.readFileSync(ciudadesPath, 'utf8'));

// Ruta para obtener las ciudades
app.get('/ciudades', (req, res) => {
  res.json(ciudadesData);
});