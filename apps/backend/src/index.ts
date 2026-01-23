import express from "express";
import cors from "cors";
import prisma from "./prisma/client";
import { loadEnv, requireEnvVars } from "./env";

loadEnv();
requireEnvVars(["DATABASE_URL", "JWT_SECRET", "OPENAI_API_KEY"]);

const app = express();
const PORT = process.env.PORT || 3001;

import authRouter from "./auth/auth.controller";
import { documentRouter } from "./documents/document.controller";

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/documents", documentRouter);

app.get("/", (req, res) => {
  res.send("Hello from CollabMD Backend!");
});

async function bootstrap() {
  try {
    await prisma.$connect();
    // eslint-disable-next-line no-console
    console.log("Connected to database");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to connect to database.");
    // eslint-disable-next-line no-console
    console.error(
      "Check that your DATABASE_URL is correct and your Postgres server is reachable."
    );
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

bootstrap();
