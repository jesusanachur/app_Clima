import express from "express";
import { obtenerClima } from "../controllers/clima.controller.js";

const router = express.Router();

router.get("/", obtenerClima);
router.get("/:city", obtenerClima);

export default router;

