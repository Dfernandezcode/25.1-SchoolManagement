import express, { type NextFunction, type Response, type Request, type ErrorRequestHandler } from "express";

export const configureRoutes = (app: any): any => {
  // Routes
  const router = express.Router();
  router.get("/", (req: Request, res: Response) => {
    res.send(`
      <h3>Our API Homepage.</h3>
    `);
  });
  router.get("*", (req: Request, res: Response) => {
    // shows error message if page other than stated is requested.
    res.status(404).send("Sorry :( 404 - Page not found.");
  });

  // Routes to be used:
  app.use("/public", express.static("public"));
  app.use("/", router); // "router added as generic router"

  // Error-handling Middleware
  app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log("*** START OF ERROR ***");
    console.log(`REQUEST FAILED: ${req.method} of url: ${req.originalUrl}`);
    console.log(err);
    console.log("*** END OF ERROR ***");

    // TIP: Rremove "type" requirement from a variable
    const errorAsAny: any = err as unknown as any;

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (errorAsAny.errmsg && errorAsAny.errmsg?.indexOf("duplicate key") !== -1) {
      res.status(400).json({ error: errorAsAny.errmsg });
    } else if (errorAsAny?.code === "ER_NO_DEFAULT_FOR_FIELD") {
      res.status(400).json({ error: errorAsAny?.sqlMessage });
    } else {
      res.status(500).json(err);
    }
  });

  return app;
};

/* SWAGGER AND MONGO MIDDLEWARE (to be added if needed)

import swaggerUiExpress from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerOptions } from "../swagger-options";
import { mongoConnect } from "../domain/repositories/mongo-repository";

    /  Swagger
  const specs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

    / Middleware de conexión a Mongo
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    await mongoConnect();
    next();
  });
*/
