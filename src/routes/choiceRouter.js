import express from "express";
import { htmlSanitizer } from "../middlewares/HTMLsanitizer.js";
import {
  choiceSchemaValidation,
  choiceSelectionValidation,
} from "../middlewares/choiceSchemaValidation.js";
import {
  createChoice,
  registerChoice,
} from "../controllers/choiceController.js";

const router = express.Router();

router.post("/choice", htmlSanitizer, choiceSchemaValidation, createChoice);
router.post(
  "/choice/:id/vote",
  htmlSanitizer,
  choiceSelectionValidation,
  registerChoice
);

export default router;
