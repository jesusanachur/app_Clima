require('dotenv').config();

const express = require('express');
const app = express();

// Accede a las variables de entorno
const port = process.env.PORT;
const openWeatherKey = process.env.OPENWEATHER_KEY;

// Resto del código de tu aplicación
// ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});