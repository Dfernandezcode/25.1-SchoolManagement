// Importamos librerías
import { Mongoose, connect } from "mongoose";
// Cargamos variables de entorno
import dotenv from "dotenv";
dotenv.config();

const DB_CONNECTION: string = process.env.DB_URL as string;
const DB_NAME: string = process.env.DB_NAME as string;

// Configuración de la conexión a Mongo
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  dbName: DB_NAME,
};

export const mongoConnect = async (): Promise<Mongoose | null> => {
  try {
    const database: Mongoose = await connect(DB_CONNECTION, config);
    const { name, host } = database.connection;
    console.log(`Connected to database: ${name} on host server: ${host}`);

    return database;
  } catch (error) {
    console.error(error);
    console.log("Connection error, retrying in 5secs...");
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(mongoConnect, 5000);

    return null;
  }
};
