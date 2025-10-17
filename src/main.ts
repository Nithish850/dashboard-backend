import express, { Application, Express } from "express";
import morgan from "morgan";

import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";
import { connectDatabase } from "./database/db";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes());

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
