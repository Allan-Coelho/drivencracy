import express from "express";
import { htmlSanitizer } from "../middlewares/HTMLsanitizer.js";
import {
  createPoll,
  allPolls,
  getPollChoices,
  getPollResult,
} from "../controllers/pollController.js";

const router = express.Router();

router.post("/poll", htmlSanitizer, createPoll);
router.get("/poll", htmlSanitizer, allPolls);
router.get("/poll/:id/choice", htmlSanitizer, getPollChoices);
router.get("/poll/:id/result", htmlSanitizer, getPollResult);

export default router;
