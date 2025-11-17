import { obtenerClimaPorCiudad } from '../services/clima.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

/**
 * @desc    Obtener el clima de una ciudad
 * @route   GET /api/clima/:ciudad
 * @access  Público
 */
export const obtenerClima = asyncHandler(async (req, res) => {
  const { ciudad } = req.params;
  
  if (!ciudad || typeof ciudad !== 'string' || ciudad.trim() === '') {
    const error = new Error('El nombre de la ciudad es requerido');
    error.statusCode = 400;
    throw error;
  }

  try {
    const datosClima = await obtenerClimaPorCiudad(ciudad);
    res.status(200).json({
      success: true,
      data: datosClima,
    });
  } catch (error) {
    // El error será manejado por el middleware de errores
    throw error;
  }
});
