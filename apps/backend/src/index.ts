import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

import authRouter from "./auth/auth.controller";

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello from CollabMD Backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
