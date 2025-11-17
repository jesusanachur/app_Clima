import { Router } from 'express';
import { obtenerClima } from '../controllers/clima.controller.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

const router = Router();

/**
 * @route   GET /api/clima/:ciudad
 * @desc    Obtener el clima de una ciudad
 * @access  Público
 */
router.get('/:ciudad', obtenerClima);

/**
 * @route   GET /api/clima/
 * @desc    Ruta de ejemplo sin parámetros
 * @access  Público
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido a la API del Clima',
    endpoints: [
      'GET /api/clima/:ciudad - Obtener el clima de una ciudad específica',
    ],
    ejemplo: 'GET /api/clima/Lima',
  });
});

export default router;