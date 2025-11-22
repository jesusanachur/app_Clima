import axios from 'axios';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('clima:service');

export const obtenerClimaPorCiudad = async (ciudad) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key no configurada. Configura OPENWEATHER_API_KEY en .env');
    }

    logger.info(`Buscando clima para: ${ciudad}`);

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: ciudad,
          appid: apiKey,
          units: 'metric',
          lang: 'es'
        },
        timeout: 10000
      }
    );

    const datos = response.data;

    return {
      ciudad: datos.name,
      pais: datos.sys.country,
      temperatura: Math.round(datos.main.temp),
      sensacion_termica: Math.round(datos.main.feels_like),
      humedad: datos.main.humidity,
      descripcion: datos.weather[0].description,
      presion: datos.main.pressure,
      viento: {
        velocidad: datos.wind.speed,
        direccion: datos.wind.deg
      },
      coordenadas: {
        lat: datos.coord.lat,
        lon: datos.coord.lon
      }
    };

  } catch (error) {
    logger.error(`Error al obtener clima para ${ciudad}:`, error.message);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('API key inválida');
        case 404:
          throw new Error('Ciudad no encontrada');
        case 429:
          throw new Error('Límite de solicitudes excedido');
        default:
          throw new Error(`Error del servicio: ${error.response.data.message}`);
      }
    } else if (error.request) {
      throw new Error('No se pudo conectar al servicio del clima');
    } else {
      throw new Error(error.message);
    }
  }
};