import express from "express";
import dotenv from "dotenv";
import pollRouter from "./routes/pollRouter.js";
import choiceRouter from "./routes/choiceRouter.js";
import cors from "cors";

const server = express();

dotenv.config();

server
  .use(cors())
  .use(express.json())
  .use(pollRouter)
  .use(choiceRouter)
  .listen(process.env.PORT);
