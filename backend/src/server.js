
import 'dotenv/config';
import app from './src/app.js';

const port = process.env.PORT || 4000;

app.listen(port, '0.0.0.0', () => {
  console.log(` [clima-api] Servidor ejecutándose en http://localhost:${port}`);
  console.log(` Health check disponible en: http://localhost:${port}/health`);
});