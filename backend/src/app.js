import express from "express";
import cors from "cors";
import climaRoutes from "./routes/clima.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/clima", climaRoutes);

export default app;
