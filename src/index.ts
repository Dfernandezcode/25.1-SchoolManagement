// Code to connect to import app - raise server on localhost:3000
// connect to index.ts in server folder (hexagonal architecture)
// .env needs to have port 3000 declared

import { app } from "./server/index";

const PORT = 3000;
export const appInstance = app.listen(PORT, () => {
  console.log(`Server live using port ${PORT}`);
});
