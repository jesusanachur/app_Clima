// index.js
console.log("Servidor de clima iniciado...");

// Aquí va tu código principal
const mysql = require('mysql');

// Ejemplo de conexión (configura con tus datos)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'clima_db'
});

connection.connect((err) => {
  if (err) {
    console.log('Error conectando a la BD:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});