import { obtenerClimaPorCiudad } from "../services/clima.service.js";

export const obtenerClima = async (req, res) => {
  try {
    const ciudad = req.params.city || req.query.city;

    if (!ciudad) {
      return res.status(400).json({
        error: "Debes enviar una ciudad. Ejemplo: /api/clima?city=Bogota",
      });
    }

    const datos = await obtenerClimaPorCiudad(ciudad);
    res.json(datos);

  } catch (error) {
    res.status(500).json({
      error: "Error al obtener el clima",
      detalle: error.message,
    });
  }
};
