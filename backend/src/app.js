import express from "express";
import cors from "cors";
import climaRoutes from "./routes/clima.routes.js";
//import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";
import errorHandler from './middleware/error.middleware.js';


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/clima", climaRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "clima-api"
  });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ 
    message: "API del Clima funcionando",
    endpoints: {
      clima: "/api/clima?city=NombreCiudad",
      health: "/health"
    }
  });
});

// Manejo de errores (DEBEN IR AL FINAL)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;