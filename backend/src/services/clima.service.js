import axios from 'axios';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('clima:service');

/**
 * Obtiene el clima de una ciudad específica
 * @param {string} ciudad - Nombre de la ciudad
 * @returns {Promise<Object>} Datos del clima
 * @throws {Error} Si hay un error al obtener los datos del clima
 */
export const obtenerClimaPorCiudad = async (ciudad) => {
  try {
    if (!ciudad || typeof ciudad !== 'string' || ciudad.trim() === '') {
      throw new Error('El nombre de la ciudad es requerido');
    }

    const apiKey = process.env.OPENWEATHER_KEY;
    if (!apiKey) {
      throw new Error('API key de OpenWeather no configurada');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`;
    
    logger.info(`Solicitando clima para: ${ciudad}`);
    const response = await axios.get(url);
    
    if (response.status !== 200) {
      throw new Error(`Error al obtener datos del clima: ${response.statusText}`);
    }

    const data = response.data;
    
    // Formatear la respuesta
    return {
      ciudad: data.name,
      pais: data.sys.country,
      temperatura: data.main.temp,
      sensacionTermica: data.main.feels_like,
      temperaturaMin: data.main.temp_min,
      temperaturaMax: data.main.temp_max,
      humedad: data.main.humidity,
      presion: data.main.pressure,
      viento: {
        velocidad: data.wind.speed,
        direccion: data.wind.deg,
        rafaga: data.wind.gust || null,
      },
      nubosidad: data.clouds.all,
      visibilidad: data.visibility,
      clima: {
        principal: data.weather[0].main,
        descripcion: data.weather[0].description,
        icono: data.weather[0].icon,
      },
      amanecer: new Date(data.sys.sunrise * 1000).toISOString(),
      atardecer: new Date(data.sys.sunset * 1000).toISOString(),
      zonaHoraria: data.timezone,
      fechaConsulta: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`Error al obtener clima para ${ciudad}:`, error);
    
    if (error.response) {
      // La petición fue hecha y el servidor respondió con un código de estado
      // que no está en el rango 2xx
      if (error.response.status === 404) {
        throw new Error('Ciudad no encontrada');
      } else if (error.response.status === 401) {
        throw new Error('API key inválida o no autorizada');
      } else if (error.response.status === 429) {
        throw new Error('Límite de peticiones excedido');
      } else {
        throw new Error(`Error en la API del clima: ${error.response.data.message || error.message}`);
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor del clima');
    } else {
      // Algo pasó en la configuración de la petición
      throw new Error(`Error al configurar la petición: ${error.message}`);
    }
  }
};
