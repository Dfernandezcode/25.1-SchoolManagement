import express from "express";
import cors from "cors";
import { configureRoutes } from "../routes/index"; // gnerally a good idea to add "index"

// Configuración del server
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    // change to whatever address is necessary. (i.e google.com if API was there)
    origin: "http://localhost:3000",
  })
);

configureRoutes(app);
