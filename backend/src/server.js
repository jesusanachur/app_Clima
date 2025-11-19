import axios from "axios";

export const obtenerClimaPorCiudad = async (ciudad) => {
  const apiKey = process.env.OPENWEATHER_KEY; // http://localhost:3000/api/clima?city=Bogota;

  const url = `http://localhost:3000/api/clima?city=${ciudad}`;

  const { data } = await axios.get(url);

  return {
    ciudad: data.name,
    pais: data.sys.country,
    temperatura: data.main.temp,
    descripcion: data.weather[0].description,
    humedad: data.main.humidity,
    viento: data.wind.speed,
  };
};
