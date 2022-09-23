import express from "express";
import { htmlSanitizer } from "../middlewares/HTMLsanitizer.js";
import { choiceValidation } from "../middlewares/choiceSchemaValidation.js";
import {
  createChoice,
  registerChoice,
} from "../controllers/choiceController.js";

const router = express.Router();

router.post("/choice", htmlSanitizer, choiceValidation, createChoice);
router.post("/choice/:id/vote", htmlSanitizer, registerChoice);

export default router;
