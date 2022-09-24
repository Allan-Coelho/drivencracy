import express from "express";
import dotenv from "dotenv";
import pollRouter from "./src/routes/pollRouter.js";
import choiceRouter from "./src/routes/choiceRouter.js";
import cors from "cors";

const server = express();

dotenv.config();

server
  .use(cors())
  .use(express.json())
  .use(pollRouter)
  .use(choiceRouter)
  .listen(process.env.PORT);
