import express from "express";
import { htmlSanitizer } from "../middlewares/HTMLsanitizer.js";
import { pollCreationValidation } from "../middlewares/pollSchemaValidation.js";
import {
  createPoll,
  allPolls,
  getPollChoices,
  getPollResult,
} from "../controllers/pollController.js";

const router = express.Router();

router.post("/poll", htmlSanitizer, pollCreationValidation, createPoll);
router.get("/poll", htmlSanitizer, allPolls);
router.get("/poll/:id/choice", htmlSanitizer, getPollChoices);
router.get("/poll/:id/result", htmlSanitizer, getPollResult);

export default router;
